function cloneBoard(board) {
    return board.map(row => row.slice());
}

function getPieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? 'white' : 'black';
}

const PIECE_VALUES = {
    'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000,
    'P': -100, 'N': -320, 'B': -330, 'R': -500, 'Q': -900, 'K': -20000
};

function makeMove(fromR, fromC, toR, toC, board, enPassantTarget = null) {
    const piece = board[fromR][fromC];

    // En Passant
    if (piece.toLowerCase() === 'p' && enPassantTarget && toR === enPassantTarget.r && toC === enPassantTarget.c) {
        const enemyPawnRow = piece === 'P' ? toR + 1 : toR - 1;
        board[enemyPawnRow][toC] = '';
    }

    board[toR][toC] = piece;
    board[fromR][fromC] = '';

    // Rokade
    if (piece.toLowerCase() === 'k' && Math.abs(fromC - toC) === 2) {
        if (toC === 6) { board[toR][5] = board[toR][7]; board[toR][7] = ''; }
        else if (toC === 2) { board[toR][3] = board[toR][0]; board[toR][0] = ''; }
    }

    // Promosi
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

        // Logika Rokade khusus Hitam (AI)
        if (color === 'black' && r === 0 && c === 4) {
            // Rokade Pendek
            if (board[0][5] === '' && board[0][6] === '' && board[0][7] === 'r') {
                if (!isInCheck('black', board)) {
                    const tempF = cloneBoard(board);
                    tempF[0][5] = 'k'; tempF[0][4] = '';
                    if (!isInCheck('black', tempF)) moves.push({ r: 0, c: 6 });
                }
            }
            // Rokade Panjang
            if (board[0][1] === '' && board[0][2] === '' && board[0][3] === '' && board[0][0] === 'r') {
                if (!isInCheck('black', board)) {
                    const tempD = cloneBoard(board);
                    tempD[0][3] = 'k'; tempD[0][4] = '';
                    if (!isInCheck('black', tempD)) moves.push({ r: 0, c: 2 });
                }
            }
        }
    }

    return moves;
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
                const enemyMoves = getRawMoves(r, c, board);
                if (enemyMoves.some(m => m.r === kingPos.r && m.c === kingPos.c)) {
                    return true;
                }
            }
        }
    }
    return false;
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

function evaluateBoard(board) {
    let score = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece) {
                score += PIECE_VALUES[piece] || 0;
            }
        }
    }
    return score;
}

function minimax(board, depth, alpha, beta, isMaximizing) {
    if (depth === 0) return evaluateBoard(board);

    let moves = [];
    const targetColor = isMaximizing ? 'black' : 'white';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (getPieceColor(board[r][c]) === targetColor) {
                const safe = getSafeMoves(r, c, board);
                safe.forEach(m => moves.push({ fromR: r, fromC: c, toR: m.r, toC: m.c }));
            }
        }
    }

    if (moves.length === 0) {
        if (isInCheck(targetColor, board)) {
            return isMaximizing ? -1000000 : 1000000;
        }
        return 0;
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const tempBoard = cloneBoard(board);
            makeMove(move.fromR, move.fromC, move.toR, move.toC, tempBoard);
            let evaluation = minimax(tempBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const tempBoard = cloneBoard(board);
            makeMove(move.fromR, move.fromC, move.toR, move.toC, tempBoard);
            let evaluation = minimax(tempBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

self.onmessage = function(e) {
    const { boardState } = e.data;
    let moves = [];

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (getPieceColor(boardState[r][c]) === 'black') {
                const safe = getSafeMoves(r, c, boardState);
                safe.forEach(m => moves.push({ fromR: r, fromC: c, toR: m.r, toC: m.c }));
            }
        }
    }

    if (moves.length === 0) {
        self.postMessage(null);
        return;
    }

    let bestMove = moves[0];
    let maxScore = -Infinity;

    for (const move of moves) {
        const tempBoard = cloneBoard(boardState);
        makeMove(move.fromR, move.fromC, move.toR, move.toC, tempBoard);
        
        let score = minimax(tempBoard, 2, -Infinity, Infinity, false);

        if (score > maxScore) {
            maxScore = score;
            bestMove = move;
        }
    }

    self.postMessage(bestMove);
};
