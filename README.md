# 🎭 Overlay Reaksi Interaktif untuk OBS

Sistem overlay reaksi real-time untuk streaming OBS dengan kontrol dari ponsel menggunakan Next.js dan Socket.IO.

## ✨ Fitur

- **Kontrol Real-time**: Kirim reaksi dari ponsel secara langsung
- **Animasi Smooth**: Emoji melayang dengan animasi yang halus
- **Responsive Design**: Tampilan optimal di berbagai perangkat
- **Easy Setup**: Mudah diintegrasikan dengan OBS Studio
- **Transparent Background**: Background transparan untuk overlay OBS
- **Analytics**: Tracking reaksi pengguna dengan Firebase (opsional)

## 🚀 Quick Start

### 1. Instalasi Dependencies

```bash
npm install
```

### 2. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 3. Setup OBS Studio

1. Buka OBS Studio
2. Tambahkan **Browser Source** baru
3. Set URL: `http://localhost:3000/overlay`
4. Set Width: `1920`, Height: `1080` (sesuai resolusi stream)
5. Centang **Refresh browser when scene becomes active**

### 4. Akses Kontrol dari Ponsel

1. Pastikan ponsel dan komputer di jaringan yang sama
2. Cari IP address komputer (misal: `192.168.1.100`)
3. Buka browser di ponsel: `http://192.168.1.100:3000/control`
4. Mulai kirim reaksi! 🎉

## 📱 Halaman

### `/` - Home Page
Halaman utama dengan navigasi dan panduan setup

### `/control` - Halaman Kontrol (Ponsel)
- Interface untuk mengirim reaksi
- Status koneksi real-time
- 8 tombol reaksi emoji
- Riwayat reaksi terakhir

### `/overlay` - Overlay OBS
- Background transparan
- Animasi emoji melayang
- Optimized untuk streaming

## 🛠️ Teknologi

- **Next.js 15** - React framework
- **Socket.IO** - Real-time communication
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## ⚙️ Konfigurasi

### Mengubah Port

Edit `server.js`:
```javascript
const port = process.env.PORT || 3000; // Ganti dari 3000
```

### Menambah Emoji Reaksi

Edit `src/app/control/page.tsx`:
```javascript
const reactionButtons = [
  { emoji: '👍', label: 'Like' },
  { emoji: '❤️', label: 'Love' },
  // Tambahkan emoji baru di sini
  { emoji: '🚀', label: 'Rocket' },
];
```

### Mengubah Animasi

Edit CSS di `src/app/overlay/page.tsx`:
```css
@keyframes float-up {
  0% {
    transform: translateY(0) rotate(0deg) scale(0.5);
    opacity: 0;
  }
  /* Sesuaikan keyframes */
}
```

### Firebase Analytics (Opsional)

Untuk tracking reaksi pengguna:
1. Copy `.env.local` dan isi konfigurasi Firebase
2. Restart development server
3. Analytics otomatis aktif jika Firebase dikonfigurasi

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# ... variabel Firebase lainnya
```

## 🎨 Customization

### Warna dan Tema
- Edit `src/app/control/page.tsx` untuk mengubah tema halaman kontrol
- Gunakan Tailwind CSS classes untuk styling

### Ukuran dan Posisi Emoji
- Edit `src/app/overlay/page.tsx`
- Sesuaikan `text-6xl` untuk ukuran emoji
- Modify `x` dan `y` coordinates untuk posisi spawn

## 🌐 Production Deployment

### Build untuk Production

```bash
npm run build
npm start
```

### Deploy ke Platform Cloud

1. **Vercel**: 
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel`

2. **Railway**:
   - Connect GitHub repository
   - Auto-deploy dari main branch

3. **VPS/Dedicated Server**:
   - Clone repository
   - Install dependencies
   - Run with PM2: `pm2 start server.js`

## 🔧 Troubleshooting

### Socket tidak terhubung?
- Pastikan port 3000 tidak diblokir firewall
- Check network connectivity
- Restart development server

### Reaksi tidak muncul di OBS?
- Refresh Browser Source di OBS
- Check console untuk error messages
- Pastikan URL overlay benar

### Ponsel tidak bisa akses kontrol?
- Pastikan di jaringan yang sama
- Check IP address komputer
- Disable firewall sementara untuk testing

## 📝 Development

### Structure

```
src/
├── app/
│   ├── control/         # Halaman kontrol ponsel
│   ├── overlay/         # Halaman overlay OBS
│   ├── page.tsx         # Home page
│   └── layout.tsx       # Root layout
└── server.js           # Custom Socket.IO server
```

### Scripts

- `npm run dev` - Development server
- `npm run build` - Build production
- `npm start` - Production server
- `npm run lint` - ESLint check

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🎯 Roadmap

- [ ] Suara efek untuk reaksi
- [ ] Reaksi dengan gambar custom
- [ ] Statistics dan analytics
- [ ] Multi-room support
- [ ] Mobile app (React Native)
- [ ] Integrasi dengan Twitch/YouTube chat

---

Made with ❤️ for the streaming community
