let user_id = null;
let task_id = null;
let interval;
let waktu = 30;
let directLinks = [];

Telegram.WebApp.ready();
user_id = Telegram.WebApp.initDataUnsafe?.user?.id;

fetch("static/links.json")
  .then((res) => res.json())
  .then((data) => {
    directLinks = data.links || [];
  });

function bukaIklan() {
  if (directLinks.length === 0) {
    alert("Link belum dimuat.");
    return;
  }

  if (!user_id) {
    alert("Gagal mengambil ID pengguna Telegram.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * directLinks.length);
  const url = directLinks[randomIndex];
  task_id = "task_" + Date.now();

  // Ganti: window.open(url, "_blank");
  // Menjadi: redirect langsung tanpa tab baru
  window.location.href = url;

  // Countdown tetap berjalan (hanya untuk ilustrasi, karena user pindah halaman)
  waktu = 30;
  document.getElementById("timerArea").innerText = `Tunggu ${waktu} detik...`;

  clearInterval(interval);
  interval = setInterval(() => {
    waktu--;
    document.getElementById("timerArea").innerText = `Tunggu ${waktu} detik...`;
    if (waktu <= 0) {
      clearInterval(interval);
      document.getElementById("timerArea").innerHTML = `<button onclick="klaimPoin()">🎁 Klaim Poin</button>`;
    }
  }, 1000);
}

function klaimPoin() {
  if (!user_id || !task_id) {
    alert("User ID atau task ID tidak ditemukan.");
    return;
  }

  fetch("http://159.89.195.47:8000/klaim", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, task: task_id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        document.getElementById("timerArea").innerText = "✅ Poin berhasil diklaim!";
      } else {
        document.getElementById("timerArea").innerText = "❌ " + data.message;
      }
    })
    .catch(() => {
      document.getElementById("timerArea").innerText = "❌ Gagal klaim poin.";
    });
}
