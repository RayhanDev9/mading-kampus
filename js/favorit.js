const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/api";
const STORAGE_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/storage/";

const emptyState = document.getElementById("empty-state");
const dataState = document.getElementById("data-state");
const wadahPoster = document.getElementById("tempat-poster");

function toggleState(hasData) {
  if (hasData) {
    if (emptyState) emptyState.classList.add("hidden"); 
    if (dataState) dataState.classList.remove("hidden"); 
  } else {
    if (emptyState) emptyState.classList.remove("hidden"); 
    if (dataState) dataState.classList.add("hidden"); 
  }
}

function renderCards(dataArray) {
  if (!dataArray || dataArray.length === 0) {
    toggleState(false);
    if (wadahPoster) wadahPoster.innerHTML = ""; 
    return;
  }

  toggleState(true);

  function cardFungsi(acara) {
    if (!acara) return ""; 

    const hargaTeks = acara.harga == 0 ? "Gratis" : `Rp ${parseInt(acara.harga).toLocaleString("id-ID")}`;
    let paletWarnaHTML = "";

    return `
      <div onclick="window.location.href='select-event.html?id=${acara.id}'" data-id="${acara.id}" class="card-acara w-[100%] xs:w-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 flex flex-col cursor-pointer group max-sm:mx-auto">
          
          <div class="h-48 bg-slate-100 w-full relative overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  <img src="${STORAGE_BASE_URL}${acara.gambar_poster}" alt="${acara.judul}" onerror="this.src='https://via.placeholder.com/800x450?text=Gambar+Tidak+Tersedia'" class="w-full h-full object-cover">
              </div>
              <div class="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  ${acara.kategori || "ACARA"}
              </div>
          </div>

          <div class="p-5 flex flex-col flex-grow">
              <div class="flex items-center justify-between gap-x-2 text-sm text-blue-600 font-semibold mb-3">
                    <span class="font-semibold inline-block text-black/50">${hargaTeks}</span>
                   <div class="flex items-center gap-x-2">
                  <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span>${acara.tanggal_acara}</span>
                </div>
              </div>
              
              <h3 class="text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-3 transition-colors ">
                  ${acara.judul}
              </h3>
              
              ${paletWarnaHTML}
              
              <div class="mt-auto flex items-start gap-x-2 text-sm text-slate-500 pt-3 border-t border-slate-100">
                  <svg class="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <div class="flex justify-between w-full items-center">
                    <span class="line-clamp-1 w-2/3">${acara.link_action || "Lokasi belum ditentukan"}</span>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  const semuaCardHTML = dataArray.map((acara) => cardFungsi(acara)).join("");
  if (wadahPoster) wadahPoster.innerHTML = semuaCardHTML;
}

const initFavorit = async () => {
  const userAktif = JSON.parse(localStorage.getItem("user_mading") || "null");
  
  if (!userAktif) {
      alert("Silakan login terlebih dahulu untuk melihat daftar Favorit Anda.");
      window.location.href = "../auth/login.html";
      return;
  }

  async function fetchFavoritUser() {
    const apiUrl = `/api/users/${userAktif.id}/bookmarks`;

    try {
      const response = typeof fetchAPI === "function"
        ? await fetchAPI(apiUrl)
        : await fetch(`${API_BASE_URL}/users/${userAktif.id}/bookmarks`, {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              Accept: "application/json",
            },
          });

      if (!response || !response.ok) throw new Error("Gagal mengambil data dari API");

      const result = await response.json();
      return result.data !== undefined ? result.data : result;
    } catch (error) {
      console.error("Error Mengambil Acara Favorit:", error);
      return [];
    }
  }

  toggleState(false);

  const dataAcara = await fetchFavoritUser();

  renderCards(dataAcara);
};

initFavorit();

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
