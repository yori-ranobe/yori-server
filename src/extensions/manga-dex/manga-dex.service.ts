import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChapterDTO, MangaExtensionDTO } from '../dto/extensions.dto';
import {
  GetMangaDexMangaListInputType,
  GetMangaDexMangaByIdInputType,
  SearchMangaDexMangaInputType,
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

  mapMangaItemToDTO(item: any): MangaExtensionDTO {
    const coverFileName = this.extractCoverFileName(item);
    const cover = `${EXTENSIONS.mangaDex.filesApi}/covers/${item.id}/${coverFileName}`;

    return {
      id: item.id,
      type: item.type,
      title: item.attributes.title?.en || '',
      description: item.attributes.description?.en || '',
      year: item.attributes.year,
      cover: cover,
    };
  }

  mapChapterItemToDTO(chapterData: any): ChapterDTO {
    return {
      id: chapterData.id,
      volume: chapterData.attributes.volume ?? null,
      chapter: chapterData.attributes.chapter,
      publishAt: new Date(chapterData.attributes.publishAt),
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
    const mangaRequest$ = this.makeRequest(
      `/manga/${options.mangaId}?includes[]=cover_art`,
      {},
    );
    const chaptersRequest$ = this.makeRequest(
      `/manga/${options.mangaId}/feed`,
      {},
    );

    return forkJoin({
      mangaResponse: mangaRequest$,
      chaptersResponse: chaptersRequest$,
    }).pipe(
      map(({ mangaResponse, chaptersResponse }) => {
        const mangaItem = mangaResponse.data.data;
        const manga = this.mapMangaItemToDTO(mangaItem);
        const chaptersWithEnLanguage = chaptersResponse.data.data.filter(
          (chapterData: any) =>
            chapterData.attributes.translatedLanguage === 'en',
        );
        const chapters = chaptersWithEnLanguage.map((chapterData: any) =>
          this.mapChapterItemToDTO(chapterData),
        );
        chapters.sort((a, b) =>
          a.chapter.localeCompare(b.chapter, undefined, { numeric: true }),
        );
        return { manga, chapters };
      }),
    );
  }

  // *** SEARCH MANGA ***

  private getTagData(): Observable<string[]> {
    return this.makeRequest('/manga/tag', {}).pipe(
      map((response: any) => response.data.data),
      catchError((error) => {
        throw error;
      }),
    );
  }

  private getTagIDs(tagIDs: string[], tagNames: string[] = []): string[] {
    return tagIDs.filter((tagID) => tagNames.includes(tagID));
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

  searchManga(
    options: SearchMangaDexMangaInputType,
  ): Observable<MangaExtensionDTO[]> {
    const {
      limit = 10,
      offset = 0,
      title = '',
      year = null,
      includedTags = [],
      excludedTags = [],
    } = options;

    return this.getTagData().pipe(
      switchMap((tagIDs: string[]) => {
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

  // *** GET CHAPTERS IMAGES ***
}
