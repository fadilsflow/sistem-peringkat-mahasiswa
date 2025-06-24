# SyncRank 🎓

<div align="center">
  <img src="https://res.cloudinary.com/dxurnpbrc/image/upload/v1750670899/syncrank-dashboard_sxgeqt.png" alt="SyncRank Dashboard" width="100%" />
  
  <h3>Sistem Peringkat Mahasiswa dengan Metode SAW</h3>

  <p>Platform modern untuk mengelola dan mengevaluasi prestasi akademik mahasiswa menggunakan metode Simple Additive Weighting (SAW)</p>

  <p>
    <a href="https://syncrank.bulba.cloud">View Demo</a>
    ·
    <a href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa/issues">Report Bug</a>
    ·
    <a href="https://github.com/fadilsflow/sistem-peringkat-mahasiswa/issues">Request Feature</a>
  </p>
</div>

## ✨ Features

- 📊 **Dashboard Interaktif** - Visualisasi data dan statistik mahasiswa
- 🎯 **Manajemen Periode** - Atur periode dan bobot kriteria penilaian
- 👥 **Manajemen Mahasiswa** - Kelola data dan nilai mahasiswa
- 📈 **Perhitungan SAW** - Evaluasi otomatis menggunakan metode SAW
- 🔒 **Autentikasi** - Keamanan data dengan Clerk Auth
- 🎨 **UI Modern** - Antarmuka yang intuitif dengan Shadcn/ui

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Shadcn/ui](https://ui.shadcn.com/) - Komponen UI
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Clerk](https://clerk.com/) - Autentikasi

## 🚀 Quick Start

1. **Clone repository**

```bash
git clone https://github.com/fadilsflow/sistem-peringkat-mahasiswa.git
cd sistem-peringkat-mahasiswa
```

2. **Install dependencies**

```bash
bun install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` file dengan konfigurasi yang sesuai:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

4. **Setup database**

```bash
bunx prisma generate
bunx prisma db push
```

5. **Run development server**

```bash
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📝 Kriteria Penilaian

### Prestasi Akademik (0-5)

- Tidak ada prestasi (0)
- Peserta lomba/seminar (1)
- Juara 1-3 tingkat kampus (2)
- Juara 1-3 tingkat daerah (3)
- Juara nasional/publikasi (4)
- Juara internasional (5)

### Prestasi Non-akademik (0-5)

- Tidak ada prestasi (0)
- Partisipan lomba (1)
- Juara kampus (2)
- Juara daerah (3)
- Juara nasional (4)
- Juara internasional (5)

### Keaktifan Organisasi (1-5)

- Anggota pasif (1)
- Anggota aktif (2)
- Pengurus divisi (3)
- Pengurus inti (4)
- Ketua/multi organisasi (5)

## 🤝 Contributing

Kontribusi membuat komunitas open source menjadi tempat yang luar biasa untuk belajar dan berkreasi. Setiap kontribusi yang Anda buat akan sangat **dihargai**.

1. Fork project ini
2. Buat branch fitur Anda (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Fadil**

- Website: [fadils.xyz](https://fadils.xyz)
- GitHub: [@fadilsflow](https://github.com/fadilsflow)

## ⭐️ Show your support

Berikan ⭐️ jika project ini membantu Anda!
