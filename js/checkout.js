const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";
const STORAGE_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/storage/";

document.addEventListener("DOMContentLoaded", () => {
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

  const initCheckout = (data) => {
    const container = document.getElementById("container-checkout");

    function htmlCheckout() {
      const hargaFormat =
        !data.harga || data.harga == 0
          ? "GRATIS"
          : "Rp " + new Intl.NumberFormat("id-ID").format(data.harga);

      let imageUrl = data.gambar_poster;
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = STORAGE_BASE_URL + imageUrl;
      }

      return `
         <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Konfirmasi Pesanan
            </h1>
            <p class="text-slate-500 text-sm md:text-base">
              Tinjau kembali detail pesanan Anda sebelum melanjutkan.
            </p>
          </div>

          <div
            class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-5 shadow-sm overflow-hidden"
          >
            <h2
              class="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200"
            >
              Ringkasan Pesanan
            </h2>

            <div class="flex items-start gap-3 sm:gap-4">
              <img
                src="${imageUrl}"
                alt="Poster Acara"
                onerror="this.src='https://via.placeholder.com/800x450?text=Gambar+Tidak+Tersedia'"
                class="w-20 h-24 sm:w-24 sm:h-24 object-cover rounded-md border border-slate-100 shadow-sm shrink-0"
              />

              <div
                class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-bold text-base sm:text-lg text-slate-900 leading-tight truncate"
                  >
                    Tiket ${data.judul}
                  </h3>
                  <p
                    class="text-xs sm:text-sm text-slate-500 mt-1 mb-2.5 truncate"
                  >
                    ${data.kategori}
                  </p>
                  <div>
                    <span
                      class="bg-slate-200 text-slate-600 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded inline-block whitespace-nowrap"
                    >
                      Tiket Masuk
                    </span>
                  </div>
                </div>

                <div
                  class="text-sm sm:text-md  font-bold  text-blue-500 shrink-0 max-sm:pl-2.5"
                >
                 ${hargaFormat}
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm"
          >
            <h2
              class="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200"
            >
              Detail Pemesan
            </h2>

            <div class="mb-5">
              <label class="block text-sm font-semibold text-slate-800 mb-2"
                >Jumlah Peserta</label
              >
              <div
                class="flex items-center border border-slate-300 rounded-md w-max overflow-hidden"
              >
                <button
                  id="btn-min"
                  class="px-4 py-2 text-slate-600 hover:bg-slate-100 transition focus:outline-none"
                >
                  &minus;
                </button>
                <input
                  type="number"
                  id="input-qty"
                  value="1"
                  min="1"
                  class="w-12 text-center text-sm font-medium text-slate-800 focus:outline-none border-x border-slate-300 py-2 pointer-events-none"
                  readonly
                />
                <button
                  id="btn-plus"
                  class="px-4 py-2 text-slate-600 hover:bg-slate-100 transition focus:outline-none"
                >
                  &plus;
                </button>
              </div>
            </div>

            <div class="mb-5">
              <label class="block text-sm font-semibold text-slate-800 mb-2"
                >Nama Lengkap</label
              >
              <input
                type="text"
                id="input-nama"
                placeholder="Masukkan nama lengkap Anda"
                class="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div class="mb-2">
              <label class="block text-sm font-semibold text-slate-800 mb-2"
                >Nomor Induk Mahasiswa (Opsional)</label
              >
              <input
                type="text"
                id="input-nim"
                placeholder="Masukkan NIM Anda"
                class="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div
            class="bg-white border border-slate-200 rounded-xl p-5 mb-6  shadow-sm"
          >
            <div class="flex justify-between items-center mb-4 px-2">
              <h2 class="text-lg font-semibold text-slate-800">Subtotal</h2>
              <div class="text-sm sm:text-md  font-bold  text-blue-500 ">${hargaFormat}</div>
            </div>

            <div
              class="bg-[#f0f7ff] border border-blue-200 rounded-lg p-4 flex gap-3 items-start"
            >
              <svg
                class="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p class="text-sm text-slate-600 leading-relaxed">
                Pembayaran dan konfirmasi pesanan dilakukan langsung melalui
                WhatsApp dengan penjual/panitia.
              </p>
            </div>
          </div>

          <button
            id="btn-submit"
            class="w-full bg-[#2a9cf5] hover:bg-blue-600 text-white font-semibold text-sm sm:text-base py-3.5 rounded-lg flex justify-center items-center gap-2 transition shadow-md focus:outline-none"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            PESAN VIA WHATSAPP
          </button>
      `;
    }

    container.insertAdjacentHTML("beforeend", htmlCheckout());

    setupListeners();
  };

  function setupListeners() {
    const btnMin = document.getElementById("btn-min");
    const btnPlus = document.getElementById("btn-plus");
    const inputQty = document.getElementById("input-qty");
    const inputNama = document.getElementById("input-nama");
    const inputNim = document.getElementById("input-nim");
    const btnSubmit = document.getElementById("btn-submit");

    btnPlus.addEventListener(
      "click",
      () => (inputQty.value = parseInt(inputQty.value) + 1),
    );
    btnMin.addEventListener("click", () => {
      if (parseInt(inputQty.value) > 1)
        inputQty.value = parseInt(inputQty.value) - 1;
    });

    btnSubmit.addEventListener("click", () => {
      const namaLengkap = inputNama.value.trim();
      if (!namaLengkap) return alert("Mohon isi Nama Lengkap terlebih dahulu.");

      let teksPesan = `Halo, saya ingin memesan tiket acara:\n\n*Acara:* Tiket Talkshow Karir\n*Jumlah Peserta:* ${inputQty.value} Orang\n*Nama Lengkap:* ${namaLengkap}\n${inputNim.value ? `*NIM:* ${inputNim.value}\n` : ""} \nMohon instruksi selanjutnya.`;
      window.open(
        `https://wa.me/6285692097048?text=${encodeURIComponent(teksPesan)}`,
        "_blank",
      );
    });
  }

  async function fetchDetailAcara(id) {
    try {
      const response = typeof fetchAPI === "function"
        ? await fetchAPI(`/api/events/${id}`)
        : await fetch(`https://slab-silenced-riot.ngrok-free.dev/api/events/${id}`, {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              Accept: "application/json",
            },
          });
      if (!response || !response.ok)
        throw new Error(`HTTP error! status: ${response?.status}`);
      const result = await response.json();
      initCheckout(result.data !== undefined ? result.data : result);
    } catch (error) {
      console.error("DEBUG ERROR:", error); 
      document.getElementById("container-checkout").innerHTML =
        `<div class="p-6 text-center text-red-500 font-bold">Gagal memuat acara.</div>`;
    }
  }

  function initializeCheckout() {
    const idEvent = new URLSearchParams(window.location.search).get("id");
    if (idEvent) fetchDetailAcara(idEvent);
  }

  initializeCheckout();
});
