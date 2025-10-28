SIAP-AI — Sistem Informasi Arahan Pelatihan berbasis AI

Ringkas
- Aplikasi web untuk memberi rekomendasi pelatihan berdasarkan jabatan dan tugas utama (SKJ).
- Menggunakan Google Gemini (gemini-2.5-flash) melalui Generative Language API untuk menghasilkan rekomendasi.
- Data master (Jabatan, SKJ, Pelatihan) disimpan lokal (localStorage), mudah diedit di halaman Pengaturan.

Fitur Utama
- Rekomendasi Pelatihan Berbasis AI: Masukkan data pegawai, pilih jabatan, dan dapatkan rekomendasi 3–5 pelatihan beserta alasan.
- Manajemen Data Jabatan: Tambah/edit/hapus daftar jabatan.
- Manajemen SKJ (Standar Kompetensi Jabatan): Simpan “Tugas Utama Jabatan” per jabatan untuk dianalisis AI.
- Manajemen Pelatihan: Kelola daftar pelatihan (Judul | Tema) yang menjadi kandidat rekomendasi.
- Pengaturan API Key: Simpan kunci API Gemini secara lokal (tidak perlu environment file).
- UI modern: React + Tailwind + komponen shadcn/ui.

Teknologi
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query (react-query)
- Google Generative Language API (Gemini) — model: gemini-2.5-flash

Struktur Halaman
- Home: Form data pegawai dan tombol untuk mendapatkan rekomendasi AI.
- Settings:
  - API Key: Simpan kunci Gemini untuk pemanggilan API.
  - Jabatan: Kelola daftar jabatan.
  - SKJ: Kelola tugas utama per jabatan.
  - Pelatihan: Kelola daftar pelatihan.

Prasyarat
- Node.js 18+ dan npm
- Kunci API Google Generative Language (Gemini). Aktifkan API dan buat API key di Google AI Studio.

Instalasi & Menjalankan
1) Install dependencies
```bash
npm install
```
2) Jalankan app (dev)
```bash
npm run dev
```
3) Buka aplikasi
```text
http://localhost:5173
```

Konfigurasi API Key Gemini
- Buka halaman Settings → API Key.
- Tempel API key Anda dan simpan. Kunci disimpan di localStorage dengan key `siap-ai-gemini-key`.

Cara Pakai (Alur Utama)
1) Siapkan data master:
   - Tambah Jabatan di Settings → Jabatan.
   - Tambah SKJ (Tugas Utama) untuk jabatan di Settings → SKJ.
   - Tambah daftar Pelatihan di Settings → Pelatihan.
2) Masukkan API Key di Settings → API Key.
3) Ke halaman Home, isi data pegawai, pilih jabatan, dan klik “Dapatkan Rekomendasi AI”.
4) Aplikasi menampilkan:
   - Detail Kompetensi/Jabatan (tugas utama dari SKJ).
   - Rekomendasi pelatihan dari AI (3–5 item beserta alasan ringkas).

Catatan Model & Endpoint
- Model yang digunakan: `gemini-2.5-flash` (free tier, saat ini menggunakan endpoint v1beta generateContent).
- Lokasi pemanggilan ada di `src/pages/Home.tsx`.

Keamanan & Penyimpanan Data
- API key disimpan lokal di browser (localStorage). Jangan gunakan pada perangkat publik.
- Tidak ada backend dan tidak ada Supabase; seluruh data master disimpan lokal.

Build untuk Produksi
```bash
npm run build
npm run preview
```

Troubleshooting
- 404 atau error saat memanggil AI: Pastikan API key valid dan API diaktifkan.
- Hasil kosong: Pastikan SKJ dan daftar Pelatihan sudah terisi.
- Cache/refresh: Coba hard refresh (Ctrl/Cmd + F5).

Lisensi
- MIT — silakan gunakan dan modifikasi sesuai kebutuhan.


