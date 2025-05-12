# BE-Elhusein-Visa Backend

Backend service untuk aplikasi Visa Elhusein menggunakan **Express.js**, **TypeScript**, dan **Prisma** dengan arsitektur (Repository → Service → Handler → Route).

---

## Instalasi

1. Clone repositori:
   ```
   git clone https://github.com/EL-HUSAIN/BE-ELHUSAIN-VISA.git
   cd BE-ELHUSAIN-VISA
   ```

2. Install dependensi:
    ```
    npm install
    ```

3. Setup database (.env):
- Tambahkan DATABASE_URL di file .env:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/visa_db?schema=public"
    ```

- Jalankan migrasi & generate Prisma Client:
    ```
    npx prisma migrate dev --name init
    npx prisma generate
    ```

## Build & Start
- Build TS
    ```
    npm run build
    ```

- Mulai Server
    ```
    npm start
    ```

## Struktur Folder
src/
├── dto/ # Data Transfer Object (DTO) - Definisi tipe request
├── repository/ # Interaksi database menggunakan Prisma
├── service/ # Logika bisnis aplikasi
├── handler/ # Penanganan request HTTP
├── route/ # Definisi rute Express
└── index.ts # Entry point utama
prisma/
└── schema.prisma # Skema database
.env/ # Variabel lingkungan
package.json/ # Konfigurasi NPM
tsconfig.json/ # Konfigurasi TypeScript

Penjelasan:

- dto/: Interface TypeScript untuk struktur data request

- repository/: Kelas yang berinteraksi langsung dengan database

- service/: Logika bisnis dan validasi sebelum operasi database

- handler/: Mengolah request, memanggil service, dan mengirim response

- route/: Mapping URL ke handler

## 🚀 Endpoint & Testing

### Dokumentasi Postman
[![Postman](https://img.shields.io/badge/Postman-Dokumentasi_API-orange?style=flat&logo=postman)](https://app.getpostman.com/join-team?invite_code=c403bd4011a3a55cca91e880fa10a5c868707bc4dcec5488995b6e1dccad6220&target_code=10e471f4ea74edf99ad3f3693a04bbb3)

---

### Contoh Request

#### 1. Mengajukan Visa (POST `/api/visa/apply`)
**Request Body:**
```json
{
  "name": "Budi Santoso",
  "passportNumber": "A12345678",
  "nationality": "Indonesia"
}