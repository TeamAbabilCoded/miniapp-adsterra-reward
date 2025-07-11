let user_id = null;
let startTime = null;
let klaimTimer = null;
let klaimDelay = getRandomDelay();
let currentAd = "";

// Daftar iklan
let directLinks = [
  "https://flaredishwater.com/jiq9ypg5i?key=288ddd3f725b2187e03fafc5e0b6268d",
  "https://flaredishwater.com/rzr3yq7eeb?key=0b0ec9a616296fa3520f8f83ff0d9319"
];

// Ambil ID dari URL
const params = new URLSearchParams(window.location.search);
user_id = params.get("id");

window.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("loadingID");
  if (user_id) {
    status.innerText = "✅ Siap diklaim!";
  } else {
    status.innerText = "❌ Gagal memuat ID.";
  }
});

function mulaiTugas() {
  if (!user_id) return alert("ID pengguna tidak ditemukan.");

  // Ambil iklan acak
  currentAd = directLinks[Math.floor(Math.random() * directLinks.length)];

  // Cek cookie apakah sudah pernah klaim
  if (getCookie("claimed_" + btoa(currentAd))) {
    document.getElementById("klaimStatus").innerHTML = "⚠️ Kamu sudah klaim poin dari iklan ini sebelumnya.";
    return;
  }

  // Tampilkan iframe
  const iframe = document.createElement("iframe");
  iframe.src = currentAd;
  iframe.width = "100%";
  iframe.height = "400px";
  iframe.style.border = "2px solid #00f";
  document.getElementById("iklanArea").innerHTML = "";
  document.getElementById("iklanArea").appendChild(iframe);

  startTime = Date.now();
  klaimDelay = getRandomDelay();
  document.getElementById("klaimStatus").innerHTML = `⏳ Menonton iklan selama ${klaimDelay} detik...`;

  klaimTimer = setTimeout(() => {
    klaimPoin();
  }, klaimDelay * 1000);
}

function klaimPoin() {
  const durasi = (Date.now() - startTime) / 1000;

  if (durasi < 30) {
    document.getElementById("klaimStatus").innerHTML = `⛔ Kamu hanya stay ${Math.floor(durasi)} detik. Minimal 30 detik!`;
    return;
  }

  const reward = Math.floor(Math.random() * (700 - 350 + 1)) + 350;
  document.getElementById("klaimStatus").innerHTML = "🎁 Mengklaim poin...";

  fetch("https://159.89.195.47:8000/add_poin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user_id, amount: reward }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        document.getElementById("klaimStatus").innerHTML = `✅ Kamu mendapatkan ${reward} poin!`;
        document.getElementById("iklanArea").innerHTML = "";

        // Set cookie agar tidak bisa klaim lagi di iklan ini
        setCookie("claimed_" + btoa(currentAd), "yes", 1); // expired 1 hari
      } else {
        document.getElementById("klaimStatus").innerHTML = "❌ " + data.message;
      }
    })
    .catch(() => {
      document.getElementById("klaimStatus").innerHTML = "❌ Gagal klaim. Coba lagi.";
    });
}

function getRandomDelay() {
  return Math.floor(Math.random() * (45 - 30 + 1)) + 30;
}

// Cookie helper
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + d.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
