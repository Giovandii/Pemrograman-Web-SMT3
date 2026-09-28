<?php
$host = "localhost";
$port = "5432";
$db   = "simpus_mini_giovandi";
$user = "postgres";
$pass = "Kurapostgres";

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Catat detail asli ke log server (tidak terlihat oleh publik)
    error_log($e->getMessage());
    // Tampilkan pesan umum yang aman
    die("Koneksi database gagal.");
}
