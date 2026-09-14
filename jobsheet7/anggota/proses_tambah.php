<?php
session_start();

$nama = trim($_POST['nama'] ?? '');
$noAnggota = trim($_POST['no_anggota'] ?? '');
$alamat = trim($_POST['alamat'] ?? '');
$noHp = trim($_POST['no_hp'] ?? '');

$errors = [];
if ($nama === '') {
    $errors[] = "Nama wajib diisi.";
}
if ($noAnggota === '') {
    $errors[] = "No. Anggota wajib diisi.";
} elseif (strlen($noAnggota) < 3) {
    $errors[] = "No. Anggota minimal terdiri dari 3 karakter.";
}

// Validasi No. HP (opsional, tapi jika diisi harus berformat nomor telepon valid)
if ($noHp !== '') {
    if (!preg_match('/^[0-9+\s-]+$/', $noHp) || strlen(str_replace([' ', '-', '+'], '', $noHp)) < 10) {
        $errors[] = "Nomor HP tidak valid (minimal 10 digit angka).";
    }
}

// Validasi Alamat (misal jika ingin mewajibkan alamat)
if ($alamat === '') {
    $errors[] = "Alamat wajib diisi.";
}

if (!empty($errors)) {
    $_SESSION['flash'] = ['type' => 'error', 'pesan' => implode(' ', $errors)];
    header('Location: tambah.php');
    exit;
}

if (!isset($_SESSION['anggota'])) {
    $_SESSION['anggota'] = [];
}

$_SESSION['anggota'][] = [
    'nama' => $nama,
    'no_anggota' => $noAnggota,
    'alamat' => $alamat,
    'no_hp' => $noHp,
];

$_SESSION['flash'] = ['type' => 'success', 'pesan' => 'Anggota berhasil ditambahkan.'];
header('Location: list.php');
exit;
