
let isComputerMode = false; // Mode lawan komputer
const vsComputerBtn = document.getElementById('vs-computer-btn');


// SESUDAH (Tetap dipasang di sini):
const SUPABASE_URL = 'https://jmvirawieydobodmzjmr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WHi_gB94h-yd8WFHo0MnIg_0dYcOS-Y';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// Simbol Bidak (Tebal/Solid)
const PIECES = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟', 
    'R': '♜', 'N': '♞', 'B': '♝', 'Q': '♛', 'K': '♚', 'P': '♟'  
};

const initialBoard = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['',  '',  '',  '',  '',  '',  '',  ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let boardState = [];
let currentTurn = 'white'; 
let selectedSquare = null;
let validMoves = [];
let lastMove = null;
let hasMoved = {
    'K': false, 'R_k': false, 'R_q': false, // Putih: Raja, Benteng Sayap Raja, Benteng Sayap Ratu
    'k': false, 'r_k': false, 'r_q': false  // Hitam
};
let enPassantTarget = null; // Menyimpan koordinat petak yang bisa diserang via En Passant


// Data Room Online
let currentRoomId = null;
let playerColor = null; 

const boardElement = document.getElementById('board');
const turnElement = document.getElementById('turn');
const resetBtn = document.getElementById('reset-btn');

const roomIdInput = document.getElementById('room-id');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');

function showAlert(pesan) {
    document.getElementById('modalMessage').innerText = pesan;
    document.getElementById('customAlert').classList.add('show');
}

function closeAlert() {
    document.getElementById('customAlert').classList.remove('show');
}

function initGame() {
    boardState = JSON.parse(JSON.stringify(initialBoard));
    currentTurn = 'white';
    selectedSquare = null;
    validMoves = [];
    lastMove = null;

    // --- TAMBAHKAN DI SINI ---
    enPassantTarget = null; 

    hasMoved = {
        'K': false, 'R_k': false, 'R_q': false,
        'k': false, 'r_k': false, 'r_q': false
    };
    isComputerMode = false;
    currentRoomId = null;
    playerColor = null;
    turnElement.textContent = 'Putih';
    renderBoard();
}




function renderBoard() {
    boardElement.innerHTML = '';
    
    // Jika pemain adalah Hitam, balik urutan baris dan kolom
    const isBlackPlayer = playerColor === 'black';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Jika pemain Hitam: baris & kolom dihitung mundur dari 7 ke 0
            const r = isBlackPlayer ? 7 - i : i;
            const c = isBlackPlayer ? 7 - j : j;

            const square = document.createElement('div');
            const isLight = (r + c) % 2 === 0;
            
            square.classList.add('square', isLight ? 'light' : 'dark');
            square.dataset.row = r;
            square.dataset.col = c;

            const pieceCode = boardState[r][c];
            if (pieceCode) {
                square.textContent = PIECES[pieceCode];
                const colorClass = getPieceColor(pieceCode) === 'white' ? 'piece-white' : 'piece-black';
                square.classList.add(colorClass);
            }

            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                square.classList.add('selected');
            }

            // TAMBAHAN KODE BARU DI SINI
            if (lastMove && 
               ((lastMove.fromR === r && lastMove.fromC === c) || 
                (lastMove.toR === r && lastMove.toC === c))) {
                square.classList.add('last-move');
            }

            if (validMoves.some(m => m.r === r && m.c === c)) {
                square.classList.add('possible-move');
            }


            square.addEventListener('click', () => handleSquareClick(r, c));
            boardElement.appendChild(square);
        }
    }
}


function getPieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

async function handleSquareClick(r, c) {
    if (playerColor && currentTurn !== playerColor) {
        showAlert("Bukan giliranmu! Tunggu pemain lawan.");
        return;
    }

    const clickedPiece = boardState[r][c];
    const clickedPieceColor = getPieceColor(clickedPiece);

    if (selectedSquare) {
        if (selectedSquare.r === r && selectedSquare.c === c) {
            selectedSquare = null;
            validMoves = [];
            renderBoard();
            return;
        }

        if (clickedPieceColor === currentTurn) {
            selectedSquare = { r, c };
            validMoves = getSafeMoves(r, c, boardState);
            renderBoard();
            return;
        }

        const isMoveValid = validMoves.some(m => m.r === r && m.c === c);
        if (isMoveValid) {
            // 1. PINDAHKAN BIDAK KAMU DI MEMORI & TAMPILAN (SEKETIKA)
            makeMove(selectedSquare.r, selectedSquare.c, r, c, boardState);
            selectedSquare = null;
            validMoves = [];
            currentTurn = currentTurn === 'white' ? 'black' : 'white';
            
            // 2. RENDER PAPAN LANGSUNG (Pion kamu pindah instan!)
            updateTurnUI();

            // 3. BARU PROSES DI BACKGROUND (Supabase / Komputer)
            if (currentRoomId) {
                await supabaseClient.from('catur_rooms').update({
                    board_state: JSON.stringify(boardState),
                    current_turn: currentTurn
                }).eq('room_id', currentRoomId);
            } else if (isComputerMode && currentTurn === 'black') {
                // Beri jeda 50ms agar browser sempat menggambar pergerakan pemain dulu
                setTimeout(() => {
                    makeComputerMove();
                }, 50);
            }
        }
    } else {
        if (clickedPiece && clickedPieceColor === currentTurn) {
            selectedSquare = { r, c };
            validMoves = getSafeMoves(r, c, boardState);
            renderBoard();
        }
    }
}


function updateTurnUI() {
    let turnName = currentTurn === 'white' ? 'Putih' : 'Hitam';

    // Jika lawan komputer dan giliran Hitam, ganti teksnya jadi Komputer
    if (isComputerMode && currentTurn === 'black') {
        turnName = 'Komputer (Berpikir...)';
    }

    if (isCheckmate(currentTurn, boardState)) {
        const winner = currentTurn === 'white' ? 'Hitam' : 'Putih';
        turnElement.textContent = `SKAKMAT!`;
        showAlert(`Skakmat! Pemain ${winner} memenangkan permainan.`);
    } else if (isInCheck(currentTurn, boardState)) {
        const checkText = (isComputerMode && currentTurn === 'black') ? 'Komputer (SKAK!)' : `${turnName} (SKAK!)`;
        turnElement.textContent = checkText;
    } else {
        turnElement.textContent = turnName;
    }

    renderBoard();
}

function makeMove(fromR, fromC, toR, toC, board) {
    const piece = board[fromR][fromC];

    // 1. Eksekusi Pemakanan En Passant
    if (piece.toLowerCase() === 'p' && enPassantTarget && toR === enPassantTarget.r && toC === enPassantTarget.c) {
        const enemyPawnRow = piece === 'P' ? toR + 1 : toR - 1;
        board[enemyPawnRow][toC] = ''; // Hapus pion lawan yang dilewati
    }

    // 2. Pindahkan Bidak Utama
    board[toR][toC] = piece;
    board[fromR][fromC] = '';

    // 3. Set/Reset En Passant Target HANYA jika operasi dilakukan pada boardState utama
    if (board === boardState) {
        if (piece.toLowerCase() === 'p' && Math.abs(fromR - toR) === 2) {
            enPassantTarget = { r: (fromR + toR) / 2, c: fromC };
        } else {
            enPassantTarget = null;
        }
    }

    // 4. Logika Rokade
    if (piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
        if (toC === 6) { board[toR][5] = board[toR][7]; board[toR][7] = ''; }
        else if (toC === 2) { board[toR][3] = board[toR][0]; board[toR][0] = ''; }
    }

    // 5. Catat Pergerakan Raja / Benteng untuk Rokade (Hanya pada papan utama)
    if (board === boardState) {
        if (piece === 'K') hasMoved['K'] = true;
        if (piece === 'k') hasMoved['k'] = true;
        if (fromR === 7 && fromC === 7) hasMoved['R_k'] = true;
        if (fromR === 7 && fromC === 0) hasMoved['R_q'] = true;
        if (fromR === 0 && fromC === 7) hasMoved['r_k'] = true;
        if (fromR === 0 && fromC === 0) hasMoved['r_q'] = true;
        lastMove = { fromR, fromC, toR, toC };
    }
    
    // 6. Promosi Pion
    if (board[toR][toC] === 'P' && toR === 0) board[toR][toC] = 'Q';
    if (board[toR][toC] === 'p' && toR === 7) board[toR][toC] = 'q';
}



function getRawMoves(r, c, board) {
    const piece = board[r][c];
    const color = getPieceColor(piece);
    const moves = [];
    const type = piece.toLowerCase();

    const addMove = (targetR, targetC) => {
        if (targetR >= 0 && targetR < 8 && targetC >= 0 && targetC < 8) {
            const targetColor = getPieceColor(board[targetR][targetC]);
            if (targetColor !== color) {
                moves.push({ r: targetR, c: targetC });
                return targetColor === null;
            }
        }
        return false;
    };

    if (type === 'p') {
        const dir = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;

        if (board[r + dir] && board[r + dir][c] === '') {
            moves.push({ r: r + dir, c });
            if (r === startRow && board[r + 2 * dir][c] === '') {
                moves.push({ r: r + 2 * dir, c });
            }
        }
               [-1, 1].forEach(dc => {
            const targetR = r + dir;
            const targetC = c + dc;
            if (targetR >= 0 && targetR < 8 && targetC >= 0 && targetC < 8) {
                const targetColor = getPieceColor(board[targetR][targetC]);
                if (targetColor && targetColor !== color) {
                    moves.push({ r: targetR, c: targetC });
                }
                // LOGIKA EN PASSANT: Cek apakah target mendarat di koordinat enPassantTarget
                if (enPassantTarget && enPassantTarget.r === targetR && enPassantTarget.c === targetC) {
                    moves.push({ r: targetR, c: targetC, isEnPassant: true });
                }
            }
        });

    }

    if (type === 'n') {
        const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        offsets.forEach(([dr, dc]) => addMove(r + dr, c + dc));
    }

    if (type === 'r' || type === 'q') {
        const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
        dirs.forEach(([dr, dc]) => {
            let step = 1;
            while (addMove(r + dr * step, c + dc * step)) step++;
        });
    }

    if (type === 'b' || type === 'q') {
        const dirs = [[-1,-1], [-1,1], [1,-1], [1,1]];
        dirs.forEach(([dr, dc]) => {
            let step = 1;
            while (addMove(r + dr * step, c + dc * step)) step++;
        });
    }

        if (type === 'k') {
        const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        dirs.forEach(([dr, dc]) => addMove(r + dr, c + dc));

        // --- LOGIKA ROKADE ---
        if (color === 'white' && r === 7 && c === 4) {
            // Rokade Pendek (Sayap Raja)
            if (!hasMoved['K'] && !hasMoved['R_k'] && board[7][5] === '' && board[7][6] === '') {
                if (!isInCheck('white', board)) moves.push({ r: 7, c: 6, isCastling: 'short' });
            }
            // Rokade Panjang (Sayap Ratu)
            if (!hasMoved['K'] && !hasMoved['R_q'] && board[7][1] === '' && board[7][2] === '' && board[7][3] === '') {
                if (!isInCheck('white', board)) moves.push({ r: 7, c: 2, isCastling: 'long' });
            }
        } else if (color === 'black' && r === 0 && c === 4) {
            // Rokade Pendek (Sayap Raja)
            if (!hasMoved['k'] && !hasMoved['r_k'] && board[0][5] === '' && board[0][6] === '') {
                if (!isInCheck('black', board)) moves.push({ r: 0, c: 6, isCastling: 'short' });
            }
            // Rokade Panjang (Sayap Ratu)
            if (!hasMoved['k'] && !hasMoved['r_q'] && board[0][1] === '' && board[0][2] === '' && board[0][3] === '') {
                if (!isInCheck('black', board)) moves.push({ r: 0, c: 2, isCastling: 'long' });
            }
        }
    }


    return moves;
}

function getSafeMoves(r, c, board) {
    const rawMoves = getRawMoves(r, c, board);
    const color = getPieceColor(board[r][c]);

    return rawMoves.filter(move => {
        const tempBoard = JSON.parse(JSON.stringify(board));
        makeMove(r, c, move.r, move.c, tempBoard);
        return !isInCheck(color, tempBoard);
    });
}

function isInCheck(color, board) {
    let kingPos = null;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.toLowerCase() === 'k' && getPieceColor(piece) === color) {
                kingPos = { r, c };
                break;
            }
        }
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) !== color) {
                const enemyMoves = getRawMoves(r, c, board);
                if (kingPos && enemyMoves.some(m => m.r === kingPos.r && m.c === kingPos.c)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isCheckmate(color, board) {
    if (!isInCheck(color, board)) return false;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (getPieceColor(board[r][c]) === color) {
                const safeMoves = getSafeMoves(r, c, board);
                if (safeMoves.length > 0) return false;
            }
        }
    }
    return true;
}

// Fungsi untuk generate ID Room acak (contoh: ROOM-A8F3)
function generateRandomRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomStr = '';
    for (let i = 0; i < 4; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ROOM-${randomStr}`;
}

// Fitur Buat Room dengan Kode Acak Otomatis
createRoomBtn.addEventListener('click', async () => {
    isComputerMode = false; // <-- Pastikan AI mati saat buat room
    const roomId = generateRandomRoomId();
    
    // Tampilkan kode room yang baru dibuat ke dalam kotak input
    roomIdInput.value = roomId;

    currentRoomId = roomId;
    playerColor = 'white'; // Pembuat room otomatis Putih

    const { error } = await supabaseClient.from('catur_rooms').upsert([{
        room_id: roomId,
        board_state: JSON.stringify(initialBoard),
        current_turn: 'white',
        status: 'waiting'
    }]);

   if (!error) {
    showAlert(`Room "${roomId}" dibuat!`);
    listenToRoom(roomId);
    } else {
        showAlert("Gagal membuat room!");
    }
});

joinRoomBtn.addEventListener('click', async () => {
    const roomId = roomIdInput.value.trim();
    if (!roomId) {
        showAlert("Masukkan ID Room terlebih dahulu!");
        return;
    }

    const { data, error } = await supabaseClient.from('catur_rooms')
        .select('*')
        .eq('room_id', roomId)
        .single();

    if (data) {
        currentRoomId = roomId;
        playerColor = 'black'; 
        isComputerMode = false; // <-- TAMBAHKAN BARIS INI UNTUK MATIKAN MODE AI
        
        showAlert(`Berhasil masuk ke Room "${roomId}"! Kamu bermain sebagai HITAM.`);
        listenToRoom(roomId);
    } else {
        showAlert("Room tidak ditemukan! Cek kembali ID Room.");
    }
});

// Realtime Listener menggunakan Channel Supabase
function listenToRoom(roomId) {
    supabaseClient
        .channel(`room:${roomId}`)
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'catur_rooms',
            filter: `room_id=eq.${roomId}`
        }, payload => {
            const data = payload.new;
            boardState = typeof data.board_state === 'string' ? JSON.parse(data.board_state) : data.board_state;
            currentTurn = data.current_turn;
            updateTurnUI();
        })
        .subscribe();
}

// Tambahkan library Supabase di catur.html jika belum ada
resetBtn.addEventListener('click', initGame);
initGame();


  // Listener Tombol Lawan Komputer
vsComputerBtn.addEventListener('click', () => {
    initGame();
    isComputerMode = true;
    playerColor = 'white'; // Pemain Putih, Komputer Hitam
    showAlert("Mode Lawan Komputer Aktif! Kamu bermain sebagai PUTIH.");
});

// =================================================================
// === INTEGRASI WEB WORKER AI (UTAMA) ===
// =================================================================

// Inisialisasi Worker
let aiWorker = null;
if (window.Worker) {
    aiWorker = new Worker('ai-worker.js');

    // Menerima hasil kalkulasi dari Worker
    aiWorker.onmessage = function(e) {
        const bestMove = e.data;
        if (bestMove) {
            makeMove(bestMove.fromR, bestMove.fromC, bestMove.toR, bestMove.toC, boardState);
            currentTurn = 'white';
            updateTurnUI();
        }
    };
}

function makeComputerMove() {
    if (!isComputerMode || currentTurn !== 'black') return;

    // Kirim state papan ke Worker untuk dihitung di background
    if (aiWorker) {
        aiWorker.postMessage({ boardState: boardState });
    }
}
