<?php
session_start();
require __DIR__ . '/../includes/koneksi.php';

// Inisialisasi counter
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
}

// 1. Periksa apakah sudah melebihi batas percobaan (maksimal 3 kali)
if ($_SESSION['login_attempts'] >= 3) {
    $_SESSION['flash'] = [
        'type' => 'error',
        'pesan' => 'Akun dikunci sementara karena 3x gagal login. Harap tunggu atau hubungi admin.'
    ];
    header('Location: login.php');
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    // 2. Jika Berhasil: Reset kembali counter menjadi 0
    unset($_SESSION['login_attempts']);

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['nama']    = $user['nama'];
    $_SESSION['role']    = $user['role'];
    header('Location: ../index.php');
    exit;
}

// 3. Jika Gagal: Naikkan counter dan hitung sisa kesempatan
$_SESSION['login_attempts']++;
$sisa = 3 - $_SESSION['login_attempts'];

$_SESSION['flash'] = [
    'type' => 'error',
    'pesan' => "Username atau password salah. (Sisa kesempatan: {$sisa})"
];
header('Location: login.php');
exit;