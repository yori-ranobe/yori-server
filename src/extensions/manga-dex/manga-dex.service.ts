import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, forkJoin, from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
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
  GetMangaDexChaptersInputType,
} from './dto/manga-dex.dto';
import { EXTENSIONS } from '../../config';
import { formatDate } from 'src/utils/time';

@Injectable()
export class MangaDexService {
  constructor(private httpService: HttpService) {}

  private setUserAgentHeader() {
    this.httpService.axiosRef.defaults.headers['User-Agent'] =
      EXTENSIONS.mangaDex.userAgent;
  }

  private makeRequest(endpoint: string, options: any): Observable<any> {
    try {
      this.setUserAgentHeader();
      const apiUrl = `${EXTENSIONS.mangaDex.apiUrl}${endpoint}`;
      return this.httpService.get(apiUrl, { params: options });
    } catch (error) {
      console.error(error);
    }
  }

  private generateFileUrl(mangaId: string, fileName: string): string {
    return `${EXTENSIONS.mangaDex.filesApi}/covers/${mangaId}/${fileName}`;
  }

  private extractCoverFile(item: any): string {
    const coverRelationship = item.relationships?.find(
      (rel) => rel.type === 'cover_art',
    );

    if (!coverRelationship || !coverRelationship.attributes.fileName) {
      return item.id;
    }

    return this.generateFileUrl(item.id, coverRelationship.attributes.fileName);
  }

  private getTitle(title: any): string {
    return title?.en || Object.values(title)[0] || '';
  }

  private getAltTitles(altTitles: any[]): string[] | null {
    if (!altTitles) return null;

    return altTitles.map((titleObj: any) => {
      const value = Object.values(titleObj)[0];
      return typeof value === 'string' ? value : '';
    });
  }

  private getDescription(description: any): string {
    return description?.en || Object.values(description)[0] || '';
  }

  private mapMangaShortItemToDTO(item: any): MangaExtensionDTO | null {
    if (!item || !item.id || !item.attributes || !item.attributes.title) {
      return;
    }

    const attributes = item.attributes;
    const id = item.id;

    const cover = this.extractCoverFile(item);
    const title = this.getTitle(attributes.title);
    const latestUploadedChapter = attributes.latestUploadedChapter;

    return { id, title, cover, latestUploadedChapter };
  }

  private mapMangaItemToDTO(item: any): MangaExtensionDTO {
    const attributes = item.attributes;
    const id = item.id;
    const type = item.type;

    const cover = this.extractCoverFile(item);
    const tagsDTO = attributes.tags.map((tag: any) => this.mapTagToDTO(tag));

    const title = this.getTitle(attributes.title);
    const altTitles = this.getAltTitles(attributes.altTitles);
    const description = this.getDescription(attributes.description);
    const status = attributes.status || 'ongoing';
    const contentRating = attributes.contentRating || 'safe';
    const state = attributes.state || 'published';
    const originalLanguage = attributes.originalLanguage || '';

    const author: string[] = item.relationships
      .filter((relationship) => relationship.type === 'author')
      .map((relationship) => relationship.attributes.name);

    const artist: string[] = item.relationships
      .filter((relationship) => relationship.type === 'artist')
      .map((relationship) => relationship.attributes.name);

    const related =
      item.relationships
        ?.filter(
          (relationship) =>
            relationship.type === 'manga' && relationship.related,
        )
        ?.map((relationship) => this.mapMangaShortItemToDTO(relationship)) ||
      [];

    return {
      id,
      title,
      altTitles,
      description,
      cover,
      type,
      year: attributes.year,
      status,
      state,
      author,
      artist,
      contentRating,
      originalLanguage,
      tags: tagsDTO,
      related: related,
      latestUploadedChapter: attributes.latestUploadedChapter || '',
    };
  }

  private mapChapterItemToDTO(chapterData: any): ChapterDTO {
    return {
      id: chapterData.id,
      volume: chapterData.attributes.volume ?? null,
      chapter: chapterData.attributes.chapter,
      publishAt: new Date(chapterData.attributes.publishAt),
      createdAt: formatDate(chapterData.attributes.createdAt),
    };
  }

  private mapTagToDTO(tag: any): TagDTO {
    return {
      id: tag.id,
      type: tag.type,
      name: tag.attributes.name.en || '',
    };
  }

  // *** GET MANGA BY TITLE ***

  fetchMangaByTitle(
    options: GetMangaDexMangaListInputType,
  ): Observable<MangaExtensionDTO> {
    const params = {
      ...(options.limit && { limit: options.limit }),
      ...(options.offset && { offset: options.offset }),
      ...(options.title && { title: options.title }),
      includes: ['cover_art', 'manga', 'author', 'artist'],
    };

    return this.makeRequest('/manga', params).pipe(
      mergeMap((response) => {
        const manga: MangaExtensionDTO = response.data.data.map((item) =>
          this.mapMangaItemToDTO(item),
        )[0];

        const relatedMangaIds: string[] = [
          ...new Set(
            (manga.related || []).map(
              (relatedManga: MangaExtensionDTO) => relatedManga?.id,
            ),
          ),
        ]?.filter((id) => id);

        const coverParams = {
          ...(options.limit && { limit: options.limit }),
          manga: relatedMangaIds,
        };

        const coverRequest: Observable<any> = this.makeRequest(
          '/cover',
          coverParams,
        );

        return forkJoin([coverRequest]).pipe(
          switchMap(([coverResponses]) => {
            const covers = coverResponses.data.data.map(
              (coverResponse: any) => {
                const mangaRelationship = coverResponse.relationships.find(
                  (relationship: any) => relationship.type === 'manga',
                );

                return {
                  id: mangaRelationship.id || '',
                  fileName: coverResponse.attributes.fileName || '',
                };
              },
            );
            manga.related?.forEach((relatedManga: MangaExtensionDTO) => {
              const cover = covers.find(
                (cover: { id: string }) => cover.id === relatedManga.id,
              );
              if (cover) {
                relatedManga.cover = this.generateFileUrl(
                  relatedManga.id,
                  cover.fileName,
                );
              }
            });

            return of(manga);
          }),
        );
      }),
    );
  }

  // *** GET MANGA LIST ***

  fetchManga(
    options: GetMangaDexMangaListInputType,
  ): Observable<MangaExtensionDTO[]> {
    const params = {
      ...(options.limit && { limit: options.limit }),
      ...(options.offset && { offset: options.offset }),
      ...(options.order && { order: options.order }),
      includes: ['cover_art'],
    };

    return this.makeRequest('/manga', params).pipe(
      mergeMap((response) => {
        const mangaList: MangaExtensionDTO[] = response.data.data.map((item) =>
          this.mapMangaShortItemToDTO(item),
        );

        const chapterRequestsIds = mangaList
          .filter((manga) => manga.latestUploadedChapter)
          .map((manga) => manga.latestUploadedChapter);

        if (chapterRequestsIds.length === 0) {
          return from([mangaList]);
        }

        const chapterRequests = chapterRequestsIds.map((chapterRequestId) =>
          this.makeRequest(`/chapter/${chapterRequestId}`, {}).pipe(
            map(
              (chapterResponse) => chapterResponse.data.data.attributes.chapter,
            ),
          ),
        );

        return forkJoin(chapterRequests).pipe(
          switchMap((chapters: any[]) => {
            mangaList.forEach((manga: MangaExtensionDTO, index: number) => {
              manga.latestUploadedChapter = chapters[index];
            });

            return of(mangaList);
          }),
        );
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
      (chapterData: any) => chapterData.attributes?.translatedLanguage === 'en',
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

  // *** GET CHAPTERS LIST ***

  getChaptersList(
    options: GetMangaDexChaptersInputType,
  ): Observable<{ chapters: ChapterDTO[]; total: number }> {
    const order = {
      volume: 'desc',
      chapter: 'desc',
    };

    const params = {
      ...(options.limit && { limit: options.limit }),
      ...(options.offset && { offset: options.offset }),
      ...(options.translatedLanguage && {
        translatedLanguage: options.translatedLanguage,
      }),
      order: order,
    };

    const url = `/manga/${options.mangaId}/feed`;

    return this.makeRequest(url, params).pipe(
      map((response) => {
        const chapters: ChapterDTO[] = response.data.data.map((chapter) =>
          this.mapChapterItemToDTO(chapter),
        );
        const total: number = response.data.total;
        return { chapters, total };
      }),
    );
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
