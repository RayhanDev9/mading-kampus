/**
 * auth.js - Auth Guard untuk Mading Campus
 * Memastikan user sudah login sebelum mengakses halaman tertentu.
 */

function getLoginUrl() {
  const path = window.location.pathname;
  if (path.includes("/pages/event/") || path.includes("/pages/tools/")) {
    return "../auth/login.html";
  } else if (path.includes("/pages/auth/")) {
    return "login.html";
  } else if (path.includes("/pages/")) {
    return "auth/login.html";
  } else {
    return "pages/auth/login.html";
  }
}

function getHomeUrl() {
  const path = window.location.pathname;
  if (path.includes("/pages/event/") || path.includes("/pages/tools/") || path.includes("/pages/auth/")) {
    return "../beranda.html";
  } else if (path.includes("/pages/")) {
    return "beranda.html";
  } else {
    return "pages/beranda.html";
  }
}

/**
 * Cek apakah user sudah login.
 * Jika belum, redirect otomatis ke halaman login.
 */
function cekLogin() {
  try {
    const userString = localStorage.getItem("user_mading");
    if (!userString) {
      alert("Anda harus login terlebih dahulu!");
      window.location.href = getLoginUrl();
      return false;
    }

    const user = JSON.parse(userString);
    if (!user || (!user.token && !user.id && !user.username && !user.email)) {
      alert("Sesi login tidak valid. Silakan login kembali.");
      localStorage.removeItem("user_mading");
      window.location.href = getLoginUrl();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth check error:", error);
    localStorage.removeItem("user_mading");
    window.location.href = getLoginUrl();
    return false;
  }
}

/**
 * Fungsi logout global
 */
function logoutUser() {
  localStorage.removeItem("user_mading");
  window.location.href = getLoginUrl();
}

// Jalankan cek login saat file ini di-load
cekLogin();
