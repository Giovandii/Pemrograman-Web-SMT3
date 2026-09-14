<?php
session_start();

// 1. Kosongkan semua data dalam array sesi
$_SESSION = [];

// 2. Hapus cookie sesi dari browser jika ada
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 3. Hancurkan sesi di server
session_destroy();

// 4. Buka sesi baru khusus untuk mengirim flash message sukses
session_start();
$_SESSION['flash'] = [
    'type' => 'success',
    'pesan' => 'Semua data sesi berhasil di-reset menjadi kosong.'
];

// 5. Alihkan kembali ke beranda
header('Location: index.php');
exit;