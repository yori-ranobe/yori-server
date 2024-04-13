import { Resolver, Query, Args } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { MangaService } from './manga.service';
import {
  FetchMangaOptions,
  SearchMangaOptions,
  GetMangaOptions,
  GetChaptersOptions,
  GetImagesOptions,
  MangaDTO,
  ChapterDTO,
  MangaImageDTO,
} from './dto/manga.dto';

@Resolver()
export class MangaResolver {
  constructor(private mangaService: MangaService) {}

  @Query(() => [MangaDTO])
  fetchManga(
    @Args('options') options: FetchMangaOptions,
  ): Observable<MangaDTO[]> {
    return this.mangaService.fetchManga(options);
  }

  @Query(() => [MangaDTO])
  fetchLatest(
    @Args('options') options: FetchMangaOptions,
  ): Observable<MangaDTO[]> {
    return this.mangaService.fetchLatest(options);
  }

  @Query(() => [MangaDTO])
  searchManga(
    @Args('options') options: SearchMangaOptions,
  ): Observable<MangaDTO[]> {
    return this.mangaService.searchManga(options);
  }

  @Query(() => [MangaDTO])
  getManga(@Args('options') options: GetMangaOptions): Observable<MangaDTO> {
    return this.mangaService.getManga(options);
  }

  @Query(() => [ChapterDTO])
  getChapters(
    @Args('options') options: GetChaptersOptions,
  ): Observable<ChapterDTO[]> {
    return this.mangaService.getChapters(options);
  }

  @Query(() => [MangaImageDTO])
  getImages(
    @Args('options') options: GetImagesOptions,
  ): Observable<MangaImageDTO[]> {
    return this.mangaService.getImages(options);
  }
}
