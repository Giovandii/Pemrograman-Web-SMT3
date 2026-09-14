// Variabel global untuk menyimpan data buku hasil fetch agar bisa difilter & diurutkan
let dataBukuGlobal = [];

// Mengambil & menampilkan Daftar Buku secara asinkron dari data/buku.json
async function muatDaftarBuku() {
    const tbody = document.querySelector(".table-responsive table tbody");
    const loading = document.getElementById("loading-indicator");
    const counter = document.getElementById("data-counter");
    if (!tbody) return;

    if (loading) loading.style.display = "block";
    tbody.innerHTML = "";
    if (counter) counter.textContent = "Memuat data dari server...";

    try {
        // Simulasi delay jaringan (600ms) agar loading indicator terlihat
        await new Promise((resolve) => setTimeout(resolve, 600));

        const res = await fetch("../data/buku.json");
        if (!res.ok) {
            throw new Error("Gagal mengambil data (status " + res.status + ")");
        }
        
        // Simpan data hasil fetch ke variabel global
        dataBukuGlobal = await res.json();

        // Tampilkan data ke tabel (dengan pengurutan aktif)
        prosesDanTampilkanBuku();

    } catch (err) {
        tbody.innerHTML =
            "<tr><td colspan=\"5\">Gagal memuat data: " + err.message + "</td></tr>";
        if (counter) counter.textContent = "Gagal memuat data.";
    } finally {
        if (loading) loading.style.display = "none";
    }
}

// Fungsi untuk memproses sorting dan merender baris ke tabel
function prosesDanTampilkanBuku() {
    const tbody = document.querySelector(".table-responsive table tbody");
    const counter = document.getElementById("data-counter");
    const sortSelect = document.getElementById("sort-select");
    if (!tbody) return;

    // Buat salinan data agar data asli tidak rusak
    let daftarBuku = [...dataBukuGlobal];
    const kriteriaSort = sortSelect ? sortSelect.value : "default";

    // Latihan 4: Logika Sorting / Pengurutan Data
    if (kriteriaSort === "judul-asc") {
        daftarBuku.sort((a, b) => a.judul.localeCompare(b.judul));
    } else if (kriteriaSort === "judul-desc") {
        daftarBuku.sort((a, b) => b.judul.localeCompare(a.judul));
    } else if (kriteriaSort === "tahun-desc") {
        daftarBuku.sort((a, b) => b.tahun - a.tahun);
    } else if (kriteriaSort === "tahun-asc") {
        daftarBuku.sort((a, b) => a.tahun - b.tahun);
    }

    tbody.innerHTML = "";

    // Render baris ke tabel
    daftarBuku.forEach(function (buku) {
        const tr = document.createElement("tr");

        // Latihan 2: Badge status stok (Habis / Ada)
        let stokHtml = "";
        if (buku.stok === 0) {
            stokHtml = '<span class="badge-stok habis">Habis (0)</span>';
        } else {
            stokHtml = '<span class="badge-stok ada">' + buku.stok + '</span>';
        }

        tr.innerHTML =
            "<td>" + buku.judul + "</td>" +
            "<td>" + buku.pengarang + "</td>" +
            "<td>" + buku.tahun + "</td>" +
            "<td>" + stokHtml + "</td>" +
            "<td>" +
            "<button type=\"button\">Edit</button> " +
            "<button type=\"button\" class=\"btn-hapus\">Hapus</button>" +
            "</td>";

        tbody.appendChild(tr);
    });

    // Latihan 3: Update counter data asinkron
    if (counter) {
        counter.textContent = "Total: " + daftarBuku.length + " buku berhasil dimuat.";
    }
}

// Inisialisasi event listener saat DOM siap
document.addEventListener("DOMContentLoaded", function () {
    muatDaftarBuku();

    // Latihan 1: Tombol Refresh Data
    const btnRefresh = document.getElementById("btn-refresh");
    if (btnRefresh) {
        btnRefresh.addEventListener("click", muatDaftarBuku);
    }

    // Latihan 4: Event listener perubahan dropdown sorting
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", prosesDanTampilkanBuku);
    }
});

// ===== Uji Delegasi Event Lebih Jauh (Poin d) =====
function initEventDelegationSuper() {
    // 1. Delegasi Klik Tombol (Hapus, Edit, Detail)
    document.addEventListener("click", function (e) {
        // A. Delegasi Tombol Hapus (.btn-hapus)
        const btnHapus = e.target.closest(".btn-hapus");
        if (btnHapus) {
            const row = btnHapus.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            if (confirm("Yakin ingin menghapus \"" + nama + "\"?")) {
                row.remove();
            }
            return;
        }

        // B. Delegasi Tombol Edit (.btn-edit)
        const btnEdit = e.target.closest(".btn-edit");
        if (btnEdit) {
            const row = btnEdit.closest("tr");
            const nama = row ? row.querySelector("td")?.textContent : "data ini";
            alert("Membuka form edit untuk: " + nama);
            return;
        }

        // C. Delegasi Tombol Detail (.btn-detail)
        const btnDetail = e.target.closest(".btn-detail");
        if (btnDetail) {
            const row = btnDetail.closest("tr");
            const cols = row ? row.querySelectorAll("td") : [];
            let info = "DETAIL DATA:\n";
            cols.forEach((col, idx) => {
                if (idx < cols.length - 1) { // Abaikan kolom aksi
                    info += "- " + col.textContent + "\n";
                }
            });
            alert(info);
            return;
        }

        // D. Delegasi Klik Baris Tabel (Highlight / Selector Baris)
        const rowSelect = e.target.closest("tbody tr");
        if (rowSelect && !e.target.closest("button")) {
            // Hapus highlight dari baris lain
            document.querySelectorAll("tbody tr").forEach(tr => tr.classList.remove("row-selected"));
            // Tambahkan highlight pada baris yang diklik
            rowSelect.classList.add("row-selected");
        }
    });
}

// Panggil fungsi delegasi saat halaman siap
document.addEventListener("DOMContentLoaded", initEventDelegationSuper);

