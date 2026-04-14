# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

Kuis Backend Programming 1 - Gacha System
Halo Pak! Saya Marcelino. Ini adalah pengerjaan Kuis 1 saya untuk mata kuliah Backend Programming. Di sini saya sudah mengimplementasikan sistem undian (Gacha) lengkap dengan logic pembatasan kuota dan beberapa fitur bonus.

1. Development Setup
   Clone & Install: Sesudah fork, jalankan npm install.
   Environment: File .env sudah dikonfigurasi ke database MongoDB lokal/Atlas.
   Running: Server dijalankan dengan perintah npm run dev. Saat ini server berjalan di port 5050.

2. Fitur & API Endpoints

1) Main Gacha (POST)
   Endpoint utama untuk mencoba keberuntungan.
   URL: /api/gacha
   Logic: Setiap user (berdasarkan userId) dibatasi maksimal 5 kali gacha per hari. Jika lebih, sistem akan mengembalikan error 403 (Quota Full).

2) Prize Status & Quota (GET) - Bonus Point
   Menampilkan daftar sisa kuota untuk setiap hadiah secara real-time.
   URL: /api/gacha/prizes

3) Masked Winner List (GET) - Bonus Point
   Menampilkan daftar siapa saja yang menang. Sesuai request, nama pemenang disamarkan (contoh: M**\*\*\***o) demi privasi.
   URL: /api/gacha/winners

4) User Gacha History (GET) - Bonus Point
   Melihat semua riwayat gacha yang pernah dilakukan oleh user tertentu.
   URL: /api/gacha/history/:userId

3. Struktur Folder
   Pengerjaan kuis ini mengikuti pola arsitektur yang sudah ada di template:
   Model: src/models/gacha-schema.js
   Component Gacha: Terdiri dari Controller, Service, Repository, dan Route di folder src/api/components/gacha.
   Logic: Pembatasan kuota dan pengacakan hadiah dikelola di gacha-service.js

## Contoh Response

### POST /api/gacha

#### Jika Menang:

```json
{
  "success": true,
  "message": "Selamat! Anda mendapatkan Pulsa Rp50.000",
  "prize": "Pulsa Rp50.000"
}
```

```json
Jika zonk
{
  "success": true,
  "message": "Maaf, Anda belum beruntung",
  "prize": "Zonk"
}
```

```json
jika kuota abis
{
  "success": false,
  "error": "kuota Full",
  "message": "Setiap user hanya bisa melakukan gacha maksimal 5 kali dalam 1 hari."
}
```
