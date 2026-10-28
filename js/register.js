// Pakai link Ngrok yang udah statis
const API_REGISTER_URL = typeof API_BASE_URL !== "undefined" ? `${API_BASE_URL}/api` : "https://slab-silenced-riot.ngrok-free.dev/api";

// 1. Fungsi Cek Status Admin (Jalan otomatis saat web dibuka)
async function cekStatusAdmin() {
  try {
    const response = typeof fetchAPI === "function"
      ? await fetchAPI("/api/check-admin")
      : await fetch(`${API_REGISTER_URL}/check-admin`, {
          headers: { "ngrok-skip-browser-warning": "true" },
        });
    if (!response) return;
    const result = await response.json();

    if (result.admin_sudah_ada) {
      const opsiAdmin = document.getElementById("opsi-admin");
      if (opsiAdmin) opsiAdmin.remove();
      const teksTutup = document.getElementById("teks-admin-tutup");
      if (teksTutup) teksTutup.classList.remove("hidden");
    }
  } catch (error) {
    console.error("Gagal ngecek status admin", error);
  }
}

cekStatusAdmin();

document
  .getElementById("form-register")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const tombol = document.getElementById("tombol-register");
    const notif = document.getElementById("pesan-notif");

    tombol.innerText = "Memproses...";
    tombol.disabled = true;
    notif.classList.add("hidden");

    const dataKirim = {
      nama_lengkap: document.getElementById("nama_lengkap").value,
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      role: document.getElementById("role").value,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataKirim),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        notif.className =
          "bg-green-900/50 border border-green-700 text-green-200 px-4 py-2 rounded mb-4 text-sm text-center block";
        notif.innerText = result.pesan;
        document.getElementById("form-register").reset(); 

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        notif.className =
          "bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4 text-sm text-center block";
        notif.innerText = result.pesan || "Terjadi kesalahan saat registrasi.";
      }
    } catch (error) {
      console.error("Error:", error);
      notif.className =
        "bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4 text-sm text-center block";
      notif.innerText = "Gagal terhubung ke server API.";
    } finally {
      tombol.innerText = "Daftar";
      tombol.disabled = false;
    }
  });
