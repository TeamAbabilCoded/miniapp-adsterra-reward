let user_id = null;
let task_id = null;
let interval;
let waktu = 30;

// Daftar direct link kamu (acak saat diklik)
let directLinks = [
  "https://flaredishwater.com/jiq9ypg5i?key=288ddd3f725b2187e03fafc5e0b6268d",
  "https://flaredishwater.com/rzr3yq7eeb?key=0b0ec9a616296fa3520f8f83ff0d9319"
];

// Ambil user_id dari Telegram WebView
Telegram.WebApp.ready();
user_id = Telegram.WebApp.initDataUnsafe?.user?.id;

function mulaiTugas() {
  if (!user_id || directLinks.length === 0) {
    alert("User ID atau link belum dimuat.");
    return;
  }

  // Ambil link acak
  const url = directLinks[Math.floor(Math.random() * directLinks.length)];

  // Buka link iklan di tab baru
  window.open(url, "_blank");

  // Jalankan timer
  document.getElementById("klaimStatus").innerHTML = "⏳ Menunggu 30 detik...";
  waktu = 30;
  interval = setInterval(hitunganMundur, 1000);
}

function hitunganMundur() {
  waktu--;
  document.getElementById("klaimStatus").innerHTML = `⏳ Menunggu ${waktu} detik...`;

  if (waktu <= 0) {
    clearInterval(interval);
    klaimPoin();
  }
}

function klaimPoin() {
  document.getElementById("klaimStatus").innerHTML = "🎁 Mengklaim poin...";

  // Poin acak antara 350 - 700
  const reward = Math.floor(Math.random() * (700 - 350 + 1)) + 350;

  fetch("https://159.89.195.47:8000/add_poin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user_id,
      amount: reward
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        document.getElementById("klaimStatus").innerHTML = `✅ Kamu mendapatkan ${reward} poin!`;
      } else {
        document.getElementById("klaimStatus").innerHTML = "❌ " + data.message;
      }
    })
    .catch(() => {
      document.getElementById("klaimStatus").innerHTML = "❌ Gagal klaim. Coba lagi.";
    });
}
