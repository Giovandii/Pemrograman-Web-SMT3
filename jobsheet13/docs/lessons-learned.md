# Refleksi & Lessons Learned — Perjalanan Pengembangan SIMPUS-Mini
**Penulis:** Giovandi  
**Mata Kuliah:** Pemrograman Web (Semester 3) — Politeknik Negeri Malang  
**Proyek:** Sistem Informasi Perpustakaan Mini (Jobsheet 01 s/d Jobsheet 13)

---

## 1. Ringkasan Perjalanan Proyek

Membangun SIMPUS-Mini dari Jobsheet 01 hingga Jobsheet 13 bukan sekadar membuat halaman web yang "bisa tampil", melainkan memahami evolusi arsitektur web modern secara bertahap:
* **Fase Frontend (JS 01 - 06):** Berawal dari HTML5 semantik murni, styling responsif CSS Grid/Flexbox, interaktivitas DOM, hingga pemanggilan asynchronous via Fetch API.
* **Fase Backend & Database (JS 07 - 09):** Beralih ke pemrosesan sisi server dengan PHP, pengelolaan sesi (`$_SESSION`), koneksi PostgreSQL via PDO, hingga implementasi siklus penuh CRUD dengan paginasi dan pencarian server-side.
* **Fase Keamanan & Integritas Transaksi (JS 10 - 12):** Mengamankan sistem dengan hashing password Bcrypt, route guard, penangkal XSS/CSRF, hingga transaksi database ACID dengan pencegahan race condition.
* **Fase Rilis & Dokumentasi (JS 13):** Memisahkan konfigurasi lingkungan kerja (*Environment Variables*) dan menyusun dokumentasi sistem standar industri.

---

## 2. Tiga Konsep Paling Menantang & Solusinya

Dari seluruh modul praktikum, berikut adalah 3 topik paling kompleks dan krusial yang dipelajari:

### A. Integritas Transaksi & Mitigasi Race Condition (Jobsheet 12)
* **Tantangan:**  
  Dalam sistem peminjaman buku, proses melibatkan beberapa tabel sekaligus (`peminjaman` dan `buku`). Jika dua petugas meminjamkan buku yang sama (sisa stok 1) pada detik yang persis bersamaan, pengecekan `if ($stok > 0)` biasa akan lolos untuk kedua belah pihak, mengakibatkan stok buku bernilai negatif (-1).
* **Solusi & Pemahaman:**  
  Menerapkan transaksi atomik PDO (`beginTransaction()`, `commit()`, `rollBack()`) dipadukan dengan klausa penguncian baris PostgreSQL:
  ```sql
  SELECT stok FROM buku WHERE id = :id FOR UPDATE;
  ```
  Baris data buku dikunci di level database hingga transaksi selesai, memaksa proses lain mengantre. Jika terjadi kesalahan di tengah jalan, seluruh operasi dibatalkan secara bersih tanpa menyisakan data yatim (*orphan data*).

---

### B. Arsitektur Keamanan Bertingkat: XSS, CSRF, & SQL Injection (Jobsheet 10 - 11)
* **Tantangan:**  
  Memahami bahwa validasi form di frontend (JavaScript/HTML5) hanyalah *user experience* dan sama sekali bukan sistem keamanan, karena request HTTP dapat dimanipulasi dengan mudah menggunakan tools seperti Postman atau cURL.
* **Solusi & Pemahaman:**  
  Menerapkan prinsip pertahanan berlapis (*Defense in Depth*):
  1. **SQL Injection:** Dieliminasi total menggunakan *Prepared Statements* berparameter PDO, bukan penggabungan string query secara manual.
  2. **Cross-Site Scripting (XSS):** Seluruh output dinamis dari pengguna wajib disanitasi saat dicetak ke HTML menggunakan fungsi pembungkus `htmlspecialchars()` (`e()`).
  3. **Cross-Site Request Forgery (CSRF):** Setiap formulir POST dilindungi token acak berbasis kriptografi aman (`random_bytes(32)`) yang diverifikasi menggunakan perbandingan *timing-safe* (`hash_equals()`).
  4. **Autentikasi Aman:** Password pengguna tidak pernah disimpan dalam bentuk teks asli, melainkan di-hash searah menggunakan algoritma adaptif `password_hash(..., PASSWORD_DEFAULT)` (Bcrypt) dan dicek via `password_verify()`.

---

### C. Pemisahan Konfigurasi Lingkungan Kerja (Twelve-Factor App) (Jobsheet 13)
* **Tantangan:**  
  Kebiasaan menulis kredensial database (username, password, nama host) langsung di dalam file `koneksi.php`. Cara ini berbahaya jika kode diunggah ke repositori publik dan kaku ketika aplikasi harus dipindahkan ke server produksi dengan kredensial berbeda.
* **Solusi & Pemahaman:**  
  Memisahkan konfigurasi ke file mandiri `includes/config.php` yang membaca variabel lingkungan sistem operasi via `getenv()`. 
  Memahami nuansa teknis bahwa `getenv()` menghasilkan boolean `false` saat variabel tidak ditemukan, sehingga wajib menggunakan **operator Elvis (`?:`)** bukan null coalescing (`??`) agar nilai cadangan (*default*) dapat terpanggil dengan tepat:
  ```php
  'db_host' => getenv('DB_HOST') ?: 'localhost',
  ```

---

## 3. Bekal Penting Menghadapi Evaluasi & Presentasi UAS

Dari pengalaman membangun SIMPUS-Mini, ada 3 prinsip utama yang siap dipertahankan di hadapan dosen penguji:

1. **"Never Trust User Input":** Semua data yang masuk dari form/URL wajib divalidasi dan di-sanitize di sisi backend sebelum diproses ke database.
2. **"Idempotency & State Changing":** Operasi yang mengubah data (Delete, Update, Insert) wajib menggunakan method `POST` dengan proteksi CSRF, tidak boleh menggunakan method `GET`.
3. **"Separation of Concerns":** Kode program, konfigurasi server, skema database, dan dokumentasi dipisahkan secara modular agar sistem mudah dirawat (*maintainable*) dan siap dikembangkan lebih lanjut.
