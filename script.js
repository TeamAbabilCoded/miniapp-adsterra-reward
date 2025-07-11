let directLinks = [];
let waktu = 30;
let interval;
let task_id = "";

// Ambil direct link dari file links.json
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

function klaimPoin() {
  const user_id = "ISI_ID_USER"; // Ganti sesuai sistem Mini App kamu

  fetch("https://your-backend-url.com/klaim", {
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
