# Firebase Analytics Implementation

## 📊 Struktur Data Firebase

### Collections:
```
reactions_analytics/
├── users/
│   └── data/
│       └── {userId}/
│           ├── userId: "user_nama_user_1234567890"
│           ├── name: "Nama User"
│           ├── totalReactions: 25
│           ├── favoriteEmoji: "😂"
│           ├── firstUsed: timestamp
│           ├── lastUsed: timestamp
│           ├── reactionHistory: [...]
│           └── emojiStats: { "😂": 10, "❤️": 8, "👍": 7 }
│
└── global_stats/
    ├── totalUsers: 150
    ├── totalReactions: 2500
    ├── popularEmojis: { "😂": 500, "❤️": 400, "👍": 350 }
    └── lastUpdated: timestamp
```

## 🔧 Setup

1. **Configure Firebase**:
   - Copy `.env.example` to `.env.local`
   - Add your Firebase project credentials

2. **Auto Data Tracking**:
   - User otomatis teregister saat pertama input nama
   - Setiap reaction otomatis tersimpan di Firebase
   - Global statistics terupdate real-time

## 📈 Data yang Dikumpulkan

### Per User:
- ✅ Nama dan user ID unik
- ✅ Total reactions yang dikirim
- ✅ Emoji favorit (yang paling sering digunakan)
- ✅ History semua reactions dengan timestamp
- ✅ Statistik per emoji
- ✅ Waktu pertama dan terakhir menggunakan

### Global Statistics:
- ✅ Total users yang pernah menggunakan
- ✅ Total reactions di seluruh sistem
- ✅ Emoji paling populer global
- ✅ Timestamp last update

## 🎯 Implementasi

Analytics berjalan **otomatis** di background tanpa mengganggu user experience:

```typescript
// Auto-track saat user kirim reaction
const sendReaction = async (emoji: string) => {
  // ... kirim reaction ke overlay ...
  
  // Auto-save to Firebase (silent)
  if (isAnalyticsEnabled) {
    await trackReaction(emoji);
  }
};
```

## 📊 Dashboard Integration Ready

Data structure sudah siap untuk dashboard analytics yang akan dibuat di project terpisah.

Query examples untuk dashboard:
```js
// Get all users sorted by total reactions
db.collection('reactions_analytics/users/data')
  .orderBy('totalReactions', 'desc')
  .limit(10)

// Get popular emojis
db.doc('reactions_analytics/global_stats')
  .get()
  .then(doc => doc.data().popularEmojis)
```

## 🚀 Production Ready

- ✅ Error handling tidak mengganggu main functionality
- ✅ Silent background operation
- ✅ Scalable data structure
- ✅ Environment-based enable/disable
- ✅ Optimized for real-time dashboard
