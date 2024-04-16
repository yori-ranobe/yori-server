import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {
  ChapterDTO,
  MangaExtensionDTO,
  TagDTO,
  ChapterImagesDTO,
  ImagesTypeEnum,
} from '../dto/extensions.dto';
import {
  GetMangaDexMangaListInputType,
  GetMangaDexMangaByIdInputType,
  SearchMangaDexMangaInputType,
  GetMangaDexChapterImagesInputType,
} from './dto/manga-dex.dto';
import { EXTENSIONS } from '../../config';

@Injectable()
export class MangaDexService {
  constructor(private httpService: HttpService) {}

  private setUserAgentHeader() {
    this.httpService.axiosRef.defaults.headers['User-Agent'] =
      EXTENSIONS.mangaDex.userAgent;
  }

  private makeRequest(endpoint: string, options: any): Observable<any> {
    this.setUserAgentHeader();
    const apiUrl = `${EXTENSIONS.mangaDex.apiUrl}${endpoint}`;
    return this.httpService.get(apiUrl, { params: options });
  }

  private extractCoverFileName(item: any): string {
    const coverRelationship = item.relationships.find(
      (rel) => rel.type === 'cover_art',
    );

    if (!coverRelationship || !coverRelationship.attributes.fileName) {
      throw new NotFoundException('Cover art not found or missing file name');
    }

    return coverRelationship.attributes.fileName;
  }

  private mapMangaItemToDTO(item: any): MangaExtensionDTO {
    const coverFileName = this.extractCoverFileName(item);
    const cover = `${EXTENSIONS.mangaDex.filesApi}/covers/${item.id}/${coverFileName}`;
    const tagsDTO = item.attributes.tags.map((tag) => this.mapTagToDTO(tag));

    return {
      id: item.id,
      type: item.type,
      title: item.attributes.title?.en || item.attributes.title['ja-ro'] || '',
      description:
        item.attributes.description?.en ||
        item.attributes.description['ja-ro'] ||
        '',
      year: item.attributes.year,
      cover: cover,
      tags: tagsDTO,
    };
  }

  private mapChapterItemToDTO(chapterData: any): ChapterDTO {
    return {
      id: chapterData.id,
      volume: chapterData.attributes.volume ?? null,
      chapter: chapterData.attributes.chapter,
      publishAt: new Date(chapterData.attributes.publishAt),
    };
  }

  private mapTagToDTO(tag: any): TagDTO {
    return {
      id: tag.id,
      type: tag.type,
      name: tag.attributes.name.en || '',
      group: tag.attributes.group || '',
    };
  }

  // *** GET MANGA LIST ***

  fetchMangaList(
    options: GetMangaDexMangaListInputType,
  ): Observable<MangaExtensionDTO[]> {
    return this.makeRequest('/manga?includes[]=cover_art', options).pipe(
      map((response) => {
        return response.data.data.map((item) => this.mapMangaItemToDTO(item));
      }),
    );
  }

  // *** GET MANGA BY ID ***

  getMangaById(
    options: GetMangaDexMangaByIdInputType,
  ): Observable<{ manga: MangaExtensionDTO; chapters: ChapterDTO[] }> {
    return this.getMangaData(options.mangaId).pipe(
      map(({ mangaResponse, chaptersResponse }) => {
        const manga = this.mapMangaItemToDTO(mangaResponse.data.data);
        const chapters = this.mapChaptersResponseToDTO(
          chaptersResponse.data.data,
        );
        return { manga, chapters };
      }),
    );
  }

  private getMangaData(mangaId: string): Observable<any> {
    const mangaRequest$ = this.makeRequest(
      `/manga/${mangaId}?includes[]=cover_art`,
      {},
    );
    const chaptersRequest$ = this.makeRequest(`/manga/${mangaId}/feed`, {});
    return forkJoin({
      mangaResponse: mangaRequest$,
      chaptersResponse: chaptersRequest$,
    });
  }

  private mapChaptersResponseToDTO(chaptersData: any[]): ChapterDTO[] {
    const chaptersWithEnLanguage = chaptersData.filter(
      (chapterData: any) => chapterData.attributes.translatedLanguage === 'en',
    );
    return chaptersWithEnLanguage.map((chapterData: any) =>
      this.mapChapterItemToDTO(chapterData),
    );
  }

  // *** SEARCH MANGA ***

  searchManga(
    options: SearchMangaDexMangaInputType,
  ): Observable<MangaExtensionDTO[]> {
    return this.getTagData().pipe(
      switchMap((tagIDs: string[]) => {
        const { limit, offset, title, year, includedTags, excludedTags } =
          options;
        const includedTagIDs = this.getTagIDs(tagIDs, includedTags);
        const excludedTagIDs = this.getTagIDs(tagIDs, excludedTags);
        return this.searchMangaData(
          limit,
          offset,
          title,
          year,
          includedTagIDs,
          excludedTagIDs,
        );
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  private searchMangaData(
    limit: number,
    offset: number,
    title?: string,
    year?: number,
    includedTags?: string[],
    excludedTags?: string[],
  ): Observable<MangaExtensionDTO[]> {
    const queryParams: any = { limit, offset, includes: ['cover_art'] };
    if (title) queryParams.title = title;
    if (year) queryParams.year = year;
    if (includedTags) queryParams.includedTags = includedTags;
    if (excludedTags) queryParams.excludedTags = excludedTags;

    return this.makeRequest('/manga', queryParams).pipe(
      map((response) => response.data.data.map(this.mapMangaItemToDTO, this)),
      catchError((error) => {
        throw error;
      }),
    );
  }

  private getTagData(): Observable<string[]> {
    return this.makeRequest('/manga/tag', {}).pipe(
      map((response: any) => response.data.data),
      catchError((error) => {
        throw error;
      }),
    );
  }

  private getTagIDs(tagIDs: any[], tagNames: string[] = []): string[] {
    return tagIDs
      .filter((tagID) => tagNames.includes(tagID.attributes.name.en))
      .map((tag) => tag.id);
  }

  // *** GET CHAPTER IMAGES ***

  getChapterImages(
    options: GetMangaDexChapterImagesInputType,
  ): Observable<ChapterImagesDTO> {
    const { chapterId, imagesType } = options;

    return this.makeRequest(`/at-home/server/${chapterId}`, {}).pipe(
      map((response) => {
        const baseUrl = response.data.baseUrl;
        let images: string[];

        if (imagesType === ImagesTypeEnum.COMPRESSED) {
          images = response.data.chapter.dataSaver.map(
            (image: string) =>
              `${baseUrl}/data-saver/${response.data.chapter.hash}/${image}`,
          );
        } else {
          images = response.data.chapter.data.map(
            (image: string) =>
              `${baseUrl}/data/${response.data.chapter.hash}/${image}`,
          );
        }

        return { images };
      }),
    );
  }
}
