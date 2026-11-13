# Web Undangan Digital Online - Blue Butterfly (Siti Ami & Abdul Azis)
## Serta Walimatul Khitan: Andiks Satria & Raditya Panca

Website undangan pernikahan & khitanan online modern bergaya web scroll alami (*smooth scrolling*) yang interaktif, responsif di semua ukuran layar, dan dilengkapi integrasi cloud database **Supabase** serta siap deploy ke **Vercel** (100% Gratis).

---

## 💍 Data Acara

- **Mempelai Wanita**: **Siti Ami**
  - Putri Kedua dari: **Bpk. Sukmi & Ibu Eli**
- **Mempelai Pria**: **Abdul Azis**
  - Putra Kedua dari: **Bpk. Sarip & Ibu Ruminah**
- **Walimatul Khitan**: **Andiks Satria Dan Raditya Panca**
- **Hari & Tanggal**: **Minggu Malam Senin, 06 Desember 2026** (26 Jumadil Akhir 1448 H)
- **Akad Nikah**: Pukul 08.00 - 09.00 WIB
- **Resepsi & Khitanan**: Pukul 09.00 WIB s/d Selesai
- **Tempat / Lokasi**: Kediaman Mempelai Wanita  
  **Kp. Buah Gede RT. 009 RW. 005 Ds. Sentul Kec. Kragilan Kab. Serang - Banten**

---

## ☁️ Integrasi Cloud Database (Supabase) & Hosting (Vercel)

Undangan ini telah dilengkapi sistem penyimpanan cloud online agar RSVP & Buku Tamu tersinkronisasi antar-semua HP/perangkat tamu dan pengantin secara *real-time*.

### 1. Cara Setup Database Supabase Gratis (Hanya 2 Menit):
1. Buka [https://supabase.com](https://supabase.com) dan buat akun (gratis).
2. Buat project baru (misal nama project: `undangan-ami-azis`).
3. Di bilah menu kiri Supabase, klik **SQL Editor** &gt; **New query**.
4. Buka file [`supabase_schema.sql`](supabase_schema.sql) dari repo ini, salin seluruh kodenya, tempel di SQL Editor Supabase, lalu klik tombol **Run**.
5. Buka menu **Project Settings** &gt; **API**. Salin dua nilai berikut:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **Project API Keys (anon / public)** (contoh: `eyJhbGciOi...`)
6. Masukkan kedua nilai tersebut ke dalam file [`js/supabase-client.js`](js/supabase-client.js) pada bagian `CONFIG.URL` dan `CONFIG.ANON_KEY`, **atau** langsung masukkan melalui tombol **"Konfigurasi Supabase"** di halaman [`admin.html`](admin.html).

### 2. Cara Deploy ke Vercel (100% Gratis):
1. Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik tombol **Add New...** &gt; **Project**.
3. Pilih repository GitHub: `https://github.com/EasyItsMe/digital-invitation.git`.
4. (Opsional) Pada bagian **Environment Variables**, tambahkan:
   - `SUPABASE_URL` = (Project URL Supabase Anda)
   - `SUPABASE_ANON_KEY` = (Anon Public Key Supabase Anda)
5. Klik tombol **Deploy**!
6. Dalam hitungan 15 detik, website Anda sudah aktif secara online di domain Vercel (contoh: `https://digital-invitation-six.vercel.app`).

---

## 🔒 Halaman Khusus Pengantin (Rekap RSVP)

Tamu undangan tidak dapat melihat daftar kehadiran tamu lain. Rekapitulasi RSVP, ucapan doa, filter kehadiran, dan jumlah tamu hadir dapat diakses khusus oleh kedua mempelai melalui:
👉 **`admin.html`**

**Kata Sandi Pengantin:**
- `ami-azis-2026`
- `amiazi2026`
- `123456`
- `pengantin`

Di halaman ini, pengantin dapat:
- Melihat total respon, jumlah orang hadir (*pax*), tidak hadir, dan ragu-ragu secara *live*.
- Menyaring berdasarkan kehadiran (*Hadir, Tidak Hadir, Masih Ragu*).
- Mencari nama tamu atau kata dalam ucapan.
- Menyalin (*copy*) ringkasan rekapitulasi kehadiran dengan 1 klik ke clipboard untuk dikirim ke WhatsApp / keluarga.
- Menghapus ucapan yang tidak diinginkan langsung dari database cloud.

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Melalui Batch Script**:
   Klik ganda [`run.bat`](run.bat). Browser akan membuka:
   `http://localhost:8080/index.html?to=Tamu+Undangan`
2. **Buka Langsung**:
   Klik ganda [`index.html`](index.html) di file explorer.
