// ===== Fungsi Generik Memuat Data JSON ke Tabel (Poin b) =====
async function muatDataTabel(urlJson, renderRowCallback) {
    const tbody = document.querySelector(".table-responsive table tbody");
    const loading = document.getElementById("loading-indicator");
    const counter = document.getElementById("data-counter");
    if (!tbody) return;

    if (loading) loading.style.display = "block";
    tbody.innerHTML = "";

    try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulasi delay

        const res = await fetch(urlJson);
        if (!res.ok) {
            throw new Error("Gagal mengambil data (status " + res.status + ")");
        }
        const dataList = await res.json();

        // Render baris menggunakan fungsi callback generik
        dataList.forEach(function (item) {
            const tr = document.createElement("tr");
            tr.innerHTML = renderRowCallback(item);
            tbody.appendChild(tr);
        });

        if (counter) {
            counter.textContent = "Total: " + dataList.length + " data berhasil dimuat.";
        }

    } catch (err) {
        tbody.innerHTML = "<tr><td colspan=\"6\">Gagal memuat data: " + err.message + "</td></tr>";
    } finally {
        if (loading) loading.style.display = "none";
    }
}

// Inisialisasi Otomatis Berdasarkan Halaman yang Sedang Dibuka
document.addEventListener("DOMContentLoaded", function () {
    const isPageBuku = document.querySelector("table th")?.textContent.includes("Judul");
    const isPageAnggota = document.querySelector("table th")?.textContent.includes("No. Anggota");

    if (isPageBuku) {
        // Panggil fungsi generik untuk Halaman Buku
        muatDataTabel("../data/buku.json", function (buku) {
            const stokBadge = buku.stok === 0 
                ? '<span class="badge-stok habis">Habis (0)</span>' 
                : '<span class="badge-stok ada">' + buku.stok + '</span>';

            return "<td>" + buku.judul + "</td>" +
                   "<td>" + buku.pengarang + "</td>" +
                   "<td>" + buku.kategori + "</td>" + // Kolom baru Kategori (Poin c)
                   "<td>" + buku.tahun + "</td>" +
                   "<td>" + stokBadge + "</td>" +
                   "<td>" +
                   "<button type=\"button\" class=\"btn-detail\">Detail</button> " +
                   "<button type=\"button\" class=\"btn-edit\">Edit</button> " +
                   "<button type=\"button\" class=\"btn-hapus\">Hapus</button>" +
                   "</td>";
        });
    } else if (isPageAnggota) {
        // Panggil fungsi generik untuk Halaman Anggota
        muatDataTabel("../data/anggota.json", function (anggota) {
            return "<td>" + anggota.no_anggota + "</td>" +
                   "<td>" + anggota.nama + "</td>" +
                   "<td>" + anggota.alamat + "</td>" +
                   "<td>" + anggota.no_hp + "</td>" +
                   "<td>" +
                   "<button type=\"button\" class=\"btn-detail\">Detail</button> " +
                   "<button type=\"button\" class=\"btn-edit\">Edit</button> " +
                   "<button type=\"button\" class=\"btn-hapus\">Hapus</button>" +
                   "</td>";
        });
    }
});