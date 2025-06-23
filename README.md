# Sistem Pendukung Keputusan Peringkat Mahasiswa (SAW Method)

Sistem Pendukung Keputusan untuk menentukan peringkat mahasiswa di kelas menggunakan metode Simple Additive Weighting (SAW). Aplikasi ini dibangun menggunakan Next.js, Prisma, dan SQLite.

## Teknologi yang Digunakan

- Next.js (App Router)
- Prisma (ORM)
- Postgresql (Database)
- Shadcn/ui (Component Library)
- Tailwind CSS (Styling)

## Fitur Utama

1. **Manajemen Periode**

   - Menambah, mengubah, dan menghapus periode penilaian
   - Mengatur bobot kriteria penilaian untuk setiap periode
   - Melihat daftar periode yang tersedia

2. **Manajemen Data Mahasiswa**

   - Input data mahasiswa (NIM, Nama)
   - Input nilai kriteria penilaian:
     - Nilai Akademik (0-100)
     - Kehadiran (0-100%)
     - Prestasi Akademik (0-5)
     - Prestasi Non-akademik (0-5)
     - Perilaku (1-5)
     - Keaktifan Organisasi (1-5)

3. **Perhitungan SAW**
   - Normalisasi nilai kriteria
   - Perhitungan nilai akhir berdasarkan bobot
   - Menampilkan peringkat mahasiswa

## Kriteria Penilaian

### 1. Prestasi Akademik

| Jenis Prestasi                            | Skor |
| ----------------------------------------- | ---- |
| Tidak ada prestasi                        | 0    |
| Peserta lomba/seminar                     | 1    |
| Juara 1-3 tingkat lokal/kampus            | 2    |
| Juara 1–3 tingkat kampus/daerah           | 3    |
| Juara tingkat nasional / publikasi ilmiah | 4    |
| Juara internasional / publikasi terindeks | 5    |

### 2. Prestasi Non-akademik

| Jenis Prestasi                    | Skor |
| --------------------------------- | ---- |
| Tidak ada prestasi                | 0    |
| Partisipan lomba non-akademik     | 1    |
| Juara 1-3 di tingkat lokal/kampus | 2    |
| Juara 1–3 tingkat daerah          | 3    |
| Juara tingkat nasional            | 4    |
| Juara tingkat internasional       | 5    |

### 3. Keaktifan Organisasi

| Skor | Jenis Keaktifan                                                                      |
| ---- | ------------------------------------------------------------------------------------ |
| 1    | Tidak aktif sama sekali atau hanya menjadi anggota pasif (jarang hadir)              |
| 2    | Aktif sebagai anggota biasa dalam 1 organisasi                                       |
| 3    | Aktif sebagai pengurus (anggota divisi) di 1–2 organisasi                            |
| 4    | Menjabat sebagai koordinator/bidang atau pengurus inti (sekretaris, bendahara, dsb)  |
| 5    | Menjabat ketua/presiden organisasi atau aktif di >1 organisasi sebagai pengurus inti |

## Struktur Database

### Tabel Periode

- id_periode (Primary Key)
- tahun
- semester
- Bobot kriteria:
  - w1_nilai_akademik
  - w2_kehadiran
  - w3_prestasi_akademik
  - w4_prestasi_nonakademik
  - w5_perilaku
  - w6_keaktifan_organisasi
- deskripsi

### Tabel Mahasiswa

- nim (Primary Key)
- nama
- id_periode (Foreign Key)
- nilai_akademik
- kehadiran
- prestasi_akademik
- prestasi_nonakademik
- perilaku
- keaktifan_organisasi
- tanggal_input

## Metode SAW (Simple Additive Weighting)

1. **Normalisasi Matrix**

   - Untuk kriteria benefit: r[ij] = x[ij] / max(x[i])
   - Untuk kriteria cost: r[ij] = min(x[i]) / x[ij]

2. **Perhitungan Nilai Akhir**
   - V[i] = Σ(w[j] \* r[ij])
   - w[j] = bobot kriteria
   - r[ij] = nilai normalisasi

## Komponen UI

1. **Dashboard**

   - Ringkasan data periode aktif
   - Statistik jumlah mahasiswa
   - Quick actions

2. **Manajemen Periode**

   - Form input/edit periode
   - Tabel daftar periode
   - Input bobot kriteria

3. **Data Mahasiswa**

   - Form input/edit mahasiswa
   - Tabel daftar mahasiswa
   - Filter berdasarkan periode

4. **Hasil SAW**
   - Tabel peringkat mahasiswa
   - Detail perhitungan
   - Filter berdasarkan periode

## Cara Menjalankan Aplikasi

1. Install dependencies:

```bash
bun install
```

2. Setup database:

```bash
bunx prisma generate
bunx prisma db push
```

3. Jalankan aplikasi:

```bash
bun dev
```

Aplikasi akan berjalan di `http://localhost:3000`
