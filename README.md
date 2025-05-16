# BE-Elhusein-Visa Backend

Backend service untuk aplikasi Visa Elhusein menggunakan **Express.js**, **TypeScript**, dan **Prisma** dengan arsitektur (Repository → Service → Handler → Route).

---

## ERD Sistem VISA El-Husein
[DBDiagram Link](https://dbdiagram.io/d/be-elhusein-visa-6826e54a1227bdcb4e96f3bd)

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

### Penjelasan:
1. **`src/`**  
   - **`dto/`**: Berisi definisi Data Transfer Object (interface TypeScript) untuk validasi request  
   - **`repository/`**: Layer untuk operasi database menggunakan Prisma Client  
   - **`service/`**: Menampung logika bisnis dan validasi data  
   - **`handler/`**: Mengolah request HTTP dan mengembalikan response  
   - **`route/`**: Konfigurasi endpoint API  
   - **`index.ts`**: File utama untuk inisialisasi server

2. **`prisma/`**  
   - **`schema.prisma`**: File konfigurasi model database dan migrasi

3. **File Root**  
   - **`.env`**: Menyimpan environment variables (e.g., koneksi database)  
   - **`package.json`**: Daftar dependencies dan project configuration  
   - **`tsconfig.json`**: Konfigurasi compiler TypeScript

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
