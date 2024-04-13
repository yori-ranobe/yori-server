import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChapterDTO, MangaExtensionDTO } from '../dto/extensions.dto';
import {
  GetMangaDexMangaListInputType,
  GetMangaDexMangaByIdInputType,
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

  private mapMangaItemToDTO(item: any): MangaExtensionDTO {
    const cover = this.getCoverUrl(item);

    return {
      id: item.id,
      type: item.type,
      title: item.attributes.title?.en || '',
      description: item.attributes.description?.en || '',
      year: item.attributes.year,
      cover: cover,
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

  private getCoverUrl(item: any): string | null {
    const coverRelationship = item.relationships.find(
      (rel) => rel.type === 'cover_art',
    );
    if (!coverRelationship || !coverRelationship.attributes.fileName) {
      return null;
    }

    const coverFileName = coverRelationship.attributes.fileName;
    return `${EXTENSIONS.mangaDex.filesApi}/covers/${item.id}/${coverFileName}`;
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
}
