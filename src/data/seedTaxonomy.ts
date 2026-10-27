// @ts-nocheck
/**
 * Complete Unmodified Seed Taxonomy & Content for THE BACKPACK — Personal Skill Atlas RPG
 */

const CATEGORY_DESCRIPTIONS = {
        'wpda': 'Spiritual Formation & Communication (WPDA) — Mengembangkan pemahaman Alkitab, praktik spiritual, dan komunikasi iman yang akurat, relevan, rendah hati, serta melayani orang lain.',
        'physical-wellness': 'Physical Wellness & Performance — Membangun tubuh yang sehat, bugar, terampil, dan dapat dipelihara sepanjang hidup dengan fokus keselamatan, pemulihan, dan konsistensi.',
        'music': 'Music & Musical Expression — Mengembangkan kemampuan memainkan instrumen, memahami struktur musik, menciptakan aransemen, dan mengekspresikan maksud musikal secara sadar.',
        'engineering': 'Engineering & Product Innovation — Mengubah kebutuhan menjadi solusi fisik atau teknis yang dapat diuji melalui fungsi, spesifikasi, ketahanan, keselamatan, dan trade-off.',
        'business': 'Business & Value Creation — Memahami kebutuhan pelanggan, membangun model penciptaan nilai, mengelola sumber daya, dan membuat keputusan ekonomi yang bertanggung jawab.',
        'content-creating': 'Content Creation & Communication — Mengubah ide menjadi pesan yang jelas, menarik, dan bertanggung jawab; menguji keberhasilan melalui tujuan komunikasi dan kebutuhan audiens.',
        'art': 'Art, Design & Aesthetics — Mengembangkan kepekaan terhadap bentuk, ruang, bahasa, komposisi, dan makna; menghasilkan karya yang sengaja dirancang.',
        'interpersonal-skill': 'Interpersonal Intelligence & Leadership — Memahami orang dan dinamika sosial, menyampaikan gagasan, membangun kepercayaan, menyelesaikan konflik, dan memimpin tanpa manipulasi.',
        'exploration-adaptation': 'Exploration, Technology & Adaptability — Belajar cepat, menilai informasi dan teknologi (AI/riset), bereksperimen, serta beradaptasi lintas lingkungan dan budaya.',
        'critical-thinking-logic': 'Critical Thinking, Logic & Philosophy — Menguji klaim dan asumsi, menyusun argumen, mempertimbangkan bukti alternatif, memodelkan sebab-akibat, dan memperbarui keyakinan.'
      };

      const TAB_HUMAN_DESCRIPTIONS = {
        'capabilities': '<strong>Competency:</strong> Klik kotak skill untuk melihat definisi &amp; <strong>Checklist 3 Indikator</strong>. Centang ketiga indikator pada level aktif untuk naik level.',
        'evidence': '<strong>Evidence:</strong> Dokumentasikan artefak karya, foto/PDF, atau tautan proyek nyata sebagai bukti objektif penguasaanmu.',
        'meaning': '<strong>Meaning:</strong> Catat refleksi personal mengapa bidang keahlian ini bermakna bagi perjalanan hidup dan panggilanmu.',
        'potential': '<strong>Potential:</strong> Rancang ide eksperimen, kolaborasi lintas bidang, dan langkah eksplorasi berikutnya.'
      };

      const PASSIVE_SKILLS = [
        {
          id: 'ps-self-management',
          name: 'Self-Management',
          tiers: ['Awareness', 'Habit Design', 'Self-Regulation'],
          evidenceHint: 'Log prioritas, konsistensi, dan review penggunaan waktu/energi.'
        },
        {
          id: 'ps-learning',
          name: 'Learning How to Learn',
          tiers: ['Imitation', 'Deliberate Practice', 'Meta-Learning'],
          evidenceHint: 'Rencana latihan spesifik, feedback loop, retrieval/review dan transfer.'
        },
        {
          id: 'ps-ethics',
          name: 'Ethics & Character',
          tiers: ['Compliance', 'Ethical Reasoning', 'Integrity'],
          evidenceHint: 'Analisis dilema, penjelasan trade-off, dan konsistensi tindakan dengan nilai.'
        },
        {
          id: 'ps-integrative',
          name: 'Integrative Thinking',
          tiers: ['Combination', 'Systems Integration', 'Creative Synthesis'],
          evidenceHint: 'Proyek yang menggabungkan beberapa domain untuk menyelesaikan kebutuhan nyata.'
        }
      ];

      const RAW_SEED_CATEGORIES = [
        {
          id: 'cat-01',
          order: '01',
          sortOrder: 1,
          slug: 'wpda',
          name: 'Spiritual Formation & Communication (WPDA)',
          shortTag: 'WPDA',
          floorPos: { x: -5.2, z: -0.25 },
          mappedActivities: 'Sharing Firman Tuhan melalui WhatsApp dan Shorts/Reels; Diary Alkitab; worship leading.',
          capstone: 'Portofolio berisi studi Alkitab, satu materi sharing publik, rekaman worship, dan refleksi tentang proses belajar serta koreksi yang diterima.',
          guardrail: 'Unlock: pastikan interpretasi dan komunikasi akurat; pada Sage, nilai integritas, discernment, dan dampak pelayanan, bukan metrik engagement.',
          branches: [
            {
              name: 'Biblical Understanding',
              tiers: ['Reading', 'Interpretation', 'Hermeneutics'],
              output: 'Menyusun catatan studi satu perikop, membedakan teks, konteks, interpretasi, dan aplikasi.',
              criteria: 'Akurasi konteks; klaim dapat ditelusuri; membedakan observasi dari opini.',
              reflection: 'Apa yang sebenarnya dinyatakan teks, dan asumsi apa yang saya bawa?',
              crossPrereqs: {}
            },
            {
              name: 'Spiritual Communication',
              tiers: ['Sharing', 'Teaching', 'Discipleship'],
              output: 'Membuat materi sharing singkat, lalu versi pengajaran yang terstruktur dan rencana pendampingan.',
              criteria: 'Pesan akurat, mudah dipahami, sesuai audiens, tidak memaksakan kesimpulan.',
              reflection: 'Apakah audiens menerima inti pesan yang saya maksud?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 3, label: 'Reading ≥ 3' }],
                2: [{ branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Interpretation ≥ 3' }]
              }
            },
            {
              name: 'Worship',
              tiers: ['Performance', 'Leadership', 'Ministry'],
              output: 'Rekaman mengiringi lagu, memimpin satu sesi, dan membuat refleksi koordinasi tim.',
              criteria: 'Musikalitas, persiapan, kepekaan pada konteks, koordinasi, dan sikap melayani.',
              reflection: 'Apakah pilihan musik dan kepemimpinan mendukung tujuan ibadah?',
              crossPrereqs: {
                2: [{ branchIdx: 3, tierIdx: 1, minScore: 3, label: 'Discernment ≥ 3' }]
              }
            },
            {
              name: 'Spiritual Formation',
              tiers: ['Discipline', 'Discernment', 'Wisdom'],
              output: 'Log refleksi berkala dan analisis satu keputusan sulit dengan alasan, nilai, dan konsekuensinya.',
              criteria: 'Konsistensi, kejernihan nilai, rendah hati, serta kesediaan mengoreksi diri.',
              reflection: 'Bagaimana saya membedakan keyakinan, emosi, interpretasi, dan pertimbangan etis?',
              crossPrereqs: {
                2: [{ branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Interpretation ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-wpda-v1.glb',
            material: 'Kertas & Kulit Buku',
            shape: 'Jurnal / Kit Lapangan',
            accentHex: 0xDF761F
          }
        },
        {
          id: 'cat-02',
          order: '02',
          sortOrder: 2,
          slug: 'physical-wellness',
          name: 'Physical Wellness & Performance',
          shortTag: 'Wellness',
          floorPos: { x: -2.6, z: -0.60 },
          mappedActivities: 'Home-gym, walking, set exercises, renang, basketball.',
          capstone: 'Log latihan dengan baseline dan hasil akhir, evaluasi teknik, serta refleksi tentang pemulihan.',
          guardrail: 'Safety gate wajib: performa tidak boleh menutupi teknik berisiko. Cari coach atau tenaga kesehatan yang kompeten bila diperlukan.',
          branches: [
            {
              name: 'Strength',
              tiers: ['Conditioning', 'Progressive Overload', 'Physical Mastery'],
              output: 'Log latihan 6–8 minggu dengan beban, repetisi, teknik, dan persepsi usaha.',
              criteria: 'Progres sesuai kemampuan awal, teknik baik, progresi masuk akal, tidak mengabaikan rasa sakit.',
              reflection: 'Apakah program mendorong adaptasi atau hanya menambah kelelahan?',
              crossPrereqs: {
                2: [{ branchIdx: 3, tierIdx: 1, minScore: 3, label: 'Regeneration ≥ 3 (Safety Gate)' }]
              }
            },
            {
              name: 'Endurance',
              tiers: ['Walking', 'Aerobic Capacity', 'Endurance Optimization'],
              output: 'Catatan durasi/jarak/pace untuk aktivitas aerobik dengan kondisi pengukuran yang konsisten.',
              criteria: 'Baseline dan akhir dapat dibandingkan; beban meningkat bertahap; pemulihan cukup.',
              reflection: 'Apa yang mungkin menjelaskan perubahan performa selain latihan?',
              crossPrereqs: {
                2: [{ branchIdx: 3, tierIdx: 0, minScore: 3, label: 'Rest ≥ 3' }]
              }
            },
            {
              name: 'Athleticism',
              tiers: ['Coordination', 'Agility', 'Athletic Performance'],
              output: 'Video teknik atau catatan drill renang/basket dengan indikator spesifik.',
              criteria: 'Gerakan efisien, kontrol tubuh, keputusan sesuai situasi, keselamatan.',
              reflection: 'Keterampilan mana yang membatasi performa: teknik, keputusan, atau kondisi fisik?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 2, label: 'Conditioning ≥ 2' }],
                2: [{ branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Progressive Overload ≥ 3' }]
              }
            },
            {
              name: 'Recovery',
              tiers: ['Rest', 'Regeneration', 'Adaptation'],
              output: 'Log tidur, energi, soreness, hari pemulihan, dan penyesuaian beban latihan.',
              criteria: 'Menggunakan sinyal tubuh secara masuk akal; menghindari pola latihan yang tak berkelanjutan.',
              reflection: 'Kapan saya perlu menurunkan beban, berhenti, atau meminta bantuan profesional?',
              crossPrereqs: {}
            }
          ],
          visual: {
            modelKey: 'category-wellness-v1.glb',
            material: 'Karet & Tekstil Kokoh',
            shape: 'Dumbbell & Gear Kebugaran',
            accentHex: 0x2BB3A3
          }
        },
        {
          id: 'cat-03',
          order: '03',
          sortOrder: 3,
          slug: 'music',
          name: 'Music & Musical Expression',
          shortTag: 'Music',
          floorPos: { x: 0.0, z: -0.75 },
          mappedActivities: 'Guitar, keyboard, music theory, harmony, arrangement.',
          capstone: 'Portofolio rekaman, satu arrangement, dan satu demonstrasi permainan atau pengarahan ensemble.',
          guardrail: 'Arrangement lanjutan memerlukan dasar teori/harmoni. Sage berarti mastery dalam lingkup tertentu, bukan seluruh genre atau instrumen.',
          branches: [
            {
              name: 'Instrumental Fluency',
              tiers: ['Technique', 'Expression', 'Virtuosity'],
              output: 'Rekaman beberapa lagu dengan metronom dan satu lagu yang dimainkan dalam kondisi berbeda.',
              criteria: 'Akurasi ritme/nada, transisi, artikulasi, dinamika, dan kestabilan saat tampil.',
              reflection: 'Bagian mana masih bergantung pada hafalan jari alih-alih pemahaman musik?',
              crossPrereqs: {}
            },
            {
              name: 'Musical Understanding',
              tiers: ['Theory', 'Harmony', 'Musical Intuition'],
              output: 'Analisis progresi chord, transkripsi singkat, dan demonstrasi voicing/inversi di instrumen.',
              criteria: 'Konsep dapat dijelaskan dan digunakan; telinga mendukung pemahaman teori.',
              reflection: 'Bagaimana perubahan harmoni mengubah ketegangan atau karakter musik?',
              crossPrereqs: {}
            },
            {
              name: 'Composition',
              tiers: ['Arrangement', 'Composition', 'Orchestration'],
              output: 'Satu arrangement lengkap dengan struktur, part, dinamika, dan alasan pilihan instrumen.',
              criteria: 'Aransemen mendukung melodi, ruang suara seimbang, transisi jelas, sesuai kebutuhan ensemble.',
              reflection: 'Elemen apa yang wajib dipertahankan dan apa yang dapat diubah?',
              crossPrereqs: {
                1: [{ branchIdx: 1, tierIdx: 0, minScore: 3, label: 'Theory ≥ 3' }],
                2: [{ branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Harmony ≥ 3' }]
              }
            },
            {
              name: 'Musical Leadership',
              tiers: ['Accompaniment', 'Direction', 'Interpretation'],
              output: 'Rekaman mengiringi musisi lain atau memimpin rehearsal dengan catatan perbaikan.',
              criteria: 'Memberi cue jelas, mendengarkan ensemble, menyesuaikan tempo/dinamika, menerima feedback.',
              reflection: 'Apakah saya sedang memimpin musik atau hanya memainkan bagian saya?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 3, label: 'Technique ≥ 3' }],
                2: [{ branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Harmony ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-music-v1.glb',
            material: 'Kayu Hangat & Metal',
            shape: 'Instrumen / Mini Stage Kit',
            accentHex: 0xD96B27
          }
        },
        {
          id: 'cat-04',
          order: '04',
          sortOrder: 4,
          slug: 'engineering',
          name: 'Engineering & Product Innovation',
          shortTag: 'Engineering',
          floorPos: { x: 2.6, z: -0.60 },
          mappedActivities: 'Electrical Engineering, Mechanical Engineering, Product Design Philosophy/Core, 3D CAD.',
          capstone: 'Satu proyek yang menyertakan requirement, model/gambar, prototipe atau simulasi, rencana pengujian, hasil, dan revisi berdasarkan kegagalan nyata.',
          guardrail: 'Systems Architecture membutuhkan subsistem relevan dan Systems Thinking. Desain berisiko memerlukan pemeriksaan kompeten, bukan self-review saja.',
          branches: [
            {
              name: 'Electrical Engineering',
              tiers: ['Circuits', 'Electronics', 'System Integration'],
              output: 'Skema rangkaian sederhana, perhitungan dasar, simulasi/pengukuran, dan catatan troubleshooting.',
              criteria: 'Rangkaian sesuai tujuan, perhitungan dapat dicek, risiko listrik dikenali, hasil dibandingkan dengan prediksi.',
              reflection: 'Asumsi apa yang membuat hasil hitung atau simulasi berbeda dari realitas?',
              crossPrereqs: {}
            },
            {
              name: 'Mechanical Engineering',
              tiers: ['Mechanics', 'Dynamics', 'Optimization'],
              output: 'Analisis mekanisme sederhana, pemilihan material, dan perhitungan beban dengan asumsi tertulis.',
              criteria: 'Keseimbangan gaya/gerak, asumsi wajar, satuan konsisten, faktor keselamatan dipertimbangkan.',
              reflection: 'Mode kegagalan mana yang paling mungkin, dan apa akibatnya?',
              crossPrereqs: {}
            },
            {
              name: 'Product Design',
              tiers: ['Modeling', 'Prototyping', 'Design Engineering'],
              output: 'Model CAD, gambar teknik, daftar persyaratan, prototipe, dan hasil tes.',
              criteria: 'Dimensi dan fungsi sesuai spesifikasi; toleransi, material, perakitan, dan manufaktur dipertimbangkan.',
              reflection: 'Apakah desain ini hanya terlihat benar atau sudah memenuhi kebutuhan dan batasan?',
              crossPrereqs: {
                2: [{ branchIdx: 1, tierIdx: 0, minScore: 3, label: 'Mechanics ≥ 3' }]
              }
            },
            {
              name: 'Systems Engineering',
              tiers: ['Integration', 'Systems Architecture', 'Systems Optimization'],
              output: 'Diagram subsistem, antarmuka, persyaratan, uji integrasi, dan laporan revisi.',
              criteria: 'Antarmuka jelas, kegagalan dianalisis, persyaratan dapat diverifikasi, perubahan terdokumentasi.',
              reflection: 'Trade-off biaya, keselamatan, performa, dan perawatan apa yang belum terselesaikan?',
              crossPrereqs: {
                1: [{ branchIdx: 2, tierIdx: 0, minScore: 3, label: 'Modeling ≥ 3' }],
                2: [{ branchIdx: 2, tierIdx: 1, minScore: 3, label: 'Prototyping ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-engineering-v1.glb',
            material: 'Brushed Metal Presisi',
            shape: 'Komponen & Alat Rancang',
            accentHex: 0x4E8098
          }
        },
        {
          id: 'cat-05',
          order: '05',
          sortOrder: 5,
          slug: 'business',
          name: 'Business & Value Creation',
          shortTag: 'Business',
          floorPos: { x: 5.2, z: -0.25 },
          mappedActivities: 'System, Finance, Marketing, operations, entrepreneurship.',
          capstone: 'Mini business case atau eksperimen nyata yang menghubungkan masalah, pelanggan, biaya, nilai yang ditawarkan, indikator hasil, dan keputusan berikutnya.',
          guardrail: 'Sage tidak mensyaratkan bisnis besar; nilai kualitas keputusan, validasi asumsi, sistem berkelanjutan, dan integritas.',
          branches: [
            {
              name: 'Systems',
              tiers: ['Organization', 'Automation', 'System Architecture'],
              output: 'Peta proses, SOP, dan satu perbaikan workflow yang dapat dibandingkan sebelum/sesudah.',
              criteria: 'Proses dapat diulang, tanggung jawab jelas, bottleneck terlihat, otomasi mengurangi kesalahan atau usaha.',
              reflection: 'Apakah otomasi menyelesaikan masalah atau hanya mempercepat proses yang buruk?',
              crossPrereqs: {}
            },
            {
              name: 'Finance',
              tiers: ['Budgeting', 'Financial Modeling', 'Capital Allocation'],
              output: 'Anggaran, proyeksi arus kas sederhana, analisis skenario, dan catatan asumsi.',
              criteria: 'Angka konsisten, asumsi terpisah dari fakta, arus kas diperhitungkan, skenario downside diuji.',
              reflection: 'Asumsi mana yang paling sensitif terhadap perubahan hasil?',
              crossPrereqs: {}
            },
            {
              name: 'Marketing',
              tiers: ['Positioning', 'Persuasion', 'Brand Strategy'],
              output: 'Persona/segmen yang diteliti, value proposition, eksperimen pesan, dan hasilnya.',
              criteria: 'Pesan sesuai kebutuhan nyata, klaim jujur, hasil diukur sesuai tujuan, bukan hanya vanity metrics.',
              reflection: 'Bukti apa yang mendukung bahwa pelanggan benar-benar menginginkan ini?',
              crossPrereqs: {}
            },
            {
              name: 'Entrepreneurship',
              tiers: ['Validation', 'Business Building', 'Venture Creation'],
              output: 'Catatan wawancara/eksperimen pelanggan, prototype, model pendapatan, dan review hasil.',
              criteria: 'Masalah pelanggan terverifikasi, willingness-to-pay diuji bila relevan, risiko dan ekonomi dipahami.',
              reflection: 'Apa yang akan membuat saya menghentikan atau mengubah ide ini?',
              crossPrereqs: {
                1: [{ branchIdx: 2, tierIdx: 0, minScore: 2, label: 'Positioning ≥ 2' }],
                2: [
                  { branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Financial Modeling ≥ 3' },
                  { branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Automation ≥ 3' }
                ]
              }
            }
          ],
          visual: {
            modelKey: 'category-business-v1.glb',
            material: 'Kulit & Logam Modular',
            shape: 'Folio, Ledger & Tool Case',
            accentHex: 0xA66332
          }
        },
        {
          id: 'cat-06',
          order: '06',
          sortOrder: 6,
          slug: 'content-creating',
          name: 'Content Creation & Communication',
          shortTag: 'Content',
          floorPos: { x: -4.6, z: 2.40 },
          mappedActivities: 'Ideation, storytelling, production, visual editing, distribution strategy.',
          capstone: 'Portofolio 3–5 konten dengan brief, storyboard/script, hasil final, versi revisi, distribusi, serta analisis indikator yang sesuai tujuan.',
          guardrail: 'Creative Direction memerlukan produksi dan konsep yang kuat; Media Ecosystem memerlukan eksperimen lintas kanal, bukan views semata.',
          branches: [
            {
              name: 'Ideation',
              tiers: ['Brainstorming', 'Concept Development', 'Originality'],
              output: 'Kumpulan ide dengan brief, pilihan konsep, alasan seleksi, dan satu ide yang dikembangkan penuh.',
              criteria: 'Ide relevan dengan tujuan/audiens; konsep dapat dijelaskan; pembeda dan asumsi jelas.',
              reflection: 'Apakah ide ini berbeda secara bermakna atau hanya tampak baru?',
              crossPrereqs: {}
            },
            {
              name: 'Storytelling',
              tiers: ['Narrative', 'Emotional Resonance', 'Mythmaking'],
              output: 'Tiga konten dari brief berbeda, versi revisi, tujuan pesan, dan umpan balik audiens.',
              criteria: 'Alur jelas, emosi tidak dimanipulasi secara menyesatkan, pesan diterima sesuai tujuan, pacing tepat.',
              reflection: 'Apakah respons audiens sesuai makna yang ingin saya komunikasikan?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 2, label: 'Brainstorming ≥ 2' }]
              }
            },
            {
              name: 'Production',
              tiers: ['Editing', 'Art Direction', 'Creative Direction'],
              output: 'Paket konten dengan brief kreatif, file proyek, versi awal/akhir, dan checklist mutu.',
              criteria: 'Audio/visual terbaca, konsistensi gaya, ekspor benar, workflow efisien, aksesibilitas dasar diperhatikan.',
              reflection: 'Perubahan mana paling meningkatkan kualitas, dan mana hanya dekorasi?',
              crossPrereqs: {
                2: [{ branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Concept Development ≥ 3' }]
              }
            },
            {
              name: 'Distribution',
              tiers: ['Publishing', 'Growth Strategy', 'Media Ecosystem'],
              output: 'Kalender publikasi, definisi metrik, hasil eksperimen distribusi, dan insight.',
              criteria: 'Platform dipilih karena tujuan; metrik relevan; interpretasi tidak menyimpulkan sebab-akibat berlebihan.',
              reflection: 'Apa yang dapat disimpulkan dari data ini, dan apa yang belum?',
              crossPrereqs: {
                2: [{ branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Emotional Resonance ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-content-v1.glb',
            material: 'Polikarbonat & Kain Teknis',
            shape: 'Kamera, Lensa & Rig Editing',
            accentHex: 0x2BB3A3
          }
        },
        {
          id: 'cat-07',
          order: '07',
          sortOrder: 7,
          slug: 'art',
          name: 'Art, Design & Aesthetics',
          shortTag: 'Art',
          floorPos: { x: -2.3, z: 2.75 },
          mappedActivities: 'Spatial art/interior design, flat art/digital art/painting, language art/writing.',
          capstone: 'Portofolio dengan beberapa karya, brief yang jelas, iterasi/revisi, dan penjelasan keputusan estetika.',
          guardrail: 'Sage dapat berupa bahasa artistik yang khas tanpa pengakuan industri. Pada desain ruang, fungsi dan keselamatan tetap wajib.',
          branches: [
            {
              name: 'Spatial Art',
              tiers: ['Layout', 'Spatial Design', 'Environmental Experience'],
              output: 'Denah atau layout, moodboard, pilihan material/pencahayaan, dan alasan keputusan ruang.',
              criteria: 'Sirkulasi, proporsi, fungsi pengguna, pencahayaan, dan material saling mendukung.',
              reflection: 'Pengalaman apa yang dibentuk ruang ini untuk pengguna?',
              crossPrereqs: {
                2: [{ branchIdx: 3, tierIdx: 0, minScore: 3, label: 'Composition ≥ 3' }]
              }
            },
            {
              name: 'Visual Art',
              tiers: ['Representation', 'Stylization', 'Visual Language'],
              output: 'Seri karya dari brief sama dengan eksplorasi referensi, studi komposisi, dan revisi.',
              criteria: 'Kontrol bentuk/nilai/warna, komposisi sengaja, gaya konsisten, dan pengaruh referensi dikenali.',
              reflection: 'Elemen visual apa yang membawa makna utama?',
              crossPrereqs: {
                1: [{ branchIdx: 3, tierIdx: 0, minScore: 2, label: 'Composition ≥ 2' }]
              }
            },
            {
              name: 'Language Art',
              tiers: ['Writing', 'Rhetoric', 'Literary Craft'],
              output: 'Tulisan dengan outline, draft, revisi, dan catatan pilihan kata atau struktur.',
              criteria: 'Kejelasan, suara naratif, ritme, retorika, koherensi, dan kesesuaian gaya terhadap tujuan.',
              reflection: 'Bagian mana yang akan hilang atau berubah jika kalimat ini dihapus?',
              crossPrereqs: {}
            },
            {
              name: 'Aesthetics',
              tiers: ['Composition', 'Art Direction', 'Artistic Vision'],
              output: 'Portofolio kurasi dengan brief, sistem visual, alasan komposisi, dan evaluasi lintas karya.',
              criteria: 'Keputusan bentuk mendukung konsep; konsistensi tanpa monoton; orisinalitas tidak sekadar dekorasi.',
              reflection: 'Mengapa pilihan ini terasa sesuai, dan untuk siapa?',
              crossPrereqs: {
                2: [{ branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Stylization ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-art-v1.glb',
            material: 'Kanvas, Kayu & Pigmen',
            shape: 'Palet, Kuas & Sketchbook',
            accentHex: 0xDF643A
          }
        },
        {
          id: 'cat-08',
          order: '08',
          sortOrder: 8,
          slug: 'interpersonal-skill',
          name: 'Interpersonal Intelligence & Leadership',
          shortTag: 'Interpersonal',
          floorPos: { x: 0.0, z: 2.90 },
          mappedActivities: 'Communication skill, leadership, psychology.',
          capstone: 'Portofolio simulasi, feedback multi-perspektif, dan analisis percakapan atau konflik yang menunjukkan listening, regulasi, keadilan, dan perbaikan setelah feedback.',
          guardrail: 'Influence memerlukan Persuasion, Psychological Insight, dan Ethical Reasoning. Manipulation/Coercive Control adalah cabang risiko, bukan tier mastery.',
          branches: [
            {
              name: 'Communication',
              tiers: ['Articulation', 'Persuasion', 'Influence'],
              output: 'Tiga simulasi percakapan dengan keberatan berbeda.',
              criteria: 'Jelas, mendengar, merespons keberatan tanpa menekan.',
              reflection: 'Apakah pihak lain merasa dipahami?',
              crossPrereqs: {
                1: [{ branchIdx: 3, tierIdx: 0, minScore: 3, label: 'Emotional Awareness ≥ 3' }],
                2: [{ branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Behavioral Analysis / Psych Insight ≥ 3' }]
              }
            },
            {
              name: 'Psychology',
              tiers: ['Observation', 'Behavioral Analysis', 'Psychological Insight'],
              output: 'Catatan observasi dari kasus/simulasi yang etis.',
              criteria: 'Pisahkan perilaku, inferensi, dan penjelasan alternatif.',
              reflection: 'Penjelasan lain apa yang mungkin?',
              crossPrereqs: {}
            },
            {
              name: 'Leadership',
              tiers: ['Coordination', 'Delegation', 'Organizational Leadership'],
              output: 'Rencana kerja tim, feedback, dan review hasil.',
              criteria: 'Tujuan, delegasi, akuntabilitas, dan perkembangan anggota.',
              reflection: 'Apakah tim makin mandiri?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 3, label: 'Articulation ≥ 3' }],
                2: [{ branchIdx: 3, tierIdx: 1, minScore: 3, label: 'Emotional Regulation ≥ 3' }]
              }
            },
            {
              name: 'Emotional Intelligence',
              tiers: ['Awareness', 'Regulation', 'Emotional Wisdom'],
              output: 'Log pemicu, respons, strategi regulasi, dan hasil.',
              criteria: 'Mengenali emosi; memilih respons sesuai konteks dan nilai.',
              reflection: 'Apa yang memicu reaksi saya?',
              crossPrereqs: {}
            },
            {
              name: 'Conflict Resolution',
              tiers: ['Negotiation', 'Mediation', 'Reconciliation'],
              output: 'Simulasi mediasi dengan perspektif beberapa pihak.',
              criteria: 'Memahami kepentingan, mendengar adil, menjaga batas, mencatat kesepakatan.',
              reflection: 'Apakah solusi menangani akar masalah?',
              crossPrereqs: {
                1: [{ branchIdx: 3, tierIdx: 0, minScore: 3, label: 'Emotional Awareness ≥ 3' }],
                2: [{ branchIdx: 3, tierIdx: 1, minScore: 3, label: 'Regulation ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-interpersonal-v2.glb',
            material: 'Keramik Hangat, Kayu & Kuningan',
            shape: 'Cangkir Kopi Dialog & Mikrofon Podcast',
            accentHex: 0xE08A3C
          }
        },
        {
          id: 'cat-09',
          order: '09',
          sortOrder: 9,
          slug: 'exploration-adaptation',
          name: 'Exploration, Technology & Adaptability',
          shortTag: 'Exploration',
          floorPos: { x: 2.3, z: 2.75 },
          mappedActivities: 'AI, computer, news/information literacy, environmental and cultural agility.',
          capstone: 'Laporan eksperimen teknologi atau workflow baru yang memuat baseline, tujuan, validasi, dampak terukur, risiko, dan keputusan apakah solusi layak dipertahankan.',
          guardrail: 'AI Orchestration memerlukan workflow, verifikasi, dan fallback, bukan prompt saja. Cultural competence menguji penghormatan konteks, bukan stereotip.',
          branches: [
            {
              name: 'Technology',
              tiers: ['Digital Literacy', 'Automation', 'Technological Fluency'],
              output: 'Dokumentasikan workflow dan ukur sebelum/sesudah.',
              criteria: 'Kualitas/efisiensi membaik; risiko data dikenali.',
              reflection: 'Apakah teknologi menambah nilai bersih?',
              crossPrereqs: {}
            },
            {
              name: 'Artificial Intelligence',
              tiers: ['Prompting', 'Workflow Integration', 'AI Orchestration'],
              output: 'Workflow AI dengan verifikasi dan fallback.',
              criteria: 'Output diverifikasi; batas model, privasi, dan kontrol dijaga.',
              reflection: 'Apa yang wajib diperiksa manusia?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 2, label: 'Digital Literacy ≥ 2' }],
                2: [
                  { branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Automation ≥ 3' },
                  { branchIdx: 2, tierIdx: 0, minScore: 3, label: 'Information Retrieval ≥ 3' }
                ]
              }
            },
            {
              name: 'Research',
              tiers: ['Information Retrieval', 'Investigation', 'Knowledge Synthesis'],
              output: 'Brief riset dengan pertanyaan, sumber, dan sintesis.',
              criteria: 'Sumber relevan; konteks, ketidakpastian, fakta/opini dipisahkan.',
              reflection: 'Bukti berlawanan apa yang belum dicari?',
              crossPrereqs: {}
            },
            {
              name: 'Adaptability',
              tiers: ['Adjustment', 'Learning Agility', 'Adaptive Intelligence'],
              output: 'Proyek singkat dengan tool/domain baru.',
              criteria: 'Mentransfer prinsip, mencari feedback, dan menghentikan eksperimen yang tak berguna.',
              reflection: 'Apa yang bisa ditransfer?',
              crossPrereqs: {
                2: [{ branchIdx: 2, tierIdx: 1, minScore: 3, label: 'Investigation ≥ 3' }]
              }
            },
            {
              name: 'Cultural Intelligence',
              tiers: ['Awareness', 'Cultural Fluency', 'Cross-Cultural Competence'],
              output: 'Refleksi interaksi lintas budaya dan asumsi awal.',
              criteria: 'Hindari generalisasi; hormati konteks dan perspektif lokal.',
              reflection: 'Asumsi apa yang saya anggap universal?',
              crossPrereqs: {
                2: [{ branchIdx: 3, tierIdx: 1, minScore: 3, label: 'Learning Agility ≥ 3' }]
              }
            }
          ],
          visual: {
            modelKey: 'category-exploration-v2.glb',
            material: 'Aluminium Anodized, Lensa Optik & Peta',
            shape: 'Laptop AI Modern, Teropong & Peta Dunia',
            accentHex: 0x2BB3A3
          }
        },
        {
          id: 'cat-10',
          order: '10',
          sortOrder: 10,
          slug: 'critical-thinking-logic',
          name: 'Critical Thinking, Logic & Philosophy',
          shortTag: 'Logic',
          floorPos: { x: 4.6, z: 2.40 },
          mappedActivities: 'First-Principles Thinking, cognitive bias awareness, deductive/inductive reasoning, philosophy, logical reasoning.',
          capstone: 'Tiga analisis masalah atau klaim dengan sumber yang dapat diperiksa, peta argumen, asumsi, alternatif, prediksi, dan catatan revisi keyakinan.',
          guardrail: 'Sage bukan berarti selalu benar atau sinis; ukur penalaran yang dapat diuji, kalibrasi, keterbukaan pada koreksi, dan pengelolaan ketidakpastian.',
          branches: [
            {
              name: 'Logic',
              tiers: ['Deduction', 'Formal Reasoning', 'Proof'],
              output: 'Peta argumen: premis, inferensi, kesimpulan.',
              criteria: 'Premis jelas, inferensi valid, definisi konsisten.',
              reflection: 'Apakah kesimpulan mengikuti premis?',
              crossPrereqs: {}
            },
            {
              name: 'Epistemology',
              tiers: ['Questioning', 'Evidence Evaluation', 'Epistemic Judgment'],
              output: 'Analisis klaim, sumber, bukti, dan ketidakpastian.',
              criteria: 'Pisahkan fakta, keyakinan, dan ketidaktahuan; update jika bukti berubah.',
              reflection: 'Bukti apa yang akan mengubah pikiran?',
              crossPrereqs: {
                2: [{ branchIdx: 3, tierIdx: 1, minScore: 3, label: 'Bias Mitigation ≥ 3' }]
              }
            },
            {
              name: 'First Principles',
              tiers: ['Decomposition', 'Fundamental Analysis', 'Conceptual Reconstruction'],
              output: 'Urai dua kasus: fakta, asumsi, kendala, alternatif.',
              criteria: 'Uji asumsi, jelaskan trade-off, evaluasi hasil.',
              reflection: 'Mana yang dasar dan mana kebiasaan?',
              crossPrereqs: {
                1: [{ branchIdx: 0, tierIdx: 0, minScore: 2, label: 'Deduction ≥ 2' }]
              }
            },
            {
              name: 'Cognitive Bias',
              tiers: ['Bias Awareness', 'Bias Mitigation', 'Debiasing Systems'],
              output: 'Log prediksi/keputusan dan post-mortem.',
              criteria: 'Kenali bias dan gunakan prosedur koreksi.',
              reflection: 'Apa yang dapat menunjukkan saya salah?',
              crossPrereqs: {
                1: [{ branchIdx: 1, tierIdx: 0, minScore: 2, label: 'Questioning ≥ 2' }]
              }
            },
            {
              name: 'Systems Thinking',
              tiers: ['Causal Reasoning', 'Feedback Loops', 'Systems Modeling'],
              output: 'Diagram sebab-akibat/feedback loop dan prediksi.',
              criteria: 'Bedakan sebab/gejala; perhatikan delay dan feedback.',
              reflection: 'Apa efek tidak langsungnya?',
              crossPrereqs: {
                2: [{ branchIdx: 2, tierIdx: 1, minScore: 3, label: 'Fundamental Analysis ≥ 3' }]
              }
            },
            {
              name: 'Philosophy',
              tiers: ['Conceptual Analysis', 'Philosophical Inquiry', 'Philosophical Synthesis'],
              output: 'Esai yang membandingkan dua posisi.',
              criteria: 'Argumen koheren; keberatan dipertimbangkan secara adil.',
              reflection: 'Apakah posisi lawan saya wakili secara adil?',
              crossPrereqs: {
                2: [
                  { branchIdx: 0, tierIdx: 1, minScore: 3, label: 'Formal Reasoning ≥ 3' },
                  { branchIdx: 1, tierIdx: 1, minScore: 3, label: 'Evidence Evaluation ≥ 3' }
                ]
              }
            }
          ],
          visual: {
            modelKey: 'category-logic-v2.glb',
            material: 'Kayu Eboni/Maple, Kaca Optik & Buku',
            shape: 'Papan Catur Strategi, Kaca Pembesar & Buku Filsafat',
            accentHex: 0x5B8296
          }
        }
      ];

      const TIER_META = [
        { tier: 1, key: 'basic', name: 'Tier 1 · Basic', shortName: 'Basic', ringRadius: 58, badgeColor: '#3898A6' },
        { tier: 2, key: 'advanced', name: 'Tier 2 · Advanced', shortName: 'Advanced', ringRadius: 102, badgeColor: '#E08A28' },
        { tier: 3, key: 'sage', name: 'Tier 3 · Sage', shortName: 'Sage', ringRadius: 144, badgeColor: '#DF5B1F' }
      ];

      const DOMAIN_CONSTELLATIONS = {
  "wpda": {
    "name": "Rasi Salib Cahaya & Mahkota (Crux & Corona)",
    "symbol": "✝️👑",
    "desc": "Empat penjuru salib lentera rohani yang memancarkan mahkota hikmat dari teks menuju pelayanan hidup.",
    "branchAnglesDeg": [
      -90,
      0,
      90,
      180
    ],
    "tierRadiusScale": [
      [
        1.08,
        1.08,
        1.12
      ],
      [
        1.02,
        1.0,
        1.02
      ],
      [
        1.05,
        1.05,
        1.08
      ],
      [
        1.02,
        1.0,
        1.02
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        7,
        10
      ],
      [
        10,
        1
      ],
      [
        0,
        6
      ],
      [
        3,
        9
      ]
    ]
  },
  "physical-wellness": {
    "name": "Rasi Perisai Vitalitas & Sayap (Aegis & Phoenix Wing)",
    "symbol": "🛡️🦅",
    "desc": "Rentang sayap elang dan perisai kebugaran yang menyeimbangkan kekuatan, daya tahan, ketangkasan, serta pemulihan.",
    "branchAnglesDeg": [
      -132,
      -48,
      48,
      132
    ],
    "tierRadiusScale": [
      [
        1.05,
        1.08,
        1.12
      ],
      [
        1.05,
        1.08,
        1.12
      ],
      [
        0.98,
        1.02,
        1.05
      ],
      [
        0.98,
        1.02,
        1.05
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        7,
        10
      ],
      [
        10,
        1
      ],
      [
        0,
        3
      ],
      [
        6,
        9
      ],
      [
        2,
        8
      ],
      [
        5,
        11
      ]
    ]
  },
  "music": {
    "name": "Rasi Harpa Harmoni (Lyra Harmonia)",
    "symbol": "🎵✨",
    "desc": "Lengkungan harpa kosmik tempat teknik instrumen, teori harmoni, aransemen, dan kepemimpinan panggung beresonansi.",
    "branchAnglesDeg": [
      -125,
      -55,
      50,
      130
    ],
    "tierRadiusScale": [
      [
        1.04,
        1.1,
        1.14
      ],
      [
        1.04,
        1.1,
        1.14
      ],
      [
        0.98,
        1.02,
        1.06
      ],
      [
        0.98,
        1.02,
        1.06
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ],
      [
        1,
        4
      ],
      [
        2,
        11
      ],
      [
        5,
        8
      ],
      [
        0,
        3
      ],
      [
        3,
        6
      ],
      [
        6,
        9
      ],
      [
        9,
        0
      ]
    ]
  },
  "engineering": {
    "name": "Rasi Kompas Teknis & Roda Gigi (Circinus & Machina)",
    "symbol": "⚙️📐",
    "desc": "Jangka ukur presisi dan rangka trus rekayasa yang mengikat elektronika, mekanika, CAD 3D, dan arsitektur sistem.",
    "branchAnglesDeg": [
      -90,
      -12,
      82,
      168
    ],
    "tierRadiusScale": [
      [
        1.06,
        1.08,
        1.12
      ],
      [
        1.04,
        1.06,
        1.08
      ],
      [
        1.02,
        1.04,
        1.06
      ],
      [
        1.04,
        1.06,
        1.08
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        7,
        10
      ],
      [
        10,
        1
      ],
      [
        2,
        7
      ],
      [
        11,
        4
      ],
      [
        0,
        6
      ]
    ]
  },
  "business": {
    "name": "Rasi Timbangan & Puncak Berlian (Libra & Apex)",
    "symbol": "⚖️💎",
    "desc": "Timbangan ekonomi dan berlian nilai yang menghubungkan fondasi sistem, disiplin finansial, pemasaran, dan wirausaha.",
    "branchAnglesDeg": [
      -90,
      -8,
      90,
      -172
    ],
    "tierRadiusScale": [
      [
        0.98,
        1.0,
        1.04
      ],
      [
        1.08,
        1.1,
        1.14
      ],
      [
        1.08,
        1.1,
        1.14
      ],
      [
        1.04,
        1.08,
        1.12
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        7,
        10
      ],
      [
        10,
        1
      ],
      [
        5,
        11
      ],
      [
        2,
        8
      ]
    ]
  },
  "content-creating": {
    "name": "Rasi Prisma Lensa & Suar (Prism & Beacon)",
    "symbol": "🎥🌟",
    "desc": "Prisma optik yang membiaskan satu benih ide menjadi narasi emosional, produksi visual, dan pancaran ekosistem media.",
    "branchAnglesDeg": [
      -142,
      -38,
      38,
      142
    ],
    "tierRadiusScale": [
      [
        1.0,
        1.04,
        1.08
      ],
      [
        1.06,
        1.08,
        1.12
      ],
      [
        1.06,
        1.08,
        1.12
      ],
      [
        1.0,
        1.04,
        1.08
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ],
      [
        0,
        4
      ],
      [
        0,
        7
      ],
      [
        3,
        8
      ],
      [
        6,
        5
      ],
      [
        1,
        10
      ]
    ]
  },
  "art": {
    "name": "Rasi Spiral Emas & Lotus (Spiralis Aurea)",
    "symbol": "🎨🪷",
    "desc": "Proporsi spiral emas dan kelopak estetika yang menyatukan seni ruang, ilustrasi visual, sastra, dan visi artistik.",
    "branchAnglesDeg": [
      -108,
      -18,
      72,
      162
    ],
    "tierRadiusScale": [
      [
        0.96,
        1.0,
        1.04
      ],
      [
        1.02,
        1.06,
        1.1
      ],
      [
        1.06,
        1.1,
        1.14
      ],
      [
        1.1,
        1.12,
        1.16
      ]
    ],
    "constellationLines": [
      [
        0,
        4
      ],
      [
        4,
        8
      ],
      [
        8,
        11
      ],
      [
        3,
        7
      ],
      [
        7,
        11
      ],
      [
        9,
        1
      ],
      [
        1,
        5
      ],
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        2
      ]
    ]
  },
  "interpersonal-skill": {
    "name": "Rasi Bintang Utara & Jembatan Empati (Polaris Pentagram)",
    "symbol": "🌟🤝",
    "desc": "Pentagram 5 sudut yang menghubungkan komunikasi, psikologi, kepemimpinan, regulasi emosi, dan rekonsiliasi.",
    "branchAnglesDeg": [
      -90,
      -18,
      54,
      126,
      198
    ],
    "tierRadiusScale": [
      [
        1.04,
        1.06,
        1.1
      ],
      [
        1.04,
        1.06,
        1.1
      ],
      [
        1.04,
        1.06,
        1.1
      ],
      [
        1.04,
        1.06,
        1.1
      ],
      [
        1.04,
        1.06,
        1.1
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        14
      ],
      [
        14,
        2
      ],
      [
        1,
        7
      ],
      [
        7,
        13
      ],
      [
        13,
        4
      ],
      [
        4,
        10
      ],
      [
        10,
        1
      ]
    ]
  },
  "exploration-adaptation": {
    "name": "Rasi Mawar Kompas Navigasi (Pyxis Mariner Rose)",
    "symbol": "🧭🌌",
    "desc": "Mawar kompas 5 penjuru bagi penjelajah teknologi, orkestrasi AI, sintesis riset, kelincahan belajar, dan lintas budaya.",
    "branchAnglesDeg": [
      -90,
      -18,
      54,
      126,
      198
    ],
    "tierRadiusScale": [
      [
        1.08,
        1.1,
        1.15
      ],
      [
        1.0,
        1.03,
        1.06
      ],
      [
        1.05,
        1.08,
        1.12
      ],
      [
        1.05,
        1.08,
        1.12
      ],
      [
        1.0,
        1.03,
        1.06
      ]
    ],
    "constellationLines": [
      [
        2,
        5
      ],
      [
        5,
        8
      ],
      [
        8,
        11
      ],
      [
        11,
        14
      ],
      [
        14,
        2
      ],
      [
        0,
        4
      ],
      [
        4,
        6
      ],
      [
        6,
        10
      ],
      [
        10,
        12
      ],
      [
        12,
        1
      ],
      [
        1,
        14
      ],
      [
        1,
        5
      ]
    ]
  },
  "critical-thinking-logic": {
    "name": "Rasi Heksagram Aksioma & Burung Hantu (Athena Hexagram)",
    "symbol": "🦉🔯",
    "desc": "Heksagram ganda 6 sudut yang menautkan logika deduktif, epistemologi, first principles, mitigasi bias, sistem, dan filsafat.",
    "branchAnglesDeg": [
      -90,
      -30,
      30,
      90,
      150,
      210
    ],
    "tierRadiusScale": [
      [
        1.05,
        1.08,
        1.12
      ],
      [
        1.02,
        1.05,
        1.08
      ],
      [
        1.05,
        1.08,
        1.12
      ],
      [
        1.02,
        1.05,
        1.08
      ],
      [
        1.05,
        1.08,
        1.12
      ],
      [
        1.02,
        1.05,
        1.08
      ]
    ],
    "constellationLines": [
      [
        2,
        8
      ],
      [
        8,
        14
      ],
      [
        14,
        2
      ],
      [
        5,
        11
      ],
      [
        11,
        17
      ],
      [
        17,
        5
      ],
      [
        1,
        4
      ],
      [
        4,
        7
      ],
      [
        7,
        10
      ],
      [
        10,
        13
      ],
      [
        13,
        16
      ],
      [
        16,
        1
      ]
    ]
  }
};

      const TIER_DETAILS_CATALOG = {
  "wpda": {
    "Biblical Understanding": [
      {
        "title": "Reading",
        "whatIs": "Kemampuan membaca teks Alkitab secara utuh, teliti, dan berurutan (observasi tekstual) untuk menangkap fakta naratif, tokoh, alur, serta kata kunci sebelum melompat ke opini pribadi.",
        "howToUse": "Pilih satu bagian bacaan/pasal, baca perlahan minimal 2 kali, tandai kata berulang, kata hubung sebab-akibat, serta catat fakta \"Siapa, Apa, Di mana, Kapan\" di jurnal Diary Alkitab tanpa buru-buru menafsirkan.",
        "targetWorks": [
          "Tugas Besar 1 [Reading]: Membangun & Mengimplementasikan jurnal Observasi 14 Hari berturut-turut pada satu kitab pendek (misal: Filipi atau Yakobus) lengkap dengan daftar kata kunci dan fakta teks. (Output nyata teruji di lapangan sebagai bukti penguasaan Reading).",
          "Tugas Besar 2 [Reading]: Merancang, Menguji & Mendokumentasikan peta Alur bagian bacaan Visual (Mindmap/Tabel 5W+1H) yang memisahkan \"Apa yang tertulis di ayat\" vs \"Asumsi awal saya\". (Output nyata teruji di lapangan sebagai bukti penguasaan Reading).",
          "Tugas Besar 3 [Reading]: Meluncurkan & Memvalidasi di Dunia Nyata catatan Perbandingan 2 Terjemahan (TB & BIMK/ESV) pada 5 bagian bacaan pilihan untuk menemukan nuansa kata yang lebih jernih. (Output nyata teruji di lapangan sebagai bukti penguasaan Reading)."
        ],
        "criteria": "Observasi setia pada teks tertulis; mampu membedakan kalimat eksplisit di ayat dari opini atau perasaan pribadi."
      },
      {
        "title": "Interpretation",
        "whatIs": "Kemampuan menggali makna asli yang dimaksud penulis bagi pendengar pertamanya (penggalian makna ayat sesuai konteksnya) dengan memperhatikan latar sejarah, budaya, genre sastra, dan konteks pasal sebelum/sesudah.",
        "howToUse": "Setelah observasi (Reading), periksa konteks ayat sebelum & sesudahnya, identifikasi jenis sastra (narasi, puisi, surat pengajaran), lalu rumuskan 1 kalimat \"Pesan Inti iman\" sebelum ditarik ke aplikasi masa kini.",
        "targetWorks": [
          "Tugas Besar 1 [Interpretation]: Membangun & Mengimplementasikan 3 Dokumen Studi bagian bacaan Lengkap (Teks → Konteks Historis/Sastra → Makna Asli → Jembatan Aplikasi Kontekstual). (Output nyata teruji di lapangan sebagai bukti penguasaan Interpretation).",
          "Tugas Besar 2 [Interpretation]: Merancang, Menguji & Mendokumentasikan analisis Koreksi Ayat yang Sering Dicabut dari Konteks: membedah 3 ayat populer secara utuh berdasarkan pasal penuhnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Interpretation).",
          "Tugas Besar 3 [Interpretation]: Meluncurkan & Memvalidasi di Dunia Nyata lembar Pemetaan Silang (Cross-Reference Study) yang menelusuri 1 tema iman lintas Perjanjian Lama dan Perjanjian Baru. (Output nyata teruji di lapangan sebagai bukti penguasaan Interpretation)."
        ],
        "criteria": "Klaim tafsir dapat ditelusuri ke konteks teks dan latar historis/sastra; tidak memaksakan agenda pribadi ke dalam ayat (memaksakan opini pribadi ke dalam ayat)."
      },
      {
        "title": "Hermeneutics",
        "whatIs": "Penguasaan kerangka prinsip penafsiran lintas genre Alkitab dan kemampuan menjembatani teks kuno dengan isu kehidupan modern yang kompleks secara bertanggung jawab, konsisten, dan rendah hati.",
        "howToUse": "Gunakan prinsip prinsip penafsiran yang sehat (kesatuan kanon, progresivitas wahyu, kepekaan genre) untuk membedah bagian Alkitab yang sulit/paradoks, timbang beberapa pandangan penafsir iman yang sehat, lalu susun sintesis aplikatif yang utuh.",
        "targetWorks": [
          "Tugas Besar 1 [Hermeneutics]: Membangun & Mengimplementasikan monograf / Esai Eksegesis Mendalam pada 1 bagian bacaan sulit lengkap dengan perbandingan 2–3 tafsiran (commentary) dan kesimpulan etis. (Output nyata teruji di lapangan sebagai bukti penguasaan Hermeneutics).",
          "Tugas Besar 2 [Hermeneutics]: Merancang, Menguji & Mendokumentasikan panduan Metode Studi Alkitab Pribadi (SOP prinsip penafsiran yang sehat 5 Langkah) yang bisa dipakai untuk melatih teman komsel/kelompok kecil. (Output nyata teruji di lapangan sebagai bukti penguasaan Hermeneutics).",
          "Tugas Besar 3 [Hermeneutics]: Meluncurkan & Memvalidasi di Dunia Nyata kajian Tematik Lintas Kitab (Biblical Theology) yang memetakan perkembangan satu tema besar Alkitab dari Kejadian hingga Wahyu. (Output nyata teruji di lapangan sebagai bukti penguasaan Hermeneutics)."
        ],
        "criteria": "Penafsiran koheren lintas genre, jujur mengakui batas ketidaktahuan pada teks sulit, serta menghasilkan aplikasi yang mengubah karakter."
      }
    ],
    "Spiritual Communication": [
      {
        "title": "Sharing",
        "whatIs": "Kemampuan membagikan satu kebenaran Firman dan kesaksian refleksi pribadi secara jujur, ringkas, hangat, dan membumi melalui percakapan maupun media singkat (WhatsApp/Reels/Shorts).",
        "howToUse": "Pilih 1 poin firman yang sudah kamu hidupi, susun dengan alur Hook Releva -> Kebenaran Ayat -> Cerita/Aplikasi Nyata -> Kalimat Penguatan (1–2 menit), lalu bagikan tanpa nada menggurui.",
        "targetWorks": [
          "Tugas Besar 1 [Sharing]: Membangun & Mengimplementasikan 5 Konten Sharing Firman Singkat (Teks WhatsApp Terstruktur atau Video Shorts/Reels 60–90 detik) dengan pesan satu fokus. (Output nyata teruji di lapangan sebagai bukti penguasaan Sharing).",
          "Tugas Besar 2 [Sharing]: Merancang, Menguji & Mendokumentasikan 3 Rekaman Voice Note / Video Refleksi Pribadi yang menceritakan bagaimana satu ayat menegur dan mengubah tindakanmu minggu itu. (Output nyata teruji di lapangan sebagai bukti penguasaan Sharing).",
          "Tugas Besar 3 [Sharing]: Meluncurkan & Memvalidasi di Dunia Nyata kartu Kutipan & Renungan Mikro Visual (Carousel 3–5 slide) yang menerjemahkan bagian bacaan harian ke bahasa teman sebaya. (Output nyata teruji di lapangan sebagai bukti penguasaan Sharing)."
        ],
        "criteria": "Pesan jernih, relevan bagi pendengar, tulus tanpa dibuat-buat, dan setia pada makna ayat."
      },
      {
        "title": "Teaching",
        "whatIs": "Kemampuan menyusun dan menyampaikan pengajaran Firman yang sistematis, interaktif, dan menjawab kebutuhan nyata audiens dalam kelompok kecil atau ibadah.",
        "howToUse": "Susun outline pengajaran (Masalah Hidup -> Penggalian Teks -> Prinsip Kebenaran -> Ilustrasi Konkret -> Pertanyaan Diskusi), fasilitasi tanya-jawab dengan sabar, dan evaluasi apakah audiens menangkap inti pesannya.",
        "targetWorks": [
          "Tugas Besar 1 [Teaching]: Membangun & Mengimplementasikan 2 Paket Modul Pengajaran / Bahan Diskusi Komsel lengkap dengan naskah, ilustrasi kontekstual, dan 5 pertanyaan pemantik diskusi. (Output nyata teruji di lapangan sebagai bukti penguasaan Teaching).",
          "Tugas Besar 2 [Teaching]: Merancang, Menguji & Mendokumentasikan rekaman Audio/Video Memimpin 1 Sesi Sharing/Pengajaran (15–30 menit) beserta catatan evaluasi dari 2 pendengar. (Output nyata teruji di lapangan sebagai bukti penguasaan Teaching).",
          "Tugas Besar 3 [Teaching]: Meluncurkan & Memvalidasi di Dunia Nyata workshop / Kelas Mini Tematik yang menjawab 1 pergumulan praktis anak muda (misal: panggilan kerja, kecemasan, integritas) dari sudut pandang Firman. (Output nyata teruji di lapangan sebagai bukti penguasaan Teaching)."
        ],
        "criteria": "Struktur pengajaran runtut, audiens terlibat aktif dalam diskusi, dan tidak memaksakan kesimpulan tanpa dasar teks."
      },
      {
        "title": "Discipleship",
        "whatIs": "Kemampuan berjalan bersama orang lain dalam jangka panjang (pemuridan relasional) untuk menumbuhkan kemandirian rohani, kedewasaan karakter, dan kapasitas mereka untuk memuridkan orang lain.",
        "howToUse": "Bangun ritme pertemuan berkala (1-on-1 atau kelompok kecil), dengarkan pergumulan hidup mereka dengan empati, ajarkan cara menggali Firman sendiri, dan beri teladan keterbukaan hidup.",
        "targetWorks": [
          "Tugas Besar 1 [Discipleship]: Membangun & Mengimplementasikan kurikulum & Peta Jalan Pendampingan (Discipleship Roadmap 3–6 Bulan) yang disesuaikan dengan kebutuhan spesifik 1–2 adik rohani. (Output nyata teruji di lapangan sebagai bukti penguasaan Discipleship).",
          "Tugas Besar 2 [Discipleship]: Merancang, Menguji & Mendokumentasikan jurnal Log Pendampingan & Doa Berkala (dengan menjaga kerahasiaan/privasi) yang mencatat pertumbuhan kemandirian orang yang didampingi. (Output nyata teruji di lapangan sebagai bukti penguasaan Discipleship).",
          "Tugas Besar 3 [Discipleship]: Meluncurkan & Memvalidasi di Dunia Nyata proyek Reproduksi Pelayan: mendampingi 1 rekan hingga ia berani dan mampu memimpin sesi sharing/komsel secara mandiri. (Output nyata teruji di lapangan sebagai bukti penguasaan Discipleship)."
        ],
        "criteria": "Orang yang didampingi bertumbuh makin mandiri di dalam Tuhan (bukan bergantung pada figurmu) dan memiliki karakter yang sehat."
      }
    ],
    "Worship": [
      {
        "title": "Performance",
        "whatIs": "Penguasaan kesiapan teknis vokal/instrumen, ketepatan tempo, penghayatan lirik, serta hati yang menyembah saat membawakan lagu pujian secara pribadi maupun di dalam tim.",
        "howToUse": "Pelajari lirik dan makna iman lagu sebelum latihan teknis, latih transisi chord/vokal dengan metronom, dan pastikan ekspresi musikal melayani isi doa dari lagu tersebut.",
        "targetWorks": [
          "Tugas Besar 1 [Performance]: Membangun & Mengimplementasikan 3 Rekaman Ibadah Pribadi / Mengiringi Lagu Rohani dari awal hingga akhir dengan tempo stabil, kejelasan bunyi/ucapan jelas, dan penghayatan tulus. (Output nyata teruji di lapangan sebagai bukti penguasaan Performance).",
          "Tugas Besar 2 [Performance]: Merancang, Menguji & Mendokumentasikan daftar Aransemen Dasar & Lembar Chord/Lirik untuk 8 lagu pujian/penyembahan lengkap dengan penanda keras-lembutnya permainan (lembut → klimaks → teduh). (Output nyata teruji di lapangan sebagai bukti penguasaan Performance).",
          "Tugas Besar 3 [Performance]: Meluncurkan & Memvalidasi di Dunia Nyata latihan Transposisi Cepat: membawakan 2 lagu ibadah di 2 nada dasar berbeda agar siap menyesuaikan jangkauan suara jemaat. (Output nyata teruji di lapangan sebagai bukti penguasaan Performance)."
        ],
        "criteria": "Eksekusi musik/vokal rapi, bebas distraksi teknis, dan memancarkan ketulusan penyembahan."
      },
      {
        "title": "Leadership",
        "whatIs": "Kemampuan merancang alur ibadah (worship flow), memberi aba-aba (cue) yang jelas kepada pemusik, serta menuntun fokus jemaat masuk ke dalam hadirat Tuhan dengan peka dan rendah hati.",
        "howToUse": "Susun daftar lagu yang selaras dengan tema Firman, latih kalimat jembatan (spoken transition) yang singkat dan alkitabiah, serta komunikasikan keras-lembutnya permainan dengan tim musik sejak latihan (rehearsal).",
        "targetWorks": [
          "Tugas Besar 1 [Leadership]: Membangun & Mengimplementasikan 2 Dokumen Rancangan Sesi Ibadah (Worship Setlist + Tema iman + Naskah Kalimat Transisi/Doa + Cue Sheet Band). (Output nyata teruji di lapangan sebagai bukti penguasaan Leadership).",
          "Tugas Besar 2 [Leadership]: Merancang, Menguji & Mendokumentasikan rekaman Memimpin 1 Sesi Pujian/Penyembahan secara penuh (termasuk koordinasi latihan bersama pemusik) disertai catatan refleksi tim. (Output nyata teruji di lapangan sebagai bukti penguasaan Leadership).",
          "Tugas Besar 3 [Leadership]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Pasca-Ibadah bersama tim pelayanan yang mengidentifikasi momen transisi yang mengalir baik dan bagian yang perlu diperbaiki. (Output nyata teruji di lapangan sebagai bukti penguasaan Leadership)."
        ],
        "criteria": "Alur lagu menyatu dengan tema ibadah, komunikasi tim musik solid, dan fokus jemaat tertuju kepada Tuhan, bukan pada panggung."
      },
      {
        "title": "Ministry",
        "whatIs": "Kematangan pelayanan ibadah yang membangun budaya tim yang sehat, melatih generasi pelayan baru, serta menjaga kepekaan rohani dan kerendahan hati di luar panggung.",
        "howToUse": "Bangun ritual doa dan evaluasi kasih di dalam tim ibadah, distribusikan kesempatan melayani kepada anggota baru, dan selaraskan pelayanan musik dengan kebutuhan pastoral komunitas.",
        "targetWorks": [
          "Tugas Besar 1 [Ministry]: Membangun & Mengimplementasikan panduan Budaya & Standar Pelayanan Tim Worship (Etika Hati, Persiapan Teknis, dan Komunikasi Rehearsal). (Output nyata teruji di lapangan sebagai bukti penguasaan Ministry).",
          "Tugas Besar 2 [Ministry]: Merancang, Menguji & Mendokumentasikan program Mentoring Pelayan Baru: membimbing 1–2 worship leader atau pemusik muda dari tahap latihan hingga berani melayani di ibadah. (Output nyata teruji di lapangan sebagai bukti penguasaan Ministry).",
          "Tugas Besar 3 [Ministry]: Meluncurkan & Memvalidasi di Dunia Nyata retret / Sesi Evaluasi & Penyegaran Rohani Tim Pelayanan yang memulihkan motivasi melayani dari rutinitas panggung. (Output nyata teruji di lapangan sebagai bukti penguasaan Ministry)."
        ],
        "criteria": "Tim ibadah bertumbuh dalam kesehatian, regenerasi pelayan berjalan nyata, dan hidup sehari-hari selaras dengan apa yang dinyanyikan."
      }
    ],
    "Spiritual Formation": [
      {
        "title": "Discipline",
        "whatIs": "Kemampuan membangun dan menjaga ritme disiplin rohani harian (saat teduh, doa, perenungan Firman, dan keheningan) secara konsisten di tengah kesibukan.",
        "howToUse": "Tetapkan waktu dan tempat khusus setiap hari, matikan distraksi gawai, gunakan format jurnal sederhana (Sabda, Respons Doa, Langkah Ketaatan Hari Ini), dan jaga keberlanjutannya.",
        "targetWorks": [
          "Tugas Besar 1 [Discipline]: Membangun & Mengimplementasikan log Konsistensi Waktu Pribadi dengan Allah (WPDA Tracker 30 Hari) beserta ringkasan pelajaran rohani tiap pekan. (Output nyata teruji di lapangan sebagai bukti penguasaan Discipline).",
          "Tugas Besar 2 [Discipline]: Merancang, Menguji & Mendokumentasikan desain Ritual Pagi & Malam Pribadi yang memadukan pembacaan Alkitab, doa syafaat, dan pemeriksaan batin (examen). (Output nyata teruji di lapangan sebagai bukti penguasaan Discipline).",
          "Tugas Besar 3 [Discipline]: Meluncurkan & Memvalidasi di Dunia Nyata jurnal Doa & Jawaban Tuhan yang mencatat pokok pergumulan, proses menunggu, dan kesetiaan Tuhan sepanjang kuartal. (Output nyata teruji di lapangan sebagai bukti penguasaan Discipline)."
        ],
        "criteria": "Terbangun ritme rohani yang ajeg dan jujur, bukan sekadar formalitas atau bergantung pada suasana hati sesaat."
      },
      {
        "title": "Discernment",
        "whatIs": "Kepekaan rohani untuk menguji dan membedakan suara kebenaran, dorongan emosi sesaat, ambisi ego, serta pertimbangan etis ketika menghadapi pilihan hidup yang tidak hitam-putih.",
        "howToUse": "Saat menghadapi keputusan penting, petakan motivasi terdalammu, uji dengan prinsip Firman, cari nasihat dari mentor rohani yang dewasa, dan amati buah damai sejahtera serta integritasnya.",
        "targetWorks": [
          "Tugas Besar 1 [Discernment]: Membangun & Mengimplementasikan 2 Dokumen Analisis Keputusan Sulit (Discernment Matrix) yang menguraikan fakta, dorongan emosi, prinsip Firman, masukan mentor, dan keputusan akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan Discernment).",
          "Tugas Besar 2 [Discernment]: Merancang, Menguji & Mendokumentasikan jurnal Pemeriksaan Motivasi (Heart Audit) saat menerima pujian, kritik, atau tawaran peluang baru. (Output nyata teruji di lapangan sebagai bukti penguasaan Discernment).",
          "Tugas Besar 3 [Discernment]: Meluncurkan & Memvalidasi di Dunia Nyata studi Kasus Etika Sehari-hari: mengevaluasi 3 dilema nyata di kuliah/pekerjaan/relasi menggunakan kompas nilai Kerajaan Allah. (Output nyata teruji di lapangan sebagai bukti penguasaan Discernment)."
        ],
        "criteria": "Mampu memisahkan keinginan ego/emosi dari panggilan kebenaran, serta terbuka dikoreksi oleh Firman dan komunitas."
      },
      {
        "title": "Wisdom",
        "whatIs": "Integrasi utuh antara pengenalan akan Tuhan, keteduhan karakter, kerendahan hati, dan ketepatan bertindak di tengah krisis maupun keberhasilan hidup.",
        "howToUse": "Hidupi nilai-nilai kekekalan dalam keputusan jangka panjang, tetap tenang dan adil saat berada di bawah tekanan, serta jadilah tempat berteduh dan meminta pertimbangan yang bijak bagi sesama.",
        "targetWorks": [
          "Tugas Besar 1 [Wisdom]: Membangun & Mengimplementasikan piagam Kompas Hidup & Warisan Nilai Pribadi (Rule of Life) yang ditinjau dan dikalibrasi setiap semester. (Output nyata teruji di lapangan sebagai bukti penguasaan Wisdom).",
          "Tugas Besar 2 [Wisdom]: Merancang, Menguji & Mendokumentasikan catatan Refleksi Lintas Musim: membedah 1 kegagalan/krisis besar di masa lalu dan bagaimana proses itu membentuk hikmat serta empati baru. (Output nyata teruji di lapangan sebagai bukti penguasaan Wisdom).",
          "Tugas Besar 3 [Wisdom]: Meluncurkan & Memvalidasi di Dunia Nyata pendampingan Konseling/Pertimbangan Bijak bagi rekan yang sedang menghadapi persimpangan hidup dengan tetap menjaga kebebasan memilih mereka. (Output nyata teruji di lapangan sebagai bukti penguasaan Wisdom)."
        ],
        "criteria": "Keputusan hidup memancarkan buah Roh, integritas teruji saat tidak dilihat orang, dan menghadirkan damai sejahtera."
      }
    ]
  },
  "physical-wellness": {
    "Strength": [
      {
        "title": "Conditioning",
        "whatIs": "Kemampuan menguasai pola gerak dasar tubuh (push, pull, squat, hinge, core bracing) dengan postur yang aman, kontrol tempo yang benar, dan kebiasaan latihan kekuatan yang rutin.",
        "howToUse": "Mulai setiap sesi dengan pemanasan mobilitas sendi, latih gerakan bodyweight/beban dasar dengan fokus penuh pada rentang gerak (full range of motion) dan pernapasan, lalu catat repetisinya.",
        "targetWorks": [
          "Tugas Besar 1 [Conditioning]: Membangun & Mengimplementasikan video Cek Postur & Form pada 5 Gerakan Dasar (Push-up, Squat, Lunge/Hinge, Plank, Pull/Row) dengan kontrol tempo 3 detik turun. (Output nyata teruji di lapangan sebagai bukti penguasaan Conditioning).",
          "Tugas Besar 2 [Conditioning]: Merancang, Menguji & Mendokumentasikan jurnal Konsistensi Home-Gym / Latihan Kekuatan selama 4 minggu (minimal 3 sesi/minggu) lengkap dengan catatan persepsi usaha (tingkat capek). (Output nyata teruji di lapangan sebagai bukti penguasaan Conditioning).",
          "Tugas Besar 3 [Conditioning]: Meluncurkan & Memvalidasi di Dunia Nyata rangkaian Rutinitas Pemanasan Dinamis & Aktivasi Core 8 Menit yang wajib dijalankan sebelum sesi latihan beban. (Output nyata teruji di lapangan sebagai bukti penguasaan Conditioning)."
        ],
        "criteria": "Teknik gerak stabil tanpa kompensasi sendi/pinggang; tidak memaksakan beban di atas keamanan postur."
      },
      {
        "title": "Progressive Overload",
        "whatIs": "Kemampuan merancang dan menjalankan peningkatan beban latihan secara terukur dan bertahap (repetisi, beban, volume, atau kerapatan istirahat) untuk memicu adaptasi otot tanpa cedera.",
        "howToUse": "Gunakan log latihan minggu sebelumnya sebagai acuan, naikkan 1 variabel secara terukur (misal +1–2 repetisi atau +2.5 kg) hanya ketika teknik pada beban saat ini sudah bersih dan terkontrol.",
        "targetWorks": [
          "Tugas Besar 1 [Progressive Overload]: Membangun & Mengimplementasikan log Progresi Latihan 8 Minggu (Spreadsheet/Jurnal) yang menampilkan grafik kenaikan beban/repetisi terukur dari baseline hingga akhir siklus. (Output nyata teruji di lapangan sebagai bukti penguasaan Progressive Overload).",
          "Tugas Besar 2 [Progressive Overload]: Merancang, Menguji & Mendokumentasikan program Latihan Terstruktur (Upper/Lower atau Full-Body Split) lengkap dengan target repetisi, tingkat capek, dan aturan kapan naik/turun beban. (Output nyata teruji di lapangan sebagai bukti penguasaan Progressive Overload).",
          "Tugas Besar 3 [Progressive Overload]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi minggu latihan ringan untuk pemulihan & Penyesuaian Siklus: laporan 1 minggu penurunan volume terencana untuk memulihkan sendi sebelum siklus baru. (Output nyata teruji di lapangan sebagai bukti penguasaan Progressive Overload)."
        ],
        "criteria": "Progresi kekuatan meningkat nyata dibandingkan baseline dengan teknik yang tetap aman dan bebas nyeri sendi."
      },
      {
        "title": "Physical Mastery",
        "whatIs": "Kemandirian penuh dalam mempengaturan jadwal bertahap latihan kekuatan jangka panjang, mendiagnosis titik lemah otot/mobilitas sendiri, serta menjaga ketangguhan fisik di berbagai situasi hidup.",
        "howToUse": "Susun blok latihan musiman (kekuatan, pertumbuhan otot, atau pemeliharaan saat jadwal padat), lakukan audit keseimbangan otot kiri-kanan/anterior-posterior, dan adaptasikan latihan saat bepergian.",
        "targetWorks": [
          "Tugas Besar 1 [Physical Mastery]: Membangun & Mengimplementasikan blueprint pengaturan jadwal bertahap Kebugaran Tahunan (Macrocycle 12 Bulan) yang adaptif terhadap musim kerja/kuliah padat dan musim latihan intensif. (Output nyata teruji di lapangan sebagai bukti penguasaan Physical Mastery).",
          "Tugas Besar 2 [Physical Mastery]: Merancang, Menguji & Mendokumentasikan audit teknik gerak tubuh yang aman & Koreksi Ketidakseimbangan Otot Pribadi (lengkap dengan protokol latihan aksesori penyeimbang). (Output nyata teruji di lapangan sebagai bukti penguasaan Physical Mastery).",
          "Tugas Besar 3 [Physical Mastery]: Meluncurkan & Memvalidasi di Dunia Nyata protokol \"Zero-Excuse Travel/Busy Workout\": 3 modul latihan efektif 20 menit tanpa alat yang menjaga kebugaran saat di luar kota. (Output nyata teruji di lapangan sebagai bukti penguasaan Physical Mastery)."
        ],
        "criteria": "Kapasitas kekuatan tinggi yang berkelanjutan sepanjang tahun, sadar batas keamanan tubuh, dan mampu mengadaptasi program secara mandiri."
      }
    ],
    "Endurance": [
      {
        "title": "Walking",
        "whatIs": "Fondasi kebugaran jantung dan pernapasan harian melalui kebiasaan jalan kaki aktif, postur langkah yang efisien, dan pemeliharaan sirkulasi energi sepanjang hari.",
        "howToUse": "Bangun target langkah harian atau durasi jalan cepat (brisk walk), selipkan jalan kaki setelah makan atau di sela kerja duduk lama, dan pantau konsistensi mingguanmu.",
        "targetWorks": [
          "Tugas Besar 1 [Walking]: Membangun & Mengimplementasikan rekap Log Langkah Harian / Brisk Walking selama 30 Hari dengan rata-rata langkah yang meningkat stabil dari minggu ke-1 ke minggu ke-4. (Output nyata teruji di lapangan sebagai bukti penguasaan Walking).",
          "Tugas Besar 2 [Walking]: Merancang, Menguji & Mendokumentasikan peta Rute Jalan Kaki Favorit (3 rute berdurasi 20, 40, dan 60 menit) lengkap dengan catatan waktu tempuh dan detak jantung/persepsi napas. (Output nyata teruji di lapangan sebagai bukti penguasaan Walking).",
          "Tugas Besar 3 [Walking]: Meluncurkan & Memvalidasi di Dunia Nyata eksperimen \"Active Workday\": protokol jalan kaki 5–10 menit setiap 90 menit duduk kerja beserta catatan dampaknya pada fokus mental. (Output nyata teruji di lapangan sebagai bukti penguasaan Walking)."
        ],
        "criteria": "Kebiasaan gerak harian terbentuk konsisten tanpa kelelahan berlebih; napas dan ritme langkah terasa ringan."
      },
      {
        "title": "Aerobic Capacity",
        "whatIs": "Kemampuan menjaga kerja jantung dan paru-paru pada durasi menengah-panjang (renang, lari, bersepeda, atau kardio zona 2) dengan efisiensi napas dan kontrol pace yang stabil.",
        "howToUse": "Tetapkan modalitas aerobik (misal renang atau jogging), jaga detak jantung/napas di zona aerobik yang konstan, ukur jarak/waktu pada kondisi standar, dan tingkatkan volume maksimal 10% per minggu.",
        "targetWorks": [
          "Tugas Besar 1 [Aerobic Capacity]: Membangun & Mengimplementasikan catatan Uji Baseline vs Akhir 6 Minggu pada sesi Kardio/Renang (durasi, jarak total, pace rata-rata, dan waktu pemulihan detak jantung). (Output nyata teruji di lapangan sebagai bukti penguasaan Aerobic Capacity).",
          "Tugas Besar 2 [Aerobic Capacity]: Merancang, Menguji & Mendokumentasikan log 12 Sesi Latihan Aerobik Zona 2 (Napas Terkontrol) yang membuktikan kestabilan pace dari menit awal hingga akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan Aerobic Capacity).",
          "Tugas Besar 3 [Aerobic Capacity]: Meluncurkan & Memvalidasi di Dunia Nyata analisis Efisiensi Napas & Gerak pada Renang/Lari: mencatat jumlah kayuhan/langkah per lintasan dan perbaikan ritme napas. (Output nyata teruji di lapangan sebagai bukti penguasaan Aerobic Capacity)."
        ],
        "criteria": "Daya tahan aerobik meningkat terukur dibandingkan baseline; pace stabil tanpa kehabisan napas di awal sesi."
      },
      {
        "title": "Endurance Optimization",
        "whatIs": "Penguasaan manajemen energi, kombinasi latihan aerobik & interval (VO2max/threshold), hidrasi, serta strategi pacing untuk performa daya tahan berdurasi panjang.",
        "howToUse": "Padukan 80% latihan aerobik intensitas rendah-menengah dengan 20% sesi interval terukur, atur asupan cairan/energi sebelum dan saat latihan panjang, serta evaluasi kurva kelelahanmu.",
        "targetWorks": [
          "Tugas Besar 1 [Endurance Optimization]: Membangun & Mengimplementasikan program Latihan Daya Tahan Terpolarisasi (80/20 Endurance Plan) selama 8 minggu untuk target jarak/waktu spesifik di renang, lari, atau basket. (Output nyata teruji di lapangan sebagai bukti penguasaan Endurance Optimization).",
          "Tugas Besar 2 [Endurance Optimization]: Merancang, Menguji & Mendokumentasikan simulasi Uji Ketahanan Pribadi (Time-Trial / Long Session) lengkap dengan rencana pacing tiap segmen, strategi hidrasi, dan evaluasi hasil. (Output nyata teruji di lapangan sebagai bukti penguasaan Endurance Optimization).",
          "Tugas Besar 3 [Endurance Optimization]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Manajemen Energi & Hidrasi Pribadi untuk aktivitas fisik >60 menit di cuaca panas/lembap. (Output nyata teruji di lapangan sebagai bukti penguasaan Endurance Optimization)."
        ],
        "criteria": "Mampu mempertahankan performa daya tahan tinggi dengan distribusi energi yang cerdas dan pemulihan pasca-latihan yang cepat."
      }
    ],
    "Athleticism": [
      {
        "title": "Coordination",
        "whatIs": "Kemampuan menyelaraskan mata, tangan, kaki, dan keseimbangan tubuh saat melakukan keterampilan gerak spesifik di cabang olahraga seperti bola basket atau renang.",
        "howToUse": "Pecah gerakan olahraga yang kompleks menjadi drill koordinasi lambat (misal: footwork & ball-handling di basket, atau koordinasi tangan-kaki-napas di gaya bebas/dada renang), lalu ulangi hingga otomatis.",
        "targetWorks": [
          "Tugas Besar 1 [Coordination]: Membangun & Mengimplementasikan video Kompilasi 3 Drill Koordinasi Dasar (misal: Dribbling & Footwork Basket / Streamline & Catch Drill Renang) sebelum vs sesudah 4 minggu latihan. (Output nyata teruji di lapangan sebagai bukti penguasaan Coordination).",
          "Tugas Besar 2 [Coordination]: Merancang, Menguji & Mendokumentasikan log Latihan Keterampilan Motorik 10 Sesi yang mencatat tingkat akurasi/keberhasilan repetisi drill. (Output nyata teruji di lapangan sebagai bukti penguasaan Coordination).",
          "Tugas Besar 3 [Coordination]: Meluncurkan & Memvalidasi di Dunia Nyata rutinitas Keseimbangan & kepekaan posisi dan keseimbangan tubuh (Single-Leg Stability & Hand-Eye Drill) 10 menit untuk pencegahan keseleo pergelangan kaki/bahu. (Output nyata teruji di lapangan sebagai bukti penguasaan Coordination)."
        ],
        "criteria": "Gerakan dasar terkoordinasi mulus, minim gerakan sia-sia, dan tubuh seimbang saat berpindah tumpuan."
      },
      {
        "title": "Agility",
        "whatIs": "Kemampuan mengubah arah gerak, berakselerasi, mengerem (deceleration), dan bereaksi cepat terhadap perubahan situasi permainan secara eksplosif namun tetap terkontrol.",
        "howToUse": "Latih mekanika pengereman lutut/pinggul yang aman terlebih dahulu, lanjutkan dengan drill perubahan arah multi-sudut dan reaksi visual, lalu terapkan dalam simulasi tempo cepat.",
        "targetWorks": [
          "Tugas Besar 1 [Agility]: Membangun & Mengimplementasikan rekaman & Catatan Waktu pada 3 Drill Kelincahan (Defensive Slide, Close-out & Change of Direction di Basket / Flip-Turn & Push-off di Renang). (Output nyata teruji di lapangan sebagai bukti penguasaan Agility).",
          "Tugas Besar 2 [Agility]: Merancang, Menguji & Mendokumentasikan analisis Video Mekanika Pendaratan & Perubahan Arah (memeriksa keselarasan lutut dan tumpuan kaki agar bebas risiko cedera ACL/engkel). (Output nyata teruji di lapangan sebagai bukti penguasaan Agility).",
          "Tugas Besar 3 [Agility]: Meluncurkan & Memvalidasi di Dunia Nyata 6 Sesi Drill Reaksi & Kecepatan Keputusan (menggabungkan sinyal visual/auditori dengan eksekusi gerak cepat). (Output nyata teruji di lapangan sebagai bukti penguasaan Agility)."
        ],
        "criteria": "Transisi gerak cepat dan tajam, pendaratan kaki stabil serta aman, dan waktu reaksi meningkat nyata."
      },
      {
        "title": "Athletic Performance",
        "whatIs": "Integrasi teknik, kondisi fisik, pembacaan ruang (spatial awareness), dan pengambilan keputusan taktis di bawah tekanan permainan atau tantangan olahraga sesungguhnya.",
        "howToUse": "Terapkan keterampilan teknis di dalam game situasi nyata (scrimmage basket atau sesi renang jarak penuh), evaluasi keputusan taktis yang diambil saat tubuh lelah, dan perbaiki titik rapuhnya.",
        "targetWorks": [
          "Tugas Besar 1 [Athletic Performance]: Membangun & Mengimplementasikan analisis Performa Permainan Nyata (Game Breakdown Basket / Evaluasi Lomba atau Time-Trial Renang) yang membedah aspek teknik, fisik, dan keputusan taktis. (Output nyata teruji di lapangan sebagai bukti penguasaan Athletic Performance).",
          "Tugas Besar 2 [Athletic Performance]: Merancang, Menguji & Mendokumentasikan paket Latihan Spesifik Posisi / Gaya Andalan yang dirancang untuk menajamkan keunggulan utamamu di lapangan/kolam. (Output nyata teruji di lapangan sebagai bukti penguasaan Athletic Performance).",
          "Tugas Besar 3 [Athletic Performance]: Meluncurkan & Memvalidasi di Dunia Nyata catatan Refleksi Mentalitas Bertanding: bagaimana menjaga ketenangan, fokus, dan sportivitas saat tertinggal skor atau kelelahan. (Output nyata teruji di lapangan sebagai bukti penguasaan Athletic Performance)."
        ],
        "criteria": "Keterampilan teknis tetap stabil saat diuji dalam tempo permainan nyata dan menghasilkan keputusan lapangan yang efektif."
      }
    ],
    "Recovery": [
      {
        "title": "Rest",
        "whatIs": "Kemampuan menjaga kualitas dan kecukupan tidur harian serta menjadwalkan hari istirahat (rest day) tanpa rasa bersalah sebagai syarat mutlak pertumbuhan fisik.",
        "howToUse": "Tetapkan jam tidur-bangun yang teratur, ciptakan rutinitas wind-down bebas layar 30 menit sebelum tidur, dan patuhi hari istirahat penuh setiap minggu.",
        "targetWorks": [
          "Tugas Besar 1 [Rest]: Membangun & Mengimplementasikan log Kualitas Tidur & Energi Pagi selama 21 Hari (mencatat jam tidur, durasi, gangguan, dan skor kesegaran bangun tidur 1–5). (Output nyata teruji di lapangan sebagai bukti penguasaan Rest).",
          "Tugas Besar 2 [Rest]: Merancang, Menguji & Mendokumentasikan protokol Wind-Down Malam Pribadi (pengaturan cahaya, suhu kamar, peregangan ringan, dan batas jam kopi/gawai). (Output nyata teruji di lapangan sebagai bukti penguasaan Rest).",
          "Tugas Besar 3 [Rest]: Meluncurkan & Memvalidasi di Dunia Nyata audit Mingguan Beban vs Istirahat yang memastikan minimal 1–2 hari istirahat berkualitas dalam jadwal latihanmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Rest)."
        ],
        "criteria": "Tidur rata-rata cukup dan berkualitas; tidak memaksakan latihan berat saat kurang tidur ekstrem."
      },
      {
        "title": "Regeneration",
        "whatIs": "Penggunaan teknik pemulihan aktif (mobilitas, peregangan, foam rolling, hidrasi, dan nutrisi pemulihan) untuk mengurai ketegangan otot (pegal otot setelah olahraga) dan menjaga kesehatan jaringan ikat.",
        "howToUse": "Jalankan sesi active recovery ringan (jalan santai, renang rileks, atau rangkaian mobilitas 15 menit) di sela hari latihan berat, serta penuhi kebutuhan protein dan cairan tubuh.",
        "targetWorks": [
          "Tugas Besar 1 [Regeneration]: Membangun & Mengimplementasikan rangkaian Rutinitas Mobilitas & Peregangan Full-Body 15 Menit khusus untuk membuka area yang sering kaku (pinggul, bahu, punggung atas). (Output nyata teruji di lapangan sebagai bukti penguasaan Regeneration).",
          "Tugas Besar 2 [Regeneration]: Merancang, Menguji & Mendokumentasikan log Pemantauan Nyeri Otot (Soreness) & Intervensi Pemulihan selama 4 minggu latihan intensif. (Output nyata teruji di lapangan sebagai bukti penguasaan Regeneration).",
          "Tugas Besar 3 [Regeneration]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Piring Nutrisi & Hidrasi Pemulihan Harian yang praktis sesuai aktivitas dan anggaran pribadimu. (Output nyata teruji di lapangan sebagai bukti penguasaan Regeneration)."
        ],
        "criteria": "Ketegangan otot terkelola dengan baik, rentang gerak sendi terjaga, dan tubuh kembali segar untuk sesi latihan berikutnya."
      },
      {
        "title": "Adaptation",
        "whatIs": "Kebijaksanaan membaca sinyal biologis tubuh (detak jantung istirahat, kelelahan sistem saraf, nyeri tajam vs pegal otot) untuk mengadaptasi beban latihan secara cerdas demi kebugaran seumur hidup.",
        "howToUse": "Lakukan cek kesiapan tubuh (readiness check) setiap pagi/sebelum latihan; turunkan intensitas secara proaktif saat muncul sinyal kelelahan berlebih karena kebanyakan latihan atau stres kerja tinggi, dan konsultasikan ke profesional medis bila ada gejala cedera.",
        "targetWorks": [
          "Tugas Besar 1 [Adaptation]: Membangun & Mengimplementasikan sistem Lampu Lalu Lintas Kesiapan Tubuh (Hijau = Latihan Normal, Kuning = Kurangi Volume 30%, Merah = Istirahat/Mobilitas) beserta log penerapannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Adaptation).",
          "Tugas Besar 2 [Adaptation]: Merancang, Menguji & Mendokumentasikan studi Kasus Penanganan Gejala kelelahan berlebih karena kebanyakan latihan / Ketidaknyamanan Sendi: dokumentasi bagaimana kamu memodifikasi gerakan agar tetap aktif tanpa memperparah cedera. (Output nyata teruji di lapangan sebagai bukti penguasaan Adaptation).",
          "Tugas Besar 3 [Adaptation]: Meluncurkan & Memvalidasi di Dunia Nyata dokumen Strategi Kebugaran Lintas Usia & Musim Sibuk untuk menjaga tubuh tetap bugar saat beban kuliah/karier memuncak. (Output nyata teruji di lapangan sebagai bukti penguasaan Adaptation)."
        ],
        "criteria": "Bebas dari siklus cedera berulang (boom-and-bust); mampu menjaga konsistensi kesehatan fisik jangka panjang."
      }
    ]
  },
  "music": {
    "Instrumental Fluency": [
      {
        "title": "Technique",
        "whatIs": "Penguasaan mekanika dasar jari, postur tangan, ketepatan nada/chord, dan kestabilan ritme bersama metronom pada instrumen utama (gitar atau keyboard).",
        "howToUse": "Latih tangganada, perubahan chord, dan pola petikan/komping dengan metronom pada tempo lambat hingga bersih tanpa suara sumbang (buzzing/muffled), baru naikkan tempo bertahap.",
        "targetWorks": [
          "Tugas Besar 1 [Technique]: Membangun & Mengimplementasikan rekaman Audio/Video memainkan 3 lagu penuh dengan metronom pada gitar/keyboard tanpa terputus dengan transisi chord yang bersih. (Output nyata teruji di lapangan sebagai bukti penguasaan Technique).",
          "Tugas Besar 2 [Technique]: Merancang, Menguji & Mendokumentasikan log Latihan Teknik Jari & Metronom 4 Minggu (mencatat kenaikan BPM pada pola strumming, fingerpicking, atau penjarian tangga nada). (Output nyata teruji di lapangan sebagai bukti penguasaan Technique).",
          "Tugas Besar 3 [Technique]: Meluncurkan & Memvalidasi di Dunia Nyata perbaikan 1 Bagian Lagu Tersulit (Looping Drill): rekaman sebelum vs sesudah melatih bagian transisi yang tadinya sering tersendat. (Output nyata teruji di lapangan sebagai bukti penguasaan Technique)."
        ],
        "criteria": "Tempo stabil mengikuti ketukan metronom, bunyi chord/nada jernih, dan postur tangan rileks tanpa ketegangan berlebih."
      },
      {
        "title": "Expression",
        "whatIs": "Kemampuan menghidupkan lagu melalui kontrol keras-lembutnya permainan (keras-lembut), kejelasan bunyi/ucapan (staccato, legato, aksen), vibrato, dan pembentukan suasana rasa (groove & feel).",
        "howToUse": "Jangan hanya menekan nada yang benar; atur kontras volume antara bait (verse) dan chorus, beri ruang napas (frase) antar kalimat melodi, dan sesuaikan sentuhan jari dengan emosi lagu.",
        "targetWorks": [
          "Tugas Besar 1 [Expression]: Membangun & Mengimplementasikan eksperimen 1 Lagu dalam 2 Karakter Berbeda: merekam lagu yang sama dalam versi ballad akustik yang intim vs versi groove yang berenergi. (Output nyata teruji di lapangan sebagai bukti penguasaan Expression).",
          "Tugas Besar 2 [Expression]: Merancang, Menguji & Mendokumentasikan rekaman Permainan Instrumental/Iringan dengan Kontras keras-lembutnya permainan 4 Tingkat (pp, mp, mf, f) yang terdengar jelas perbedaannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Expression).",
          "Tugas Besar 3 [Expression]: Meluncurkan & Memvalidasi di Dunia Nyata analisis & Reproduksi Phrasing: membedah kejelasan bunyi/ucapan 1 musisi referensi selama 8–16 bar lalu menerapkannya pada permainanmu sendiri. (Output nyata teruji di lapangan sebagai bukti penguasaan Expression)."
        ],
        "criteria": "Permainan memiliki jiwa, keras-lembutnya permainan terkontrol sengaja (bukan tidak sengaja keras/pelan), dan menyentuh rasa pendengar."
      },
      {
        "title": "Virtuosity",
        "whatIs": "Kefasihan teknis dan musikal tingkat tinggi pada lingkup genre/instrumen pilihan sehingga jari mampu langsung mewujudkan ide musikal di kepala secara spontan dan andal di berbagai kondisi tampil.",
        "howToUse": "Kuasaai teknik lanjutan (susunan nada akor kompleks, solo/improvisasi melodis, poliritme, atau perubahan kunci mendadak), dan uji ketenangan bermain di depan publik atau rekaman sekali jalan (one-take).",
        "targetWorks": [
          "Tugas Besar 1 [Virtuosity]: Membangun & Mengimplementasikan rekaman Live One-Take (Tanpa Edit) membawakan 1 repertoar tingkat lanjut atau medley dengan penguasaan teknis dan ekspresi penuh. (Output nyata teruji di lapangan sebagai bukti penguasaan Virtuosity).",
          "Tugas Besar 2 [Virtuosity]: Merancang, Menguji & Mendokumentasikan 2 Sesi Improvisasi / Solo Melodis Terstruktur di atas progresi chord yang menantang dengan resolusi nada yang tepat. (Output nyata teruji di lapangan sebagai bukti penguasaan Virtuosity).",
          "Tugas Besar 3 [Virtuosity]: Meluncurkan & Memvalidasi di Dunia Nyata demonstrasi Pemulihan Panggung (Stage Recovery): rekaman latihan simulasi live di mana kamu tetap menjaga ritme mengalir mulus meski ada perubahan spontan. (Output nyata teruji di lapangan sebagai bukti penguasaan Virtuosity)."
        ],
        "criteria": "Koneksi pikiran-ke-jari menyatu mulus, penguasaan instrumen matang, dan performa tetap stabil di bawah tekanan tampil."
      }
    ],
    "Musical Understanding": [
      {
        "title": "Theory",
        "whatIs": "Pemahaman fondasi bahasa musik yang mencakup interval, konstruksi tangga nada (mayor/minor), pembentukan chord triad & 7th, tanda birama, serta sistem angka (Nashville/Roman Numeral).",
        "howToUse": "Saat mempelajari lagu baru, jangan sekadar menghafal posisi jari; identifikasi nada dasarnya, ubah progresi chord-nya menjadi derajat angka (misal: I – V – vi – IV), dan pahami fungsi tiap chord.",
        "targetWorks": [
          "Tugas Besar 1 [Theory]: Membangun & Mengimplementasikan peta Bedah Teori pada 5 Lagu Favorit: menuliskan nada dasar, birama, dan progresi chord dalam notasi derajat angka (I, IV, V, vi, dst.). (Output nyata teruji di lapangan sebagai bukti penguasaan Theory).",
          "Tugas Besar 2 [Theory]: Merancang, Menguji & Mendokumentasikan demonstrasi Instrumen: memainkan konstruksi tangga nada mayor, minor natural, dan chord diatonisnya di 4 kunci berbeda tanpa melihat contekan. (Output nyata teruji di lapangan sebagai bukti penguasaan Theory).",
          "Tugas Besar 3 [Theory]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Ringkas \"Kamus Teori Praktis\" buatan sendiri yang merangkum formula interval dan chord yang paling sering kamu pakai. (Output nyata teruji di lapangan sebagai bukti penguasaan Theory)."
        ],
        "criteria": "Konsep teori tidak berhenti di hafalan kertas, melainkan langsung bisa ditunjukkan dan dibunyikan pada gitar/keyboard."
      },
      {
        "title": "Harmony",
        "whatIs": "Penguasaan pergerakan harmoni, inversi chord (slash chords), perpindahan antar akor yang halus (perpindahan nada antar-chord yang halus), serta penggunaan chord ekstensi (9th, 11th, 13th) dan secondary dominant.",
        "howToUse": "Ganti chord dasar yang kaku dengan inversi terdekat agar pergerakan bass dan nada puncak mengalir mulus; uji bagaimana penambahan ekstensi atau chord jembatan mengubah warna ketegangan dan resolusi lagu.",
        "targetWorks": [
          "Tugas Besar 1 [Harmony]: Membangun & Mengimplementasikan proyek mengubah nuansa akor lagu Lagu: membuat 2 versi progresi harmoni baru (versi hangat/jazzy & versi sinematik) untuk 1 melodi lagu sederhana. (Output nyata teruji di lapangan sebagai bukti penguasaan Harmony).",
          "Tugas Besar 2 [Harmony]: Merancang, Menguji & Mendokumentasikan video Demonstrasi perpindahan antar akor yang halus & Inversi pada Keyboard/Gitar yang menunjukkan perpindahan 5 chord berurutan dengan gerakan jari minimal. (Output nyata teruji di lapangan sebagai bukti penguasaan Harmony).",
          "Tugas Besar 3 [Harmony]: Meluncurkan & Memvalidasi di Dunia Nyata transkripsi Harmoni Telinga (Ear Transcription): menebak dan menuliskan progresi chord lengkap (termasuk slash chord) dari 3 lagu rekaman tanpa melihat chord internet. (Output nyata teruji di lapangan sebagai bukti penguasaan Harmony)."
        ],
        "criteria": "Pilihan harmoni memperkaya emosi melodi tanpa menabrak nada vokal utama; telinga mampu mengenali warna dan fungsi chord."
      },
      {
        "title": "Musical Intuition",
        "whatIs": "Kepekaan telinga dan rasa musikal yang telah terinternalisasi (membayangkan nada di kepala sebelum dimainkan) sehingga mampu menangkap struktur lagu secara instan, merespons perubahan harmoni secara real-time, dan memilih nada yang tepat secara intuitif.",
        "howToUse": "Latih koneksi telinga-ke-instrumen dengan menyanyikan frase melodi/bassline terlebih dahulu sebelum memainkannya, dan berlatih mengiringi lagu secara spontan di berbagai nada dasar.",
        "targetWorks": [
          "Tugas Besar 1 [Musical Intuition]: Membangun & Mengimplementasikan tantangan Instant Accompaniment: mendengarkan 2 lagu yang belum pernah dimainkan, menemukan kunci & progresinya lewat telinga dalam <5 menit, lalu langsung mengiringinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Musical Intuition).",
          "Tugas Besar 2 [Musical Intuition]: Merancang, Menguji & Mendokumentasikan rekaman Dialog Musikal / Call-and-Response: merespons melodi vokal atau instrumen rekan secara spontan dengan harmoni dan frase pengisi (fill-in) yang pas. (Output nyata teruji di lapangan sebagai bukti penguasaan Musical Intuition).",
          "Tugas Besar 3 [Musical Intuition]: Meluncurkan & Memvalidasi di Dunia Nyata esai/Catatan Refleksi Musikal tentang bagaimana kamu memilih kapan harus bermain padat dan kapan harus memberi keheningan (space) dalam musik. (Output nyata teruji di lapangan sebagai bukti penguasaan Musical Intuition)."
        ],
        "criteria": "Telinga, pemahaman harmoni, dan jari bekerja serentak secara organik; keputusan musikal terasa matang dan bernyawa."
      }
    ],
    "Composition": [
      {
        "title": "Arrangement",
        "whatIs": "Kemampuan menyusun ulang struktur lagu yang sudah ada (intro, verse, pre-chorus, chorus, bridge, outro), membagi peran instrumen, dan merancang kurva keras-lembutnya permainan agar lagu terdengar segar dan utuh.",
        "howToUse": "Tentukan pesan utama lagu, rancang peta energi dari awal sampai klimaks, bagi frekuensi antar-instrumen (agar gitar dan keyboard tidak berebut di frekuensi tengah yang sama), lalu tulis bagan aransemennya.",
        "targetWorks": [
          "Tugas Besar 1 [Arrangement]: Membangun & Mengimplementasikan 1 Aransemen Lengkap Lagu (Gitar + Keyboard/Band) beserta lembar struktur bagian, keras-lembutnya permainan, dan alasan pemilihan tekstur instrumen. (Output nyata teruji di lapangan sebagai bukti penguasaan Arrangement).",
          "Tugas Besar 2 [Arrangement]: Merancang, Menguji & Mendokumentasikan rekaman Demo Multi-Track Sederhana (menggabungkan minimal 2–3 layer instrumen/vokal yang kamu mainkan sendiri) yang menunjukkan pembagian ruang suara. (Output nyata teruji di lapangan sebagai bukti penguasaan Arrangement).",
          "Tugas Besar 3 [Arrangement]: Meluncurkan & Memvalidasi di Dunia Nyata rearansemen Lintas Suasana: mengubah 1 lagu bertempo cepat menjadi aransemen akustik/ballad yang khidmat (atau sebaliknya). (Output nyata teruji di lapangan sebagai bukti penguasaan Arrangement)."
        ],
        "criteria": "Setiap bagian lagu punya perkembangan energi yang jelas, instrumen saling melengkapi (tidak bertabrakan), dan transisi antar-bagian mulus."
      },
      {
        "title": "Composition",
        "whatIs": "Kemampuan menciptakan karya musik atau lagu orisinal (melodi, progresi harmoni, ritme, dan struktur) yang memiliki identitas tema yang kuat dan alur emosi yang koheren.",
        "howToUse": "Mulai dari satu motif melodi, progresi chord, atau pesan lirik; kembangkan motif tersebut melalui variasi ritmis/harmonis menjadi bagian bait dan reff yang saling menguatkan, lalu rekam demonya.",
        "targetWorks": [
          "Tugas Besar 1 [Composition]: Membangun & Mengimplementasikan 1 Karya Lagu / Instrumental Orisinal Utuh (durasi 2–4 menit) lengkap dengan rekaman audio, chord chart, dan catatan konsep penciptaannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Composition).",
          "Tugas Besar 2 [Composition]: Merancang, Menguji & Mendokumentasikan bank Ide Musik Pribadi (10 Sketsa Motif Melodi / Riff / Progresi Chord Orisinal) yang terdokumentasi rapi di voice note/DAW. (Output nyata teruji di lapangan sebagai bukti penguasaan Composition).",
          "Tugas Besar 3 [Composition]: Meluncurkan & Memvalidasi di Dunia Nyata proyek Penulisan Lagu Berbasis Brief: menciptakan 1 karya musik singkat khusus untuk mendukung suasana cerita, video, atau renungan tertentu. (Output nyata teruji di lapangan sebagai bukti penguasaan Composition)."
        ],
        "criteria": "Karya orisinal memiliki tema melodi yang mudah dikenali, struktur yang tuntas, dan berhasil menyampaikan suasana yang dituju."
      },
      {
        "title": "Orchestration",
        "whatIs": "Seni memadukan berbagai warna suara (timbre), register frekuensi, tekstur lapisan instrumen, dan keras-lembutnya permainan band/grup musik secara makro sehingga menghasilkan lanskap musik yang kaya, seimbang, dan sinematik.",
        "howToUse": "Petakan spektrum frekuensi (low, low-mid, high-mid, high), atur kapan instrumen bermain unison, kontrapung, atau bergantian (call-and-response), dan tulis panduan partitur/panduan arah bagi tiap pemain.",
        "targetWorks": [
          "Tugas Besar 1 [Orchestration]: Membangun & Mengimplementasikan proyek Aransemen band/grup musik / Multi-Instrumen (4+ elemen suara: vokal, gitar, keys, bass, ritmis/strings) lengkap dengan part sheet tiap instrumen. (Output nyata teruji di lapangan sebagai bukti penguasaan Orchestration).",
          "Tugas Besar 2 [Orchestration]: Merancang, Menguji & Mendokumentasikan produksi Rekaman Masterpiece Pribadi: 1 karya aransemen/komposisi berlapis dengan keseimbangan frekuensi (mixing dasar) dan keras-lembutnya permainan sinematik. (Output nyata teruji di lapangan sebagai bukti penguasaan Orchestration).",
          "Tugas Besar 3 [Orchestration]: Meluncurkan & Memvalidasi di Dunia Nyata dokumen Bedah Orkestrasi: menganalisis pembagian peran instrumen pada 1 karya besar, lalu menerapkan teknik teksturnya ke karyamu sendiri. (Output nyata teruji di lapangan sebagai bukti penguasaan Orchestration)."
        ],
        "criteria": "Lanskap suara terdengar luas namun tetap jernih, setiap instrumen memiliki fungsi yang bermakna, dan klimaks musik terbangun megah."
      }
    ],
    "Musical Leadership": [
      {
        "title": "Accompaniment",
        "whatIs": "Kemampuan mengiringi penyanyi atau musisi lain dengan penuh kepekaan—menjaga tempo, memberi pijakan harmoni yang nyaman, dan menopang melodi utama tanpa mendominasi.",
        "howToUse": "Dengarkan napas dan frase penyanyi dengan saksama, sesuaikan volume permainanmu di bawah vokal utama saat bait, berikan aksen penegas di ujung kalimat, dan siap sedia mengikuti perubahan tempo penyanyi.",
        "targetWorks": [
          "Tugas Besar 1 [Accompaniment]: Membangun & Mengimplementasikan 3 Rekaman Mengiringi Penyanyi / Solois / Ibadah secara langsung dengan umpan balik tertulis dari penyanyi mengenai kenyamanan iringanmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Accompaniment).",
          "Tugas Besar 2 [Accompaniment]: Merancang, Menguji & Mendokumentasikan latihan Iringan Dinamis (Comping): merekam iringan gitar/keyboard yang memberi ruang kosong saat vokal bernyanyi dan mengisi (fill-in) hanya di jeda napas. (Output nyata teruji di lapangan sebagai bukti penguasaan Accompaniment).",
          "Tugas Besar 3 [Accompaniment]: Meluncurkan & Memvalidasi di Dunia Nyata simulasi Penyelamatan Nada/Tempo: mengiringi rekan dengan mulus ketika terjadi lompatan bagian lagu secara tiba-tiba. (Output nyata teruji di lapangan sebagai bukti penguasaan Accompaniment)."
        ],
        "criteria": "Penyanyi/rekan merasa ditopang dengan aman, tempo terjaga stabil, dan iringan tidak menutupi pesan utama vokal."
      },
      {
        "title": "Direction",
        "whatIs": "Kemampuan memimpin jalannya latihan band/band/grup musik (rehearsal) dan memberikan aba-aba musikal (hand cues, talkback, count-in) secara efektif, jelas, dan menghargai rekan satu tim.",
        "howToUse": "Siapkan song chart dan target latihan sebelum kumpul, pimpin latihan per bagian yang krusial (intro, transisi, ending) alih-alih sekadar mengulang lagu dari awal tanpa arah, dan berikan koreksi yang spesifik serta santun.",
        "targetWorks": [
          "Tugas Besar 1 [Direction]: Membangun & Mengimplementasikan rekaman / Dokumentasi Memimpin 1 Sesi Rehearsal Band/Tim Musik lengkap dengan agenda latihan, perbaikan transisi, dan hasil akhirnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Direction).",
          "Tugas Besar 2 [Direction]: Merancang, Menguji & Mendokumentasikan sistem Komunikasi Aba-Aba Panggung (Cue System): demonstrasi penggunaan kode tangan/anggukan kepala untuk mengatur keras-lembutnya permainan dan pengulangan bagian lagu. (Output nyata teruji di lapangan sebagai bukti penguasaan Direction).",
          "Tugas Besar 3 [Direction]: Meluncurkan & Memvalidasi di Dunia Nyata catatan Evaluasi Rehearsal yang merangkum 3 perbaikan spesifik (tempo, keseimbangan volume, kekompakan aksen) yang berhasil dicapai tim. (Output nyata teruji di lapangan sebagai bukti penguasaan Direction)."
        ],
        "criteria": "Waktu rehearsal berjalan efisien, seluruh anggota tim memahami arah aransemen, dan aba-aba transisi dieksekusi kompak."
      },
      {
        "title": "Interpretation",
        "whatIs": "Kepemimpinan artistik untuk menerjemahkan makna terdalam sebuah karya musik menjadi pengalaman kolektif yang menyentuh—menyatukan visi band/grup musik, ruang akustik, dan suasana hati audiens.",
        "howToUse": "Gali pesan filosofis/spiritual dari repertoar yang akan dibawakan, komunikasikan visi rasa tersebut kepada seluruh musisi, dan kelola energi panggung secara organik dari lagu pertama hingga penutup.",
        "targetWorks": [
          "Tugas Besar 1 [Interpretation]: Membangun & Mengimplementasikan konsep & Eksekusi 1 Sesi Penampilan Utuh (Mini Showcase / Sesi Ibadah Tematik 3–5 Lagu) dengan alur cerita dan transisi antar-lagu yang menyatu. (Output nyata teruji di lapangan sebagai bukti penguasaan Interpretation).",
          "Tugas Besar 2 [Interpretation]: Merancang, Menguji & Mendokumentasikan panduan Interpretasi & Visi Artistik untuk Tim Musik yang menjelaskan nuansa emosi, warna suara, dan pesan di balik setiap lagu dalam setlist. (Output nyata teruji di lapangan sebagai bukti penguasaan Interpretation).",
          "Tugas Besar 3 [Interpretation]: Meluncurkan & Memvalidasi di Dunia Nyata refleksi Pasca-Penampilan Multi-Perspektif: membandingkan maksud ekspresi yang dirancang tim dengan kesan nyata yang dirasakan pendengar. (Output nyata teruji di lapangan sebagai bukti penguasaan Interpretation)."
        ],
        "criteria": "band/grup musik bermain sebagai satu kesatuan organisme yang bernyawa, menghadirkan pengalaman musikal yang membekas mendalam."
      }
    ]
  },
  "engineering": {
    "Electrical Engineering": [
      {
        "title": "Circuits",
        "whatIs": "Pemahaman dan keterampilan merangkai sirkuit listrik arus searah/bolak-balik dasar (tegangan, arus, resistansi, daya, hukum Ohm & Kirchhoff) serta penggunaan alat ukur multimeter secara aman.",
        "howToUse": "Gambar skema rangkaian terlebih dahulu, hitung nilai resistor/arus yang dibutuhkan di atas kertas, rangkai di atas breadboard, lalu ukur tegangan dan arusnya di titik-titik uji menggunakan multimeter.",
        "targetWorks": [
          "Tugas Besar 1 [Circuits]: Membangun & Mengimplementasikan 3 Rangkaian Dasar di Breadboard (Pembagi Tegangan, Driver LED/Buzzer, dan Sensor Pasif) lengkap dengan skema, tabel hasil hitung vs ukur multimeter. (Output nyata teruji di lapangan sebagai bukti penguasaan Circuits).",
          "Tugas Besar 2 [Circuits]: Merancang, Menguji & Mendokumentasikan checklist Prosedur Keselamatan Listrik & Analisis Batas Daya Komponen (mencegah hubung singkat dan panas berlebih). (Output nyata teruji di lapangan sebagai bukti penguasaan Circuits).",
          "Tugas Besar 3 [Circuits]: Meluncurkan & Memvalidasi di Dunia Nyata log Troubleshooting Rangkaian: mendokumentasikan 2 kasus rangkaian yang tidak menyala/salah tegangan, proses lacak jalur, dan solusinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Circuits)."
        ],
        "criteria": "Rangkaian bekerja sesuai spesifikasi perhitungan, pengukuran multimeter akurat, dan keamanan kutub/daya terjaga."
      },
      {
        "title": "Electronics",
        "whatIs": "Kemampuan merancang dan mengintegrasikan komponen elektronika aktif (transistor, MOSFET, op-amp, regulator tegangan, chip pengendali elektronik, sensor, dan aktuator) untuk memproses sinyal dan kendali otomatis.",
        "howToUse": "Baca datasheet komponen dengan teliti (pinout, tegangan kerja, arus maksimum), rancang antarmuka sensor-ke-chip pengendali elektronik dan driver beban (motor/relay), tulis logika kendalinya, lalu uji stabilitas sinyalnya.",
        "targetWorks": [
          "Tugas Besar 1 [Electronics]: Membangun & Mengimplementasikan 1 Prototipe Sistem Kendali chip pengendali elektronik (ESP32/Arduino) yang membaca minimal 2 sensor dan menggerakkan aktuator (motor/servo/OLED) secara stabil. (Output nyata teruji di lapangan sebagai bukti penguasaan Electronics).",
          "Tugas Besar 2 [Electronics]: Merancang, Menguji & Mendokumentasikan desain Skematik & Layout PCB Sederhana (KiCad/EasyEDA) lengkap dengan pemilihan nilai kapasitor decoupling dan jalur daya yang aman. (Output nyata teruji di lapangan sebagai bukti penguasaan Electronics).",
          "Tugas Besar 3 [Electronics]: Meluncurkan & Memvalidasi di Dunia Nyata laporan Pengujian Noise & Kestabilan Daya: menguji sistem elektronika selama 2 jam penuh dan mencatat fluktuasi pembacaan sensor. (Output nyata teruji di lapangan sebagai bukti penguasaan Electronics)."
        ],
        "criteria": "Pemilihan komponen sesuai batas datasheet, sinyal sensor bersih/terkalibrasi, dan rangkaian bebas dari reset akibat drop tegangan."
      },
      {
        "title": "System Integration",
        "whatIs": "Kemampuan menyatukan subsistem elektronika daya, kendali tertanam (embedded firmware), komunikasi data, dan proteksi perangkat keras menjadi satu unit sistem elektrikal yang andal di lapangan.",
        "howToUse": "Tetapkan arsitektur blok daya (power budget) dan protokol komunikasi (I2C/SPI/UART/WiFi), pasang proteksi arus lebih/polaritas terbalik, rapikan manajemen kabel & konektor, lalu jalankan uji stres lingkungan.",
        "targetWorks": [
          "Tugas Besar 1 [System Integration]: Membangun & Mengimplementasikan dokumen Power Budget & Diagram Pengkabelan Sistem (Wiring Harness) untuk perangkat keras terintegrasi lengkap dengan perhitungan daya tahan baterai/catu daya. (Output nyata teruji di lapangan sebagai bukti penguasaan System Integration).",
          "Tugas Besar 2 [System Integration]: Merancang, Menguji & Mendokumentasikan 1 Unit Perangkat Elektronik Terintegrasi di dalam Enclosure yang lulus uji operasi mandiri, penanganan error komunikasi (watchdog/auto-reconnect), dan manajemen termal. (Output nyata teruji di lapangan sebagai bukti penguasaan System Integration).",
          "Tugas Besar 3 [System Integration]: Meluncurkan & Memvalidasi di Dunia Nyata laporan Failure Mode & Effects Analysis (FMEA Elektrikal) beserta implementasi fitur pengaman pada sistem. (Output nyata teruji di lapangan sebagai bukti penguasaan System Integration)."
        ],
        "criteria": "Seluruh subsistem elektrikal beroperasi serempak tanpa interferensi, aman terhadap kesalahan pengguna, dan mudah dirawat."
      }
    ],
    "Mechanical Engineering": [
      {
        "title": "Mechanics",
        "whatIs": "Pemahaman statika gaya, tumpuan beban, momen puntir (torsi), kekuatan material dasar, serta jenis-jenis sambungan mekanis (baut, mur, snap-fit, poros, dan bantalan).",
        "howToUse": "Gambar diagram benda bebas (Free Body Diagram) dari komponen yang menahan beban, hitung gaya dan titik kritis yang rawan patah/melengkung, lalu pilih material dan ketebalan dinding dengan batas aman kekuatan bahan.",
        "targetWorks": [
          "Tugas Besar 1 [Mechanics]: Membangun & Mengimplementasikan 2 Dokumen Analisis Beban & Diagram Benda Bebas pada struktur penyangga/braket nyata lengkap dengan perhitungan faktor keamanan. (Output nyata teruji di lapangan sebagai bukti penguasaan Mechanics).",
          "Tugas Besar 2 [Mechanics]: Merancang, Menguji & Mendokumentasikan eksperimen Perbandingan Kekuatan Struktur/Material: menguji kekakuan 3 variasi geometri profil (misal: pelat datar vs profil tulang rusuk/rib) terhadap beban tekan/lentur. (Output nyata teruji di lapangan sebagai bukti penguasaan Mechanics).",
          "Tugas Besar 3 [Mechanics]: Meluncurkan & Memvalidasi di Dunia Nyata katalog Pemilihan Pengikat & Sambungan (Fastener Guide) untuk proyek pribadimu beserta alasan pemilihan ukuran ulir dan tumpuannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Mechanics)."
        ],
        "criteria": "Asumsi beban tertulis jelas, satuan konsisten, dan struktur terbukti kokoh menahan beban kerja tanpa deformasi permanen."
      },
      {
        "title": "Dynamics",
        "whatIs": "Kemampuan merancang dan menganalisis mekanisme bergerak (roda gigi, sabuk/puli, engsel, linkage, aktuator linier) dengan memperhitungkan gesekan, rasio transmisi, kecepatan, dan getaran.",
        "howToUse": "Hitung rasio roda gigi atau panjang lengan tuas untuk mencapai kecepatan dan torsi yang dibutuhkan, pastikan kelonggaran (clearance) komponen bergerak tepat agar tidak macet, lalu uji kehalusan gerakannya.",
        "targetWorks": [
          "Tugas Besar 1 [Dynamics]: Membangun & Mengimplementasikan 1 Prototipe Mekanisme Bergerak (Gearbox, Linkage, Engsel Presisi, atau Penggerak Mekanis) yang beroperasi mulus tanpa selip atau macet. (Output nyata teruji di lapangan sebagai bukti penguasaan Dynamics).",
          "Tugas Besar 2 [Dynamics]: Merancang, Menguji & Mendokumentasikan perhitungan Rasio Transmisi & Kebutuhan Torsi Motor untuk menggerakkan beban mekanis tertentu beserta verifikasi uji nyatanya. (Output nyata teruji di lapangan sebagai bukti penguasaan Dynamics).",
          "Tugas Besar 3 [Dynamics]: Meluncurkan & Memvalidasi di Dunia Nyata analisis Reduksi Gesekan & Getaran: mendiagnosis sumber bunyi/getaran pada mekanisme bergerak dan memperbaikinya lewat pelumasan/alignment/bearing. (Output nyata teruji di lapangan sebagai bukti penguasaan Dynamics)."
        ],
        "criteria": "Gerakan mekanisme presisi dan berulang (repeatable), torsi mencukupi beban, serta keausan gesekan minimal."
      },
      {
        "title": "Optimization",
        "whatIs": "Rekayasa penyempurnaan struktur dan mekanisme untuk mencapai rasio kekuatan-terhadap-berat terbaik, efisiensi energi tertinggi, kemudahan perakitan (Design for Assembly), dan ketahanan jangka panjang.",
        "howToUse": "Lakukan iterasi desain untuk memangkas bobot material di zona bebas tegangan, perkuat radius sudut (fillet) di titik konsentrasi tegangan, dan kurangi jumlah komponen pengikat tanpa mengorbankan kekuatan.",
        "targetWorks": [
          "Tugas Besar 1 [Optimization]: Membangun & Mengimplementasikan studi Optimasi Topologi / Geometri: membandingkan Komponen Versi 1 vs Versi 2 yang berhasil mengurangi bobot/material ≥25% sembari mempertahankan kekuatan uji. (Output nyata teruji di lapangan sebagai bukti penguasaan Optimization).",
          "Tugas Besar 2 [Optimization]: Merancang, Menguji & Mendokumentasikan redesign Perakitan Cepat (DFA Optimization): menyederhanakan rakitan mekanis sehingga waktu bongkar-pasang berkurang drastis dengan risiko salah pasang nol. (Output nyata teruji di lapangan sebagai bukti penguasaan Optimization).",
          "Tugas Besar 3 [Optimization]: Meluncurkan & Memvalidasi di Dunia Nyata laporan Uji Kelelahan/Ketahanan Siklus (Endurance Cycle Test) pada komponen mekanis beserta perbaikan desain pasca-uji. (Output nyata teruji di lapangan sebagai bukti penguasaan Optimization)."
        ],
        "criteria": "Desain mekanis mencapai keseimbangan optimal antara kekuatan, efisiensi bobot, biaya material, dan kemudahan perawatan."
      }
    ],
    "Product Design": [
      {
        "title": "Modeling",
        "whatIs": "Kemampuan menerjemahkan konsep produk fisik menjadi model 3D CAD parametrik yang rapi, terukur, memiliki toleransi dimensi yang tepat, serta gambar teknik (technical drawing) yang terbaca.",
        "howToUse": "Ukur komponen dunia nyata dengan jangka sorong (caliper), bangun sketsa 2D yang sepenuhnya terdefinisi (fully constrained) di software CAD, gunakan parameter variabel untuk ketebalan/toleransi, dan ekspor gambar ukurannya.",
        "targetWorks": [
          "Tugas Besar 1 [Modeling]: Membangun & Mengimplementasikan 3 Model 3D CAD Parametrik (Fusion 360 / SolidWorks / Onshape) dari objek fungsional berserta pohon fitur (feature tree) yang rapi dan mudah diedit. (Output nyata teruji di lapangan sebagai bukti penguasaan Modeling).",
          "Tugas Besar 2 [Modeling]: Merancang, Menguji & Mendokumentasikan lembar Gambar Teknik 2D (Orthographic & Isometric Drawing) lengkap dengan dimensi kritis, toleransi suai (clearance), dan potongan penampang. (Output nyata teruji di lapangan sebagai bukti penguasaan Modeling).",
          "Tugas Besar 3 [Modeling]: Meluncurkan & Memvalidasi di Dunia Nyata reverse-Engineering CAD: mengukur 1 benda/komponen fisik menggunakan jangka sorong lalu memodelkannya kembali dengan akurasi ukuran ±0.2 mm. (Output nyata teruji di lapangan sebagai bukti penguasaan Modeling)."
        ],
        "criteria": "Model CAD tidak rusak saat parameter ukuran diubah, dimensi presisi sesuai spesifikasi, dan siap diproduksi/dicetak."
      },
      {
        "title": "Prototyping",
        "whatIs": "Kemampuan mewujudkan desain digital menjadi prototipe fisik bertahap (karton/foam, 3D printing, akrilik, kayu, atau logam) untuk menguji kenyamanan saat dipakai, ukuran suai (fitment), dan fungsi nyata secara cepat.",
        "howToUse": "Buat prototipe kasar terlebih dahulu untuk mengecek genggaman tangan dan proporsi, lanjutkan ke prototipe fungsional hasil cetak 3D/fabrikasi, uji langsung pada skenario pemakaian, dan catat semua cacat untuk revisi.",
        "targetWorks": [
          "Tugas Besar 1 [Prototyping]: Membangun & Mengimplementasikan dokumentasi Evolusi 3 Iterasi Prototipe Fisik (v1 Mockup Kasar → v2 Uji Fitment Komponen → v3 Prototipe Fungsional Utuh). (Output nyata teruji di lapangan sebagai bukti penguasaan Prototyping).",
          "Tugas Besar 2 [Prototyping]: Merancang, Menguji & Mendokumentasikan matriks Uji kenyamanan saat dipakai & Antarmuka Pengguna Fisik bersama 3 pengguna nyata (mencatat kenyamanan genggaman, akses tombol/port, dan visibilitas). (Output nyata teruji di lapangan sebagai bukti penguasaan Prototyping).",
          "Tugas Besar 3 [Prototyping]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Kalibrasi Toleransi Fabrikasi/3D Print pribadi (daftar offset ukuran lubang baut, snap-fit, dan lid-fit yang terbukti pas). (Output nyata teruji di lapangan sebagai bukti penguasaan Prototyping)."
        ],
        "criteria": "Prototipe fisik berhasil memvalidasi fungsi dan kenyamanan saat dipakai nyata; setiap revisi didasarkan pada data temuan pengujian."
      },
      {
        "title": "Design Engineering",
        "whatIs": "Penguasaan holistik perancangan produk dari filosofi kebutuhan pengguna, pemilihan material & proses manufaktur (DFM), keandalan struktural, estetika industrial, hingga kesiapan produksi.",
        "howToUse": "Integrasikan dokumen spesifikasi produk (PRD), arsitektur mekanis-elektrikal, analisis biaya komponen (Bill of Materials), dan standar keselamatan ke dalam satu paket rancang bangun yang siap diproduksi.",
        "targetWorks": [
          "Tugas Besar 1 [Design Engineering]: Membangun & Mengimplementasikan paket Lengkap Rancang Bangun Produk (Product Design Dossier): Spesifikasi Kebutuhan, CAD Assembly, Gambar Teknik, Bill of Materials (BOM), dan Prototipe Final. (Output nyata teruji di lapangan sebagai bukti penguasaan Design Engineering).",
          "Tugas Besar 2 [Design Engineering]: Merancang, Menguji & Mendokumentasikan analisis Design for Manufacturing & Serviceability (DFM/DFS): memastikan produk mudah dirakit, mudah dibuka untuk ganti baterai/servis, dan tahan banting. (Output nyata teruji di lapangan sebagai bukti penguasaan Design Engineering).",
          "Tugas Besar 3 [Design Engineering]: Meluncurkan & Memvalidasi di Dunia Nyata laporan Uji Jatuh, Termal, atau Ketahanan Lingkungan (Environmental Stress Test) beserta sertifikasi kelayakan desain. (Output nyata teruji di lapangan sebagai bukti penguasaan Design Engineering)."
        ],
        "criteria": "Produk tidak hanya indah di layar CAD, tetapi terbukti fungsional, aman, kenyamanan saat dipakais, layak diproduksi, dan tahan uji lapangan."
      }
    ],
    "Systems Engineering": [
      {
        "title": "Integration",
        "whatIs": "Kemampuan menghubungkan berbagai modul perangkat keras, perangkat lunak, dan mekanisme fisik melalui antarmuka (interface) yang terdefinisi jelas sehingga dapat bekerja bersama tanpa konflik.",
        "howToUse": "Buat diagram blok yang merinci input-output tiap modul (dimensi fisik, level tegangan, format data), uji tiap modul secara terpisah (unit test), lalu gabungkan satu per satu sambil memverifikasi sinyal antarmukanya.",
        "targetWorks": [
          "Tugas Besar 1 [Integration]: Membangun & Mengimplementasikan diagram Blok Subsistem & Dokumen Kontrol Antarmuka (Interface Control Document) yang memetakan koneksi mekanis, daya, dan data antar-modul. (Output nyata teruji di lapangan sebagai bukti penguasaan Integration).",
          "Tugas Besar 2 [Integration]: Merancang, Menguji & Mendokumentasikan protokol & Laporan Uji Integrasi Bertahap (Step-by-Step Integration Test Log) yang membuktikan 3+ subsistem bekerja harmonis. (Output nyata teruji di lapangan sebagai bukti penguasaan Integration).",
          "Tugas Besar 3 [Integration]: Meluncurkan & Memvalidasi di Dunia Nyata kasus Penyelesaian Konflik Antarmuka: dokumentasi bagaimana kamu mengatasi ketidakcocokan tegangan, dimensi dudukan, atau timing data antar-komponen. (Output nyata teruji di lapangan sebagai bukti penguasaan Integration)."
        ],
        "criteria": "Batas dan kontrak antarmuka antar-subsistem terdokumentasi jelas; kegagalan satu modul mudah dilokalisasi."
      },
      {
        "title": "Systems Architecture",
        "whatIs": "Kemampuan merancang struktur tingkat tinggi dari sebuah sistem rekayasa yang kompleks—menetapkan pembagian modularitas, alur data/energi, redundansi keselamatan, dan pengelolaan persyaratan (requirements traceability).",
        "howToUse": "Terjemahkan kebutuhan pengguna menjadi persyaratan sistem yang terukur (System Requirements), bagi sistem menjadi modul-modul independen dengan ketergantungan minimal, dan rancang mekanisme pengaman jika terjadi kegagalan.",
        "targetWorks": [
          "Tugas Besar 1 [Systems Architecture]: Membangun & Mengimplementasikan dokumen Arsitektur Sistem & Matriks Penelusuran Persyaratan (Requirements Traceability Matrix) dari kebutuhan pengguna hingga metode verifikasinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Architecture).",
          "Tugas Besar 2 [Systems Architecture]: Merancang, Menguji & Mendokumentasikan peta Analisis Mode Kegagalan Lintas Subsistem (System-Level FMEA) beserta rancangan mekanisme fail-safe / graceful degradation. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Architecture).",
          "Tugas Besar 3 [Systems Architecture]: Meluncurkan & Memvalidasi di Dunia Nyata desain Arsitektur Modular yang memungkinkan 1 subsistem di-upgrade di masa depan tanpa harus membongkar ulang keseluruhan produk. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Architecture)."
        ],
        "criteria": "Arsitektur sistem logis, modular, memiliki mekanisme fail-safe yang teruji, dan setiap persyaratan dapat diverifikasi secara objektif."
      },
      {
        "title": "Systems Optimization",
        "whatIs": "Penguasaan penyeimbangan multi-variabel (untung-rugi yang harus dipertimbangkan analysis) antara performa, biaya produksi, konsumsi daya, keandalan, keselamatan, dan kemudahan perawatan sepanjang siklus hidup sistem.",
        "howToUse": "Bangun matriks keputusan berbobot (untung-rugi yang harus dipertimbangkan Matrix) untuk membandingkan alternatif arsitektur, jalankan pengujian performa menyeluruh, dan optimalkan titik macet yang menghambat kerja sistem yang paling membatasi kinerja keseluruhan.",
        "targetWorks": [
          "Tugas Besar 1 [Systems Optimization]: Membangun & Mengimplementasikan studi Analisis untung-rugi yang harus dipertimbangkan Kuantitatif (Biaya vs Performa vs Daya Tahan vs Keselamatan) untuk menentukan konfigurasi terbaik sebuah sistem. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Optimization).",
          "Tugas Besar 2 [Systems Optimization]: Merancang, Menguji & Mendokumentasikan laporan Optimasi Siklus Hidup Sistem: memangkas konsumsi daya total atau waktu respons sistem sebesar ≥20% melalui penyetelan lintas perangkat keras & lunak. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Optimization).",
          "Tugas Besar 3 [Systems Optimization]: Meluncurkan & Memvalidasi di Dunia Nyata manual Operasional, Diagnostik & Perawatan Sistem (Maintenance & Troubleshooting Playbook) yang siap digunakan oleh operator lain. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Optimization)."
        ],
        "criteria": "Keputusan rekayasa didasarkan pada pertimbangan untung-rugi yang harus dipertimbangkan yang transparan, terukur, dan menghasilkan sistem yang tangguh dalam jangka panjang."
      }
    ]
  },
  "business": {
    "Systems": [
      {
        "title": "Organization",
        "whatIs": "Kemampuan menata alur kerja (workflow), struktur penyimpanan dokumen, daftar prioritas, dan Prosedur Operasional Standar (SOP) agar pekerjaan rutin berjalan rapi, terukur, dan bebas kekacauan.",
        "howToUse": "Petakan langkah-langkah dari pekerjaan yang sering kamu ulang, hilangkan langkah yang mubazir, tulis checklist SOP yang singkat dan jelas, lalu rapikan struktur folder/database pendukungnya.",
        "targetWorks": [
          "Tugas Besar 1 [Organization]: Membangun & Mengimplementasikan 3 Dokumen SOP / Checklist Operasional Satu Halaman untuk aktivitas rutin yang paling sering memakan waktumu. (Output nyata teruji di lapangan sebagai bukti penguasaan Organization).",
          "Tugas Besar 2 [Organization]: Merancang, Menguji & Mendokumentasikan peta Alur Kerja (Workflow Diagram Sebelum vs Sesudah Penataan) yang menunjukkan pengurangan waktu cari file atau revisi berulang. (Output nyata teruji di lapangan sebagai bukti penguasaan Organization).",
          "Tugas Besar 3 [Organization]: Meluncurkan & Memvalidasi di Dunia Nyata arsitektur Workspace Digital Pribadi/Tim (struktur folder, penamaan file, dan papan pelacak tugas) yang bersih dan konsisten selama 30 hari. (Output nyata teruji di lapangan sebagai bukti penguasaan Organization)."
        ],
        "criteria": "Proses kerja terdokumentasi jelas, dapat diulang dengan kualitas yang sama, dan menghemat waktu eksekusi harian."
      },
      {
        "title": "Automation",
        "whatIs": "Kemampuan mengidentifikasi leher botol (titik macet yang menghambat kerja) pada proses yang sudah terstandar, lalu merancang otomatisasi kerja rutin berbasis template, rumus, skrip, atau integrasi aplikasi untuk memangkas pekerjaan manual dan human error.",
        "howToUse": "Pastikan SOP manualnya sudah benar terlebih dahulu (jangan mengotomatisasi kerja rutin proses yang buruk), pilih titik input/rekapitulasi yang paling repetitif, bangun otomatisasi kerja rutinnya, dan pasang pengecekan error.",
        "targetWorks": [
          "Tugas Besar 1 [Automation]: Membangun & Mengimplementasikan 1 Sistem otomatisasi kerja rutin Operasional Nyata (Spreadsheet otomatis, skrip, atau integrasi workflow) lengkap dengan perbandingan waktu pengerjaan sebelum vs sesudah. (Output nyata teruji di lapangan sebagai bukti penguasaan Automation).",
          "Tugas Besar 2 [Automation]: Merancang, Menguji & Mendokumentasikan audit titik macet yang menghambat kerja & Error Operasional: memetakan 3 titik paling rawan salah ketik/lupa dalam alur kerja dan solusinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Automation).",
          "Tugas Besar 3 [Automation]: Meluncurkan & Memvalidasi di Dunia Nyata paket Template Siap Pakai (Invoice, Laporan Berkala, atau Onboarding Tracker) yang memangkas waktu administrasi mingguan ≥40%. (Output nyata teruji di lapangan sebagai bukti penguasaan Automation)."
        ],
        "criteria": "otomatisasi kerja rutin benar-benar mengurangi beban kerja dan tingkat kesalahan tanpa menciptakan kerumitan baru yang rapuh."
      },
      {
        "title": "System Architecture",
        "whatIs": "Kemampuan merancang ekosistem operasional bisnis end-to-end (mulai dari akuisisi pelanggan, pemenuhan layanan/produk, pencatatan keuangan, hingga umpan balik mutu) yang dapat didelegasikan dan diskalakan.",
        "howToUse": "Hubungkan seluruh SOP, alat otomatisasi kerja rutin, pembagian peran (RACI), dan metrik indikator kinerja (KPI) menjadi satu cetak biru operasional yang tetap berjalan lancar meskipun kamu tidak mengawasi setiap detailnya.",
        "targetWorks": [
          "Tugas Besar 1 [System Architecture]: Membangun & Mengimplementasikan cetak Biru Sistem Operasional Bisnis Utuh (End-to-End Operations Blueprint) yang memetakan alur nilai dari pesanan masuk hingga layanan purna-jual. (Output nyata teruji di lapangan sebagai bukti penguasaan System Architecture).",
          "Tugas Besar 2 [System Architecture]: Merancang, Menguji & Mendokumentasikan dashboard Metrik Operasional Inti (Lead Time, Tingkat Error, Kepuasan Pelanggan, dan Kapasitas Tim) beserta ambang batas tindakannya. (Output nyata teruji di lapangan sebagai bukti penguasaan System Architecture).",
          "Tugas Besar 3 [System Architecture]: Meluncurkan & Memvalidasi di Dunia Nyata simulasi Uji Delegasi Sistem: menyerahkan 1 alur kerja kepada rekan menggunakan SOP & sistem yang kamu rancang hingga ia berhasil menjalankannya tanpa intervensi. (Output nyata teruji di lapangan sebagai bukti penguasaan System Architecture)."
        ],
        "criteria": "Sistem bisnis berjalan andal, transparan, tahan terhadap pergantian orang, dan mendukung pertumbuhan kapasitas secara sehat."
      }
    ],
    "Finance": [
      {
        "title": "Budgeting",
        "whatIs": "Kemampuan mencatat arus uang masuk-keluar secara akurat, memisahkan pos kebutuhan/investasi/operasional, serta menyusun dan mematuhi anggaran bulanan berbasis fakta.",
        "howToUse": "Catat setiap transaksi secara berkala, kelompokkan ke dalam kategori tetap (fixed cost) dan variabel (variable cost), tetapkan plafon anggaran di awal bulan, dan evaluasi selisih realisasinya di akhir bulan.",
        "targetWorks": [
          "Tugas Besar 1 [Budgeting]: Membangun & Mengimplementasikan laporan Rekonsiliasi Arus Kas & Anggaran 3 Bulan Berturut-turut dengan tingkat akurasi pencatatan 100% dan analisis pos kebocoran biaya. (Output nyata teruji di lapangan sebagai bukti penguasaan Budgeting).",
          "Tugas Besar 2 [Budgeting]: Merancang, Menguji & Mendokumentasikan struktur Alokasi Keuangan Pribadi/Proyek (pemisahan rekening/pos operasional, dana darurat, dan modal pengembangan). (Output nyata teruji di lapangan sebagai bukti penguasaan Budgeting).",
          "Tugas Besar 3 [Budgeting]: Meluncurkan & Memvalidasi di Dunia Nyata audit Langganan & Efisiensi Biaya: mengevaluasi seluruh pengeluaran rutin dan memangkas biaya yang tidak memberi nilai tambah nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Budgeting)."
        ],
        "criteria": "Angka kas selalu seimbang dengan bukti transaksi, pengeluaran terkendali di dalam pagu anggaran, dan bebas dari defisit impulsif."
      },
      {
        "title": "Financial Modeling",
        "whatIs": "Kemampuan membangun proyeksi keuangan dinamis (pendapatan, struktur biaya, hitung-hitungan untung rugi per produk, titik impas/break-even, dan arus kas) dengan memisahkan asumsi dari fakta secara eksplisit.",
        "howToUse": "Bangun model spreadsheet di mana seluruh variabel asumsi (harga jual, konversi, biaya pokok, biaya tetap) ditempatkan di sel input terpisah, lalu uji 3 skenario: Pesimis (Downside), Dasar (Base), dan Optimis.",
        "targetWorks": [
          "Tugas Besar 1 [Financial Modeling]: Membangun & Mengimplementasikan model Keuangan Proyek/Bisnis 12 Bulan (Dynamic Spreadsheet) lengkap dengan perhitungan hitung-hitungan untung rugi per produk (CAC, LTV, Margin Kontribusi, dan Break-Even Point). (Output nyata teruji di lapangan sebagai bukti penguasaan Financial Modeling).",
          "Tugas Besar 2 [Financial Modeling]: Merancang, Menguji & Mendokumentasikan analisis Sensitivitas & Skenario 3 Lapis (Base, Best, Worst Case) yang menunjukkan variabel mana yang paling menentukan hidup-matinya arus kas. (Output nyata teruji di lapangan sebagai bukti penguasaan Financial Modeling).",
          "Tugas Besar 3 [Financial Modeling]: Meluncurkan & Memvalidasi di Dunia Nyata dokumen Catatan Asumsi Keuangan yang mencantumkan dasar bukti/data pasar di balik setiap angka estimasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Financial Modeling)."
        ],
        "criteria": "Rumus model konsisten tanpa angka hardcode tersembunyi, risiko arus kas negatif terantisipasi, dan asumsi dapat diuji."
      },
      {
        "title": "Capital Allocation",
        "whatIs": "Kebijaksanaan strategis dalam mengalokasikan modal, waktu, dan sumber daya yang terbatas ke berbagai pilihan investasi/inisiatif berdasarkan profil risiko, biaya peluang (opportunity cost), dan imbal hasil jangka panjang.",
        "howToUse": "Bandingkan setiap rencana pengeluaran modal besar atau ekspansi dengan alternatif terbaik lainnya, hitung batas kerugian maksimal yang sanggup ditanggung (margin of safety), dan evaluasi hasil alokasi modal masa lalu.",
        "targetWorks": [
          "Tugas Besar 1 [Capital Allocation]: Membangun & Mengimplementasikan memo Keputusan Alokasi Modal (Capital Allocation Memo) yang membandingkan 3 opsi penggunaan dana/waktu lengkap dengan perhitungan ROI, risiko downside, dan opportunity cost. (Output nyata teruji di lapangan sebagai bukti penguasaan Capital Allocation).",
          "Tugas Besar 2 [Capital Allocation]: Merancang, Menguji & Mendokumentasikan kerangka Aturan Manajemen Risiko & Cadangan Likuiditas (Runway Protection Rules) untuk menjaga ketahanan finansial di masa krisis. (Output nyata teruji di lapangan sebagai bukti penguasaan Capital Allocation).",
          "Tugas Besar 3 [Capital Allocation]: Meluncurkan & Memvalidasi di Dunia Nyata audit evaluasi jujur setelah proyek selesai Investasi/Pengeluaran Besar: mengevaluasi 2 keputusan finansial masa lalu dibandingkan realisasi manfaat nyatanya. (Output nyata teruji di lapangan sebagai bukti penguasaan Capital Allocation)."
        ],
        "criteria": "Modal dan sumber daya dialokasikan secara disiplin pada inisiatif bernilai tambah tertinggi dengan proteksi risiko bawah yang kuat."
      }
    ],
    "Marketing": [
      {
        "title": "Positioning",
        "whatIs": "Kemampuan memetakan segmen pelanggan secara spesifik, memahami masalah terdalam mereka, dan merumuskan proposisi nilai (manfaat utama yang membuat orang mau beli) yang membedakan tawaranmu secara jelas dari alternatif lain.",
        "howToUse": "Wawancarai atau amati target pengguna, identifikasi pekerjaan/masalah utama yang ingin mereka selesaikan (Jobs-to-be-Done), petakan kelemahan solusi yang ada saat ini, dan rumuskan kalimat positioning yang tajam.",
        "targetWorks": [
          "Tugas Besar 1 [Positioning]: Membangun & Mengimplementasikan dokumen Profil Segmen Pelanggan & manfaat utama yang membuat orang mau beli Canvas berdasarkan data wawancara/observasi nyata (bukan tebakan di atas meja). (Output nyata teruji di lapangan sebagai bukti penguasaan Positioning).",
          "Tugas Besar 2 [Positioning]: Merancang, Menguji & Mendokumentasikan peta Perbandingan Kompetitif (Positioning Matrix 2x2) yang menunjukkan celah keunikan nilai produk/jasa/karyamu. (Output nyata teruji di lapangan sebagai bukti penguasaan Positioning).",
          "Tugas Besar 3 [Positioning]: Meluncurkan & Memvalidasi di Dunia Nyata 3 Variasi Kalimat manfaat utama yang membuat orang mau beli (Headline + Sub-headline) yang diuji kejelasannya kepada 5 orang target audiens. (Output nyata teruji di lapangan sebagai bukti penguasaan Positioning)."
        ],
        "criteria": "Target audiens spesifik (bukan \"semua orang\"), masalah pelanggan nyata, dan keunikan nilai langsung dipahami dalam 10 detik."
      },
      {
        "title": "Persuasion",
        "whatIs": "Kemampuan menyusun pesan pemasaran, halaman penawaran, atau presentasi yang menggerakkan audiens untuk mengambil tindakan secara jujur, empatik, dan berbasis bukti—tanpa klaim palsu atau manipulasi.",
        "howToUse": "Gunakan struktur komunikasi persuasif (Masalah Nyata -> Solusi & Mekanisme Kerja -> Bukti/Studi Kasus -> Penanganan Keberatan -> Ajakan Bertindak/CTA yang Jelas), lalu ukur rasio konversinya.",
        "targetWorks": [
          "Tugas Besar 1 [Persuasion]: Membangun & Mengimplementasikan 1 Halaman Penawaran / Deck Presentasi Produk/Jasa lengkap dengan struktur pesan, bukti sosial/portofolio, dan bagian FAQ penanganan keberatan. (Output nyata teruji di lapangan sebagai bukti penguasaan Persuasion).",
          "Tugas Besar 2 [Persuasion]: Merancang, Menguji & Mendokumentasikan eksperimen Uji Pesan (A/B Message Testing) pada 2 sudut pandang komunikasi berbeda beserta analisis metrik respons/konversi nyata (bukan sekadar likes). (Output nyata teruji di lapangan sebagai bukti penguasaan Persuasion).",
          "Tugas Besar 3 [Persuasion]: Meluncurkan & Memvalidasi di Dunia Nyata audit Etika & Kejujuran Klaim Pemasaran: memeriksa seluruh materi promosi agar bebas dari janji berlebihan (overclaiming). (Output nyata teruji di lapangan sebagai bukti penguasaan Persuasion)."
        ],
        "criteria": "Pesan pemasaran menghasilkan respons/tindakan nyata dari segmen yang tepat sembari menjaga kejujuran dan kepercayaan."
      },
      {
        "title": "Brand Strategy",
        "whatIs": "Kemampuan membangun reputasi, identitas nilai, narasi jangka panjang, dan pengalaman pelanggan yang konsisten sehingga menciptakan kepercayaan mendalam serta rujukan organik (word-of-mouth).",
        "howToUse": "Tetapkan janji inti brand (brand promise), standar kualitas pengalaman di setiap titik sentuh pelanggan (touchpoints), serta bangun aset kepercayaan jangka panjang melalui konsistensi bukti karya.",
        "targetWorks": [
          "Tugas Besar 1 [Brand Strategy]: Membangun & Mengimplementasikan buku Panduan Strategi & Identitas Brand (Brand Playbook): Nilai Inti, Suara Komunikasi, Standar Kualitas Layanan, dan Peta Perjalanan Pelanggan (Customer Journey). (Output nyata teruji di lapangan sebagai bukti penguasaan Brand Strategy).",
          "Tugas Besar 2 [Brand Strategy]: Merancang, Menguji & Mendokumentasikan program Akuisisi & Retensi Berbasis Kepercayaan: merancang sistem pengumpulan testimoni/studi kasus nyata dan mekanisme referral pelanggan. (Output nyata teruji di lapangan sebagai bukti penguasaan Brand Strategy).",
          "Tugas Besar 3 [Brand Strategy]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Kesehatan Brand & Persepsi Audiens melalui survei/wawancara mendalam terhadap pelanggan atau mitra. (Output nyata teruji di lapangan sebagai bukti penguasaan Brand Strategy)."
        ],
        "criteria": "Brand dikenal karena kualitas dan integritas yang konsisten, menghasilkan loyalitas dan rekomendasi organik."
      }
    ],
    "Entrepreneurship": [
      {
        "title": "Validation",
        "whatIs": "Kemampuan menguji asumsi masalah pelanggan dan kesediaan membayar (kesediaan pelanggan untuk membayar) di dunia nyata melalui wawancara dan eksperimen cepat berbiaya rendah sebelum membangun produk penuh.",
        "howToUse": "Rumuskan hipotesis masalah dan solusi, temui calon pelanggan potensial dengan pertanyaan terbuka (metode The Mom Test—jangan memancing pujian), dan uji komitmen nyata mereka (pre-order, deposit, atau surat minat).",
        "targetWorks": [
          "Tugas Besar 1 [Validation]: Membangun & Mengimplementasikan catatan 8–10 Wawancara Validasi Pelanggan (Problem Discovery Log) yang memisahkan keluhan nyata pelanggan dari sekadar opini sopan. (Output nyata teruji di lapangan sebagai bukti penguasaan Validation).",
          "Tugas Besar 2 [Validation]: Merancang, Menguji & Mendokumentasikan 1 Eksperimen Minimum Viable Offer (Landing Page Uji Minat / Prototipe Layanan Manual) untuk mengukur rasio komitmen nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Validation).",
          "Tugas Besar 3 [Validation]: Meluncurkan & Memvalidasi di Dunia Nyata kartu Hipotesis & Kriteria Kill/Pivot: menetapkan ambang batas angka yang akan membuatmu melanjutkan, mengubah, atau menghentikan ide tersebut. (Output nyata teruji di lapangan sebagai bukti penguasaan Validation)."
        ],
        "criteria": "Masalah pelanggan terbukti nyata dan mendesak; keputusan lanjut/berhenti didasarkan pada bukti perilaku pelanggan, bukan rasa jatuh cinta pada ide."
      },
      {
        "title": "Business Building",
        "whatIs": "Kemampuan merakit model bisnis yang berjalan utuh—menghubungkan pengiriman produk/jasa yang bernilai, penarikan pembayaran yang sehat, akuisisi pelanggan berulang, dan arus kas positif.",
        "howToUse": "Jalankan siklus penjualan dan pengiriman nilai kepada pelanggan nyata, pantau margin keuntungan per transaksi, perbaiki keluhan pelanggan dengan cepat, dan standarkan proses operasionalnya.",
        "targetWorks": [
          "Tugas Besar 1 [Business Building]: Membangun & Mengimplementasikan laporan Siklus Bisnis Nyata (Mini Venture / Proyek Berbayar / Inisiatif Mandiri) yang mencatat pendapatan, biaya langsung, margin bersih, dan testimoni pengguna. (Output nyata teruji di lapangan sebagai bukti penguasaan Business Building).",
          "Tugas Besar 2 [Business Building]: Merancang, Menguji & Mendokumentasikan penyempurnaan Produk/Layanan v2 berdasarkan umpan balik dari 5–10 pelanggan/pengguna pertama. (Output nyata teruji di lapangan sebagai bukti penguasaan Business Building).",
          "Tugas Besar 3 [Business Building]: Meluncurkan & Memvalidasi di Dunia Nyata peta Mesin Pertumbuhan (Growth & daya tahan penonton menyimak sampai habis Loop) yang menjelaskan bagaimana bisnis mendapatkan dan mempertahankan pelanggan secara berkelanjutan. (Output nyata teruji di lapangan sebagai bukti penguasaan Business Building)."
        ],
        "criteria": "Tercipta pertukaran nilai ekonomi yang nyata, pelanggan puas dan merasakan manfaat, serta hitung-hitungan untung rugi per produk positif."
      },
      {
        "title": "Venture Creation",
        "whatIs": "Penguasaan kepemimpinan wirausaha dalam membangun entitas/inisiatif yang mandiri, tahan banting terhadap guncangan pasar, memiliki tata kelola yang etis, dan menciptakan dampak ekonomi/sosial berkelanjutan.",
        "howToUse": "Integrasikan strategi produk, sistem operasional, alokasi modal, dan kepemimpinan tim ke dalam peta jalan jangka panjang, sambil terus memantau risiko pasar dan menjaga integritas bisnis.",
        "targetWorks": [
          "Tugas Besar 1 [Venture Creation]: Membangun & Mengimplementasikan dokumen Rencana Strategis & Business Case Komprehensif (Masalah, Solusi, Moats/Keunggulan Bertahan, Proyeksi Keuangan, Risiko, dan Tata Kelola). (Output nyata teruji di lapangan sebagai bukti penguasaan Venture Creation).",
          "Tugas Besar 2 [Venture Creation]: Merancang, Menguji & Mendokumentasikan rekam Jejak Keberlanjutan Inisiatif/Usaha selama ≥6 bulan yang menunjukkan ketahanan operasional dan adaptasi terhadap perubahan kondisi pasar. (Output nyata teruji di lapangan sebagai bukti penguasaan Venture Creation).",
          "Tugas Besar 3 [Venture Creation]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Etika & Dampak Usaha yang memastikan penciptaan nilai ekonomi tidak merugikan pelanggan, mitra, maupun lingkungan. (Output nyata teruji di lapangan sebagai bukti penguasaan Venture Creation)."
        ],
        "criteria": "Usaha/inisiatif berdiri di atas fundamental ekonomi yang sehat, sistem yang terdelegasi, dan integritas yang kokoh."
      }
    ]
  },
  "content-creating": {
    "Ideation": [
      {
        "title": "Brainstorming",
        "whatIs": "Kemampuan menangkap sinyal keresahan/kebutuhan audiens, melakukan riset topik, dan menghasilkan banyak alternatif sudut pandang ide konten tanpa buntu (writer/creator block).",
        "howToUse": "Gunakan bank ide harian (swipe file & catatan pengamatan), pecah 1 topik besar menjadi 10 sudut pandang berbeda (pertanyaan, kesalahan umum, studi kasus, perbandingan), lalu saring berdasarkan relevansi audiens.",
        "targetWorks": [
          "Tugas Besar 1 [Brainstorming]: Membangun & Mengimplementasikan sistem Bank Ide Konten Pribadi yang berisi ≥30 benih ide terklasifikasi lengkap dengan target audiens dan masalah yang dijawab. (Output nyata teruji di lapangan sebagai bukti penguasaan Brainstorming).",
          "Tugas Besar 2 [Brainstorming]: Merancang, Menguji & Mendokumentasikan latihan Divergent Thinking: menghasilkan 15 sudut pandang judul/hook berbeda dari 1 topik yang sama, lalu memilih 3 terbaik beserta alasan seleksinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Brainstorming).",
          "Tugas Besar 3 [Brainstorming]: Meluncurkan & Memvalidasi di Dunia Nyata dokumen Riset Kebutuhan Audiens: merangkum 10 pertanyaan nyata yang paling sering ditanyakan orang di kolom komentar/forum pada bidangmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Brainstorming)."
        ],
        "criteria": "Ide mengalir terstruktur dari kebutuhan nyata audiens, bukan sekadar menebak-nebak topik secara acak."
      },
      {
        "title": "Concept Development",
        "whatIs": "Kemampuan mematangkan satu benih ide mentah menjadi konsep kreatif yang utuh, tajam, memiliki tesis pesan yang jelas, pembeda (unique angle), dan struktur penyampaian yang siap diproduksi.",
        "howToUse": "Tulis Creative Brief satu halaman untuk ide terpilih: tetapkan 1 kalimat pesan utama (Core Takeaway), alasan mengapa audiens harus peduli di 5 detik pertama, bukti pendukung, serta format visual terbaiknya.",
        "targetWorks": [
          "Tugas Besar 1 [Concept Development]: Membangun & Mengimplementasikan 3 Dokumen Creative Brief & Kerangka Konsep Konten lengkap dengan tesis utama, target emosi/pemahaman, referensi visual, dan struktur alur. (Output nyata teruji di lapangan sebagai bukti penguasaan Concept Development).",
          "Tugas Besar 2 [Concept Development]: Merancang, Menguji & Mendokumentasikan transformasi Ide Biasa menjadi Konsep Segar: membedah 2 topik klise lalu merumuskan sudut pandang baru (contrarian/analogi visual) yang lebih bernilai. (Output nyata teruji di lapangan sebagai bukti penguasaan Concept Development).",
          "Tugas Besar 3 [Concept Development]: Meluncurkan & Memvalidasi di Dunia Nyata uji Pitch Konsep: mempresentasikan draf konsep kepada 2 rekan untuk menguji apakah inti pesannya langsung tertangkap sebelum mulai rekaman. (Output nyata teruji di lapangan sebagai bukti penguasaan Concept Development)."
        ],
        "criteria": "Konsep memiliki pembeda yang jelas, asumsi audiens terdefinisi, dan siap dieksekusi tanpa kebingungan di tengah jalan."
      },
      {
        "title": "Originality",
        "whatIs": "Kemampuan melahirkan gagasan, format, atau seri karya intelektual/kreatif yang memiliki sidik jari pemikiran dan sudut pandang autentik dari pengalaman hidup serta sintesis lintas bidangmu sendiri.",
        "howToUse": "Padukan wawasan dari 2–3 domain keahlianmu (misal: Engineering + Filosofi + Musik/Iman) untuk menciptakan kerangka pikir, istilah, atau format seri konten yang tidak bisa ditiru mentah-mentah oleh orang lain.",
        "targetWorks": [
          "Tugas Besar 1 [Originality]: Membangun & Mengimplementasikan 1 Format Seri Konten / Signature IP Pribadi (minimal 3 episode/bagian) dengan kerangka konsep dan gaya penyampaian khas milikmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Originality).",
          "Tugas Besar 2 [Originality]: Merancang, Menguji & Mendokumentasikan karya Sintesis Lintas Disiplin yang membedah satu masalah kompleks menggunakan perpaduan pengalaman nyata dan eksperimen pribadimu. (Output nyata teruji di lapangan sebagai bukti penguasaan Originality).",
          "Tugas Besar 3 [Originality]: Meluncurkan & Memvalidasi di Dunia Nyata esai/Manifesto Kreatif tentang standar nilai, kejujuran intelektual, dan ciri khas yang membedakan karyamu dari sekadar tren algoritma. (Output nyata teruji di lapangan sebagai bukti penguasaan Originality)."
        ],
        "criteria": "Karya memiliki keaslian sudut pandang yang bermakna, memberi pencerahan baru bagi audiens, dan bukan sekadar kembar dari tren sesaat."
      }
    ],
    "Storytelling": [
      {
        "title": "Narrative",
        "whatIs": "Kemampuan menyusun alur cerita yang jernih dan memikat (Hook/Konteks -> Konflik/Masalah -> Proses Pencarian -> Titik Balik -> Resolusi/Pesan Inti) sehingga audiens mengikuti pesan dari awal hingga tuntas.",
        "howToUse": "Jangan menyajikan informasi secara datar; mulai dengan ketegangan atau pertanyaan nyata (hook), bangun jembatan keingintahuan di setiap paragraf/adegan, dan tutup dengan satu kesimpulan yang mengikat.",
        "targetWorks": [
          "Tugas Besar 1 [Narrative]: Membangun & Mengimplementasikan 3 Naskah / Storyboard Konten dari brief berbeda yang menerapkan struktur narasi klasik maupun modern lengkap dengan versi revisi pasca-feedback. (Output nyata teruji di lapangan sebagai bukti penguasaan Narrative).",
          "Tugas Besar 2 [Narrative]: Merancang, Menguji & Mendokumentasikan bedah Struktur Pacing: menganalisis 3 konten terbaik di bidangmu detik-demi-detik (atau paragraf-demi-paragraf) untuk memetakan letak hook dan titik baliknya. (Output nyata teruji di lapangan sebagai bukti penguasaan Narrative).",
          "Tugas Besar 3 [Narrative]: Meluncurkan & Memvalidasi di Dunia Nyata latihan \"Satu Pesan dalam Tiga Durasi\": menceritakan kisah/konsep yang sama dalam versi 60 detik, 3 menit, dan tulisan mendalam. (Output nyata teruji di lapangan sebagai bukti penguasaan Narrative)."
        ],
        "criteria": "Alur cerita mengalir logis tanpa bagian yang bertele-tele; pesan utama tersampaikan utuh kepada audiens."
      },
      {
        "title": "Emotional Resonance",
        "whatIs": "Kemampuan menyentuh empati dan pengalaman manusiawi audiens melalui detail konkret, kerentanan yang jujur (authentic vulnerability), kontras suasana, dan pengaturan ritme (pacing)—tanpa manipulasi murahan.",
        "howToUse": "Ganti pernyataan abstrak dengan adegan spesifik (\"show, don't just tell\"), gunakan jeda hening atau perubahan intonasi di momen krusial, dan pastikan emosi yang dibangun melayani kebenaran pesan.",
        "targetWorks": [
          "Tugas Besar 1 [Emotional Resonance]: Membangun & Mengimplementasikan 2 Karya Storytelling Berbasis Pengalaman/Studi Kasus Nyata yang berhasil memantik diskusi reflektif dan respons mendalam dari audiens. (Output nyata teruji di lapangan sebagai bukti penguasaan Emotional Resonance).",
          "Tugas Besar 2 [Emotional Resonance]: Merancang, Menguji & Mendokumentasikan eksperimen Revisi Naskah: mengubah draf tulisan/skrip yang kaku dan teknis menjadi narasi yang hangat, dekat, dan menyentuh hati. (Output nyata teruji di lapangan sebagai bukti penguasaan Emotional Resonance).",
          "Tugas Besar 3 [Emotional Resonance]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Respons Audiens: membandingkan emosi/makna yang ingin kamu sampaikan di awal dengan tanggapan nyata yang ditulis audiens. (Output nyata teruji di lapangan sebagai bukti penguasaan Emotional Resonance)."
        ],
        "criteria": "Audiens merasa terhubung secara emosional dan menangkap makna pesan dengan tulus tanpa merasa dimanipulasi (clickbait/ragebait)."
      },
      {
        "title": "Mythmaking",
        "whatIs": "Penguasaan bercerita tingkat tinggi yang mampu membangun dunia gagasan (worldbuilding), metafora kolektif, dan narasi besar yang menginspirasi komunitas untuk bertumbuh bersama dalam jangka panjang.",
        "howToUse": "Rangkai karya-karya lepasanmu menjadi satu benang merah perjalanan besar (overarching narrative arc), ciptakan simbol atau metafora yang mudah diingat (seperti filosofi \"The Backpack\"), dan libatkan audiens sebagai sesama pejalan.",
        "targetWorks": [
          "Tugas Besar 1 [Mythmaking]: Membangun & Mengimplementasikan dokumen Arsitektur Narasi & Metafora Utama (Core Lore & Worldbuilding) untuk proyek, brand personal, atau gerakan komunitasmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Mythmaking).",
          "Tugas Besar 2 [Mythmaking]: Merancang, Menguji & Mendokumentasikan 1 Karya Dokumenter / Esai Naratif Panjang / Seri Bercerita Multi-Bagian yang mengangkat perjalanan transformasi nyata dari awal hingga akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan Mythmaking).",
          "Tugas Besar 3 [Mythmaking]: Meluncurkan & Memvalidasi di Dunia Nyata kompilasi Dampak Cerita: kumpulan bukti nyata bagaimana narasi yang kamu bangun mengubah cara pandang atau kebiasaan positif audiens. (Output nyata teruji di lapangan sebagai bukti penguasaan Mythmaking)."
        ],
        "criteria": "Cerita melampaui satu unggahan tunggal, membentuk identitas nilai yang hidup dan terus diingat oleh komunitas."
      }
    ],
    "Production": [
      {
        "title": "Editing",
        "whatIs": "Keterampilan teknis memotong gambar/audio (cutting), membersihkan suara vokal, mengatur keseimbangan musik latar, menambahkan teks/takarir (captions) yang terbaca, serta mengekspor file dengan spesifikasi tepat.",
        "howToUse": "Susun hasil rekaman kasar (rough cut) sesuai alur naskah, pangkas jeda napas/kesalahan bicara yang mengganggu, pastikan level suara bicara jernih di atas musik latar (-6 dB s/d -3 dB), dan cek keterbacaan teks di layar HP.",
        "targetWorks": [
          "Tugas Besar 1 [Editing]: Membangun & Mengimplementasikan 3 Paket Produksi Video/Audio yang telah diedit bersih lengkap dengan perbandingan versi Rough Cut vs Final Cut dan checklist mutu. (Output nyata teruji di lapangan sebagai bukti penguasaan Editing).",
          "Tugas Besar 2 [Editing]: Merancang, Menguji & Mendokumentasikan template Proyek Editing & Preset Audio Pribadi (pengaturan EQ/kompresi suara, palet font subtitle, dan format ekspor standar) untuk mempercepat kerja. (Output nyata teruji di lapangan sebagai bukti penguasaan Editing).",
          "Tugas Besar 3 [Editing]: Meluncurkan & Memvalidasi di Dunia Nyata audit Aksesibilitas & Kejelasan Teknis: memastikan takarir akurat, kontras teks aman dibaca, dan audio jernih bahkan saat didengar lewat speaker ponsel. (Output nyata teruji di lapangan sebagai bukti penguasaan Editing)."
        ],
        "criteria": "Audio jernih bebas dengung/musik terlalu keras, potongan gambar rapi mengikuti irama bicara, dan hasil ekspor tajam."
      },
      {
        "title": "Art Direction",
        "whatIs": "Kemampuan menata estetika visual dan suasana suara secara sengaja—meliputi komposisi kamera (framing), tata cahaya (lighting), gradasi warna (color grading), tipografi, serta pemilihan musik/sound design.",
        "howToUse": "Tentukan moodboard suasana sebelum merekam, atur sumber cahaya utama (key light) dan kedalaman latar belakang, pilih palet warna dan gaya grafis yang selaras dengan emosi cerita, lalu terapkan secara konsisten.",
        "targetWorks": [
          "Tugas Besar 1 [Art Direction]: Membangun & Mengimplementasikan panduan Gaya Visual & Audio (Visual & Sonic Style Guide) untuk kanal/karyamu yang menetapkan palet warna, pencahayaan, tipografi, dan karakter musik. (Output nyata teruji di lapangan sebagai bukti penguasaan Art Direction).",
          "Tugas Besar 2 [Art Direction]: Merancang, Menguji & Mendokumentasikan 2 Karya Produksi dengan Tata Cahaya, Komposisi Sinematik & Sound Design Berlapis lengkap dengan penjelasan alasan artistik tiap elemennya. (Output nyata teruji di lapangan sebagai bukti penguasaan Art Direction).",
          "Tugas Besar 3 [Art Direction]: Meluncurkan & Memvalidasi di Dunia Nyata studi \"Dekorasi vs Fungsi\": menguji penghapusan efek transisi/grafis yang berlebihan sehingga visual fokus memperkuat pesan inti. (Output nyata teruji di lapangan sebagai bukti penguasaan Art Direction)."
        ],
        "criteria": "Gaya visual dan audio memiliki identitas yang konsisten, mempertegas atmosfer cerita, dan tidak sekadar pamer efek."
      },
      {
        "title": "Creative Direction",
        "whatIs": "Kepemimpinan produksi menyeluruh untuk merancang standar mutu, mengarahkan alur kerja dari pra-produksi hingga pasca-produksi, menjaga keselarasan visi kreatif, serta membimbing kolaborator.",
        "howToUse": "Integrasikan brief strategi, storyboard, jadwal syuting/produksi, dan standar kendali mutu (Quality Control) sehingga setiap karya yang rilis memenuhi standar tertinggi secara efisien dan tepat waktu.",
        "targetWorks": [
          "Tugas Besar 1 [Creative Direction]: Membangun & Mengimplementasikan 1 Proyek Produksi Skala Penuh (Kampanye Multi-Konten / Video Utama + Turunan) lengkap dengan dokumen Pra-Produksi, Produksi, dan Pasca-Produksi. (Output nyata teruji di lapangan sebagai bukti penguasaan Creative Direction).",
          "Tugas Besar 2 [Creative Direction]: Merancang, Menguji & Mendokumentasikan SOP Pipeline Produksi Efisien (dari ide ke rilis) yang memangkas waktu pengerjaan tanpa menurunkan standar kualitas artistik. (Output nyata teruji di lapangan sebagai bukti penguasaan Creative Direction).",
          "Tugas Besar 3 [Creative Direction]: Meluncurkan & Memvalidasi di Dunia Nyata sesi Review & Pengarahan Kreatif (Creative Critique Log) bersama rekan/editor untuk menyempurnakan karya dari draf awal menuju kualitas rilis. (Output nyata teruji di lapangan sebagai bukti penguasaan Creative Direction)."
        ],
        "criteria": "Visi kreatif tereksekusi utuh dari konsep hingga layar akhir dengan alur produksi yang tertata rapi dan berstandar tinggi."
      }
    ],
    "Distribution": [
      {
        "title": "Publishing",
        "whatIs": "Kemampuan mengemas dan mempublikasikan karya secara konsisten di kanal yang tepat—mencakup penulisan judul, thumbnail/sampul, deskripsi kontekstual, jadwal tayang, dan pengarsipan karya.",
        "howToUse": "Pilih platform yang sesuai dengan bentuk karyamu dan kebiasaan audiensmu, siapkan kemasan judul + sampul yang jujur namun mengundang rasa ingin tahu, lalu publikasikan sesuai kalender ritme yang berkelanjutan.",
        "targetWorks": [
          "Tugas Besar 1 [Publishing]: Membangun & Mengimplementasikan kalender & Log Publikasi Konsisten selama 4–6 Minggu tanpa bolong sesuai ritme yang telah kamu tetapkan. (Output nyata teruji di lapangan sebagai bukti penguasaan Publishing).",
          "Tugas Besar 2 [Publishing]: Merancang, Menguji & Mendokumentasikan desain 5 Pasang Judul & Thumbnail/Sampul Karya yang menyelaraskan daya tarik visual dengan kejujuran isi konten. (Output nyata teruji di lapangan sebagai bukti penguasaan Publishing).",
          "Tugas Besar 3 [Publishing]: Meluncurkan & Memvalidasi di Dunia Nyata arsip Katalog Karya Terstruktur (Portfolio Index) yang memudahkan siapa pun menemukan dan membuka kembali seluruh karya yang pernah kamu rilis. (Output nyata teruji di lapangan sebagai bukti penguasaan Publishing)."
        ],
        "criteria": "Publikasi berjalan teratur tanpa mengorbankan kesehatan/kualitas, dan kemasan karya merepresentasikan isinya secara jujur."
      },
      {
        "title": "Growth Strategy",
        "whatIs": "Kemampuan merancang eksperimen distribusi, menganalisis metrik kinerja yang relevan dengan tujuan (retensi, rasio simpan/bagikan, diskusi bermakna), dan mengambil keputusan perbaikan berbasis data.",
        "howToUse": "Tetapkan indikator keberhasilan yang sesuai tujuan komunikasi (jangan terjebak angka yang kelihatan keren tapi tidak berdampak nyata seperti views kosong), jalankan eksperimen variabel (format pembuka, durasi, jam/kanal distribusi), dan catat insight datanya.",
        "targetWorks": [
          "Tugas Besar 1 [Growth Strategy]: Membangun & Mengimplementasikan laporan Eksperimen Distribusi 30 Hari yang membandingkan performa 2 format/pendekatan konten menggunakan metrik retensi dan kedalaman respons. (Output nyata teruji di lapangan sebagai bukti penguasaan Growth Strategy).",
          "Tugas Besar 2 [Growth Strategy]: Merancang, Menguji & Mendokumentasikan strategi Repurposing Pintar (1 Karya Inti → 3 Format Turunan): mengadaptasi satu gagasan besar ke format video pendek, tulisan/carousel, dan diskusi komunitas. (Output nyata teruji di lapangan sebagai bukti penguasaan Growth Strategy).",
          "Tugas Besar 3 [Growth Strategy]: Meluncurkan & Memvalidasi di Dunia Nyata analisis Audit Retensi (Drop-off Analysis): menemukan detik/bagian di mana audiens paling sering berhenti menyimak lalu memperbaiki polanya di karya berikutnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Growth Strategy)."
        ],
        "criteria": "Pemilihan platform dan strategi tumbuh didasarkan pada tujuan yang jelas serta analisis data yang jujur (tidak menyimpulkan sebab-akibat berlebihan)."
      },
      {
        "title": "Media Ecosystem",
        "whatIs": "Kemampuan membangun ekosistem komunikasi lintas kanal yang sehat dan mandiri—menghubungkan kanal penemuan cepat (discovery), ruang pendalaman (long-form), dan komunitas/arsip milik sendiri.",
        "howToUse": "Rancang jembatan perjalanan audiens dari media sosial publik menuju ruang komunikasi yang lebih dalam dan tahan perubahan algoritma (seperti buletin, blog/web pribadi, portofolio, atau komunitas belajar).",
        "targetWorks": [
          "Tugas Besar 1 [Media Ecosystem]: Membangun & Mengimplementasikan peta Arsitektur Ekosistem Media Pribadi (Discovery Channel → Deep-Dive Channel → Owned Archive/Community) yang saling terhubung. (Output nyata teruji di lapangan sebagai bukti penguasaan Media Ecosystem).",
          "Tugas Besar 2 [Media Ecosystem]: Merancang, Menguji & Mendokumentasikan eksperimen Kampanye Lintas Kanal: meluncurkan 1 tema gagasan besar secara terkoordinasi di 3 medium berbeda dan mengevaluasi kontribusi tiap kanal. (Output nyata teruji di lapangan sebagai bukti penguasaan Media Ecosystem).",
          "Tugas Besar 3 [Media Ecosystem]: Meluncurkan & Memvalidasi di Dunia Nyata pedoman Etika & Keberlanjutan Kreator: sistem untuk menjaga kualitas pesan, kesehatan mental, dan kemandirian dari tekanan algoritma. (Output nyata teruji di lapangan sebagai bukti penguasaan Media Ecosystem)."
        ],
        "criteria": "Terbangun ekosistem komunikasi yang berdaya tahan tinggi, lintas kanal, dan berpusat pada kepercayaan jangka panjang bersama audiens."
      }
    ]
  },
  "art": {
    "Spatial Art": [
      {
        "title": "Layout",
        "whatIs": "Kemampuan menata tata letak ruang fisik/interior berdasarkan ukuran ukuran proporsi tubuh manusia tubuh manusia, kelancaran jalur gerak (sirkulasi), zonasi fungsi, dan keteraturan visual.",
        "howToUse": "Ukur dimensi ruang dan perabot dengan akurat, petakan aktivitas utama di dalam ruang tersebut, pisahkan zona fokus/kerja dari zona istirahat, dan pastikan jalur jalan bebas hambatan minimal 75–90 cm.",
        "targetWorks": [
          "Tugas Besar 1 [Layout]: Membangun & Mengimplementasikan denah Tata Letak Ruang Berskala (2D Floor Plan) untuk kamar/studio/ruang kerja lengkap dengan ukuran perabot dan panah jalur sirkulasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Layout).",
          "Tugas Besar 2 [Layout]: Merancang, Menguji & Mendokumentasikan proyek Penataan Ulang Ruang Nyata (Before vs After Room/Desk Makeover) yang meningkatkan kelegaan gerak dan kerapian fungsional. (Output nyata teruji di lapangan sebagai bukti penguasaan Layout).",
          "Tugas Besar 3 [Layout]: Meluncurkan & Memvalidasi di Dunia Nyata studi kenyamanan saat dipakai Titik Kerja: mengaudit tinggi meja, kursi, jarak layar, dan jangkauan tangan di ruang kerjamu sendiri. (Output nyata teruji di lapangan sebagai bukti penguasaan Layout)."
        ],
        "criteria": "Proporsi ukuran akurat, sirkulasi gerak lancar tanpa sudut sempit yang membahayakan, dan pembagian zona mendukung aktivitas."
      },
      {
        "title": "Spatial Design",
        "whatIs": "Kemampuan memadukan tata letak ruang dengan lapisan pencahayaan (alami, ambient, task, accent), tekstur material, akustik, dan warna untuk menciptakan kenyamanan serta karakter ruang yang utuh.",
        "howToUse": "Rancang skema pencahayaan berlapis (temperatur warna hangat vs netral), pilih kombinasi material yang seimbang (kayu, kain, logam, tanaman), dan buat visualisasi 3D/moodboard sebelum eksekusi.",
        "targetWorks": [
          "Tugas Besar 1 [Spatial Design]: Membangun & Mengimplementasikan 1 Paket Rancangan Desain Interior/Ruang Lengkap: Denah, Moodboard Material & Palet Warna, Skema Titik Pencahayaan, dan Alasan Keputusan Desain. (Output nyata teruji di lapangan sebagai bukti penguasaan Spatial Design).",
          "Tugas Besar 2 [Spatial Design]: Merancang, Menguji & Mendokumentasikan model 3D Ruang / Visualisasi Interior yang memperlihatkan jatuhnya cahaya siang vs malam hari pada ruang yang dirancang. (Output nyata teruji di lapangan sebagai bukti penguasaan Spatial Design).",
          "Tugas Besar 3 [Spatial Design]: Meluncurkan & Memvalidasi di Dunia Nyata eksperimen Tata Cahaya & Suasana (Lighting & Acoustic Setup): menata 3 sumber cahaya di satu ruang untuk mengubah mood dari mode kerja fokus ke mode istirahat hangat. (Output nyata teruji di lapangan sebagai bukti penguasaan Spatial Design)."
        ],
        "criteria": "Sirkulasi, proporsi, fungsi pengguna, pencahayaan, dan material saling mendukung secara harmonis dan aman."
      },
      {
        "title": "Environmental Experience",
        "whatIs": "Seni merancang pengalaman ruang holistik (spatial storytelling & multisensory environment) yang mengarahkan perasaan, fokus, interaksi sosial, dan ketenangan batin siapa pun yang melangkah ke dalamnya.",
        "howToUse": "Rancang perjalanan pengalaman pengguna sejak pertama kali membuka pintu (titik fokus pandangan pertama, transisi ruang, aroma/suara/cahaya, hingga sudut refleksi), dan uji dampaknya pada perilaku penghuni.",
        "targetWorks": [
          "Tugas Besar 1 [Environmental Experience]: Membangun & Mengimplementasikan konsep & Prototipe Ruang Pengalaman (Exhibition / Sanctuary / Creative Studio Space) yang menggabungkan narasi visual, tata cahaya, dan alur emosi dan pikiran pengunjung. (Output nyata teruji di lapangan sebagai bukti penguasaan Environmental Experience).",
          "Tugas Besar 2 [Environmental Experience]: Merancang, Menguji & Mendokumentasikan audit Pasca-Huni (evaluasi kenyamanan ruang setelah dipakai): mengevaluasi bagaimana penghuni/pengguna berinteraksi dengan ruang yang dirancang selama 2–4 minggu. (Output nyata teruji di lapangan sebagai bukti penguasaan Environmental Experience).",
          "Tugas Besar 3 [Environmental Experience]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Filosofi Ruang Pribadi yang merumuskan bagaimana lingkungan fisikmu dirancang untuk menopang produktivitas dan ketenangan jiwa. (Output nyata teruji di lapangan sebagai bukti penguasaan Environmental Experience)."
        ],
        "criteria": "Ruang tidak sekadar tampak indah di foto, melainkan berhasil membentuk pengalaman emosi dan pikiran, fungsi, dan keselamatan yang mendalam."
      }
    ],
    "Visual Art": [
      {
        "title": "Representation",
        "whatIs": "Kemampuan mengamati objek nyata secara akurat dan menerjemahkannya ke bidang gambar/kanvas/digital melalui penguasaan proporsi, bentuk dasar (konstruksi 3D), perspektif, dan gelap-terang (value).",
        "howToUse": "Pecah objek kompleks menjadi silinder, kubus, dan bola dalam ruang perspektif; tentukan arah datangnya cahaya, lalu bangun pemisahan tegas antara area terang (light family) dan bayangan (shadow family).",
        "targetWorks": [
          "Tugas Besar 1 [Representation]: Membangun & Mengimplementasikan 10 Lembar Studi Observasi Bentuk, Perspektif & Gelap-Terang (Value Study 5 Tingkat) dari objek nyata di sekitarmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Representation).",
          "Tugas Besar 2 [Representation]: Merancang, Menguji & Mendokumentasikan 3 Karya Gambar/Lukisan Representasional (Still Life, Arsitektur, atau Anatomi/Objek) yang menunjukkan ketepatan proporsi dan volume 3 dimensi. (Output nyata teruji di lapangan sebagai bukti penguasaan Representation).",
          "Tugas Besar 3 [Representation]: Meluncurkan & Memvalidasi di Dunia Nyata latihan Bedah Konstruksi: menggambar ulang 1 objek dari 3 sudut pandang kamera berbeda dengan perspektif yang konsisten. (Output nyata teruji di lapangan sebagai bukti penguasaan Representation)."
        ],
        "criteria": "Proporsi dan perspektif terukur baik, volume 3D terasa nyata berkat kontrol gelap-terang (value) yang jelas."
      },
      {
        "title": "Stylization",
        "whatIs": "Kemampuan menyederhanakan, melebihkan (exaggeration), atau mengolah bentuk, garis, dan palet warna secara sengaja untuk menciptakan gaya visual yang ekspresif dan berkarakter.",
        "howToUse": "Kumpulkan 3–5 karya referensi, bedah aturan penyederhanaan bentuk, irama garis, dan harmoni warnanya; lalu terapkan prinsip tersebut untuk membuat beberapa iterasi karya dari satu brief yang sama.",
        "targetWorks": [
          "Tugas Besar 1 [Stylization]: Membangun & Mengimplementasikan seri 3 Karya Ilustrasi/Lukisan Digital atau Tradisional dari satu tema yang sama dengan eksplorasi palet warna dan gaya bentuk yang konsisten. (Output nyata teruji di lapangan sebagai bukti penguasaan Stylization).",
          "Tugas Besar 2 [Stylization]: Merancang, Menguji & Mendokumentasikan lembar Studi Eksplorasi Gaya (Style Exploration Sheet): menggambar 1 subjek dalam 3 tingkat penyederhanaan (realistis → semi-stylized → ikonik/geometris). (Output nyata teruji di lapangan sebagai bukti penguasaan Stylization).",
          "Tugas Besar 3 [Stylization]: Meluncurkan & Memvalidasi di Dunia Nyata dokumentasi Proses Iterasi Visual (Sketsa Thumbnail → Studi Warna → Revisi Komposisi → Karya Final) beserta alasan tiap perubahan. (Output nyata teruji di lapangan sebagai bukti penguasaan Stylization)."
        ],
        "criteria": "Pilihan bentuk dan warna dilakukan secara sengaja untuk mendukung konsep, gaya visual konsisten, dan pengaruh referensi dipahami."
      },
      {
        "title": "Visual Language",
        "whatIs": "Kematangan memiliki bahasa rupa (visual vocabulary) yang khas dan utuh—di mana simbol, sapuan garis/kuas, tekstur, dan tata warna langsung menyampaikan makna serta atmosfer filosofis tanpa perlu banyak kata.",
        "howToUse": "Kembangkan motif, palet, dan metafora visual yang berulang secara sadar lintas karya untuk menyampaikan gagasan abstrak menjadi pengalaman visual yang menggugah.",
        "targetWorks": [
          "Tugas Besar 1 [Visual Language]: Membangun & Mengimplementasikan pameran Mini / Seri Karya Tematik (5–7 Karya Visual Utuh) yang terikat oleh satu bahasa rupa dan narasi konseptual yang mendalam. (Output nyata teruji di lapangan sebagai bukti penguasaan Visual Language).",
          "Tugas Besar 2 [Visual Language]: Merancang, Menguji & Mendokumentasikan buku Sketsa & Katalog Simbol Visual Pribadi (Visual Lexicon) yang mendokumentasikan evolusi motif, tekstur, dan filosofi warnamu. (Output nyata teruji di lapangan sebagai bukti penguasaan Visual Language).",
          "Tugas Besar 3 [Visual Language]: Meluncurkan & Memvalidasi di Dunia Nyata karya Kolaborasi Lintas Medium: menerapkan bahasa visual khasmu ke dalam desain sampul buku, antarmuka interaktif, atau produk fisik. (Output nyata teruji di lapangan sebagai bukti penguasaan Visual Language)."
        ],
        "criteria": "Bahasa visual matang, mudah dikenali keunikannya, dan setiap elemen rupa memikul beban makna yang kuat."
      }
    ],
    "Language Art": [
      {
        "title": "Writing",
        "whatIs": "Kemampuan menyusun gagasan tertulis (esai, artikel, cerita, atau refleksi) dengan kerangka outline yang logis, tata kalimat yang jernih, pilihan diksi yang tepat, dan bebas dari kerancuan makna.",
        "howToUse": "Mulai dengan menyusun kerangka pokok pikiran (outline), tulis draf pertama tanpa menyunting berlebihan, lalu lakukan revisi struktural dengan memangkas kata-kata mubazir hingga setiap kalimat bekerja efektif.",
        "targetWorks": [
          "Tugas Besar 1 [Writing]: Membangun & Mengimplementasikan 3 Karya Tulis Utuh (Esai Reflektif, Artikel Gagasan, atau Cerita Pendek) lengkap dengan arsip Outline → Draf 1 → Draf Revisi Final. (Output nyata teruji di lapangan sebagai bukti penguasaan Writing).",
          "Tugas Besar 2 [Writing]: Merancang, Menguji & Mendokumentasikan latihan Penyuntingan Ketat (Line-Editing Audit): memangkas 20–30% jumlah kata dari satu draf tulisan tanpa kehilangan satu pun makna intinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Writing).",
          "Tugas Besar 3 [Writing]: Meluncurkan & Memvalidasi di Dunia Nyata jurnal Kumpulan Metafora & Diksi Pilihan yang dikurasi dari bacaan bermutu dan diuji penggunaannya dalam paragraf karya sendiri. (Output nyata teruji di lapangan sebagai bukti penguasaan Writing)."
        ],
        "criteria": "Struktur paragraf koheren, gagasan utama jernih, transisi antar-kalimat mulus, dan nyaman dibaca."
      },
      {
        "title": "Rhetoric",
        "whatIs": "Penguasaan seni merangkai irama kalimat (cadence), paralelisme, kontras, analogi, dan struktur gaya penyampaian yang meyakinkan untuk membangun daya gugah, persuasi, serta keindahan bunyi bahasa.",
        "howToUse": "Baca tulisanmu secara lantang untuk menguji ritme napasnya; variasikan kalimat panjang yang mengalir dengan kalimat pendek yang menghantam di titik penekanan; gunakan analogi konkret untuk menjelaskan konsep abstrak.",
        "targetWorks": [
          "Tugas Besar 1 [Rhetoric]: Membangun & Mengimplementasikan 2 Esai Persuasif / Naskah Monolog atau Pidato yang menggunakan teknik gaya penyampaian yang meyakinkan (trikolar/rule of three, kontras antitesis, dan analogi hidup) disertai catatan bedah perangkat bahasanya. (Output nyata teruji di lapangan sebagai bukti penguasaan Rhetoric).",
          "Tugas Besar 2 [Rhetoric]: Merancang, Menguji & Mendokumentasikan eksperimen Nada & Gaya Bahasa: menulis satu gagasan yang sama dalam 3 laras bahasa berbeda (puitis-kontemplatif, tajam-analitis, dan hangat-percakapan). (Output nyata teruji di lapangan sebagai bukti penguasaan Rhetoric).",
          "Tugas Besar 3 [Rhetoric]: Meluncurkan & Memvalidasi di Dunia Nyata uji Bedah Kalimat Kunci: menganalisis bagian mana dari tulisanmu yang akan meruntuhkan keseluruhan rasa jika satu kalimatnya dihapus. (Output nyata teruji di lapangan sebagai bukti penguasaan Rhetoric)."
        ],
        "criteria": "Suara naratif kuat, ritme kalimat hidup saat dibaca lantang, dan gaya bahasa selaras dengan tujuan tulisan."
      },
      {
        "title": "Literary Craft",
        "whatIs": "Keahlian kesusastraan dalam menenun lapis-lapis makna (subteks), kedalaman emosi dan pikiran, simbolisme, dan keanggunan bahasa sehingga karya tulis bertahan melampaui waktu dan meninggalkan gema panjang di batin pembaca.",
        "howToUse": "Bangun ketegangan antara apa yang tertulis di permukaan dan makna yang tersirat di bawahnya (subteks), jaga keutuhan motif simbolis dari paragraf pembuka hingga kalimat penutup, dan sempurnakan melalui beberapa lapis kurasi.",
        "targetWorks": [
          "Tugas Besar 1 [Literary Craft]: Membangun & Mengimplementasikan 1 Karya Antologi / Kumpulan Esai, Puisi, atau Naskah Cerita Panjang yang dikurasi dan disunting hingga siap cetak/publikasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Literary Craft).",
          "Tugas Besar 2 [Literary Craft]: Merancang, Menguji & Mendokumentasikan studi Bedah Karya Sastra & Eksperimen Bentuk: menganalisis teknik penceritaan 1 penulis besar lalu menciptakan karya orisinal dengan standar kedalaman setara. (Output nyata teruji di lapangan sebagai bukti penguasaan Literary Craft).",
          "Tugas Besar 3 [Literary Craft]: Meluncurkan & Memvalidasi di Dunia Nyata catatan Proses Kreatif & Filosofi Bahasa yang mendokumentasikan perjalanan riset, perombakan draf, dan keputusan estetika di balik karya puncakmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Literary Craft)."
        ],
        "criteria": "Karya memiliki kedalaman subteks, kejujuran suara penulis yang matang, dan ketepatan kata yang tak tergantikan."
      }
    ],
    "Aesthetics": [
      {
        "title": "Composition",
        "whatIs": "Penguasaan prinsip dasar tata rupa—meliputi titik fokus (focal point), keseimbangan (simetris/asimetris), urutan fokus mata saat melihat desain, kontras, irama, kesatuan (unity), dan ruang kosong (negative space).",
        "howToUse": "Sebelum menambahkan detail, atur siluet besar dan ruang kosong menggunakan grid/proporsi (rule of thirds, golden ratio, atau pengelompokan gestalt), lalu uji dengan menyipitkan mata (squint test) apakah titik fokus utamanya langsung terlihat.",
        "targetWorks": [
          "Tugas Besar 1 [Composition]: Membangun & Mengimplementasikan 6 Studi Thumbnail Komposisi (Hitam-Putih/3 Nilai Gelap-Terang) yang mengeksplorasi penempatan focal point dan ruang kosong yang berbeda. (Output nyata teruji di lapangan sebagai bukti penguasaan Composition).",
          "Tugas Besar 2 [Composition]: Merancang, Menguji & Mendokumentasikan bedah Komposisi Lintas Karya: menganalisis urutan fokus mata saat melihat desain, garis arah mata (leading lines), dan keseimbangan pada 4 karya desain/lukisan/fotografi. (Output nyata teruji di lapangan sebagai bukti penguasaan Composition).",
          "Tugas Besar 3 [Composition]: Meluncurkan & Memvalidasi di Dunia Nyata redesign Tata Letak Visual (Poster, Halaman Web, atau Kanvas) yang memperbaiki komposisi yang tadinya penuh sesak menjadi lega dan terfokus. (Output nyata teruji di lapangan sebagai bukti penguasaan Composition)."
        ],
        "criteria": "Mata pengamat langsung tertuju ke elemen tetingkat capeknting sesuai urutan hierarki yang dirancang; ruang kosong bekerja aktif."
      },
      {
        "title": "Art Direction",
        "whatIs": "Kemampuan menyusun sistem estetika terpadu (mood, palet warna, tekstur, tipografi, dan aturan komposisi) serta mengkurasi berbagai elemen kreatif agar berbicara dalam satu kesatuan konsep yang utuh.",
        "howToUse": "Rumuskan kata kunci konsep (design pillars), terjemahkan menjadi aturan visual yang tegas (apa yang boleh masuk dan apa yang harus dibuang), dan gunakan untuk mengevaluasi konsistensi lintas karya.",
        "targetWorks": [
          "Tugas Besar 1 [Art Direction]: Membangun & Mengimplementasikan 1 Paket Sistem Identitas Estetika & Moodboard Kurasi lengkap dengan aturan komposisi, harmoni warna, tekstur, dan contoh penerapannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Art Direction).",
          "Tugas Besar 2 [Art Direction]: Merancang, Menguji & Mendokumentasikan portofolio Kurasi 4–5 Karya Lintas Medium yang diikat oleh satu benang merah arah artistik yang konsisten namun tidak monoton. (Output nyata teruji di lapangan sebagai bukti penguasaan Art Direction).",
          "Tugas Besar 3 [Art Direction]: Meluncurkan & Memvalidasi di Dunia Nyata dokumen Evaluasi Estetika (Design Critique) yang menilai keberhasilan bentuk sebuah karya terhadap tujuan konsepnya (bukan sekadar selera pribadi). (Output nyata teruji di lapangan sebagai bukti penguasaan Art Direction)."
        ],
        "criteria": "Keputusan bentuk, warna, dan tekstur terbukti menopang konsep utama secara kohesif dan bebas dari ornamen tempelan."
      },
      {
        "title": "Artistic Vision",
        "whatIs": "Kemampuan merumuskan filosofi keindahan, selera kuratorial yang tajam (cultivated taste), dan arah artistik orisinal yang menyatukan bentuk, fungsi, dan kebenaran makna di seluruh karya hidupmu.",
        "howToUse": "Sintetiskan nilai hidup, kepekaan budaya, dan penguasaan teknis dari seni ruang, visual, serta bahasa untuk melahirkan karya-karya yang memiliki integritas estetika tinggi dan bermakna bagi manusia.",
        "targetWorks": [
          "Tugas Besar 1 [Artistic Vision]: Membangun & Mengimplementasikan manifesto & Pameran Portofolio Terkurasi (Curated Master Portfolio) yang menampilkan karya-karya terbaikmu beserta esai penjelasan keputusan estetikanya. (Output nyata teruji di lapangan sebagai bukti penguasaan Artistic Vision).",
          "Tugas Besar 2 [Artistic Vision]: Merancang, Menguji & Mendokumentasikan 1 Proyek Seni/Desain Terpadu (menggabungkan elemen ruang, visual, dan narasi kata) yang dirancang dari filosofi nol hingga wujud akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan Artistic Vision).",
          "Tugas Besar 3 [Artistic Vision]: Meluncurkan & Memvalidasi di Dunia Nyata kerangka Kriteria Penilaian Estetika Pribadi untuk mengevaluasi mutu, keaslian, dan ketahanan waktu dari sebuah karya kreatif. (Output nyata teruji di lapangan sebagai bukti penguasaan Artistic Vision)."
        ],
        "criteria": "Memiliki kompas estetika yang matang, orisinal tanpa kehilangan fungsi/makna, serta mampu menjelaskan alasan di balik setiap pilihan keindahan."
      }
    ]
  },
  "interpersonal-skill": {
    "Communication": [
      {
        "title": "Articulation",
        "whatIs": "Kemampuan menyampaikan gagasan secara terstruktur, jernih, dan ringkas, sekaligus mempraktikkan mendengarkan aktif (active listening) dengan merangkum balik sudut pandang lawan bicara secara akurat.",
        "howToUse": "Gunakan kerangka \"Inti Pesan -> 2–3 Alasan/Konteks -> Langkah Konkret\" saat berbicara; dan saat mendengarkan, tahan dorongan memotong kalimat, lalu konfirmasi pemahamanmu (\"Kalau aku tangkap, poin utamamu adalah... benar begitu?\").",
        "targetWorks": [
          "Tugas Besar 1 [Articulation]: Membangun & Mengimplementasikan 3 Rekaman/Catatan Simulasi Percakapan Penting di mana kamu merangkum argumen lawan bicara hingga ia berkata \"Ya, tepat itu maksudku\" sebelum kamu memberi tanggapan. (Output nyata teruji di lapangan sebagai bukti penguasaan Articulation).",
          "Tugas Besar 2 [Articulation]: Merancang, Menguji & Mendokumentasikan latihan Penjelasan Jernih (Clarity Drill): menjelaskan 2 konsep rumit kepada teman dari bidang berbeda dalam waktu <3 menit tanpa jargon membingungkan. (Output nyata teruji di lapangan sebagai bukti penguasaan Articulation).",
          "Tugas Besar 3 [Articulation]: Meluncurkan & Memvalidasi di Dunia Nyata audit Kebiasaan Komunikasi Pribadi: mengidentifikasi pola kalimat berputar-putar atau kebiasaan menyela, lalu mencatat perbaikannya selama 2 minggu. (Output nyata teruji di lapangan sebagai bukti penguasaan Articulation)."
        ],
        "criteria": "Pesan langsung dipahami tanpa salah tafsir, dan lawan bicara merasa benar-benar didengarkan secara utuh."
      },
      {
        "title": "Persuasion",
        "whatIs": "Kemampuan membangun argumen yang meyakinkan, menjembatani kepentingan lawan bicara, dan merespons keberatan (objections) dengan tenang dan berbasis alasan—tanpa menekan, memojokkan, atau memanipulasi.",
        "howToUse": "Pahami terlebih dahulu kekhawatiran dan nilai yang dijaga lawan bicara, akui validitas keberatan mereka, sajikan bukti dan opsi solusi yang saling menguntungkan, serta hormati kebebasan mereka untuk memilih.",
        "targetWorks": [
          "Tugas Besar 1 [Persuasion]: Membangun & Mengimplementasikan dokumentasi 3 Simulasi atau Kasus Nyata Penanganan Keberatan (Objection Handling) dengan tipe lawan bicara yang berbeda (skeptis, terburu-buru, atau defensif). (Output nyata teruji di lapangan sebagai bukti penguasaan Persuasion).",
          "Tugas Besar 2 [Persuasion]: Merancang, Menguji & Mendokumentasikan penyusunan Proposal Usulan (1 Halaman) yang menyelaraskan ide pribadimu dengan manfaat nyata bagi pihak yang diajak bekerja sama. (Output nyata teruji di lapangan sebagai bukti penguasaan Persuasion).",
          "Tugas Besar 3 [Persuasion]: Meluncurkan & Memvalidasi di Dunia Nyata refleksi Pasca-Diskusi Sulit: mengevaluasi apakah argumenmu tetap menghormati kebebasan memilih lawan bicara dan bebas dari paksaan emosional. (Output nyata teruji di lapangan sebagai bukti penguasaan Persuasion)."
        ],
        "criteria": "Mampu menjawab keberatan secara logis dan empatik; pihak lain merasa dihargai kebebasan memilihnya dalam mengambil keputusan."
      },
      {
        "title": "Influence",
        "whatIs": "Kemampuan membangun kepercayaan jangka panjang (trust capital), menyelaraskan berbagai pemangku kepentingan yang berbeda pandangan, dan menggerakkan keputusan bersama secara etis tanpa mengandalkan paksaan jabatan.",
        "howToUse": "Bangun rekam jejak konsistensi antara perkataan dan tindakan, petakan aspirasi tiap pihak dalam kelompok, fasilitasi titik temu di atas nilai bersama, dan jaga transparansi niat.",
        "targetWorks": [
          "Tugas Besar 1 [Influence]: Membangun & Mengimplementasikan studi Kasus Penyelarasan Multi-Pihak: memimpin inisiatif/kesepakatan bersama yang melibatkan ≥3 pihak dengan prioritas awal yang berbeda tanpa paksaan. (Output nyata teruji di lapangan sebagai bukti penguasaan Influence).",
          "Tugas Besar 2 [Influence]: Merancang, Menguji & Mendokumentasikan audit Modal Kepercayaan & Etika Pengaruh (Influence vs Manipulation Guardrail): memastikan setiap metode komunikasi yang dipakai tahan uji transparansi. (Output nyata teruji di lapangan sebagai bukti penguasaan Influence).",
          "Tugas Besar 3 [Influence]: Meluncurkan & Memvalidasi di Dunia Nyata umpan Balik 360 Derajat dari 3–5 rekan mengenai seberapa aman, terbuka, dan konstruktif komunikasi yang kamu bangun di dalam tim. (Output nyata teruji di lapangan sebagai bukti penguasaan Influence)."
        ],
        "criteria": "Pengaruh lahir dari integritas, kejelasan visi, dan rasa aman emosi dan pikiran—bukan dari kontrol koersif atau manipulasi."
      }
    ],
    "Psychology": [
      {
        "title": "Observation",
        "whatIs": "Kepekaan mengamati perilaku nyata, nada bicara, bahasa tubuh, dan perubahan suasana dalam interaksi sosial, sembari memisahkan fakta yang teramati dari tebakan/asumsi pikiran sendiri.",
        "howToUse": "Saat berinteraksi atau menganalisis situasi sosial, catat dalam 2 kolom terpisah: Kolom 1 \"Perilaku/Ucapan Faktual yang Terlihat/Terdengar\" vs Kolom 2 \"Tafsir/Dugaan Sementara Saya\".",
        "targetWorks": [
          "Tugas Besar 1 [Observation]: Membangun & Mengimplementasikan 5 Lembar Catatan Observasi Sosial Etis yang memisahkan secara ketat antara fakta perilaku objektif dan kesimpulan sementara/asumsi subjektif. (Output nyata teruji di lapangan sebagai bukti penguasaan Observation).",
          "Tugas Besar 2 [Observation]: Merancang, Menguji & Mendokumentasikan latihan Deteksi Perubahan Nada & Bahasa Tubuh: mengenali sinyal kelelahan, keraguan, atau antusiasme rekan saat rapat/diskusi lalu memvalidasinya secara sopan. (Output nyata teruji di lapangan sebagai bukti penguasaan Observation).",
          "Tugas Besar 3 [Observation]: Meluncurkan & Memvalidasi di Dunia Nyata jurnal Koreksi Asumsi Pertama (First-Impression Calibration): mencatat 3 momen ketika tebakan awalmu tentang seseorang terbukti keliru setelah mengenal konteks aslinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Observation)."
        ],
        "criteria": "Tidak gegabah melabeli karakter orang (kebiasaan buru-buru menilai buruk sifat orang lain tanpa melihat situasinya); disiplin memisahkan observasi faktual dari prasangka."
      },
      {
        "title": "Behavioral Analysis",
        "whatIs": "Kemampuan menganalisis pola perilaku manusia dengan mempertimbangkan pemicu situasional, kebutuhan emosi dan pikiran dasar, insentif lingkungan, serta menyusun beberapa hipotesis penjelasan alternatif.",
        "howToUse": "Ketika seseorang bereaksi tidak biasa atau terjadi gesekan di tim, jangan berhenti pada 1 tuduhan sifat; ajukan minimal 3 penjelasan alternatif (beban konteks, ketakutan yang tak terucap, atau miskomunikasi ekspektasi).",
        "targetWorks": [
          "Tugas Besar 1 [Behavioral Analysis]: Membangun & Mengimplementasikan 3 Dokumen Analisis Kasus Perilaku / keras-lembutnya permainan Kelompok yang menguraikan pemicu konteks, kebutuhan dasar, dan 3 hipotesis penjelasan alternatif. (Output nyata teruji di lapangan sebagai bukti penguasaan Behavioral Analysis).",
          "Tugas Besar 2 [Behavioral Analysis]: Merancang, Menguji & Mendokumentasikan pemetaan Gaya Kerja & Preferensi Komunikasi Rekan Tim (apa yang memotivasi dan apa yang membuat tiap anggota tim merasa tertekan). (Output nyata teruji di lapangan sebagai bukti penguasaan Behavioral Analysis).",
          "Tugas Besar 3 [Behavioral Analysis]: Meluncurkan & Memvalidasi di Dunia Nyata desain Intervensi Lingkungan Positif: mengubah alur/aturan kerja di tim untuk mendorong perilaku kolaboratif secara alami. (Output nyata teruji di lapangan sebagai bukti penguasaan Behavioral Analysis)."
        ],
        "criteria": "Analisis perilaku kaya akan konteks, adil mempertimbangkan faktor situasi, dan menghasilkan pendekatan yang empatik."
      },
      {
        "title": "Psychological Insight",
        "whatIs": "Kedalaman pemahaman akan keras-lembutnya permainan batin manusia, mekanisme pertahanan diri (defense mechanisms), titik buta (blind spots), dan luka/ketakutan di balik permukaan perilaku—yang digunakan murni untuk menolong dan memahami, bukan menghakimi.",
        "howToUse": "Gunakan kepekaan emosi dan pikiran untuk membaca kebutuhan yang tidak terucap di balik kemarahan atau penarikan diri seseorang, hadirkan ruang penerimaan yang aman, dan bantu mereka menemukan kejernihan diri.",
        "targetWorks": [
          "Tugas Besar 1 [Psychological Insight]: Membangun & Mengimplementasikan refleksi Mendalam Peta emosi dan pikiran Diri (Self-Insight Dossier): memetakan pola keterikatan, mekanisme pertahanan diri saat terancam, dan nilai inti pribadimu. (Output nyata teruji di lapangan sebagai bukti penguasaan Psychological Insight).",
          "Tugas Besar 2 [Psychological Insight]: Merancang, Menguji & Mendokumentasikan studi Analisis keras-lembutnya permainan Relasi Kompleks beserta strategi membangun ruang aman emosi dan pikiran (psychological safety) di dalam kelompok. (Output nyata teruji di lapangan sebagai bukti penguasaan Psychological Insight).",
          "Tugas Besar 3 [Psychological Insight]: Meluncurkan & Memvalidasi di Dunia Nyata pedoman Etika Kepekaan emosi dan pikiran: batasan tegas untuk tidak mendiagnosis secara klinis sembarangan dan tidak pernah menyalahgunakan kelemahan orang lain. (Output nyata teruji di lapangan sebagai bukti penguasaan Psychological Insight)."
        ],
        "criteria": "Pemahaman emosi dan pikiran menghasilkan kasih sayang yang dewasa, batas diri yang sehat, dan rasa aman bagi orang di sekitarmu."
      }
    ],
    "Leadership": [
      {
        "title": "Coordination",
        "whatIs": "Kemampuan menyatukan langkah beberapa orang dalam satu kegiatan/proyek melalui kejelasan tujuan, pembagian tugas yang terukur, jadwal waktu yang realistis, dan komunikasi pembaruan yang rapi.",
        "howToUse": "Tetapkan tujuan bersama (Goal), daftar tugas (Deliverables), penanggung jawab (PIC), dan tenggat waktu (Deadline) secara tertulis; jalankan cek progres singkat tanpa melakukan micromanagement.",
        "targetWorks": [
          "Tugas Besar 1 [Coordination]: Membangun & Mengimplementasikan 2 Dokumen Rencana Kerja Tim (Project Charter / Papan Pembagian Tugas & Timeline) untuk kegiatan atau proyek kolaboratif nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Coordination).",
          "Tugas Besar 2 [Coordination]: Merancang, Menguji & Mendokumentasikan notulensi & Tindak Lanjut Rapat Efektif (durasi ≤30 menit) yang menghasilkan daftar keputusan dan PIC yang jelas. (Output nyata teruji di lapangan sebagai bukti penguasaan Coordination).",
          "Tugas Besar 3 [Coordination]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Pasca-Kegiatan bersama rekan tim mengenai kejelasan koordinasi dan kelancaran alur informasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Coordination)."
        ],
        "criteria": "Setiap anggota tahu persis apa yang harus dikerjakan, kapan batas waktunya, dan ke mana harus melapor jika ada kendala."
      },
      {
        "title": "Delegation",
        "whatIs": "Kemampuan mempercayakan tanggung jawab dan ruang keputusan kepada anggota tim sesuai kapasitas dan potensi pertumbuhan mereka, disertai dukungan konteks dan umpan balik yang membangun.",
        "howToUse": "Jelaskan \"Mengapa tugas ini penting\" dan \"Seperti apa standar hasil akhirnya (Definition of Done)\", berikan wewenang cara pengerjaannya kepada rekan, sediakan waktu konsultasi, dan lakukan review hasil yang objektif.",
        "targetWorks": [
          "Tugas Besar 1 [Delegation]: Membangun & Mengimplementasikan 3 Brief Delegasi Terstruktur (Konteks, Standar Hasil, Batas Wewenang, Sumber Daya, dan Titik Check-in) yang berhasil dijalankan oleh anggota tim. (Output nyata teruji di lapangan sebagai bukti penguasaan Delegation).",
          "Tugas Besar 2 [Delegation]: Merancang, Menguji & Mendokumentasikan log Pemberian Umpan Balik Konstruktif (Feedback Log): memberikan apresiasi spesifik dan koreksi yang berfokus pada karya/proses, bukan menyerang pribadi. (Output nyata teruji di lapangan sebagai bukti penguasaan Delegation).",
          "Tugas Besar 3 [Delegation]: Meluncurkan & Memvalidasi di Dunia Nyata refleksi Melepaskan Kendali (Anti-Micromanagement Audit): mengidentifikasi tugas yang tadinya kamu kerjakan sendiri lalu berhasil didelegasikan hingga rekan menjadi terampil. (Output nyata teruji di lapangan sebagai bukti penguasaan Delegation)."
        ],
        "criteria": "Tugas selesai sesuai standar tanpa kamu harus mengambil alih di tengah jalan, dan anggota tim bertambah percaya diri serta kompeten."
      },
      {
        "title": "Organizational Leadership",
        "whatIs": "Kepemimpinan strategis dan melayani (servant leadership) yang membangun budaya tim, menumbuhkan pemimpin-pemimpin baru, menjaga keadilan keputusan di saat krisis, dan memastikan tim tetap mandiri.",
        "howToUse": "Tetapkan kompas nilai dan standar budaya tim, lindungi tim dari kebisingan/tekanan yang tidak perlu, ambil tanggung jawab penuh saat terjadi kegagalan, dan bagikan pujian saat tim berhasil.",
        "targetWorks": [
          "Tugas Besar 1 [Organizational Leadership]: Membangun & Mengimplementasikan piagam Budaya & Tata Kelola Tim (Team Culture & Operating Principles) yang disepakati dan dihidupi bersama dalam organisasi/komunitas/proyek. (Output nyata teruji di lapangan sebagai bukti penguasaan Organizational Leadership).",
          "Tugas Besar 2 [Organizational Leadership]: Merancang, Menguji & Mendokumentasikan program Kaderisasi / Regenerasi Kepemimpinan: menyiapkan dan mendampingi pengganti/wakil hingga tim dapat berjalan prima tanpa kehadiranmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Organizational Leadership).",
          "Tugas Besar 3 [Organizational Leadership]: Meluncurkan & Memvalidasi di Dunia Nyata laporan Penanganan Krisis / Keputusan Sulit Kepemimpinan lengkap dengan evaluasi keadilan, dampak terhadap anggota, dan pelajaran institusional. (Output nyata teruji di lapangan sebagai bukti penguasaan Organizational Leadership)."
        ],
        "criteria": "Tim semakin mandiri, sehat secara budaya, mampu melahirkan pemimpin baru, dan tetap teguh memegang nilai di saat sulit."
      }
    ],
    "Emotional Intelligence": [
      {
        "title": "Awareness",
        "whatIs": "Kemampuan mengenali dan menamai emosi yang sedang muncul di dalam diri sendiri secara real-time—beserta sinyal fisik di tubuh dan pemicu spesifiknya—sebelum emosi tersebut membajak tindakan.",
        "howToUse": "Saat merasakan lonjakan emosi (kesal, cemas, defensif, iri, atau kecewa), beri jeda napas, amati sensasi fisik (bahu tegang, napas pendek), dan namai secara spesifik (\"Aku sedang merasa cemas karena takut mengecewakan, bukan marah\").",
        "targetWorks": [
          "Tugas Besar 1 [Awareness]: Membangun & Mengimplementasikan jurnal Pemetaan Pemicu & Sinyal Emosi (Emotional Trigger Log) selama 21 hari yang mencatat situasi pemicu, sensasi tubuh, nama emosi spesifik, dan pikiran otomatis. (Output nyata teruji di lapangan sebagai bukti penguasaan Awareness).",
          "Tugas Besar 2 [Awareness]: Merancang, Menguji & Mendokumentasikan peta Kosakata Emosi Pribadi (membedakan nuansa emosi seperti frustrasi vs kecewa, cemas vs kewalahan, bangga vs sombong). (Output nyata teruji di lapangan sebagai bukti penguasaan Awareness).",
          "Tugas Besar 3 [Awareness]: Meluncurkan & Memvalidasi di Dunia Nyata 3 Catatan Audit Reaksi Diri: membedah momen ketika kamu hampir bereaksi impulsif namun berhasil menyadari pemicunya tepat waktu. (Output nyata teruji di lapangan sebagai bukti penguasaan Awareness)."
        ],
        "criteria": "Sadar akan perubahan emosi diri sejak dini dan mampu menyebutkan pemicu sebenarnya secara jujur tanpa menyalahkan keadaan luar."
      },
      {
        "title": "Regulation",
        "whatIs": "Kemampuan mengelola gejolak emosi di bawah tekanan (stres, kritik, penolakan, atau provokasi) dan memilih respons tindakan yang selaras dengan nilai serta tujuan jangka panjang.",
        "howToUse": "Gunakan teknik jeda fisiologis (physiological sigh / napas lambat), lakukan pembingkaian ulang kognitif (cognitive reappraisal), dan tunda membalas pesan/ucapan panas sampai pikiran rasional kembali memegang kendali.",
        "targetWorks": [
          "Tugas Besar 1 [Regulation]: Membangun & Mengimplementasikan protokol Regulasi Diri Saat Krisis (Personal Cool-Down SOP): daftar langkah konkret yang terbukti menenangkan sistem sarafmu dalam 5–15 menit. (Output nyata teruji di lapangan sebagai bukti penguasaan Regulation).",
          "Tugas Besar 2 [Regulation]: Merancang, Menguji & Mendokumentasikan 3 Dokumentasi Kasus Nyata \"Jeda Sebelum Respons\": bagaimana kamu mengelola kritik tajam atau situasi menjengkelkan menjadi respons yang tenang dan produktif. (Output nyata teruji di lapangan sebagai bukti penguasaan Regulation).",
          "Tugas Besar 3 [Regulation]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Ketahanan Stres Bulanan: memetakan pola kelelahan emosional dan intervensi batas diri (boundaries) yang berhasil diterapkan. (Output nyata teruji di lapangan sebagai bukti penguasaan Regulation)."
        ],
        "criteria": "Tidak meledak atau menutup diri secara destruktif saat tertekan; mampu memilih respons yang dewasa dan proporsional."
      },
      {
        "title": "Emotional Wisdom",
        "whatIs": "Kematangan emosional yang memadukan ketenangan batin, empati yang berbatas sehat (compassionate boundaries), kerendahan hati menerima koreksi, serta kemampuan meneduhkan suasana kelompok yang tegang.",
        "howToUse": "Hadir sebagai jangkar ketenangan (non-anxious presence) di tengah kepanikan atau konflik orang lain, tampung perasaan sesama dengan empati tanpa ikut terseret larut, dan jaga kemurnian hati.",
        "targetWorks": [
          "Tugas Besar 1 [Emotional Wisdom]: Membangun & Mengimplementasikan studi Reflektif Transformasi Luka/Kemarahan menjadi Empati & Kebijaksanaan dalam perjalanan relasi pribadimu. (Output nyata teruji di lapangan sebagai bukti penguasaan Emotional Wisdom).",
          "Tugas Besar 2 [Emotional Wisdom]: Merancang, Menguji & Mendokumentasikan demonstrasi \"Non-Anxious Presence\": catatan/umpan balik rekan saat kamu berhasil menenangkan suasana rapat atau diskusi yang memanas. (Output nyata teruji di lapangan sebagai bukti penguasaan Emotional Wisdom).",
          "Tugas Besar 3 [Emotional Wisdom]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Batas Empati Sehat (Healthy Boundaries Charter): cara tetap peduli dan melayani orang lain tanpa mengalami kelelahan batin (compassion fatigue). (Output nyata teruji di lapangan sebagai bukti penguasaan Emotional Wisdom)."
        ],
        "criteria": "Kehadiranmu membawa keteduhan dan kejernihan di tengah badai emosi; mampu mengasihi dengan tegas dan bijaksana."
      }
    ],
    "Conflict Resolution": [
      {
        "title": "Negotiation",
        "whatIs": "Kemampuan membicarakan perbedaan kepentingan secara terbuka, memisahkan masalah dari orangnya, dan mencari titik temu kesepakatan yang adil tanpa mengorbankan relasi maupun prinsip.",
        "howToUse": "Gali kepentingan di balik posisi kaku lawan bicara (\"Mengapa hal itu penting baginya?\"), nyatakan kebutuhan dan batasmu dengan kalimat \"Saya\" (I-statement) tanpa menuduh, lalu ajukan opsi solusi kreatif.",
        "targetWorks": [
          "Tugas Besar 1 [Negotiation]: Membangun & Mengimplementasikan 3 Catatan/Simulasi Negosiasi Kepentingan (pembagian beban kerja, kesepakatan jadwal/harga, atau perbedaan ide proyek) dengan hasil win-win tertulis. (Output nyata teruji di lapangan sebagai bukti penguasaan Negotiation).",
          "Tugas Besar 2 [Negotiation]: Merancang, Menguji & Mendokumentasikan lembar Persiapan Negosiasi (memetakan Kepentingan Pihak A, Kepentingan Pihak B, Opsi Pertukaran Nilai, dan Batas Minimum/BATNA). (Output nyata teruji di lapangan sebagai bukti penguasaan Negotiation).",
          "Tugas Besar 3 [Negotiation]: Meluncurkan & Memvalidasi di Dunia Nyata latihan Kalimat Asertif Non-Agresif: mengubah 5 kalimat keluhan/tuduhan menjadi kalimat penyampaian batas dan ajakan solusi yang konstruktif. (Output nyata teruji di lapangan sebagai bukti penguasaan Negotiation)."
        ],
        "criteria": "Mampu mempertahankan batas yang sehat sembari tetap menghormati kepentingan pihak lain dan mencapai kesepakatan yang jelas."
      },
      {
        "title": "Mediation",
        "whatIs": "Kemampuan menjadi penengah yang adil, netral, dan tetingkat capekrcaya di antara dua atau lebih pihak yang berselisih—membantu mereka saling mendengar dan merumuskan jalan keluar bersama.",
        "howToUse": "Tetapkan aturan dasar percakapan yang aman (tidak saling memotong/menyerang pribadi), beri waktu setara bagi tiap pihak untuk menyampaikan pandangannya, rangkum titik temu dan akar masalahnya, lalu pandu penyusunan kesepakatan.",
        "targetWorks": [
          "Tugas Besar 1 [Mediation]: Membangun & Mengimplementasikan 2 Dokumentasi Simulasi atau Fasilitasi Mediasi Konflik Multi-Pihak lengkap dengan peta sudut pandang tiap pihak dan butir kesepakatan akhirnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Mediation).",
          "Tugas Besar 2 [Mediation]: Merancang, Menguji & Mendokumentasikan panduan Protokol Mediasi Tim (5 Langkah Menengahi Perselisihan di Proyek/Organisasi secara Adil). (Output nyata teruji di lapangan sebagai bukti penguasaan Mediation).",
          "Tugas Besar 3 [Mediation]: Meluncurkan & Memvalidasi di Dunia Nyata analisis Akar Masalah vs Gejala Konflik: membedah 1 kasus gesekan tim untuk menemukan penyebab struktural/komunikasi di balik pertengkaran permukaan. (Output nyata teruji di lapangan sebagai bukti penguasaan Mediation)."
        ],
        "criteria": "Kedua belah pihak merasa didengar secara adil, tensi emosi menurun, dan kesepakatan menyentuh akar masalah."
      },
      {
        "title": "Reconciliation",
        "whatIs": "Kemampuan memulihkan kepercayaan yang retak, memfasilitasi pengakuan kesalahan dan pengampunan yang tulus, serta membangun kembali fondasi relasi dan sistem agar luka serupa tidak terulang.",
        "howToUse": "Akui dampak kesalahan secara jujur tanpa membela diri (ketika bersalah), atau buka ruang pemulihan yang disertai perubahan perilaku nyata dan kesepakatan penjagaan baru ketika memulihkan relasi.",
        "targetWorks": [
          "Tugas Besar 1 [Reconciliation]: Membangun & Mengimplementasikan studi Reflektif Proses Rekonsiliasi & Pemulihan Kepercayaan Nyata (mencatat langkah pengakuan, perbaikan dampak/restitusi, dan kesepakatan baru). (Output nyata teruji di lapangan sebagai bukti penguasaan Reconciliation).",
          "Tugas Besar 2 [Reconciliation]: Merancang, Menguji & Mendokumentasikan desain Sistem Pencegahan Konflik Berulang di dalam tim/komunitas setelah melewati masa krisis relasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Reconciliation).",
          "Tugas Besar 3 [Reconciliation]: Meluncurkan & Memvalidasi di Dunia Nyata esai/Catatan Kebijaksanaan tentang perbedaan antara rekonsiliasi sejati, pengampunan, dan batas keamanan ketika pihak lain menolak berubah. (Output nyata teruji di lapangan sebagai bukti penguasaan Reconciliation)."
        ],
        "criteria": "Pemulihan relasi berjalan jujur di atas kebenaran dan perubahan perilaku nyata, bukan sekadar menyapu masalah ke bawah katingkat capekt."
      }
    ]
  },
  "exploration-adaptation": {
    "Technology": [
      {
        "title": "Digital Literacy",
        "whatIs": "Kemampuan mengoperasikan perangkat komputer, sistem operasi, manajemen file, keamanan siber dasar (kata sandi, 2FA, privasi data), dan aplikasi produktivitas secara cekatan serta aman.",
        "howToUse": "Rapikan struktur penyimpanan lokal & cloud, kuasai pintasan keyboard (shortcuts) utama untuk mempercepat navigasi, aktifkan pengamanan akun berlapis, dan pahami cara kerja dasar jaringan/browser.",
        "targetWorks": [
          "Tugas Besar 1 [Digital Literacy]: Membangun & Mengimplementasikan audit Keamanan Digital & Privasi Pribadi (penerapan Password Manager, 2FA, izin aplikasi, dan prosedur backup 3-2-1). (Output nyata teruji di lapangan sebagai bukti penguasaan Digital Literacy).",
          "Tugas Besar 2 [Digital Literacy]: Merancang, Menguji & Mendokumentasikan dokumentasi Penataan Sistem File & Pintasan Kerja Cepat di Laptop/HP yang memangkas waktu pencarian dokumen harian. (Output nyata teruji di lapangan sebagai bukti penguasaan Digital Literacy).",
          "Tugas Besar 3 [Digital Literacy]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Troubleshooting Mandiri untuk 5 masalah teknis komputer/jaringan yang paling sering ditemui beserta langkah solusinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Digital Literacy)."
        ],
        "criteria": "Lingkungan kerja digital rapi, data penting terlindungi cadangan (backup), dan bebas dari kebiasaan ceroboh yang membahayakan privasi."
      },
      {
        "title": "Automation",
        "whatIs": "Kemampuan menghubungkan berbagai perangkat lunak, rumus pemrosesan data, skrip, atau pintasan sistem untuk mengotomatisasi kerja rutin tugas-tugas digital berulang dan meningkatkan efisiensi kerja secara terukur.",
        "howToUse": "Identifikasi alur pemindahan data atau pengolahan file yang berulang, bangun alur otomatis (menggunakan rumus lanjutan, macro, script Python/Bash dasar, atau integrasi antar-aplikasi), lalu ukur penghematan waktunya.",
        "targetWorks": [
          "Tugas Besar 1 [Automation]: Membangun & Mengimplementasikan 2 Workflow otomatisasi kerja rutin Digital Pribadi lengkap dengan dokumentasi cara kerja dan pengukuran waktu/akurasi sebelum vs sesudah. (Output nyata teruji di lapangan sebagai bukti penguasaan Automation).",
          "Tugas Besar 2 [Automation]: Merancang, Menguji & Mendokumentasikan skrip / Template Pengolahan Data Otomatis untuk merapikan, menghitung, atau memformat laporan rutin dalam hitungan detik. (Output nyata teruji di lapangan sebagai bukti penguasaan Automation).",
          "Tugas Besar 3 [Automation]: Meluncurkan & Memvalidasi di Dunia Nyata daftar Pengecekan Risiko & rencana cadangan manual jika alat error otomatisasi kerja rutin: memastikan data tetap aman dan ada prosedur manual jika sistem otomatis mengalami gangguan. (Output nyata teruji di lapangan sebagai bukti penguasaan Automation)."
        ],
        "criteria": "Teknologi benar-benar memberikan nilai bersih (net value) berupa efisiensi waktu dan penurunan tingkat kesalahan."
      },
      {
        "title": "Technological Fluency",
        "whatIs": "Kefasihan mempelajari arsitektur teknologi baru dengan cepat, mengevaluasi kelayakan suatu tool sebelum mengadopsinya (tidak FOMO), serta merancang ekosistem teknologi yang tangguh dan berumur panjang.",
        "howToUse": "Saat muncul teknologi/software baru, pahami konsep fundamental di baliknya, uji dengan proyek kecil, timbang biaya pindah (switching cost), keandalan jangka panjang, serta portabilitas datanya sebelum menjadikannya tulang punggung kerja.",
        "targetWorks": [
          "Tugas Besar 1 [Technological Fluency]: Membangun & Mengimplementasikan dokumen Arsitektur Personal Tech Stack & Aturan Portabilitas Data (memastikan seluruh datamu dapat diekspor dalam format terbuka seperti JSON/Markdown/CSV). (Output nyata teruji di lapangan sebagai bukti penguasaan Technological Fluency).",
          "Tugas Besar 2 [Technological Fluency]: Merancang, Menguji & Mendokumentasikan laporan Evaluasi & Eksperimen Adopsi Teknologi Baru: membandingkan 2–3 tool modern dengan kriteria biaya, kurva belajar, privasi, dan dampak nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Technological Fluency).",
          "Tugas Besar 3 [Technological Fluency]: Meluncurkan & Memvalidasi di Dunia Nyata proyek Integrasi Lintas Platform yang menggabungkan pemrograman/otomatisasi kerja rutin, pengolahan data, dan antarmuka pengguna untuk menyelesaikan masalah nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Technological Fluency)."
        ],
        "criteria": "Memegang kendali penuh atas teknologi (bukan diperbudak tool baru), dengan ekosistem kerja yang cepat, aman, dan portabel."
      }
    ],
    "Artificial Intelligence": [
      {
        "title": "Prompting",
        "whatIs": "Kemampuan merumuskan instruksi (prompt) yang jelas, kaya konteks, memiliki batasan spesifikasi, contoh format (few-shot), dan kriteria evaluasi saat berkolaborasi dengan model AI.",
        "howToUse": "Berikan peran, konteks masalah, data input yang bersih, format output yang diinginkan, serta instruksi \"Sebutkan jika ada asumsi atau hal yang belum pasti\" alih-alih memberi perintah satu kalimat yang kabur.",
        "targetWorks": [
          "Tugas Besar 1 [Prompting]: Membangun & Mengimplementasikan pustaka 10 Prompt Terstruktur Pribadi (Prompt Library) untuk riset, penulisan kode/dokumen, dan curah pendapat lengkap dengan perbandingan hasil prompt kabur vs prompt terstruktur. (Output nyata teruji di lapangan sebagai bukti penguasaan Prompting).",
          "Tugas Besar 2 [Prompting]: Merancang, Menguji & Mendokumentasikan 3 Studi Kasus Iterasi Prompt & Verifikasi Fakta: menunjukkan bagaimana kamu mengoreksi halusinasi atau jawaban dangkal dari AI. (Output nyata teruji di lapangan sebagai bukti penguasaan Prompting).",
          "Tugas Besar 3 [Prompting]: Meluncurkan & Memvalidasi di Dunia Nyata daftar Aturan Privasi AI Pribadi (jenis data sensitif/pribadi/klien apa saja yang dilarang keras dimasukkan ke dalam prompt publik). (Output nyata teruji di lapangan sebagai bukti penguasaan Prompting)."
        ],
        "criteria": "Instruksi prompt menghasilkan output yang presisi dan relevan, disertai kesadaran penuh untuk selalu memeriksa kebenaran faktanya."
      },
      {
        "title": "Workflow Integration",
        "whatIs": "Kemampuan menyematkan AI ke dalam alur kerja nyata sebagai asisten penguat berpikir dan produksi—lengkap dengan gerbang verifikasi manusia (human-in-the-loop) dan prosedur cadangan (rencana cadangan manual jika alat error).",
        "howToUse": "Bagi alur kerja menjadi tahapan jelas: mana yang dikerjakan manusia (penetapan tujuan, penilaian etis, verifikasi akhir) dan mana yang dibantu AI (pengolahan draf awal, ekstraksi struktur, variasi kode/uji kasus).",
        "targetWorks": [
          "Tugas Besar 1 [Workflow Integration]: Membangun & Mengimplementasikan 2 Dokumentasi Workflow Berbantuan AI End-to-End lengkap dengan pengukuran baseline waktu/kualitas sebelum vs sesudah integrasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Workflow Integration).",
          "Tugas Besar 2 [Workflow Integration]: Merancang, Menguji & Mendokumentasikan log Kegagalan & Koreksi AI (AI jawaban ngawur dari AI & Edge-Case Log): mendokumentasikan 3 contoh nyata di mana output AI keliru dan langkah verifikasi manusia yang menangkapnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Workflow Integration).",
          "Tugas Besar 3 [Workflow Integration]: Meluncurkan & Memvalidasi di Dunia Nyata prosedur rencana cadangan manual jika alat error Mandiri: membuktikan kamu tetap mampu menyelesaikan tugas inti secara kompeten ketika akses AI sedang tidak tersedia. (Output nyata teruji di lapangan sebagai bukti penguasaan Workflow Integration)."
        ],
        "criteria": "AI meningkatkan produktivitas tanpa menggerus kemampuan berpikir kritis mandiri; akurasi dan privasi data terjaga ketat."
      },
      {
        "title": "AI Orchestration",
        "whatIs": "Penguasaan merancang sistem kerja multi-tahap atau agen/pipeline AI yang menggabungkan beberapa model, basis pengetahuan pribadi (RAG/konteks lokal), evaluasi mutu otomatis, dan kendali penuh di tangan manusia.",
        "howToUse": "Rancang arsitektur alur informasi di mana output dari satu tahap pemrosesan divalidasi terhadap sumber kebenaran (ground truth) sebelum diteruskan ke tahap berikutnya, dan audit kualitas hasilnya secara berkala.",
        "targetWorks": [
          "Tugas Besar 1 [AI Orchestration]: Membangun & Mengimplementasikan 1 Sistem / Pipeline AI pembagian peran instrumen dalam lagu Pribadi (menggabungkan konteks dokumen/data lokal, rantai pemrosesan terstruktur, dan checklist validasi output). (Output nyata teruji di lapangan sebagai bukti penguasaan AI Orchestration).",
          "Tugas Besar 2 [AI Orchestration]: Merancang, Menguji & Mendokumentasikan benchmark Evaluasi Kualitas Model: menguji 2 pendekatan/model AI berbeda pada 10 kasus uji standar di bidangmu untuk memilih konfigurasi paling andal. (Output nyata teruji di lapangan sebagai bukti penguasaan AI Orchestration).",
          "Tugas Besar 3 [AI Orchestration]: Meluncurkan & Memvalidasi di Dunia Nyata kerangka Tata Kelola & Etika Penggunaan AI (AI Governance Charter) yang menjaga orisinalitas karya, atribusi jujur, dan tanggung jawab akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan AI Orchestration)."
        ],
        "criteria": "Mampu mengorkestrasi kapabilitas AI tingkat lanjut secara sistematis, terukur, aman, dan bertanggung jawab penuh."
      }
    ],
    "Research": [
      {
        "title": "Information Retrieval",
        "whatIs": "Kemampuan merumuskan pertanyaan pencarian yang tajam, menggunakan operator pencarian lanjutan, dan menemukan sumber informasi primer/kredibel di tengah banjir informasi.",
        "howToUse": "Terjemahkan rasa ingin tahu menjadi pertanyaan riset yang spesifik, gunakan pencarian lintas sumber (jurnal, dokumentasi resmi, buku, laporan data), dan periksa rekam jejak penulis serta tanggal terbitnya.",
        "targetWorks": [
          "Tugas Besar 1 [Information Retrieval]: Membangun & Mengimplementasikan 3 Brief Pencarian Cepat (Rapid Research Brief) yang menjawab pertanyaan teknis/praktis menggunakan minimal 3 sumber primer/resmi yang terverifikasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Information Retrieval).",
          "Tugas Besar 2 [Information Retrieval]: Merancang, Menguji & Mendokumentasikan daftar Sumber Rujukan Kredibel (Curated Trusted Sources) untuk 5 bidang utama yang sedang kamu tekuni. (Output nyata teruji di lapangan sebagai bukti penguasaan Information Retrieval).",
          "Tugas Besar 3 [Information Retrieval]: Meluncurkan & Memvalidasi di Dunia Nyata latihan Cek Fakta & Lacak Sumber Asli: menelusuri 3 klaim viral di berita/media sosial kembali ke laporan atau data penelitian aslinya. (Output nyata teruji di lapangan sebagai bukti penguasaan Information Retrieval)."
        ],
        "criteria": "Mampu menemukan sumber primer yang otoritatif dengan cepat dan tidak tertipu oleh ringkasan sekunder yang bias."
      },
      {
        "title": "Investigation",
        "whatIs": "Kemampuan membedah suatu topik atau masalah secara mendalam—membandingkan berbagai sumber yang saling bertentangan, memisahkan fakta dari opini, dan mencari bukti pembanding (disconfirming evidence).",
        "howToUse": "Jangan hanya mengumpulkan sumber yang mendukung pendapat awalmu; secara aktif carilah data/argumen terkuat dari sisi yang berlawanan, periksa metodologi di balik angka statistik, dan catat tingkat ketidakpastiannya.",
        "targetWorks": [
          "Tugas Besar 1 [Investigation]: Membangun & Mengimplementasikan 2 Laporan Investigasi Topik Mendalam yang memetakan Fakta Terverifikasi, Konsensus Ahli, Perdebatan yang Belum Selesai, dan Bukti Berlawanan. (Output nyata teruji di lapangan sebagai bukti penguasaan Investigation).",
          "Tugas Besar 2 [Investigation]: Merancang, Menguji & Mendokumentasikan matriks Perbandingan Sumber Silang (Cross-Source Triangulation Table) untuk menguji konsistensi data dari 4+ sumber independen. (Output nyata teruji di lapangan sebagai bukti penguasaan Investigation).",
          "Tugas Besar 3 [Investigation]: Meluncurkan & Memvalidasi di Dunia Nyata audit Bias Pencarian Pribadi: mendokumentasikan bagaimana hasil investigasi mengubah atau mengoreksi asumsi awalmu sebelum riset. (Output nyata teruji di lapangan sebagai bukti penguasaan Investigation)."
        ],
        "criteria": "Konteks, tingkat kepastian data, fakta, dan opini dipisahkan secara jujur; bukti berlawanan dicari dengan sengaja."
      },
      {
        "title": "Knowledge Synthesis",
        "whatIs": "Kemampuan menyatukan temuan-temuan riset dari berbagai sumber dan disiplin ilmu menjadi satu peta pengetahuan baru yang utuh, jernih, dan siap dipakai untuk mengambil keputusan strategis.",
        "howToUse": "Kelompokkan temuan berdasarkan pola dan prinsip dasar (bukan sekadar merangkum sumber satu per satu), bangun kerangka konseptual yang menjelaskan hubungan antar-temuan, dan rumuskan rekomendasi tindakan.",
        "targetWorks": [
          "Tugas Besar 1 [Knowledge Synthesis]: Membangun & Mengimplementasikan 1 Dokumen Sintesis Pengetahuan Komprehensif (Literature/Field Review & Actionable Framework) yang memadukan ≥8 sumber lintas perspektif. (Output nyata teruji di lapangan sebagai bukti penguasaan Knowledge Synthesis).",
          "Tugas Besar 2 [Knowledge Synthesis]: Merancang, Menguji & Mendokumentasikan peta Konsep Visual (Knowledge Graph / Taxonomy Map) yang memetakan struktur ilmu dari satu domain baru sehingga mudah dipelajari ulang. (Output nyata teruji di lapangan sebagai bukti penguasaan Knowledge Synthesis).",
          "Tugas Besar 3 [Knowledge Synthesis]: Meluncurkan & Memvalidasi di Dunia Nyata memo Keputusan Berbasis Riset: mengubah hasil sintesis pengetahuan menjadi keputusan praktis lengkap dengan batasan kondisi berlakunya. (Output nyata teruji di lapangan sebagai bukti penguasaan Knowledge Synthesis)."
        ],
        "criteria": "Sintesis menghasilkan kejernihan struktur baru yang melampaui kumpulan kutipan, jujur terhadap ketidakpastian, dan aplikatif."
      }
    ],
    "Adaptability": [
      {
        "title": "Adjustment",
        "whatIs": "Kemampuan menyesuaikan rencana, jadwal, dan cara kerja secara tenang ketika menghadapi perubahan situasi, kendala mendadak, atau lingkungan baru tanpa kehilangan arah tujuan utama.",
        "howToUse": "Saat rencana awal terganggu, segera pisahkan \"Apa yang berada di dalam kendaliku saat ini\" dari \"Apa yang di luar kendaliku\", lalu susun ulang langkah prioritas (Rencana B) dalam waktu singkat.",
        "targetWorks": [
          "Tugas Besar 1 [Adjustment]: Membangun & Mengimplementasikan 3 Catatan Kasus Adaptasi Situasi Nyata (ketika terjadi perubahan mendadak pada jadwal, alat, atau kondisi lapangan) beserta solusi penyesuaiannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Adjustment).",
          "Tugas Besar 2 [Adjustment]: Merancang, Menguji & Mendokumentasikan protokol \"Rencana A / Rencana B / Batas Minimum\" untuk rutinitas pentingmu agar tetap berjalan meski sedang sibuk atau dalam perjalanan. (Output nyata teruji di lapangan sebagai bukti penguasaan Adjustment).",
          "Tugas Besar 3 [Adjustment]: Meluncurkan & Memvalidasi di Dunia Nyata refleksi Pasca-Perubahan: mengevaluasi seberapa cepat kamu pulih dari rasa kesal akibat perubahan rencana menuju tindakan solutif. (Output nyata teruji di lapangan sebagai bukti penguasaan Adjustment)."
        ],
        "criteria": "Tetap tenang dan fleksibel menghadapi perubahan mendadak; fokus pada solusi yang bisa dikerjakan saat ini."
      },
      {
        "title": "Learning Agility",
        "whatIs": "Kemampuan mempelajari keterampilan, alat, atau domain yang sama sekali baru dengan cepat melalui dekonstruksi sub-skill, latihan terarah (deliberate practice), dan pencarian umpan balik dini.",
        "howToUse": "Saat masuk ke bidang baru, identifikasi 20% fondasi inti yang menentukan 80% hasil awal, bangun proyek kecil sesegera mungkin, minta koreksi dari praktisi yang lebih betingkat capekngalaman, dan perbaiki kesalahannya.",
        "targetWorks": [
          "Tugas Besar 1 [Learning Agility]: Membangun & Mengimplementasikan proyek Sprint Belajar 14 Hari (Learning Sprint): mempelajari 1 tool atau sub-skill baru dari nol hingga menghasilkan 1 karya fungsional nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Learning Agility).",
          "Tugas Besar 2 [Learning Agility]: Merancang, Menguji & Mendokumentasikan peta Dekonstruksi Keterampilan Baru yang memecah skill asing menjadi komponen dasar, sumber belajar, dan tolok ukur latihan. (Output nyata teruji di lapangan sebagai bukti penguasaan Learning Agility).",
          "Tugas Besar 3 [Learning Agility]: Meluncurkan & Memvalidasi di Dunia Nyata log Eksperimen & Penghentian Cerdas: mencatat eksperimen cara belajar yang berhasil ditransfer serta keberanian menghentikan metode yang terbukti tidak efektif. (Output nyata teruji di lapangan sebagai bukti penguasaan Learning Agility)."
        ],
        "criteria": "Mampu mentransfer prinsip belajar dari domain lama ke domain baru dengan cepat dan terbuka mencari umpan balik korektif."
      },
      {
        "title": "Adaptive Intelligence",
        "whatIs": "Kebijaksanaan tingkat tinggi dalam membaca perubahan zaman/lingkungan secara strategis—mengetahui kapan harus bereksperimen mengubah pendekatan secara radikal dan kapan harus teguh mempertahankan prinsip yang sudah terbukti.",
        "howToUse": "Pegang teguh nilai inti dan prinsip fundamental (yang tidak berubah oleh zaman), namun perlakukan metode, alat, dan strategi taktis sebagai hipotesis hidup yang siap diperbarui saat realitas berubah.",
        "targetWorks": [
          "Tugas Besar 1 [Adaptive Intelligence]: Membangun & Mengimplementasikan dokumen Strategi \"Apa yang Tetap vs Apa yang Berubah\": memetakan prinsip hidup/kerja yang permanen vs metode yang kamu adaptasikan terhadap perkembangan zaman. (Output nyata teruji di lapangan sebagai bukti penguasaan Adaptive Intelligence).",
          "Tugas Besar 2 [Adaptive Intelligence]: Merancang, Menguji & Mendokumentasikan proyek Lintas Domain (Cross-Domain Transfer Project): menyelesaikan satu masalah di bidang A menggunakan kerangka metode yang kamu pelajari di bidang B. (Output nyata teruji di lapangan sebagai bukti penguasaan Adaptive Intelligence).",
          "Tugas Besar 3 [Adaptive Intelligence]: Meluncurkan & Memvalidasi di Dunia Nyata kajian Kuartalan Kalibrasi Diri (Quarterly Adaptation Review) yang mengevaluasi kesiapan keahlianmu menghadapi perubahan lanskap teknologi dan sosial. (Output nyata teruji di lapangan sebagai bukti penguasaan Adaptive Intelligence)."
        ],
        "criteria": "Tangguh di tengah ketidakpastian (antifragile), lincah bereksperimen tanpa kehilangan jangkar identitas dan prinsip."
      }
    ],
    "Cultural Intelligence": [
      {
        "title": "Awareness",
        "whatIs": "Kesadaran bahwa cara pandang, kebiasaan komunikasi, dan asumsi keseharian kita sendiri dibentuk oleh latar budaya tertentu—serta rasa hormat terhadap keberadaan latar budaya dan generasi yang berbeda.",
        "howToUse": "Sebelum menilai cara bicara atau kebiasaan orang dari daerah, profesi, generasi, atau latar belakang lain sebagai \"aneh/salah\", tanyakan dulu: \"Konteks dan nilai apa yang membuat kebiasaan itu wajar di tempat mereka?\"",
        "targetWorks": [
          "Tugas Besar 1 [Awareness]: Membangun & Mengimplementasikan jurnal Refleksi Lintas Budaya / Lintas Latar Belakang: mengidentifikasi 5 asumsi pribadimu yang tadinya kamu anggap berlaku universal bagi semua orang. (Output nyata teruji di lapangan sebagai bukti penguasaan Awareness).",
          "Tugas Besar 2 [Awareness]: Merancang, Menguji & Mendokumentasikan catatan Pengamatan Gaya Komunikasi (Konteks Tinggi/Tidak Langsung vs Konteks Rendah/Langsung) dalam lingkungan pergaulan atau kerjamu. (Output nyata teruji di lapangan sebagai bukti penguasaan Awareness).",
          "Tugas Besar 3 [Awareness]: Meluncurkan & Memvalidasi di Dunia Nyata wawancara Belajar Empatik: berbincang mendalam dengan 2 rekan dari latar daerah/budaya/generasi berbeda untuk memahami nilai yang mereka junjung. (Output nyata teruji di lapangan sebagai bukti penguasaan Awareness)."
        ],
        "criteria": "Bebas dari sikap meremehkan atau menggeneralisasi kelompok lain (label pukul rata); sadar akan kacamata budaya sendiri."
      },
      {
        "title": "Cultural Fluency",
        "whatIs": "Kemampuan menyesuaikan gaya bahasa, kesantunan, pembacaan isyarat non-verbal, dan pendekatan kerja saat berinteraksi di lingkungan sosial atau budaya yang beragam secara luwes dan tulus.",
        "howToUse": "Amati norma sopan santun dan tata krama di lingkungan baru, sesuaikan tingkat formalitas dan cara menyampaikan pendapat agar pesan diterima dengan baik tanpa kehilangan ketulusan dirimu.",
        "targetWorks": [
          "Tugas Besar 1 [Cultural Fluency]: Membangun & Mengimplementasikan 3 Dokumentasi Pengalaman Beradaptasi di Komunitas/Lingkungan Baru yang memiliki norma atau kebiasaan berbeda dari lingkungan asalmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Cultural Fluency).",
          "Tugas Besar 2 [Cultural Fluency]: Merancang, Menguji & Mendokumentasikan panduan Jembatan Komunikasi Lintas Generasi/Disiplin: cara menerjemahkan gagasan agar nyambung saat berbicara dengan senior, rekan sebaya, maupun masyarakat awam. (Output nyata teruji di lapangan sebagai bukti penguasaan Cultural Fluency).",
          "Tugas Besar 3 [Cultural Fluency]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Kasus Kesalahpahaman Budaya: membedah 1 momen canggung/salah paham lintas latar belakang dan bagaimana kamu menyelesaikannya dengan respek. (Output nyata teruji di lapangan sebagai bukti penguasaan Cultural Fluency)."
        ],
        "criteria": "Mampu berbaur dan berkomunikasi efektif di berbagai lingkungan sosial dengan menghormati konteks lokal."
      },
      {
        "title": "Cross-Cultural Competence",
        "whatIs": "Kemampuan membangun kolaborasi yang inklusif, menjembatani kesenjangan antar-kelompok yang berbeda latar belakang/budaya, dan menyatukan keberagaman perspektif menjadi kekuatan kolektif.",
        "howToUse": "Fasilitasi ruang kerja/komunitas di mana setiap latar belakang merasa dihargai kontribusinya, terjemahkan perbedaan gaya kerja menjadi saling melengkapi, dan cegah terbentuknya kubu eksklusif.",
        "targetWorks": [
          "Tugas Besar 1 [Cross-Cultural Competence]: Membangun & Mengimplementasikan proyek Kolaborasi Lintas Latar Belakang (menggabungkan rekan dari disiplin ilmu, daerah, atau latar budaya berbeda) hingga menghasilkan karya bersama yang solid. (Output nyata teruji di lapangan sebagai bukti penguasaan Cross-Cultural Competence).",
          "Tugas Besar 2 [Cross-Cultural Competence]: Merancang, Menguji & Mendokumentasikan protokol Inklusivitas & Penghormatan Konteks dalam tim atau acara komunitas yang kamu rancang. (Output nyata teruji di lapangan sebagai bukti penguasaan Cross-Cultural Competence).",
          "Tugas Besar 3 [Cross-Cultural Competence]: Meluncurkan & Memvalidasi di Dunia Nyata refleksi Umpan Balik Mitra Lintas Budaya mengenai kepekaan, keterbukaan, dan keadilanmu dalam bekerja sama. (Output nyata teruji di lapangan sebagai bukti penguasaan Cross-Cultural Competence)."
        ],
        "criteria": "Menjadi jembatan penghubung yang dipercaya lintas kelompok; mampu mengubah keberagaman sudut pandang menjadi sinergi nyata."
      }
    ]
  },
  "critical-thinking-logic": {
    "Logic": [
      {
        "title": "Deduction",
        "whatIs": "Kemampuan mengurai sebuah argumen menjadi bagian-bagian pembentuknya (premis mayor, premis minor, asumsi tersembunyi, dan kesimpulan) serta memeriksa apakah kesimpulan tersebut sungguh mengikuti premisnya.",
        "howToUse": "Saat membaca artikel, mendengar klaim, atau menyusun pendapat sendiri, tuliskan premis-premisnya dalam kalimat bernomor (P1, P2, ... -> Kesimpulan C), lalu periksa apakah ada lompatan logika di antaranya.",
        "targetWorks": [
          "Tugas Besar 1 [Deduction]: Membangun & Mengimplementasikan 5 Peta Argumen Visual (Argument Mapping: Premis, Asumsi Tersembunyi, kesimpulan sementara, dan Kesimpulan) dari artikel opini atau perdebatan nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Deduction).",
          "Tugas Besar 2 [Deduction]: Merancang, Menguji & Mendokumentasikan latihan Deteksi Cacat Logika (Logical Fallacy Audit): mengidentifikasi dan mengoreksi 5 jenis sesat pikir umum (memelintir argumen lawan agar mudah diserang, menyerang pribadi orangnya, bukan argumennya, memaksa pilih dua opsi ekstrem padahal masih ada jalan lain, slippery slope, hasty generalization). (Output nyata teruji di lapangan sebagai bukti penguasaan Deduction).",
          "Tugas Besar 3 [Deduction]: Meluncurkan & Memvalidasi di Dunia Nyata penyusunan 3 Argumen Deduktif/Induktif Pribadi dengan definisi istilah yang konsisten dari awal hingga akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan Deduction)."
        ],
        "criteria": "Premis tertulis jelas, istilah tidak bergeser maknanya di tengah jalan (equivocation), dan kesimpulan ditarik secara sah."
      },
      {
        "title": "Formal Reasoning",
        "whatIs": "Penguasaan struktur penalaran formal (implikasi jika-maka, kontraposisi, syarat perlu vs syarat cukup, kuantor semua/sebagian, serta logika probabilitas dasar) untuk menguji konsistensi sistem pemikiran.",
        "howToUse": "Uji setiap aturan atau klaim menggunakan bentuk logika formal (misal: membedakan \"Jika A maka B\" dari \"Jika B maka A\"), dan gunakan contoh penyangkal (counterexample) untuk menguji apakah suatu pernyataan umum benar-benar tahan banting.",
        "targetWorks": [
          "Tugas Besar 1 [Formal Reasoning]: Membangun & Mengimplementasikan 3 Dokumen Analisis \"Syarat Perlu vs Syarat Cukup\" dan \"Korelasi vs Kausalitas\" pada kasus pengambilan keputusan nyata. (Output nyata teruji di lapangan sebagai bukti penguasaan Formal Reasoning).",
          "Tugas Besar 2 [Formal Reasoning]: Merancang, Menguji & Mendokumentasikan uji Ketahanan Klaim dengan Counterexample: merumuskan contoh penyangkal untuk menguji dan memperhalus 4 aturan/prinsip kerja yang sering dipakai. (Output nyata teruji di lapangan sebagai bukti penguasaan Formal Reasoning).",
          "Tugas Besar 3 [Formal Reasoning]: Meluncurkan & Memvalidasi di Dunia Nyata tabel Kebenaran / Pohon Keputusan Logis (Decision Logic Tree) untuk memetakan aturan bisnis, kode program, atau prosedur kebijakan tanpa celah kontradiksi. (Output nyata teruji di lapangan sebagai bukti penguasaan Formal Reasoning)."
        ],
        "criteria": "Penalaran bebas dari kekeliruan pembalikan implikasi (salah menyimpulkan sebab-akibat) dan tahan uji terhadap contoh penyangkal."
      },
      {
        "title": "Proof",
        "whatIs": "Kemampuan membangun pembuktian berlapis yang ketat, tak terbantahkan di dalam kerangka aksiomanya, serta mampu memverifikasi kebenaran argumen kompleks dari awal hingga akhir secara sistematis.",
        "howToUse": "Tetapkan definisi dan aksioma pangkal secara eksplisit, bangun rantai deduksi langkah demi langkah (atau pembuktian melalui kontradiksi / induksi), dan periksa setiap celah asumsi yang belum terbukti.",
        "targetWorks": [
          "Tugas Besar 1 [Proof]: Membangun & Mengimplementasikan 2 Dokumen Pembuktian / Verifikasi Argumen Berlapis (Formal Proof / Rigorous Analytical Case) yang menguji suatu proposisi kompleks dari aksioma dasar hingga kesimpulan akhir. (Output nyata teruji di lapangan sebagai bukti penguasaan Proof).",
          "Tugas Besar 2 [Proof]: Merancang, Menguji & Mendokumentasikan audit Konsistensi Internal pada satu dokumen kebijakan, spesifikasi teknis, atau sistem aturan untuk menemukan dan memperbaiki kontradiksi tersembunyi. (Output nyata teruji di lapangan sebagai bukti penguasaan Proof).",
          "Tugas Besar 3 [Proof]: Meluncurkan & Memvalidasi di Dunia Nyata panduan Standar Penalaran & Pembuktian Pribadi untuk mengevaluasi klaim berisiko tinggi sebelum mengambil keputusan besar. (Output nyata teruji di lapangan sebagai bukti penguasaan Proof)."
        ],
        "criteria": "Setiap langkah kesimpulan sementara dapat dipertanggungjawabkan secara ketat, transparan terhadap batas aksiomanya, dan koheren penuh."
      }
    ],
    "Epistemology": [
      {
        "title": "Questioning",
        "whatIs": "Kemampuan mengajukan pertanyaan Sokratik yang tajam untuk menggali dasar pengetahuan (\"Dari mana kita tahu ini benar?\", \"Apa definisi tepatnya?\", \"Bukti apa yang mendukungnya?\").",
        "howToUse": "Jangan menelan klaim begitu saja; gunakan 5 kategori pertanyaan Sokratik (klarifikasi makna, pengujian asumsi, pemeriksaan bukti, penelusuran implikasi, dan penggalian sudut pandang alternatif).",
        "targetWorks": [
          "Tugas Besar 1 [Questioning]: Membangun & Mengimplementasikan 3 Lembar Dialog / Bedah Sokratik (Socratic Questioning Log) yang menguji keyakinan atau rencana pribadimu sendiri hingga ke akar alasannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Questioning).",
          "Tugas Besar 2 [Questioning]: Merancang, Menguji & Mendokumentasikan daftar 10 Pertanyaan Penguji Klaim yang selalu kamu gunakan sebelum mempercayai berita, tren investasi/kesehatan, atau rekomendasi populer. (Output nyata teruji di lapangan sebagai bukti penguasaan Questioning).",
          "Tugas Besar 3 [Questioning]: Meluncurkan & Memvalidasi di Dunia Nyata peta Pemisahan 3 Zona Pengetahuan pada satu topik penting: \"Apa yang Saya Tahu Pasti (Fakta)\", \"Apa yang Saya Yakini (Opini/Probabilitas)\", dan \"Apa yang Saya Belum Tahu\". (Output nyata teruji di lapangan sebagai bukti penguasaan Questioning)."
        ],
        "criteria": "Pertanyaan membuka kejernihan baru (bukan sekadar debat kusir) dan memisahkan fakta dari keyakinan secara jujur."
      },
      {
        "title": "Evidence Evaluation",
        "whatIs": "Kemampuan menimbang bobot dan kualitas bukti secara bertingkat—membedakan anekdot tunggal dari data sistematis, memeriksa ukuran sampel, bias seleksi, serta memperbarui tingkat keyakinan (Bayesian updating) saat bukti baru hadir.",
        "howToUse": "Beri bobot pada bukti berdasarkan keandalan metodenya, tetapkan tingkat keyakinan dalam rentang probabilitas (misal 70% yakin, bukan 100% mutlak), dan tanyakan: \"Bukti spesifik apa yang jika ditemukan akan membuatku mengubah pikiran?\"",
        "targetWorks": [
          "Tugas Besar 1 [Evidence Evaluation]: Membangun & Mengimplementasikan 3 Analisis Evaluasi Bukti pada klaim populer/profesional lengkap dengan penilaian kekuatan metodologi, keterbatasan data, dan tingkat keyakinan (confidence level). (Output nyata teruji di lapangan sebagai bukti penguasaan Evidence Evaluation).",
          "Tugas Besar 2 [Evidence Evaluation]: Merancang, Menguji & Mendokumentasikan catatan Revisi Keyakinan (Belief Update Log): mendokumentasikan 2 pandangan pribadimu yang berubah secara sadar setelah menemukan bukti baru yang lebih kuat. (Output nyata teruji di lapangan sebagai bukti penguasaan Evidence Evaluation).",
          "Tugas Besar 3 [Evidence Evaluation]: Meluncurkan & Memvalidasi di Dunia Nyata kartu Kriteria Falsifikasi (Falsifiability Card): menuliskan di awal bukti apa yang akan membuktikan hipotesis/rencanamu keliru. (Output nyata teruji di lapangan sebagai bukti penguasaan Evidence Evaluation)."
        ],
        "criteria": "Tingkat keyakinan proporsional terhadap kekuatan bukti, dan siap memperbarui kesimpulan ketika bukti berubah."
      },
      {
        "title": "Epistemic Judgment",
        "whatIs": "Kebijaksanaan epistemik untuk mengelola ketidakpastian tinggi, mengenali batas pengetahuan manusia (kerendahan hati untuk mengakui batas pengetahuan), menghindari kesombongan intelektual maupun skeptisisme sinis, dan mengambil keputusan bertanggung jawab di tengah informasi yang belum sempurna.",
        "howToUse": "Ketika harus memutuskan sesuatu di tengah data yang belum lengkap, petakan risiko kesalahan (biaya jika salah vs manfaat jika benar), jaga opsi tetap reversibel bila tingkat ketidaktahuan tinggi, dan tetap terbuka pada koreksi.",
        "targetWorks": [
          "Tugas Besar 1 [Epistemic Judgment]: Membangun & Mengimplementasikan memo Keputusan di Bawah Ketidakpastian (Decision Under Uncertainty Dossier) yang memadukan bobot bukti, batas ketidaktahuan, dan strategi lindung nilai (hedging). (Output nyata teruji di lapangan sebagai bukti penguasaan Epistemic Judgment).",
          "Tugas Besar 2 [Epistemic Judgment]: Merancang, Menguji & Mendokumentasikan audit Kerendahan Hati Epistemik: mengevaluasi batas kompetensi pribadi (Circle of Competence) dan menetapkan kapan wajib berkonsultasi pada ahli domain. (Output nyata teruji di lapangan sebagai bukti penguasaan Epistemic Judgment).",
          "Tugas Besar 3 [Epistemic Judgment]: Meluncurkan & Memvalidasi di Dunia Nyata esai Sintesis cara menguji kebenaran informasi Pribadi tentang bagaimana kamu menjaga keseimbangan antara keteguhan prinsip dan keterbukaan terhadap kebenaran yang terus dipelajari. (Output nyata teruji di lapangan sebagai bukti penguasaan Epistemic Judgment)."
        ],
        "criteria": "Penilaian matang, terkalibrasi baik antara tingkat keyakinan dan akurasi nyata, serta bebas dari fanatisme buta."
      }
    ],
    "First Principles": [
      {
        "title": "Decomposition",
        "whatIs": "Kemampuan mengurai masalah yang tampak raksasa dan rumit menjadi komponen-komponen dasar, fakta fisik/logis yang paling tidak terbantahkan, serta kendala sesungguhnya.",
        "howToUse": "Jangan memulai dari \"Bagaimana orang lain biasanya melakukan ini (reasoning by analogy)\"; pecah masalah hingga ke unsur terkecilnya (biaya material dasar, hukum fisika/logika, waktu, dan kebutuhan inti pengguna).",
        "targetWorks": [
          "Tugas Besar 1 [Decomposition]: Membangun & Mengimplementasikan 3 Peta Dekomposisi Masalah (First-Principles Breakdown Tree) yang memisahkan Fakta Dasar, Kendala Nyata, dan Asumsi Warisan/Kebiasaan. (Output nyata teruji di lapangan sebagai bukti penguasaan Decomposition).",
          "Tugas Besar 2 [Decomposition]: Merancang, Menguji & Mendokumentasikan latihan Bedah Biaya & Komponen (Cost/Resource Decomposition): mengurai 1 produk/layanan mahal menjadi komponen pembentuknya untuk menemukan alternatif yang 5x lebih hemat. (Output nyata teruji di lapangan sebagai bukti penguasaan Decomposition).",
          "Tugas Besar 3 [Decomposition]: Meluncurkan & Memvalidasi di Dunia Nyata analisis \"Akar vs Ranting\": membedah 2 masalah pribadi/kerja yang berulang untuk menemukan 1 faktor pangkal penyebabnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Decomposition)."
        ],
        "criteria": "Masalah terurai jelas menjadi fakta fundamental dan asumsi yang terpisah tegas."
      },
      {
        "title": "Fundamental Analysis",
        "whatIs": "Kemampuan menguji setiap asumsi kebiasaan secara kritis, menghitung batas kemungkinan teoritis vs praktis, dan mengevaluasi untung-rugi yang harus dipertimbangkan dari setiap kendala fundamental.",
        "howToUse": "Ambil daftar asumsi dari tahap dekomposisi, tantang satu per satu (\"Apakah aturan ini hukum alam yang mutlak, atau hanya kebiasaan lama karena dulu alatnya belum ada?\"), lalu uji dengan perhitungan dasar (back-of-the-envelope calculation).",
        "targetWorks": [
          "Tugas Besar 1 [Fundamental Analysis]: Membangun & Mengimplementasikan 2 Dokumen Analisis Fundamental & Penghapusan Asumsi Lama yang membuktikan bahwa suatu hambatan yang selama ini dianggap mutlak ternyata bisa dilewati. (Output nyata teruji di lapangan sebagai bukti penguasaan Fundamental Analysis).",
          "Tugas Besar 2 [Fundamental Analysis]: Merancang, Menguji & Mendokumentasikan perhitungan Estimasi Dasar (Fermi / Back-of-the-Envelope Calculation) untuk memvalidasi kelayakan teknis atau ekonomis sebuah ide dalam 15 menit. (Output nyata teruji di lapangan sebagai bukti penguasaan Fundamental Analysis).",
          "Tugas Besar 3 [Fundamental Analysis]: Meluncurkan & Memvalidasi di Dunia Nyata matriks Evaluasi untung-rugi yang harus dipertimbangkan Fundamental yang membandingkan 3 jalur solusi berdasarkan kendala fisika, waktu, dan sumber daya. (Output nyata teruji di lapangan sebagai bukti penguasaan Fundamental Analysis)."
        ],
        "criteria": "Asumsi diuji dengan data/perhitungan dasar yang masuk akal, bukan diterima begitu saja karena \"dari dulu memang begitu\"."
      },
      {
        "title": "Conceptual Reconstruction",
        "whatIs": "Kemampuan merakit kembali kebenaran-kebenaran dasar (membedah masalah sampai ke akar paling dasar) dari bawah ke atas untuk melahirkan solusi, metode, atau arsitektur baru yang jauh lebih sederhana, kuat, dan efektif.",
        "howToUse": "Setelah membuang asumsi kebiasaan yang tidak relevan, susun solusi baru langsung di atas fondasi fakta dasar dan kebutuhan inti, lalu uji prototipenya di dunia nyata.",
        "targetWorks": [
          "Tugas Besar 1 [Conceptual Reconstruction]: Membangun & Mengimplementasikan 1 Proyek Rekonstruksi Solusi dari Nol (First-Principles Redesign) yang memangkas kerumitan proses/produk secara drastis sembari meningkatkan hasilnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Conceptual Reconstruction).",
          "Tugas Besar 2 [Conceptual Reconstruction]: Merancang, Menguji & Mendokumentasikan studi Kasus Perbandingan \"Pendekatan Analogi/Kebiasaan vs Rekonstruksi membedah masalah sampai ke akar paling dasar\" lengkap dengan evaluasi hasil aktualnya. (Output nyata teruji di lapangan sebagai bukti penguasaan Conceptual Reconstruction).",
          "Tugas Besar 3 [Conceptual Reconstruction]: Meluncurkan & Memvalidasi di Dunia Nyata kerangka Panduan Inovasi Prinsip Dasar untuk memecahkan masalah buntu (wicked problems) di bidang keahlian utamamu. (Output nyata teruji di lapangan sebagai bukti penguasaan Conceptual Reconstruction)."
        ],
        "criteria": "Solusi baru berdiri kokoh di atas prinsip dasar, elegan, bebas dari beban kerumitan warisan, dan terbukti bekerja nyata."
      }
    ],
    "Cognitive Bias": [
      {
        "title": "Bias Awareness",
        "whatIs": "Kemampuan mengenali jebakan-jebakan sistematis dalam pikiran manusia (seperti kebiasaan hanya mencari bukti yang mendukung pendapat sendiri, enggan berhenti dari hal yang merugikan karena merasa sudah terlanjur keluar modal/waktu, terpaku pada informasi atau angka pertama yang dilihat, survivorship bias, dan Dunning-Kruger) terutama ketika muncul di dalam diri sendiri.",
        "howToUse": "Pelajari tanda-tanda kemunculan bias kognitif dalam keputusan sehari-hari, terutama saat kamu merasa sangat emosional, terburu-buru, sudah terlanjur keluar banyak biaya/waktu, atau sangat ingin suatu klaim itu benar.",
        "targetWorks": [
          "Tugas Besar 1 [Bias Awareness]: Membangun & Mengimplementasikan jurnal Deteksi Bias Pribadi (Personal Cognitive Bias Log): mencatat 5 kejadian nyata ketika kamu menyadari pikiranmu sedang ditarik oleh kebiasaan hanya mencari bukti yang mendukung pendapat sendiri atau enggan berhenti dari hal yang merugikan karena merasa sudah terlanjur keluar modal/waktu. (Output nyata teruji di lapangan sebagai bukti penguasaan Bias Awareness).",
          "Tugas Besar 2 [Bias Awareness]: Merancang, Menguji & Mendokumentasikan kartu Referensi Cepat \"10 Bias Kognitif Paling Berbahaya dalam Keuangan, Riset & Relasi\" beserta gejala peringatan dininya. (Output nyata teruji di lapangan sebagai bukti penguasaan Bias Awareness).",
          "Tugas Besar 3 [Bias Awareness]: Meluncurkan & Memvalidasi di Dunia Nyata analisis Studi Kasus Survivorship Bias & Halo Effect pada kisah sukses populer atau klaim produk di sekitar kita. (Output nyata teruji di lapangan sebagai bukti penguasaan Bias Awareness)."
        ],
        "criteria": "Menggunakan pengetahuan bias pertama-tama untuk mengoreksi diri sendiri, bukan sekadar senjata untuk menuduh orang lain bias."
      },
      {
        "title": "Bias Mitigation",
        "whatIs": "Kemampuan menerapkan teknik koreksi pikiran secara aktif (seperti membayangkan potensi gagal sebelum proyek dimulai agar bisa dicegah, Red-Teaming, Base-Rate Neglect Check, dan Devil's Advocate) sebelum mengeksekusi keputusan penting.",
        "howToUse": "Sebelum meluncurkan proyek atau mengambil keputusan besar, jalankan sesi membayangkan potensi gagal sebelum proyek dimulai agar bisa dicegah: \"Bayangkan 6 bulan dari sekarang keputusan ini gagal total—tuliskan 5 penyebab utamanya\", lalu pasang pencegahannya sekarang.",
        "targetWorks": [
          "Tugas Besar 1 [Bias Mitigation]: Membangun & Mengimplementasikan 3 Dokumen Analisis membayangkan potensi gagal sebelum proyek dimulai agar bisa dicegah & Red-Teaming sebelum memulai proyek/keputusan penting lengkap dengan langkah pencegahan yang diambil. (Output nyata teruji di lapangan sebagai bukti penguasaan Bias Mitigation).",
          "Tugas Besar 2 [Bias Mitigation]: Merancang, Menguji & Mendokumentasikan log Prediksi & Kalibrasi Keputusan (Decision & Prediction Journal): mencatat prediksi hasil + tingkat keyakinan (%) di awal, lalu membandingkannya dengan hasil nyata (evaluasi jujur setelah proyek selesai). (Output nyata teruji di lapangan sebagai bukti penguasaan Bias Mitigation).",
          "Tugas Besar 3 [Bias Mitigation]: Meluncurkan & Memvalidasi di Dunia Nyata latihan \"Steel-Manning & Disconfirming Search\": menuliskan argumen terkuat yang menentang pilihan favoritmu sebelum mengetuk palu keputusan. (Output nyata teruji di lapangan sebagai bukti penguasaan Bias Mitigation)."
        ],
        "criteria": "Prosedur koreksi bias dijalankan secara nyata di atas kertas sebelum keputusan diambil, bukan sekadar penyesalan di akhir."
      },
      {
        "title": "Debiasing Systems",
        "whatIs": "Kemampuan merancang lingkungan, checklist, aturan keputusan otomatis (decision hygiene), dan budaya diskusi yang secara struktural melindungi diri maupun tim dari kesalahan bias kognitif berulang.",
        "howToUse": "Jangan hanya mengandalkan niat baik saat lelah; bangun checklist wajib sebelum keputusan besar, pisahkan tahap pengumpulan pendapat secara independen sebelum rapat (mencegah groupthink), dan tetapkan kriteria berhenti (stop-loss) di awal.",
        "targetWorks": [
          "Tugas Besar 1 [Debiasing Systems]: Membangun & Mengimplementasikan sistem Checklist Higienitas Keputusan (Decision Hygiene SOP) untuk keputusan karier, finansial, rekayasa, atau rekrutmen/kolaborasi. (Output nyata teruji di lapangan sebagai bukti penguasaan Debiasing Systems).",
          "Tugas Besar 2 [Debiasing Systems]: Merancang, Menguji & Mendokumentasikan protokol Rapat Anti-Groupthink (pengumpulan input tertulis independen sebelum diskusi terbuka + penunjukan penguji asumsi resmi). (Output nyata teruji di lapangan sebagai bukti penguasaan Debiasing Systems).",
          "Tugas Besar 3 [Debiasing Systems]: Meluncurkan & Memvalidasi di Dunia Nyata laporan Audit Kalibrasi Tahunan atas Jurnal Keputusan Pribadi yang mengukur peningkatan akurasi penilaianmu dari waktu ke waktu. (Output nyata teruji di lapangan sebagai bukti penguasaan Debiasing Systems)."
        ],
        "criteria": "Terbangun sistem pelindung keputusan yang bekerja andal bahkan ketika kamu sedang lelah, tertekan, atau terburu-buru."
      }
    ],
    "Systems Thinking": [
      {
        "title": "Causal Reasoning",
        "whatIs": "Kemampuan membedakan gejala permukaan (symptoms) dari akar penyebab struktural, serta memetakan rantai sebab-akibat yang saling terhubung (bukan sekadar melihat peristiwa secara terpisah/linier).",
        "howToUse": "Saat menghadapi masalah yang terus kambuh, tanyakan \"Mengapa?\" secara berlapis (5 Whys + peta cabang penyebab), dan periksa apakah solusi yang diambil baru sekadar meredakan gejala sesaat atau sudah memutus akar rantai penyebabnya.",
        "targetWorks": [
          "Tugas Besar 1 [Causal Reasoning]: Membangun & Mengimplementasikan 3 Diagram Peta Sebab-Akibat (Causal Chain / Fishbone / Root-Cause Map) yang membedah masalah nyata di pekerjaan, kebiasaan hidup, atau rekayasa. (Output nyata teruji di lapangan sebagai bukti penguasaan Causal Reasoning).",
          "Tugas Besar 2 [Causal Reasoning]: Merancang, Menguji & Mendokumentasikan analisis \"Solusi Tambal Sulam vs Solusi Akar\": membandingkan dampak jangka pendek dan jangka panjang dari 2 jenis intervensi pada masalah yang sama. (Output nyata teruji di lapangan sebagai bukti penguasaan Causal Reasoning).",
          "Tugas Besar 3 [Causal Reasoning]: Meluncurkan & Memvalidasi di Dunia Nyata peta Dampak Orde Kedua & Ketiga (Second & Third-Order Consequences): menelusuri efek berantai dari satu keputusan sebelum diterapkan. (Output nyata teruji di lapangan sebagai bukti penguasaan Causal Reasoning)."
        ],
        "criteria": "Tajam membedakan gejala dari penyebab pangkal; mampu mengantisipasi efek samping tidak langsung (dampak ikutan jangka panjangs)."
      },
      {
        "title": "Feedback Loops",
        "whatIs": "Kemampuan mengenali dan memodelkan putaran umpan balik penguat (reinforcing loops / efek bola salju), putaran penyeimbang (balancing loops), serta jeda waktu (time delays) di dalam suatu sistem.",
        "howToUse": "Gambar peta hubungan sebab-akibat (CLD) dengan tanda (+) untuk penguatan dan (-) untuk penyeimbangan; perhatikan letak jeda waktu (delay) agar tidak bereaksi berlebihan (overshooting) atau menyerah terlalu cepat sebelum hasil sistem terlihat.",
        "targetWorks": [
          "Tugas Besar 1 [Feedback Loops]: Membangun & Mengimplementasikan 3 Diagram Putaran Umpan Balik (peta hubungan sebab-akibats) yang memetakan Reinforcing Loop, Balancing Loop, dan Time Delay pada kebiasaan pribadi, bisnis, atau teknologi. (Output nyata teruji di lapangan sebagai bukti penguasaan Feedback Loops).",
          "Tugas Besar 2 [Feedback Loops]: Merancang, Menguji & Mendokumentasikan identifikasi Archetype Sistem (seperti \"Fixes that Fail\", \"Shifting the Burden\", atau \"Limits to Growth\") pada kasus nyata beserta titik ungkit perbaikannya. (Output nyata teruji di lapangan sebagai bukti penguasaan Feedback Loops).",
          "Tugas Besar 3 [Feedback Loops]: Meluncurkan & Memvalidasi di Dunia Nyata desain Compounding Loop Positif: merancang siklus penguatan kecil dalam belajar/kesehatan/karya yang menggulung hasil besar dalam 6–12 bulan. (Output nyata teruji di lapangan sebagai bukti penguasaan Feedback Loops)."
        ],
        "criteria": "Memahami keras-lembutnya permainan penguatan, penyeimbangan, dan jeda waktu sehingga tidak terjebak pada solusi instan yang merusak sistem."
      },
      {
        "title": "Systems Modeling",
        "whatIs": "Kemampuan memodelkan keseluruhan sistem yang kompleks (stocks, flows, batas sistem, titik macet yang menghambat kerja, dan insentif aktor) untuk menemukan titik ungkit tertinggi (high-leverage points) yang mengubah perilaku sistem secara berkelanjutan.",
        "howToUse": "Petakan persediaan/akumulasi (stocks), laju aliran masuk-keluar (flows), aturan informasi, dan struktur insentif di dalam sistem; lalu arahkan intervensi pada titik ungkit struktural (aturan/tujuan sistem) alih-alih sekadar mendorong angka di hilir.",
        "targetWorks": [
          "Tugas Besar 1 [Systems Modeling]: Membangun & Mengimplementasikan 1 Model Sistem Komprehensif (Stock-and-Flow / Systems Architecture Map) lengkap dengan simulasi skenario perubahan variabel dan prediksi perilakunya. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Modeling).",
          "Tugas Besar 2 [Systems Modeling]: Merancang, Menguji & Mendokumentasikan analisis Titik Ungkit (Donella Meadows Leverage Points Analysis): menemukan 2 intervensi berbiaya rendah yang mengubah hasil sistem secara mendasar. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Modeling).",
          "Tugas Besar 3 [Systems Modeling]: Meluncurkan & Memvalidasi di Dunia Nyata evaluasi Pasca-Intervensi Sistem: mengukur apakah perubahan struktural yang kamu terapkan berhasil menghilangkan masalah berulang tanpa menciptakan masalah baru. (Output nyata teruji di lapangan sebagai bukti penguasaan Systems Modeling)."
        ],
        "criteria": "Mampu melihat hutan sekaligus pepohonannya, mengintervensi pada titik ungkit yang tepat, dan merancang sistem yang seimbang."
      }
    ],
    "Philosophy": [
      {
        "title": "Conceptual Analysis",
        "whatIs": "Kemampuan menjernihkan makna dari konsep-konsep besar dan abstrak (seperti keadilan, kebenaran, kebahagiaan, tanggung jawab, kebebasan, atau keberhasilan) dengan menguji batas definisi serta implikasinya.",
        "howToUse": "Ketika sebuah istilah besar digunakan dalam diskusi atau tujuan hidup, uraikan unsur-unsur pembentuknya, uji dengan kasus batas (borderline cases), dan bedakan makna esensialnya dari asosiasi populer yang dangkal.",
        "targetWorks": [
          "Tugas Besar 1 [Conceptual Analysis]: Membangun & Mengimplementasikan 3 Lembar Bedah Konsep Filosofis (Conceptual Analysis Papers) yang mengurai definisi, syarat perlu/cukup, dan kasus batas dari konsep penting dalam hidupmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Conceptual Analysis).",
          "Tugas Besar 2 [Conceptual Analysis]: Merancang, Menguji & Mendokumentasikan kamus Definisi Kerja Pribadi: merumuskan arti tegas dari 5 kata kunci kompas hidupmu (misal: \"Sukses\", \"Cukup\", \"Adil\", \"Bijak\", \"Melayani\") agar tidak terombang-ambing standar orang lain. (Output nyata teruji di lapangan sebagai bukti penguasaan Conceptual Analysis).",
          "Tugas Besar 3 [Conceptual Analysis]: Meluncurkan & Memvalidasi di Dunia Nyata dialog Klarifikasi Istilah: membedah 1 perdebatan yang ternyata hanya terjadi karena kedua pihak memakai definisi kata yang berbeda. (Output nyata teruji di lapangan sebagai bukti penguasaan Conceptual Analysis)."
        ],
        "criteria": "Konsep abstrak menjadi jernih, tegas batasannya, dan dapat diuji implikasi praktisnya dalam tindakan nyata."
      },
      {
        "title": "Philosophical Inquiry",
        "whatIs": "Kemampuan menyelidiki pertanyaan-pertanyaan mendasar tentang nilai (etika), makna, dan hakikat realitas dengan membandingkan berbagai aliran pemikiran secara adil, koheren, dan jujur terhadap keberatan lawan (steel-manning).",
        "howToUse": "Pelajari argumen terbaik dari minimal dua posisi filosofis yang berbeda terhadap satu persoalan, bangun versi terkuat dari posisi yang tidak kamu setujui (steel-man), lalu uji kekuatan dan kelemahan masing-masing secara adil.",
        "targetWorks": [
          "Tugas Besar 1 [Philosophical Inquiry]: Membangun & Mengimplementasikan 2 Esai Penyelidikan Filosofis yang membandingkan dua posisi/kerangka etika berbeda terhadap satu dilema nyata dengan mewakili posisi lawan secara adil. (Output nyata teruji di lapangan sebagai bukti penguasaan Philosophical Inquiry).",
          "Tugas Besar 2 [Philosophical Inquiry]: Merancang, Menguji & Mendokumentasikan analisis Dilema Etika Multi-Kerangka: membedah 1 keputusan sulit menggunakan lensa Etika Kebajikan (Virtue Ethics), Kewajiban (Deontologi), dan Dampak (Konsekuensialisme). (Output nyata teruji di lapangan sebagai bukti penguasaan Philosophical Inquiry).",
          "Tugas Besar 3 [Philosophical Inquiry]: Meluncurkan & Memvalidasi di Dunia Nyata catatan Pertanyaan Keberatan Terkuat (Strongest Objection Log): menuliskan keberatan paling berat terhadap pandangan pribadimu beserta tanggapan jujurmu. (Output nyata teruji di lapangan sebagai bukti penguasaan Philosophical Inquiry)."
        ],
        "criteria": "Argumen tersusun koheren, posisi lawan diwakili secara adil dan terhormat (bukan karikatur/memelintir argumen lawan agar mudah diserang), serta penalaran etis tajam."
      },
      {
        "title": "Philosophical Synthesis",
        "whatIs": "Kematangan merajut pandangan dunia (worldview), prinsip etika, logika, dan tujuan hidup menjadi satu kesatuan filsafat hidup yang koheren, rendah hati, serta nyata dihidupi dalam setiap pilihan sehari-hari.",
        "howToUse": "Selaraskan apa yang kamu yakini tentang kebenaran tertinggi (cara menguji kebenaran informasi & iman), apa yang bernilai untuk diperjuangkan (etika & aksiologi), dan bagaimana kamu bekerja/berelasi setiap hari sehingga tidak ada jurang antara pemikiran dan tindakan.",
        "targetWorks": [
          "Tugas Besar 1 [Philosophical Synthesis]: Membangun & Mengimplementasikan dokumen Sintesis Filsafat Hidup & Kerangka Etika Pribadi (Personal Philosophy & Worldview Treatise) yang mengikat seluruh 10 domain di dalam The Backpack. (Output nyata teruji di lapangan sebagai bukti penguasaan Philosophical Synthesis).",
          "Tugas Besar 2 [Philosophical Synthesis]: Merancang, Menguji & Mendokumentasikan kajian Lintas Domain: membedah bagaimana pandangan filosofismu menuntun cara kamu berkarya di Engineering, Bisnis, Seni, Relasi, dan Pelayanan. (Output nyata teruji di lapangan sebagai bukti penguasaan Philosophical Synthesis).",
          "Tugas Besar 3 [Philosophical Synthesis]: Meluncurkan & Memvalidasi di Dunia Nyata refleksi Ujian Integritas Nyata: catatan bagaimana kerangka filosofis dan imanmu menopang keputusan yang benar ketika menghadapi godaan jalan pintas atau krisis. (Output nyata teruji di lapangan sebagai bukti penguasaan Philosophical Synthesis)."
        ],
        "criteria": "Pikiran, nilai, dan tindakan hidup menyatu secara utuh, menghadirkan kejernihan batin, keteguhan etis, dan kebijaksanaan yang membumi."
      }
    ]
  }
};

      // Build flat `nodes` (3 per branch) with deep Per-Tier specifications (`whatIs`, `howToUse`, `targetWorks`, `criteria`) + Constellation geometry
      const LIFELONG_INDICATORS_132 = {"wpda": {"0": {"1": ["Membaca minimal 1 pasal Alkitab per hari secara berurutan selama ≥14 hari tanpa melompat-lompat ayat.", "Mampu menceritakan kembali isi utama pasal yang baru dibaca dalam 3–5 kalimat dengan bahasa sendiri.", "Menandai tokoh utama, kata kunci yang diulang, serta latar tempat pada minimal 10 pasal."], "2": ["Menyelesaikan pembacaan minimal 3 kitab utuh dari awal sampai akhir lengkap dengan catatan ringkasan per pasal.", "Menjaga konsistensi baca Alkitab harian selama ≥60 hari berturut-turut (minimal 15–20 menit/hari).", "Mampu mengenali alur cerita besar (penciptaan, kejatuhan, perjanjian, penebusan) saat membaca suatu kitab."], "3": ["Menyelesaikan pembacaan seluruh Alkitab (66 kitab, Kejadian–Wahyu) minimal 1 kali secara utuh dan terjadwal.", "Mampu menyebutkan garis besar isi dari minimal 30 kitab Alkitab di luar kepala tanpa membuka daftar isi.", "Menghafal minimal 30 ayat kunci lintas Perjanjian Lama dan Baru beserta konteks pasalnya."], "4": ["Khatam membaca seluruh Alkitab ≥3 kali menggunakan sudut pandang baca berbeda (kronologis sejarah, tematis, dan kanonik).", "Memiliki buku pemetaan pribadi berisi ringkasan 1 halaman untuk masing-masing dari 66 kitab Alkitab.", "Mampu langsung menemukan letak kitab dan pasal dari suatu kisah atau kutipan ayat dalam waktu singkat."], "5": ["Menghidupi disiplin membaca Alkitab seumur hidup (≥7–10 kali khatam penuh lintas tahun) hingga teks Firman menyatu dalam ingatan.", "Menghafal di luar kepala ≥150 ayat atau beberapa pasal utuh (seperti Mazmur dan surat-surat pendek) dengan penghayatan penuh.", "Menjadi pembimbing utama yang membantu puluhan orang membangun kebiasaan membaca Alkitab sampai tuntas."]}, "1": {"1": ["Memahami 3 pertanyaan dasar penggalian teks: Apa yang tertulis? Apa artinya bagi pendengar asli? Apa penerapannya bagiku?", "Menyelesaikan minimal 5 catatan bedah perikop dengan memeriksa ayat sebelum dan sesudahnya (konteks dekat).", "Tidak mencabut 1 ayat secara terpisah untuk membenarkan pendapat pribadi di luar maksud pasalnya."], "2": ["Membandingkan minimal 2–3 versi terjemahan Alkitab (misal: TB, BIMK, Inggris) saat mempelajari ayat yang sulit.", "Menyelesaikan minimal 15 studi perikop tertulis lengkap dengan latar belakang penulis dan situasi penerima surat/kitab.", "Mampu merumuskan 1 kalimat gagasan utama penulis (big idea) dari setiap perikop yang dipelajari secara akurat."], "3": ["Lancar menggunakan alat bantu kamus kata asli (Ibrani/Yunani dasar) dan peta/latar sejarah Alkitab secara tepat.", "Menyelesaikan ≥35 kajian eksposisi pasal demi pasal yang jernih, mendalam, dan setia pada alur argumen teks.", "Mampu menjelaskan ayat-ayat yang sering disalahpahami populer dengan argumen konteks yang meyakinkan."], "4": ["Menuntaskan penggalian tafsir ayat demi ayat (verse-by-verse) untuk minimal 3 kitab utuh secara tertulis.", "Mampu membandingkan berbagai pandangan tafsiran dari komentari tepercaya secara objektif dan rendah hati.", "Catatan penggalian teksnya dipakai sebagai rujukan belajar oleh rekan-rekan pengajar atau pemimpin kelompok kecil."], "5": ["Mencapai ketajaman penafsiran teks tingkat master yang teruji selama puluhan tahun menggali puluhan kitab Alkitab.", "Melahirkan karya panduan studi atau tafsiran kitab yang menjadi warisan belajar lintas generasi.", "Melatih dan mencetak banyak penggali Firman baru yang jujur, teliti, dan setia pada kebenaran teks."]}, "2": {"1": ["Mengenali minimal 5 jenis gaya bahasa/sastra di Alkitab (sejarah, puisi/mazmur, hikmat/amsal, nubuatan, surat pengajaran).", "Memahami perbedaan antara perumpamaan/kiasan dengan kalimat perintah langsung pada minimal 10 contoh ayat.", "Menyelesaikan pembacaan minimal 1 buku panduan cara menafsirkan Alkitab (hermeneutika dasar)."], "2": ["Mampu menerapkan aturan tafsir yang sesuai untuk tiap genre (misal: tidak memutlakkan Amsal sebagai janji mekanis tanpa syarat).", "Menyelesaikan minimal 12 studi tematis lintas Perjanjian Lama dan Perjanjian Baru secara utuh.", "Mampu menarik jembatan penerapan yang relevan untuk masalah hidup zaman sekarang tanpa mengubah makna asli ayat."], "3": ["Menguasai kerangka teologi biblika: melihat bagaimana setiap janji dan bayangan di Perjanjian Lama digenapi di dalam Kristus.", "Menyelesaikan ≥25 naskah kajian hermeneutika yang menjawab persoalan etika dan budaya modern secara alkitabiah.", "Dapat langsung mendeteksi kesalahan logika penafsiran dalam sebuah khotbah atau artikel rohani dengan tenang dan santun."], "4": ["Mampu merancang modul pelatihan cara menafsirkan Alkitab yang membuat jemaat awam bisa belajar mandiri dengan benar.", "Telah mengajar atau memfasilitasi ≥40 sesi bedah hermeneutika dan teologi lintas kitab dengan dampak pemahaman yang kuat.", "Menjadi tempat bertanya rujukan ketika komunitas menghadapi perdebatan penafsiran ayat-ayat yang rumit."], "5": ["Mencapai kematangan hermeneutika seumur hidup: mampu melihat keutuhan simfoni seluruh kebenaran Firman di luar kepala.", "Karya tulis dan kerangka pengajarannya menjaga kemurnian pengajaran komunitas/gereja selama bertahun-tahun.", "Mewariskan tradisi pembacaan Firman yang sehat, dewasa, dan penuh kasih kepada generasi penerus."]}, "3": {"1": ["Mampu menceritakan kesaksian perubahan hidup atau berkat Firman pribadi secara jujur dan singkat (3–5 menit) tanpa menggurui.", "Berani membagikan refleksi saat teduh atau penguatan iman kepada minimal 3 teman secara tulus.", "Lebih banyak mendengarkan cerita pergumulan teman terlebih dahulu sebelum membagikan ayat penguatan."], "2": ["Mampu memimpin renungan singkat (10–15 menit) di kelompok kecil dengan 1 pesan utama yang sederhana dan menyentuh hati.", "Telah membagikan renungan atau kesaksian iman di minimal 10 kesempatan pertemuan atau media tulisan.", "Mampu menjawab pertanyaan dasar teman seputar iman dengan bahasa sehari-hari yang hangat (tanpa istilah rohani yang membingungkan)."], "3": ["Terbiasa membangun percakapan rohani yang alami di meja makan, tempat kerja, atau tongkrongan tanpa terasa memaksa.", "Telah mendampingi minimal 15 teman dalam obrolan hati ke hati yang menuntun mereka menemukan pengharapan di dalam Tuhan.", "Memiliki kepekaan waktu yang tepat: tahu kapan harus berbicara membagikan kebenaran dan kapan cukup hadir mendoakan."], "4": ["Mampu mengomunikasikan pesan Injil dan kebenaran iman secara jernih kepada audiens lintas latar belakang maupun yang skeptis.", "Memiliki rekam jejak ≥50 sesi berbagi iman/renungan publik yang membawa banyak orang mengalami pemulihan batin.", "Melatih minimal 10 rekan lain agar berani dan luwes membagikan kesaksian hidup mereka."], "5": ["Kehidupan dan tutur katanya sehari-hari menjadi surat hidup yang memancarkan kasih dan pengharapan selama puluhan tahun.", "Telah menyentuh ratusan jiwa lewat komunikasi rohani yang tulus, rendah hati, dan penuh kuasa pengubahan.", "Menjadi teladan komunikator iman seumur hidup yang menyatukan perkataan yang hidup dengan perbuatan kasih yang nyata."]}, "4": {"1": ["Mampu menyusun kerangka bahan ajar 1 halaman (Pembuka, Penggalian Teks, Contoh Nyata, Penerapan) yang rapi.", "Menyampaikan pengajaran atau memandu diskusi Alkitab berdurasi 20–30 menit minimal 3 kali sampai tuntas.", "Menyiapkan minimal 3 pertanyaan diskusi terbuka yang memancing peserta ikut berpikir dan bicara."], "2": ["Mampu mengajar dengan struktur yang jelas dan ilustrasi kehidupan nyata sehingga pendengar tidak mengantuk.", "Telah mengajar atau memimpin studi Alkitab kelompok minimal 12 kali dengan umpan balik yang baik dari peserta.", "Dapat menjelaskan konsep ajaran iman yang cukup berat menjadi bahasa yang mudah dicerna oleh remaja maupun orang baru."], "3": ["Menguasai seni mengajar interaktif dan khotbah ekspositoris (30–45 menit) yang setia pada Alkitab sekaligus mengubah perilaku.", "Memiliki jam terbang ≥30 kali mengajar/berkhotbah di berbagai kelas pembinaan atau ibadah komunitas.", "Mampu menangani pertanyaan sulit atau tanggapan kritis di tengah kelas dengan tenang, bijak, dan alkitabiah."], "4": ["Mampu merancang kurikulum pengajaran berseri (4–12 pertemuan) lengkap dengan buku panduan peserta dan pengajar.", "Telah mengajar di ≥75 sesi pembinaan dan berhasil melatih minimal 5–10 pengajar/pembicara baru hingga mandiri.", "Pengajarannya dikenal tajam membedah Firman sekaligus hangat menyentuh kebutuhan praktis jemaat."], "5": ["Mencapai tingkat guru Firman dan pengkhotbah master seumur hidup dengan ratusan jam terbang pengajaran lintas dekade.", "Kurikulum, rekaman, dan tulisan pengajarannya menjadi bahan pembinaan yang terus dipakai oleh banyak komunitas.", "Melahirkan generasi pengajar Firman yang berintegritas tinggi dan berdampak luas."]}, "5": {"1": ["Memiliki komitmen berjalan bersama 1 rekan tumbuh/adik rohani dengan bertemu rutin (minimal 2 minggu sekali) selama ≥2 bulan.", "Saling mendoakan, menanyakan kabar saat teduh, dan saling mengingatkan dalam kebaikan secara tulus.", "Menjaga kerahasiaan cerita dan pergumulan pribadi rekan yang didampingi 100% aman."], "2": ["Membimbing minimal 2–3 orang melewati bahan pemuridan dasar sampai selesai (3–6 bulan pertemuan teratur).", "Membantu adik rohani membangun kebiasaan baca Alkitab mandiri, doa harian, dan ketaatan praktis.", "Memberikan teladan nyata lewat cara hidup sehari-hari, bukan hanya lewat nasihat kata-kata."], "3": ["Berhasil memuridkan minimal 5–8 orang secara mendalam selama ≥1–2 tahun hingga karakter dan iman mereka bertumbuh dewasa.", "Melatih murid yang dibimbingnya hingga mereka mulai berani melayani dan membimbing orang baru lagi (multiplikasi).", "Setia mendampingi murid melewati masa-masa sulit (kegagalan, krisis keluarga/karier, atau keraguan iman) dengan sabar."], "4": ["Mencapai multiplikasi pemuridan lintas generasi: murid yang dibimbingnya telah melahirkan murid generasi ke-2 dan ke-3.", "Membangun sistem dan budaya pemuridan sehat di dalam komunitas/gereja yang melibatkan ≥20–30 pembina aktif.", "Menjadi mentor bagi para pembina rohani dalam menangani kasus-kasus penggembalaan yang pelik."], "5": ["Menghidupi panggilan pemuridan seumur hidup selama puluhan tahun yang melahirkan pohon keluarga rohani hingga 4 generasi.", "Puluhan pemimpin pelayanan dan profesional berintegritas lahir dari sentuhan pendampingan pribadinya.", "Meninggalkan warisan gerakan pemuridan yang terus bertumbuh mandiri melampaui zamannya."]}, "6": {"1": ["Menghafal lirik/akor lagu ibadah sebelum latihan dimulai sehingga tidak terpaku menatap kertas saat melayani.", "Mampu bernyanyi atau bermain instrumen dengan tempo yang stabil dan nada yang selaras dalam minimal 5 kali latihan/ibadah.", "Menyiapkan hati dengan doa pribadi sebelum naik melayani, menyadari ibadah bukan ajang pamer diri."], "2": ["Menguasai dinamika musik ibadah (kapan bermain lembut saat doa/refleksi, kapan mengangkat semangat jemaat) di ≥15 kali pelayanan.", "Mampu mendengarkan dan menyatu dengan pemain musik/penyanyi lain sehingga menghasilkan bunyi tim yang harmonis.", "Tetap tenang dan fokus menyembah Tuhan meskipun terjadi kendala teknis suara di panggung."], "3": ["Memiliki kematangan teknis dan penghayatan rohani yang tinggi dalam ≥40 kali pelayanan ibadah lintas suasana.", "Mampu mengalir secara spontan (mengikuti doa, pembacaan ayat, atau lagu baru/spontan) dengan akor dan kepekaan yang tepat.", "Kemampuan bermusik/vokalnya tidak mendominasi, melainkan menolong seluruh jemaat lebih mudah mengarahkan hati kepada Tuhan."], "4": ["Menguasai aransemen musik ibadah dan standar keunggulan teknis tingkat lanjut untuk ibadah raya maupun rekaman.", "Telah melayani di ≥100 sesi ibadah/konser rohani dengan konsistensi kerendahan hati dan persiapan yang prima.", "Melatih anggota tim musik/vokal baru dalam hal teknik sekaligus sikap hati seorang pelayan ibadah."], "5": ["Mencapai tingkat pelayan musik/pujian master seumur hidup di mana keterampilan seni tertinggi dipersembahkan murni bagi kemuliaan Tuhan.", "Dedikasi puluhan tahunnya menjadi standar teladan tentang perpaduan antara keunggulan musikal (skill) dan kepekaan rohani (heart).", "Menginspirasi dan membina ratusan pelayan ibadah lintas generasi."]}, "7": {"1": ["Mampu menyusun daftar urutan lagu (songlist 3–4 lagu) yang memiliki tema yang nyambung dengan pesan firman/ibadah.", "Memimpin pujian di kelompok kecil atau persekutuan (5–20 orang) minimal 3 kali dengan sapaan dan doa yang tulus.", "Memberikan aba-aba (kode tangan/hitungan masuk) yang jelas kepada rekan pemusik."], "2": ["Mampu merancang alur ibadah (worship flow) yang mulus dari lagu pembuka, jembatan doa/ayat, hingga lagu respons akhir.", "Memimpin ibadah di minimal 12 pertemuan dengan transisi antar lagu yang tenang dan tidak bertele-tele.", "Mampu memimpin latihan tim sebelum ibadah secara efektif, tepat waktu, dan membangun suasana kompak."], "3": ["Peka membaca suasana rohani jemaat di ruangan dan mampu menyesuaikan alur pujian tanpa kehilangan keteraturan.", "Memiliki jam terbang ≥30 kali memimpin ibadah (Worship Leader / Music Director) dengan dampak hadirat yang teduh dan kuat.", "Mampu menyelaraskan pesan pengkhotbah, tim musik, dan tim multimedia menjadi satu kesatuan ibadah yang utuh."], "4": ["Menguasai kepemimpinan ibadah berskala besar (ibadah raya, retret, konferensi) serta pembinaan para pemimpin pujian muda.", "Telah memimpin ≥75 sesi ibadah dan membimbing minimal 5–8 pemimpin pujian/pengarah musik baru hingga siap melayani mandiri.", "Mampu menciptakan lagu pujian/doa baru atau mengaransemen liturgi ibadah yang segar dan alkitabiah."], "5": ["Mencapai kematangan pemimpin ibadah seumur hidup yang membawa ribuan jemaat berjumpa dengan Tuhan selama puluhan tahun.", "Kepemimpinannya di atas maupun di luar mimbar selaras penuh dalam kekudusan, kerendahan hati, dan kasih.", "Mewariskan budaya penyembahan yang sejati (dalam roh dan kebenaran) kepada generasi pelayan berikutnya."]}, "8": {"1": ["Hadir tepat waktu di setiap jadwal latihan dan pelayanan serta ikut membantu merapikan alat sebelum dan sesudah ibadah.", "Menjaga hubungan yang rukun, saling mendoakan, dan bebas dari sikap saling meremehkan di dalam tim pelayanan.", "Setia melayani di tugas kecil maupun di balik layar selama minimal 3 bulan berturut-turut."], "2": ["Aktif memperhatikan dan menyemangati anggota tim pelayanan yang baru bergabung atau sedang mengalami kelelahan.", "Ikut mengoordinasikan jadwal pelayanan, pembagian lagu, atau kebutuhan teknis tim selama minimal 6 bulan.", "Mampu memberi dan menerima evaluasi pelayanan dengan hati yang terbuka demi pertumbuhan bersama."], "3": ["Mampu menggembalakan satu tim pelayanan ibadah (musik, vokal, multimedia/produksi) selama ≥1–2 tahun dengan sehat dan kompak.", "Membangun sistem audisi, pelatihan berkala, dan persekutuan doa tim sehingga tim tidak hanya berkumpul saat latihan teknis.", "Berhasil meregenerasi minimal 3–5 pelayan baru setiap tahunnya untuk masuk ke dalam tim pelayanan."], "4": ["Menguasai tata kelola departemen pelayanan ibadah secara menyeluruh (kurikulum pembinaan rohani, standar teknis, dan perawatan peralatan).", "Membina puluhan pelayan ibadah selama ≥3–5 tahun tanpa ada perpecahan tim atau kejenuhan rohani (burnout) massal.", "Melahirkan karya lagu/album pujian komunitas atau gerakan doa penyembahan yang memberkati gereja/komunitas lain."], "5": ["Mencapai tingkat bapa/ibu pembina pelayanan ibadah seumur hidup yang mendedikasikan puluhan tahun merawat rumah Tuhan.", "Telah melahirkan puluhan pemimpin ibadah, musisi gereja, dan pelayan setia lintas generasi.", "Warisan sistem pelayanan dan teladan hatinya menjadi fondasi kokoh bagi kehidupan ibadah komunitas dalam jangka panjang."]}, "9": {"1": ["Memiliki waktu khusus setiap hari (minimal 10–15 menit pagi/malam) untuk berdoa dan hening di hadapan Tuhan selama ≥21 hari.", "Mencatat pokok doa dan ucapan syukur harian di buku jurnal rohani minimal 3 kali seminggu.", "Berlatih mengendalikan gawai (puasa media sosial/layar selama jam saat teduh) agar fokus tidak terpecah."], "2": ["Menjalankan ritme disiplin rohani (saat teduh harian, doa syafaat, puasa berkala, dan ibadah mingguan) secara stabil selama ≥90 hari.", "Melakukan pemeriksaan batin mingguan (evaluasi diri jujur di hadapan Tuhan) untuk segera membereskan pelanggaran atau kepahitan.", "Mengambil waktu retret pribadi (hening 2–4 jam tanpa gangguan) minimal 1 kali setiap bulan."], "3": ["Disiplin rohani telah berakar menjadi gaya hidup alami selama ≥1–2 tahun penuh, baik saat suasana hati sedang bersemangat maupun sedang lelah.", "Mempraktikkan disiplin pelayanan tersembunyi dan kemurahan hati (memberi/menolong tanpa diketahui orang lain) secara rutin.", "Mampu menjaga ketenangan batin dan tidak kehilangan kebiasaan doa meskipun sedang berada di tengah jadwal kerja/studi yang sangat padat."], "4": ["Memiliki daya tahan rohani yang teruji selama ≥3–5 tahun melewati musim kesepian, tekanan berat, atau ujian hidup tanpa mundur.", "Mampu memandu retret keheningan dan membimbing ≥10 orang membangun ritme disiplin rohani yang sehat (rule of life).", "Buah-buah penguasaan diri, kesederhanaan, dan kedamaian batin terlihat nyata oleh orang-orang terdekat di rumah."], "5": ["Mencapai kedalaman disiplin rohani seumur hidup (puluhan tahun berjalan bersama Tuhan) yang tenang, teguh, dan tak tergoyahkan.", "Seluruh aktivitas harian—bekerja, beristirahat, maupun bercengkerama—mengalir dalam kesadaran hadirat Tuhan yang terus-menerus.", "Menjadi teladan hidup kudus dan disiplin batin yang menginspirasi banyak generasi pencari Tuhan."]}, "10": {"1": ["Tidak terburu-buru mengambil keputusan penting saat sedang emosi marah, takut, atau tergiur keuntungan instan.", "Menguji setiap keinginan atau saran penting dengan bertanya: 'Apakah ini selaras dengan kebenaran Firman Tuhan?'", "Mencatat minimal 5 pergumulan keputusan pribadi dan meminta pertimbangan dari rekan/mentor rohani yang dewasa."], "2": ["Mampu membedakan antara dorongan ego/ambisi pribadi, tekanan ikut-ikutan tren, dan panggilan pelayanan yang murni.", "Menggunakan kerangka pengujian rohani (kebenaran Firman, damai sejahtera batin, konfirmasi nasihat bijak, dan keadaan) pada ≥10 keputusan penting.", "Peka mengenali pengajaran atau konten rohani yang terdengar indah di luar namun menyimpang dari inti kebenaran Alkitab."], "3": ["Memiliki kepekaan batin yang tajam dalam membaca musim kehidupan serta mengenali akar masalah rohani di balik suatu persoalan.", "Telah mengambil ≥25 keputusan besar hidup/pelayanan melalui proses doa dan pengujian yang matang dengan buah jangka panjang yang baik.", "Sering menjadi teman diskusi tepercaya bagi rekan-rekan yang sedang bingung menentukan arah panggilan atau pilihan sulit."], "4": ["Menguasai kepekaan rohani (spiritual discernment) tingkat lanjut untuk mendampingi komunitas/organisasi melewati masa krisis atau persimpangan jalan.", "Mampu melihat celah bahaya moral atau kompromi karakter jauh sebelum hal itu meledak menjadi skandal/kerusakan.", "Telah membimbing ≥30 individu/tim dalam menemukan kehendak Tuhan di tengah situasi yang serba abu-abu."], "5": ["Mencapai ketajaman mata rohani tingkat bapa/ibu rohani yang mampu membedakan roh, motivasi hati, dan arah zaman dengan sangat jernih.", "Nasihat dan pertimbangannya selama puluhan tahun terbukti menyelamatkan banyak orang dan komunitas dari langkah yang keliru.", "Mewariskan teladan kepekaan hati yang lembut terhadap suara Tuhan sekaligus tegas terhadap kepalsuan."]}, "11": {"1": ["Mau mengakui kesalahan dengan rendah hati, meminta maaf terlebih dahulu, dan menerima teguran tanpa membela diri berlebihan.", "Memilih merespons orang yang menjengkelkan dengan perkataan yang lembut daripada membalas dengan kemarahan (minimal di 5 kejadian nyata).", "Menuliskan pelajaran hikmat dari setiap kegagalan atau masalah yang baru dilewati."], "2": ["Mampu menjaga integritas yang sama antara kehidupan di depan umum dan kehidupan saat sendirian (tidak bermuka dua).", "Menunjukkan kesabaran dan kedamaian hati saat rencana hidup tidak berjalan sesuai keinginan pribadi.", "Mampu memberikan saran yang menyejukkan dan adil ketika teman sedang menghadapi pertikaian atau kebingungan."], "3": ["Memadukan pengetahuan kebenaran yang dalam dengan kelembutan kasih dalam keseharian selama ≥2–3 tahun secara konsisten.", "Mampu mengambil keputusan yang benar dan adil di tengah dilema etika meskipun harus menanggung kerugian pribadi.", "Dikenal di keluarga, tempat kerja, dan komunitas sebagai pribadi yang teduh, dapat dipercaya, dan membawa damai."], "4": ["Memiliki hikmat praktis yang matang dalam membimbing keluarga, organisasi, dan generasi muda melewati badai kehidupan.", "Telah menjadi penasihat kehidupan (spiritual mentor/elder) bagi puluhan orang selama bertahun-tahun dengan buah pemulihan nyata.", "Hidupnya bebas dari cinta uang, gila hormat, maupun kepahitan masa lalu."], "5": ["Mencapai mahkota kebijaksanaan rohani seumur hidup (sage wisdom): rambut memutih dalam jalan kebenaran, kasih, dan kemurnian hati.", "Kehadirannya sendiri sudah menjadi berkat keteduhan dan kompas moral bagi komunitas luas lintas generasi.", "Menuntaskan perjalanan hidup dengan nama baik yang harum dan warisan hikmat yang tak lekang oleh waktu."]}}, "physical-wellness": {"0": {"1": ["Menguasai postur gerak dasar beban tubuh dengan punggung netral: mampu melakukan ≥12 push-up penuh, ≥20 squat, dan ≥45 detik plank.", "Menyelesaikan minimal 10 sesi latihan pengondisian kekuatan dasar (2–3× seminggu) tanpa rasa sakit pada sendi lutut atau bahu.", "Memahami cara mengaktifkan otot perut (core bracing) dan mengatur napas (buang napas saat mendorong/mengangkat) di luar kepala."], "2": ["Mampu melakukan ≥25 push-up bersih, ≥5 pull-up (atau chin-up penuh), ≥35 bodyweight squat, dan ≥90 detik plank dengan postur rapi.", "Menjaga konsistensi latihan kekuatan dasar minimal 3× seminggu selama ≥8 minggu berturut-turut (≥24 sesi selesai).", "Mampu melakukan pemanasan sendi dinamis 5–10 menit secara mandiri sebelum mulai mengangkat beban."], "3": ["Mencapai kebugaran kekuatan tubuh menengah-mahir: ≥12 pull-up murni, ≥45 push-up dalam 1 set, dan tahan duduk squat/wall-sit ≥2 menit.", "Konsisten berlatih selama ≥6 bulan (≥75 sesi latihan) dengan keseimbangan kekuatan tubuh bagian atas, tengah (core), dan kaki.", "Mampu langsung merasakan dan mengoreksi sendiri posisi tubuh ketika postur angkatan mulai miring atau goyah."], "4": ["Menguasai kontrol kekuatan kalistenik/kondisi fisik lanjut: mampu melakukan ≥18–20 pull-up, pistol squat (squat 1 kaki) ≥5 rep per kaki, atau handstand push-up.", "Mempertahankan kondisi otot yang kuat, padat, dan bebas cedera selama ≥2 tahun latihan disiplin tanpa putus.", "Mampu memandu pemula memperbaiki postur gerak dasar (push, pull, squat, hinge) hanya dengan sekali mengamati gerakan mereka."], "5": ["Mencapai fondasi kekuatan fisik tingkat master seumur hidup: tubuh tetap kokoh, tegap, dan kuat melampaui standar usianya selama ≥5–10 tahun.", "Memiliki rekam jejak ≥500 sesi latihan kekuatan lintas tahun dengan kesehatan sendi yang tetap prima.", "Menjadi panutan kebugaran kekuatan alami yang menginspirasi keluarga dan komunitas untuk rutin melatih otot."]}, "1": {"1": ["Memahami prinsip tambah beban bertahap (progressive overload): menaikkan berat beban, jumlah repetisi, atau jumlah set secara terukur.", "Mencatat buku log latihan (nama gerakan, berat beban kg, repetisi, dan set) pada minimal 12 sesi latihan berturut-turut.", "Mampu menentukan beban kerja yang pas (menyisakan 2–3 repetisi cadangan sebelum otot gagal/RIR 2) dengan aman."], "2": ["Berhasil menaikkan kapasitas angkatan utama sebesar ≥15–25% dari titik awal (baseline) dalam program 8–12 minggu.", "Mencapai tolok ukur beban dasar: Squat ≥0,8× berat badan, Deadlift ≥1× berat badan, dan Bench/Overhead Press yang stabil.", "Disiplin mematuhi waktu istirahat antar set (60–120 detik) dan tidak menaikkan beban secara nekat yang merusak postur."], "3": ["Mencapai standar kekuatan menengah-mahir: Bench Press ≥1× berat badan, Squat ≥1,25× berat badan, dan Deadlift ≥1,5× berat badan.", "Menjalankan siklus program peningkatan beban terstruktur selama ≥1 tahun (≥120 sesi tercatat) lengkap dengan minggu pemulihan (deload week).", "Mampu menembus fase mentok (plateau) dengan mengubah variasi gerakan, tempo angkatan, atau volume set secara tepat."], "4": ["Mencapai standar kekuatan tingkat tinggi: Squat ≥1,6× berat badan, Deadlift ≥2× berat badan, atau Bench Press ≥1,25× berat badan secara bersih.", "Berhasil menjaga progres kekuatan jangka panjang selama ≥3 tahun tanpa mengalami cedera otot robek atau saraf terjepit.", "Mampu menyusun program peningkatan beban 12 minggu yang dipersonalisasi dan terbukti berhasil menaikkan kekuatan rekan latihan."], "5": ["Mencapai penguasaan progresi kekuatan tingkat master (lifelong strength athlete): puluhan siklus latihan yang terukur selama ≥5–10 tahun.", "Memahami respons adaptasi otot dan saraf tubuhnya sendiri di luar kepala pada setiap musim kehidupan.", "Mewariskan metode latihan beban yang cerdas, terukur, dan aman bagi generasi penggiat kebugaran berikutnya."]}, "2": {"1": ["Mengenali perbedaan antara otot kiri dan kanan yang belum seimbang kekuatannya serta mulai melatihnya dengan gerakan satu sisi (unilateral).", "Memahami pembagian jadwal latihan mingguan sederhana (seperti Full Body 3× seminggu atau Upper/Lower split).", "Mampu mengatur asupan protein harian dasar dan tidur yang cukup untuk mendukung pemulihan otot pasca-latihan."], "2": ["Mampu merancang sendiri program latihan kekuatan 4–8 minggu yang menyeimbangkan latihan otot dorong, tarik, kaki, dan inti tubuh.", "Menguasai variasi tempo angkatan (misal: menahan beban turun 3 detik / eccentric) untuk memperkuat tendon dan ligamen.", "Bebas dari ketidakseimbangan postur (bahu bungkuk atau panggul miring) berkat kombinasi latihan beban dan mobilitas selama ≥6 bulan."], "3": ["Mampu menerapkan konsep periodisasi latihan tahunan (fase bangun massa otot/hypertrophy, fase kekuatan murni, dan fase pemeliharaan) di luar kepala.", "Mempertahankan komposisi tubuh yang bugar dan kuat secara konsisten selama ≥2 tahun penuh di tengah kesibukan kerja/studi.", "Dapat memodifikasi latihan secara instan ketika fasilitas alat terbatas (saat bepergian/tanpa gym) tanpa kehilangan kualitas otot."], "4": ["Menguasai integrasi puncak antara kekuatan maksimal, daya ledak (power), dan kelenturan sendi selama ≥4 tahun latihan berkelanjutan.", "Mampu mendiagnosis titik lemah biomekanika gerak (sticking point) pada diri sendiri maupun orang lain dan meresepkan latihan korektifnya.", "Memiliki kebugaran kekuatan menyeluruh yang membuat seluruh aktivitas fisik berat di dunia nyata terasa ringan."], "5": ["Mencapai puncak Physical Mastery seumur hidup: harmoni utuh antara kekuatan otot, ketahanan sendi, dan kemandirian gerak hingga usia lanjut.", "Telah menghidupi disiplin kekuatan fisik selama ≥10 tahun dan menjadi bukti nyata kebugaran jangka panjang (longevity).", "Menjadi mentor utama yang membimbing banyak orang meraih potensi fisik terbaik mereka secara sehat dan berkelanjutan."]}, "3": {"1": ["Mencapai rata-rata ≥6.000–7.500 langkah per hari atau jalan cepat (brisk walk) 30 menit nonstop selama ≥14 hari berturut-turut.", "Mampu berjalan kaki sejauh 3–5 km dengan postur tegap, ayunan langkah ringan, dan napas yang tetap tenang.", "Membiasakan berdiri dan berjalan kaki 5 menit setiap kali sudah duduk bekerja selama 90 menit."], "2": ["Menjaga rata-rata ≥8.000–10.000 langkah per hari secara konsisten selama ≥60 hari penuh dalam catatan spedometer/jam tangan.", "Mampu menyelesaikan jalan cepat sejauh 7–8 km nonstop dalam waktu ≤90 menit tanpa rasa pegal berlebihan di telapak kaki atau betis.", "Menjadikan jalan kaki aktif (naik tangga, jalan pagi/sore) sebagai rutinitas otomatis untuk menyegarkan pikiran."], "3": ["Konsisten mempertahankan ≥10.000 langkah/hari rata-rata bulanan selama ≥6–12 bulan di segala cuaca dan kesibukan.", "Mampu menempuh jalan jauh / trekking ringan sejauh 15–20 km dalam sehari (atau membawa beban ransel ringan) dengan energi yang stabil.", "Detak jantung istirahat menurun ke level yang lebih sehat dan tubuh tidak lagi mudah mengantuk di siang hari."], "4": ["Mampu menuntaskan ekspedisi jalan jauh (long-distance walking / hiking ≥25–35 km dalam sehari atau lintas hari) dengan pemulihan cepat keesokan harinya.", "Memiliki rekam jejak ≥3 juta langkah per tahun selama ≥2–3 tahun berturut-turut sebagai fondasi metabolisme harian.", "Menggerakkan budaya jalan kaki sehat di keluarga atau lingkungan pertemanan secara rutin."], "5": ["Mencapai gaya hidup aktif berjalan kaki seumur hidup (puluhan ribu kilometer ditempuh lintas dekade) dengan kaki dan sendi yang tetap sehat.", "Kemampuan jelajah jalan kakinya tetap prima dan tak kenal lelah hingga usia matang.", "Menjadi teladan kebugaran dasar paling alami yang menjaga kesehatan jantung dan kejernihan pikiran seumur hidup."]}, "4": {"1": ["Mampu berlari santai (jogging) sejauh 3 km nonstop atau berenang 300 m / bersepeda 10 km tanpa berhenti kehabisan napas.", "Menyelesaikan minimal 10 sesi latihan kardio aerobik berdurasi ≥25–30 menit dengan ritme napas yang teratur.", "Memahami konsep lari/kardio Zona 2 (kecepatan di mana kita masih sanggup berbicara kalimat utuh tanpa terengah-engah)."], "2": ["Mampu berlari sejauh 5 km nonstop dalam waktu ≤35 menit (atau berenang 800 m / bersepeda 25 km nonstop) dengan pace yang stabil.", "Menyelesaikan minimal 20 sesi latihan aerobik Zona 2 selama 8 minggu dengan peningkatan jarak maksimal 10% per minggu.", "Detak jantung mampu turun kembali ≥20 bpm dalam waktu 2 menit setelah selesai latihan kardio."], "3": ["Mampu berlari sejauh 10 km nonstop dalam waktu ≤60 menit (atau berenang 1.500 m / bersepeda 50 km nonstop) dengan napas terkontrol.", "Menjaga konsistensi latihan aerobik minimal 150 menit per minggu selama ≥6 bulan penuh tanpa cedera kaki (shin splints/lutut).", "Mampu mempertahankan kecepatan (pace) yang rata dari kilometer pertama hingga kilometer terakhir tanpa kehabisan bensin di awal."], "4": ["Dapat berlari Half Marathon (21,1 km nonstop) dengan nyaman dan waktu finis yang solid (atau bersepeda 100 km / berenang 3 km nonstop).", "Memiliki kapasitas jantung-paru (VO2Max) di kategori Tinggi/Superior dan detak jantung istirahat <60 bpm berkat latihan ≥1,5–2 tahun.", "Menguasai efisiensi gerak dan irama langkah (cadence ~170–180 langkah/menit saat lari) di luar kepala sehingga hemat energi."], "5": ["Mencapai kapasitas aerobik tingkat master seumur hidup: mampu berlari Half Marathon kapan saja atau menuntaskan Full Marathon (42,2 km).", "Mempertahankan mesin aerobik jantung-paru yang sangat bersih dan kuat selama ≥5–10 tahun disiplin kardio tanpa putus.", "Membimbing banyak pelari/penggiat kardio pemula dari tidak kuat lari 1 km hingga berhasil menyentuh garis finis 10K/21K pertama mereka."]}, "5": {"1": ["Memahami perbedaan fungsi latihan kardio lambat berdurasi panjang (long slow distance) dengan latihan cepat berselang-seling (interval/HIIT).", "Mengetahui cara mencukupi minum air dan elektrolit sebelum, saat, dan sesudah latihan kardio yang berkeringat banyak.", "Menyelesaikan minimal 6 sesi latihan kombinasi (aerobik + interval pendek) dengan pemanasan dan pendinginan yang benar."], "2": ["Menerapkan aturan latihan 80/20 (80% porsi latihan santai Zona 2, 20% porsi latihan kecepatan/interval) selama minimal 8 minggu.", "Mampu mengatur strategi pembagian tenaga (negative split: paruh kedua lari/renang justru sedikit lebih cepat dari paruh pertama) pada uji waktu 5K/10K.", "Mengerti cara mengisi bahan bakar karbohidrat (carb-loading sederhana & enerji gel/pisang) untuk sesi olahraga di atas 60–90 menit."], "3": ["Berhasil menuntaskan lari Half Marathon (21,1 km) dengan rekor waktu pribadi (Personal Best) yang terencana atau menyelesaikan latihan daya tahan >2 jam nonstop.", "Menguasai manajemen pace, hidrasi, dan suhu tubuh saat berlatih di cuaca panas/lembap selama ≥1 tahun program terstruktur.", "Tidak pernah mengalami kram parah atau kehabisan energi mendadak (bonking/hitting the wall) berkat perhitungan nutrisi dan pace yang presisi."], "4": ["Mampu menyelesaikan Full Marathon (42,2 km nonstop), Triathlon jarak Olimpiade/Half-Ironman, atau lomba ketahanan lintas alam dengan performa kuat.", "Memiliki rekam jejak ≥2.000 km total jarak lari (atau setara jam kardio) lintas tahun dengan periodisasi puncak lomba (tapering & peaking) yang matang.", "Mampu menyusun program latihan menuju Half/Full Marathon bagi rekan lain lengkap dengan strategi pace per kilometer."], "5": ["Mencapai puncak Endurance Optimization tingkat master: menaklukkan beberapa Full Marathon, Ultra-Marathon (>50 km), atau Ironman lintas tahun.", "Menguasai manajemen energi tubuh tingkat mahaguru di mana ketahanan fisik dan ketenangan mental menyatu selama berjam-jam gerak.", "Menjadi legenda dan mentor daya tahan di komunitasnya yang membuktikan ketangguhan stamina manusia jangka panjang."]}, "6": {"1": ["Mampu melakukan lompat tali (skipping) minimal 50 kali berturut-turut tanpa tersangkut dan berdiri 1 kaki selama 45 detik.", "Menguasai gerakan koordinasi tangan-mata dasar (menangkap/melempar/memantulkan bola dengan tangan kanan maupun kiri).", "Menyelesaikan minimal 10 sesi latihan koordinasi gerak dan keseimbangan dasar."], "2": ["Mampu melakukan lompat tali ≥150–200 kali nonstop dengan variasi langkah kaki serta berdiri 1 kaki dengan mata tertutup selama ≥30 detik.", "Lancar melakukan gerakan olahraga pilihan (dribble basket, pukulan raket, atau jurus bela diri) sambil tetap melihat ke depan (tidak menunduk melihat bola/kaki).", "Mampu mengoordinasikan gerakan tubuh bagian atas dan bawah yang berbeda ritme secara mulus."], "3": ["Memiliki kesadaran posisi tubuh di ruang (proprioception) yang tinggi: mampu menjaga keseimbangan di permukaan tidak rata atau saat terdorong lawan.", "Menguasai keterampilan motorik halus dan kasar di minimal 2 cabang olahraga berbeda dengan gerakan yang luwes (tidak kaku).", "Dapat mempelajari gerakan olahraga atau tarian/ketangkasan baru hanya dalam beberapa kali percobaan."], "4": ["Menguasai koordinasi gerak tingkat atlet: mampu mengeksekusi teknik sulit (seperti tembakan/operan sambil melompat atau gerakan akrobatik dasar) dengan akurasi ≥80%.", "Memiliki keseimbangan antara sisi tubuh dominan dan non-dominan (tangan/kaki kiri hidup dan terkoordinasi baik).", "Mampu melatih koordinasi motorik dan keseimbangan bagi pemula atau rekan satu tim."], "5": ["Mencapai penguasaan koordinasi kinestetik tingkat master: setiap gerakan tubuhnya terlihat sangat efisien, anggun, dan presisi tanpa tenaga terbuang.", "Mempertahankan ketajaman koordinasi saraf-otot, refleks, dan keseimbangan prima selama puluhan tahun.", "Menjadi rujukan dalam seni gerak tubuh yang harmonis dan bebas cedera."]}, "7": {"1": ["Memahami posisi siap atletik (athletic stance: lutut sedikit ditekuk, tumpuan di ujung telapak kaki, badan siap bergerak ke segala arah).", "Menyelesaikan minimal 10 sesi latihan langkah kaki cepat (footwork ladder / cone drills) dan perubahan arah kanan-kiri.", "Mampu mengerem tubuh dengan aman dan seimbang setelah berlari cepat jarak pendek (10–20 meter)."], "2": ["Mampu melakukan sprint bolak-balik (shuttle run 4×10 meter) dalam waktu cepat dengan pijakan kaki saat berbalik arah yang rapat dan tidak terpeleset.", "Menguasai teknik akselerasi (langkah awal meledak), deselerasi (pengereman lutut aman), dan geser menyamping (lateral shuffle) dengan lincah.", "Refleks tubuh mampu merespons aba-aba visual/suara mendadak dalam hitungan sepersekian detik."], "3": ["Memiliki kelincahan (agility) dan kecepatan langkah kaki tingkat kompetitif di lapangan (mampu melewati penjagaan lawan atau mengejar bola sulit).", "Konsisten melatih daya ledak otot kaki (plyometrics: box jump, tuck jump, sprint pendek) selama ≥6–12 bulan dengan teknik pendaratan yang lembut.", "Mampu mengubah arah lari pada kecepatan tinggi tanpa kehilangan keseimbangan maupun membebani ligamen lutut (ACL safe)."], "4": ["Mencapai kecepatan reaksi dan kelincahan tingkat atlet unggulan di cabang olahraganya selama ≥2–3 tahun pertandingan aktif.", "Mampu membaca gerak bahu/pinggul lawan sepersekian detik sebelum lawan bergerak dan langsung menutup ruang.", "Menguasai perancangan latihan kelincahan dan kecepatan reaksi untuk meningkatkan performa tim."], "5": ["Mencapai kelincahan dan refleks gerak tingkat master yang tetap tajam dan lincah lintas usia.", "Penguasaan teknik pijakan dan pemindahan berat badannya menjadi contoh sempurna efisiensi gerak cepat.", "Melatih banyak atlet/praktisi muda agar bergerak cepat, eksplosif, dan tetap aman dari cedera lutut/engkel."]}, "8": {"1": ["Memahami aturan permainan dan menguasai minimal 3 teknik dasar pada 1 cabang olahraga permainan atau bela diri.", "Mengikuti minimal 8 kali sesi permainan/latihan bersama (sparring/game) dari awal sampai selesai dengan sportif.", "Mampu menjaga fokus dan tidak panik saat sedang memegang bola atau menghadapi lawan di lapangan."], "2": ["Mampu bermain penuh dalam pertandingan persahabatan/komunitas dengan kontribusi nyata (skor, pertahanan, atau kerja sama tim).", "Memiliki jam terbang minimal 30 sesi pertandingan/sparring dan memahami strategi posisi di lapangan.", "Tetap mampu mengeksekusi teknik dasar dengan benar meskipun napas sudah mulai lelah di babak kedua."], "3": ["Mencapai level pemain inti/andalan di komunitas atau turnamen amatir dengan jam terbang ≥100 pertandingan/sesi latihan intensif.", "Memiliki ketenangan mental saat momen krusial (poin-poin kritis akhir pertandingan) dan mampu mengambil keputusan cepat di luar kepala.", "Mampu memadukan kekuatan, daya tahan, dan kelincahan menjadi performa permainan yang utuh dan konsisten."], "4": ["Berprestasi atau bersaing di level kejuaraan/turnamen kompetitif (atau mencapai sabuk/tingkat mahir di bela diri) dengan ≥300 jam terbang.", "Mampu mengatur ritme permainan tim di lapangan, membaca kelemahan taktik lawan, dan memimpin kebangkitan mental tim.", "Menjaga performa puncak atletik selama ≥3–5 tahun kompetisi tanpa mengalami kemunduran fisik."], "5": ["Mencapai tingkat atlet/praktisi master seumur hidup yang dihormati karena kemahiran teknik, kecerdasan bermain, dan sportivitasnya.", "Memiliki dedikasi puluhan tahun di dunia olahraga aktif dan terus menjaga kebugaran kompetitif di kelompok usianya.", "Menjadi pelatih, mentor, dan inspirasi hidup bagi generasi pemain muda di komunitasnya."]}, "9": {"1": ["Tidur malam rata-rata 7–8 jam per hari selama minimal 14 hari berturut-turut dengan jam tidur yang teratur.", "Mematikan atau menjauhkan layar HP minimal 30 menit sebelum tidur dan memastikan kamar gelap serta sejuk.", "Menjadwalkan minimal 1–2 hari istirahat penuh (rest day) setiap minggu agar otot memiliki waktu tumbuh."], "2": ["Memiliki jam tidur dan jam bangun pagi yang konsisten (selisih ≤45 menit setiap hari) selama ≥60 hari penuh.", "Bangun tidur dengan badan terasa segar dan bugar tanpa ketergantungan kafein berlebih di pagi hari.", "Menghindari konsumsi kafein ≥6–8 jam sebelum jam tidur dan makan besar tepat sebelum berbaring."], "3": ["Menjaga kualitas tidur dalam (deep & REM sleep) dan ritme sirkadian yang sehat secara konsisten selama ≥1 tahun.", "Mampu tertidur dengan tenang dalam waktu ≤15–20 menit setelah rebahan meskipun sedang melewati minggu kerja yang sibuk.", "Tahu kapan tubuh membutuhkan tidur tambahan atau istirahat siang singkat (power nap 20 menit) untuk memulihkan fokus."], "4": ["Menguasai manajemen arsitektur tidur dan pemulihan sistem saraf selama ≥3 tahun sehingga jarang sekali jatuh sakit.", "Mampu menyesuaikan jam biologis tubuh dengan cepat ketika harus melakukan perjalanan lintas zona waktu atau tugas padat.", "Membantu keluarga atau rekan tim memperbaiki kebiasaan tidur mereka hingga energi harian mereka meningkat nyata."], "5": ["Mencapai kematangan disiplin istirahat seumur hidup: menghormati tidur berkualitas sebagai pilar utama kesehatan jangka panjang.", "Menikmati kesegaran tubuh, daya ingat yang tajam, dan imunitas yang kokoh lintas dekade.", "Menjadi teladan keseimbangan hidup yang sehat di tengah budaya modern yang sering mengabaikan istirahat."]}, "10": {"1": ["Melakukan peregangan pendinginan (cooling down stretching) minimal 5–10 menit setiap selesai berolahraga.", "Minum air putih minimal 2–2,5 liter per hari (warna urin jernih/kuning pucat) dan makan protein setelah latihan.", "Mengenal cara menggunakan foam roller atau bola pijat untuk melemaskan otot betis, paha, dan punggung yang kaku."], "2": ["Menjalankan sesi pemulihan aktif (jalan santai, renang ringan, yoga/mobilitas 20 menit) minimal 1–2 kali seminggu selama ≥2 bulan.", "Mampu mengatasi pegal otot pasca-latihan (DOMS) dalam waktu 24–48 jam melalui nutrisi, hidrasi, dan aliran darah aktif.", "Rutin membuka kekakuan panggul, bahu, dan tulang punggung atas sehingga tubuh terasa ringan setiap pagi."], "3": ["Menguasai protokol regenerasi fisik lengkap (mobilitas sendi, pelepasan myofascial, pengaturan elektrolit, serta terapi kontras hangat/dingin) selama ≥1 tahun.", "Tubuh tetap terasa lentur dan segar meskipun menjalani volume latihan fisik 4–5 kali seminggu.", "Mampu langsung melakukan penanganan mandiri yang tepat ketika muncul tanda awal ketegangan otot (tightness) sebelum berubah jadi cedera."], "4": ["Mempertahankan kondisi jaringan otot dan fascia yang sehat, elastis, dan bebas nyeri kronis selama ≥3 tahun aktivitas fisik tinggi.", "Menguasai anatomi fungsional dasar untuk merancang rutinitas pemulihan spesifik sesuai beban olahraga yang baru dilakukan.", "Mampu memandu sesi peregangan dan pemulihan aktif bagi rekan satu tim sehabis pertandingan atau latihan berat."], "5": ["Mencapai penguasaan regenerasi tubuh tingkat master seumur hidup di mana kemampuan pulih tubuh terjaga prima di segala usia.", "Pengalaman puluhan tahun merawat jaringan tubuh membuatnya terbebas dari keluhan nyeri punggung/lutut yang umum dialami orang seusianya.", "Mewariskan ilmu perawatan tubuh mandiri (self-care & mobility) kepada banyak orang."]}, "11": {"1": ["Mampu membedakan antara rasa pegal otot yang sehat dengan rasa nyeri tajam pada sendi yang berarti harus segera berhenti.", "Mencatat tingkat energi harian (skala 1–10) dan detak jantung istirahat pagi hari selama minimal 14 hari.", "Berani menurunkan porsi latihan ketika badan sedang demam atau kurang tidur parah, bukan memaksakan diri secara buta."], "2": ["Menggunakan indikator objektif (detak jantung istirahat/RHR, HRV, atau kualitas tidur) dan rasa tubuh untuk mengatur intensitas latihan selama ≥3 bulan.", "Menguasai penjadwalan minggu pengurangan beban (deload week setiap 4–8 minggu) agar tubuh mengompensasi dan tumbuh lebih kuat.", "Mampu mengelola stres pikiran lewat olah napas lambat sehingga beban pikiran tidak membuat otot leher/bahu terus menegang."], "3": ["Mampu menerapkan konsep adaptasi biologis (supercompensation) di luar kepala selama ≥1–2 tahun tanpa pernah rơi ke jurang overtraining.", "Ketika mengalami cedera ringan, mampu menjalankan protokol pemulihan bertahap (rehabilitasi gerak aman) hingga kembali 100% pulih.", "Memiliki kepekaan tinggi membaca sinyal tubuh: tahu persis kapan hari terbaik untuk memecahkan rekor dan kapan harus berlatih ringan."], "4": ["Menguasai manajemen beban total hidup (gabungan beban kerja/studi + beban olahraga + beban emosional) secara harmonis selama ≥3–5 tahun.", "Berhasil menjaga performa fisik tetap stabil di level tinggi sepanjang tahun tanpa siklus tumbang-sakit.", "Menjadi tempat konsultasi bagi rekan olahraga yang sering mengalami kelelahan kronis atau cedera berulang."], "5": ["Mencapai kebijaksanaan tubuh tingkat bijaksana (somatic & biological wisdom) seumur hidup yang selaras penuh dengan hukum alam tubuh.", "Mampu menyesuaikan cara berlatih di setiap dekade usia (20-an, 30-an, 40-an, hingga masa tua) sehingga selalu berada di puncak kebugaran usianya.", "Menjadi teladan umur panjang yang sehat, kuat, dan penuh vitalitas."]}}, "music": {"0": {"1": ["Mampu menepuk ketukan dasar (4/4 dan 3/4) secara stabil mengikuti metronom pada tempo 70–100 BPM selama 60 detik tanpa lari.", "Dapat membedakan tinggi-rendah nada (mana yang lebih tinggi/rendah) serta mengenali akor Mayor (ceria) vs Minor (sedih) lewat telinga.", "Menyelesaikan minimal 5 latihan awal atau lagu utuh tanpa putus dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu menirukan pola ritme tepukan 2 bar dan melodi pendek (4–6 nada) hanya setelah mendengarnya 2–3 kali.", "Mengenali jarak nada (interval dasar: sekunda, terts, kwint, oktaf) dan pergantian akor dasar I–IV–V–vi lewat pendengaran.", "Menghasilkan minimal 12–15 lagu utuh tanpa putus pada ranah Technique dengan kualitas yang stabil dan terukur."], "3": ["Mampu mencari akor dan melodi lagu populer langsung lewat telinga (by ear) dalam waktu ≤15 menit tanpa melihat contekan.", "Menguasai birama campuran (6/8, 12/8, 5/4) dan subdivisi ketukan (triplet, not seperenambelas) dengan groove yang rapat.", "Memiliki rekam jejak minimal 30 lagu utuh tanpa putus atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan latihan teknik jari/vokal dengan metronom (60–120 BPM)."], "4": ["Mampu menuliskan kembali (transkripsi) melodi, progresi akor miring/jazz, dan pola bass dari lagu kompleks hanya dengan mendengarkan.", "Memiliki ketepatan waktu internal (internal clock) yang sangat stabil bahkan ketika metronom dimatikan selama beberapa bar.", "Menuntaskan minimal 60–100 lagu utuh tanpa putus lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai kepekaan telinga dan ritme tingkat maestro: langsung mengenali warna akor kompleks dan struktur lagu dalam sekali dengar.", "Mampu memimpin keselarasan tempo dan intonasi satu band/ansambel penuh secara instan di atas panggung.", "Melahirkan warisan repertoar lagu lintas tempo berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Mampu memainkan minimal 5 akor dasar atau tangga nada dasar dengan bunyi yang bersih dan tidak mati.", "Menuntaskan membawakan minimal 3 lagu sederhana dari awal sampai habis tanpa berhenti di tengah jalan.", "Memahami konsep dasar Expression (Instrumental Fluency) dan mampu mempraktikkan kontrol dinamika keras-lembut (piano–forte) & artikulasi secara sederhana tanpa bingung."], "2": ["Menguasai minimal 15 lagu utuh lintas tempo (lambat dan cepat) di luar kepala tanpa melihat lembar akor.", "Berlatih teknik jari/vokal secara rutin minimal 30 menit/hari selama ≥60 hari dengan catatan progres.", "Lancar menerapkan kontrol dinamika keras-lembut (piano–forte) & artikulasi secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memiliki repertoar ≥40 lagu utuh yang siap dibawakan kapan saja dengan kualitas nada (tone) yang matang dan bersih.", "Mampu memainkan bagian solo atau pengiring lagu tingkat kesulitan menengah-tinggi dengan mulus dari awal hingga akhir.", "Mampu menerapkan konsep Expression (Instrumental Fluency) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki jam terbang latihan terarah ≥1.500 jam selama bertahun-tahun dengan karakter suara (signature tone) yang khas.", "Mampu mempelajari dan menguasai lagu baru yang cukup sulit hanya dalam 1–2 kali latihan singkat.", "Menguasai Expression pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang penampilan/rekaman penuh penghayatan berstandar profesional."], "5": ["Menguasai ratusan repertoar lintas dekade dan mampu menyentuh hati pendengar hanya lewat beberapa nada pertama.", "Menjadi rujukan teknik dan musikalitas tertinggi bagi generasi musisi berikutnya.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Expression: kontrol dinamika keras-lembut (piano–forte) & artikulasi telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Memahami postur duduk/berdiri dan posisi jari yang benar (tidak kaku) pada instrumen utama atau pernapasan diafragma pada vokal.", "Menuntaskan membawakan minimal 3 lagu sederhana dari awal sampai habis tanpa berhenti di tengah jalan.", "Mampu mengenali contoh hasil Virtuosity yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Lancar berpindah antar akor dasar dan akor gantung (barre chords / inversi dasar) pada tempo lagu asli tanpa jeda patah.", "Berlatih teknik jari/vokal secara rutin minimal 30 menit/hari selama ≥60 hari dengan catatan progres.", "Mampu menyelesaikan tantangan Virtuosity tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai teknik ekspresi menengah-mahir (dinamika keras-lembut, vibrato, artikulasi legato/staccato, atau fingerstyle/licks rumit).", "Mampu memainkan bagian solo atau pengiring lagu tingkat kesulitan menengah-tinggi dengan mulus dari awal hingga akhir.", "Kualitas hasil Virtuosity-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menaklukkan karya-karya repertoar tingkat tinggi (virtuoso pieces / aransemen rumit) dengan kontrol emosi dan teknik yang sangat stabil.", "Mampu mempelajari dan menguasai lagu baru yang cukup sulit hanya dalam 1–2 kali latihan singkat.", "Mampu membimbing dan mengoreksi praktik Virtuosity orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai penguasaan instrumen/vokal tingkat master seumur hidup di mana alat musik terasa menyatu penuh dengan tubuh dan jiwa.", "Menjadi rujukan teknik dan musikalitas tertinggi bagi generasi musisi berikutnya.", "Menjadi mahaguru/mentor utama di bidang Instrumental Fluency yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mengenal nama-nama nada (C–D–E–F–G–A–B), rumus tangga nada Mayor/Minor, dan cara membaca bagan akor (chord chart).", "Mampu menentukan akor keluarga (diatonis) dari minimal 3 nada dasar yang sering dipakai (misal: C, G, dan D Mayor).", "Menyelesaikan minimal 5 latihan awal atau analisis nada dasar lagu dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai Lingkaran Kwint (Circle of Fifths) untuk semua 12 nada dasar dan mampu menaikkan/menurunkan nada dasar lagu (transpose) dengan cepat.", "Memahami penggunaan akor tujuh (Maj7, m7, Dom7) dan akor jembatan (slash chords / secondary dominant) agar iringan terdengar lebih manis.", "Menghasilkan minimal 12–15 analisis nada dasar lagu pada ranah Theory dengan kualitas yang stabil dan terukur."], "3": ["Menguasai harmoni tingkat menengah-lanjut: tangga nada Modes (Dorian, Mixolydian, dll.), substitusi tritone, dan modulasi pindah nada dasar yang mulus.", "Mampu membedah (analisis harmoni) minimal 25 lagu dari berbagai genre (Pop, Jazz, Gospel, Klasik, Rock) untuk memahami rahasia keindahannya.", "Memiliki rekam jejak minimal 30 analisis nada dasar lagu atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pembacaan tangga nada, interval, & bagan akor."], "4": ["Menguasai harmoni kontrapung, voice-leading 4 suara yang rapat, dan perpaduan akor ekstensi (9th, 11th, 13th, altered) di semua nada dasar.", "Menyusun ≥30 aransemen harmoni atau partitur multi-instrumen yang kaya warna namun tetap enak didengar.", "Menuntaskan minimal 60–100 analisis nada dasar lagu lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan bahasa teori dan harmoni musik tingkat komposer/sarjana musik matang di luar kepala.", "Teori tidak lagi membatasi, melainkan menjadi taman bermain bebas untuk melahirkan harmoni baru yang segar dan tak terlupakan.", "Melahirkan warisan penerapan teori langsung di instrumen berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Mampu menentukan akor keluarga (diatonis) dari minimal 3 nada dasar yang sering dipakai (misal: C, G, dan D Mayor).", "Memahami struktur bagian lagu populer (Intro, Verse, Pre-Chorus, Chorus, Bridge, Outro).", "Memahami konsep dasar Harmony (Musical Understanding) dan mampu mempraktikkan progresi akor tujuh (7th/extended) & perpindahan nada (modulasi) secara sederhana tanpa bingung."], "2": ["Memahami penggunaan akor tujuh (Maj7, m7, Dom7) dan akor jembatan (slash chords / secondary dominant) agar iringan terdengar lebih manis.", "Mampu membaca partitur not balok/angka atau lead sheet lagu baru dan memainkan kerangka dasarnya dalam waktu ≤10 menit.", "Lancar menerapkan progresi akor tujuh (7th/extended) & perpindahan nada (modulasi) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Mampu membedah (analisis harmoni) minimal 25 lagu dari berbagai genre (Pop, Jazz, Gospel, Klasik, Rock) untuk memahami rahasia keindahannya.", "Dapat langsung mengubah suasana lagu (misal dari mayor ceria menjadi minor sendu atau jazz hangat) secara langsung di luar kepala.", "Mampu menerapkan konsep Harmony (Musical Understanding) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Menyusun ≥30 aransemen harmoni atau partitur multi-instrumen yang kaya warna namun tetap enak didengar.", "Mampu menjelaskan konsep teori musik yang rumit kepada musisi lain dengan contoh bunyi yang langsung mudah dimengerti.", "Menguasai Harmony pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang racikan harmoni kaya warna berstandar profesional."], "5": ["Teori tidak lagi membatasi, melainkan menjadi taman bermain bebas untuk melahirkan harmoni baru yang segar dan tak terlupakan.", "Mewariskan buku catatan, modul, atau karya aransemen harmoni yang dipelajari oleh banyak musisi.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Harmony: progresi akor tujuh (7th/extended) & perpindahan nada (modulasi) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Berani memainkan variasi melodi atau isian pendek (fill-in) 1–2 bar buatan sendiri di ujung kalimat lagu tanpa takut salah.", "Mengerti kapan harus mengisi nada dan kapan harus memberi ruang diam (rest) agar musik bisa bernapas.", "Mampu mengenali contoh hasil Musical Intuition yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu melakukan tanya-jawab melodi (call and response) dengan musisi lain atau backing track secara nyambung dan musikal.", "Dapat mengiringi penyanyi atau instrumen solo secara spontan dengan pola ritme dan isian yang mendukung, bukan menutupi vokal.", "Mampu menyelesaikan tantangan Musical Intuition tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu membangun solo improvisasi sepanjang 8–16 bar yang punya alur cerita jelas (mulai tenang, naik bertahap, hingga klimaks memukau).", "Ketika tidak sengaja menekan nada yang meleset, mampu langsung membelokkannya setengah nada menjadi kalimat yang terdengar keren.", "Kualitas hasil Musical Intuition-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai improvisasi bebas lintas perubahan akor cepat dan modulasi nada dasar tanpa kehilangan keindahan melodi.", "Telah tampil berimprovisasi secara live di ≥50 sesi panggung atau rekaman dengan kualitas solo yang matang.", "Mampu membimbing dan mengoreksi praktik Musical Intuition orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai kebebasan improvisasi tingkat master: setiap kali bermain seolah sedang menciptakan komposisi baru yang utuh di tempat.", "Menjadi inspirasi utama dalam seni kebebasan berekspresi dan kejujuran musikal.", "Menjadi mahaguru/mentor utama di bidang Musical Understanding yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Berani menciptakan melodi senandung atau progresi 4 akor orisinal buatan sendiri dan merekamnya di voice note HP.", "Menyelesaikan minimal 2 draf lagu sederhana (lirik + melodi + iringan akor dasar) sampai utuh satu lagu.", "Menyelesaikan minimal 5 latihan awal atau karya aransemen multi-instrumen dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai teknik merangkai hook (bagian melodi paling mudah diingat) di bagian reff/chorus dan membangun jembatan emosi dari verse.", "Menyelesaikan minimal 8 lagu orisinal atau karya instrumental utuh buatan sendiri.", "Menghasilkan minimal 12–15 karya aransemen multi-instrumen pada ranah Arrangement dengan kualitas yang stabil dan terukur."], "3": ["Memiliki alur penulisan lagu yang matang: mampu menyelesaikan 1 lagu baru yang solid dari ide kosong dalam waktu ≤1–2 hari.", "Menghasilkan katalog ≥20 karya lagu/komposisi orisinal yang telah dibawakan di depan publik atau dirilis secara digital.", "Memiliki rekam jejak minimal 30 karya aransemen multi-instrumen atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan aransemen ulang lagu (intro, reff, pembagian instrumen)."], "4": ["Merilis mini album (EP) atau album penuh (LP) berisi karya-karya orisinal yang memiliki benang merah tema dan kualitas penulisan tinggi.", "Karya lagunya dinyanyikan, dibawakan ulang (cover), atau digunakan dalam karya film/komunitas oleh banyak orang.", "Menuntaskan minimal 60–100 karya aransemen multi-instrumen lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat pencipta lagu dan komposer seumur hidup yang melahirkan karya-karya abadi (timeless songs).", "Lagu-lagu ciptaannya terus hidup, menyentuh hati pendengar, dan dinyanyikan lintas generasi selama puluhan tahun.", "Melahirkan warisan katalog aransemen panggung/studio berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Menyelesaikan minimal 2 draf lagu sederhana (lirik + melodi + iringan akor dasar) sampai utuh satu lagu.", "Mampu menuliskan lirik yang jujur dan sesuai dengan ketukan suku kata melodi.", "Memahami konsep dasar Composition (Composition) dan mampu mempraktikkan penciptaan melodi, lirik, & progresi akor orisinal secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 8 lagu orisinal atau karya instrumental utuh buatan sendiri.", "Mampu mengaransemen ulang (re-arrange) minimal 5 lagu yang sudah ada menjadi versi baru yang segar dengan gaya sendiri.", "Lancar menerapkan penciptaan melodi, lirik, & progresi akor orisinal secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menghasilkan katalog ≥20 karya lagu/komposisi orisinal yang telah dibawakan di depan publik atau dirilis secara digital.", "Menguasai penulisan aransemen lengkap untuk band penuh (drum, bass, kunci, gitar, vokal latar, dan string/brass dasar).", "Mampu menerapkan konsep Composition (Composition) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Karya lagunya dinyanyikan, dibawakan ulang (cover), atau digunakan dalam karya film/komunitas oleh banyak orang.", "Telah menciptakan ≥50 komposisi/aransemen lintas tahun yang menunjukkan kedewasaan lirik dan harmoni.", "Menguasai Composition pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang rilisan karya/album orisinal berstandar profesional."], "5": ["Lagu-lagu ciptaannya terus hidup, menyentuh hati pendengar, dan dinyanyikan lintas generasi selama puluhan tahun.", "Menjadi mentor penulisan lagu yang membantu banyak musisi muda melahirkan karya jujur mereka sendiri.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Composition: penciptaan melodi, lirik, & progresi akor orisinal telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Mengenal cara kerja dasar aplikasi perekaman musik (DAW seperti GarageBand, Logic, Reaper, Ableton, atau FL Studio) di laptop/HP.", "Menyelesaikan minimal 3 rekaman demo lagu sederhana dari hasil rekaman sendiri.", "Mampu mengenali contoh hasil Orchestration yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Memahami penataan mikrofon dasar (jarak, akustik ruangan sederhana) serta penggunaan EQ (potong frekuensi keruh) dan Compressor dasar.", "Mampu mengekspor file audio akhir dengan standar volume yang sehat dan jernih di speaker HP maupun headphone.", "Mampu menyelesaikan tantangan Orchestration tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai proses produksi musik utuh dari pra-produksi, perekaman (tracking), penyuntingan (editing/tuning), mixing, hingga mastering dasar.", "Mampu merancang warna suara (sound design / pemilihan instrumen virtual & efek) yang tepat untuk memperkuat emosi lagu.", "Kualitas hasil Orchestration-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai rekayasa audio (mixing/mastering) dan produksi musik tingkat studio profesional untuk berbagai genre.", "Mampu mengarahkan penyanyi dan pemain instrumen di ruang rekaman agar menghasilkan rekaman dengan jiwa (take terbaik).", "Mampu membimbing dan mengoreksi praktik Orchestration orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat produser musik dan penata suara master yang memiliki sentuhan khas (sonic signature) berkelas tinggi.", "Membina studio/komunitas kreator musik dan menurunkan ilmu produksi audio kepada generasi produser baru.", "Menjadi mahaguru/mentor utama di bidang Composition yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Mampu bermain atau bernyanyi bersama minimal 1–2 rekan (duet/trio) dari awal sampai akhir lagu dengan tempo yang kompak.", "Mendengarkan suara instrumen teman sama jelasnya dengan suara instrumen sendiri (tidak egois mengeraskan volume sendiri).", "Menyelesaikan minimal 5 latihan awal atau sesi mengiringi duet/band dengan mengikuti panduan langkah demi langkah."], "2": ["Aktif bermain di dalam band, tim musik ibadah, atau ansambel/paduan suara selama ≥10 kali latihan dan penampilan.", "Mengetahui peran frekuensi instrumennya sendiri agar tidak tabrakan dengan instrumen lain (misal: gitar tidak menabrak area bass/keyboard).", "Menghasilkan minimal 12–15 sesi mengiringi duet/band pada ranah Accompaniment dengan kualitas yang stabil dan terukur."], "3": ["Mampu menjadi pengarah musik (Music Director / MD) atau pemimpin seksi instrumen untuk minimal 10 penampilan live.", "Cepat tanggap membaca kode tangan, lirikan mata, atau perubahan spontan dari penyanyi/pemimpin band di atas panggung.", "Memiliki rekam jejak minimal 30 sesi mengiringi duet/band atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan iringan musik (comping) yang menjaga tempo & mendukung penyanyi."], "4": ["Menguasai pengarahan ansambel besar, band panggung utama, atau orkestra mini (≥10–20 pemain) untuk konser/rekaman.", "Telah memimpin ≥30 produksi musik panggung dengan latihan yang efisien, aransemen yang rapi, dan suasana tim yang solid.", "Menuntaskan minimal 60–100 sesi mengiringi duet/band lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat maestro pengarah musik (master conductor / bandleader) yang mampu mengeluarkan potensi terbaik dari setiap pemainnya.", "Memiliki rekam jejak puluhan tahun memimpin kolaborasi musik lintas generasi dan menghasilkan pertunjukan yang tak terlupakan.", "Melahirkan warisan jam terbang pengiring panggung berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Mendengarkan suara instrumen teman sama jelasnya dengan suara instrumen sendiri (tidak egois mengeraskan volume sendiri).", "Memahami aba-aba dasar saat mulai lagu (count-in) dan saat mengakhiri lagu bersama-sama.", "Memahami konsep dasar Direction (Musical Leadership) dan mampu mempraktikkan pemberian aba-aba (cue), latihan band, & pengaturan alur lagu secara sederhana tanpa bingung."], "2": ["Mengetahui peran frekuensi instrumennya sendiri agar tidak tabrakan dengan instrumen lain (misal: gitar tidak menabrak area bass/keyboard).", "Mampu menjaga dinamika bersama: ikut mengecilkan suara saat bagian tenang (verse/doa) dan mengangkat energi saat klimaks (chorus).", "Lancar menerapkan pemberian aba-aba (cue), latihan band, & pengaturan alur lagu secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Cepat tanggap membaca kode tangan, lirikan mata, atau perubahan spontan dari penyanyi/pemimpin band di atas panggung.", "Berhasil menyatukan 4–8 musisi dengan tingkat kemampuan berbeda menjadi satu kesatuan bunyi yang rapi dan harmonis.", "Mampu menerapkan konsep Direction (Musical Leadership) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah memimpin ≥30 produksi musik panggung dengan latihan yang efisien, aransemen yang rapi, dan suasana tim yang solid.", "Mampu langsung mendeteksi instrumen mana yang membuat bunyi keseluruhan terasa keruh dan memberikan solusi aransemen di tempat.", "Menguasai Direction pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang produksi panggung ansambel/band berstandar profesional."], "5": ["Memiliki rekam jejak puluhan tahun memimpin kolaborasi musik lintas generasi dan menghasilkan pertunjukan yang tak terlupakan.", "Dihormati karena kerendahan hati, ketajaman telinga, dan kepemimpinannya yang menyatukan hati para musisi.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Direction: pemberian aba-aba (cue), latihan band, & pengaturan alur lagu telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Berani tampil membawakan minimal 2–3 lagu di depan penonton langsung (acara komunitas, ibadah, kafe, atau pentas seni) sampai tuntas.", "Selalu datang tepat waktu dan mengecek kesiapan alat/kabel sendiri sebelum naik panggung.", "Mampu mengenali contoh hasil Interpretation yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai tata cara cek suara (soundcheck) yang cepat dan efektif serta komunikasi dengan operator suara (sound engineer).", "Ketika terjadi kendala teknis di panggung (senar putus, mikrofon mati, lupa lirik), mampu tetap tenang dan melanjutkan penampilan tanpa panik.", "Mampu menyelesaikan tantangan Interpretation tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu membawakan set pertunjukan berdurasi 30–60 menit (8–12 lagu) dengan pengaturan alur energi penonton dari lagu pembuka hingga penutup.", "Menguasai manajemen stamina fisik dan fokus mental sebelum, selama, dan sesudah pertunjukan panjang.", "Kualitas hasil Interpretation-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu menggelar konser tunggal/kolektif atau tampil di panggung utama berskala ratusan hingga ribuan penonton dengan karisma penuh.", "Mampu merancang konsep pertunjukan utuh (tata urutan lagu, transisi antar lagu, tata cahaya, dan interaksi panggung).", "Mampu membimbing dan mengoreksi praktik Interpretation orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat seniman panggung legendaris yang kehadirannya di atas panggung selalu menghadirkan pengalaman magis dan tak terlupakan.", "Menjadi teladan profesionalisme dan jiwa pertunjukan bagi generasi penampil sesudahnya.", "Menjadi mahaguru/mentor utama di bidang Musical Leadership yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "engineering": {"0": {"1": ["Memahami hukum dasar kelistrikan (Tegangan, Arus, Hambatan / Hukum Ohm) dan mampu menggunakan multimeter dengan aman.", "Berhasil merakit minimal 5 rangkaian elektronik dasar di papan uji (breadboard) menggunakan sensor, lampu LED, atau mikrokontroler (Arduino/ESP32).", "Menyelesaikan minimal 5 latihan awal atau rangkaian fungsional bebas korsleting dengan mengikuti panduan langkah demi langkah."], "2": ["Terampil menyolder komponen elektronik dengan rapi dan memprogram mikrokontroler untuk membaca sensor serta menggerakkan motor/aktuator.", "Menyelesaikan minimal 8 proyek alat pintar (IoT / robotika dasar / otomasi rumah) yang menggabungkan perangkat keras dan kode program.", "Menghasilkan minimal 12–15 rangkaian fungsional bebas korsleting pada ranah Circuits dengan kualitas yang stabil dan terukur."], "3": ["Menguasai perancangan papan sirkuit cetak (PCB) kustom multi-lapis menggunakan perangkat lunak CAD elektronik (KiCad/Altium/Eagle).", "Telah membangun ≥15 purwarupa perangkat keras/embedded system yang bekerja stabil di lapangan selama berbulan-bulan.", "Memiliki rekam jejak minimal 30 rangkaian fungsional bebas korsleting atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan perakitan rangkaian listrik dasar & pengukuran multimeter (Hukum Ohm)."], "4": ["Menguasai rekayasa perangkat keras siap produksi massal (Design for Manufacturing / DFM, manajemen termal, dan uji ketahanan interferensi).", "Berhasil melahirkan ≥25 perangkat elektronik/mekatronika terintegrasi yang dipakai di industri, laboratorium, atau masyarakat.", "Menuntaskan minimal 60–100 rangkaian fungsional bebas korsleting lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat empu rekayasa perangkat keras dan sistem fisik (master hardware engineer) dengan jam terbang puluhan tahun.", "Inovasi mesin, instrumen, atau perangkat pintar ciptaannya telah bekerja nyata memecahkan masalah fisik di dunia nyata.", "Melahirkan warisan sistem kelistrikan yang aman & stabil berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Berhasil merakit minimal 5 rangkaian elektronik dasar di papan uji (breadboard) menggunakan sensor, lampu LED, atau mikrokontroler (Arduino/ESP32).", "Mampu membaca skema rangkaian sederhana dan menyambung kabel tanpa menyebabkan korsleting.", "Memahami konsep dasar Electronics (Electrical Engineering) dan mampu mempraktikkan pemrograman mikrokontroler (Arduino/ESP32), sensor, & penyolderan PCB secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 8 proyek alat pintar (IoT / robotika dasar / otomasi rumah) yang menggabungkan perangkat keras dan kode program.", "Mampu mendesain atau mencetak casing/rangka mekanis sederhana (3D printing / akrilik / kayu) agar alat rakitannya rapi dan kuat.", "Lancar menerapkan pemrograman mikrokontroler (Arduino/ESP32), sensor, & penyolderan PCB secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Telah membangun ≥15 purwarupa perangkat keras/embedded system yang bekerja stabil di lapangan selama berbulan-bulan.", "Mampu menggunakan osiloskop dan logic analyzer untuk melacak gangguan sinyal atau konsumsi daya baterai pada alat.", "Mampu menerapkan konsep Electronics (Electrical Engineering) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Berhasil melahirkan ≥25 perangkat elektronik/mekatronika terintegrasi yang dipakai di industri, laboratorium, atau masyarakat.", "Mampu menyatukan desain mekanik, elektronik, firmware, dan aplikasi pemantau ke dalam satu produk utuh yang andal.", "Menguasai Electronics pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang perangkat elektronik teruji lapangan berstandar profesional."], "5": ["Inovasi mesin, instrumen, atau perangkat pintar ciptaannya telah bekerja nyata memecahkan masalah fisik di dunia nyata.", "Menjadi pembimbing utama bagi generasi perakit, pembuat robot, dan insinyur perangkat keras baru.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Electronics: pemrograman mikrokontroler (Arduino/ESP32), sensor, & penyolderan PCB telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Memahami hukum dasar kelistrikan (Tegangan, Arus, Hambatan / Hukum Ohm) dan mampu menggunakan multimeter dengan aman.", "Mampu membaca skema rangkaian sederhana dan menyambung kabel tanpa menyebabkan korsleting.", "Mampu mengenali contoh hasil System Integration yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Terampil menyolder komponen elektronik dengan rapi dan memprogram mikrokontroler untuk membaca sensor serta menggerakkan motor/aktuator.", "Mampu mendesain atau mencetak casing/rangka mekanis sederhana (3D printing / akrilik / kayu) agar alat rakitannya rapi dan kuat.", "Mampu menyelesaikan tantangan System Integration tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai perancangan papan sirkuit cetak (PCB) kustom multi-lapis menggunakan perangkat lunak CAD elektronik (KiCad/Altium/Eagle).", "Mampu menggunakan osiloskop dan logic analyzer untuk melacak gangguan sinyal atau konsumsi daya baterai pada alat.", "Kualitas hasil System Integration-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai rekayasa perangkat keras siap produksi massal (Design for Manufacturing / DFM, manajemen termal, dan uji ketahanan interferensi).", "Mampu menyatukan desain mekanik, elektronik, firmware, dan aplikasi pemantau ke dalam satu produk utuh yang andal.", "Mampu membimbing dan mengoreksi praktik System Integration orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat empu rekayasa perangkat keras dan sistem fisik (master hardware engineer) dengan jam terbang puluhan tahun.", "Menjadi pembimbing utama bagi generasi perakit, pembuat robot, dan insinyur perangkat keras baru.", "Menjadi mahaguru/mentor utama di bidang Electrical Engineering yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mampu mengubah ide solusi di kepala menjadi purwarupa kasar yang bisa dicoba (clickable mockup atau skrip MVP) dalam waktu ≤48 jam.", "Menyelesaikan minimal 3 proyek eksperimen akhir pekan (hackathon / side project) sampai benar-benar bisa didemokan.", "Menyelesaikan minimal 5 latihan awal atau rancangan struktur/rangka fisik dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu menguji purwarupa buatan sendiri kepada minimal 5 pengguna nyata dan langsung memperbaiki bagian yang membuat mereka bingung.", "Berhasil membangun dan meluncurkan minimal 6 produk/alat fungsional dari nol hingga dipakai menyelesaikan masalah nyata.", "Menghasilkan minimal 12–15 rancangan struktur/rangka fisik pada ranah Mechanics dengan kualitas yang stabil dan terukur."], "3": ["Menguasai seni Product Engineering: peka terhadap kenyamanan pengguna (UX) sekaligus kokoh dalam rekayasa teknisnya.", "Telah melahirkan ≥12 produk digital/fisik atau fitur berdampak tinggi dari tahap ide kasar hingga digunakan ratusan pengguna.", "Memiliki rekam jejak minimal 30 rancangan struktur/rangka fisik atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan perhitungan gaya, beban, tuas, & kekuatan bahan mekanik."], "4": ["Memimpin laboratorium inovasi atau pengembangan produk baru (0-to-1 product builder) yang melahirkan solusi terobosan di bidangnya.", "Memiliki rekam jejak ≥25 inovasi produk/alat yang berhasil melewati fase purwarupa menuju penggunaan skala luas yang berkelanjutan.", "Menuntaskan minimal 60–100 rancangan struktur/rangka fisik lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat penemu dan perancang inovasi seumur hidup (master inventor & builder) yang tak pernah berhenti melahirkan karya guna.", "Karya-karya rekayasa yang dirintisnya selama puluhan tahun telah mempermudah hidup ribuan orang.", "Melahirkan warisan konstruksi mekanik yang kokoh & presisi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Menyelesaikan minimal 3 proyek eksperimen akhir pekan (hackathon / side project) sampai benar-benar bisa didemokan.", "Mengutamakan berfungsinya fitur inti terlebih dahulu daripada terjebak mempercantik hal-hal kecil yang belum tentu dipakai.", "Memahami konsep dasar Dynamics (Mechanical Engineering) dan mampu mempraktikkan analisis gerak mekanisme, roda gigi, motor, & redaman getaran secara sederhana tanpa bingung."], "2": ["Berhasil membangun dan meluncurkan minimal 6 produk/alat fungsional dari nol hingga dipakai menyelesaikan masalah nyata.", "Memiliki gudang komponen/template kode siap pakai buatan sendiri sehingga bisa merakit proyek baru 3× lebih cepat.", "Lancar menerapkan analisis gerak mekanisme, roda gigi, motor, & redaman getaran secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Telah melahirkan ≥12 produk digital/fisik atau fitur berdampak tinggi dari tahap ide kasar hingga digunakan ratusan pengguna.", "Mampu memvalidasi apakah suatu ide teknis layak dibangun lebih lanjut hanya lewat eksperimen purwarupa berbiaya sangat rendah.", "Mampu menerapkan konsep Dynamics (Mechanical Engineering) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥25 inovasi produk/alat yang berhasil melewati fase purwarupa menuju penggunaan skala luas yang berkelanjutan.", "Mampu memadukan teknologi terbaru dengan kebutuhan manusia nyata secara tepat guna tanpa terjebak sekadar pamer kecanggihan.", "Menguasai Dynamics pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang mesin/mekanisme dinamis berkinerja tinggi berstandar profesional."], "5": ["Karya-karya rekayasa yang dirintisnya selama puluhan tahun telah mempermudah hidup ribuan orang.", "Menjadi motor penggerak inovasi dan mentor bagi para perintis teknologi generasi baru.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Dynamics: analisis gerak mekanisme, roda gigi, motor, & redaman getaran telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Tidak langsung terburu-buru memperbaiki kode secara acak saat error, melainkan membaca pesan kesalahan (error log / stack trace) dengan teliti.", "Memiliki daftar periksa (checklist) pengujian sederhana sebelum menyatakan sebuah fitur sudah selesai.", "Mampu mengenali contoh hasil Optimization yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu membuat skenario reka ulang (reproducible test case) yang memastikan penyebab bug benar-benar ditemukan, bukan sekadar kebetulan hilang.", "Menggunakan alat pengukur kinerja (profiler / browser devtools) untuk menemukan bagian kode atau gambar yang membuat aplikasi lambat.", "Mampu menyelesaikan tantangan Optimization tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu melacak dan menyembuhkan bug langka yang sulit ditebak (seperti race condition, kebocoran memori/memory leak, atau bug lintas jaringan).", "Membangun standar jaminan kualitas (Quality Assurance) otomatis yang menjaga tingkat cacat rilis tetap di bawah 1%.", "Kualitas hasil Optimization-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menjadi detektif teknis utama yang mampu membedah masalah misterius pada sistem raksasa yang bahkan pembuat aslinya sudah menyerah.", "Merancang budaya rekayasa keandalan (Site Reliability & Chaos Engineering) yang menguji ketahanan sistem sebelum masalah nyata terjadi.", "Mampu membimbing dan mengoreksi praktik Optimization orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai ketajaman diagnostik tingkat legendaris: mampu membaca gejala kerusakan sistem kompleks dan langsung menunjuk titik akarnya dengan tepat.", "Mewariskan metodologi investigasi teknis yang sistematis, tenang, dan berbasis bukti.", "Menjadi mahaguru/mentor utama di bidang Mechanical Engineering yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Mampu mengubah ide solusi di kepala menjadi purwarupa kasar yang bisa dicoba (clickable mockup atau skrip MVP) dalam waktu ≤48 jam.", "Menyelesaikan minimal 3 proyek eksperimen akhir pekan (hackathon / side project) sampai benar-benar bisa didemokan.", "Menyelesaikan minimal 5 latihan awal atau file model 3D siap cetak/rakit dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu menguji purwarupa buatan sendiri kepada minimal 5 pengguna nyata dan langsung memperbaiki bagian yang membuat mereka bingung.", "Berhasil membangun dan meluncurkan minimal 6 produk/alat fungsional dari nol hingga dipakai menyelesaikan masalah nyata.", "Menghasilkan minimal 12–15 file model 3D siap cetak/rakit pada ranah Modeling dengan kualitas yang stabil dan terukur."], "3": ["Menguasai seni Product Engineering: peka terhadap kenyamanan pengguna (UX) sekaligus kokoh dalam rekayasa teknisnya.", "Telah melahirkan ≥12 produk digital/fisik atau fitur berdampak tinggi dari tahap ide kasar hingga digunakan ratusan pengguna.", "Memiliki rekam jejak minimal 30 file model 3D siap cetak/rakit atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pembuatan sketsa teknik 2D & model 3D CAD dengan ukuran milimeter akurat."], "4": ["Memimpin laboratorium inovasi atau pengembangan produk baru (0-to-1 product builder) yang melahirkan solusi terobosan di bidangnya.", "Memiliki rekam jejak ≥25 inovasi produk/alat yang berhasil melewati fase purwarupa menuju penggunaan skala luas yang berkelanjutan.", "Menuntaskan minimal 60–100 file model 3D siap cetak/rakit lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat penemu dan perancang inovasi seumur hidup (master inventor & builder) yang tak pernah berhenti melahirkan karya guna.", "Karya-karya rekayasa yang dirintisnya selama puluhan tahun telah mempermudah hidup ribuan orang.", "Melahirkan warisan pustaka desain komponen presisi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Menyelesaikan minimal 3 proyek eksperimen akhir pekan (hackathon / side project) sampai benar-benar bisa didemokan.", "Mengutamakan berfungsinya fitur inti terlebih dahulu daripada terjebak mempercantik hal-hal kecil yang belum tentu dipakai.", "Memahami konsep dasar Prototyping (Product Design) dan mampu mempraktikkan pembuatan purwarupa cepat (3D printing, rakitan bahan, atau MVP aplikasi) secara sederhana tanpa bingung."], "2": ["Berhasil membangun dan meluncurkan minimal 6 produk/alat fungsional dari nol hingga dipakai menyelesaikan masalah nyata.", "Memiliki gudang komponen/template kode siap pakai buatan sendiri sehingga bisa merakit proyek baru 3× lebih cepat.", "Lancar menerapkan pembuatan purwarupa cepat (3D printing, rakitan bahan, atau MVP aplikasi) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Telah melahirkan ≥12 produk digital/fisik atau fitur berdampak tinggi dari tahap ide kasar hingga digunakan ratusan pengguna.", "Mampu memvalidasi apakah suatu ide teknis layak dibangun lebih lanjut hanya lewat eksperimen purwarupa berbiaya sangat rendah.", "Mampu menerapkan konsep Prototyping (Product Design) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥25 inovasi produk/alat yang berhasil melewati fase purwarupa menuju penggunaan skala luas yang berkelanjutan.", "Mampu memadukan teknologi terbaru dengan kebutuhan manusia nyata secara tepat guna tanpa terjebak sekadar pamer kecanggihan.", "Menguasai Prototyping pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang siklus iterasi produk nyata berstandar profesional."], "5": ["Karya-karya rekayasa yang dirintisnya selama puluhan tahun telah mempermudah hidup ribuan orang.", "Menjadi motor penggerak inovasi dan mentor bagi para perintis teknologi generasi baru.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Prototyping: pembuatan purwarupa cepat (3D printing, rakitan bahan, atau MVP aplikasi) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Mampu memperkirakan berapa lama waktu yang dibutuhkan untuk menyelesaikan tugas teknis pribadi dengan selisih meleset yang wajar.", "Menyelesaikan minimal 5 proyek teknis tepat waktu sesuai jadwal yang sudah dijanjikan.", "Mampu mengenali contoh hasil Design Engineering yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu memimpin koordinasi teknis untuk tim kecil (2–4 engineer) dari tahap pembagian tugas hingga penggabungan kode akhir.", "Menjaga keseimbangan yang sehat antara kecepatan rilis fitur baru dengan cicilan perbaikan kerapian kode (technical debt).", "Mampu menyelesaikan tantangan Design Engineering tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Berperan sebagai Tech Lead yang andal pada ≥8 proyek menengah-besar: menjaga kualitas arsitektur sekaligus ketenangan kerja tim.", "Berhasil membimbing engineer junior di timnya hingga naik kelas menjadi engineer mandiri yang produktif.", "Kualitas hasil Design Engineering-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai manajemen rekayasa tingkat tinggi (VP of Engineering / Principal Tech Lead) yang menyelaraskan visi bisnis dengan peta jalan teknologi 1–3 tahun.", "Membangun sistem rekrutmen, jenjang pertumbuhan, dan budaya keunggulan teknis yang membuat tim rekayasa disegani.", "Mampu membimbing dan mengoreksi praktik Design Engineering orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai puncak kepemimpinan teknologi seumur hidup (CTO / Master Engineering Leader) yang memadukan kebijaksanaan manusia dan ketajaman mesin.", "Warisan kepemimpinannya membuktikan bahwa teknologi terbaik selalu lahir dari tim yang diberdayakan dengan visi yang jernih.", "Menjadi mahaguru/mentor utama di bidang Product Design yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Mampu membuat halaman aplikasi/web sederhana yang tampil rapi di layar HP maupun laptop dan tersambung ke penyimpanan data dasar.", "Menyelesaikan minimal 2 proyek aplikasi kecil dari awal (tampilan depan + logika penyimpanan data) hingga bisa dibuka lewat tautan.", "Menyelesaikan minimal 5 latihan awal atau sistem terhubung yang mengalirkan data lancar dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu merancang skema database (tabel relasional SQL atau NoSQL) yang rapi dan membuat REST API lengkap dengan fitur login aman.", "Membangun dan meluncurkan (deploy) minimal 5 aplikasi utuh yang digunakan oleh teman, komunitas, atau pengguna nyata.", "Menghasilkan minimal 12–15 sistem terhubung yang mengalirkan data lancar pada ranah Integration dengan kualitas yang stabil dan terukur."], "3": ["Mampu merancang arsitektur sistem berskala menengah (pemisahan modul layanan, caching, antrean tugas/background jobs, dan indeks database).", "Telah membangun dan mengelola ≥10 sistem aplikasi produksi yang melayani ratusan hingga ribuan pengguna aktif dengan uptime ≥99%.", "Memiliki rekam jejak minimal 30 sistem terhubung yang mengalirkan data lancar atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penghubungan antar modul (API, sensor ke aplikasi, atau sub-sistem)."], "4": ["Menguasai arsitektur sistem terdistribusi berskala besar (high availability, load balancing, sharding/replikasi, ketahanan terhadap lonjakan trafik ekstrem).", "Memimpin perancangan arsitektur untuk ≥20 sistem kritis yang memproses jutaan transaksi/permintaan data secara aman dan efisien.", "Menuntaskan minimal 60–100 sistem terhubung yang mengalirkan data lancar lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat Chief/Principal System Architect seumur hidup yang rancangan sistemnya tetap kokoh dan mudah dikembangkan lintas dekade.", "Arsitektur teknologi yang dibangunnya menjadi tulang punggung operasional bagi institusi, perusahaan, atau ribuan pengguna.", "Melahirkan warisan ekosistem integrasi lintas perangkat berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Menyelesaikan minimal 2 proyek aplikasi kecil dari awal (tampilan depan + logika penyimpanan data) hingga bisa dibuka lewat tautan.", "Memahami cara kerja komunikasi antara tampilan pengguna (Frontend) dan peladen data (Backend/API) lewat format JSON.", "Memahami konsep dasar Systems Architecture (Systems Engineering) dan mampu mempraktikkan perancangan arsitektur sistem (database, server, & alur kerja modular) secara sederhana tanpa bingung."], "2": ["Membangun dan meluncurkan (deploy) minimal 5 aplikasi utuh yang digunakan oleh teman, komunitas, atau pengguna nyata.", "Menguasai penanganan error yang ramah pengguna serta optimasi dasar agar halaman dimuat dalam waktu ≤2 detik.", "Lancar menerapkan perancangan arsitektur sistem (database, server, & alur kerja modular) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Telah membangun dan mengelola ≥10 sistem aplikasi produksi yang melayani ratusan hingga ribuan pengguna aktif dengan uptime ≥99%.", "Dapat membuat dokumen desain teknis (System Design Document) yang jelas sebelum menulis baris kode pertama.", "Mampu menerapkan konsep Systems Architecture (Systems Engineering) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memimpin perancangan arsitektur untuk ≥20 sistem kritis yang memproses jutaan transaksi/permintaan data secara aman dan efisien.", "Mampu memigrasikan atau merombak sistem warisan (legacy system) yang rumit tanpa menghentikan layanan yang sedang berjalan.", "Menguasai Systems Architecture pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang arsitektur sistem skala besar (uptime ≥99%) berstandar profesional."], "5": ["Arsitektur teknologi yang dibangunnya menjadi tulang punggung operasional bagi institusi, perusahaan, atau ribuan pengguna.", "Mewariskan prinsip desain sistem yang sederhana, tangguh, dan hemat biaya kepada banyak arsitek perangkat lunak.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Systems Architecture: perancangan arsitektur sistem (database, server, & alur kerja modular) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Tidak langsung terburu-buru memperbaiki kode secara acak saat error, melainkan membaca pesan kesalahan (error log / stack trace) dengan teliti.", "Memiliki daftar periksa (checklist) pengujian sederhana sebelum menyatakan sebuah fitur sudah selesai.", "Mampu mengenali contoh hasil Systems Optimization yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu membuat skenario reka ulang (reproducible test case) yang memastikan penyebab bug benar-benar ditemukan, bukan sekadar kebetulan hilang.", "Menggunakan alat pengukur kinerja (profiler / browser devtools) untuk menemukan bagian kode atau gambar yang membuat aplikasi lambat.", "Mampu menyelesaikan tantangan Systems Optimization tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu melacak dan menyembuhkan bug langka yang sulit ditebak (seperti race condition, kebocoran memori/memory leak, atau bug lintas jaringan).", "Membangun standar jaminan kualitas (Quality Assurance) otomatis yang menjaga tingkat cacat rilis tetap di bawah 1%.", "Kualitas hasil Systems Optimization-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menjadi detektif teknis utama yang mampu membedah masalah misterius pada sistem raksasa yang bahkan pembuat aslinya sudah menyerah.", "Merancang budaya rekayasa keandalan (Site Reliability & Chaos Engineering) yang menguji ketahanan sistem sebelum masalah nyata terjadi.", "Mampu membimbing dan mengoreksi praktik Systems Optimization orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai ketajaman diagnostik tingkat legendaris: mampu membaca gejala kerusakan sistem kompleks dan langsung menunjuk titik akarnya dengan tepat.", "Mewariskan metodologi investigasi teknis yang sistematis, tenang, dan berbasis bukti.", "Menjadi mahaguru/mentor utama di bidang Systems Engineering yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "business": {"0": {"1": ["Mampu menuliskan langkah-langkah kerja rutin dari awal sampai akhir (checklist/SOP sederhana) agar tidak ada tahapan yang terlupa.", "Menyelesaikan pengiriman minimal 10 pesanan pelanggan atau tugas operasional tepat waktu dan sesuai janji kualitas.", "Menyelesaikan minimal 5 latihan awal atau SOP kerja tertulis yang rapi dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu merancang Standar Operasional Prosedur (SOP) tertulis yang begitu jelas sehingga orang baru bisa mengikutinya dengan hasil yang sama bagusnya.", "Berhasil memangkas langkah kerja yang berbelit-belit atau mengotomasi tugas berulang sehingga menghemat waktu kerja ≥20–30%.", "Menghasilkan minimal 12–15 SOP kerja tertulis yang rapi pada ranah Organization dengan kualitas yang stabil dan terukur."], "3": ["Mampu membangun sistem operasional harian (pengadaan, produksi/layanan, kontrol kualitas, pengiriman, layanan purnajual) yang berjalan rapi.", "Usaha atau proyek yang dikelolanya tetap bisa berjalan lancar selama 1–2 minggu meskipun ia sedang tidak berada di tempat.", "Memiliki rekam jejak minimal 30 SOP kerja tertulis yang rapi atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penataan alur kerja harian, kerapian dokumen, & daftar tugas (checklist)."], "4": ["Menguasai manajemen rantai pasok (supply chain), skalabilitas operasional multi-cabang/multi-tim, dan manajemen mutu berstandar industri.", "Telah mengelola operasional yang melayani ribuan pesanan/pengguna per bulan selama ≥3 tahun dengan efisiensi dan keandalan tinggi.", "Menuntaskan minimal 60–100 SOP kerja tertulis yang rapi lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat arsitek operasional master (COO level) yang mampu mengubah kerumitan organisasi besar menjadi mesin kerja yang tenang dan presisi.", "Sistem operasional dan budaya mutu yang dibangunnya bertahan puluhan tahun dan menjadi tolok ukur keunggulan di industrinya.", "Melahirkan warisan sistem organisasi tim yang berjalan tertib berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Menyelesaikan pengiriman minimal 10 pesanan pelanggan atau tugas operasional tepat waktu dan sesuai janji kualitas.", "Menata tempat kerja, file digital, dan inventaris barang dengan rapi sehingga mudah ditemukan dalam waktu ≤1 menit.", "Memahami konsep dasar Automation (Systems) dan mampu mempraktikkan otomatisasi pekerjaan berulang dengan rumus, template, atau alat digital secara sederhana tanpa bingung."], "2": ["Berhasil memangkas langkah kerja yang berbelit-belit atau mengotomasi tugas berulang sehingga menghemat waktu kerja ≥20–30%.", "Menjaga tingkat kesalahan operasional (barang salah kirim, cacat layanan, atau keterlambatan) tetap di bawah 5% selama ≥3 bulan.", "Lancar menerapkan otomatisasi pekerjaan berulang dengan rumus, template, atau alat digital secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Usaha atau proyek yang dikelolanya tetap bisa berjalan lancar selama 1–2 minggu meskipun ia sedang tidak berada di tempat.", "Menggunakan indikator kinerja utama (KPI operasional) mingguan untuk memantau kecepatan, kualitas, dan biaya secara objektif.", "Mampu menerapkan konsep Automation (Systems) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah mengelola operasional yang melayani ribuan pesanan/pengguna per bulan selama ≥3 tahun dengan efisiensi dan keandalan tinggi.", "Mampu menggandakan kapasitas produksi atau layanan hingga 3–5× lipat tanpa menurunkan kualitas maupun membuat tim kewalahan.", "Menguasai Automation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang mesin operasional bisnis minim kesalahan berstandar profesional."], "5": ["Sistem operasional dan budaya mutu yang dibangunnya bertahan puluhan tahun dan menjadi tolok ukur keunggulan di industrinya.", "Mewariskan ilmu tata kelola sistem kerja yang memerdekakan pemilik usaha dari jebakan kerja serabutan seumur hidup.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Automation: otomatisasi pekerjaan berulang dengan rumus, template, atau alat digital telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Mampu menuliskan langkah-langkah kerja rutin dari awal sampai akhir (checklist/SOP sederhana) agar tidak ada tahapan yang terlupa.", "Menata tempat kerja, file digital, dan inventaris barang dengan rapi sehingga mudah ditemukan dalam waktu ≤1 menit.", "Mampu mengenali contoh hasil System Architecture yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu merancang Standar Operasional Prosedur (SOP) tertulis yang begitu jelas sehingga orang baru bisa mengikutinya dengan hasil yang sama bagusnya.", "Menjaga tingkat kesalahan operasional (barang salah kirim, cacat layanan, atau keterlambatan) tetap di bawah 5% selama ≥3 bulan.", "Mampu menyelesaikan tantangan System Architecture tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu membangun sistem operasional harian (pengadaan, produksi/layanan, kontrol kualitas, pengiriman, layanan purnajual) yang berjalan rapi.", "Menggunakan indikator kinerja utama (KPI operasional) mingguan untuk memantau kecepatan, kualitas, dan biaya secara objektif.", "Kualitas hasil System Architecture-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai manajemen rantai pasok (supply chain), skalabilitas operasional multi-cabang/multi-tim, dan manajemen mutu berstandar industri.", "Mampu menggandakan kapasitas produksi atau layanan hingga 3–5× lipat tanpa menurunkan kualitas maupun membuat tim kewalahan.", "Mampu membimbing dan mengoreksi praktik System Architecture orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat arsitek operasional master (COO level) yang mampu mengubah kerumitan organisasi besar menjadi mesin kerja yang tenang dan presisi.", "Mewariskan ilmu tata kelola sistem kerja yang memerdekakan pemilik usaha dari jebakan kerja serabutan seumur hidup.", "Menjadi mahaguru/mentor utama di bidang Systems yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Memahami perbedaan mendasar antara Omzet (uang masuk kotor), HPP (modal barang/jasa), Biaya Operasional, dan Laba Bersih.", "Mencatat seluruh pemasukan dan pengeluaran pribadi maupun usaha kecil secara rapi tanpa tercampur selama ≥3 bulan berturut-turut.", "Menyelesaikan minimal 5 latihan awal atau laporan kas bulanan yang akurat & surplus dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu menyusun dan membaca 3 laporan keuangan dasar (Laba-Rugi, Arus Kas/Cashflow, dan Neraca sederhana) secara akurat setiap bulan.", "Menjaga arus kas tetap positif dan memiliki dana cadangan darurat minimal 3–6 bulan biaya operasional.", "Menghasilkan minimal 12–15 laporan kas bulanan yang akurat & surplus pada ranah Budgeting dengan kualitas yang stabil dan terukur."], "3": ["Mampu membuat proyeksi keuangan dan anggaran tahunan yang realistis (deviasi realisasi vs rencana ≤15%) untuk bisnis atau organisasi.", "Berhasil mengelola perputaran kas, stok/piutang, dan efisiensi biaya selama ≥2 tahun sehingga usaha menghasilkan laba bersih yang sehat.", "Memiliki rekam jejak minimal 30 laporan kas bulanan yang akurat & surplus atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pencatatan arus uang masuk-keluar, pemisahan rekening, & anggaran bulanan."], "4": ["Menguasai manajemen keuangan strategis, struktur permodalan, perpajakan yang patuh hukum, serta valuasi bisnis tingkat lanjut.", "Telah mengelola keuangan usaha/unit bisnis bernilai besar selama ≥5 tahun melewati masa ekonomi naik maupun turun dengan selamat.", "Menuntaskan minimal 60–100 laporan kas bulanan yang akurat & surplus lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai kebijaksanaan tata kelola finansial seumur hidup (master capital allocator) yang menjaga kesehatan dan keberlanjutan ekonomi jangka panjang.", "Rekam jejak pengelolaan keuangannya selama puluhan tahun bersih, transparan, tangguh terhadap krisis, dan menghasilkan kemakmuran bersama.", "Melahirkan warisan disiplin anggaran & dana cadangan ≥6 bulan berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Mencatat seluruh pemasukan dan pengeluaran pribadi maupun usaha kecil secara rapi tanpa tercampur selama ≥3 bulan berturut-turut.", "Mampu menghitung titik impas (Break-Even Point: berapa unit harus terjual agar balik modal) untuk sebuah kegiatan/jualan.", "Memahami konsep dasar Financial Modeling (Finance) dan mampu mempraktikkan perhitungan HPP, titik impas (BEP), margin laba, & proyeksi keuangan secara sederhana tanpa bingung."], "2": ["Menjaga arus kas tetap positif dan memiliki dana cadangan darurat minimal 3–6 bulan biaya operasional.", "Menguasai cara menghitung keuntungan per unit (Unit Economics: margin kontribusi, biaya akuisisi pelanggan vs nilai belanja pelanggan).", "Lancar menerapkan perhitungan HPP, titik impas (BEP), margin laba, & proyeksi keuangan secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil mengelola perputaran kas, stok/piutang, dan efisiensi biaya selama ≥2 tahun sehingga usaha menghasilkan laba bersih yang sehat.", "Menguasai evaluasi kelayakan investasi (ROI, Payback Period) sebelum membeli alat mahal atau membuka cabang/produk baru.", "Mampu menerapkan konsep Financial Modeling (Finance) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah mengelola keuangan usaha/unit bisnis bernilai besar selama ≥5 tahun melewati masa ekonomi naik maupun turun dengan selamat.", "Mampu merancang skema bagi hasil, pendanaan, atau alokasi modal yang melipatgandakan nilai perusahaan secara sehat.", "Menguasai Financial Modeling pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang perencanaan finansial presisi (meleset ≤10%) berstandar profesional."], "5": ["Rekam jejak pengelolaan keuangannya selama puluhan tahun bersih, transparan, tangguh terhadap krisis, dan menghasilkan kemakmuran bersama.", "Membimbing banyak wirausahawan agar membangun bisnis di atas fondasi arus kas yang nyata, bukan sekadar bakar uang semu.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Financial Modeling: perhitungan HPP, titik impas (BEP), margin laba, & proyeksi keuangan telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Memahami perbedaan mendasar antara Omzet (uang masuk kotor), HPP (modal barang/jasa), Biaya Operasional, dan Laba Bersih.", "Mampu menghitung titik impas (Break-Even Point: berapa unit harus terjual agar balik modal) untuk sebuah kegiatan/jualan.", "Mampu mengenali contoh hasil Capital Allocation yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu menyusun dan membaca 3 laporan keuangan dasar (Laba-Rugi, Arus Kas/Cashflow, dan Neraca sederhana) secara akurat setiap bulan.", "Menguasai cara menghitung keuntungan per unit (Unit Economics: margin kontribusi, biaya akuisisi pelanggan vs nilai belanja pelanggan).", "Mampu menyelesaikan tantangan Capital Allocation tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu membuat proyeksi keuangan dan anggaran tahunan yang realistis (deviasi realisasi vs rencana ≤15%) untuk bisnis atau organisasi.", "Menguasai evaluasi kelayakan investasi (ROI, Payback Period) sebelum membeli alat mahal atau membuka cabang/produk baru.", "Kualitas hasil Capital Allocation-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai manajemen keuangan strategis, struktur permodalan, perpajakan yang patuh hukum, serta valuasi bisnis tingkat lanjut.", "Mampu merancang skema bagi hasil, pendanaan, atau alokasi modal yang melipatgandakan nilai perusahaan secara sehat.", "Mampu membimbing dan mengoreksi praktik Capital Allocation orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai kebijaksanaan tata kelola finansial seumur hidup (master capital allocator) yang menjaga kesehatan dan keberlanjutan ekonomi jangka panjang.", "Membimbing banyak wirausahawan agar membangun bisnis di atas fondasi arus kas yang nyata, bukan sekadar bakar uang semu.", "Menjadi mahaguru/mentor utama di bidang Finance yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Peka mengamati keluhan atau kesulitan nyata yang sering dialami orang sekitar dan mencatat minimal 10 ide solusi yang layak dibayar.", "Melakukan obrolan wawancara langsung dengan minimal 5 calon pengguna/pembeli potensial sebelum membuat produk.", "Menyelesaikan minimal 5 latihan awal atau positioning produk yang jelas & mudah diingat dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu memetakan kompetitor yang sudah ada di pasar dan menemukan celah keunikan (value proposition) yang membedakan tawarannya.", "Menyelesaikan minimal 5 pengujian pasar kecil (tes pre-order, halaman penawaran, atau sampel produk) dan mendapatkan pembeli berbayar pertama.", "Menghasilkan minimal 12–15 positioning produk yang jelas & mudah diingat pada ranah Positioning dengan kualitas yang stabil dan terukur."], "3": ["Terbukti berhasil menemukan kecocokan produk dan pasar (Product-Market Fit) pada minimal 1–2 lini produk/jasa dengan pelanggan yang kembali membeli (repeat order ≥30%).", "Telah mewawancarai ≥50 pelanggan nyata dan menggunakan masukan mereka untuk menyempurnakan produk hingga unggul di kelasnya.", "Memiliki rekam jejak minimal 30 positioning produk yang jelas & mudah diingat atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penentuan target pembeli spesifik & keunikan produk dibanding pesaing."], "4": ["Menguasai strategi posisi pasar (market positioning) dan penciptaan kategori baru yang membuat produknya menjadi pilihan utama di benak konsumen.", "Berhasil meriset, memvalidasi, dan membesarkan ≥5 produk/unit bisnis hingga mencapai pendapatan berulang yang stabil.", "Menuntaskan minimal 60–100 positioning produk yang jelas & mudah diingat lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat visioner pasar seumur hidup yang mampu melihat peluang besar bertahun-tahun sebelum orang lain menyadarinya.", "Karya bisnis dan produk yang dilahirkannya telah melayani kebutuhan ribuan hingga jutaan pelanggan lintas dekade.", "Melahirkan warisan dominasi ceruk pasar (market niche) berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Berhasil menutup (closing) minimal 3 transaksi penjualan nyata dari hasil usaha sendiri.", "Tidak patah semangat saat ditolak calon pembeli dan mencatat alasan penolakan mereka sebagai bahan perbaikan.", "Memahami konsep dasar Persuasion (Marketing) dan mampu mempraktikkan penyusunan penawaran menarik (copywriting) & teknik negosiasi penjualan secara sederhana tanpa bingung."], "2": ["Menghasilkan minimal 25 transaksi penjualan atau kesepakatan kerja sama dengan rasio keberhasilan (conversion rate) yang terukur.", "Mampu menyusun proposal penawaran dan naskah promosi (copywriting) yang menonjolkan manfaat nyata bagi pembeli, bukan sekadar daftar fitur.", "Lancar menerapkan penyusunan penawaran menarik (copywriting) & teknik negosiasi penjualan secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memiliki rekam jejak ≥100 transaksi penjualan B2C atau ≥15 kontrak B2B bernilai menengah-besar dengan tingkat kepuasan pelanggan tinggi.", "Menguasai seni negosiasi harga dan kontrak yang menjaga margin keuntungan tetap sehat sekaligus membuat klien merasa menang.", "Mampu menerapkan konsep Persuasion (Marketing) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Berhasil memimpin pencapaian target penjualan bernilai besar selama ≥3–5 tahun berturut-turut dengan tingkat retensi pelanggan yang kuat.", "Mampu menutup kesepakatan kemitraan strategis tingkat tinggi (high-ticket / enterprise deals) dengan para pengambil keputusan utama.", "Menguasai Persuasion pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang mesin penjualan dengan konversi tinggi berstandar profesional."], "5": ["Jaringan pelanggan setia dan sistem pemasaran yang dibangunnya terus mengalirkan pertumbuhan usaha selama puluhan tahun.", "Melatih dan melahirkan puluhan tenaga pemasar dan negosiator ulung yang berjualan dengan kejujuran dan nilai tambah.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Persuasion: penyusunan penawaran menarik (copywriting) & teknik negosiasi penjualan telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Selalu melayani pelanggan atau pengguna dengan ramah, cepat tanggap, dan menepati apa yang sudah dijanjikan di awal.", "Memiliki tampilan identitas usaha (nama, logo/visual, profil media, dan cara sapaan) yang rapi dan meyakinkan.", "Mampu mengenali contoh hasil Brand Strategy yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu menangani keluhan atau komplain pelanggan yang kecewa dengan kepala dingin dan mengubahnya menjadi pelanggan yang kembali percaya.", "Memiliki tingkat pembelian ulang (repeat order) atau rekomendasi dari mulut ke mulut (word-of-mouth) dari minimal 25% pelanggan.", "Mampu menyelesaikan tantangan Brand Strategy tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Berhasil membangun merek (brand) yang dikenal memiliki reputasi kualitas dan kejujuran yang kuat di ceruk pasarnya selama ≥2 tahun.", "Membuat program perawatan pelanggan (komunitas pelanggan, apresiasi pelanggan lama) yang berjalan konsisten.", "Kualitas hasil Brand Strategy-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai pembangunan ekuitas merek (brand equity) berskala luas di mana nama mereknya sendiri sudah menjadi jaminan mutu dan kebanggaan pelanggan.", "Berhasil mempertahankan reputasi merek tetap bersih dan dipercaya melewati berbagai tantangan maupun perubahan tren pasar.", "Mampu membimbing dan mengoreksi praktik Brand Strategy orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat pembangun merek legendaris seumur hidup yang dicintai pelanggan lintas generasi selama puluhan tahun.", "Menjadi teladan bahwa bisnis terbaik dibangun di atas ketulusan merawat kepercayaan manusia.", "Menjadi mahaguru/mentor utama di bidang Marketing yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Peka mengamati keluhan atau kesulitan nyata yang sering dialami orang sekitar dan mencatat minimal 10 ide solusi yang layak dibayar.", "Melakukan obrolan wawancara langsung dengan minimal 5 calon pengguna/pembeli potensial sebelum membuat produk.", "Menyelesaikan minimal 5 latihan awal atau validasi ide dengan pembeli berbayar pertama dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu memetakan kompetitor yang sudah ada di pasar dan menemukan celah keunikan (value proposition) yang membedakan tawarannya.", "Menyelesaikan minimal 5 pengujian pasar kecil (tes pre-order, halaman penawaran, atau sampel produk) dan mendapatkan pembeli berbayar pertama.", "Menghasilkan minimal 12–15 validasi ide dengan pembeli berbayar pertama pada ranah Validation dengan kualitas yang stabil dan terukur."], "3": ["Terbukti berhasil menemukan kecocokan produk dan pasar (Product-Market Fit) pada minimal 1–2 lini produk/jasa dengan pelanggan yang kembali membeli (repeat order ≥30%).", "Telah mewawancarai ≥50 pelanggan nyata dan menggunakan masukan mereka untuk menyempurnakan produk hingga unggul di kelasnya.", "Memiliki rekam jejak minimal 30 validasi ide dengan pembeli berbayar pertama atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan wawancara masalah calon pelanggan & uji jual purwarupa (pre-order/MVP)."], "4": ["Menguasai strategi posisi pasar (market positioning) dan penciptaan kategori baru yang membuat produknya menjadi pilihan utama di benak konsumen.", "Berhasil meriset, memvalidasi, dan membesarkan ≥5 produk/unit bisnis hingga mencapai pendapatan berulang yang stabil.", "Menuntaskan minimal 60–100 validasi ide dengan pembeli berbayar pertama lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat visioner pasar seumur hidup yang mampu melihat peluang besar bertahun-tahun sebelum orang lain menyadarinya.", "Karya bisnis dan produk yang dilahirkannya telah melayani kebutuhan ribuan hingga jutaan pelanggan lintas dekade.", "Melahirkan warisan kecocokan produk-pasar (repeat order ≥30%) berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Belajar langsung dari pengalaman jualan dan operasional sendiri, serta berani memperbaiki kesalahan dengan cepat.", "Memisahkan rekening uang pribadi dengan uang putaran usaha sejak hari pertama.", "Memahami konsep dasar Business Building (Entrepreneurship) dan mampu mempraktikkan pembangunan operasional usaha, tim, & pendapatan rutin yang sehat secara sederhana tanpa bingung."], "2": ["Mampu memutar kembali keuntungan usaha (reinvestasi) untuk meningkatkan kualitas produk, alat kerja, atau jangkauan pasar.", "Mulai membangun kemandirian waktu dengan mendelegasikan sebagian pekerjaan teknis/operasional kepada tim atau mitra.", "Lancar menerapkan pembangunan operasional usaha, tim, & pendapatan rutin yang sehat secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Bisnisnya memiliki sistem akuisisi pelanggan, operasional, dan keuangan yang rapi sehingga tidak bergantung 100% pada kehadiran fisiknya setiap jam.", "Menjalankan usaha yang tidak hanya mengejar keuntungan uang, tetapi juga memberi manfaat nyata bagi pelanggan, tim, dan masyarakat.", "Mampu menerapkan konsep Business Building (Entrepreneurship) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah membangun bisnis yang bertahan sehat ≥5–10 tahun, menghidupi banyak keluarga karyawan, dan menjadi pemimpin di ceruk industrinya.", "Aktif membimbing, mendukung, atau berinvestasi pada wirausahawan muda agar lahir lebih banyak pencipta lapangan kerja yang sehat.", "Menguasai Business Building pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang perusahaan tangguh yang membuka lapangan kerja berstandar profesional."], "5": ["Ekosistem usaha yang dibangunnya selama puluhan tahun terus mengalirkan nilai ekonomi, lapangan kerja, dan filantropi/dampak sosial yang luas.", "Meninggalkan warisan institusi dan teladan kewirausahaan yang mulia bagi generasi penerus.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Business Building: pembangunan operasional usaha, tim, & pendapatan rutin yang sehat telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Mampu meluncurkan 1 inisiatif usaha/karya mandiri dari nol dengan modal seadanya (bootstrapping) hingga menghasilkan pendapatan nyata pertama.", "Memisahkan rekening uang pribadi dengan uang putaran usaha sejak hari pertama.", "Mampu mengenali contoh hasil Venture Creation yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Berhasil menjaga usaha rintisannya bertahan dan menghasilkan laba bersih positif secara mandiri selama minimal 6–12 bulan berturut-turut.", "Mulai membangun kemandirian waktu dengan mendelegasikan sebagian pekerjaan teknis/operasional kepada tim atau mitra.", "Mampu menyelesaikan tantangan Venture Creation tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Berhasil membesarkan usaha hingga berjalan stabil selama ≥2–3 tahun, membuka lapangan kerja nyata bagi orang lain, dan tahan guncangan pasar.", "Menjalankan usaha yang tidak hanya mengejar keuntungan uang, tetapi juga memberi manfaat nyata bagi pelanggan, tim, dan masyarakat.", "Kualitas hasil Venture Creation-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai seni membangun dan melipatgandakan nilai bisnis (business scaling / serial entrepreneurship) hingga beromzet dan berdampak besar.", "Aktif membimbing, mendukung, atau berinvestasi pada wirausahawan muda agar lahir lebih banyak pencipta lapangan kerja yang sehat.", "Mampu membimbing dan mengoreksi praktik Venture Creation orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai puncak wirausahawan pembangun peradaban seumur hidup (master enterprise builder) yang karyanya melampaui satu generasi.", "Meninggalkan warisan institusi dan teladan kewirausahaan yang mulia bagi generasi penerus.", "Menjadi mahaguru/mentor utama di bidang Entrepreneurship yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "content-creating": {"0": {"1": ["Memiliki buku/aplikasi bank ide dan mencatat minimal 25 ide topik konten yang berangkat dari pertanyaan atau masalah audiens.", "Mampu merangkum 1 topik yang baru dipelajari menjadi kerangka cerita singkat (Pembuka/Hook, Isi Utama, Penutup/Ajakan) dalam ≤15 menit.", "Menyelesaikan minimal 5 latihan awal atau sesi curah ide (brainstorming) menghasilkan ≥20 topik dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu membuat kalimat pembuka (hook 3 detik / paragraf pertama) yang langsung memancing rasa penasaran tanpa menipu (anti clickbait bohong).", "Menyusun kalender konten dan menyelesaikan minimal 20 naskah/outline konten yang terstruktur dan bernilai edukasi atau hiburan sehat.", "Menghasilkan minimal 12–15 sesi curah ide (brainstorming) menghasilkan ≥20 topik pada ranah Brainstorming dengan kualitas yang stabil dan terukur."], "3": ["Memiliki sistem riset dan pengembangan ide yang tidak pernah kering: mampu menghasilkan ≥60 konten berkualitas tinggi secara konsisten tanpa kehabisan bahan.", "Menguasai teknik bercerita (storytelling) yang memadukan data akurat, kisah nyata, dan emosi sehingga penonton betah menyimak sampai akhir.", "Memiliki rekam jejak minimal 30 sesi curah ide (brainstorming) menghasilkan ≥20 topik atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pencatatan bank ide harian dari keresahan & pertanyaan nyata audiens."], "4": ["Menjadi perancang ide dan penulis naskah tingkat mahir yang karyanya sering dibagikan ulang (share/save tinggi) karena kedalaman isinya.", "Telah memproduksi ≥150 naskah/konsep konten lintas tahun yang membangun kepercayaan dan otoritas kuat di bidangnya.", "Menuntaskan minimal 60–100 sesi curah ide (brainstorming) menghasilkan ≥20 topik lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat pemikir dan pencerita konten master seumur hidup yang setiap karyanya selalu ditunggu dan memberi pencerahan.", "Kumpulan ide, tulisan, dan narasi yang dilahirkannya selama bertahun-tahun menjadi rujukan pemikiran di bidangnya.", "Melahirkan warisan sistem penghasil ide segar yang tak pernah kering berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Mampu merangkum 1 topik yang baru dipelajari menjadi kerangka cerita singkat (Pembuka/Hook, Isi Utama, Penutup/Ajakan) dalam ≤15 menit.", "Menyelesaikan riset dan draf untuk minimal 5 konten pertama sampai siap diproduksi.", "Memahami konsep dasar Concept Development (Ideation) dan mampu mempraktikkan pengembangan ide mentah menjadi kerangka konsep, sudut pandang, & hook kuat secara sederhana tanpa bingung."], "2": ["Menyusun kalender konten dan menyelesaikan minimal 20 naskah/outline konten yang terstruktur dan bernilai edukasi atau hiburan sehat.", "Menguasai cara mengubah 1 topik riset mendalam menjadi minimal 3 sudut pandang konten yang berbeda.", "Lancar menerapkan pengembangan ide mentah menjadi kerangka konsep, sudut pandang, & hook kuat secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menguasai teknik bercerita (storytelling) yang memadukan data akurat, kisah nyata, dan emosi sehingga penonton betah menyimak sampai akhir.", "Mampu menjelaskan topik yang rumit menjadi bahasa sehari-hari yang mudah dipahami anak SMP sekalipun.", "Mampu menerapkan konsep Concept Development (Ideation) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah memproduksi ≥150 naskah/konsep konten lintas tahun yang membangun kepercayaan dan otoritas kuat di bidangnya.", "Mampu memimpin sesi curah ide (brainstorming) dan menyunting naskah kreator lain hingga daya pikatnya meningkat berlipat ganda.", "Menguasai Concept Development pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang seri konsep konten unggulan berdaya pikat tinggi berstandar profesional."], "5": ["Kumpulan ide, tulisan, dan narasi yang dilahirkannya selama bertahun-tahun menjadi rujukan pemikiran di bidangnya.", "Mewariskan metode riset dan penceritaan yang jujur, mendalam, dan berdampak luas bagi generasi kreator baru.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Concept Development: pengembangan ide mentah menjadi kerangka konsep, sudut pandang, & hook kuat telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Memiliki buku/aplikasi bank ide dan mencatat minimal 25 ide topik konten yang berangkat dari pertanyaan atau masalah audiens.", "Menyelesaikan riset dan draf untuk minimal 5 konten pertama sampai siap diproduksi.", "Mampu mengenali contoh hasil Originality yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu membuat kalimat pembuka (hook 3 detik / paragraf pertama) yang langsung memancing rasa penasaran tanpa menipu (anti clickbait bohong).", "Menguasai cara mengubah 1 topik riset mendalam menjadi minimal 3 sudut pandang konten yang berbeda.", "Mampu menyelesaikan tantangan Originality tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Memiliki sistem riset dan pengembangan ide yang tidak pernah kering: mampu menghasilkan ≥60 konten berkualitas tinggi secara konsisten tanpa kehabisan bahan.", "Mampu menjelaskan topik yang rumit menjadi bahasa sehari-hari yang mudah dipahami anak SMP sekalipun.", "Kualitas hasil Originality-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menjadi perancang ide dan penulis naskah tingkat mahir yang karyanya sering dibagikan ulang (share/save tinggi) karena kedalaman isinya.", "Mampu memimpin sesi curah ide (brainstorming) dan menyunting naskah kreator lain hingga daya pikatnya meningkat berlipat ganda.", "Mampu membimbing dan mengoreksi praktik Originality orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat pemikir dan pencerita konten master seumur hidup yang setiap karyanya selalu ditunggu dan memberi pencerahan.", "Mewariskan metode riset dan penceritaan yang jujur, mendalam, dan berdampak luas bagi generasi kreator baru.", "Menjadi mahaguru/mentor utama di bidang Ideation yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mampu menulis artikel pendek, utas (thread), atau takarir (caption) sepanjang 150–300 kata yang rapi, bebas salah ketik, dan enak dibaca.", "Menerbitkan minimal 10 tulisan di blog, media sosial, atau buletin dengan gagasan utama yang jelas.", "Menyelesaikan minimal 5 latihan awal atau konten bercerita yang runtut & enak diikuti dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai struktur tulisan persuasif (seperti AIDA atau Masalah–Solusi–Bukti–Ajakan) dan mampu menulis artikel mendalam 500–1.000 kata.", "Telah menerbitkan minimal 25 karya tulis/esai yang mendapatkan respons diskusi atau apresiasi nyata dari pembaca.", "Menghasilkan minimal 12–15 konten bercerita yang runtut & enak diikuti pada ranah Narrative dengan kualitas yang stabil dan terukur."], "3": ["Memiliki suara tulisan (writing voice) yang khas, jernih, dan memikat: pembaca betah membaca tulisannya dari kalimat pertama hingga titik terakhir.", "Telah menghasilkan ≥60 karya tulis berkualitas (artikel panjang, buletin/newsletter rutin, atau naskah mendalam) selama ≥1 tahun konsisten.", "Memiliki rekam jejak minimal 30 konten bercerita yang runtut & enak diikuti atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penyusunan struktur cerita (pembuka memikat, konflik/isi, & kesimpulan)."], "4": ["Mampu menulis karya panjang berskala besar (buku, seri esai komprehensif, atau naskah dokumenter) dengan riset dan struktur yang sangat rapi.", "Telah menerbitkan ≥120 artikel/esai mendalam atau ≥1–2 buku/e-book utuh yang dibaca oleh ribuan orang.", "Menuntaskan minimal 60–100 konten bercerita yang runtut & enak diikuti lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan seni menulis tingkat sastrawan/penulis master seumur hidup yang kata-katanya tetap relevan lintas dekade.", "Melahirkan warisan buku dan karya tulis yang terus dicetak ulang, dikutip, dan mengubah cara pandang banyak pembaca.", "Melahirkan warisan penceritaan memukau dengan retensi tonton tinggi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Menerbitkan minimal 10 tulisan di blog, media sosial, atau buletin dengan gagasan utama yang jelas.", "Menggunakan paragraf pendek dan poin-poin agar pembaca tidak lelah melihat tembok teks.", "Memahami konsep dasar Emotional Resonance (Storytelling) dan mampu mempraktikkan penggunaan kisah nyata, empati, & nada bicara yang menyentuh perasaan secara sederhana tanpa bingung."], "2": ["Telah menerbitkan minimal 25 karya tulis/esai yang mendapatkan respons diskusi atau apresiasi nyata dari pembaca.", "Mampu menyunting (self-editing) draf tulisannya sendiri dengan memangkas minimal 20% kata yang bertele-tele agar kalimat lebih bertenaga.", "Lancar menerapkan penggunaan kisah nyata, empati, & nada bicara yang menyentuh perasaan secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Telah menghasilkan ≥60 karya tulis berkualitas (artikel panjang, buletin/newsletter rutin, atau naskah mendalam) selama ≥1 tahun konsisten.", "Tulisannya terbukti mampu menggerakkan pembaca untuk berpikir baru, membagikan tulisan tersebut, atau mengambil tindakan nyata.", "Mampu menerapkan konsep Emotional Resonance (Storytelling) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah menerbitkan ≥120 artikel/esai mendalam atau ≥1–2 buku/e-book utuh yang dibaca oleh ribuan orang.", "Menjadi editor atau mentor penulisan yang dipercaya untuk mengasah kualitas naskah penulis lain.", "Menguasai Emotional Resonance pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang ikatan emosional kuat dengan ribuan audiens berstandar profesional."], "5": ["Melahirkan warisan buku dan karya tulis yang terus dicetak ulang, dikutip, dan mengubah cara pandang banyak pembaca.", "Menjadi teladan kejernihan bahasa, kejujuran argumen, dan keindahan tutur kata.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Emotional Resonance: penggunaan kisah nyata, empati, & nada bicara yang menyentuh perasaan telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Mampu menulis artikel pendek, utas (thread), atau takarir (caption) sepanjang 150–300 kata yang rapi, bebas salah ketik, dan enak dibaca.", "Menggunakan paragraf pendek dan poin-poin agar pembaca tidak lelah melihat tembok teks.", "Mampu mengenali contoh hasil Mythmaking yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai struktur tulisan persuasif (seperti AIDA atau Masalah–Solusi–Bukti–Ajakan) dan mampu menulis artikel mendalam 500–1.000 kata.", "Mampu menyunting (self-editing) draf tulisannya sendiri dengan memangkas minimal 20% kata yang bertele-tele agar kalimat lebih bertenaga.", "Mampu menyelesaikan tantangan Mythmaking tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Memiliki suara tulisan (writing voice) yang khas, jernih, dan memikat: pembaca betah membaca tulisannya dari kalimat pertama hingga titik terakhir.", "Tulisannya terbukti mampu menggerakkan pembaca untuk berpikir baru, membagikan tulisan tersebut, atau mengambil tindakan nyata.", "Kualitas hasil Mythmaking-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu menulis karya panjang berskala besar (buku, seri esai komprehensif, atau naskah dokumenter) dengan riset dan struktur yang sangat rapi.", "Menjadi editor atau mentor penulisan yang dipercaya untuk mengasah kualitas naskah penulis lain.", "Mampu membimbing dan mengoreksi praktik Mythmaking orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai penguasaan seni menulis tingkat sastrawan/penulis master seumur hidup yang kata-katanya tetap relevan lintas dekade.", "Menjadi teladan kejernihan bahasa, kejujuran argumen, dan keindahan tutur kata.", "Menjadi mahaguru/mentor utama di bidang Storytelling yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Menguasai langkah dasar penyuntingan video (memotong bagian jeda/salah ucap, menyambung klip, menambahkan teks judul, dan mengatur volume musik latar).", "Menyelesaikan penyuntingan minimal 5 video pendek (Reels/Shorts/TikTok) atau 2 video panjang hingga siap unggah.", "Menyelesaikan minimal 5 latihan awal atau karya suntingan yang bersih & tidak membosankan dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu mengatur ritme potongan gambar (pacing), memasukkan B-Roll di saat yang tepat, serta menambahkan efek suara (SFX) halus yang menjaga perhatian penonton.", "Menyelesaikan penyuntingan ≥20 video dengan alur yang mulus (tidak membosankan) dan teks takarir (subtitle) yang rapi.", "Menghasilkan minimal 12–15 karya suntingan yang bersih & tidak membosankan pada ranah Editing dengan kualitas yang stabil dan terukur."], "3": ["Menguasai teknik penyuntingan bercerita (narrative editing), pergerakan grafik ringan (motion graphics dasar), dan perancangan tata suara (sound design) berlapis.", "Telah menyunting ≥50 karya video dengan rata-rata durasi tonton (retention rate) yang tinggi karena alur penyuntingannya sangat memikat.", "Memiliki rekam jejak minimal 30 karya suntingan yang bersih & tidak membosankan atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pemotongan klip, perapian suara, penambahan teks, & ritme video/tulisan."], "4": ["Menguasai penyuntingan tingkat lanjut dan color grading sinematik untuk video berdurasi panjang, dokumenter, atau iklan berkualitas studio.", "Telah menyelesaikan ≥120 proyek pascaproduksi video dengan standar presisi frame, audio, dan visual yang diakui secara luas.", "Menuntaskan minimal 60–100 karya suntingan yang bersih & tidak membosankan lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat master editor dan storyteller pascaproduksi yang sentuhan ritme potongannya memberi nyawa pada setiap karya.", "Karya-karya suntingannya selama bertahun-tahun ditonton oleh ratusan ribu hingga jutaan orang dan menjadi standar rujukan.", "Melahirkan warisan standar editing profesional yang cepat & memikat berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Menyelesaikan minimal 10 desain visual konten menggunakan maksimal 2 jenis huruf dan palet warna yang serasi.", "Tidak menumpuk terlalu banyak tulisan kecil di dalam satu gambar sampul.", "Memahami konsep dasar Art Direction (Production) dan mampu mempraktikkan penataan warna, pencahayaan kamera, tipografi, & kemasan sampul (thumbnail) secara sederhana tanpa bingung."], "2": ["Telah merancang ≥25 thumbnail atau carousel edukatif yang memiliki ciri khas tata letak dan warna yang konsisten.", "Melakukan uji coba minimal 2 alternatif desain sampul dan judul untuk melihat mana yang lebih disukai penonton.", "Lancar menerapkan penataan warna, pencahayaan kamera, tipografi, & kemasan sampul (thumbnail) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Telah menghasilkan ≥60 desain kemasan konten (thumbnail, infografik, carousel) dengan tingkat rasio klik (CTR) dan simpan (save) di atas rata-rata.", "Mampu mengubah konsep abstrak menjadi ilustrasi atau diagram visual satu layar yang langsung dipahami dalam 3 detik.", "Mampu menerapkan konsep Art Direction (Production) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Ratusan kemasan visual karyanya menjadi rujukan tren desain konten yang bersih, cerdas, dan berkelas.", "Mampu membangun sistem template desain untuk tim sehingga kualitas visual selalu terjaga meski diproduksi dalam jumlah banyak.", "Menguasai Art Direction pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang identitas visual (visual branding) yang langsung dikenali berstandar profesional."], "5": ["Identitas visual yang dirancangnya bertahan relevan selama bertahun-tahun dan mengangkat standar estetika di bidangnya.", "Menjadi mentor bagi banyak kreator dalam seni mengemas ilmu menjadi visual yang indah.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Art Direction: penataan warna, pencahayaan kamera, tipografi, & kemasan sampul (thumbnail) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Mampu mengambil rekaman video atau foto menggunakan kamera HP/kamera dasar dengan gambar yang fokus, stabil (tidak goyang parah), dan pencahayaan wajah yang terang.", "Menyelesaikan pengambilan gambar untuk minimal 5 konten video dari awal hingga akhir.", "Mampu mengenali contoh hasil Creative Direction yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai aturan komposisi kamera (jarak gambar wide/medium/close-up, sudut pandang mata) dan tata cahaya dasar 2–3 titik (key light, fill, backlight).", "Menggunakan mikrofon eksternal (clip-on/lavalier atau shotgun/condenser) dengan level suara yang bersih dan konsisten.", "Mampu menyelesaikan tantangan Creative Direction tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu merancang tampilan visual (visual look) yang sinematik dan khas untuk setiap video, lengkap dengan pengambilan gambar sisipan (B-Roll) yang bercerita.", "Mampu mengarahkan diri sendiri maupun orang lain (narasumber/model) di depan kamera agar tampil nyaman dan meyakinkan.", "Kualitas hasil Creative Direction-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai sinematografi dan produksi audiovisual tingkat profesional (pengaturan profil warna/log, tata cahaya mood kompleks, multi-kamera).", "Mampu beradaptasi cepat menghasilkan gambar dan suara berkualitas tinggi bahkan di lokasi lapangan yang sempit atau minim cahaya.", "Mampu membimbing dan mengoreksi praktik Creative Direction orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat pengarah visual dan sinematografer master yang mampu melukis emosi dan cerita lewat bingkai kamera.", "Membimbing banyak kreator visual dalam menguasai bahasa kamera dan pencahayaan.", "Menjadi mahaguru/mentor utama di bidang Production yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Menetapkan jadwal khusus setiap minggu untuk membuat konten (misal: 1 hari khusus menulis/rekaman) agar tidak dibuat secara mendadak.", "Berhasil menerbitkan minimal 1 konten per minggu secara rutin selama ≥8 minggu berturut-turut tanpa putus.", "Menyelesaikan minimal 5 latihan awal atau konsistensi terbit konten tanpa bolong dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai sistem kerja borongan (batching): menulis beberapa naskah sekaligus dan merekam 3–4 video dalam satu sesi persiapan.", "Memiliki tabungan konten siap tayang (buffer) minimal untuk 1–2 minggu ke depan sehingga tetap tenang saat sedang sakit atau sibuk.", "Menghasilkan minimal 12–15 konsistensi terbit konten tanpa bolong pada ranah Publishing dengan kualitas yang stabil dan terukur."], "3": ["Memiliki sistem pipa produksi (content pipeline) dari bank ide, draf, syuting, editing, hingga jadwal tayang yang berjalan bak mesin selama ≥1–2 tahun.", "Mampu mendelegasikan sebagian tahapan teknis (seperti pemotongan kasar video, pembuatan subtitle, atau desain grafis) dengan panduan standar yang jelas.", "Memiliki rekam jejak minimal 30 konsistensi terbit konten tanpa bolong atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pengunggahan konten terjadwal dengan judul, deskripsi, & format yang tepat."], "4": ["Menguasai manajemen rumah produksi konten (media studio workflow) yang mampu menghasilkan konten multi-format secara konsisten dan efisien.", "Telah menjaga ritme berkarya selama ≥3–5 tahun tanpa putus sambil tetap memiliki waktu luang untuk belajar dan beristirahat.", "Menuntaskan minimal 60–100 konsistensi terbit konten tanpa bolong lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai disiplin pengrajin karya seumur hidup (master craftsman workflow) yang mampu terus berkarya produktif selama puluhan tahun.", "Sistem kerja yang dibangunnya membuktikan bahwa kreativitas tingkat tinggi lahir dari kebiasaan yang teratur dan tenang.", "Melahirkan warisan katalog ratusan karya terpublikasi rapi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Mengunggah minimal 10 konten secara konsisten dengan judul, deskripsi, dan kategori yang relevan agar mudah ditemukan.", "Mampu membaca angka analitik paling dasar (jumlah tayangan, suka, komentar, dan dibagikan) tanpa terobsesi berlebihan.", "Memahami konsep dasar Growth Strategy (Distribution) dan mampu mempraktikkan pembacaan data analitik (CTR, retensi) & daur ulang konten lintas platform secara sederhana tanpa bingung."], "2": ["Menerapkan strategi daur ulang cerdas (repurposing): mengubah 1 konten utama menjadi 3–4 format turunan untuk platform berbeda.", "Menjaga konsistensi jadwal publikasi selama ≥3–6 bulan berturut-turut.", "Lancar menerapkan pembacaan data analitik (CTR, retensi) & daur ulang konten lintas platform secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil menumbuhkan kanal/akun secara organik selama ≥1–2 tahun hingga menjangkau ribuan penonton setia yang tepat sasaran.", "Menggunakan data analitik sebagai kompas perbaikan isi konten, namun tetap menjaga keaslian suara dan idealisme karya.", "Mampu menerapkan konsep Growth Strategy (Distribution) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah mengelola kanal/media yang mengumpulkan puluhan ribu hingga ratusan ribu penonton/pembaca organik lintas tahun.", "Mampu memprediksi perubahan pola konsumsi audiens dan beradaptasi tanpa kehilangan jati diri kanalnya.", "Menguasai Growth Strategy pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang mesin pertumbuhan audiens setia secara berkelanjutan berstandar profesional."], "5": ["Karya-karyanya terus ditemukan dan memberi manfaat bagi penonton baru bahkan bertahun-tahun setelah pertama kali diunggah.", "Membimbing banyak kreator agar menjadi tuan atas karya mereka, bukan sekadar budak algoritma sesaat.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Growth Strategy: pembacaan data analitik (CTR, retensi) & daur ulang konten lintas platform telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Selalu mencantumkan sumber kutipan/referensi dan menggunakan musik atau gambar yang bebas pelanggaran hak cipta (lisensi resmi/royalty-free).", "Memahami berbagai cara sehat seorang kreator mendapatkan penghasilan (karya digital, jasa keahlian, kemitraan merek, dukungan karya).", "Mampu mengenali contoh hasil Media Ecosystem yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mulai menghasilkan pendapatan nyata pertama dari aktivitas berkarya (penjualan produk digital/buku, jasa profesional, komisi, atau sponsor yang selaras).", "Memberikan keterangan jujur dan transparan setiap kali menayangkan konten berbayar atau bersponsor.", "Mampu menyelesaikan tantangan Media Ecosystem tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Berhasil membangun kemandirian ekonomi kreatif dari karyanya selama ≥1–2 tahun melalui minimal 2–3 sumber pendapatan yang sehat dan etis.", "Tetap teguh menjaga standar kejujuran dan nilai moral meskipun ditawari bayaran besar oleh pihak yang bertentangan dengan prinsipnya.", "Kualitas hasil Media Ecosystem-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai pengelolaan Kekayaan Intelektual (IP) dan model bisnis media/kreator mandiri yang berkelanjutan selama ≥3–5 tahun.", "Menjadi bukti nyata bahwa konten yang mendidik dan berintegritas tinggi juga memiliki nilai ekonomi yang kuat.", "Mampu membimbing dan mengoreksi praktik Media Ecosystem orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai puncak kedaulatan kreator seumur hidup: membangun warisan karya intelektual (legacy IP) yang terus memberi manfaat dan nilai lintas dekade.", "Menginspirasi generasi kreator masa depan untuk berkarya demi kemuliaan nilai dan kebaikan sesama.", "Menjadi mahaguru/mentor utama di bidang Distribution yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "art": {"0": {"1": ["Memahami prinsip dasar desain tata letak: kerapian rata kiri/kanan (alignment), jarak antar elemen, dan keterbacaan huruf.", "Menyelesaikan minimal 10 karya desain terapan sederhana (poster acara, sampul buku, atau slide presentasi).", "Menyelesaikan minimal 5 latihan awal atau desain halaman/poster yang rapi & mudah dibaca dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai penggunaan sistem grid, hierarki ukuran teks (judul, subjudul, isi), dan keseimbangan elemen grafis.", "Menyelesaikan minimal 20 proyek desain visual nyata untuk kebutuhan komunitas, organisasi, atau klien.", "Menghasilkan minimal 12–15 desain halaman/poster yang rapi & mudah dibaca pada ranah Layout dengan kualitas yang stabil dan terukur."], "3": ["Mampu merancang identitas visual lengkap (logo, palet warna, aturan tipografi, dan template media) yang konsisten.", "Menyelesaikan minimal 10 proyek branding/identitas visual atau publikasi multi-halaman yang terpakai di dunia nyata.", "Memiliki rekam jejak minimal 30 desain halaman/poster yang rapi & mudah dibaca atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penataan tata letak (layout), rataan elemen, & ruang kosong (white space)."], "4": ["Menguasai pengarahan sistem desain berskala besar (buku, pameran, kampanye lintas media, atau antarmuka digital).", "Memimpin ≥25 proyek desain strategis dari riset konsep hingga produksi akhir dengan standar industri tertinggi.", "Menuntaskan minimal 60–100 desain halaman/poster yang rapi & mudah dibaca lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan komunikasi visual tingkat maestro di mana fungsi informasi dan keindahan menyatu tanpa cela.", "Karya desain dan sistem identitas yang dirancang tetap relevan dan digunakan oleh publik/institusi selama bertahun-tahun.", "Melahirkan warisan sistem tata letak grid yang harmonis berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Menyelesaikan minimal 15 lembar latihan sketsa garis dan bentuk dasar (masing-masing ≥15 menit fokus).", "Dapat menyalin proporsi objek sederhana di meja (gelas, buku, botol) dengan kemiripan bentuk yang wajar.", "Memahami konsep dasar Spatial Design (Spatial Art) dan mampu mempraktikkan perancangan kedalaman ruang 3D, perspektif, & alur gerak di dalam ruang secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 30 sketsa observasi objek nyata atau ruangan dari berbagai sudut pandang.", "Mampu menggambar sketsa objek nyata dalam waktu ≤15 menit dengan proporsi dan sudut ruang yang akurat.", "Lancar menerapkan perancangan kedalaman ruang 3D, perspektif, & alur gerak di dalam ruang secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan buku sketsa (sketchbook) berisi ≥100 halaman gambar observasi, gestur tubuh, dan konstruksi ruang.", "Dapat menggambar pose manusia atau pemandangan kompleks langsung dari imajinasi tanpa proporsi yang janggal.", "Mampu menerapkan konsep Spatial Design (Spatial Art) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Menyelesaikan minimal 250 karya studi anatomi dan perspektif tingkat lanjut yang rapi dan layak jadi acuan belajar.", "Mampu melakukan live sketching (menggambar langsung di lokasi ramai) hanya dalam 5–10 menit dengan garis yang hidup.", "Menguasai Spatial Design pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang rancangan tata ruang yang fungsional & indah berstandar profesional."], "5": ["Memiliki rekam jejak ≥1.000 sketsa/gambar konstruksi selama bertahun-tahun dan membimbing perupa lain.", "Gaya goresan dan konstruksi gambarnya menjadi rujukan standar kualitas di komunitas seni atau studio profesional.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Spatial Design: perancangan kedalaman ruang 3D, perspektif, & alur gerak di dalam ruang telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Memahami aturan komposisi dasar seperti Rule of Thirds, titik fokus utama (focal point), dan keseimbangan kiri-kanan.", "Mampu menata elemen gambar agar mata penonton langsung tertuju ke objek utama dalam 3 detik pertama.", "Mampu mengenali contoh hasil Environmental Experience yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu membagi kedalaman ruang (depan/foreground, tengah/midground, belakang/background) dan membuat garis pengarah mata.", "Selalu menyiapkan minimal 3 opsi komposisi thumbnail berbeda untuk setiap karya dan memilih yang paling kuat ceritanya.", "Mampu menyelesaikan tantangan Environmental Experience tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai irama bentuk, ruang kosong (negative space), dan kontras ukuran untuk menciptakan kesan megah, tegang, atau tenang.", "Penonton dapat langsung menangkap emosi dan jalan cerita dari gambar tersebut hanya dalam sekali pandang.", "Kualitas hasil Environmental Experience-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu menyusun komposisi adegan kompleks dengan banyak karakter dan detail arsitektur tanpa terlihat berantakan.", "Mampu membedah dan memperbaiki komposisi visual karya orang lain secara instan agar daya pikatnya meningkat drastis.", "Mampu membimbing dan mengoreksi praktik Environmental Experience orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai penguasaan komposisi tingkat legendaris di mana setiap sudut kanvas punya makna dan memikat mata penonton.", "Menjadi pengarah seni (art director) atau mentor utama yang membentuk standar penceritaan visual tingkat tinggi.", "Menjadi mahaguru/mentor utama di bidang Spatial Art yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mampu menggambar bentuk dasar 3D (kubus, silinder, bola) dan garis lurus/lengkung dengan tangan bebas tanpa penggaris.", "Menyelesaikan minimal 15 lembar latihan sketsa garis dan bentuk dasar (masing-masing ≥15 menit fokus).", "Menyelesaikan minimal 5 latihan awal atau sketsa & lukisan observasi yang akurat dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai gambar perspektif 1 titik dan 2 titik lenyap serta proporsi dasar tubuh manusia (8 kepala).", "Menyelesaikan minimal 30 sketsa observasi objek nyata atau ruangan dari berbagai sudut pandang.", "Menghasilkan minimal 12–15 sketsa & lukisan observasi yang akurat pada ranah Representation dengan kualitas yang stabil dan terukur."], "3": ["Lancar menerapkan perspektif 3 titik lenyap, foreshortening (objek memendek ke depan), dan pose anatomi bergerak.", "Menyelesaikan buku sketsa (sketchbook) berisi ≥100 halaman gambar observasi, gestur tubuh, dan konstruksi ruang.", "Memiliki rekam jejak minimal 30 sketsa & lukisan observasi yang akurat atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penggambaran bentuk objek nyata, proporsi anatomi, & gelap-terang (shading)."], "4": ["Menguasai konstruksi bentuk organik maupun mekanis dari sudut ekstrem (bird's-eye / worm's-eye view) di luar kepala.", "Menyelesaikan minimal 250 karya studi anatomi dan perspektif tingkat lanjut yang rapi dan layak jadi acuan belajar.", "Menuntaskan minimal 60–100 sketsa & lukisan observasi yang akurat lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan garis dan bentuk tingkat master di mana satu tarikan garis langsung menangkap volume dan gerak objek.", "Memiliki rekam jejak ≥1.000 sketsa/gambar konstruksi selama bertahun-tahun dan membimbing perupa lain.", "Melahirkan warisan penguasaan gambar representasional di luar kepala berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Menyelesaikan minimal 10 karya orisinal buatan sendiri dengan tema yang paling diminati.", "Mampu menyebutkan 3 ciri visual (pilihan warna, bentuk garis, atau tema) yang paling sering muncul di karyanya.", "Memahami konsep dasar Stylization (Visual Art) dan mampu mempraktikkan penyederhanaan & pembongkaran bentuk nyata menjadi gaya visual yang unik secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 1 seri karya berisi ≥5 gambar dengan tema dan gaya visual yang seragam.", "Teman atau pengikut mulai bisa mengenali karyanya tanpa harus melihat nama pembuatnya terlebih dahulu.", "Lancar menerapkan penyederhanaan & pembongkaran bentuk nyata menjadi gaya visual yang unik secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan minimal 3 seri karya tematik (total ≥25 karya orisinal) yang punya benang merah filosofi dan gaya.", "Mampu mempertahankan ciri khas visualnya meskipun mengerjakan berbagai topik atau pesanan yang berbeda.", "Mampu menerapkan konsep Stylization (Visual Art) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Menerbitkan artbook, pameran tunggal/kolektif, atau portofolio berisi ≥60 karya orisinal yang mendapat apresiasi luas.", "Gaya visualnya mulai dijadikan inspirasi atau studi referensi oleh perupa dan kreator muda lainnya.", "Menguasai Stylization pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang ciri khas bentuk (signature style) yang ikonik berstandar profesional."], "5": ["Melahirkan warisan ratusan karya orisinal lintas dekade yang membentuk aliran atau pengaruh kuat di dunia seni.", "Menjadi sosok panutan yang membimbing perupa lain menemukan suara dan jati diri artistik mereka sendiri.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Stylization: penyederhanaan & pembongkaran bentuk nyata menjadi gaya visual yang unik telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Memahami roda warna dasar (primer, sekunder, komplementer) serta cara membedakan terang-gelap (value) pada gambar.", "Dapat menentukan arah datangnya cahaya dan menggambar bayangan jatuh yang konsisten pada objek sederhana.", "Mampu mengenali contoh hasil Visual Language yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu mengatur suhu warna (hangat vs dingin) dan kontras terang-gelap agar objek utama tampak menonjol.", "Dapat melukis objek yang sama dalam 3 suasana cahaya berbeda (pagi, siang terik, senja/malam) dengan meyakinkan.", "Mampu menyelesaikan tantangan Visual Language tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai pantulan cahaya halus (bounce light), cahaya tepi (rim light), serta cara meredam warna agar tidak norak.", "Mampu menebak dan meracik ulang warna apa pun yang dilihat di dunia nyata dalam waktu singkat tanpa alat bantu digital.", "Kualitas hasil Visual Language-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu merancang skema warna (color script) utuh yang mengarahkan emosi penonton dari awal hingga akhir cerita.", "Karya warnanya diakui memiliki ciri khas atmosfer tersendiri oleh kurator, klien, atau komunitas perupa luas.", "Mampu membimbing dan mengoreksi praktik Visual Language orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Menguasai cahaya dan warna tingkat mahaguru: mampu menciptakan ilusi kilau, kedalaman, dan emosi hanya lewat sapuan warna.", "Menjadi rujukan utama dalam tata warna dan pencahayaan visual bagi generasi ilustrator/pelukis berikutnya.", "Menjadi mahaguru/mentor utama di bidang Visual Art yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Memahami aturan komposisi dasar seperti Rule of Thirds, titik fokus utama (focal point), dan keseimbangan kiri-kanan.", "Membuat minimal 20 sketsa kecil (thumbnail) untuk menguji berbagai tata letak sebelum mulai menggambar besar.", "Menyelesaikan minimal 5 latihan awal atau tulisan esai/cerita pendek yang bersih & hidup dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu membagi kedalaman ruang (depan/foreground, tengah/midground, belakang/background) dan membuat garis pengarah mata.", "Menyelesaikan minimal 15 karya ilustrasi yang memiliki latar tempat dan cerita yang jelas tanpa perlu teks penjelasan.", "Menghasilkan minimal 12–15 tulisan esai/cerita pendek yang bersih & hidup pada ranah Writing dengan kualitas yang stabil dan terukur."], "3": ["Menguasai irama bentuk, ruang kosong (negative space), dan kontras ukuran untuk menciptakan kesan megah, tegang, atau tenang.", "Menyelesaikan minimal 35 karya bercerita (visual storytelling) atau rangkaian panel cerita yang mengalir mulus.", "Memiliki rekam jejak minimal 30 tulisan esai/cerita pendek yang bersih & hidup atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penulisan kalimat yang jernih, pilihan diksi tepat, & paragraf yang mengalir."], "4": ["Mampu menyusun komposisi adegan kompleks dengan banyak karakter dan detail arsitektur tanpa terlihat berantakan.", "Menghasilkan ≥60 karya ilustrasi naratif/konsep visual kelas profesional yang digunakan dalam buku, film, gim, atau pameran.", "Menuntaskan minimal 60–100 tulisan esai/cerita pendek yang bersih & hidup lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan komposisi tingkat legendaris di mana setiap sudut kanvas punya makna dan memikat mata penonton.", "Melahirkan karya-karya ikonik sepanjang karier yang terus dikenang dan dipelajari struktur komposisinya selama bertahun-tahun.", "Melahirkan warisan katalog karya tulis yang matang & bernyawa berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Menyelesaikan minimal 10 karya desain terapan sederhana (poster acara, sampul buku, atau slide presentasi).", "Dapat memilih maksimal 2–3 jenis huruf (font) yang serasi dan mudah dibaca dari jarak jauh.", "Memahami konsep dasar Rhetoric (Language Art) dan mampu mempraktikkan penggunaan majas, irama kalimat, & argumen persuasif yang menggerakkan secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 20 proyek desain visual nyata untuk kebutuhan komunitas, organisasi, atau klien.", "Mampu mengubah informasi teks yang padat menjadi infografik atau poster yang rapi dan enak dilihat dalam ≤2 jam.", "Lancar menerapkan penggunaan majas, irama kalimat, & argumen persuasif yang menggerakkan secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan minimal 10 proyek branding/identitas visual atau publikasi multi-halaman yang terpakai di dunia nyata.", "Desain yang dibuat terbukti meningkatkan kejelasan pesan, daya tarik, atau respons audiens secara nyata.", "Mampu menerapkan konsep Rhetoric (Language Art) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memimpin ≥25 proyek desain strategis dari riset konsep hingga produksi akhir dengan standar industri tertinggi.", "Mampu menyusun panduan sistem desain (design system / brand guideline) yang mudah dipakai oleh seluruh anggota tim.", "Menguasai Rhetoric pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang penguasaan retorika bahasa tingkat tinggi berstandar profesional."], "5": ["Karya desain dan sistem identitas yang dirancang tetap relevan dan digunakan oleh publik/institusi selama bertahun-tahun.", "Menjadi direktur kreatif atau mentor utama yang mencetak banyak desainer komunikasi visual berkelas.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Rhetoric: penggunaan majas, irama kalimat, & argumen persuasif yang menggerakkan telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Berani menampilkan karya terbaik di halaman portofolio atau media sosial dengan foto/scan yang bersih dan terang.", "Mampu menceritakan makna dan proses pembuatan karyanya secara singkat dan jelas kepada orang lain.", "Mampu mengenali contoh hasil Literary Craft yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu memilah (kurasi) karya secara ketat: hanya menampilkan karya terbaik yang sesuai dengan tujuan portofolio.", "Menulis pengantar karya (artist statement) yang jujur, ringkas, dan mudah dipahami oleh penonton awam.", "Mampu menyelesaikan tantangan Literary Craft tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai tata cara pengemasan pameran (urutan karya, pencahayaan, bingkai/cetakan) atau penerbitan buku seni.", "Memiliki arsip dokumentasi seluruh karya beserta sertifikat/catatan kepemilikan yang tertata rapi.", "Kualitas hasil Literary Craft-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu mengurasi pameran berskala besar atau memimpin produksi buku seni (artbook) dari konsep hingga cetak.", "Mampu membangun jembatan antara karya seni yang mendalam dengan apresiasi masyarakat luas tanpa kehilangan idealisme.", "Mampu membimbing dan mengoreksi praktik Literary Craft orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai reputasi kurator dan perupa matang yang karyanya menjadi bagian dari catatan sejarah komunitas/budaya.", "Membuka jalan dan membina ekosistem pameran yang sehat bagi puluhan seniman generasi baru.", "Menjadi mahaguru/mentor utama di bidang Language Art yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Memahami aturan komposisi dasar seperti Rule of Thirds, titik fokus utama (focal point), dan keseimbangan kiri-kanan.", "Membuat minimal 20 sketsa kecil (thumbnail) untuk menguji berbagai tata letak sebelum mulai menggambar besar.", "Menyelesaikan minimal 5 latihan awal atau karya dengan komposisi mata yang langsung memikat dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu membagi kedalaman ruang (depan/foreground, tengah/midground, belakang/background) dan membuat garis pengarah mata.", "Menyelesaikan minimal 15 karya ilustrasi yang memiliki latar tempat dan cerita yang jelas tanpa perlu teks penjelasan.", "Menghasilkan minimal 12–15 karya dengan komposisi mata yang langsung memikat pada ranah Composition dengan kualitas yang stabil dan terukur."], "3": ["Menguasai irama bentuk, ruang kosong (negative space), dan kontras ukuran untuk menciptakan kesan megah, tegang, atau tenang.", "Menyelesaikan minimal 35 karya bercerita (visual storytelling) atau rangkaian panel cerita yang mengalir mulus.", "Memiliki rekam jejak minimal 30 karya dengan komposisi mata yang langsung memikat atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pengaturan titik fokus (focal point), keseimbangan, & komposisi warna."], "4": ["Mampu menyusun komposisi adegan kompleks dengan banyak karakter dan detail arsitektur tanpa terlihat berantakan.", "Menghasilkan ≥60 karya ilustrasi naratif/konsep visual kelas profesional yang digunakan dalam buku, film, gim, atau pameran.", "Menuntaskan minimal 60–100 karya dengan komposisi mata yang langsung memikat lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan komposisi tingkat legendaris di mana setiap sudut kanvas punya makna dan memikat mata penonton.", "Melahirkan karya-karya ikonik sepanjang karier yang terus dikenang dan dipelajari struktur komposisinya selama bertahun-tahun.", "Melahirkan warisan penguasaan komposisi visual di segala ukuran kanvas berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Menyelesaikan minimal 3 proyek kolaborasi atau pesanan (komisi) kreatif tepat waktu sesuai kesepakatan.", "Mampu menerima masukan atau kritik revisi dengan kepala dingin dan memperbaikinya secara profesional.", "Memahami konsep dasar Art Direction (Aesthetics) dan mampu mempraktikkan penerjemahan konsep/emosi menjadi panduan gaya visual (moodboard & arahan) secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 10 proyek klien atau kolaborasi lintas bidang (dengan penulis, musisi, atau programmer).", "Memiliki tingkat kepuasan rekan kerja/klien yang tinggi dengan jadwal pengiriman yang selalu dapat diandalkan.", "Lancar menerapkan penerjemahan konsep/emosi menjadi panduan gaya visual (moodboard & arahan) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memimpin atau mengoordinasikan minimal 5 proyek kreatif tim dari tahap konsep hingga rilis ke publik.", "Dapat menjaga kualitas artistik tetap tinggi meskipun bekerja di bawah batasan waktu dan anggaran yang ketat.", "Mampu menerapkan konsep Art Direction (Aesthetics) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Berhasil mengarahkan ≥15 proyek produksi kreatif skala menengah/besar hingga rilis sukses di pasaran.", "Mampu menyelesaikan kebuntuan kreatif tim dengan memberi umpan balik visual yang tajam, jelas, dan memotivasi.", "Menguasai Art Direction pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang standar pengarahan seni (art direction) kelas profesional berstandar profesional."], "5": ["Telah mengarahkan puluhan proyek ikonik selama bertahun-tahun dan melahirkan banyak pemimpin kreatif baru dari timnya.", "Dikenal luas karena kemampuannya menyatukan idealisme seni yang tinggi dengan keberhasilan dampak di masyarakat.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Art Direction: penerjemahan konsep/emosi menjadi panduan gaya visual (moodboard & arahan) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Mengenali jenis-jenis karya dan seniman yang disukai, serta mulai berani menggambar tanpa sekadar menjiplak persis.", "Mampu menyebutkan 3 ciri visual (pilihan warna, bentuk garis, atau tema) yang paling sering muncul di karyanya.", "Mampu mengenali contoh hasil Artistic Vision yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mulai memadukan referensi dari berbagai sumber menjadi gaya gambar yang konsisten pada beberapa karya berturut-turut.", "Teman atau pengikut mulai bisa mengenali karyanya tanpa harus melihat nama pembuatnya terlebih dahulu.", "Mampu menyelesaikan tantangan Artistic Vision tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Memiliki identitas visual (art style) yang matang: pilihan palet warna, bentuk karakter/objek, dan suasana khas.", "Mampu mempertahankan ciri khas visualnya meskipun mengerjakan berbagai topik atau pesanan yang berbeda.", "Kualitas hasil Artistic Vision-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Merancang dunia visual (worldbuilding) atau bahasa estetika utuh yang punya aturan bentuk, budaya, dan atmosfer sendiri.", "Gaya visualnya mulai dijadikan inspirasi atau studi referensi oleh perupa dan kreator muda lainnya.", "Mampu membimbing dan mengoreksi praktik Artistic Vision orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai kematangan estetika seumur hidup (signature mastery) di mana karya-karyanya langsung dikenali dalam sekali lihat.", "Menjadi sosok panutan yang membimbing perupa lain menemukan suara dan jati diri artistik mereka sendiri.", "Menjadi mahaguru/mentor utama di bidang Aesthetics yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "interpersonal-skill": {"0": {"1": ["Mampu menyampaikan pendapat atau kebutuhan pribadi dengan kalimat yang sopan, jelas, dan tidak menyalahkan orang lain.", "Berani berkata 'tidak' secara baik-baik minimal 5 kali pada ajakan atau permintaan yang memang di luar kapasitas diri.", "Menyelesaikan minimal 5 latihan awal atau penjelasan ide tanpa berbelit-belit dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu menyampaikan kritik atau koreksi kepada teman/rekan kerja secara empat mata tanpa membuat mereka merasa dipermalukan.", "Berhasil melakukan minimal 10 percakapan asertif (menegur dengan kasih, meminta hak, atau menetapkan batas waktu kerja).", "Menghasilkan minimal 12–15 penjelasan ide tanpa berbelit-belit pada ranah Articulation dengan kualitas yang stabil dan terukur."], "3": ["Menguasai seni berbicara jujur sekaligus hangat (radical candor): tegas pada masalahnya, namun tetap peduli pada orangnya.", "Berhasil menyelesaikan minimal 20 situasi canggung atau batas peran yang kabur di tim/keluarga lewat komunikasi terbuka.", "Memiliki rekam jejak minimal 30 penjelasan ide tanpa berbelit-belit atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penyampaian pikiran secara runtut, jelas, & mudah ditangkap lawan bicara."], "4": ["Terampil berkomunikasi di situasi bertekanan tinggi (rapat krisis, negosiasi alot, atau forum publik yang kritis) tanpa terpancing emosi.", "Menjadi juru bicara atau komunikator utama dalam ≥30 momen penting organisasi/komunitas dengan hasil yang menyejukkan dan jelas.", "Menuntaskan minimal 60–100 penjelasan ide tanpa berbelit-belit lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan komunikasi tingkat diplomat ulung: kata-katanya selalu terukur, jujur, menenangkan, dan menggerakkan hati.", "Memiliki rekam jejak puluhan tahun menjaga kejernihan komunikasi di tengah situasi krisis maupun perbedaan tajam.", "Melahirkan warisan tutur kata yang jernih di segala situasi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Menyelesaikan minimal 5 kali presentasi atau sharing singkat dengan struktur pembuka, isi, dan penutup yang rapi.", "Dapat mengendalikan rasa gugup di 2 menit pertama sehingga pesan tetap tersampaikan dengan lancar.", "Memahami konsep dasar Persuasion (Communication) dan mampu mempraktikkan penyusunan alasan logis & sentuhan empati untuk mengajak orang bekerja sama secara sederhana tanpa bingung."], "2": ["Berbicara atau mengajar di depan audiens (20–50 orang) minimal 15 kali dengan umpan balik yang positif dan antusias.", "Dapat menjawab pertanyaan mendadak dari audiens dengan tenang, terstruktur, dan tepat sasaran.", "Lancar menerapkan penyusunan alasan logis & sentuhan empati untuk mengajak orang bekerja sama secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menjadi pembicara, pengajar, atau fasilitator di ≥30 sesi forum/seminar (50–100+ orang) dengan dampak yang membekas.", "Mampu menyampaikan materi yang rumit hanya dengan bantuan visual minimal (atau bahkan tanpa slide) secara memikat.", "Mampu menerapkan konsep Persuasion (Communication) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah berbicara di ≥75 panggung/forum lintas kalangan dengan tingkat kepuasan dan perubahan perilaku audiens yang terukur.", "Mampu melatih dan membimbing pembicara pemula hingga berani tampil memukau di panggung utama.", "Menguasai Persuasion pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang kemampuan persuasi etis yang menyatukan kepentingan berstandar profesional."], "5": ["Memiliki jam terbang ratusan panggung selama puluhan tahun dengan integritas antara apa yang diucapkan dan yang dihidupi.", "Suara dan gagasannya menjadi kompas inspirasi yang membangkitkan semangat banyak orang di masa-masa sulit.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Persuasion: penyusunan alasan logis & sentuhan empati untuk mengajak orang bekerja sama telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Mampu bekerja sama dalam kelompok dengan bertanggung jawab penuh atas bagian tugasnya sendiri sampai tuntas.", "Selalu mengapresiasi dan mengucapkan terima kasih secara spesifik atas kontribusi rekan satu tim.", "Mampu mengenali contoh hasil Influence yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mengenali kelebihan dan gaya kerja tiap anggota tim sehingga dapat membagi tugas sesuai kekuatan masing-masing.", "Rutin mengecek kondisi semangat dan kendala anggota tim secara personal, bukan hanya menagih hasil kerja.", "Mampu menyelesaikan tantangan Influence tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu membangun budaya aman secara psikologis di dalam tim: anggota berani mengakui salah dan mengusulkan ide tanpa takut dimarahi.", "Berhasil mencetak minimal 2–3 kader pemimpin baru yang siap menggantikan perannya di dalam tim.", "Kualitas hasil Influence-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai kepemimpinan lintas tim (multi-divisi) dan mampu membalikkan tim yang tadinya lesu/bermasalah menjadi berkinerja tinggi.", "Mampu mengambil keputusan sulit di saat krisis sambil tetap menjaga kepercayaan dan kesolidan seluruh anggota.", "Mampu membimbing dan mengoreksi praktik Influence orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat kepemimpinan pelayan (servant leadership) seumur hidup yang menginspirasi lewat keteladanan hidup nyata.", "Kehadiran dan filosofi kepemimpinannya meninggalkan budaya kerja yang sehat, berintegritas, dan bertahan lama.", "Menjadi mahaguru/mentor utama di bidang Communication yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mampu mendengarkan lawan bicara sampai selesai tanpa memotong pembicaraan atau sibuk melihat layar HP.", "Melakukan minimal 10 percakapan mendalam di mana fokus utamanya adalah memahami cerita teman, bukan buru-buru menasihati.", "Menyelesaikan minimal 5 latihan awal atau kepekaan membaca situasi sosial tanpa menghakimi dengan mengikuti panduan langkah demi langkah."], "2": ["Peka menangkap perubahan nada suara, raut wajah, dan bahasa tubuh ketika lawan bicara sedang tidak nyaman atau sedih.", "Mampu mengajukan pertanyaan terbuka yang membuat orang yang pendiam atau tertutup merasa aman untuk bercerita.", "Menghasilkan minimal 12–15 kepekaan membaca situasi sosial tanpa menghakimi pada ranah Observation dengan kualitas yang stabil dan terukur."], "3": ["Mampu meredakan emosi lawan bicara yang sedang marah, panik, atau kecewa berat hanya lewat kehadiran dan cara mendengar yang tenang.", "Berhasil mendampingi minimal 15 sesi percakapan sulit/emosional hingga lawan bicara merasa lega dan menemukan jalan keluar.", "Memiliki rekam jejak minimal 30 kepekaan membaca situasi sosial tanpa menghakimi atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pengamatan bahasa tubuh, nada suara, & perubahan raut wajah lawan bicara."], "4": ["Menguasai empati mendalam lintas latar belakang: mampu memahami sudut pandang orang yang sangat berbeda usia, budaya, atau pandangan.", "Memiliki rekam jejak ≥50 sesi pendampingan/konseling sebaya yang membantu orang lain melewati masa krisis hidup.", "Menuntaskan minimal 60–100 kepekaan membaca situasi sosial tanpa menghakimi lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai kematangan hadir dan mendengar tingkat bijaksana: kehadirannya saja sudah memberi rasa aman dan tenang bagi ruangan.", "Menjadi sosok pendengar dan penasihat tepercaya selama puluhan tahun bagi keluarga, sahabat, maupun komunitas luas.", "Melahirkan warisan ketajaman observasi manusia yang akurat berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Melakukan minimal 10 percakapan mendalam di mana fokus utamanya adalah memahami cerita teman, bukan buru-buru menasihati.", "Dapat mengulang kembali inti perasaan dan cerita lawan bicara dengan kalimat sendiri secara tepat (parafrase).", "Memahami konsep dasar Behavioral Analysis (Psychology) dan mampu mempraktikkan pemetaan pola kebiasaan, pemicu emosi, & motivasi di balik tindakan seseorang secara sederhana tanpa bingung."], "2": ["Mampu mengajukan pertanyaan terbuka yang membuat orang yang pendiam atau tertutup merasa aman untuk bercerita.", "Menjadi tempat curhat atau diskusi yang dipercaya oleh minimal 5 teman/rekan karena mampu menjaga rahasia dan tidak menghakimi.", "Lancar menerapkan pemetaan pola kebiasaan, pemicu emosi, & motivasi di balik tindakan seseorang secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil mendampingi minimal 15 sesi percakapan sulit/emosional hingga lawan bicara merasa lega dan menemukan jalan keluar.", "Dapat membedakan dengan jernih antara apa yang diucapkan di permukaan dengan kebutuhan emosional yang sebenarnya tersembunyi.", "Mampu menerapkan konsep Behavioral Analysis (Psychology) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥50 sesi pendampingan/konseling sebaya yang membantu orang lain melewati masa krisis hidup.", "Mampu menjaga batas kesehatan mental diri sendiri (tidak ikut terkuras habis) meski sering mendengarkan beban berat orang lain.", "Menguasai Behavioral Analysis pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang pemahaman pola perilaku manusia secara objektif berstandar profesional."], "5": ["Menjadi sosok pendengar dan penasihat tepercaya selama puluhan tahun bagi keluarga, sahabat, maupun komunitas luas.", "Mampu mengajarkan seni mendengar aktif dan empati sehat kepada puluhan pemimpin atau pendamping lainnya.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Behavioral Analysis: pemetaan pola kebiasaan, pemicu emosi, & motivasi di balik tindakan seseorang telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Bersedia meluangkan waktu untuk mengajari teman atau adik tingkat yang sedang kesulitan memahami suatu materi/keterampilan.", "Mampu memberi masukan yang membangun (apa yang sudah bagus dan langkah konkret apa yang perlu diperbaiki).", "Mampu mengenali contoh hasil Psychological Insight yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai cara bertanya yang memancing mentee berpikir sendiri (metode reflektif), bukan langsung menyuapi semua jawaban.", "Mentee yang dibimbing berhasil menyelesaikan proyek atau melampaui target yang tadinya mereka anggap terlalu sulit.", "Mampu menyelesaikan tantangan Psychological Insight tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu menyesuaikan gaya bimbingan (kapan harus mengarahkan, kapan memberi tantangan, kapan memberi dukungan mental) sesuai tahap mentee.", "Memiliki kerangka atau panduan mentoring pribadi yang terbukti efektif mempercepat pertumbuhan orang lain.", "Kualitas hasil Psychological Insight-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Membangun sistem atau komunitas mentoring di mana para mentee generasi pertama kini ikut membimbing generasi berikutnya.", "Dipercaya menjadi mentor bagi para pemimpin (mentor of leaders) untuk mendiskusikan keputusan-keputusan strategis hidup/karier.", "Mampu membimbing dan mengoreksi praktik Psychological Insight orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat mahaguru pembina manusia (lifelong people builder) yang mendedikasikan hidupnya untuk menumbuhkan generasi baru.", "Dikenang bukan hanya karena kehebatan pribadinya, melainkan karena banyaknya orang hebat yang berhasil ia tumbuhkan.", "Menjadi mahaguru/mentor utama di bidang Psychology yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Mampu bekerja sama dalam kelompok dengan bertanggung jawab penuh atas bagian tugasnya sendiri sampai tuntas.", "Berani memimpin rapat kecil atau diskusi kelompok (3–5 orang) agar selesai tepat waktu dan menghasilkan keputusan.", "Menyelesaikan minimal 5 latihan awal atau proyek kelompok yang selesai rapi & tepat waktu dengan mengikuti panduan langkah demi langkah."], "2": ["Mengenali kelebihan dan gaya kerja tiap anggota tim sehingga dapat membagi tugas sesuai kekuatan masing-masing.", "Berhasil memimpin minimal 5 proyek tim atau kepanitiaan hingga tuntas dengan suasana kerja yang kompak dan sehat.", "Menghasilkan minimal 12–15 proyek kelompok yang selesai rapi & tepat waktu pada ranah Coordination dengan kualitas yang stabil dan terukur."], "3": ["Mampu membangun budaya aman secara psikologis di dalam tim: anggota berani mengakui salah dan mengusulkan ide tanpa takut dimarahi.", "Memimpin tim beranggotakan ≥8–15 orang melewati minimal 10 proyek menantang dengan tingkat kejenuhan (burnout) yang rendah.", "Memiliki rekam jejak minimal 30 proyek kelompok yang selesai rapi & tepat waktu atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pembagian jadwal, penyelarasan tugas, & komunikasi progres di dalam kelompok."], "4": ["Menguasai kepemimpinan lintas tim (multi-divisi) dan mampu membalikkan tim yang tadinya lesu/bermasalah menjadi berkinerja tinggi.", "Memiliki rekam jejak memimpin ≥25 inisiatif/organisasi dan melahirkan ≥10 pemimpin mandiri yang sukses di bidangnya.", "Menuntaskan minimal 60–100 proyek kelompok yang selesai rapi & tepat waktu lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat kepemimpinan pelayan (servant leadership) seumur hidup yang menginspirasi lewat keteladanan hidup nyata.", "Telah membimbing puluhan pemimpin lintas generasi selama bertahun-tahun yang kini memimpin komunitas atau institusi mereka sendiri.", "Melahirkan warisan koordinasi lintas tim yang mulus tanpa salah paham berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Berani memimpin rapat kecil atau diskusi kelompok (3–5 orang) agar selesai tepat waktu dan menghasilkan keputusan.", "Selalu mengapresiasi dan mengucapkan terima kasih secara spesifik atas kontribusi rekan satu tim.", "Memahami konsep dasar Delegation (Leadership) dan mampu mempraktikkan penyerahan tanggung jawab kepada orang yang tepat beserta panduan yang jelas secara sederhana tanpa bingung."], "2": ["Berhasil memimpin minimal 5 proyek tim atau kepanitiaan hingga tuntas dengan suasana kerja yang kompak dan sehat.", "Rutin mengecek kondisi semangat dan kendala anggota tim secara personal, bukan hanya menagih hasil kerja.", "Lancar menerapkan penyerahan tanggung jawab kepada orang yang tepat beserta panduan yang jelas secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memimpin tim beranggotakan ≥8–15 orang melewati minimal 10 proyek menantang dengan tingkat kejenuhan (burnout) yang rendah.", "Berhasil mencetak minimal 2–3 kader pemimpin baru yang siap menggantikan perannya di dalam tim.", "Mampu menerapkan konsep Delegation (Leadership) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak memimpin ≥25 inisiatif/organisasi dan melahirkan ≥10 pemimpin mandiri yang sukses di bidangnya.", "Mampu mengambil keputusan sulit di saat krisis sambil tetap menjaga kepercayaan dan kesolidan seluruh anggota.", "Menguasai Delegation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang pemberdayaan anggota tim hingga mandiri berstandar profesional."], "5": ["Telah membimbing puluhan pemimpin lintas generasi selama bertahun-tahun yang kini memimpin komunitas atau institusi mereka sendiri.", "Kehadiran dan filosofi kepemimpinannya meninggalkan budaya kerja yang sehat, berintegritas, dan bertahan lama.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Delegation: penyerahan tanggung jawab kepada orang yang tepat beserta panduan yang jelas telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Hadir dan terlibat aktif sebagai anggota yang dapat diandalkan di minimal 1 komunitas positif atau kegiatan sosial.", "Mampu menyambut anggota baru dengan ramah agar mereka tidak merasa asing atau sendirian di pertemuan pertama.", "Mampu mengenali contoh hasil Organizational Leadership yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu merancang dan memfasilitasi acara kumpul komunitas (diskusi, kelas belajar bersama, atau aksi sosial) yang hidup dan hangat.", "Menjaga komunikasi grup komunitas tetap sehat, fokus pada tujuan bersama, dan bebas dari drama perpecahan.", "Mampu menyelesaikan tantangan Organizational Leadership tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu membangun atau menghidupkan kembali komunitas dari nol hingga memiliki pengurus inti dan kegiatan rutin yang mandiri.", "Memiliki sistem sambutan anggota baru, pembagian peran, dan regenerasi pengurus yang berjalan rapi.", "Kualitas hasil Organizational Leadership-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai pembangunan ekosistem komunitas berskala besar yang mampu membiayai kegiatannya sendiri dan memberi dampak luas.", "Komunitas tersebut berhasil berjalan mandiri di tangan generasi pengurus berikutnya tanpa bergantung penuh pada pendirinya.", "Mampu membimbing dan mengoreksi praktik Organizational Leadership orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat arsitek gerakan komunitas seumur hidup yang menyatukan ratusan hingga ribuan orang dalam nilai kebaikan bersama.", "Menjadi inspirasi dan pembimbing bagi para penggerak komunitas di berbagai kota dan bidang.", "Menjadi mahaguru/mentor utama di bidang Leadership yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Mampu mendengarkan lawan bicara sampai selesai tanpa memotong pembicaraan atau sibuk melihat layar HP.", "Melakukan minimal 10 percakapan mendalam di mana fokus utamanya adalah memahami cerita teman, bukan buru-buru menasihati.", "Menyelesaikan minimal 5 latihan awal atau jurnal kesadaran diri & penerimaan perasaan dengan mengikuti panduan langkah demi langkah."], "2": ["Peka menangkap perubahan nada suara, raut wajah, dan bahasa tubuh ketika lawan bicara sedang tidak nyaman atau sedih.", "Mampu mengajukan pertanyaan terbuka yang membuat orang yang pendiam atau tertutup merasa aman untuk bercerita.", "Menghasilkan minimal 12–15 jurnal kesadaran diri & penerimaan perasaan pada ranah Awareness dengan kualitas yang stabil dan terukur."], "3": ["Mampu meredakan emosi lawan bicara yang sedang marah, panik, atau kecewa berat hanya lewat kehadiran dan cara mendengar yang tenang.", "Berhasil mendampingi minimal 15 sesi percakapan sulit/emosional hingga lawan bicara merasa lega dan menemukan jalan keluar.", "Memiliki rekam jejak minimal 30 jurnal kesadaran diri & penerimaan perasaan atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pengenalan emosi diri sendiri (marah, cemas, lelah) beserta pemicunya."], "4": ["Menguasai empati mendalam lintas latar belakang: mampu memahami sudut pandang orang yang sangat berbeda usia, budaya, atau pandangan.", "Memiliki rekam jejak ≥50 sesi pendampingan/konseling sebaya yang membantu orang lain melewati masa krisis hidup.", "Menuntaskan minimal 60–100 jurnal kesadaran diri & penerimaan perasaan lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai kematangan hadir dan mendengar tingkat bijaksana: kehadirannya saja sudah memberi rasa aman dan tenang bagi ruangan.", "Menjadi sosok pendengar dan penasihat tepercaya selama puluhan tahun bagi keluarga, sahabat, maupun komunitas luas.", "Melahirkan warisan kejujuran batin & kepekaan emosi yang matang berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Berani berkata 'tidak' secara baik-baik minimal 5 kali pada ajakan atau permintaan yang memang di luar kapasitas diri.", "Menggunakan pola kalimat 'Saya merasa... karena... dan saya berharap...' saat menyampaikan keberatan.", "Memahami konsep dasar Regulation (Emotional Intelligence) dan mampu mempraktikkan pengendalian reaksi emosi sesaat melalui jeda napas & penataan pikiran secara sederhana tanpa bingung."], "2": ["Berhasil melakukan minimal 10 percakapan asertif (menegur dengan kasih, meminta hak, atau menetapkan batas waktu kerja).", "Dapat tetap tenang dan menjaga volume suara tetap stabil meskipun lawan bicara mulai meninggikan nada bicara.", "Lancar menerapkan pengendalian reaksi emosi sesaat melalui jeda napas & penataan pikiran secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil menyelesaikan minimal 20 situasi canggung atau batas peran yang kabur di tim/keluarga lewat komunikasi terbuka.", "Mampu menyampaikan kabar buruk atau keputusan sulit dengan lugas, penuh hormat, dan disertai solusi tindak lanjut.", "Mampu menerapkan konsep Regulation (Emotional Intelligence) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Menjadi juru bicara atau komunikator utama dalam ≥30 momen penting organisasi/komunitas dengan hasil yang menyejukkan dan jelas.", "Mampu melatih orang lain yang tadinya takut bicara atau terlalu kasar agar bisa berkomunikasi secara asertif dan dewasa.", "Menguasai Regulation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang kestabilan emosi tingkat tinggi di tengah badai krisis berstandar profesional."], "5": ["Memiliki rekam jejak puluhan tahun menjaga kejernihan komunikasi di tengah situasi krisis maupun perbedaan tajam.", "Menjadi teladan hidup tentang bagaimana ketegasan prinsip dan kelembutan hati bisa berjalan beriringan.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Regulation: pengendalian reaksi emosi sesaat melalui jeda napas & penataan pikiran telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Bersedia meluangkan waktu untuk mengajari teman atau adik tingkat yang sedang kesulitan memahami suatu materi/keterampilan.", "Mampu memberi masukan yang membangun (apa yang sudah bagus dan langkah konkret apa yang perlu diperbaiki).", "Mampu mengenali contoh hasil Emotional Wisdom yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai cara bertanya yang memancing mentee berpikir sendiri (metode reflektif), bukan langsung menyuapi semua jawaban.", "Mentee yang dibimbing berhasil menyelesaikan proyek atau melampaui target yang tadinya mereka anggap terlalu sulit.", "Mampu menyelesaikan tantangan Emotional Wisdom tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu menyesuaikan gaya bimbingan (kapan harus mengarahkan, kapan memberi tantangan, kapan memberi dukungan mental) sesuai tahap mentee.", "Memiliki kerangka atau panduan mentoring pribadi yang terbukti efektif mempercepat pertumbuhan orang lain.", "Kualitas hasil Emotional Wisdom-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Membangun sistem atau komunitas mentoring di mana para mentee generasi pertama kini ikut membimbing generasi berikutnya.", "Dipercaya menjadi mentor bagi para pemimpin (mentor of leaders) untuk mendiskusikan keputusan-keputusan strategis hidup/karier.", "Mampu membimbing dan mengoreksi praktik Emotional Wisdom orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat mahaguru pembina manusia (lifelong people builder) yang mendedikasikan hidupnya untuk menumbuhkan generasi baru.", "Dikenang bukan hanya karena kehebatan pribadinya, melainkan karena banyaknya orang hebat yang berhasil ia tumbuhkan.", "Menjadi mahaguru/mentor utama di bidang Emotional Intelligence yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "12": {"1": ["Tidak lari atau mendiamkan masalah (silent treatment) berlarut-larut ketika terjadi salah paham dengan teman atau rekan.", "Berhasil menyelesaikan minimal 5 kesalahpahaman pribadi dengan duduk bersama dan saling meminta/memberi maaf.", "Menyelesaikan minimal 5 latihan awal atau kesepakatan negosiasi yang adil bagi kedua pihak dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu menjadi penengah yang adil ketika ada 2 teman atau anggota tim yang sedang berselisih paham.", "Berhasil memediasi minimal 8 konflik di dalam tim/komunitas hingga kedua pihak kembali bekerja sama dengan baik.", "Menghasilkan minimal 12–15 kesepakatan negosiasi yang adil bagi kedua pihak pada ranah Negotiation dengan kualitas yang stabil dan terukur."], "3": ["Menguasai teknik negosiasi menang-menang (win-win solution): mencari titik temu kepentingan bersama di balik posisi yang bertentangan.", "Berhasil menyelesaikan ≥15 konflik atau negosiasi sulit (pembagian tugas, anggaran, atau perbedaan visi) dengan kesepakatan tertulis.", "Memiliki rekam jejak minimal 30 kesepakatan negosiasi yang adil bagi kedua pihak atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pencarian titik temu kepentingan bersama (win-win) dalam perbedaan pendapat."], "4": ["Terampil memulihkan hubungan kelompok yang sudah retak lama atau berkonflik tajam hingga tercipta rekonsiliasi nyata.", "Dipercaya menjadi mediator independen dalam ≥30 kasus perselisihan organisasi, keluarga, atau kemitraan strategis.", "Menuntaskan minimal 60–100 kesepakatan negosiasi yang adil bagi kedua pihak lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat juru damai (peacemaker) sejati yang mampu menjembatani perpecahan besar dengan hikmat dan keadilan.", "Memiliki rekam jejak puluhan tahun mendamaikan pertikaian rumit dan memulihkan kepercayaan di berbagai komunitas.", "Melahirkan warisan keahlian negosiasi strategis bernilai tinggi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "13": {"1": ["Berhasil menyelesaikan minimal 5 kesalahpahaman pribadi dengan duduk bersama dan saling meminta/memberi maaf.", "Mampu melihat masalah dari dua sisi dan mengakui bagian kesalahan diri sendiri terlebih dahulu.", "Memahami konsep dasar Mediation (Conflict Resolution) dan mampu mempraktikkan penengahan dua pihak yang berselisih secara netral, tenang, & adil secara sederhana tanpa bingung."], "2": ["Berhasil memediasi minimal 8 konflik di dalam tim/komunitas hingga kedua pihak kembali bekerja sama dengan baik.", "Dapat memisahkan antara masalah kerjaan/tujuan dengan urusan perasaan pribadi agar diskusi tidak melebar ke mana-mana.", "Lancar menerapkan penengahan dua pihak yang berselisih secara netral, tenang, & adil secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil menyelesaikan ≥15 konflik atau negosiasi sulit (pembagian tugas, anggaran, atau perbedaan visi) dengan kesepakatan tertulis.", "Mampu menurunkan ketegangan ruangan yang sedang memanas dalam waktu singkat lewat pertanyaan yang menenangkan.", "Mampu menerapkan konsep Mediation (Conflict Resolution) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Dipercaya menjadi mediator independen dalam ≥30 kasus perselisihan organisasi, keluarga, atau kemitraan strategis.", "Mampu merancang aturan main dan budaya komunikasi tim yang mencegah konflik berulang di masa depan.", "Menguasai Mediation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang kepercayaan sebagai mediator ulung di situasi panas berstandar profesional."], "5": ["Memiliki rekam jejak puluhan tahun mendamaikan pertikaian rumit dan memulihkan kepercayaan di berbagai komunitas.", "Warisan kebijaksanaannya dalam menyelesaikan sengketa menjadi rujukan dan teladan bagi para pemimpin lainnya.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Mediation: penengahan dua pihak yang berselisih secara netral, tenang, & adil telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "14": {"1": ["Tidak lari atau mendiamkan masalah (silent treatment) berlarut-larut ketika terjadi salah paham dengan teman atau rekan.", "Mampu melihat masalah dari dua sisi dan mengakui bagian kesalahan diri sendiri terlebih dahulu.", "Mampu mengenali contoh hasil Reconciliation yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu menjadi penengah yang adil ketika ada 2 teman atau anggota tim yang sedang berselisih paham.", "Dapat memisahkan antara masalah kerjaan/tujuan dengan urusan perasaan pribadi agar diskusi tidak melebar ke mana-mana.", "Mampu menyelesaikan tantangan Reconciliation tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai teknik negosiasi menang-menang (win-win solution): mencari titik temu kepentingan bersama di balik posisi yang bertentangan.", "Mampu menurunkan ketegangan ruangan yang sedang memanas dalam waktu singkat lewat pertanyaan yang menenangkan.", "Kualitas hasil Reconciliation-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Terampil memulihkan hubungan kelompok yang sudah retak lama atau berkonflik tajam hingga tercipta rekonsiliasi nyata.", "Mampu merancang aturan main dan budaya komunikasi tim yang mencegah konflik berulang di masa depan.", "Mampu membimbing dan mengoreksi praktik Reconciliation orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat juru damai (peacemaker) sejati yang mampu menjembatani perpecahan besar dengan hikmat dan keadilan.", "Warisan kebijaksanaannya dalam menyelesaikan sengketa menjadi rujukan dan teladan bagi para pemimpin lainnya.", "Menjadi mahaguru/mentor utama di bidang Conflict Resolution yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "exploration-adaptation": {"0": {"1": ["Mampu memahami cara kerja dasar suatu bidang atau alat baru dalam waktu 1–2 hari lewat membaca panduan yang tepat.", "Berhasil mempelajari dan mempraktikkan minimal 3 keterampilan praktis baru di luar bidang utamanya dalam setahun terakhir.", "Menyelesaikan minimal 5 latihan awal atau alur kerja digital yang rapi & aman dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai teknik dekonstruksi skill: memecah keterampilan rumit menjadi 20% bagian terpenting yang menghasilkan 80% kemampuan dasar.", "Berhasil menguasai minimal 6 keterampilan baru dari nol hingga level fungsional (bisa dipakai kerja/berkarya nyata) masing-masing dalam ≤30 jam latihan.", "Menghasilkan minimal 12–15 alur kerja digital yang rapi & aman pada ranah Digital Literacy dengan kualitas yang stabil dan terukur."], "3": ["Mampu terjun ke bidang atau lingkungan kerja yang sama sekali asing dan menjadi kontributor produktif dalam waktu ≤2 minggu.", "Memiliki rekam jejak menguasai ≥12 keterampilan lintas disiplin (teknis, kreatif, sosial, fisik) yang terbuktikan lewat karya nyata.", "Memiliki rekam jejak minimal 30 alur kerja digital yang rapi & aman atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penguasaan perangkat digital, manajemen file, & keamanan akun dasar."], "4": ["Menguasai sistem belajar super cepat (meta-learning): mampu menyusun kurikulum mandiri untuk menguasai bidang sulit dalam hitungan minggu.", "Berhasil menaklukkan ≥20 kompetensi lintas bidang tingkat menengah-mahir dan merangkumnya menjadi panduan belajar bagi orang lain.", "Menuntaskan minimal 60–100 alur kerja digital yang rapi & aman lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat pembelajar seumur hidup (master polymath) yang tidak pernah berhenti bertumbuh dan mudah beradaptasi di zaman apa pun.", "Memiliki keluasan dan kedalaman ilmu lintas disiplin yang terasah selama puluhan tahun belajar tanpa henti.", "Melahirkan warisan kemandirian penuh menguasai teknologi baru berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Berhasil memperbaiki atau merakit sendiri minimal 5 barang/peralatan yang rusak ringan tanpa harus langsung membeli baru.", "Selalu membawa dan tahu cara memakai perangkat perkakas darurat sederhana (multi-tool, lakban, kabel tis, obeng dasar).", "Memahami konsep dasar Automation (Technology) dan mampu mempraktikkan pembuatan pintasan kerja, template, & skrip otomasi tugas digital secara sederhana tanpa bingung."], "2": ["Berhasil melakukan minimal 15 perbaikan darurat atau modifikasi alat kreatif (hack praktis) yang menyelamatkan jalannya kegiatan/proyek.", "Dapat mendiagnosis letak kerusakan alat mekanis atau perangkat digital secara sistematis dalam waktu singkat.", "Lancar menerapkan pembuatan pintasan kerja, template, & skrip otomasi tugas digital secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memiliki rekam jejak ≥30 proyek perbaikan, perakitan mandiri (DIY), atau rekayasa lapangan tepat guna yang awet dipakai.", "Menjadi orang pertama yang dicari teman atau tim ketika ada peralatan teknis yang macet di saat genting.", "Mampu menerapkan konsep Automation (Technology) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah menciptakan atau memodifikasi ≥50 solusi teknis lapangan yang membantu efisiensi kerja tim atau warga sekitar.", "Mampu melatih orang awam agar mandiri merawat dan memperbaiki peralatan kerja mereka sendiri.", "Menguasai Automation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang ekosistem kerja digital berkecepatan tinggi berstandar profesional."], "5": ["Karya inovasi tepat guna dan keahlian tangannya telah memecahkan ratusan masalah praktis selama puluhan tahun.", "Menjadi inspirasi kemandirian teknis yang membuktikan bahwa keterbatasan alat bukan penghalang untuk berkarya hebat.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Automation: pembuatan pintasan kerja, template, & skrip otomasi tugas digital telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Mampu memahami cara kerja dasar suatu bidang atau alat baru dalam waktu 1–2 hari lewat membaca panduan yang tepat.", "Memiliki kebiasaan mencatat rangkuman inti (poin penting + langkah praktik) setiap kali selesai mempelajari hal baru.", "Mampu mengenali contoh hasil Technological Fluency yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai teknik dekonstruksi skill: memecah keterampilan rumit menjadi 20% bagian terpenting yang menghasilkan 80% kemampuan dasar.", "Mampu langsung mempraktikkan ilmu baru pada proyek kecil di minggu pertama belajar, bukan hanya menumpuk teori.", "Mampu menyelesaikan tantangan Technological Fluency tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu terjun ke bidang atau lingkungan kerja yang sama sekali asing dan menjadi kontributor produktif dalam waktu ≤2 minggu.", "Dapat menghubungkan pola dari satu bidang yang sudah dikuasai untuk mempercepat pemahaman di bidang baru (transfer belajar).", "Kualitas hasil Technological Fluency-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai sistem belajar super cepat (meta-learning): mampu menyusun kurikulum mandiri untuk menguasai bidang sulit dalam hitungan minggu.", "Sering menjadi orang pertama di tim yang diterjunkan untuk mempelajari teknologi, aturan, atau medan baru yang belum ada panduannya.", "Mampu membimbing dan mengoreksi praktik Technological Fluency orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat pembelajar seumur hidup (master polymath) yang tidak pernah berhenti bertumbuh dan mudah beradaptasi di zaman apa pun.", "Menginspirasi dan membekali banyak orang dengan metode belajar mandiri agar siap menghadapi perubahan dunia yang cepat.", "Menjadi mahaguru/mentor utama di bidang Technology yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mampu memahami cara kerja dasar suatu bidang atau alat baru dalam waktu 1–2 hari lewat membaca panduan yang tepat.", "Berhasil mempelajari dan mempraktikkan minimal 3 keterampilan praktis baru di luar bidang utamanya dalam setahun terakhir.", "Menyelesaikan minimal 5 latihan awal atau pemanfaatan AI untuk riset & draf berkualitas dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai teknik dekonstruksi skill: memecah keterampilan rumit menjadi 20% bagian terpenting yang menghasilkan 80% kemampuan dasar.", "Berhasil menguasai minimal 6 keterampilan baru dari nol hingga level fungsional (bisa dipakai kerja/berkarya nyata) masing-masing dalam ≤30 jam latihan.", "Menghasilkan minimal 12–15 pemanfaatan AI untuk riset & draf berkualitas pada ranah Prompting dengan kualitas yang stabil dan terukur."], "3": ["Mampu terjun ke bidang atau lingkungan kerja yang sama sekali asing dan menjadi kontributor produktif dalam waktu ≤2 minggu.", "Memiliki rekam jejak menguasai ≥12 keterampilan lintas disiplin (teknis, kreatif, sosial, fisik) yang terbuktikan lewat karya nyata.", "Memiliki rekam jejak minimal 30 pemanfaatan AI untuk riset & draf berkualitas atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penyusunan instruksi (prompt) AI yang spesifik, jelas konteksnya, & teruji."], "4": ["Menguasai sistem belajar super cepat (meta-learning): mampu menyusun kurikulum mandiri untuk menguasai bidang sulit dalam hitungan minggu.", "Berhasil menaklukkan ≥20 kompetensi lintas bidang tingkat menengah-mahir dan merangkumnya menjadi panduan belajar bagi orang lain.", "Menuntaskan minimal 60–100 pemanfaatan AI untuk riset & draf berkualitas lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat pembelajar seumur hidup (master polymath) yang tidak pernah berhenti bertumbuh dan mudah beradaptasi di zaman apa pun.", "Memiliki keluasan dan kedalaman ilmu lintas disiplin yang terasah selama puluhan tahun belajar tanpa henti.", "Melahirkan warisan penguasaan rekayasa prompt tingkat lanjut berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Mencatat minimal 20 ide atau temuan menarik dari hasil jalan-jalan, bacaan lintas bidang, dan obrolan dengan orang baru.", "Berani mencoba pendekatan baru yang lebih segar pada tugas rutin yang biasanya dikerjakan dengan cara lama.", "Memahami konsep dasar Workflow Integration (Artificial Intelligence) dan mampu mempraktikkan penggabungan alat AI ke dalam alur kerja harian dengan tetap menjaga verifikasi secara sederhana tanpa bingung."], "2": ["Menjalankan minimal 10 eksperimen kecil (proyek sampingan, format karya baru, atau metode kerja baru) untuk menguji ide segar.", "Menggabungkan minimal 2 bidang yang tampak tidak berhubungan menjadi satu ide proyek atau karya yang unik.", "Lancar menerapkan penggabungan alat AI ke dalam alur kerja harian dengan tetap menjaga verifikasi secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil melahirkan minimal 5 terobosan produk, karya, atau program baru hasil dari penjelajahan lintas bidang.", "Memiliki radar keingintahuan yang tajam untuk menyaring mana tren sesaat (hype) dan mana perubahan masa depan yang nyata.", "Mampu menerapkan konsep Workflow Integration (Artificial Intelligence) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥15 inovasi atau rintisan jalur baru yang terbukti sukses dan membuka peluang bagi banyak orang.", "Mampu membangun budaya eksplorasi dan keberanian bereksperimen di dalam tim atau komunitas yang dipimpinnya.", "Menguasai Workflow Integration pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang integrasi manusia-AI yang etis & presisi berstandar profesional."], "5": ["Jejak langkah rintisannya selama puluhan tahun telah membuka lahan berkarya baru bagi ratusan praktisi generasi sesudahnya.", "Tetap memiliki semangat ingin tahu dan mata yang berbinar terhadap hal baru layaknya pemula, meski telah menjadi seorang master.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Workflow Integration: penggabungan alat AI ke dalam alur kerja harian dengan tetap menjaga verifikasi telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Memiliki kebiasaan keluar dari rutinitas monoton minimal sebulan sekali untuk mengamati tren, pameran, buku, atau bidang di luar pekerjaannya.", "Berani mencoba pendekatan baru yang lebih segar pada tugas rutin yang biasanya dikerjakan dengan cara lama.", "Mampu mengenali contoh hasil AI Orchestration yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu mengenali peluang atau perubahan tren lebih awal dibanding kebanyakan orang di sekitarnya karena rajin mengamati lapangan.", "Menggabungkan minimal 2 bidang yang tampak tidak berhubungan menjadi satu ide proyek atau karya yang unik.", "Mampu menyelesaikan tantangan AI Orchestration tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai metode eksplorasi peluang terukur: mencoba banyak hal baru dengan modal kecil, lalu menggandakan yang terbukti berhasil.", "Memiliki radar keingintahuan yang tajam untuk menyaring mana tren sesaat (hype) dan mana perubahan masa depan yang nyata.", "Kualitas hasil AI Orchestration-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menjadi pelopor (early adopter & pioneer) yang membuka jalan baru di bidangnya sebelum jalur tersebut ramai diikuti orang lain.", "Mampu membangun budaya eksplorasi dan keberanian bereksperimen di dalam tim atau komunitas yang dipimpinnya.", "Mampu membimbing dan mengoreksi praktik AI Orchestration orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat penjelajah ufuk baru (lifelong trailblazer) yang sepanjang hidupnya terus membuka cakrawala dan kemungkinan baru.", "Tetap memiliki semangat ingin tahu dan mata yang berbinar terhadap hal baru layaknya pemula, meski telah menjadi seorang master.", "Menjadi mahaguru/mentor utama di bidang Artificial Intelligence yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Rutin mendokumentasikan perjalanan, proyek, atau pengalaman belajar baru ke dalam catatan dan foto yang rapi.", "Menyelesaikan minimal 5 jurnal perjalanan atau laporan hasil eksplorasi yang bisa dibaca dan dipahami teman.", "Menyelesaikan minimal 5 latihan awal atau kumpulan referensi tepercaya untuk topik baru dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu mengolah catatan pengalaman lapangan yang berserakan menjadi panduan praktis (SOP, artikel panduan, atau peta rute).", "Menyusun minimal 12 panduan atau dokumentasi pengetahuan yang terbukti membantu orang lain melakukan perjalanan/kegiatan serupa.", "Menghasilkan minimal 12–15 kumpulan referensi tepercaya untuk topik baru pada ranah Information Retrieval dengan kualitas yang stabil dan terukur."], "3": ["Menguasai seni mengubah pengalaman hidup dan eksplorasi lintas bidang menjadi kerangka ilmu (playbook) yang terstruktur.", "Menerbitkan atau membagikan ≥25 panduan lapangan, studi kasus, atau modul belajar yang dipakai oleh komunitas luas.", "Memiliki rekam jejak minimal 30 kumpulan referensi tepercaya untuk topik baru atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pencarian sumber informasi primer yang valid & penyaringan berita bohong."], "4": ["Mampu merangkum pengalaman bertahun-tahun di suatu bidang/wilayah menjadi buku panduan, kurikulum, atau atlas pengetahuan yang komprehensif.", "Karya dokumentasi dan pemetaan ilmunya telah diakses dan menjadi pegangan bagi ratusan hingga ribuan pembelajar baru.", "Menuntaskan minimal 60–100 kumpulan referensi tepercaya untuk topik baru lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat penyusun peta ilmu seumur hidup (master cartographer of knowledge) yang mewariskan kompas belajar bagi generasi mendatang.", "Memiliki warisan puluhan karya dokumentasi, buku, atau arsip ekspedisi yang tetap bernilai tinggi lintas dekade.", "Melahirkan warisan kecepatan & ketepatan penelusuran informasi berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Menyelesaikan minimal 5 catatan perjalanan atau observasi lapangan tentang kebiasaan dan keunikan suatu tempat/komunitas.", "Mampu berbaur di lingkungan baru tanpa menonjolkan diri secara berlebihan atau melanggar adat kesopanan setempat.", "Memahami konsep dasar Investigation (Research) dan mampu mempraktikkan penggalian fakta mendalam lewat perbandingan data, uji coba, & wawancara secara sederhana tanpa bingung."], "2": ["Melakukan minimal 10 perjalanan imersi budaya di mana ia belajar langsung dari warga atau pengrajin lokal.", "Menguasai frasa sapaan dan komunikasi praktis dalam bahasa/dialek setempat untuk membangun keakraban.", "Lancar menerapkan penggalian fakta mendalam lewat perbandingan data, uji coba, & wawancara secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan ≥20 ekspedisi atau proyek lapangan lintas daerah/budaya yang menghasilkan dokumentasi atau program berdampak.", "Diterima seperti keluarga sendiri oleh berbagai komunitas lokal yang pernah dikunjungi atau didampinginya.", "Mampu menerapkan konsep Investigation (Research) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥40 penjelajahan dan keterlibatan lintas budaya yang memperkaya wawasan serta jejaring kemanusiaannya.", "Menghasilkan karya tulis, film dokumenter, atau riset lapangan yang membuka mata publik tentang kekayaan budaya dan kehidupan manusia.", "Menguasai Investigation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang ketajaman riset lapangan maupun pustaka berstandar profesional."], "5": ["Pengalaman lintas budaya selama puluhan tahun menjadikannya jembatan pengertian yang mendalam antar masyarakat yang berbeda.", "Meninggalkan warisan catatan perjalanan dan kearifan lintas budaya yang menginspirasi generasi penjelajah berikutnya.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Investigation: penggalian fakta mendalam lewat perbandingan data, uji coba, & wawancara telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Rutin mendokumentasikan perjalanan, proyek, atau pengalaman belajar baru ke dalam catatan dan foto yang rapi.", "Menuliskan minimal 3 pelajaran praktis (apa yang berhasil, apa yang salah, apa saran ke depan) dari setiap kegiatan baru.", "Mampu mengenali contoh hasil Knowledge Synthesis yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu mengolah catatan pengalaman lapangan yang berserakan menjadi panduan praktis (SOP, artikel panduan, atau peta rute).", "Memiliki sistem arsip pengetahuan pribadi (second brain / buku atlas catatan) yang mudah dicari kembali kapan saja.", "Mampu menyelesaikan tantangan Knowledge Synthesis tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai seni mengubah pengalaman hidup dan eksplorasi lintas bidang menjadi kerangka ilmu (playbook) yang terstruktur.", "Pengetahuan yang dibagikannya berhasil memangkas waktu belajar dan menghindarkan orang lain dari kesalahan yang sama.", "Kualitas hasil Knowledge Synthesis-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu merangkum pengalaman bertahun-tahun di suatu bidang/wilayah menjadi buku panduan, kurikulum, atau atlas pengetahuan yang komprehensif.", "Aktif membangun budaya berbagi pengetahuan (knowledge sharing) agar ilmu lapangan tidak hilang begitu saja.", "Mampu membimbing dan mengoreksi praktik Knowledge Synthesis orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat penyusun peta ilmu seumur hidup (master cartographer of knowledge) yang mewariskan kompas belajar bagi generasi mendatang.", "Menjadi jembatan abadi yang mengubah pengalaman penjelajahan seorang perintis menjadi jalan raya yang mudah dilalui generasi penerus.", "Menjadi mahaguru/mentor utama di bidang Research yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Tetap bisa bekerja dan berpikir jernih meskipun rencana awal mendadak berubah atau fasilitas pendukung kurang lengkap.", "Berhasil menyelesaikan minimal 5 tugas/proyek yang mengalami perubahan mendadak di tengah jalan tanpa mengeluh berkepanjangan.", "Menyelesaikan minimal 5 latihan awal atau penyelesaian tugas di tengah keterbatasan alat/waktu dengan mengikuti panduan langkah demi langkah."], "2": ["Memiliki kebiasaan menyiapkan skenario cadangan (Plan A, B, dan C) untuk setiap kegiatan atau proyek penting.", "Berhasil memutar haluan (pivot) pada minimal 10 situasi sulit/gagal sehingga tetap menghasilkan capaian yang bermanfaat.", "Menghasilkan minimal 12–15 penyelesaian tugas di tengah keterbatasan alat/waktu pada ranah Adjustment dengan kualitas yang stabil dan terukur."], "3": ["Tenang dan cekatan memimpin adaptasi tim di tengah situasi tidak pasti (perubahan aturan mendadak, krisis sumber daya, atau pergeseran tren).", "Berhasil membawa proyek atau tim melewati ≥15 guncangan perubahan besar dengan hasil akhir yang justru lebih kuat dari sebelumnya.", "Memiliki rekam jejak minimal 30 penyelesaian tugas di tengah keterbatasan alat/waktu atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penyesuaian diri dengan tenang saat rencana berubah mendadak di lapangan."], "4": ["Menguasai ketangguhan antifragile: sistem dan cara kerjanya justru semakin rapi dan tangguh setiap kali melewati ujian krisis.", "Memiliki rekam jejak memimpin navigasi krisis di ≥30 situasi darurat/perubahan besar lintas tahun dengan kepala dingin.", "Menuntaskan minimal 60–100 penyelesaian tugas di tengah keterbatasan alat/waktu lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai ketenangan dan keluwesan tingkat bijaksana: tidak tergoyahkan oleh badai perubahan sebesar apa pun dalam hidup.", "Berhasil melewati berbagai pergantian era, krisis, dan transisi hidup selama puluhan tahun sambil terus berkarya nyata.", "Melahirkan warisan keluwesan sikap di lingkungan yang serba baru berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Berhasil mempelajari dan mempraktikkan minimal 3 keterampilan praktis baru di luar bidang utamanya dalam setahun terakhir.", "Memiliki kebiasaan mencatat rangkuman inti (poin penting + langkah praktik) setiap kali selesai mempelajari hal baru.", "Memahami konsep dasar Learning Agility (Adaptability) dan mampu mempraktikkan dekonstruksi keterampilan baru (prinsip 80/20) agar cepat dikuasai dari nol secara sederhana tanpa bingung."], "2": ["Berhasil menguasai minimal 6 keterampilan baru dari nol hingga level fungsional (bisa dipakai kerja/berkarya nyata) masing-masing dalam ≤30 jam latihan.", "Mampu langsung mempraktikkan ilmu baru pada proyek kecil di minggu pertama belajar, bukan hanya menumpuk teori.", "Lancar menerapkan dekonstruksi keterampilan baru (prinsip 80/20) agar cepat dikuasai dari nol secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memiliki rekam jejak menguasai ≥12 keterampilan lintas disiplin (teknis, kreatif, sosial, fisik) yang terbuktikan lewat karya nyata.", "Dapat menghubungkan pola dari satu bidang yang sudah dikuasai untuk mempercepat pemahaman di bidang baru (transfer belajar).", "Mampu menerapkan konsep Learning Agility (Adaptability) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Berhasil menaklukkan ≥20 kompetensi lintas bidang tingkat menengah-mahir dan merangkumnya menjadi panduan belajar bagi orang lain.", "Sering menjadi orang pertama di tim yang diterjunkan untuk mempelajari teknologi, aturan, atau medan baru yang belum ada panduannya.", "Menguasai Learning Agility pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang mesin belajar mandiri lintas disiplin (polymath) berstandar profesional."], "5": ["Memiliki keluasan dan kedalaman ilmu lintas disiplin yang terasah selama puluhan tahun belajar tanpa henti.", "Menginspirasi dan membekali banyak orang dengan metode belajar mandiri agar siap menghadapi perubahan dunia yang cepat.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Learning Agility: dekonstruksi keterampilan baru (prinsip 80/20) agar cepat dikuasai dari nol telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Tetap bisa bekerja dan berpikir jernih meskipun rencana awal mendadak berubah atau fasilitas pendukung kurang lengkap.", "Mampu membedakan dengan cepat mana hal yang masih bisa dikendalikan sendiri dan mana yang harus diikhlaskan/diadaptasi.", "Mampu mengenali contoh hasil Adaptive Intelligence yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Memiliki kebiasaan menyiapkan skenario cadangan (Plan A, B, dan C) untuk setiap kegiatan atau proyek penting.", "Mampu mengambil keputusan praktis dalam waktu ≤15 menit saat dihadapkan pada informasi yang belum lengkap 100%.", "Mampu menyelesaikan tantangan Adaptive Intelligence tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Tenang dan cekatan memimpin adaptasi tim di tengah situasi tidak pasti (perubahan aturan mendadak, krisis sumber daya, atau pergeseran tren).", "Dapat memanfaatkan keterbatasan alat atau anggaran menjadi solusi kreatif yang tak terpikirkan sebelumnya (improvisasi terukur).", "Kualitas hasil Adaptive Intelligence-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai ketangguhan antifragile: sistem dan cara kerjanya justru semakin rapi dan tangguh setiap kali melewati ujian krisis.", "Menjadi tempat bertanya utama ketika organisasi atau komunitas menghadapi situasi baru yang belum pernah dialami sebelumnya.", "Mampu membimbing dan mengoreksi praktik Adaptive Intelligence orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai ketenangan dan keluwesan tingkat bijaksana: tidak tergoyahkan oleh badai perubahan sebesar apa pun dalam hidup.", "Keteladanan adaptasinya memberi keberanian dan ketenangan bagi banyak orang untuk menghadapi masa depan yang tak pasti.", "Menjadi mahaguru/mentor utama di bidang Adaptability yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "12": {"1": ["Memiliki rasa ingin tahu yang sehat untuk mengunjungi tempat baru, mencoba makanan lokal, dan mengamati kehidupan warga setempat dengan sopan.", "Menyelesaikan minimal 5 catatan perjalanan atau observasi lapangan tentang kebiasaan dan keunikan suatu tempat/komunitas.", "Menyelesaikan minimal 5 latihan awal atau interaksi lintas latar belakang yang sopan & hangat dengan mengikuti panduan langkah demi langkah."], "2": ["Mampu tinggal atau beraktivitas di lingkungan yang sangat berbeda dari zona nyamannya (desa terpencil, kota baru, komunitas lintas budaya) dengan cepat menyatu.", "Melakukan minimal 10 perjalanan imersi budaya di mana ia belajar langsung dari warga atau pengrajin lokal.", "Menghasilkan minimal 12–15 interaksi lintas latar belakang yang sopan & hangat pada ranah Awareness dengan kualitas yang stabil dan terukur."], "3": ["Menguasai metode observasi lapangan mendalam (etnografi praktis): mampu menangkap kearifan lokal dan akar masalah suatu daerah secara utuh.", "Menyelesaikan ≥20 ekspedisi atau proyek lapangan lintas daerah/budaya yang menghasilkan dokumentasi atau program berdampak.", "Memiliki rekam jejak minimal 30 interaksi lintas latar belakang yang sopan & hangat atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penghormatan terhadap perbedaan adat, bahasa, & kebiasaan lingkungan baru."], "4": ["Mampu hidup dan berkarya secara efektif di belahan dunia atau lapisan budaya mana pun tanpa mengalami gegar budaya (culture shock) berkepanjangan.", "Memiliki rekam jejak ≥40 penjelajahan dan keterlibatan lintas budaya yang memperkaya wawasan serta jejaring kemanusiaannya.", "Menuntaskan minimal 60–100 interaksi lintas latar belakang yang sopan & hangat lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat penjelajah kemanusiaan seumur hidup yang menjadikan seluruh dunia sebagai ruang belajar dan bersaudara.", "Pengalaman lintas budaya selama puluhan tahun menjadikannya jembatan pengertian yang mendalam antar masyarakat yang berbeda.", "Melahirkan warisan kepekaan lintas budaya yang terbuka berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "13": {"1": ["Menyelesaikan minimal 5 catatan perjalanan atau observasi lapangan tentang kebiasaan dan keunikan suatu tempat/komunitas.", "Mampu berbaur di lingkungan baru tanpa menonjolkan diri secara berlebihan atau melanggar adat kesopanan setempat.", "Memahami konsep dasar Cultural Fluency (Cultural Intelligence) dan mampu mempraktikkan penyesuaian gaya komunikasi & etika saat berbaur di komunitas/daerah berbeda secara sederhana tanpa bingung."], "2": ["Melakukan minimal 10 perjalanan imersi budaya di mana ia belajar langsung dari warga atau pengrajin lokal.", "Menguasai frasa sapaan dan komunikasi praktis dalam bahasa/dialek setempat untuk membangun keakraban.", "Lancar menerapkan penyesuaian gaya komunikasi & etika saat berbaur di komunitas/daerah berbeda secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan ≥20 ekspedisi atau proyek lapangan lintas daerah/budaya yang menghasilkan dokumentasi atau program berdampak.", "Diterima seperti keluarga sendiri oleh berbagai komunitas lokal yang pernah dikunjungi atau didampinginya.", "Mampu menerapkan konsep Cultural Fluency (Cultural Intelligence) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥40 penjelajahan dan keterlibatan lintas budaya yang memperkaya wawasan serta jejaring kemanusiaannya.", "Menghasilkan karya tulis, film dokumenter, atau riset lapangan yang membuka mata publik tentang kekayaan budaya dan kehidupan manusia.", "Menguasai Cultural Fluency pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang keluwesan berbaur di lapisan masyarakat mana pun berstandar profesional."], "5": ["Pengalaman lintas budaya selama puluhan tahun menjadikannya jembatan pengertian yang mendalam antar masyarakat yang berbeda.", "Meninggalkan warisan catatan perjalanan dan kearifan lintas budaya yang menginspirasi generasi penjelajah berikutnya.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Cultural Fluency: penyesuaian gaya komunikasi & etika saat berbaur di komunitas/daerah berbeda telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "14": {"1": ["Memiliki rasa ingin tahu yang sehat untuk mengunjungi tempat baru, mencoba makanan lokal, dan mengamati kehidupan warga setempat dengan sopan.", "Mampu berbaur di lingkungan baru tanpa menonjolkan diri secara berlebihan atau melanggar adat kesopanan setempat.", "Mampu mengenali contoh hasil Cross-Cultural Competence yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu tinggal atau beraktivitas di lingkungan yang sangat berbeda dari zona nyamannya (desa terpencil, kota baru, komunitas lintas budaya) dengan cepat menyatu.", "Menguasai frasa sapaan dan komunikasi praktis dalam bahasa/dialek setempat untuk membangun keakraban.", "Mampu menyelesaikan tantangan Cross-Cultural Competence tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai metode observasi lapangan mendalam (etnografi praktis): mampu menangkap kearifan lokal dan akar masalah suatu daerah secara utuh.", "Diterima seperti keluarga sendiri oleh berbagai komunitas lokal yang pernah dikunjungi atau didampinginya.", "Kualitas hasil Cross-Cultural Competence-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu hidup dan berkarya secara efektif di belahan dunia atau lapisan budaya mana pun tanpa mengalami gegar budaya (culture shock) berkepanjangan.", "Menghasilkan karya tulis, film dokumenter, atau riset lapangan yang membuka mata publik tentang kekayaan budaya dan kehidupan manusia.", "Mampu membimbing dan mengoreksi praktik Cross-Cultural Competence orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai tingkat penjelajah kemanusiaan seumur hidup yang menjadikan seluruh dunia sebagai ruang belajar dan bersaudara.", "Meninggalkan warisan catatan perjalanan dan kearifan lintas budaya yang menginspirasi generasi penjelajah berikutnya.", "Menjadi mahaguru/mentor utama di bidang Cultural Intelligence yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}, "critical-thinking-logic": {"0": {"1": ["Mampu membedakan dengan jelas mana kalimat yang berisi fakta (bisa dibuktikan datanya) dan mana yang hanya opini atau perasaan pribadi.", "Menyelesaikan analisis pada minimal 10 artikel/argumen dengan menandai mana kesimpulan utama dan mana alasan pendukungnya.", "Menyelesaikan minimal 5 latihan awal atau analisis argumen bebas dari lompatan logika dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai logika dasar sebab-akibat (jika A maka B) serta mampu mengenali minimal 8 jenis sesat pikir (logical fallacy) yang sering muncul di debat.", "Berhasil membedah minimal 20 argumen publik, iklan, atau opini populer dan menemukan celah logika di dalamnya secara tertulis.", "Menghasilkan minimal 12–15 analisis argumen bebas dari lompatan logika pada ranah Deduction dengan kualitas yang stabil dan terukur."], "3": ["Mampu menguji kekuatan argumen lawan bicara dengan cara membangun versi terkuat dari argumen tersebut (steel-manning) sebelum menanggapinya.", "Menyelesaikan ≥40 analisis logika mendalam terhadap isu-isu kompleks tanpa terjebak serangan pribadi (ad hominem) atau emosi.", "Memiliki rekam jejak minimal 30 analisis argumen bebas dari lompatan logika atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penarikan kesimpulan yang sah dari premis/fakta dasar (jika A maka B)."], "4": ["Menguasai logika deduktif, induktif, dan abduktif tingkat lanjut untuk membedah persoalan hukum, ilmiah, atau strategis yang sangat rumit.", "Memiliki rekam jejak ≥80 dokumen analisis kritis yang menjadi landasan pengambilan keputusan penting di tim atau organisasi.", "Menuntaskan minimal 60–100 analisis argumen bebas dari lompatan logika lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai kejernihan logika tingkat master: pikirannya tajam membelah kerumitan, namun tetap rendah hati dan jujur terhadap kebenaran.", "Selama puluhan tahun dikenal sebagai penjaga akal sehat dan kejernihan berpikir di tengah kabut informasi dan opini massal.", "Melahirkan warisan ketajaman deduksi di luar kepala berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "1": {"1": ["Menyelesaikan analisis pada minimal 10 artikel/argumen dengan menandai mana kesimpulan utama dan mana alasan pendukungnya.", "Tidak mudah percaya atau langsung menyebarkan informasi mengejutkan sebelum memeriksa sumber aslinya.", "Memahami konsep dasar Formal Reasoning (Logic) dan mampu mempraktikkan pemetaan struktur argumen formal & pendeteksian sesat pikir (logical fallacy) secara sederhana tanpa bingung."], "2": ["Berhasil membedah minimal 20 argumen publik, iklan, atau opini populer dan menemukan celah logika di dalamnya secara tertulis.", "Dapat menyusun argumen sendiri dengan urutan premis (alasan + bukti) hingga kesimpulan yang runtut dan tidak melompat-lompat.", "Lancar menerapkan pemetaan struktur argumen formal & pendeteksian sesat pikir (logical fallacy) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan ≥40 analisis logika mendalam terhadap isu-isu kompleks tanpa terjebak serangan pribadi (ad hominem) atau emosi.", "Dapat menemukan asumsi tersembunyi yang tidak diucapkan di balik sebuah pernyataan atau kebijakan hanya dalam beberapa menit.", "Mampu menerapkan konsep Formal Reasoning (Logic) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥80 dokumen analisis kritis yang menjadi landasan pengambilan keputusan penting di tim atau organisasi.", "Mampu melatih orang lain berpikir runtut dan langsung menyadari ketika diskusi mulai keluar dari jalur logika yang sehat.", "Menguasai Formal Reasoning pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang penguasaan nalar formal di diskusi/tulisan berstandar profesional."], "5": ["Selama puluhan tahun dikenal sebagai penjaga akal sehat dan kejernihan berpikir di tengah kabut informasi dan opini massal.", "Warisan kerangka berpikir dan tulisannya menjadi standar rujukan dalam melatih ketajaman nalar generasi baru.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Formal Reasoning: pemetaan struktur argumen formal & pendeteksian sesat pikir (logical fallacy) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "2": {"1": ["Mampu membedakan dengan jelas mana kalimat yang berisi fakta (bisa dibuktikan datanya) dan mana yang hanya opini atau perasaan pribadi.", "Tidak mudah percaya atau langsung menyebarkan informasi mengejutkan sebelum memeriksa sumber aslinya.", "Mampu mengenali contoh hasil Proof yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai logika dasar sebab-akibat (jika A maka B) serta mampu mengenali minimal 8 jenis sesat pikir (logical fallacy) yang sering muncul di debat.", "Dapat menyusun argumen sendiri dengan urutan premis (alasan + bukti) hingga kesimpulan yang runtut dan tidak melompat-lompat.", "Mampu menyelesaikan tantangan Proof tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu menguji kekuatan argumen lawan bicara dengan cara membangun versi terkuat dari argumen tersebut (steel-manning) sebelum menanggapinya.", "Dapat menemukan asumsi tersembunyi yang tidak diucapkan di balik sebuah pernyataan atau kebijakan hanya dalam beberapa menit.", "Kualitas hasil Proof-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai logika deduktif, induktif, dan abduktif tingkat lanjut untuk membedah persoalan hukum, ilmiah, atau strategis yang sangat rumit.", "Mampu melatih orang lain berpikir runtut dan langsung menyadari ketika diskusi mulai keluar dari jalur logika yang sehat.", "Mampu membimbing dan mengoreksi praktik Proof orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai kejernihan logika tingkat master: pikirannya tajam membelah kerumitan, namun tetap rendah hati dan jujur terhadap kebenaran.", "Warisan kerangka berpikir dan tulisannya menjadi standar rujukan dalam melatih ketajaman nalar generasi baru.", "Menjadi mahaguru/mentor utama di bidang Logic yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "3": {"1": ["Mampu berdiskusi tentang topik yang berbeda pandangan dengan kepala dingin, fokus membahas idenya dan bukan menyerang orangnya.", "Menyelesaikan minimal 5 diskusi/debat sehat di mana ia mampu merangkum ulang pendapat lawan bicara hingga lawan bicara berkata 'Ya, tepat itu maksud saya'.", "Menyelesaikan minimal 5 latihan awal atau daftar pertanyaan Sokratik yang membuka akar masalah dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai metode tanya-jawab Sokratik: mengajukan pertanyaan bertahap yang menuntun lawan diskusi menguji asumsi dan logikanya sendiri.", "Berpartisipasi aktif dalam minimal 15 forum diskusi kritis, bedah buku, atau debat terstruktur dengan argumen yang jernih dan santun.", "Menghasilkan minimal 12–15 daftar pertanyaan Sokratik yang membuka akar masalah pada ranah Questioning dengan kualitas yang stabil dan terukur."], "3": ["Mampu menjadi moderator atau penanggap utama dalam diskusi panas sehingga perdebatan berubah menjadi pencarian kebenaran bersama (dialektika sehat).", "Berhasil membedah dan menjembatani ≥30 perdebatan pemikiran yang rumit hingga lahir sintesis pemahaman baru yang lebih utuh.", "Memiliki rekam jejak minimal 30 daftar pertanyaan Sokratik yang membuka akar masalah atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pengajuan pertanyaan tajam ('Mengapa?', 'Apa buktinya?') untuk menguji asumsi."], "4": ["Menguasai seni dialektika dan wacana intelektual tingkat tinggi di forum akademik, kebijakan publik, maupun diskusi lintas aliran pemikiran.", "Telah memimpin atau menjadi pembicara kunci dalam ≥60 forum dialektika strategis yang menghasilkan terobosan pemikiran bersama.", "Menuntaskan minimal 60–100 daftar pertanyaan Sokratik yang membuka akar masalah lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat filsuf-praktisi dalam berdialog: setiap percakapan dengannya membuat lawan bicara pulang dengan pikiran yang lebih tercerahkan.", "Memiliki rekam jejak puluhan tahun menghidupkan budaya diskusi yang dewasa, kritis, dan penuh rasa hormat di masyarakat.", "Melahirkan warisan kebiasaan bertanya kritis yang membongkar kabut opini berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "4": {"1": ["Menyadari perbedaan antara 'dua hal terjadi bersamaan' (korelasi) dengan 'hal A menyebabkan hal B' (kausalitas) pada minimal 10 contoh nyata.", "Selalu menanyakan berapa jumlah sampel data sebelum mempercayai klaim survei atau testimoni keberhasilan.", "Memahami konsep dasar Evidence Evaluation (Epistemology) dan mampu mempraktikkan penilaian kualitas bukti (fakta primer vs opini, ukuran sampel, & korelasi vs kausalitas) secara sederhana tanpa bingung."], "2": ["Menggunakan perhitungan nilai harapan (expected value: dampak × peluang) pada minimal 10 keputusan penting.", "Mengenali jebakan bias data seperti survivorship bias (hanya melihat yang sukses dan melupakan yang gagal) dalam studi kasus nyata.", "Lancar menerapkan penilaian kualitas bukti (fakta primer vs opini, ukuran sampel, & korelasi vs kausalitas) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Menyelesaikan ≥25 analisis berbasis data dan angka untuk menguji apakah suatu asumsi atau strategi benar-benar terbukti di lapangan.", "Mampu membuat taksiran angka kasar (Fermi estimation) yang masuk akal untuk hal-hal yang belum ada data pastinya dalam ≤10 menit.", "Mampu menerapkan konsep Evidence Evaluation (Epistemology) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak ≥50 kajian kuantitatif/probabilistik yang berhasil menghindarkan organisasi dari kesalahan keputusan bernilai besar.", "Tingkat akurasi prediksinya terkalibrasi dengan baik (ketika yakin 80%, maka sekitar 8 dari 10 prediksinya memang terbukti benar).", "Menguasai Evidence Evaluation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang ketajaman menyaring kebenaran dari klaim semu berstandar profesional."], "5": ["Kemampuannya membaca sinyal kebenaran di tengah lautan data dan ketidakpastian telah teruji akurat selama puluhan tahun.", "Menjadi rujukan utama dalam membangun budaya pengambilan keputusan berbasis bukti (evidence-based) yang jujur dan terukur.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Evidence Evaluation: penilaian kualitas bukti (fakta primer vs opini, ukuran sampel, & korelasi vs kausalitas) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "5": {"1": ["Memahami cara membaca grafik, persentase, dan nilai rata-rata dengan benar tanpa mudah tertipu tampilan grafik yang membesar-besarkan angka.", "Selalu menanyakan berapa jumlah sampel data sebelum mempercayai klaim survei atau testimoni keberhasilan.", "Mampu mengenali contoh hasil Epistemic Judgment yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Mampu berpikir dalam peluang (probabilitas 0–100%), bukan sekadar hitam-putih 'pasti berhasil' atau 'pasti gagal'.", "Mengenali jebakan bias data seperti survivorship bias (hanya melihat yang sukses dan melupakan yang gagal) dalam studi kasus nyata.", "Mampu menyelesaikan tantangan Epistemic Judgment tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai cara memperbarui keyakinan secara proporsional setiap kali ada bukti atau data baru yang masuk (cara berpikir Bayesian praktis).", "Mampu membuat taksiran angka kasar (Fermi estimation) yang masuk akal untuk hal-hal yang belum ada data pastinya dalam ≤10 menit.", "Kualitas hasil Epistemic Judgment-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu merancang eksperimen pengujian yang adil (A/B test atau uji kontrol) dan membaca hasilnya tanpa terjebak noise data acak.", "Tingkat akurasi prediksinya terkalibrasi dengan baik (ketika yakin 80%, maka sekitar 8 dari 10 prediksinya memang terbukti benar).", "Mampu membimbing dan mengoreksi praktik Epistemic Judgment orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai kematangan nalar kuantitatif dan probabilistik tingkat master yang menyatu secara alami dalam setiap pertimbangan hidup.", "Menjadi rujukan utama dalam membangun budaya pengambilan keputusan berbasis bukti (evidence-based) yang jujur dan terukur.", "Menjadi mahaguru/mentor utama di bidang Epistemology yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "6": {"1": ["Tidak puas hanya mengobati gejala luar masalah, melainkan terbiasa bertanya 'Mengapa?' minimal 5 kali (5 Whys) untuk mencari penyebab aslinya.", "Berhasil memecahkan minimal 5 masalah nyata di keseharian/kerjaan dengan menemukan akar penyebabnya, bukan sekadar tambal sulam.", "Menyelesaikan minimal 5 latihan awal atau pohon masalah (issue tree) yang terstruktur rapi dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai penggunaan pohon masalah (issue tree / fishbone diagram) dan prinsip First Principles (mengurai masalah sampai ke kebenaran paling dasar).", "Berhasil mendiagnosis dan menyelesaikan minimal 15 masalah berulang di proyek, studi, atau kehidupan pribadi hingga tuntas.", "Menghasilkan minimal 12–15 pohon masalah (issue tree) yang terstruktur rapi pada ranah Decomposition dengan kualitas yang stabil dan terukur."], "3": ["Mampu mengurai persoalan kusut yang melibatkan banyak faktor (manusia, teknis, waktu, biaya) menjadi peta solusi yang jernih dalam waktu singkat.", "Memiliki rekam jejak menyelesaikan ≥30 kasus masalah pelik di mana solusi buatannya mencegah masalah tersebut kambuh lagi.", "Memiliki rekam jejak minimal 30 pohon masalah (issue tree) yang terstruktur rapi atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pemecahan masalah besar yang rumit menjadi bagian-bagian kecil yang jelas."], "4": ["Menguasai pemecahan masalah strategis tingkat tinggi: mampu menemukan jalan keluar pada kebuntuan yang sudah gagal diselesaikan banyak pihak.", "Berhasil memimpin penyelesaian ≥60 persoalan kritis lintas bidang dengan dampak penghematan waktu, biaya, atau pemulihan kinerja yang nyata.", "Menuntaskan minimal 60–100 pohon masalah (issue tree) yang terstruktur rapi lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai ketajaman pemecah masalah tingkat mahaguru: mampu melihat inti persoalan dan jalan keluarnya di saat orang lain hanya melihat kekacauan.", "Pengalaman puluhan tahun membedah ratusan masalah besar menjadikannya kompas kebijaksanaan praktis yang sangat diandalkan.", "Melahirkan warisan kemampuan mengurai kerumitan dalam hitungan menit berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "7": {"1": ["Berhasil memecahkan minimal 5 masalah nyata di keseharian/kerjaan dengan menemukan akar penyebabnya, bukan sekadar tambal sulam.", "Mampu memecah satu masalah besar yang membingungkan menjadi 3–5 bagian kecil yang lebih mudah diselesaikan satu per satu.", "Memahami konsep dasar Fundamental Analysis (First Principles) dan mampu mempraktikkan penggalian masalah hingga ke kebenaran paling dasar (5 Whys & First Principles) secara sederhana tanpa bingung."], "2": ["Berhasil mendiagnosis dan menyelesaikan minimal 15 masalah berulang di proyek, studi, atau kehidupan pribadi hingga tuntas.", "Dapat membedakan mana masalah yang hanya berdampak kecil dan mana 20% akar masalah yang jika dibereskan akan menyelesaikan 80% kendala.", "Lancar menerapkan penggalian masalah hingga ke kebenaran paling dasar (5 Whys & First Principles) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memiliki rekam jejak menyelesaikan ≥30 kasus masalah pelik di mana solusi buatannya mencegah masalah tersebut kambuh lagi.", "Dapat merancang solusi baru dari nol dengan berangkat dari fakta dasar, tanpa terikat pada cara lama yang sudah tidak efektif.", "Mampu menerapkan konsep Fundamental Analysis (First Principles) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Berhasil memimpin penyelesaian ≥60 persoalan kritis lintas bidang dengan dampak penghematan waktu, biaya, atau pemulihan kinerja yang nyata.", "Menjadi pemikir utama (troubleshooter) yang selalu dipanggil ketika tim atau institusi menghadapi masalah paling rumit.", "Menguasai Fundamental Analysis pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang analisis fundamental yang menembus kebiasaan lama berstandar profesional."], "5": ["Pengalaman puluhan tahun membedah ratusan masalah besar menjadikannya kompas kebijaksanaan praktis yang sangat diandalkan.", "Mewariskan metode berpikir dasar (first principles) yang memberdayakan banyak orang untuk mandiri menyelesaikan masalah besar mereka.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Fundamental Analysis: penggalian masalah hingga ke kebenaran paling dasar (5 Whys & First Principles) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "8": {"1": ["Tidak puas hanya mengobati gejala luar masalah, melainkan terbiasa bertanya 'Mengapa?' minimal 5 kali (5 Whys) untuk mencari penyebab aslinya.", "Mampu memecah satu masalah besar yang membingungkan menjadi 3–5 bagian kecil yang lebih mudah diselesaikan satu per satu.", "Mampu mengenali contoh hasil Conceptual Reconstruction yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai penggunaan pohon masalah (issue tree / fishbone diagram) dan prinsip First Principles (mengurai masalah sampai ke kebenaran paling dasar).", "Dapat membedakan mana masalah yang hanya berdampak kecil dan mana 20% akar masalah yang jika dibereskan akan menyelesaikan 80% kendala.", "Mampu menyelesaikan tantangan Conceptual Reconstruction tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu mengurai persoalan kusut yang melibatkan banyak faktor (manusia, teknis, waktu, biaya) menjadi peta solusi yang jernih dalam waktu singkat.", "Dapat merancang solusi baru dari nol dengan berangkat dari fakta dasar, tanpa terikat pada cara lama yang sudah tidak efektif.", "Kualitas hasil Conceptual Reconstruction-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai pemecahan masalah strategis tingkat tinggi: mampu menemukan jalan keluar pada kebuntuan yang sudah gagal diselesaikan banyak pihak.", "Menjadi pemikir utama (troubleshooter) yang selalu dipanggil ketika tim atau institusi menghadapi masalah paling rumit.", "Mampu membimbing dan mengoreksi praktik Conceptual Reconstruction orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai ketajaman pemecah masalah tingkat mahaguru: mampu melihat inti persoalan dan jalan keluarnya di saat orang lain hanya melihat kekacauan.", "Mewariskan metode berpikir dasar (first principles) yang memberdayakan banyak orang untuk mandiri menyelesaikan masalah besar mereka.", "Menjadi mahaguru/mentor utama di bidang First Principles yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "9": {"1": ["Mengenali minimal 5 jebakan pikiran manusia (cognitive bias) yang paling sering dialami sendiri, seperti hanya mencari info yang mendukung pendapat sendiri (confirmation bias).", "Punya kebiasaan menunda keputusan penting minimal beberapa jam saat sedang terlalu marah, takut, atau terlalu bersemangat.", "Menyelesaikan minimal 5 latihan awal atau catatan refleksi bias pribadi pada keputusan harian dengan mengikuti panduan langkah demi langkah."], "2": ["Rutin mempraktikkan 'berpikir terbalik': sengaja mencari alasan mengapa pendapat atau rencananya sendiri bisa salah sebelum dijalankan.", "Menggunakan daftar periksa (checklist) sederhana untuk menguji minimal 15 keputusan penting agar bebas dari emosi sesaat.", "Menghasilkan minimal 12–15 catatan refleksi bias pribadi pada keputusan harian pada ranah Bias Awareness dengan kualitas yang stabil dan terukur."], "3": ["Menguasai kesadaran metakognisi (mengamati cara kerja pikiran sendiri secara real-time) sehingga langsung sadar saat ego mulai menutup logika.", "Memiliki jurnal keputusan (decision journal) berisi ≥30 catatan keputusan besar beserta evaluasi jujur atas hasil dan bias yang terjadi.", "Memiliki rekam jejak minimal 30 catatan refleksi bias pribadi pada keputusan harian atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pengenalan jebakan pikiran sendiri (confirmation bias, emosi sesaat, ikut-ikutan)."], "4": ["Mampu merancang prosedur diskusi tim (seperti menunjuk penentang uji / devil's advocate dan pre-mortem) agar kelompok tidak terjebak ikut-ikutan (groupthink).", "Telah memfasilitasi ≥50 tinjauan keputusan strategis yang menyelamatkan tim dari kebutaan asumsi dan rasa percaya diri berlebihan.", "Menuntaskan minimal 60–100 catatan refleksi bias pribadi pada keputusan harian lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai kejernihan batin dan pikiran tingkat bijaksana yang sangat bersih dari delusi diri, kesombongan intelektual, maupun prasangka buta.", "Keteladanan kerendahan hati intelektualnya selama puluhan tahun membuat nasihat dan pertimbangannya sangat dipercaya semua pihak.", "Melahirkan warisan kesadaran metakognisi (mengamati pikiran sendiri) berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "10": {"1": ["Punya kebiasaan menunda keputusan penting minimal beberapa jam saat sedang terlalu marah, takut, atau terlalu bersemangat.", "Mencatat minimal 5 kesalahan penilaian pribadi di masa lalu dan menuliskan pelajaran agar tidak terulang.", "Memahami konsep dasar Bias Mitigation (Cognitive Bias) dan mampu mempraktikkan penerapan teknik berpikir terbalik (mencari alasan mengapa diri sendiri bisa salah) secara sederhana tanpa bingung."], "2": ["Menggunakan daftar periksa (checklist) sederhana untuk menguji minimal 15 keputusan penting agar bebas dari emosi sesaat.", "Berani mengubah pendapat secara terbuka di depan orang lain ketika disodori bukti atau data baru yang lebih benar.", "Lancar menerapkan penerapan teknik berpikir terbalik (mencari alasan mengapa diri sendiri bisa salah) secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Memiliki jurnal keputusan (decision journal) berisi ≥30 catatan keputusan besar beserta evaluasi jujur atas hasil dan bias yang terjadi.", "Mampu menjaga objektivitas penilaian terhadap seseorang atau suatu ide terlepas dari rasa suka atau tidak suka secara pribadi.", "Mampu menerapkan konsep Bias Mitigation (Cognitive Bias) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah memfasilitasi ≥50 tinjauan keputusan strategis yang menyelamatkan tim dari kebutaan asumsi dan rasa percaya diri berlebihan.", "Dikenal memiliki kejujuran intelektual yang tinggi: selalu memprioritaskan pencarian kebenaran di atas gengsi memenangkan perdebatan.", "Menguasai Bias Mitigation pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang kebiasaan memitigasi bias secara disiplin berstandar profesional."], "5": ["Keteladanan kerendahan hati intelektualnya selama puluhan tahun membuat nasihat dan pertimbangannya sangat dipercaya semua pihak.", "Membimbing banyak pemikir dan pemimpin untuk berani bercermin secara jujur terhadap keterbatasan pikiran mereka sendiri.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Bias Mitigation: penerapan teknik berpikir terbalik (mencari alasan mengapa diri sendiri bisa salah) telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "11": {"1": ["Mengenali minimal 5 jebakan pikiran manusia (cognitive bias) yang paling sering dialami sendiri, seperti hanya mencari info yang mendukung pendapat sendiri (confirmation bias).", "Mencatat minimal 5 kesalahan penilaian pribadi di masa lalu dan menuliskan pelajaran agar tidak terulang.", "Mampu mengenali contoh hasil Debiasing Systems yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Rutin mempraktikkan 'berpikir terbalik': sengaja mencari alasan mengapa pendapat atau rencananya sendiri bisa salah sebelum dijalankan.", "Berani mengubah pendapat secara terbuka di depan orang lain ketika disodori bukti atau data baru yang lebih benar.", "Mampu menyelesaikan tantangan Debiasing Systems tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Menguasai kesadaran metakognisi (mengamati cara kerja pikiran sendiri secara real-time) sehingga langsung sadar saat ego mulai menutup logika.", "Mampu menjaga objektivitas penilaian terhadap seseorang atau suatu ide terlepas dari rasa suka atau tidak suka secara pribadi.", "Kualitas hasil Debiasing Systems-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Mampu merancang prosedur diskusi tim (seperti menunjuk penentang uji / devil's advocate dan pre-mortem) agar kelompok tidak terjebak ikut-ikutan (groupthink).", "Dikenal memiliki kejujuran intelektual yang tinggi: selalu memprioritaskan pencarian kebenaran di atas gengsi memenangkan perdebatan.", "Mampu membimbing dan mengoreksi praktik Debiasing Systems orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai kejernihan batin dan pikiran tingkat bijaksana yang sangat bersih dari delusi diri, kesombongan intelektual, maupun prasangka buta.", "Membimbing banyak pemikir dan pemimpin untuk berani bercermin secara jujur terhadap keterbatasan pikiran mereka sendiri.", "Menjadi mahaguru/mentor utama di bidang Cognitive Bias yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "12": {"1": ["Menyadari bahwa satu tindakan tidak hanya menimbulkan hasil langsung saat ini, tetapi juga dampak lanjutan di kemudian hari.", "Mampu menggambar alur hubungan sederhana (bagaimana bagian A memengaruhi bagian B dan C) pada minimal 5 sistem sehari-hari (tubuh, keuangan, tim).", "Menyelesaikan minimal 5 latihan awal atau peta rantai sebab-akibat dari suatu fenomena dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai konsep lingkar ump反馈 (reinforcing loop yang menggulung membesar vs balancing loop yang menyeimbangkan) serta efek penundaan waktu (delay).", "Menyelesaikan minimal 12 pemetaan sistem (system mapping) untuk memahami mengapa suatu kebiasaan, organisasi, atau pasar berjalan seperti sekarang.", "Menghasilkan minimal 12–15 peta rantai sebab-akibat dari suatu fenomena pada ranah Causal Reasoning dengan kualitas yang stabil dan terukur."], "3": ["Mampu menemukan titik ungkit (leverage point) di dalam sebuah sistem rumit: perubahan kecil di titik yang tepat yang mengubah keseluruhan hasil.", "Berhasil memperbaiki minimal 20 masalah sistemik dengan membenahi aturan main dan alur insentifnya, bukan sekadar menyalahkan orangnya.", "Memiliki rekam jejak minimal 30 peta rantai sebab-akibat dari suatu fenomena atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan penelusuran rantai sebab-akibat langsung maupun dampak turunan kedua/ketiga."], "4": ["Menguasai arsitektur berpikir sistem lintas bidang (ekonomi, ekologi, teknologi, psikologi sosial) untuk memetakan persoalan berskala besar.", "Memiliki rekam jejak merancang ≥40 intervensi sistemik atau kebijakan organisasi yang bertahan sehat dan stabil dalam jangka panjang.", "Menuntaskan minimal 60–100 peta rantai sebab-akibat dari suatu fenomena lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai penguasaan berpikir sistem tingkat maestro yang mampu melihat jaring keterhubungan utuh dari masa lalu, masa kini, hingga puluhan tahun ke depan.", "Karya pemikiran dan rancangan sistemnya telah menciptakan keseimbangan dan dampak berkelanjutan lintas generasi.", "Melahirkan warisan ketajaman membaca dampak jangka panjang berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "13": {"1": ["Mampu menggambar alur hubungan sederhana (bagaimana bagian A memengaruhi bagian B dan C) pada minimal 5 sistem sehari-hari (tubuh, keuangan, tim).", "Tidak buru-buru mengambil jalan pintas yang menyelesaikan masalah hari ini namun menciptakan masalah lebih besar bulan depan.", "Memahami konsep dasar Feedback Loops (Systems Thinking) dan mampu mempraktikkan pengenalan lingkar umpan balik (reinforcing vs balancing loop) & jeda waktu secara sederhana tanpa bingung."], "2": ["Menyelesaikan minimal 12 pemetaan sistem (system mapping) untuk memahami mengapa suatu kebiasaan, organisasi, atau pasar berjalan seperti sekarang.", "Selalu menanyakan 'Lalu apa dampak keduanya dan ketiganya?' (Second & Third-Order Thinking) sebelum menetapkan aturan atau solusi baru.", "Lancar menerapkan pengenalan lingkar umpan balik (reinforcing vs balancing loop) & jeda waktu secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil memperbaiki minimal 20 masalah sistemik dengan membenahi aturan main dan alur insentifnya, bukan sekadar menyalahkan orangnya.", "Dapat mengantisipasi efek samping tak terduga (unintended consequences) dari sebuah kebijakan atau desain produk sebelum diluncurkan.", "Mampu menerapkan konsep Feedback Loops (Systems Thinking) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Memiliki rekam jejak merancang ≥40 intervensi sistemik atau kebijakan organisasi yang bertahan sehat dan stabil dalam jangka panjang.", "Mampu menjelaskan keterkaitan sistem yang sangat rumit menjadi diagram dan penjelasan yang jernih bagi pengambil keputusan.", "Menguasai Feedback Loops pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang kemampuan memutus lingkaran masalah berulang berstandar profesional."], "5": ["Karya pemikiran dan rancangan sistemnya telah menciptakan keseimbangan dan dampak berkelanjutan lintas generasi.", "Menjadi rujukan kebijaksanaan strategis bagi para pemimpin dalam menata organisasi dan masyarakat yang sehat.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Feedback Loops: pengenalan lingkar umpan balik (reinforcing vs balancing loop) & jeda waktu telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "14": {"1": ["Menyadari bahwa satu tindakan tidak hanya menimbulkan hasil langsung saat ini, tetapi juga dampak lanjutan di kemudian hari.", "Tidak buru-buru mengambil jalan pintas yang menyelesaikan masalah hari ini namun menciptakan masalah lebih besar bulan depan.", "Mampu mengenali contoh hasil Systems Modeling yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Menguasai konsep lingkar ump反馈 (reinforcing loop yang menggulung membesar vs balancing loop yang menyeimbangkan) serta efek penundaan waktu (delay).", "Selalu menanyakan 'Lalu apa dampak keduanya dan ketiganya?' (Second & Third-Order Thinking) sebelum menetapkan aturan atau solusi baru.", "Mampu menyelesaikan tantangan Systems Modeling tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu menemukan titik ungkit (leverage point) di dalam sebuah sistem rumit: perubahan kecil di titik yang tepat yang mengubah keseluruhan hasil.", "Dapat mengantisipasi efek samping tak terduga (unintended consequences) dari sebuah kebijakan atau desain produk sebelum diluncurkan.", "Kualitas hasil Systems Modeling-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai arsitektur berpikir sistem lintas bidang (ekonomi, ekologi, teknologi, psikologi sosial) untuk memetakan persoalan berskala besar.", "Mampu menjelaskan keterkaitan sistem yang sangat rumit menjadi diagram dan penjelasan yang jernih bagi pengambil keputusan.", "Mampu membimbing dan mengoreksi praktik Systems Modeling orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai penguasaan berpikir sistem tingkat maestro yang mampu melihat jaring keterhubungan utuh dari masa lalu, masa kini, hingga puluhan tahun ke depan.", "Menjadi rujukan kebijaksanaan strategis bagi para pemimpin dalam menata organisasi dan masyarakat yang sehat.", "Menjadi mahaguru/mentor utama di bidang Systems Thinking yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}, "15": {"1": ["Mampu membedakan antara informasi dari sumber primer (jurnal resmi, dokumen asli, data langsung) dengan kabar burung atau opini media sosial.", "Melakukan pengecekan silang (minimal dari 2–3 sumber tepercaya yang berbeda) sebelum menjadikan suatu informasi sebagai pegangan.", "Menyelesaikan minimal 5 latihan awal atau analisis konsep yang membedakan hal serupa tapi tak sama dengan mengikuti panduan langkah demi langkah."], "2": ["Menguasai teknik pencarian literatur mendalam, membaca cepat struktur laporan/jurnal ilmiah, dan menilai kredibilitas metodologi penelitian.", "Menyelesaikan minimal 15 kajian riset komparatif yang merangkum pandangan pro, kontra, dan bukti terkuat dari suatu topik.", "Menghasilkan minimal 12–15 analisis konsep yang membedakan hal serupa tapi tak sama pada ranah Conceptual Analysis dengan kualitas yang stabil dan terukur."], "3": ["Mampu mensintesis puluhan sumber lintas bidang yang saling bertentangan menjadi satu peta kesimpulan yang utuh, jujur, dan berimbang.", "Menghasilkan ≥30 laporan riset mendalam, tinjauan pustaka, atau naskah analisis yang bebas dari kutipan menyesatkan (cherry-picking).", "Memiliki rekam jejak minimal 30 analisis konsep yang membedakan hal serupa tapi tak sama atau jam terbang konsisten selama ≥1 tahun yang membuktikan kematangan pendefinisian makna kata/konsep secara jernih agar diskusi tidak rancu."], "4": ["Menguasai metodologi riset dan sintesis tingkat pakar: mampu menemukan celah pengetahuan baru yang belum terjawab oleh kajian-kajian sebelumnya.", "Karya riset dan sintesis ilmunya (≥50 kajian/publikasi) dijadikan rujukan tepercaya oleh rekan sejawat, praktisi, maupun pembuat kebijakan.", "Menuntaskan minimal 60–100 analisis konsep yang membedakan hal serupa tapi tak sama lintas tahun dengan dampak kualitas yang diakui luas oleh rekan sejawat."], "5": ["Mencapai tingkat cendekiawan dan periset utama yang karyanya menjadi jembatan antara kebenaran ilmiah yang dalam dengan pemahaman masyarakat.", "Memiliki warisan riset dan sintesis lintas dekade yang dikenal karena ketelitian, kejernihan, dan integritas datanya yang tak tergoyahkan.", "Melahirkan warisan kejernihan definisi dan kerangka konsep berskala besar yang bertahan lintas waktu dan menjadi standar acuan tertinggi."]}, "16": {"1": ["Menyelesaikan minimal 5 diskusi/debat sehat di mana ia mampu merangkum ulang pendapat lawan bicara hingga lawan bicara berkata 'Ya, tepat itu maksud saya'.", "Berani bertanya dengan tulus untuk memahami alasan di balik pendapat orang yang berbeda pandangan.", "Memahami konsep dasar Philosophical Inquiry (Philosophy) dan mampu mempraktikkan penjelajahan pertanyaan mendasar tentang nilai, etika, tujuan, & hakikat secara sederhana tanpa bingung."], "2": ["Berpartisipasi aktif dalam minimal 15 forum diskusi kritis, bedah buku, atau debat terstruktur dengan argumen yang jernih dan santun.", "Mampu mempertahankan argumen secara kokoh sekaligus langsung mengakui poin lawan bicara jika memang terbukti lebih masuk akal.", "Lancar menerapkan penjelajahan pertanyaan mendasar tentang nilai, etika, tujuan, & hakikat secara mandiri tanpa harus terus-menerus melihat contekan panduan dasar."], "3": ["Berhasil membedah dan menjembatani ≥30 perdebatan pemikiran yang rumit hingga lahir sintesis pemahaman baru yang lebih utuh.", "Dapat menyampaikan kritik tajam terhadap sebuah gagasan dengan cara yang justru membuat pemilik gagasan merasa dihargai dan terbantu.", "Mampu menerapkan konsep Philosophical Inquiry (Philosophy) di luar kepala pada berbagai situasi nyata yang bervariasi."], "4": ["Telah memimpin atau menjadi pembicara kunci dalam ≥60 forum dialektika strategis yang menghasilkan terobosan pemikiran bersama.", "Dikenal luas sebagai pemikir yang adil, tajam, dan menyejukkan dalam setiap pertukaran gagasan besar.", "Menguasai Philosophical Inquiry pada tingkat mahir: mampu memecahkan kasus-kasus rumit dan merancang kedalaman penyelidikan filsafat praktis berstandar profesional."], "5": ["Memiliki rekam jejak puluhan tahun menghidupkan budaya diskusi yang dewasa, kritis, dan penuh rasa hormat di masyarakat.", "Warisan teladannya membuktikan bahwa perbedaan pendapat yang diolah dengan nalar dan kasih adalah jalan menuju kebijaksanaan.", "Mencapai penguasaan seumur hidup (Lifelong Master) pada Philosophical Inquiry: penjelajahan pertanyaan mendasar tentang nilai, etika, tujuan, & hakikat telah menyatu menjadi intuisi tajam yang teruji ≥5–10 tahun."]}, "17": {"1": ["Tidak hanya menilai sebuah keputusan dari 'apakah ini menguntungkan dan bisa dilakukan', tetapi juga 'apakah ini benar, adil, dan tidak merugikan orang lain'.", "Berani menolak cara curang atau jalan pintas yang melanggar nurani meskipun tidak ada orang lain yang mengawasi.", "Mampu mengenali contoh hasil Philosophical Synthesis yang sudah rapi dan mencatat 3 hal dasar yang perlu diperbaiki dari latihan sendiri."], "2": ["Memahami berbagai sudut pandang etika (kewajiban moral, dampak bagi banyak orang, dan pembentukan karakter/kebajikan) saat membedah dilema.", "Selalu mempertimbangkan bagaimana dampak suatu keputusan terhadap pihak yang paling lemah atau tidak punya suara di dalam sistem.", "Mampu menyelesaikan tantangan Philosophical Synthesis tingkat menengah dalam waktu yang wajar serta memperbaiki kesalahan sendiri."], "3": ["Mampu mengambil sikap yang tegas dan adil ketika menghadapi area abu-abu (konflik antara dua hal yang sama-sama penting, misal kejujuran vs kesetiaan).", "Mampu merumuskan pedoman etika praktis (kode etik kerja/karya) bagi diri sendiri maupun tim yang dipimpinnya.", "Kualitas hasil Philosophical Synthesis-nya sudah diandalkan oleh tim, komunitas, atau pengguna nyata tanpa perlu pengawasan ketat."], "4": ["Menguasai penalaran etika strategis terhadap isu-isu masa depan (dampak teknologi baru, keadilan sosial, tata kelola institusi, dan kelestarian lingkungan).", "Mampu memadukan ketajaman logika tertinggi dengan kepekaan hati nurani sehingga solusi yang lahir bukan hanya cerdas, melainkan juga beradab.", "Mampu membimbing dan mengoreksi praktik Philosophical Synthesis orang lain secara tepat hingga mereka ikut naik kelas."], "5": ["Mencapai puncak kebijaksanaan praktis (phronesis / sage wisdom): penyatuan utuh antara akal yang terang, hati yang bersih, dan tindakan yang adil.", "Mewariskan warisan kebijaksanaan hidup yang menuntun generasi berikutnya agar menggunakan kecerdasan mereka untuk kebaikan sesama.", "Menjadi mahaguru/mentor utama di bidang Philosophy yang menginspirasi dan mencetak generasi praktisi unggul berikutnya."]}}};

      const SEED_CATEGORIES = RAW_SEED_CATEGORIES.map(cat => {
        const nodes = [];
        const capabilities = [];
        const domTierCatalog = TIER_DETAILS_CATALOG[cat.slug] || {};
        const constellation = DOMAIN_CONSTELLATIONS[cat.slug] || DOMAIN_CONSTELLATIONS['engineering'];
        cat.branches.forEach((b, bIdx) => {
          const branchTierDetails = domTierCatalog[b.name] || [];
          b.tiers.forEach((nodeTitle, tIdx) => {
            const flatIdx = bIdx * 3 + tIdx;
            const tierMeta = TIER_META[tIdx];
            const crossList = (b.crossPrereqs && b.crossPrereqs[tIdx]) ? b.crossPrereqs[tIdx] : [];
            const tDetail = branchTierDetails[tIdx] || {
              title: nodeTitle,
              whatIs: b.output,
              howToUse: b.criteria,
              targetWorks: [b.output, b.criteria, b.reflection],
              criteria: b.criteria
            };
            const rawTw = Array.isArray(tDetail.targetWorks) ? tDetail.targetWorks : [b.output, b.criteria, b.reflection];
            const cleanTw = rawTw.map(w => String(w || '')
              .replace(/^Tugas Besar \d+\s*\[[^\]]*\]:\s*/i, '')
              .replace(/\s*\(Output nyata teruji di lapangan[^)]*\)\.?$/i, '')
              .trim()
            );
            const customNodeInds = (LIFELONG_INDICATORS_132[cat.slug] && LIFELONG_INDICATORS_132[cat.slug][String(flatIdx)]) || null;
            const levelIndicators = customNodeInds ? {
              1: customNodeInds["1"],
              2: customNodeInds["2"],
              3: customNodeInds["3"],
              4: customNodeInds["4"],
              5: customNodeInds["5"]
            } : {
              1: [
                `Memahami konsep dasar ${nodeTitle} (${b.name}) dan mampu mempraktikkannya dengan panduan langkah demi langkah.`,
                `Menyelesaikan minimal 5 latihan awal pada ${nodeTitle}: ${cleanTw[0] || b.output}`,
                `Mengenali tolok ukur kerapian dasar pada ${nodeTitle}.`
              ],
              2: [
                `Lancar mempraktikkan ${nodeTitle} secara mandiri tanpa terus bergantung pada contekan dasar.`,
                `Menuntaskan minimal 12–15 praktik atau karya pada ${nodeTitle}: ${cleanTw[1] || b.output}`,
                `Mampu menemukan dan memperbaiki sendiri kesalahan umum pada ${nodeTitle}.`
              ],
              3: [
                `Mampu menerapkan konsep ${nodeTitle} di luar kepala pada berbagai situasi nyata secara konsisten.`,
                `Memiliki jam terbang ≥30 karya/sesi pada ${nodeTitle} yang memenuhi standar: ${tDetail.criteria || b.criteria}`,
                `Diandalkan menyelesaikan tantangan ${nodeTitle} secara mandiri dengan hasil yang stabil.`
              ],
              4: [
                `Menguasai ${nodeTitle} tingkat mahir: mampu memecahkan kasus rumit dan menghasilkan karya berstandar profesional.`,
                `Memiliki rekam jejak ≥60–100 capaian/jam terbang tinggi pada ${nodeTitle} lintas tahun.`,
                `Mampu membimbing dan mengoreksi praktik ${nodeTitle} orang lain hingga berhasil.`
              ],
              5: [
                `Mencapai penguasaan seumur hidup (Lifelong Master) pada ${nodeTitle} yang teruji ≥5–10 tahun dedikasi.`,
                `Melahirkan karya puncak atau sistem rujukan abadi pada ${nodeTitle} (${b.name}).`,
                `Menjadi mahaguru/mentor utama yang mencetak generasi praktisi unggul pada ${nodeTitle}.`
              ]
            };
            nodes.push({
              flatIdx,
              nodeCode: `B${bIdx + 1}·T${tIdx + 1}`,
              branchIdx: bIdx,
              branchName: b.name,
              tierIdx: tIdx,
              tierNumber: tIdx + 1,
              tierName: tierMeta.name,
              tierShort: tierMeta.shortName,
              title: nodeTitle,
              fullLabel: `${b.name} — ${nodeTitle} (${tierMeta.shortName})`,
              whatIs: tDetail.whatIs,
              howToUse: tDetail.howToUse,
              targetWorks: tDetail.targetWorks,
              levelIndicators,
              output: tDetail.targetWorks[0] || b.output,
              criteria: tDetail.criteria || b.criteria,
              reflection: b.reflection,
              crossPrereqs: crossList
            });
            capabilities.push(`${b.name}: ${nodeTitle} (${tierMeta.shortName})`);
          });
        });
        return Object.assign({}, cat, { nodes, capabilities, constellation });
      });

      /* =====================================================================
       * 2. UNIVERSAL MASTERY RUBRIC (0=Locked, NULL=Unassessed, 1..5 Scores)
       *    (Personal Skill Atlas Section I.2 & I.3, Pages 3–4)
       * ===================================================================== */
      const MASTERY_SCALE = [
        {
          level: null,
          label: 'Unassessed — "—"',
          shortLabel: 'Belum dinilai (—)',
          rpgTier: 'UNASSESSED · TERBUKA BELUM DINILAI',
          barPercent: 0,
          barColor: '#8B9B98',
          minEvidence: 'Node telah terbuka tetapi belum dinilai dengan bukti yang cukup.',
          anchor: 'Status terpisah (bukan skor 0 / tidak mampu). Node telah terbuka dan siap dinilai dengan bukti.'
        },
        {
          level: 1,
          label: 'Pemula (Beginner)',
          shortLabel: 'Lv. 1 · Pemula',
          rpgTier: 'LEVEL 1/5 · PEMULA / AWAL PERJALANAN (20%)',
          barPercent: 20,
          barColor: '#3898A6',
          minEvidence: 'Latihan awal dan pengenalan konsep dasar dengan panduan.',
          anchor: 'Tahap Pemula: memahami konsep dasar dan menyelesaikan latihan awal dengan panduan langkah demi langkah.'
        },
        {
          level: 2,
          label: 'Terampil Dasar (Practitioner)',
          shortLabel: 'Lv. 2 · Terampil Dasar',
          rpgTier: 'LEVEL 2/5 · TERAMPIL DASAR (40%)',
          barPercent: 40,
          barColor: '#2BB3A3',
          minEvidence: 'Belasan praktik mandiri yang mulai rapi dan terukur.',
          anchor: 'Tahap Terampil Dasar: lancar mempraktikkan teknik dasar secara mandiri dengan hasil yang mulai konsisten.'
        },
        {
          level: 3,
          label: 'Mandiri & Matang (Competent)',
          shortLabel: 'Lv. 3 · Mandiri',
          rpgTier: 'LEVEL 3/5 · MANDIRI DI LUAR KEPALA (60%)',
          barPercent: 60,
          barColor: '#2E9359',
          minEvidence: 'Puluhan jam terbang/karya nyata yang stabil lintas situasi.',
          anchor: 'Tahap Mandiri: mampu menerapkan konsep di luar kepala secara konsisten di dunia nyata (Syarat Maksimal Pembuka Gerbang Tier 2 · Advanced & Tier 3 · Sage).'
        },
        {
          level: 4,
          label: 'Mahir Profesional (Expert)',
          shortLabel: 'Lv. 4 · Mahir',
          rpgTier: 'LEVEL 4/5 · MAHIR / JAM TERBANG TINGGI (80%)',
          barPercent: 80,
          barColor: '#E08A28',
          minEvidence: 'Rekam jejak bertahun-tahun menangani tantangan kompleks & membimbing rekan.',
          anchor: 'Tahap Mahir: penguasaan mendalam lintas tahun untuk memecahkan persoalan rumit dan menjadi rujukan tim/komunitas.'
        },
        {
          level: 5,
          label: 'Master Seumur Hidup (Lifelong Master)',
          shortLabel: 'Lv. 5 · Master',
          rpgTier: 'LEVEL 5/5 · LIFELONG MASTER (100%)',
          barPercent: 100,
          barColor: '#DF5B1F',
          minEvidence: 'Dedikasi jangka panjang (bertahun-tahun/seumur hidup), warisan karya & kaderisasi.',
          anchor: 'Puncak Master Seumur Hidup: keahlian telah menyatu menjadi intuisi hidup selama bertahun-tahun, melahirkan warisan karya dan mencetak generasi baru.'
        }
      ];

const DEFAULT_QUOTES = [
        {
          id: 'q-01',
          text: '“Kemampuan nyata di atas angka; bukti di atas perasaan; perkembangan di atas kesempurnaan. Isi ransel lo hari ini adalah jejak nyata perjalanan belajar lo.”',
          attribution: 'Personal Skill Atlas · Prinsip Desain #01',
          sourceUrl: 'https://backpack.atlas/reflections/01',
          locale: 'id-ID',
          active: true,
          sortOrder: 1
        },
        {
          id: 'q-02',
          text: '“Tier adalah jenjang kompleksitas node (Basic → Advanced → Sage); skor 1–5 adalah tingkat penguasaan pada node itu. Keduanya saling melengkapi tanpa harus menunggu sempurna.”',
          attribution: 'Arsitektur Skill Tree · Refleksi #02',
          sourceUrl: 'https://backpack.atlas/reflections/02',
          locale: 'id-ID',
          active: true,
          sortOrder: 2
        },
        {
          id: 'q-03',
          text: '“Status ‘0 — Locked’ atau ‘Unassessed (—)’ itu bukan tanda tidak mampu. Itu cuma petunjuk prasyarat mana yang perlu lo perkuat lebih dulu.”',
          attribution: 'Gerbang Prasasti Batu · Refleksi #03',
          sourceUrl: 'https://backpack.atlas/reflections/03',
          locale: 'id-ID',
          active: true,
          sortOrder: 3
        },
        {
          id: 'q-04',
          text: '“Sage bukan berarti ‘selalu benar’ atau ‘tahu semuanya’, melainkan mampu memilih kapan kemampuan digunakan, mengenali batas diri, dan memberi kontribusi nyata.”',
          attribution: 'Definisi Sage yang Sehat · Refleksi #04',
          sourceUrl: 'https://backpack.atlas/reflections/04',
          locale: 'id-ID',
          active: true,
          sortOrder: 4
        }
      ];

export {
  CATEGORY_DESCRIPTIONS,
  TAB_HUMAN_DESCRIPTIONS,
  PASSIVE_SKILLS,
  RAW_SEED_CATEGORIES,
  TIER_META,
  DOMAIN_CONSTELLATIONS,
  TIER_DETAILS_CATALOG,
  LIFELONG_INDICATORS_132,
  SEED_CATEGORIES,
  MASTERY_SCALE,
  DEFAULT_QUOTES,
};
