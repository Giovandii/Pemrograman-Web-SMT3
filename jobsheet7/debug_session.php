<?php
$page_title = "Debug Session";
include __DIR__ . '/includes/header.php';
?>
        <section>
            <h2>Debug Data $_SESSION</h2>
            <p>Halaman ini menampilkan seluruh data yang sedang tersimpan di sesi server saat ini:</p>
            
            <pre style="background: #f4f6f8; padding: 1rem; border-radius: 6px; border: 1px solid #ddd; overflow-x: auto;"><?php 
                print_r($_SESSION); 
            ?></pre>

            <p style="margin-top: 1rem;">
                <a href="<?php echo $base; ?>index.php">&larr; Kembali ke Beranda</a>
            </p>
        </section>
<?php include __DIR__ . '/includes/footer.php'; ?>