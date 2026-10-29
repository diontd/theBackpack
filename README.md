# The Backpack — Personal Skill Atlas RPG

Aplikasi web refleksi portofolio & peta keahlian pribadi berbasis **Personal Skill Atlas RPG 3D** interaktif dengan 10 Core Domains, Peta Prasasti Skill Tree (*Generative UI*), dan manajemen bukti karya (*evidence*).

---

## 🌟 Fitur Utama

- **🎒 3D Inventory Floor & Evolution Stage**:
  Visualisasi objek artefak 3D berbasis Three.js dengan 5 tahap evolusi kemewahan (Batu Alam, Akar & Amber, Zamrud Rimba, Safir Samudra, hingga Singgasana Rubi & Berlian).
- **🗺️ Peta Prasasti Skill Tree (Full-Screen & Safe Canvas)**:
  - Arsitektur native `<dialog>` modal top-layer (`showModal()` & `close()`) dengan pencegahan *scroll-chaining* (`overscroll-behavior: contain`).
  - Native HTML Popover API (`popover="auto"`) dan Invoker Commands (`commandfor`/`command`) untuk panel legenda visual.
  - Tampilan *Fokus Inti* (`118%`) & *Fit Peta* (`98%`) yang bebas terpotong (*zero clipping*), dilengkapi navigasi keyboard (`[` / `]` atau `←` / `→`).
  - Panel inspektor bawah yang dapat diringkas (*collapsible*) melalui tombol atau pintasan keyboard `I` untuk memperluas kanvas peta hingga >90%.
  - Jalur prasyarat satu arah berpanah dan tombol loncat cepat ke prasyarat.
- **📊 10 Core Domains & Skill Radar**:
  Peta holistik 10 kategori keahlian, evaluasi 3-indikator checklist per level, serta grafik radar SVG interaktif.
- **📎 Bukti Karya & IndexedDB Caching**:
  Unggah bukti karya (foto & dokumen PDF) dengan penyimpanan aman IndexedDB dan sinkronisasi Cloud Firestore.

---

## 🚀 Memulai (Quick Start)

### 1. Instalasi Dependensi
```bash
npm install --legacy-peer-deps
```

### 2. Jalankan Mode Pengembangan
```bash
npm run dev
```

### 3. Build untuk Produksi
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework & Runtime**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Modern CSS Baseline (`@starting-style`, Popover API, CSS Anchor / Top-Layer)
- **3D Graphics**: Three.js (Procedural PBR Textures & Dynamic Lighting)
- **Database & Sync**: Firebase (Auth, Firestore) + Local IndexedDB
