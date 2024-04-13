export const MANGA_BASE_URL = 'https://mangaverse-api.p.rapidapi.com/manga';
export const MANGA_API_KEY =
  '9209cf3dd9mshdc7ffe2690245f5p1aeef9jsn3150f1822141';
export const MANGA_API_HOST = 'mangaverse-api.p.rapidapi.com';

export const MANGA_HEADERS = {
  'X-RapidAPI-Key': MANGA_API_KEY,
  'X-RapidAPI-Host': MANGA_API_HOST,
};

export const MANGA_API = {
  url: MANGA_BASE_URL,
  headers: MANGA_HEADERS,
};

export const EXTENSIONS = {
  mangaDex: {
    apiUrl: 'https://api.mangadex.org',
    filesApi: 'https://uploads.mangadex.org',
    userAgent: 'personal-client-a38258a3-e5b0-4764-9c33-d9924b19e7bb-5c2a39d0',
  },
};
