/**
 * api.js - API Client & Server Status Handler
 * Menghubungkan aplikasi ke server backend dan mendeteksi jika server mati.
 */

const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev";
const STORAGE_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/storage/";

function getServerDownUrl() {
  const path = window.location.pathname;
  if (path.includes("/pages/event/") || path.includes("/pages/tools/") || path.includes("/pages/auth/")) {
    return "../server-mati.html";
  } else if (path.includes("/pages/")) {
    return "server-mati.html";
  } else {
    return "pages/server-mati.html";
  }
}

/**
 * Wrapper fetch terpusat dengan penanganan timeout dan server mati
 * @param {string} endpoint - Path endpoint misal "/api/events" atau full URL
 * @param {object} options - Opsi fetch standar (method, body, headers, dll)
 * @returns {Promise<Response>}
 */
async function fetchAPI(endpoint, options = {}) {
  const isServerDownPage = window.location.pathname.includes("server-mati.html");

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const defaultHeaders = {
    "ngrok-skip-browser-warning": "true",
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 detik timeout
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    // Cek error status dari server/ngrok
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      if (!isServerDownPage) {
        window.location.href = getServerDownUrl();
      }
      throw new Error(`Server offline (Status ${response.status})`);
    }

    return response;
  } catch (error) {
    console.error("Gagal terhubung ke server:", error);
    if (!isServerDownPage) {
      // Simpan halaman asal agar tombol 'Coba Lagi' bisa redirect balik
      sessionStorage.setItem("last_attempted_page", window.location.href);
      window.location.href = getServerDownUrl();
    }
    throw error;
  }
}
