function togglePasswordView() {
  const passwordInput = document.getElementById("password");
  const eyeOpenIcon = document.getElementById("eyeOpenIcon");
  const eyeCloseIcon = document.getElementById("eyeCloseIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpenIcon.classList.remove("hidden");
    eyeCloseIcon.classList.add("hidden");
  } else {
    passwordInput.type = "password";
    eyeOpenIcon.classList.add("hidden");
    eyeCloseIcon.classList.remove("hidden");
  }
}
document.getElementById("eye").addEventListener("click", togglePasswordView);

const API_LOGIN_URL = typeof API_BASE_URL !== "undefined" ? `${API_BASE_URL}/api/login` : "https://slab-silenced-riot.ngrok-free.dev/api/login";

document
  .getElementById("form-login")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
    const pesanError = document.getElementById("pesan-error");
    const tombol = document.getElementById("tombol-login");

    tombol.innerText = "Mengecek...";
    pesanError.classList.add("hidden");

    try {
      const response = typeof fetchAPI === "function"
        ? await fetchAPI("/api/login", {
            method: "POST",
            body: JSON.stringify({
              username: usernameInput,
              password: passwordInput,
            }),
          })
        : await fetch(API_LOGIN_URL, {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: usernameInput,
              password: passwordInput,
            }),
          });

      if (!response) return;
      const result = await response.json();

      if (response.ok && result.status === "success") {
        localStorage.setItem("user_mading", JSON.stringify(result.data_user));
        alert("Login Berhasil! Mengalihkan ke Beranda...");
        window.location.href = "../beranda.html";
      } else {
        pesanError.innerText =
          result.pesan || "Login gagal, periksa kembali data Anda.";
        pesanError.classList.remove("hidden");
        tombol.innerText = "Masuk";
      }
    } catch (error) {
      console.error("Error:", error);
      pesanError.innerText = "Gagal terhubung ke server. Pastikan server Ngrok aktif.";
      pesanError.classList.remove("hidden");
      tombol.innerText = "Masuk";
    }
  });
