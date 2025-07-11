let directLinks = [];
let waktu = 30;
let interval;
let task_id = "";
let user_id = "";

// Ambil user_id dari Telegram WebApp
window.onload = function () {
  if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
    const tg = Telegram.WebApp;
    tg.expand(); // Buka layar penuh
    user_id = tg.initDataUnsafe?.user?.id || "";
    console.log("User ID:", user_id);
  }
};

// Ambil direct links
fetch("links.json")
  .then(res => res.json())
  .then(data => {
    directLinks = data;
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

  window.open(url, "_blank");

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

fetch("http://159.89.195.47:8000/klaim", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_id, task: task_id })
})
  .then(res => res.json())
  .then(data => {
    alert("✅ Poin berhasil diklaim!");
    document.getElementById("timerArea").innerText = "";
  })
  .catch(err => {
    alert("❌ Gagal klaim poin.");
  });
}
