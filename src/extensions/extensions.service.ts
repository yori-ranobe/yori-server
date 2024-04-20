import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  ChapterDTO,
  GetMangaListInputType,
  GetMangaByIdInputType,
  SearchMangaInputType,
  GetChapterImagesInputType,
  ChapterImagesDTO,
  GetMangaChaptersInputType,
} from './dto/extensions.dto';
import { MangaDexService } from './manga-dex/manga-dex.service';
import { MangaExtensionDTO } from './dto/extensions.dto';

@Injectable()
export class ExtensionsService {
  constructor(private readonly mangaDexService: MangaDexService) {}

  fetchManga(options: GetMangaListInputType): Observable<MangaExtensionDTO[]> {
    const { extension, ...fetchMangaOptions } = options;
    if (extension === 'MangaDex') {
      return this.mangaDexService.fetchManga(fetchMangaOptions);
    }
    return this.mangaDexService.fetchManga(fetchMangaOptions);
  }

  fetchMangaByTitle(
    options: GetMangaListInputType,
  ): Observable<MangaExtensionDTO> {
    const { extension, ...fetchMangaOptions } = options;
    if (extension === 'MangaDex') {
      return this.mangaDexService.fetchMangaByTitle(fetchMangaOptions);
    }
    return this.mangaDexService.fetchMangaByTitle(fetchMangaOptions);
  }

  getMangaById(
    options: GetMangaByIdInputType,
  ): Observable<{ manga: MangaExtensionDTO; chapters: ChapterDTO[] }> {
    const { mangaId } = options;
    if (options.extension === 'MangaDex') {
      return this.mangaDexService.getMangaById({ mangaId });
    }
    return this.mangaDexService.getMangaById({ mangaId });
  }

  searchManga(options: SearchMangaInputType): Observable<MangaExtensionDTO[]> {
    const { extension, ...searchOptions } = options;

    if (extension === 'MangaDex') {
      return this.mangaDexService.searchManga(searchOptions);
    }
    return this.mangaDexService.searchManga(searchOptions);
  }

  getChaptersList(
    options: GetMangaChaptersInputType,
  ): Observable<{ chapters: ChapterDTO[]; total: number }> {
    const { extension, ...fetchMangaOptions } = options;
    if (extension === 'MangaDex') {
      return this.mangaDexService.getChaptersList(fetchMangaOptions);
    }
    return this.mangaDexService.getChaptersList(fetchMangaOptions);
  }

  getChapterImages(
    options: GetChapterImagesInputType,
  ): Observable<ChapterImagesDTO> {
    const { extension, ...searchOptions } = options;

    if (extension === 'MangaDex') {
      return this.mangaDexService.getChapterImages(searchOptions);
    }
    return this.mangaDexService.getChapterImages(searchOptions);
  }
}
