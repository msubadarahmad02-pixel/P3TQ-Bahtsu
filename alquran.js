// ==========================================
// DATA 114 SURAH AL-QUR'AN
// ==========================================
const DATA_SURAH = [
    { no: 1, nama: "Al-Fatihah", ayat: "7 Ayat", arab: "الفاتحة", hal: 1 },
    { no: 2, nama: "Al-Baqarah", ayat: "286 Ayat", arab: "البقرة", hal: 2 },
    { no: 3, nama: "Ali 'Imran", ayat: "200 Ayat", arab: "آل عمران", hal: 50 },
    { no: 4, nama: "An-Nisa'", ayat: "176 Ayat", arab: "النساء", hal: 77 },
    { no: 5, nama: "Al-Ma'idah", ayat: "120 Ayat", arab: "المائدة", hal: 106 },
    { no: 6, nama: "Al-An'am", ayat: "165 Ayat", arab: "الأنعام", hal: 128 },
    { no: 7, nama: "Al-A'raf", ayat: "206 Ayat", arab: "الأعراف", hal: 151 },
    { no: 8, nama: "Al-Anfal", ayat: "75 Ayat", arab: "الأنفال", hal: 177 },
    { no: 9, nama: "At-Taubah", ayat: "129 Ayat", arab: "التوبة", hal: 187 },
    { no: 10, nama: "Yunus", ayat: "109 Ayat", arab: "يونس", hal: 208 },
    { no: 11, nama: "Hud", ayat: "123 Ayat", arab: "هود", hal: 221 },
    { no: 12, nama: "Yusuf", ayat: "111 Ayat", arab: "يوسف", hal: 235 },
    { no: 13, nama: "Ar-Ra'd", ayat: "43 Ayat", arab: "الرعد", hal: 249 },
    { no: 14, nama: "Ibrahim", ayat: "52 Ayat", arab: "إبراهيم", hal: 255 },
    { no: 15, nama: "Al-Hijr", ayat: "99 Ayat", arab: "الحجر", hal: 262 },
    { no: 16, nama: "An-Nahl", ayat: "128 Ayat", arab: "النحل", hal: 267 },
    { no: 17, nama: "Al-Isra'", ayat: "111 Ayat", arab: "الإسراء", hal: 282 },
    { no: 18, nama: "Al-Kahf", ayat: "110 Ayat", arab: "الكهف", hal: 293 },
    { no: 19, nama: "Maryam", ayat: "98 Ayat", arab: "مريم", hal: 305 },
    { no: 20, nama: "Taha", ayat: "135 Ayat", arab: "طه", hal: 312 },
    { no: 21, nama: "Al-Anbiya'", ayat: "112 Ayat", arab: "الأنبياء", hal: 322 },
    { no: 22, nama: "Al-Hajj", ayat: "78 Ayat", arab: "الحج", hal: 332 },
    { no: 23, nama: "Al-Mu'minun", ayat: "118 Ayat", arab: "المؤمنون", hal: 342 },
    { no: 24, nama: "An-Nur", ayat: "64 Ayat", arab: "النور", hal: 350 },
    { no: 25, nama: "Al-Furqan", ayat: "77 Ayat", arab: "الفرقان", hal: 359 },
    { no: 26, nama: "Asy-Syu'ara'", ayat: "227 Ayat", arab: "الشعراء", hal: 367 },
    { no: 27, nama: "An-Naml", ayat: "93 Ayat", arab: "النمل", hal: 377 },
    { no: 28, nama: "Al-Qasas", ayat: "88 Ayat", arab: "القصص", hal: 385 },
    { no: 29, nama: "Al-'Ankabut", ayat: "69 Ayat", arab: "العنكبوت", hal: 396 },
    { no: 30, nama: "Ar-Rum", ayat: "60 Ayat", arab: "الروم", hal: 404 },
    { no: 31, nama: "Luqman", ayat: "34 Ayat", arab: "لقمان", hal: 411 },
    { no: 32, nama: "As-Sajdah", ayat: "30 Ayat", arab: "السجدة", hal: 415 },
    { no: 33, nama: "Al-Ahzab", ayat: "73 Ayat", arab: "الأحزاب", hal: 418 },
    { no: 34, nama: "Saba'", ayat: "54 Ayat", arab: "سبإ", hal: 428 },
    { no: 35, nama: "Fatir", ayat: "45 Ayat", arab: "فاطر", hal: 434 },
    { no: 36, nama: "Ya-Sin", ayat: "83 Ayat", arab: "يس", hal: 440 },
    { no: 37, nama: "As-Saffat", ayat: "182 Ayat", arab: "الصافات", hal: 446 },
    { no: 38, nama: "Sad", ayat: "88 Ayat", arab: "ص", hal: 453 },
    { no: 39, nama: "Az-Zumar", ayat: "75 Ayat", arab: "الزمر", hal: 458 },
    { no: 40, nama: "Ghafir", ayat: "85 Ayat", arab: "غافر", hal: 467 },
    { no: 41, nama: "Fussilat", ayat: "54 Ayat", arab: "فصلت", hal: 477 },
    { no: 42, nama: "Asy-Syura", ayat: "53 Ayat", arab: "الشورى", hal: 483 },
    { no: 43, nama: "Az-Zukhruf", ayat: "89 Ayat", arab: "الزخرف", hal: 489 },
    { no: 44, nama: "Ad-Dukhan", ayat: "59 Ayat", arab: "الدخان", hal: 496 },
    { no: 45, nama: "Al-Jasiyah", ayat: "37 Ayat", arab: "الجاثية", hal: 499 },
    { no: 46, nama: "Al-Ahqaf", ayat: "35 Ayat", arab: "الأحقاف", hal: 502 },
    { no: 47, nama: "Muhammad", ayat: "38 Ayat", arab: "محمد", hal: 507 },
    { no: 48, nama: "Al-Fath", ayat: "29 Ayat", arab: "الفتح", hal: 511 },
    { no: 49, nama: "Al-Hujurat", ayat: "18 Ayat", arab: "الحجرات", hal: 515 },
    { no: 50, nama: "Qaf", ayat: "45 Ayat", arab: "ق", hal: 518 },
    { no: 51, nama: "Az-Zariyat", ayat: "60 Ayat", arab: "الذاريات", hal: 520 },
    { no: 52, nama: "At-Tur", ayat: "49 Ayat", arab: "الطور", hal: 523 },
    { no: 53, nama: "An-Najm", ayat: "62 Ayat", arab: "النجم", hal: 526 },
    { no: 54, nama: "Al-Qamar", ayat: "55 Ayat", arab: "القمر", hal: 528 },
    { no: 55, nama: "Ar-Rahman", ayat: "78 Ayat", arab: "الرحمن", hal: 531 },
    { no: 56, nama: "Al-Waqi'ah", ayat: "96 Ayat", arab: "الواقعة", hal: 534 },
    { no: 57, nama: "Al-Hadid", ayat: "29 Ayat", arab: "الحديد", hal: 537 },
    { no: 58, nama: "Al-Mujadilah", ayat: "22 Ayat", arab: "المجادلة", hal: 542 },
    { no: 59, nama: "Al-Hasyr", ayat: "24 Ayat", arab: "الحشر", hal: 545 },
    { no: 60, nama: "Al-Mumtahanah", ayat: "13 Ayat", arab: "الممتحنة", hal: 549 },
    { no: 61, nama: "As-Saff", ayat: "14 Ayat", arab: "الصف", hal: 551 },
    { no: 62, nama: "Al-Jumu'ah", ayat: "11 Ayat", arab: "الجمعة", hal: 553 },
    { no: 63, nama: "Al-Munafiqun", ayat: "11 Ayat", arab: "المنافقون", hal: 554 },
    { no: 64, nama: "At-Taghabun", ayat: "18 Ayat", arab: "التغابن", hal: 556 },
    { no: 65, nama: "At-Talaq", ayat: "12 Ayat", arab: "الطلاق", hal: 558 },
    { no: 66, nama: "At-Tahrim", ayat: "12 Ayat", arab: "التحريم", hal: 560 },
    { no: 67, nama: "Al-Mulk", ayat: "30 Ayat", arab: "الملك", hal: 562 },
    { no: 68, nama: "Al-Qalam", ayat: "52 Ayat", arab: "القلم", hal: 564 },
    { no: 69, nama: "Al-Haqqah", ayat: "52 Ayat", arab: "الحاقة", hal: 566 },
    { no: 70, nama: "Al-Ma'arij", ayat: "44 Ayat", arab: "المعارج", hal: 568 },
    { no: 71, nama: "Nuh", ayat: "28 Ayat", arab: "نوح", hal: 570 },
    { no: 72, nama: "Al-Jinn", ayat: "28 Ayat", arab: "الجن", hal: 572 },
    { no: 73, nama: "Al-Muzzammil", ayat: "20 Ayat", arab: "المزمل", hal: 574 },
    { no: 74, nama: "Al-Muddassir", ayat: "56 Ayat", arab: "المدثر", hal: 575 },
    { no: 75, nama: "Al-Qiyamah", ayat: "40 Ayat", arab: "القيامة", hal: 577 },
    { no: 76, nama: "Al-Insan", ayat: "31 Ayat", arab: "الإنسان", hal: 578 },
    { no: 77, nama: "Al-Mursalat", ayat: "50 Ayat", arab: "المرسلات", hal: 580 },
    { no: 78, nama: "An-Naba'", ayat: "40 Ayat", arab: "النبأ", hal: 582 },
    { no: 79, nama: "An-Nazi'at", ayat: "46 Ayat", arab: "النازعات", hal: 583 },
    { no: 80, nama: "'Abasa", ayat: "42 Ayat", arab: "عبس", hal: 585 },
    { no: 81, nama: "At-Takwir", ayat: "29 Ayat", arab: "التكوير", hal: 586 },
    { no: 82, nama: "Al-Infitar", ayat: "19 Ayat", arab: "الإنفطار", hal: 587 },
    { no: 83, nama: "Al-Mutaffifin", ayat: "36 Ayat", arab: "المطففين", hal: 587 },
    { no: 84, nama: "Al-Insyiqaq", ayat: "25 Ayat", arab: "الإنشقاق", hal: 589 },
    { no: 85, nama: "Al-Buruj", ayat: "22 Ayat", arab: "البروج", hal: 590 },
    { no: 86, nama: "At-Tariq", ayat: "17 Ayat", arab: "الطارق", hal: 591 },
    { no: 87, nama: "Al-A'la", ayat: "19 Ayat", arab: "الأعلى", hal: 591 },
    { no: 88, nama: "Al-Ghasyiyah", ayat: "26 Ayat", arab: "الغاشية", hal: 592 },
    { no: 89, nama: "Al-Fajr", ayat: "30 Ayat", arab: "الفجر", hal: 593 },
    { no: 90, nama: "Al-Balad", ayat: "20 Ayat", arab: "البلد", hal: 594 },
    { no: 91, nama: "Asy-Syams", ayat: "15 Ayat", arab: "الشمس", hal: 595 },
    { no: 92, nama: "Al-Lail", ayat: "21 Ayat", arab: "الليل", hal: 595 },
    { no: 93, nama: "Ad-Duha", ayat: "11 Ayat", arab: "الضحى", hal: 596 },
    { no: 94, nama: "Asy-Syarh", ayat: "8 Ayat", arab: "الشرح", hal: 596 },
    { no: 95, nama: "At-Tin", ayat: "8 Ayat", arab: "التين", hal: 597 },
    { no: 96, nama: "Al-'Alaq", ayat: "19 Ayat", arab: "العلق", hal: 597 },
    { no: 97, nama: "Al-Qadr", ayat: "5 Ayat", arab: "القدر", hal: 598 },
    { no: 98, nama: "Al-Bayyinah", ayat: "8 Ayat", arab: "البينة", hal: 598 },
    { no: 99, nama: "Az-Zalzalah", ayat: "8 Ayat", arab: "الزلزلة", hal: 599 },
    { no: 100, nama: "Al-'Adiyat", ayat: "11 Ayat", arab: "العاديات", hal: 599 },
    { no: 101, nama: "Al-Qari'ah", ayat: "11 Ayat", arab: "القارعة", hal: 600 },
    { no: 102, nama: "At-Takasur", ayat: "8 Ayat", arab: "التكاثر", hal: 600 },
    { no: 103, nama: "Al-'Asr", ayat: "3 Ayat", arab: "العصر", hal: 601 },
    { no: 104, nama: "Al-Humazah", ayat: "9 Ayat", arab: "الهمزة", hal: 601 },
    { no: 105, nama: "Al-Fil", ayat: "5 Ayat", arab: "الفيل", hal: 601 },
    { no: 106, nama: "Quraisy", ayat: "4 Ayat", arab: "قريش", hal: 602 },
    { no: 107, nama: "Al-Ma'un", ayat: "7 Ayat", arab: "الماعون", hal: 602 },
    { no: 108, nama: "Al-Kausar", ayat: "3 Ayat", arab: "الكوثر", hal: 602 },
    { no: 109, nama: "Al-Kafirun", ayat: "6 Ayat", arab: "الكافرون", hal: 603 },
    { no: 110, nama: "An-Nasr", ayat: "3 Ayat", arab: "النصر", hal: 603 },
    { no: 111, nama: "Al-Lahab", ayat: "5 Ayat", arab: "المسد", hal: 603 },
    { no: 112, nama: "Al-Ikhlas", ayat: "4 Ayat", arab: "الإخلاص", hal: 604 },
    { no: 113, nama: "Al-Falaq", ayat: "5 Ayat", arab: "الفلق", hal: 604 },
    { no: 114, nama: "An-Nas", ayat: "6 Ayat", arab: "الناس", hal: 604 }
];

// ==========================================
// DATA 30 JUZ AL-QUR'AN
// ==========================================
const DATA_JUZ = [
    { no: 1, nama: "Juz 1", sub: "Alif Lam Meem", arab: "الحمد لله", hal: 1 },
    { no: 2, nama: "Juz 2", sub: "Sayaqool", arab: "سَيَقُولُ", hal: 22 },
    { no: 3, nama: "Juz 3", sub: "Tilkar Rusul", arab: "تِلْكَ الرُّسُلُ", hal: 42 },
    { no: 4, nama: "Juz 4", sub: "Lan Tanaloo", arab: "لَنْ تَنَالُوا", hal: 62 },
    { no: 5, nama: "Juz 5", sub: "Wal Muhsanat", arab: "وَالْمُحْصَنَاتُ", hal: 82 },
    { no: 6, nama: "Juz 6", sub: "La Yuhibbullah", arab: "لا يُحِبُّ اللَّهُ", hal: 102 },
    { no: 7, nama: "Juz 7", sub: "Wa Iz Sami'u", arab: "وَإِذَا سَمِعُوا", hal: 122 },
    { no: 8, nama: "Juz 8", sub: "Wa Lau Annana", arab: "وَلَوْ أَنَّنَا", hal: 142 },
    { no: 9, nama: "Juz 9", sub: "Qalal Mala'u", arab: "قَالَ الْمَلأُ", hal: 162 },
    { no: 10, nama: "Juz 10", sub: "Wa'lamu", arab: "وَاعْلَمُوا", hal: 182 },
    { no: 11, nama: "Juz 11", sub: "Yatazerona", arab: "يَعْتَذِرُونَ", hal: 202 },
    { no: 12, nama: "Juz 12", sub: "Wa Mamin Da'abbat", arab: "وَمَا مِنْ دَابَّةٍ", hal: 222 },
    { no: 13, nama: "Juz 13", sub: "Wa Ma Ubarri'u", arab: "وَمَا أُبَرِّئُ", hal: 242 },
    { no: 14, nama: "Juz 14", sub: "Rubama", arab: "الر", hal: 262 },
    { no: 15, nama: "Juz 15", sub: "Subhanallazi", arab: "سُبْحَانَ الَّذِي", hal: 282 },
    { no: 16, nama: "Juz 16", sub: "Qala Alam", arab: "قَالَ أَلَمْ", hal: 302 },
    { no: 17, nama: "Juz 17", sub: "Iqtaraba Linnas", arab: "اقْتَرَبَ لِلنَّاسِ", hal: 322 },
    { no: 18, nama: "Juz 18", sub: "Qad Aflaha", arab: "قَدْ أَفْلَحَ", hal: 342 },
    { no: 19, nama: "Juz 19", sub: "Wa Qalallazina", arab: "وَقَالَ الَّذِينَ", hal: 362 },
    { no: 20, nama: "Juz 20", sub: "Aman Khalaq", arab: "فَمَا كَانَ ", hal: 382 },
    { no: 21, nama: "Juz 21", sub: "Utlu Ma Ohiya", arab: " وَلَا تُجَادِلُوْا ", hal: 402 },
    { no: 22, nama: "Juz 22", sub: "Wa Man Yaqnut", arab: "وَمَنْ يَقْنُتْ", hal: 422 },
    { no: 23, nama: "Juz 23", sub: "Wa Maliya", arab: "وَمَا أَنْزَلْنَا", hal: 442 },
    { no: 24, nama: "Juz 24", sub: "Faman Azlamu", arab: "فَمَنْ أَظْلَمُ", hal: 462 },
    { no: 25, nama: "Juz 25", sub: "Ilaihi Yuraddu", arab: "إِلَيْهِ يُرَدُّ", hal: 482 },
    { no: 26, nama: "Juz 26", sub: "Ha'a Meem", arab: "وَبَدَا لَهُمْ", hal: 502 },
    { no: 27, nama: "Juz 27", sub: "Qala Fama Khatbukum", arab: "قَالَ فَمَا خَطْبُكُمْ", hal: 522 },
    { no: 28, nama: "Juz 28", sub: "Qad Sami'allah", arab: "قَدْ سَمِعَ اللَّهُ", hal: 542 },
    { no: 29, nama: "Juz 29", sub: "Tabarakallazi", arab: "تَبَارَكَ الَّذِي", hal: 562 },
    { no: 30, nama: "Juz 30", sub: "Amma Yatasa'aloon", arab: "عَمَّ يَتَسَاءَلُونَ", hal: 582 }
];


// ==========================================
// INISIALISASI & LOGIKA APLIKASI
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    renderSurah(DATA_SURAH);
    renderJuz(DATA_JUZ);

    document.getElementById("btnBackHome")?.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});

// Render List Surah
function renderSurah(list) {
    const container = document.getElementById("surahList");
    if (!container) return;
    
    container.innerHTML = list.map(s => `
        <div class="item-card" onclick="bukaHalaman(${s.hal})">
            <div class="item-left">
                <div class="heart-badge">
                    <span class="heart-number">${s.no}</span>
                </div>
                <div>
                    <div class="item-title">${s.nama}</div>
                    <div class="item-sub">${s.ayat}</div>
                </div>
            </div>
            <div class="arabic-title">${s.arab}</div>
        </div>
    `).join("");
}

// Render List Juz (Menampilkan Nama Surah pada Halaman & Nomor Halaman)
function renderJuz(list) {
    const container = document.getElementById("juzList");
    if (!container) return;

    container.innerHTML = list.map(j => {
        // Otomatis mencari nama Surah berdasarkan nomor halaman awal Juz tersebut
        const surahTerkait = DATA_SURAH.slice().reverse().find(s => s.hal <= j.hal) || DATA_SURAH[0];

        return `
            <div class="item-card" onclick="bukaHalaman(${j.hal})">
                <div class="item-left">
                    <div class="heart-badge">
                        <span class="heart-number">${j.no}</span>
                    </div>
                    <div>
                        <div class="item-title">${j.nama}</div>
                        <!-- Menampilkan Nama Surah dan Nomor Halaman -->
                        <div class="item-sub"> ${surahTerkait.nama} (Hal. ${j.hal})</div>
                    </div>
                </div>
                <div class="arabic-title">${j.arab}</div>
            </div>
        `;
    }).join("");
}

// ==========================================
// RENDER TAB TANDAI DENGAN CATATAN TEKS & TOMBOL HAPUS
// ==========================================

function renderTandai() {
    const container = document.getElementById("tandaiList");
    if (!container) return;

    // Ambil data bookmark & data catatan dari localStorage
    const pageBookmarks = JSON.parse(localStorage.getItem('quran_page_bookmarks') || '[]');
    const pageNotes = JSON.parse(localStorage.getItem('quran_page_notes') || '{}');

    // Jika KOSONG (belum ada bookmark)
    if (pageBookmarks.length === 0) {
        container.innerHTML = `<div style="text-align: center; padding: 40px 16px; color: #9ca3af; font-size: 0.9rem;">Belum ada halaman yang ditandai.</div>`;
        return;
    }

    container.innerHTML = pageBookmarks.map((halNum, index) => {
        // 1. Otomatis cari nama Surah berdasarkan nomor halaman
        const surahTerkait = DATA_SURAH.slice().reverse().find(s => s.hal <= halNum) || DATA_SURAH[0];
        
        // 2. Otomatis cari nomor Juz berdasarkan nomor halaman
        const juzTerkait = DATA_JUZ.slice().reverse().find(j => j.hal <= halNum) || DATA_JUZ[0];

        const catatanSaatIni = pageNotes[halNum] || '';

        return `
        <div class="item-card item-card-note" onclick="bukaHalaman(${halNum})">
            <div class="item-left">
                <div class="heart-badge">
                    <span class="heart-number">${index + 1}</span>
                </div>
                <div>
                    <div class="item-title">Surah ${surahTerkait.nama}</div>
                    <!-- Keterangan Halaman dan Juz yang Ringkas -->
                    <div class="item-sub">Hal. ${halNum} (Juz ${juzTerkait.no})</div>
                </div>
            </div>
            
            <!-- Kotak Teks Catatan & Tombol Hapus -->
            <div class="note-input-wrapper" onclick="event.stopPropagation()">
                <input 
                    type="text" 
                    class="bookmark-note-input" 
                    placeholder="Tambah catatan..." 
                    value="${catatanSaatIni}"
                    oninput="simpanCatatanBookmark(${halNum}, this.value)"
                />
                <button class="btn-delete-bookmark" onclick="hapusBookmark(${halNum})" title="Hapus Tandai & Catatan">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
        `;
    }).join("");
}


// Fungsi Simpan Catatan Otomatis ke LocalStorage
function simpanCatatanBookmark(halNum, teksCatatan) {
    let pageNotes = JSON.parse(localStorage.getItem('quran_page_notes') || '{}');
    pageNotes[halNum] = teksCatatan;
    localStorage.setItem('quran_page_notes', JSON.stringify(pageNotes));
}

// Fungsi Hapus Bookmark dan Catatan Sekaligus
function hapusBookmark(halNum) {
    // 1. Hapus dari daftar halaman yang ditandai (quran_page_bookmarks)
    let pageBookmarks = JSON.parse(localStorage.getItem('quran_page_bookmarks') || '[]');
    pageBookmarks = pageBookmarks.filter(h => h !== halNum);
    localStorage.setItem('quran_page_bookmarks', JSON.stringify(pageBookmarks));

    // 2. Hapus juga catatan teksnya dari (quran_page_notes) agar tidak bersisa saat ditandai lagi
    let pageNotes = JSON.parse(localStorage.getItem('quran_page_notes') || '{}');
    delete pageNotes[halNum];
    localStorage.setItem('quran_page_notes', JSON.stringify(pageNotes));

    // 3. Render ulang tampilan tab tandai
    renderTandai();
}


// Perpindahan Tab (Surah / Juz / Tandai)
function switchTab(type) {
    const isSurah = type === 'surah';
    const isJuz = type === 'juz';
    const isTandai = type === 'tandai';

    document.getElementById("tabSurah").classList.toggle("active", isSurah);
    document.getElementById("tabJuz").classList.toggle("active", isJuz);
    document.getElementById("tabTandai").classList.toggle("active", isTandai);
    
    document.getElementById("surahList").style.display = isSurah ? 'block' : 'none';
    document.getElementById("juzList").style.display = isJuz ? 'block' : 'none';
    document.getElementById("tandaiList").style.display = isTandai ? 'block' : 'none';

    // Sembunyikan pencarian jika berada di Tab Tandai
    document.getElementById("searchWrapper").style.display = isTandai ? 'none' : 'block';

    if (isTandai) {
        renderTandai();
    }
}

// Fitur Filter Pencarian Surah / Juz
function filterList() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active')?.id;

    if (activeTab === 'tabSurah') {
        const filtered = DATA_SURAH.filter(s => 
            s.nama.toLowerCase().includes(input) || s.no.toString().includes(input)
        );
        renderSurah(filtered);
    } else if (activeTab === 'tabJuz') {
        const filtered = DATA_JUZ.filter(j => 
            j.nama.toLowerCase().includes(input) || j.no.toString().includes(input)
        );
        renderJuz(filtered);
    }
}

// Buka Viewer Baca Quran berdasarkan nomor Halaman
function bukaHalaman(nomorHalaman) {
    window.location.href = `baca_quran.html?hal=${nomorHalaman}`;
}
