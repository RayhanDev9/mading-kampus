const API_URL = typeof API_BASE_URL !== "undefined" ? `${API_BASE_URL}/api/events` : "https://slab-silenced-riot.ngrok-free.dev/api/events";
const STORAGE_URL = typeof STORAGE_BASE_URL !== "undefined" ? STORAGE_BASE_URL : "https://slab-silenced-riot.ngrok-free.dev/storage/";

let allEvents = [];
let currentFilterKat = "Semua";
let currentFilterWaktu = "Semua";

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
    const userAktif = JSON.parse(localStorage.getItem("user_mading") || "null");

    const btnDesktop = document.getElementById("btn-unggah-desktop");
    const btnMobile = document.getElementById("btn-unggah-mobile");
    const linkAuthDesktop = document.getElementById("link-auth-desktop");
    const linkAuthMobile = document.getElementById("link-auth-mobile");

    if (!userAktif) {
      if (btnDesktop) btnDesktop.classList.add("hidden");
      if (btnMobile) btnMobile.classList.add("hidden");
      if (linkAuthDesktop) {
        linkAuthDesktop.innerText = "Masuk";
        linkAuthDesktop.href = "auth/login.html";
        linkAuthDesktop.className = "text-blue-600 hover:text-blue-800 font-semibold transition text-base";
      }
      if (linkAuthMobile) {
        linkAuthMobile.innerText = "Masuk";
        linkAuthMobile.href = "auth/login.html";
        linkAuthMobile.className = "text-blue-600 hover:text-blue-800 font-semibold transition text-base";
      }
    } else {
      if (userAktif.role === "admin") {
        if (btnDesktop) btnDesktop.classList.remove("hidden");
        if (btnMobile) btnMobile.classList.remove("hidden");
      } else {
        if (btnDesktop) btnDesktop.classList.add("hidden");
        if (btnMobile) btnMobile.classList.add("hidden");
      }

      const logoutHandler = (e) => {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin keluar?")) {
          localStorage.removeItem("user_mading");
          window.location.reload();
        }
      };

      if (linkAuthDesktop) {
        linkAuthDesktop.innerText = `Logout (${userAktif.name || userAktif.username || "User"})`;
        linkAuthDesktop.href = "#";
        linkAuthDesktop.addEventListener("click", logoutHandler);
      }
      if (linkAuthMobile) {
        linkAuthMobile.innerText = "Logout";
        linkAuthMobile.href = "#";
        linkAuthMobile.addEventListener("click", logoutHandler);
      }
    }
  };

  checkUserRole();
};
header();

async function fetchEventsData() {
  const wadahPoster = document.getElementById("tempat-poster");

  try {
    const response = typeof fetchAPI === "function"
      ? await fetchAPI("/api/events")
      : await fetch(API_URL, {
          method: "GET",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });

    if (!response || !response.ok) throw new Error(`Server status: ${response?.status}`);
    const result = await response.json();

    allEvents = result.data || [];
    applyFiltersAndRender();
  } catch (error) {
    console.error("Gagal konek ke API:", error);
    if (wadahPoster) {
      wadahPoster.innerHTML = `
        <div class="col-span-full text-center py-20 text-red-500 bg-red-50 border border-red-200 rounded-2xl">
          <p class="font-bold mb-2 text-lg">Gagal Mengambil Data Acara</p>
          <p class="text-sm text-slate-600">Server backend sedang tidak tersedia.</p>
        </div>
      `;
    }
  }
}

function applyFiltersAndRender() {
  let filteredEvents = allEvents;

  if (currentFilterKat !== "Semua") {
    filteredEvents = filteredEvents.filter(
      (event) => event.kategori === currentFilterKat,
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (currentFilterWaktu === "Hari Ini") {
    filteredEvents = filteredEvents.filter((event) => {
      const evDate = new Date(event.tanggal_acara);
      evDate.setHours(0, 0, 0, 0);
      return evDate.getTime() === today.getTime();
    });
  } else if (currentFilterWaktu === "Minggu Ini") {
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    filteredEvents = filteredEvents.filter((event) => {
      const evDate = new Date(event.tanggal_acara);
      evDate.setHours(0, 0, 0, 0);
      return evDate >= today && evDate <= endOfWeek;
    });
  } else if (currentFilterWaktu === "Mendatang") {
    filteredEvents = filteredEvents.filter((event) => {
      const evDate = new Date(event.tanggal_acara);
      evDate.setHours(0, 0, 0, 0);
      return evDate > today;
    });
  }

  renderCards(filteredEvents);
}

function renderCards(events) {
  const wadahPoster = document.getElementById("tempat-poster");

  if (events.length === 0) {
    wadahPoster.innerHTML =
      '<p class="col-span-full text-center py-20 text-gray-500 mx-auto font-medium">Belum ada acara yang sesuai dengan filter ini.</p>';
    return;
  }

  const semuaCardHTML = events
    .map((acara) => {
      const hargaTeks =
        acara.harga == 0
          ? "Gratis"
          : `Rp ${parseInt(acara.harga).toLocaleString("id-ID")}`;

      let imageUrl = acara.gambar_poster;
      if (imageUrl && !imageUrl.startsWith("http"))
        imageUrl = STORAGE_URL + imageUrl;

      const jamAcara = acara.waktu_acara
        ? acara.waktu_acara.substring(0, 5)
        : "12:00";

      return `
      <div data-id="${acara.id}" class="card-acara w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-neutral-700 transition duration-300 flex flex-col cursor-pointer group">
          <div class="h-48 bg-slate-100 dark:bg-neutral-800 w-full relative overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-neutral-500 text-sm">
                  <img src="${imageUrl}" alt="${acara.judul}" onerror="this.src='https://via.placeholder.com/800x450?text=Gambar+Tidak+Tersedia'" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-300">
              </div>
              <div class="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  ${acara.kategori || "ACARA"}
              </div>
          </div>

          <div class="p-5 flex flex-col flex-grow">
              <div class="flex items-center justify-between gap-x-2 text-sm text-blue-600 dark:text-blue-400 font-semibold mb-3">
                  <span class="${acara.harga == 0 ? "text-slate-500 dark:text-neutral-400 font-medium" : "text-blue-600 dark:text-blue-400 font-bold"}">${hargaTeks}</span>
                  <div class="flex items-center gap-x-2 text-blue-600 dark:text-blue-400">
                      <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                      <span>${acara.tanggal_acara}</span>
                  </div>
              </div>
              
              <h3 class="text-lg font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  ${acara.judul}
              </h3>
              
              <div class="mt-auto flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-neutral-800">
                  <div class="flex items-center gap-x-2 text-sm text-slate-500 dark:text-neutral-400 font-medium">
                      <span class="text-base">⏰</span>
                      <span>${jamAcara} WIB</span>
                  </div>
                  
                  <div class="flex items-start gap-x-2 text-sm text-slate-500 dark:text-neutral-400 pt-1">
                      <svg class="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      <span class="line-clamp-1 w-[90%]">${acara.link_action || "Cek detail acara"}</span>
                  </div>
              </div>
          </div>
      </div>
    `;
    })
    .join("");

  wadahPoster.innerHTML = semuaCardHTML;
}

document.getElementById("tempat-poster").addEventListener("click", (e) => {
  const diklik = e.target.closest(".card-acara");
  if (diklik) {
    const idAcara = diklik.getAttribute("data-id");
    window.location.href = `event/select-event.html?id=${idAcara}`;
  }
});

const eventFilterLogic = () => {
  const tabActive = [
    "bg-white",
    "dark:bg-neutral-800",
    "text-blue-700",
    "dark:text-blue-400",
    "font-bold",
    "shadow-sm",
    "border-slate-200",
    "dark:border-neutral-700",
  ];
  const tabInactive = [
    "text-slate-500",
    "dark:text-neutral-400",
    "font-medium",
    "border-transparent",
    "hover:text-slate-900",
    "dark:hover:text-white",
    "hover:bg-slate-200/50",
    "dark:hover:bg-neutral-800/50",
  ];

  const timeActive = [
    "bg-blue-50",
    "dark:bg-blue-950/40",
    "text-blue-700",
    "dark:text-blue-400",
    "border-blue-200",
    "dark:border-blue-900",
    "font-semibold",
  ];
  const timeInactive = [
    "bg-white",
    "dark:bg-neutral-900",
    "text-slate-600",
    "dark:text-neutral-400",
    "border-slate-200",
    "dark:border-neutral-800",
    "font-medium",
    "hover:bg-slate-50",
    "dark:hover:bg-neutral-800",
    "hover:border-slate-300",
    "dark:hover:border-neutral-700",
  ];

  function initFilterGroup(
    containerId,
    activeClasses,
    inactiveClasses,
    tipeFilter,
  ) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const buttons = container.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => {
          btn.classList.remove(...activeClasses);
          btn.classList.add(...inactiveClasses);
        });
        button.classList.remove(...inactiveClasses);
        button.classList.add(...activeClasses);

        const teksTombol = button.innerText.trim();

        if (tipeFilter === "kategori") {
          if (teksTombol === "Acara") currentFilterKat = "Semua";
          else if (teksTombol === "UMKM") currentFilterKat = "UMKM";
          else if (teksTombol === "UKO") currentFilterKat = "UMKO";
          else if (teksTombol === "HIMA") currentFilterKat = "HIMA";
        } else if (tipeFilter === "waktu") {
          if (teksTombol === "Semua Acara") currentFilterWaktu = "Semua";
          else if (teksTombol === "Hari Ini") currentFilterWaktu = "Hari Ini";
          else if (teksTombol === "Minggu Ini")
            currentFilterWaktu = "Minggu Ini";
          else if (teksTombol === "Acara Mendatang")
            currentFilterWaktu = "Mendatang";
        }

        applyFiltersAndRender();
      });
    });
  }

  initFilterGroup("tab-group", tabActive, tabInactive, "kategori");
  initFilterGroup("time-group", timeActive, timeInactive, "waktu");
};

fetchEventsData();
eventFilterLogic();
