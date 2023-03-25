# API-Film-Scraping
Scrap Web Nonton Film Dengan NodeJS + Typescript + Express + Cheerio

### HTTP Request
| METHOD | URL | Description |
| ----------- | ----------- | ----------|
| GET | /movies/:page? | Get All Movies With Paginate (Optional Parameter For Paginate, `Ex. /movies/10` can show result from page 10) |
| GET | /movies/detail/:slug | Get Detail Movie (Required Parameter slug `Ex. /movies/detail/unseen-2023`)  |
| GET | /tv/:slug | Get Detail TV Show (Required Parameter slug `Ex. /tv/the-heavenly-idol-2023/`) |
| GET | /tv/eps/:slug | Get Detail Episode From TV Show (Required Parameter slug `Ex. /tv/eps/the-heavenly-idol-episode-1/`)

### Example Request & Response Body

#### 1. Get All Movies
#### Request

```
Method: GET
URL: /movies
OR URL: /movies/10
```
#### Response
```
{
  "data": [
    {
      "title": "Kill Her Goats (2023)",
      "link": "https://ngefilm21.shop/kill-her-goats-2023/",
      "slug": "/kill-her-goats-2023/",
      "thumbnail_url": "https://ngefilm21.shop/wp-content/uploads/2023/03/oHVuaIHBX0dqqBUbvYyHgkhyCr8-152x228.jpg",
      "duration": "100 min",
      "rating": "3",
      "quality": "BluRay",
      "episode": ""
    }
 }
```

#### 2. Get Detail  Movies
#### Request

```
Method: GET
URL: movies/detail/kill-her-goats-2023
```
#### Response
```
{
  "data": {
    "title": "Kill Her Goats (2023)",
    "thumbnail_url": "https://ngefilm21.shop/wp-content/uploads/2023/03/oHVuaIHBX0dqqBUbvYyHgkhyCr8-60x90.jpg",
    "description": "Hadiah kelulusan Audra adalah rumah impiannya, tetapi segera menjadi mimpi buruk yang hidup ketika beberapa tamu tak diundang datang ke pesta kepulangannya yang tidak terlalu halus tentang fakta bahwa mereka tidak menyetujui pemilik baru rumah tersebut.",
    "created_at": "25 Maret 2023",
    "tagline": "No Body is Safe!",
    "rating": "NR",
    "genre": "Horror",
    "quality": "BluRay",
    "year": "2023",
    "duration": "100 Min",
    "country": "USA",
    "realease": "13 Mar 2023",
    "language": "English",
    "director": "Steve Wolsh",
    "artist": "Arielle Raycene, Ellie Gonsalves, Kane Hodder",
    "voting": {
      "count": "1",
      "value": "3.0"
    },
    "download_links": [
      {
        "link": "https://new6.gdtot.cfd/file/558764089",
        "text": "Google Drive 480p"
      },
      {
        "link": "https://new6.gdtot.cfd/file/1100992736",
        "text": "Google Drive 720p"
      },
    ],
    "streaming_links": [
      "https://short.ink/VKnEf6ONF",
      "https://sbface.com/e/urvmu1u4vv02.html",
      null,
      "https://tvdante.xyz/v/425-8f5-4k4-6j1"
    ]
  }
}
```

#### 3. Get Detail TV Show
#### Request

```
Method: GET
URL: /tv/taxi-driver-season-2-2023
```
#### Response
```
{
  "data": {
    "title": "Taxi Driver Season 2 (2023)",
    "thumbnail_url": "https://ngefilm21.shop/wp-content/uploads/2023/02/Taxi-Driver-Season-2-2023-60x90.jpg",
    "description": "Meskipun Taksi Pelangi dibubarkan, Do Gi masih di luar sana mengejar orang jahat. Sambil menyembunyikannya dari anggota lainnya, Do Gi dan Seong Cheol diam-diam membantu seorang ayah yang sedang mencari putranya yang hilang. Untuk memastikan keberadaannya, Do Gi berangkat ke luar negeri ke negara asing untuk menyelesaikan misi pertamanya.",
    "created_at": "25 Maret 2023",
    "genre": "Action & Adventure, Crime, Drakor, Drama",
    "year": "2023",
    "country": "Korea",
    "num_episode": "9",
    "realease": "17 Feb 2023",
    "network": "SBS, Viu",
    "artist": "Kim Eui-sung, Lee Je-hoon, Pyo Ye-jin",
    "streaming_links": [
      {
        "link": "https://ngefilm21.shop/eps/taxi-driver-season-2-episode-1/",
        "slug": "/eps/taxi-driver-season-2-episode-1/"
      },
      {
        "link": "https://ngefilm21.shop/eps/taxi-driver-season-2-episode-2/",
        "slug": "/eps/taxi-driver-season-2-episode-2/"
      },
      {
        "link": "https://ngefilm21.shop/eps/taxi-driver-season-2-episode-3/",
        "slug": "/eps/taxi-driver-season-2-episode-3/"
      },
    ]
  }
}
```

#### 4. Get Download & Stream Link TV Show
#### Request

```
Method: GET
URL: /tv/eps/taxi-driver-season-2-episode-1/
```
#### Response
```
{
  "data": {
    "title": "Taxi Driver Season 2 Episode 1",
    "streaming_links": [
      "https://short.ink/N2MSGqJji",
      "https://sbbrisk.com/e/9avuxisjolb3.html",
      "https://dood.yt/e/x75fjrjqex0z",
      "https://tvdante.xyz/v/g56x3s-qyeqj342"
    ],
    "download_links": [
      {
        "link": "https://acefile.co/f/95363011/ngefilm21-pw-taxi-driver-s02e01-480p-mp4",
        "text": "Google Drive 480p"
      },
      {
        "link": "https://acefile.co/f/95363002/ngefilm21-pw-taxi-driver-s02e01-720p-mp4",
        "text": "Google Drive 720p"
      },
      {
        "link": "https://acefile.co/f/95363003/ngefilm21-pw-taxi-driver-s02e01-1080p-mp4",
        "text": "Google Drive 1080p"
      },
    ]
  }
}
```
