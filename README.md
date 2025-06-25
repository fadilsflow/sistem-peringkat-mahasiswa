<div align="center">
  <img 
    src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1750862288/5_xs3ur8.png" 
    alt="SyncRank Dashboard" 
    width="800"
  />
</div>

# SyncRank - Sistem Peringkat Mahasiswa dengan AI

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fadilsflow/sistem-peringkat-mahasiswa)

**SyncRank** adalah Sistem Pendukung Keputusan (SPK) berbasis web yang dirancang untuk membantu dosen dan staf akademik dalam melakukan peringkat prestasi mahasiswa secara objektif, efisien, dan cerdas.

## Fitur Utama

- **Peringkat Objektif**: Mengimplementasikan metode **Simple Additive Weighting (SAW)** untuk memastikan penilaian yang adil dan konsisten.
- **Analisis & Laporan AI**: Dilengkapi asisten AI untuk memberikan wawasan dan rekomendasi dari data yang ada.
- **Manajemen Data Efisien**: Dukungan penuh untuk **Impor dan Ekspor data** mahasiswa dan kriteria melalui file Excel.
- **Dashboard Interaktif**: Visualisasikan data, pantau tren performa, dan identifikasi mahasiswa berprestasi dengan mudah.
- **Ekspor ke PDF**: Buat laporan peringkat yang rapi dan profesional dalam format PDF dengan sekali klik.
- **Periode Fleksibel**: Atur periode penilaian (misal per semester) dengan kriteria dan bobot yang dapat disesuaikan.
- **Autentikasi Aman**: Sistem login dan manajemen pengguna yang aman menggunakan Clerk.

## Tech Stack

- **Next.js**: React Framework untuk aplikasi web modern.
- **AI (Vercel AI SDK)**: Untuk fitur-fitur cerdas dan asisten chat.
- **TypeScript**: Untuk kode yang lebih aman dan mudah dikelola.
- **Tailwind CSS**: Framework CSS untuk desain yang cepat dan responsif.
- **shadcn/ui**: Komponen UI yang indah dan dapat diakses.
- **Clerk**: Untuk autentikasi dan manajemen pengguna.
- **Prisma**: ORM untuk interaksi dengan database.

## Mulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/fadilsflow/sistem-peringkat-mahasiswa.git
    cd sistem-peringkat-mahasiswa
    ```
2.  **Install dependensi:**
    ```bash
    npm install
    ```
3.  **Setup variabel lingkungan:**  
    Buat file `.env` di root proyek dan isi dengan kunci API Anda. Anda bisa mendapatkan kunci ini dari platform masing-masing.

    ```env
    # Database
    DATABASE_URL="your_database_url_here"

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

    # Google Gemini API (atau model AI lain)
    GOOGLE_GEMINI_API_KEY="your_api_key_here"
    ```

4.  **Sinkronisasi database:**
    ```bash
    npx prisma db push
    ```
5.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Rencana Pengembangan

1.  **Kustomisasi Template Laporan**: Memungkinkan pengguna mendesain sendiri template laporan PDF.
2.  **Analisis Perbandingan**: Fitur untuk membandingkan performa mahasiswa antar periode penilaian.
3.  **Notifikasi**: Pengingat dan pemberitahuan penting untuk pengguna.
4.  **Peran & Hak Akses**: Manajemen peran yang lebih detail (Admin, Dosen, Kepala Jurusan).

## Sumber Daya

- [Dokumentasi Next.js](https://nextjs.org/docs)
- [Komponen shadcn/ui](https://ui.shadcn.com/)
- [Dokumentasi Clerk](https://clerk.com/docs)
- [Dokumentasi Prisma](https://www.prisma.io/docs/)
- [Repositori GitHub SyncRank](https://github.com/fadilsflow/sistem-peringkat-mahasiswa)

## Kontak

Untuk pertanyaan, saran, atau peluang kolaborasi:

- Email: [wahyufadil1140@gmail.com](mailto:wahyufadil1140@gmail.com)
- GitHub: [@fadilsflow](https://github.com/fadilsflow)

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](https://github.com/fadilsflow/sistem-peringkat-mahasiswa/blob/main/LICENSE) untuk detailnya.
