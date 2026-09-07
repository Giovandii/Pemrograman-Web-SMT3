// ===== Hamburger menu (JS-driven, menggantikan checkbox hack) =====
function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        nav.classList.toggle("nav-open");
    });
}

// ===== Konfirmasi hapus (front-end only, belum ke server) =====
function initHapusConfirm() {
    document.querySelectorAll(".btn-hapus").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const row = btn.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
            if (yakin && row) {
                row.remove();
            }
        });
    });
}

// ===== Filter/pencarian tabel real-time =====
function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector(".table-responsive table");
    if (!input || !table) return;

    input.addEventListener("keyup", function () {
        const keyword = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach(function (row) {
            const teks = row.textContent.toLowerCase();
            row.style.display = teks.includes(keyword) ? "" : "none";
        });
    });
}

// ===== Validasi form (client-side) =====
function tampilkanError(input, pesan) {
    hapusError(input);                                                      //memanggil fungsi lain (§7.4) untuk membersihkan dulu pesan error lama (kalau ada) sebelum menambah yang baru — mencegah dua pesan error menumpuk untuk field yang sama
    const span = document.createElement("span");                            //method DOM untuk membuat elemen HTML baru dari kode JavaScript, sepenuhnya belum ada di HTML manapun sampai baris ini dijalankan.
    span.className = "error";                                               // memberi elemen <span> yang baru dibuat itu atribut class="error", menghubungkannya ke gaya CSS .error
    span.textContent = pesan;                                               //mengisi teks di dalam <span> itu dengan pesan error yang diberikan (misalnya "Field ini wajib diisi.")
    input.insertAdjacentElement("afterend", span);                          //menyisipkan elemen baru ke posisi tertentu tanpa perlu tau struktur dom disekelilingnya
}

function hapusError(input) {
    const next = input.nextElementSibling;                  //memeriksa apakah elemen sibling berikutnya punya class eror?
    if (next && next.classList.contains("error")) {         //jika ada maka akan dihapus oleh .remove
        next.remove();
    }
}

function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    form.addEventListener("submit", function (e) {                              //jika kondisi valid akan diubah menjadi false agar tidak muncul peringatan
        let valid = true;

        const judul = form.querySelector("[name='judul'], [name='nama']");
        if (judul && judul.value.trim() === "") {                               //jika kondisi ini kosong maka tampilkan eror
            tampilkanError(judul, "Field ini wajib diisi.");
            valid = false;
        } else if (judul) {                                                     //jika ada isinya maka tidak usah tampilkan eror
            hapusError(judul);
        }

        const pengarang = form.querySelector("[name='pengarang']");
        if (pengarang && pengarang.value.trim() === "") {
            tampilkanError(pengarang, "Pengarang wajib diisi.");
            valid = false;
        } else if (pengarang) {
            hapusError(pengarang);
        }

        const tahun = form.querySelector("[name='tahun']");
        if (tahun) {
            const nilai = parseInt(tahun.value, 10);
            if (isNaN(nilai) || nilai < 1900 || nilai > 2026) {
                tampilkanError(tahun, "Tahun harus di antara 1900-2026.");
                valid = false;
            } else {
                hapusError(tahun);
            }
        }

        const stok = form.querySelector("[name='stok']");
        if (stok) {
            const nilai = parseInt(stok.value, 10);
            if (isNaN(nilai) || nilai < 0) {
                tampilkanError(stok, "Stok tidak boleh negatif.");
                valid = false;
            } else {
                hapusError(stok);
            }
        }

        const isbn = form.querySelector("[name='isbn']"); // <-- Memakai const untuk menangkap elemen HTML
        if (isbn) {
            const nilaiIsbn = isbn.value.trim(); // <-- Memakai const untuk teks ISBN
            if (nilaiIsbn !== "" && !/^[0-9-]+$/.test(nilaiIsbn)) {
                tampilkanError(isbn, "ISBN hanya boleh berisi angka dan tanda hubung (-).");
                valid = false; // <-- Memakai let (bukan const) karena nilainya diubah dari true jadi false
            } else {
                hapusError(isbn);
            }
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
});