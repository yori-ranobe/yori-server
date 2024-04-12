import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
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
import { MANGA_API } from '../config';

@Injectable()
export class MangaService {
  constructor(private httpService: HttpService) {}

  private requestMangaApi<T>(endpoint: string, options: any): Observable<T> {
    return this.httpService
      .get(`${MANGA_API.url}/${endpoint}`, {
        params: options,
        headers: MANGA_API.headers,
      })
      .pipe(
        map((response: AxiosResponse<any>) => response.data.data),
        catchError((error) => {
          throw new Error(error);
        }),
      );
  }

  fetchManga(options: FetchMangaOptions): Observable<MangaDTO[]> {
    return this.requestMangaApi<MangaDTO[]>('fetch', options);
  }

  fetchLatest(options: FetchMangaOptions): Observable<MangaDTO[]> {
    return this.requestMangaApi<MangaDTO[]>('latest', options);
  }

  searchManga(options: SearchMangaOptions): Observable<MangaDTO[]> {
    return this.requestMangaApi<MangaDTO[]>('search', options);
  }

  getManga(options: GetMangaOptions): Observable<MangaDTO> {
    return this.requestMangaApi<MangaDTO>('get', options);
  }

  getChapters(options: GetChaptersOptions): Observable<ChapterDTO[]> {
    return this.requestMangaApi<ChapterDTO[]>('chapter', options);
  }

  getImages(options: GetImagesOptions): Observable<MangaImageDTO[]> {
    return this.requestMangaApi<MangaImageDTO[]>('image', options);
  }
}
