let isComputerMode = false;
let isLocked = false;
const vsComputerBtn = document.getElementById('vs-computer-btn');

// KONEKSI SUPABASE
const SUPABASE_URL = 'https://jmvirawieydobodmzjmr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WHi_gB94h-yd8WFHo0MnIg_0dYcOS-Y';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ID Unik Sesi Pemain (Mencegah Pemain ke-3/Penyusup)
let playerId = localStorage.getItem('chess_player_id');
if (!playerId) {
    playerId = 'player_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('chess_player_id', playerId);
}

// Simbol Bidak (Menggunakan Aset Gambar SVG Vektor Chess.com)
const PIECES = {
    'P': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wp.png',
    'R': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wr.png',
    'N': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wn.png',
    'B': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wb.png',
    'Q': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wq.png',
    'K': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/wk.png',
    'p': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bp.png',
    'r': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/br.png',
    'n': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bn.png',
    'b': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bb.png',
    'q': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bq.png',
    'k': 'https://images.chesscomfiles.com/chess-themes/pieces/neo/150/bk.png'
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
let gameStatus = 'playing'; // 'playing', 'checkmate', 'stalemate'
let hasMoved = {
    'K': false, 'R_k': false, 'R_q': false,
    'k': false, 'r_k': false, 'r_q': false
};
let enPassantTarget = null; 

// Data Room Online
let currentRoomId = null;
let playerColor = null; 
let activeChannel = null;

const boardElement = document.getElementById('board');
const turnElement = document.getElementById('turn');
const resetBtn = document.getElementById('reset-btn');

const roomIdInput = document.getElementById('room-id');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const copyButton = document.getElementById('copyButton');

function cloneBoard(board) {
    return board.map(row => row.slice());
}

function showAlert(pesan) {
    const modalMsg = document.getElementById('modalMessage');
    const customAlert = document.getElementById('customAlert');
    if (modalMsg) modalMsg.innerText = pesan;
    if (customAlert) customAlert.classList.add('show');
}

window.closeAlert = function() {
    const customAlert = document.getElementById('customAlert');
    if (customAlert) customAlert.classList.remove('show');
};

// Tambahkan parameter isVsComp (default = false)
function initGame(keepRoom = false, isVsComp = false) {
    boardState = cloneBoard(initialBoard);
    currentTurn = 'white';
    selectedSquare = null;
    validMoves = [];
    lastMove = null;
    enPassantTarget = null; 
    gameStatus = 'playing';

    hasMoved = {
        'K': false, 'R_k': false, 'R_q': false,
        'k': false, 'r_k': false, 'r_q': false
    };

    // Set nilai isComputerMode sesuai parameter yang dikirim
    isComputerMode = isVsComp;

    if (!keepRoom) {
        if (activeChannel) {
            supabaseClient.removeChannel(activeChannel);
            activeChannel = null;
        }
        currentRoomId = null;
        playerColor = null;
        localStorage.removeItem('active_room_id');
        localStorage.removeItem('active_player_color');
        if (roomIdInput) roomIdInput.value = '';
    }

    if (turnElement) turnElement.textContent = 'Putih';
    renderBoard();
}


function renderBoard() {
    if (!boardElement) return;
    boardElement.innerHTML = '';
    
    // Pengecekan Aman: Gunakan initialBoard sebagai fallback jika boardState belum siap
    const currentBoard = (boardState && boardState.length === 8) ? boardState : initialBoard;
    const isBlackPlayer = playerColor === 'black';

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // Jika pemain mendapat warna Hitam, balik papan agar perspektif dari bawah
            const r = isBlackPlayer ? 7 - i : i;
            const c = isBlackPlayer ? 7 - j : j;

            const square = document.createElement('div');
            const isLight = (r + c) % 2 === 0;
            
            square.classList.add('square', isLight ? 'light' : 'dark');
            square.dataset.row = r;
            square.dataset.col = c;

            // --- EVENT DRAG & DROP: PETAK TUJUAN (DROP) ---
            square.addEventListener('dragover', (e) => {
                e.preventDefault(); // Wajib agar petak bisa menjadi area drop
            });

            square.addEventListener('drop', (e) => {
                e.preventDefault();
                try {
                    const rawData = e.dataTransfer.getData('text/plain');
                    if (!rawData) return;

                    const { fromR, fromC } = JSON.parse(rawData);

                    if (!isNaN(fromR) && !isNaN(fromC) && (fromR !== r || fromC !== c)) {
                        selectedSquare = { r: fromR, c: fromC };
                        validMoves = getSafeMoves(fromR, fromC, currentBoard);
                        
                        const isMoveValid = validMoves.some(m => m.r === r && m.c === c);
                        if (isMoveValid) {
                            handleSquareClick(r, c);
                        } else {
                            selectedSquare = null;
                            validMoves = [];
                            renderBoard();
                        }
                    }
                } catch (err) {
                    console.error("Gagal memproses drop:", err);
                }
            });

            // --- ISI BIDAK & EVENT DRAG (DRAGSTART) ---
const pieceCode = currentBoard[r] ? currentBoard[r][c] : '';
if (pieceCode) {
    const pieceImg = document.createElement('img');
    pieceImg.src = PIECES[pieceCode];
    pieceImg.classList.add('piece-img');
    square.appendChild(pieceImg);

    const pieceColor = getPieceColor(pieceCode);

    // Buat bidak bisa di-drag jika sesuai giliran & warna pemain
    if (pieceColor === currentTurn && (!playerColor || pieceColor === playerColor)) {
        square.setAttribute('draggable', 'true');

        square.addEventListener('dragstart', (e) => {
            selectedSquare = { r, c };
            validMoves = getSafeMoves(r, c, currentBoard);
            renderBoard();

            e.dataTransfer.setData('text/plain', JSON.stringify({ fromR: r, fromC: c }));
        });
    }
}


            // Highlighting / Penanda Visual Petak
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                square.classList.add('selected');
            }

            if (lastMove && 
               ((lastMove.fromR === r && lastMove.fromC === c) || 
                (lastMove.toR === r && lastMove.toC === c))) {
                square.classList.add('last-move');
            }

            if (validMoves.some(m => m.r === r && m.c === c)) {
                square.classList.add('possible-move');
            }

            // Event Klik biasa untuk melangkah
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
    if (gameStatus !== 'playing') return;

    if (playerColor && currentTurn !== playerColor) {
        showWrongTurnWarning();
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

        if (clickedPieceColor === currentTurn && (!playerColor || clickedPieceColor === playerColor)) {
            selectedSquare = { r, c };
            validMoves = getSafeMoves(r, c, boardState);
            renderBoard();
            return;
        }

        const isMoveValid = validMoves.some(m => m.r === r && m.c === c);
        if (isMoveValid) {
            const backupState = {
                boardState: cloneBoard(boardState),
                currentTurn: currentTurn,
                lastMove: lastMove ? { ...lastMove } : null,
                hasMoved: { ...hasMoved },
                enPassantTarget: enPassantTarget ? { ...enPassantTarget } : null,
                gameStatus: gameStatus
            };

            const previousTurn = currentTurn;
            makeMove(selectedSquare.r, selectedSquare.c, r, c, boardState);
            selectedSquare = null;
            validMoves = [];
            
            currentTurn = currentTurn === 'white' ? 'black' : 'white';

            if (isCheckmate(currentTurn, boardState)) {
                gameStatus = 'checkmate';
            } else if (isStalemate(currentTurn, boardState)) {
                gameStatus = 'stalemate';
            } else {
                gameStatus = 'playing';
            }

            updateTurnUI();

            if (currentRoomId) {
                try {
                    const { data, error } = await supabaseClient.from('catur_rooms').update({
                        board_state: JSON.stringify(boardState),
                        current_turn: currentTurn,
                        last_move: JSON.stringify(lastMove),
                        has_moved: JSON.stringify(hasMoved),
                        en_passant: JSON.stringify(enPassantTarget),
                        status: gameStatus
                    }).eq('room_id', currentRoomId).eq('current_turn', previousTurn).select();

                    if (error || !data || data.length === 0) {
                        boardState = backupState.boardState;
                        currentTurn = backupState.currentTurn;
                        lastMove = backupState.lastMove;
                        hasMoved = backupState.hasMoved;
                        enPassantTarget = backupState.enPassantTarget;
                        gameStatus = backupState.gameStatus;
                        updateTurnUI();
                        showAlert("Gagal melakukan langkah! Koneksi terputus atau langkah mendahului lawan.");
                    }
                } catch (err) {
                    console.error("Gagal update room:", err);
                    boardState = backupState.boardState;
                    currentTurn = backupState.currentTurn;
                    lastMove = backupState.lastMove;
                    hasMoved = backupState.hasMoved;
                    enPassantTarget = backupState.enPassantTarget;
                    gameStatus = backupState.gameStatus;
                    updateTurnUI();
                    showAlert("Terjadi kesalahan jaringan!");
                }
            }

            if (isComputerMode && currentTurn === 'black' && gameStatus === 'playing') {
                setTimeout(() => {
                    makeComputerMove();
                }, 300);
            }

        } else {
            selectedSquare = null;
            validMoves = [];
            renderBoard();
        }
    } else {
        if (clickedPiece && clickedPieceColor === currentTurn && (!playerColor || clickedPieceColor === playerColor)) {
            selectedSquare = { r, c };
            validMoves = getSafeMoves(r, c, boardState);
            renderBoard();
        }
    }
}

function updateTurnUI() {
    let turnName = currentTurn === 'white' ? 'Putih' : 'Hitam';

    if (isCheckmate(currentTurn, boardState)) {
        gameStatus = 'checkmate';
        const winner = currentTurn === 'white' ? 'Hitam' : 'Putih';
        turnElement.textContent = `SKAKMAT!`;
        showAlert(`Skakmat! Pemain ${winner} memenangkan permainan.`);
    } else if (isStalemate(currentTurn, boardState)) {
        gameStatus = 'stalemate';
        turnElement.textContent = `REMIS!`;
        showAlert(`Remis (Stalemate)! Permainan berakhir seri.`);
    } else if (isInCheck(currentTurn, boardState)) {
        const checkText = (isComputerMode && currentTurn === 'black') ? 'Komputer (SKAK!)' : `${turnName} (SKAK!)`;
        turnElement.textContent = checkText;
    } else {
        if (isComputerMode && currentTurn === 'black') {
            turnName = 'Komputer (Berpikir...)';
        }
        turnElement.textContent = turnName;
    }

    renderBoard();
}

let warningTimeout = null;
function showWrongTurnWarning() {
    if (!turnElement) return;

    const currentTurnName = currentTurn === 'white' ? 'Putih' : 'Hitam';
    const attemptedColor = playerColor === 'white' ? 'Putih' : 'Hitam';

    turnElement.textContent = `${currentTurnName} (bukan giliran ${attemptedColor})`;

    if (warningTimeout) clearTimeout(warningTimeout);

    warningTimeout = setTimeout(() => {
        updateTurnUI();
    }, 2000);
}

function makeMove(fromR, fromC, toR, toC, board) {
    const piece = board[fromR][fromC];

    // Makan En Passant
    if (piece.toLowerCase() === 'p' && enPassantTarget && toR === enPassantTarget.r && toC === enPassantTarget.c) {
        const enemyPawnRow = (piece === 'P') ? toR + 1 : toR - 1;
        board[enemyPawnRow][toC] = '';
    }
    board[toR][toC] = piece;
    board[fromR][fromC] = '';

    if (board === boardState) {
        if (piece.toLowerCase() === 'p' && Math.abs(fromR - toR) === 2) {
            enPassantTarget = { r: (fromR + toR) / 2, c: fromC };
        } else {
            enPassantTarget = null;
        }

        if (piece === 'K') hasMoved['K'] = true;
        if (piece === 'k') hasMoved['k'] = true;
        if (fromR === 7 && fromC === 7) hasMoved['R_k'] = true;
        if (fromR === 7 && fromC === 0) hasMoved['R_q'] = true;
        if (fromR === 0 && fromC === 7) hasMoved['r_k'] = true;
        if (fromR === 0 && fromC === 0) hasMoved['r_q'] = true;
        lastMove = { fromR, fromC, toR, toC };
    }

    // Rokade
    if (piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
        if (toC === 6) { board[toR][5] = board[toR][7]; board[toR][7] = ''; }
        else if (toC === 2) { board[toR][3] = board[toR][0]; board[toR][0] = ''; }
    }
    
    // Promosi Otomatis ke Ratu
    if (board[toR][toC] === 'P' && toR === 0) board[toR][toC] = 'Q';
    if (board[toR][toC] === 'p' && toR === 7) board[toR][toC] = 'q';
}

function getRawMoves(r, c, board, isCheckContext = false) {
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
            if (r === startRow && board[r + 2 * dir] && board[r + 2 * dir][c] === '') {
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

        if (!isCheckContext) {
            if (color === 'white' && r === 7 && c === 4) {
                if (!hasMoved['K'] && !hasMoved['R_k'] && board[7][5] === '' && board[7][6] === '') {
                    if (!isInCheck('white', board)) {
                        const tempF = cloneBoard(board);
                        tempF[7][5] = 'K'; tempF[7][4] = '';
                        if (!isInCheck('white', tempF)) {
                            moves.push({ r: 7, c: 6, isCastling: 'short' });
                        }
                    }
                }
                if (!hasMoved['K'] && !hasMoved['R_q'] && board[7][1] === '' && board[7][2] === '' && board[7][3] === '') {
                    if (!isInCheck('white', board)) {
                        const tempD = cloneBoard(board);
                        tempD[7][3] = 'K'; tempD[7][4] = '';
                        if (!isInCheck('white', tempD)) {
                            moves.push({ r: 7, c: 2, isCastling: 'long' });
                        }
                    }
                }
            } else if (color === 'black' && r === 0 && c === 4) {
                if (!hasMoved['k'] && !hasMoved['r_k'] && board[0][5] === '' && board[0][6] === '') {
                    if (!isInCheck('black', board)) {
                        const tempF = cloneBoard(board);
                        tempF[0][5] = 'k'; tempF[0][4] = '';
                        if (!isInCheck('black', tempF)) {
                            moves.push({ r: 0, c: 6, isCastling: 'short' });
                        }
                    }
                }
                if (!hasMoved['k'] && !hasMoved['r_q'] && board[0][1] === '' && board[0][2] === '' && board[0][3] === '') {
                    if (!isInCheck('black', board)) {
                        const tempD = cloneBoard(board);
                        tempD[0][3] = 'k'; tempD[0][4] = '';
                        if (!isInCheck('black', tempD)) {
                            moves.push({ r: 0, c: 2, isCastling: 'long' });
                        }
                    }
                }
            }
        }
    }

    return moves;
}

function getSafeMoves(r, c, board) {
    const rawMoves = getRawMoves(r, c, board);
    const color = getPieceColor(board[r][c]);

    return rawMoves.filter(move => {
        const tempBoard = cloneBoard(board);
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

    if (!kingPos) return true;

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && getPieceColor(piece) !== color) {
                const enemyMoves = getRawMoves(r, c, board, true);
                if (enemyMoves.some(m => m.r === kingPos.r && m.c === kingPos.c)) {
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

function isStalemate(color, board) {
    if (isInCheck(color, board)) return false;

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

function generateRandomRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomStr = '';
    for (let i = 0; i < 4; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomStr;
}

// Buat Room
if (createRoomBtn) {
    createRoomBtn.addEventListener('click', async () => {
        initGame(false);
        const roomId = generateRandomRoomId();
        
        if (roomIdInput) roomIdInput.value = roomId;

        currentRoomId = roomId;
        playerColor = 'white';

        localStorage.setItem('active_room_id', roomId);
        localStorage.setItem('active_player_color', 'white');

        const { error } = await supabaseClient.from('catur_rooms').upsert([{
            room_id: roomId,
            player_white_id: playerId,
            board_state: JSON.stringify(initialBoard),
            current_turn: 'white',
            status: 'playing'
        }]);

        if (!error) {
            showAlert(`Room "${roomId}" dibuat! Kamu sebagai PUTIH.`);
            listenToRoom(roomId);
        } else {
            showAlert("Gagal membuat room!");
        }
    });
}

// Masuk Room
if (joinRoomBtn) {
    joinRoomBtn.addEventListener('click', async () => {
        const roomId = roomIdInput.value.trim().toUpperCase();
        if (!roomId) {
            showAlert("Masukkan ID Room terlebih dahulu!");
            return;
        }

        const { data } = await supabaseClient.from('catur_rooms')
            .select('*')
            .eq('room_id', roomId)
            .single();

        if (data) {
            if (data.player_white_id === playerId) {
                playerColor = 'white';
            } else if (data.player_black_id === playerId) {
                playerColor = 'black';
            } else if (!data.player_black_id) {
                playerColor = 'black';
                await supabaseClient.from('catur_rooms')
                    .update({ player_black_id: playerId })
                    .eq('room_id', roomId);
            } else {
                showAlert("Room sudah penuh oleh 2 pemain lain!");
                return;
            }

            currentRoomId = roomId;
            isComputerMode = false;

            localStorage.setItem('active_room_id', roomId);
            localStorage.setItem('active_player_color', playerColor);
            
            showAlert(`Berhasil masuk ke Room "${roomId}"! Kamu bermain sebagai ${playerColor === 'white' ? 'PUTIH' : 'HITAM'}.`);
            
            boardState = typeof data.board_state === 'string' ? JSON.parse(data.board_state) : data.board_state;
            currentTurn = data.current_turn;
            gameStatus = data.status || 'playing';
            updateTurnUI();

            listenToRoom(roomId);
        } else {
            showAlert("Room tidak ditemukan! Cek kembali ID Room.");
        }
    });
}

function listenToRoom(roomId) {
    if (activeChannel) {
        supabaseClient.removeChannel(activeChannel);
    }

    activeChannel = supabaseClient
        .channel(`room:${roomId}`)
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'catur_rooms',
            filter: `room_id=eq.${roomId}`
        }, payload => {
            const data = payload.new;
            if (data && data.board_state) {
                boardState = typeof data.board_state === 'string' ? JSON.parse(data.board_state) : data.board_state;
                currentTurn = data.current_turn;
                gameStatus = data.status || 'playing';

                if (data.last_move) {
                    lastMove = typeof data.last_move === 'string' ? JSON.parse(data.last_move) : data.last_move;
                } else {
                    lastMove = null;
                }

                if (data.has_moved) {
                    hasMoved = typeof data.has_moved === 'string' ? JSON.parse(data.has_moved) : data.has_moved;
                }

                if (data.en_passant) {
                    try {
                        const parsed = typeof data.en_passant === 'string' ? JSON.parse(data.en_passant) : data.en_passant;
                        enPassantTarget = (parsed && typeof parsed === 'object') ? parsed : null;
                    } catch (e) {
                        enPassantTarget = null;
                    }
                } else {
                    enPassantTarget = null;
                }

                selectedSquare = null;
                validMoves = [];
                updateTurnUI();
            }
        })
        .subscribe();
}

if (vsComputerBtn) {
    vsComputerBtn.addEventListener('click', () => {
        if (typeof isLocked !== 'undefined' && isLocked) {
            showAlert("Tombol sedang dikunci! Buka kunci terlebih dahulu untuk mengubah mode.");
            return;
        }

        // 1. Jika Mode Komputer SEDANG AKTIF, matikan mode komputer (Kembali ke Lokal 2 Pemain)
        if (isComputerMode) {
            initGame(false, false); // Param ke-2 false: matikan isComputerMode
            
            // Ubah tampilan visual tombol (opsional, misalnya lepas kelas 'active')
            vsComputerBtn.classList.remove('active');
            
            showAlert("Mode Lawan Komputer dimatikan. Kembali ke Mode Lokal 2 Pemain!");
            return;
        }

        // 2. Jika Mode Komputer SEDANG MATI, aktifkan mode komputer
        // Putuskan koneksi dari Room Supabase jika ada
        if (activeChannel) {
            supabaseClient.removeChannel(activeChannel);
            activeChannel = null;
        }
        currentRoomId = null;
        localStorage.removeItem('active_room_id');
        localStorage.removeItem('active_player_color');
        if (roomIdInput) roomIdInput.value = '';

        // Reset game & aktifkan mode komputer (Param ke-2 true: aktifkan isComputerMode)
        initGame(false, true);

        playerColor = 'white';
        updateTurnUI();

        // Ubah tampilan visual tombol (opsional, misalnya tambah kelas 'active')
        vsComputerBtn.classList.add('active');

        showAlert("Mode Lawan Komputer Aktif! Kamu bermain sebagai PUTIH.");
    });
}



let aiWorker = null;
if (window.Worker) {
    try {
        aiWorker = new Worker('ai-worker.js');
        aiWorker.onmessage = function(e) {
            const bestMove = e.data;
            if (bestMove) {
                makeMove(bestMove.fromR, bestMove.fromC, bestMove.toR, bestMove.toC, boardState);
                lastMove = { 
                    fromR: bestMove.fromR, 
                    fromC: bestMove.fromC, 
                    toR: bestMove.toR, 
                    toC: bestMove.toC 
                };
                currentTurn = 'white';
                updateTurnUI();
            } else {
                updateTurnUI();
            }
        };
        aiWorker.onerror = function(err) {
            console.warn("Gagal menjalankan Web Worker AI:", err.message);
        };
    } catch (e) {
        console.warn("Web Worker tidak dapat diinisialisasi:", e);
    }
}

function makeComputerMove() {
    if (!isComputerMode || currentTurn !== 'black' || gameStatus !== 'playing') return;
    if (aiWorker) {
        aiWorker.postMessage({ boardState: boardState });
    }
}

// Copy ID Room
if (copyButton) {
    copyButton.addEventListener('click', () => {
        const roomId = roomIdInput ? roomIdInput.value.trim() : '';
        if (!roomId) {
            showAlert("Tidak ada ID Room untuk disalin! Buat room terlebih dahulu.");
            return;
        }

        function copyFallback(text) {
            const tempInput = document.createElement("input");
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            showCopySuccess();
        }

        function showCopySuccess() {
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 1500);
        }

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(roomId)
                .then(() => showCopySuccess())
                .catch(() => copyFallback(roomId));
        } else {
            copyFallback(roomId);
        }
    });
}


// Restore Room jika Browser Direfresh (Versi Baru)
async function checkAndRestoreRoom() {
    const savedRoomId = localStorage.getItem('active_room_id');
    const savedColor = localStorage.getItem('active_player_color');

    if (savedRoomId && savedColor) {
        try {
            const { data, error } = await supabaseClient
                .from('catur_rooms')
                .select('*')
                .eq('room_id', savedRoomId)
                .single();

            if (data && !error) {
                currentRoomId = savedRoomId;
                playerColor = savedColor;
                isComputerMode = false;

                if (roomIdInput) roomIdInput.value = savedRoomId;

                boardState = typeof data.board_state === 'string' ? JSON.parse(data.board_state) : data.board_state;
                currentTurn = data.current_turn;
                gameStatus = data.status || 'playing';
                
                if (data.last_move) {
                    lastMove = typeof data.last_move === 'string' ? JSON.parse(data.last_move) : data.last_move;
                }

                if (data.has_moved) {
                    hasMoved = typeof data.has_moved === 'string' ? JSON.parse(data.has_moved) : data.has_moved;
                }

                if (data.en_passant) {
                    try {
                        const parsed = typeof data.en_passant === 'string' ? JSON.parse(data.en_passant) : data.en_passant;
                        enPassantTarget = (parsed && typeof parsed === 'object') ? parsed : null;
                    } catch (e) {
                        enPassantTarget = null;
                    }
                } else {
                    enPassantTarget = null;
                }

                listenToRoom(savedRoomId);
                updateTurnUI();
                return true; // Berhasil restore
            }
        } catch (err) {
            console.error("Gagal memulihkan room:", err);
        }
    }
    return false; // Gagal restore / tidak ada sesi
}

// ALUR STARTUP APLIKASI (Pengganti initGame(false); checkAndRestoreRoom();)
async function startApp() {
    const savedRoomId = localStorage.getItem('active_room_id');
    const savedColor = localStorage.getItem('active_player_color');

    if (savedRoomId && savedColor) {
        const restored = await checkAndRestoreRoom();
        if (!restored) {
            initGame(false);
        }
    } else {
        initGame(false);
    }
}

startApp();


// Fitur Tombol Kunci (Lock Button)
if (lockButton) {
    lockButton.addEventListener('click', () => {
        isLocked = !isLocked;

        // Daftar elemen/tombol yang di-nonaktifkan saat terkunci
        const buttonsToToggle = [resetBtn, createRoomBtn, vsComputerBtn, joinRoomBtn, roomIdInput];

        buttonsToToggle.forEach(btn => {
            if (btn) {
                btn.disabled = isLocked;
                // Opsional: Tambahkan efek visual pointer jika diperlukan
                btn.style.cursor = isLocked ? 'not-allowed' : 'pointer';
            }
        });

        // Ubah tampilan visual tombol gembok
        if (isLocked) {
            lockButton.classList.add('locked');
            lockButton.innerHTML = '<i class="fas fa-lock"></i>';
            lockButton.title = "Buka Kunci Tombol";
        } else {
            lockButton.classList.remove('locked');
            lockButton.innerHTML = '<i class="fas fa-lock-open"></i>';
            lockButton.title = "Kunci Tombol";
        }
    });
}


if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
        // 1. Cek Kunci Tombol (Fitur Gembok)
        if (typeof isLocked !== 'undefined' && isLocked) {
            showAlert("Tombol sedang dikunci! Buka kunci terlebih dahulu untuk mulai ulang.");
            return;
        }

        // 2. Cek Logika Permainan Online
        if (currentRoomId) {
            // Jika permainan masih berlangsung, cegah reset
            if (gameStatus === 'playing') {
                showAlert("masih main! jangan curang kak😝");
                return;
            }

            // Jika permainan SUDAH SELESAI (checkmate / stalemate), reset papan di Supabase
            try {
                const { error } = await supabaseClient.from('catur_rooms').update({
                    board_state: JSON.stringify(initialBoard),
                    current_turn: 'white',
                    last_move: null,
                    has_moved: JSON.stringify({
                        'K': false, 'R_k': false, 'R_q': false,
                        'k': false, 'r_k': false, 'r_q': false
                    }),
                    en_passant: null,
                    status: 'playing'
                }).eq('room_id', currentRoomId);

                if (error) {
                    showAlert("Gagal mereset permainan di room!");
                } else {
                    showAlert("Permainan di-reset! Selamat bermain kembali.");
                }
            } catch (err) {
                console.error("Gagal reset room:", err);
                showAlert("Terjadi kesalahan jaringan saat mereset permainan!");
            }
            return;
        }

        // 3. Reset untuk Mode Offline / Komputer
        const currentCompMode = isComputerMode;
        initGame(false); // Reset papan ke posisi awal

        if (currentCompMode) {
            isComputerMode = true;
            playerColor = 'white';
            showAlert("Permainan lawan komputer diulang!");
        } else {
            showAlert("Papan catur berhasil di-reset!");
        }
    });
}
