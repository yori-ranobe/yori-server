import { Resolver, Query, Args } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import {
  MangaExtensionDTO,
  ExtendedMangaDTO,
  ChapterDTO,
  ChapterImagesDTO,
  GetMangaListInputType,
  GetMangaByIdInputType,
  SearchMangaInputType,
  GetChapterImagesInputType,
} from './dto/extensions.dto';
import { ExtensionsService } from './extensions.service';

@Resolver()
export class ExtensionsResolver {
  constructor(private readonly extensionsService: ExtensionsService) {}

  @Query(() => [MangaExtensionDTO])
  fetchMangaList(
    @Args('GetMangaListInputType') options: GetMangaListInputType,
  ): Observable<MangaExtensionDTO[]> {
    return this.extensionsService.fetchMangaList(options);
  }

  @Query(() => ExtendedMangaDTO)
  getMangaById(
    @Args('GetMangaByIdInputType') options: GetMangaByIdInputType,
  ): Observable<{ manga: MangaExtensionDTO; chapters: ChapterDTO[] }> {
    return this.extensionsService.getMangaById(options);
  }

  @Query(() => [MangaExtensionDTO])
  searchManga(
    @Args('SearchMangaInputType') options: SearchMangaInputType,
  ): Observable<MangaExtensionDTO[]> {
    return this.extensionsService.searchManga(options);
  }

  @Query(() => ChapterImagesDTO)
  getChapterImages(
    @Args('GetChapterImagesInputType') options: GetChapterImagesInputType,
  ): Observable<ChapterImagesDTO> {
    return this.extensionsService.getChapterImages(options);
  }
}
