<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require __DIR__ . '/../includes/koneksi.php';

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['nama']    = $user['nama'];
    $_SESSION['role']    = $user['role'];

    // --- TAMBAHAN NOMOR 2: Set Cookie jika dicentang ---
    if (!empty($_POST['remember'])) {
        // Berlaku selama 7 hari (7 * 24 * 3600 detik)
        $kadaluwarsa = time() + (7 * 24 * 60 * 60);
        setcookie('remember_user', $user['id'], $kadaluwarsa, "/", "", false, true);
    }

    header('Location: ../index.php');
    exit;
}

$_SESSION['flash'] = ['type' => 'error', 'pesan' => 'Username atau password salah.'];
header('Location: login.php');
exit;
