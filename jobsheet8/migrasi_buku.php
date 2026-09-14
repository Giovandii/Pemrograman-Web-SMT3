<?php
// migrasi_buku.php
require __DIR__ . '/includes/koneksi.php';

// Lokasi file data/buku.json dari jobsheet-06
$pathJson = __DIR__ . '/../jobsheet6/data/buku.json';

if (!file_exists($pathJson)) {
    die("File data JSON tidak ditemukan di: " . $pathJson);
}

// 1. Baca isi file JSON
$jsonContent = file_get_contents($pathJson);
$bukuList = json_decode($jsonContent, true);

if (!is_array($bukuList)) {
    die("Format data JSON tidak valid.");
}

// 2. Siapkan query INSERT
$stmt = $pdo->prepare(
    "INSERT INTO buku (judul, pengarang, tahun, isbn, stok, kategori)
     VALUES (:judul, :pengarang, :tahun, :isbn, :stok, :kategori)"
);

$berhasil = 0;
foreach ($bukuList as $buku) {
    $stmt->execute([
        'judul'     => $buku['judul'] ?? 'Tanpa Judul',
        'pengarang' => $buku['pengarang'] ?? 'Anonim',
        'tahun'     => (int) ($buku['tahun'] ?? 2024),
        'isbn'      => $buku['isbn'] ?? null,
        'stok'      => (int) ($buku['stok'] ?? 0),
        'kategori'  => $buku['kategori'] ?? null,
    ]);
    $berhasil++;
}

echo "<h3>Migrasi Selesai!</h3>";
echo "<p>Berhasil memindahkan {$berhasil} data buku dari JSON ke PostgreSQL.</p>";
echo "<p><a href='buku/list.php'>Lihat Daftar Buku</a></p>";