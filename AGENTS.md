# Anti-AI-Slop & Modern Web Development Standards (AGENTS.md)

Dokumen ini adalah aturan permanen (*system instructions & behavioral rules*) untuk agen AI saat mengelola, merancang, dan memprogram kode web di repositori ini. Tujuannya adalah membasmi **"AI Slop"** (kode usang, bloated dependencies, div-soup, janky JavaScript listeners, hacky CSS) dan memastikan kualitas kode setara dengan **Senior Staff Frontend Engineer**.

---

## 1. Aturan Wajib: `modern-web-guidance` Pre-Flight Check

Sebelum menulis komponen UI baru, refactoring layout, atau menerapkan interaksi klien:
1. **Wajib Konsultasi Skill `modern-web-guidance`**:
   Jalankan query pencarian spesifik (2–5 kata aksi) untuk memeriksa standar Web API terkini:
   ```sh
   npx.cmd -y modern-web-guidance@latest search "<query>"
   ```
2. **Retrieve Panduan Standar**:
   Jika panduan ditemukan, ambil spesifikasi resminya:
   ```sh
   npx.cmd -y modern-web-guidance@latest retrieve "<id>"
   ```
3. **Patuhi Panduan & Laporkan**:
   Terapkan pola modern Baseline Widely Available dan cantumkan catatan `### Modern Web Guidance` di akhir respons.

---

## 2. Lima Pilar Anti-AI-Slop (Human-Expert Quality)

### Pilar 1: Native Platform First (Zero-Dependency Mindset)
- **Jangan instal package npm untuk fitur yang sudah disediakan browser secara native**:
  - Modal/Dialog: Gunakan `<dialog>` dengan `.showModal()`, bukan wrapper div z-index ribet.
  - Tooltip/Dropdown/Popover: Gunakan HTML **Popover API** (`popover="auto"` / `popover="hint"`) dan **CSS Anchor Positioning** (`anchor-name`, `position-anchor`).
  - Form Validation: Gunakan native pseudo-class `:user-valid` / `:user-invalid` dan Constraint Validation API, hindari validasi regex JS berlebihan di onChange.
  - Date/Time: Manfaatkan `Intl` API / modern `Temporal` jika tersedia, bukan library berat.

### Pilar 2: Anti-Div-Soup & Modern Semantic Layout
- **Dilarang keras div-nesting tanpa makna**: Gunakan `<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`, `<figure>`, `<time>`, dll.
- **Modern CSS Layout**:
  - Gunakan **CSS Grid** dan **Subgrid** untuk grid konsisten antar komponen anak.
  - Gunakan **Container Queries** (`@container`) untuk komponen yang benar-benar modular, bukan hanya media query viewport (`@media`).
  - Gunakan relational pseudo-class `:has()` untuk parent styling berdasarkan kondisi child (misal: ubah layout kartu saat ada gambar).
  - Gunakan fluid typography & fluid spacing (`clamp(min, preferred, max)`).

### Pilar 3: Zero-Jank Motion & Transitions
- **Dilarang menggunakan `window.addEventListener('scroll')` untuk animasi**:
  - Gunakan **CSS Scroll-Driven Animations** (`animation-timeline: scroll()`, `view()`) untuk parallax, progress bar, header shrink, dan reveal effects.
  - Gunakan **View Transitions API** (`document.startViewTransition`) untuk animasi transisi halaman atau state change yang mulus tanpa framerate drop.
  - Gunakan `@starting-style` untuk animasi transisi halus elemen yang baru masuk ke DOM (seperti modal dan popover).

### Pilar 4: Performance & Core Web Vitals (CWV)
- **Largest Contentful Paint (LCP)**:
  - Berikan atribut `fetchpriority="high"` dan hindari `loading="lazy"` pada gambar hero LCP.
  - Gunakan format modern (WebP, AVIF) dengan atribut `srcset` dan `sizes` yang presisi.
- **Cumulative Layout Shift (CLS)**:
  - Selalu definisikan rasio atau dimensi eksplisit (`aspect-ratio`, `width`, `height`) pada media dan iframe.
  - Manfaatkan `content-visibility: auto` dan `contain-intrinsic-size` pada section offscreen yang panjang untuk mempercepat rendering awal.
- **Interaction to Next Paint (INP)**:
  - Hindari blocking main thread; pisahkan komputasi berat dengan `scheduler.yield()` atau Web Workers jika diperlukan.

### Pilar 5: Aksesibilitas (A11y) & Standar React 19 / TypeScript
- **Accessible by Default**:
  - Setiap tombol interaktif wajib berupa `<button>` (dilarang `<div onClick={...}>` tanpa keyboard event & role).
  - Pastikan keyboard focus ring terlihat jelas (`:focus-visible`).
  - Dukung preferensi sistem operasi: `@media (prefers-reduced-motion)` dan `@media (prefers-color-scheme)`.
  - Dukung OS text-scaling (`rem` untuk tipografi, bukan `px` kaku).
- **React 19 & TypeScript Idiomatis**:
  - Hindari `any`; gunakan TypeScript strict types.
  - Manfaatkan fitur modern React 19 (Actions, `use()`, compiler-friendly functional components).
  - Jaga arsitektur kode modular, readable, self-documenting, dan bebas dari boilerplates usang.
