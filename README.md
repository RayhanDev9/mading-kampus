# 📋 Mading Campus — Rencana Perbaikan (Development Plan)

> Dokumen ini berisi daftar pekerjaan yang perlu diselesaikan, ditulis agar mudah dipahami oleh programmer pemula maupun AI assistant. Setiap tugas diberi penjelasan **kenapa**, **apa yang harus dilakukan**, dan **di file mana**.

---

## 📑 Daftar Isi

1. [Fix 1 — Redirect ke Login jika Belum Login](#fix-1--redirect-ke-login-jika-belum-login)
2. [Fix 2 — Halaman Server Mati](#fix-2--halaman-server-mati)
3. [Fix 3 — Buat Halaman Landing Page](#fix-3--buat-halaman-landing-page)
4. [Fix 4 — Rapihkan Struktur File HTML](#fix-4--rapihkan-struktur-file-html)
5. [Fix 5 — Hapus node_modules dari Git & Tambah .gitignore](#fix-5--hapus-node_modules-dari-git--tambah-gitignore)

---

## Status Pekerjaan

| No | Tugas                              | Status       |
|----|------------------------------------|--------------|
| 1  | Auth Guard (Redirect ke Login)     | ✅ Selesai   |
| 2  | Halaman Server Mati                | ✅ Selesai   |
| 3  | Halaman Landing Page               | ✅ Selesai   |
| 4  | Rapikan Struktur File HTML         | ✅ Selesai   |
| 5  | Hapus node_modules dari Git        | ✅ Selesai   |

---

## Fix 1 — Redirect ke Login jika Belum Login

### 🧠 Kenapa?
Halaman seperti `favorit.html`, `checkout.html`, dan `uploud.html` seharusnya **hanya bisa diakses oleh user yang sudah login**. Sekarang siapa saja bisa membuka halaman tersebut langsung dari URL, bahkan tanpa login.

### 📍 Di mana masalahnya?
Data login disimpan di `localStorage` dengan key `user_mading`. Jika belum login, data tersebut kosong/null. Tapi saat ini tidak ada yang mengecek hal itu di halaman-halaman yang butuh login.

### ✅ Yang Harus Dilakukan

**Langkah 1 — Buat file helper baru: `js/auth.js`**

File ini berisi satu fungsi: `cekLogin()`. Fungsi ini akan:
- Ambil data user dari `localStorage`
- Jika tidak ada → redirect otomatis ke `login.html`
- Jika ada → lanjut normal

```javascript
// js/auth.js

/**
 * Fungsi untuk memastikan user sudah login.
 * Panggil fungsi ini di bagian PALING ATAS setiap halaman yang butuh login.
 * Jika user belum login, akan otomatis diarahkan ke halaman login.
 */
function cekLogin() {
  const user = JSON.parse(localStorage.getItem("user_mading"));

  if (!user || !user.token) {
    // User belum login, arahkan ke halaman login
    alert("Kamu harus login terlebih dahulu!");
    window.location.href = "login.html";
  }
}

// Langsung jalankan pengecekan saat file ini dimuat
cekLogin();
```

**Langkah 2 — Panggil `auth.js` di setiap halaman yang butuh login**

Tambahkan tag `<script>` di file HTML berikut, **sebelum** script JS utama halaman tersebut:

| File HTML            | Script JS utama        | Tambahkan di atas           |
|----------------------|------------------------|-----------------------------|
| `favorit.html`       | `js/favorit.js`        | `<script src="js/auth.js">` |
| `checkout.html`      | `js/checkout.js`       | `<script src="js/auth.js">` |
| `uploud.html`        | `js/uploud.js`         | `<script src="js/auth.js">` |
| `select-event.html`  | `js/select-event.js`   | `<script src="js/auth.js">` |

**Contoh di `favorit.html`:**
```html
<!-- Tambahkan ini SEBELUM script favorit.js -->
<script src="js/auth.js"></script>
<script src="js/favorit.js"></script>
```

> ⚠️ **Jangan** tambahkan di `index.html`, `login.html`, `register.html` — halaman ini boleh diakses tanpa login.

---

## Fix 2 — Halaman Server Mati

### 🧠 Kenapa?
Project ini menggunakan **Ngrok** sebagai tunnel ke server backend. Ngrok bisa mati kapan saja (misalnya saat tidur, mati listrik, dll). Saat ini ketika server mati, user hanya melihat halaman kosong atau error yang tidak jelas di console browser.

### ✅ Yang Harus Dilakukan

**Langkah 1 — Buat halaman baru: `pages/server-mati.html`**

Halaman ini tampil ketika fetch ke server gagal. Desainnya harus jelas dan ramah pengguna, contohnya:
- Ikon server/wifi mati
- Pesan "Server sedang tidak tersedia"
- Tombol "Coba Lagi" (refresh halaman)

**Langkah 2 — Buat fungsi helper baru: `js/api.js`**

Bungkus semua pemanggilan `fetch()` dengan fungsi ini agar error-nya seragam:

```javascript
// js/api.js

const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev";

/**
 * Fungsi fetch yang sudah dilengkapi penanganan error server mati.
 * Gunakan ini sebagai pengganti fetch() biasa untuk memanggil API.
 *
 * @param {string} endpoint - Path API, contoh: "/api/events"
 * @param {object} options  - Opsi fetch (method, body, headers), opsional
 * @returns {Promise}       - Kembalikan response JSON jika berhasil
 */
async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(API_BASE_URL + endpoint, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Gagal menghubungi server:", error);
    window.location.href = "pages/server-mati.html";
  }
}
```

**Langkah 3 — Ganti `fetch()` biasa dengan `fetchAPI()` di semua JS**

File yang perlu diubah:
- `js/home.js`
- `js/favorit.js`
- `js/checkout.js`
- `js/select-event.js`
- `js/uploud.js`

**Contoh perubahan di `home.js`:**
```javascript
// ❌ Sebelum (cara lama)
const response = await fetch("https://...../api/events", {
  headers: { "ngrok-skip-browser-warning": "true" }
});
const data = await response.json();

// ✅ Sesudah (pakai fungsi baru)
const data = await fetchAPI("/api/events");
```

---

## Fix 3 — Buat Halaman Landing Page

### 🧠 Kenapa?
Sekarang `index.html` langsung menampilkan daftar event/acara. Idealnya ada **halaman perkenalan (landing page)** dulu yang menjelaskan apa itu Mading Campus, fitur-fiturnya, dan ajakan untuk login/daftar. Ini membuat aplikasi terlihat lebih profesional.

### ✅ Yang Harus Dilakukan

**Langkah 1 — Ubah fungsi file `index.html`**

`index.html` dijadikan **landing page** (halaman perkenalan). Pindahkan konten daftar event ke `pages/beranda.html`.

**Struktur landing page `index.html` yang perlu dibuat:**

```
┌─────────────────────────────────┐
│  Header / Navbar                │
├─────────────────────────────────┤
│  Hero Section                   │
│  "Temukan Acara Kampusmu"       │
│  [Tombol: Lihat Acara]          │
│  [Tombol: Daftar Sekarang]      │
├─────────────────────────────────┤
│  Fitur Unggulan                 │
│  📅 Acara    💰 Checkout         │
│  🔖 Favorit  🛠️ Mini Tools      │
├─────────────────────────────────┤
│  Footer                         │
└─────────────────────────────────┘
```

**Langkah 2 — Buat `pages/beranda.html`**

Pindahkan isi `index.html` (daftar event) ke sini. Update semua link di navbar yang mengarah ke `index.html` agar mengarah ke `pages/beranda.html`.

---

## Fix 4 — Rapihkan Struktur File HTML

### 🧠 Kenapa?
Sekarang semua file HTML (15 file) berada di root folder sejajar dengan `package.json`, `node_modules`, dll. Ini membuat project susah dibaca dan dikelola.

### 📁 Struktur Lama (Berantakan)

```
mading-campus/
├── index.html
├── login.html
├── register.html
├── favorit.html
├── checkout.html
├── uploud.html
├── select-event.html
├── mini-tools.html
├── tools-caption.html
├── tools-cropper.html
├── tools-exam.html
├── tools-mempis.html
├── tools-palet.html
├── tools-qr.html
├── tools-rmwbg.html
├── css/
├── js/
└── ...
```

### 📁 Struktur Baru (Terorganisir)

```
mading-campus/
├── index.html                  ← landing page (tetap di root)
├── pages/
│   ├── beranda.html            ← daftar event (pindahan dari index.html)
│   ├── auth/
│   │   ├── login.html
│   │   └── register.html
│   ├── event/
│   │   ├── favorit.html
│   │   ├── checkout.html
│   │   ├── uploud.html
│   │   └── select-event.html
│   ├── tools/
│   │   ├── mini-tools.html
│   │   ├── tools-caption.html
│   │   ├── tools-cropper.html
│   │   ├── tools-exam.html
│   │   ├── tools-mempis.html
│   │   ├── tools-palet.html
│   │   ├── tools-qr.html
│   │   └── tools-rmwbg.html
│   └── server-mati.html        ← halaman error server (dari Fix 2)
├── js/
│   ├── auth.js                 ← file baru (dari Fix 1)
│   ├── api.js                  ← file baru (dari Fix 2)
│   ├── home.js
│   ├── login.js
│   └── ...
├── css/
├── asset/
├── src/
├── package.json
└── .gitignore                  ← file baru (dari Fix 5)
```

### ✅ Yang Harus Dilakukan

**Langkah 1 — Buat folder `pages/`, `pages/auth/`, `pages/event/`, `pages/tools/`**

**Langkah 2 — Pindahkan file HTML ke folder yang sesuai**

> ⚠️ **PENTING:** Setelah memindahkan file HTML, semua **link antar halaman** dan **path script** harus diperbarui!

Contoh: Jika `favorit.html` dipindah ke `pages/event/favorit.html`, maka path ke CSS dan JS harus menyesuaikan:

```html
<!-- ❌ Path lama (tidak valid lagi) -->
<script src="js/favorit.js"></script>
<link rel="stylesheet" href="css/output.css">

<!-- ✅ Path baru (naik 2 level ke root dengan ../) -->
<script src="../../js/favorit.js"></script>
<link rel="stylesheet" href="../../css/output.css">
```

**Langkah 3 — Update semua link navigasi di navbar setiap halaman**

```html
<!-- ❌ Link lama -->
<a href="favorit.html">Favorit</a>

<!-- ✅ Link baru (dari root, misal di index.html) -->
<a href="pages/event/favorit.html">Favorit</a>
```

---

## Fix 5 — Hapus node_modules dari Git & Tambah .gitignore

### 🧠 Kenapa?
`node_modules` adalah folder berisi library yang diinstall oleh `npm`. Folder ini **tidak perlu di-commit ke Git** karena:
- Ukurannya sangat besar (ratusan MB)
- Siapa pun yang clone project bisa generate ulang hanya dengan `npm install`
- Git jadi sangat lambat

Sekarang `node_modules` sudah terlanjur ter-commit dan harus dibersihkan.

### ✅ Yang Harus Dilakukan

**Langkah 1 — Buat file `.gitignore` di root project**

```gitignore
# Folder dependency - jangan di-commit
node_modules/

# File OS
.DS_Store
Thumbs.db

# File editor (opsional, sesuaikan kebutuhan)
# .vscode/
```

**Langkah 2 — Hapus `node_modules` dari tracking Git (file lokal tetap ada)**

```bash
git rm -r --cached node_modules
```

> 💡 Flag `--cached` artinya "hapus dari Git saja, jangan hapus dari komputer". File `node_modules` di komputer kamu **tetap ada** dan tidak terhapus.

**Langkah 3 — Commit dan push perubahan**

```bash
git add .gitignore
git commit -m "chore: add .gitignore and remove node_modules from tracking"
git push
```

**Langkah 4 — Verifikasi berhasil**

```bash
git status
# Harusnya node_modules tidak muncul sebagai file yang dimodifikasi
```

---

## 🚀 Urutan Pengerjaan yang Disarankan

Kerjakan sesuai urutan ini agar tidak saling mengganggu:

```
[1] Fix 5 dulu  → Bersihkan Git dari node_modules (tidak ada perubahan code)
[2] Fix 4       → Rapikan struktur folder (pindah-pindah file HTML)
[3] Fix 3       → Buat landing page (setelah struktur folder sudah rapi)
[4] Fix 1 & 2   → Auth guard & halaman server mati (setelah semua halaman di tempat yang benar)
```

---

## 📝 Catatan Tambahan

- **API Base URL** saat ini hardcode di setiap file JS. Setelah Fix 2, semua URL terpusat di `js/api.js` — lebih mudah diubah kalau URL Ngrok-nya ganti.
- **localStorage key** yang dipakai untuk data user: `user_mading`. Jangan sampai berubah selama pengerjaan.
- Setelah Fix 4, **wajib test semua halaman** satu per satu di browser untuk memastikan semua link dan script masih benar.
