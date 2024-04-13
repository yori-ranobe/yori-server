import { Injectable } from '@nestjs/common';
import {
  ChapterDTO,
  GetMangaListInputType,
  GetMangaByIdInputType,
} from './dto/extensions.dto';
import { MangaDexService } from './manga-dex/manga-dex.service';
import { MangaExtensionDTO } from './dto/extensions.dto';
import { Observable } from 'rxjs';

@Injectable()
export class ExtensionsService {
  constructor(private readonly mangaDexService: MangaDexService) {}

  fetchMangaList(
    options: GetMangaListInputType,
  ): Observable<MangaExtensionDTO[]> {
    const { limit, offset } = options;
    if (options.extension === 'MangaDex') {
      return this.mangaDexService.fetchMangaList({ limit, offset });
    }
    return this.mangaDexService.fetchMangaList({ limit, offset });
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
}
