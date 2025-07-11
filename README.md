# Mini App Reward Web

Mini App WebView untuk sistem reward iklan (Adsterra):
- Direct Link (acak)
- Popunder
- Social Bar
- Timer 30 detik
- Klaim poin via backend FastAPI

## Instalasi
- Upload ke GitHub Pages, Vercel, Netlify, atau VPS.
- Pastikan endpoint `/klaim` tersedia di backend Anda.

## Edit
- Tambah URL iklan di `directLinks` array
- Ganti `user_id` dari Telegram (atau query param)
- Ganti URL endpoint backend di bagian `fetch("/klaim")`
