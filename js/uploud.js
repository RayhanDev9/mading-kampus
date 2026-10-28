const header = () => {
  const initMobileMenu = () => {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("opacity-0");
      mobileMenu.classList.toggle("pointer-events-none");
      mobileMenu.classList.toggle("-translate-y-4");
      mobileMenu.classList.toggle("opacity-100");
      mobileMenu.classList.toggle("pointer-events-auto");
      mobileMenu.classList.toggle("translate-y-0");
    });
  };
  initMobileMenu();

  const checkUserRole = () => {
    const userAktif = JSON.parse(localStorage.getItem("user_mading"));

    const btnDesktop = document.getElementById("btn-unggah-desktop");
    const btnMobile = document.getElementById("btn-unggah-mobile");

    if (!userAktif || userAktif.role !== "admin") {
      if (btnDesktop) btnDesktop.classList.add("hidden");
      if (btnMobile) btnMobile.classList.add("hidden");
    } else {
      if (btnDesktop) btnDesktop.classList.remove("hidden");
      if (btnMobile) btnMobile.classList.remove("hidden");
    }
  };

  checkUserRole();
};
header();


const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
  const inputFile = document.getElementById("gambar_poster");
  const namaFileTeks = document.getElementById("nama-file");

  inputFile.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      namaFileTeks.innerText = "File terpilih: " + this.files[0].name;
      namaFileTeks.classList.replace("text-slate-700", "text-blue-600");
    } else {
      namaFileTeks.innerText = "Klik untuk pilih poster";
      namaFileTeks.classList.replace("text-blue-600", "text-slate-700");
    }
  });

  const areaDrop = document.getElementById("area-drop-file");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    areaDrop.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    areaDrop.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    areaDrop.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    areaDrop.classList.add("border-blue-500", "bg-blue-50");
  }

  function unhighlight(e) {
    areaDrop.classList.remove("border-blue-500", "bg-blue-50");
  }

  areaDrop.addEventListener(
    "drop",
    function (e) {
      let dt = e.dataTransfer;
      let files = dt.files;

      inputFile.files = files;

      const event = new Event("change");
      inputFile.dispatchEvent(event);
    },
    false,
  );

  const formUnggah = document.getElementById("form-unggah");
  const btnSubmit = document.getElementById("btn-submit");

  formUnggah.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userAktif = JSON.parse(localStorage.getItem("user_mading") || "null");
    if (!userAktif) {
      alert("Anda harus login dulu untuk mengunggah acara!");
      window.location.href = "../auth/login.html";
      return;
    }

    const teksAsliTombol = btnSubmit.innerHTML;
    btnSubmit.innerHTML = "Sedang Mengunggah... Tunggu ya...";
    btnSubmit.disabled = true;
    btnSubmit.classList.replace("bg-blue-600", "bg-gray-400");

    try {
      const formData = new FormData();
      formData.append("user_id", userAktif.id);
      formData.append("judul", document.getElementById("judul").value);
      formData.append("kategori", document.getElementById("kategori").value);

      formData.append(
        "tanggal_acara",
        document.getElementById("tanggal").value,
      );
      formData.append(
        "waktu_acara",
        document.getElementById("waktu_acara").value,
      );

      formData.append("harga", document.getElementById("harga").value);
      formData.append(
        "link_action",
        document.getElementById("link_action").value,
      );
      formData.append("deskripsi", document.getElementById("deskripsi").value);

      const filePoster = document.getElementById("gambar_poster").files[0];
      if (filePoster) {
        formData.append("gambar_poster", filePoster);
      }

      const response = typeof fetchAPI === "function"
        ? await fetchAPI("/api/events", {
            method: "POST",
            body: formData,
          })
        : await fetch("https://slab-silenced-riot.ngrok-free.dev/api/events", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "true",
            },
            body: formData,
          });

      if (!response) return;
      const result = await response.json();

      if (response.ok) {
        alert("Yess! Acara berhasil diunggah!");
        window.location.href = "../beranda.html";
      } else {
        console.error("Validasi Error:", result);
        alert("Gagal unggah: " + (result.message || "Cek form lu lagi."));
      }
    } catch (error) {
      console.error("Error nyambung ke API:", error);
      alert("Gagal terhubung ke server Back-End!");
    } finally {
      btnSubmit.innerHTML = teksAsliTombol;
      btnSubmit.disabled = false;
      btnSubmit.classList.replace("bg-gray-400", "bg-blue-600");
    }
  });
});
