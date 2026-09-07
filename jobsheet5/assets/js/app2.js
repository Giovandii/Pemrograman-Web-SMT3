// ===== 1. Hamburger Menu (Nav Toggle) =====
function initNavToggle() {
    const toggleBtn = document.getElementById("nav-toggle-btn");
    const nav = document.querySelector("header nav");
    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        nav.classList.toggle("nav-open");
    });
}

// ===== 2. Counter Jumlah Baris Data (Latihan 4) =====
function updateTableCounter() {
    const counterEl = document.getElementById("table-counter");
    const table = document.querySelector(".table-responsive table");
    if (!counterEl || !table) return;

    const allRows = table.querySelectorAll("tbody tr");
    const visibleRows = Array.from(allRows).filter(row => row.style.display !== "none");

    counterEl.textContent = "Menampilkan " + visibleRows.length + " dari " + allRows.length + " data";
}

// ===== 3. Konfirmasi Hapus Data (Latihan 4: memperbarui counter setelah hapus) =====
function initHapusConfirm() {
    document.querySelectorAll(".btn-hapus").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const row = btn.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            const yakin = confirm("Yakin ingin menghapus \"" + nama + "\"?");
            if (yakin && row) {
                row.remove();
                updateTableCounter(); // Perbarui counter setelah baris dihapus
            }
        });
    });
}

// ===== 4. Filter Tabel Real-Time Khusus Kolom Utama (Latihan 3 & 4) =====
function initTableFilter() {
    const input = document.getElementById("search-input");
    const table = document.querySelector(".table-responsive table");
    if (!input || !table) return;

    input.addEventListener("keyup", function () {
        const keyword = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach(function (row) {
            // Latihan 3: Mengambil teks hanya dari sel/kolom pertama (Judul / No. Anggota / Nama)
            const cellUtama = row.querySelector("td");
            const teksUtama = cellUtama ? cellUtama.textContent.toLowerCase() : "";
            
            // Cocokkan keyword khusus dengan kolom utama
            row.style.display = teksUtama.includes(keyword) ? "" : "none";
        });

        // Latihan 4: Perbarui angka counter setiap kali filter diketik
        updateTableCounter();
    });
}

// ===== 5. Helper Validasi Form (Client-side) =====
function tampilkanError(input, pesan) {
    hapusError(input);
    const span = document.createElement("span");
    span.className = "error";
    span.textContent = pesan;
    input.insertAdjacentElement("afterend", span);
}

function hapusError(input) {
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error")) {
        next.remove();
    }
}

// ===== 6. Refactor Validasi Form & Validasi ISBN (Latihan 1 & 5) =====
function initValidasiForm() {
    const form = document.getElementById("form-tambah");
    if (!form) return;

    // Latihan 5: Array daftar aturan validasi (rules array loop)
    const rules = [
        {
            selector: "[name='judul'], [name='nama']",
            validate: el => el.value.trim() !== "",
            message: "Field ini wajib diisi."
        },
        {
            selector: "[name='pengarang']",
            validate: el => el.value.trim() !== "",
            message: "Pengarang wajib diisi."
        },
        {
            selector: "[name='no_anggota']",
            validate: el => el.value.trim() !== "",
            message: "No. Anggota wajib diisi."
        },
        {
            selector: "[name='tahun']",
            validate: el => {
                const nilai = parseInt(el.value, 10);
                return !isNaN(nilai) && nilai >= 1900 && nilai <= 2026;
            },
            message: "Tahun harus di antara 1900-2026."
        },
        {
            selector: "[name='stok']",
            validate: el => {
                const nilai = parseInt(el.value, 10);
                return !isNaN(nilai) && nilai >= 0;
            },
            message: "Stok tidak boleh negatif."
        },
        // Latihan 1: Validasi ISBN (opsional, jika diisi hanya boleh angka & tanda hubung)
        {
            selector: "[name='isbn']",
            validate: el => {
                const val = el.value.trim();
                if (val === "") return true; // Boleh kosong
                return /^[0-9-]+$/.test(val); // Regex angka dan '-'
            },
            message: "ISBN hanya boleh berisi angka dan tanda hubung (-)."
        }
    ];

    form.addEventListener("submit", function (e) {
        let valid = true;

        // Loop array rules untuk mengecek setiap field
        rules.forEach(rule => {
            const el = form.querySelector(rule.selector);
            if (el) {
                if (!rule.validate(el)) {
                    tampilkanError(el, rule.message);
                    valid = false;
                } else {
                    hapusError(el);
                }
            }
        });

        if (!valid) {
            e.preventDefault();
        }
    });
}

// Inisialisasi saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
    initNavToggle();
    initHapusConfirm();
    initTableFilter();
    initValidasiForm();
    updateTableCounter(); // Tampilkan counter awal
});