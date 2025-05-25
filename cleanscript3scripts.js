    function toggleMenu() {
      const menu = document.getElementById('dropdown-menu');
      menu.classList.toggle('hidden');
    }

    function goHome() {
      showOnlySection('intro-screen');
    }

    function showOptions() {
      showOnlySection('options-screen');
    }
    
    function goBack() {
      showOnlySection('options-screen');
    }
    
    function goBack2() {
      showOnlySection('game-screen');
    }

    function showChatbot() {
      showOnlySection('chatbot-intro-screen');
    }

    function showMindfulness() {
      showOnlySection('meditatie-screen');
    }

function openChatConversation() {
  hideAllScreens();
  document.getElementById('chatbot-df-screen').classList.remove('hidden');
}

function goBackToIntro() {
  showOnlySection('chatbot-intro-screen');
}

// Show eindscherm after 40 minutes (2.4 million milliseconds)
setTimeout(() => {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('eindscherm').classList.remove('hidden');
  document.getElementById('bottom-nav').classList.add('hidden');
}, 1); // 40 * 60 * 1000 ms


let currentPuzzleIndex = 0;
let puzzles = [
  [
    [5, 3, '', '', 7, '', '', '', ''],
    [6, '', '', 1, 9, 5, '', '', ''],
    ['', 9, 8, '', '', '', '', 6, ''],
    [8, '', '', '', 6, '', '', '', 3],
    [4, '', '', 8, '', 3, '', '', 1],
    [7, '', '', '', 2, '', '', '', 6],
    ['', 6, '', '', '', '', 2, 8, ''],
    ['', '', '', 4, 1, 9, '', '', 5],
    ['', '', '', '', 8, '', '', 7, 9]
  ]
];

let timerInterval;
let totalSeconds = 600;
let timerPaused = false;

function startTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (!timerPaused) {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        alert("⏰ Tijd is op! Probeer de puzzel opnieuw of ga naar de volgende.");
        return;
      }
      totalSeconds--;
      updateTimerDisplay();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  document.getElementById('time').textContent = `${minutes}:${seconds}`;
}

function togglePause() {
  timerPaused = !timerPaused;
  const btnLabel = document.getElementById("pause-label");
  const cells = document.querySelectorAll('.sudoku-cell');

  if (timerPaused) {
    cells.forEach(cell => cell.disabled = true);
    btnLabel.textContent = "HERVAT";
  } else {
    cells.forEach(cell => {
      if (!cell.classList.contains('prefilled')) cell.disabled = false;
    });
    btnLabel.textContent = "PAUZE";
  }
}

function renderSudokuBoard(board) {
  const container = document.getElementById("sudoku-board");
  container.innerHTML = '';
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("input");
      cell.setAttribute("type", "text");
      cell.setAttribute("maxlength", "1");
      cell.className = 'sudoku-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (board[r][c] !== '') {
        cell.value = board[r][c];
        cell.disabled = true;
        cell.classList.add('prefilled');
      }
      cell.addEventListener("input", validateSudoku);
      container.appendChild(cell);
    }
  }
}

function validateSudoku() {
  let correct = true;
  const cells = document.querySelectorAll('.sudoku-cell');
  const grid = Array.from({ length: 9 }, () => Array(9).fill(''));

  cells.forEach(cell => {
    const r = cell.dataset.row;
    const c = cell.dataset.col;
    const val = cell.value;
    if (val && (isNaN(val) || val < 1 || val > 9)) {
      cell.classList.add("error");
      correct = false;
    } else {
      cell.classList.remove("error");
      grid[r][c] = val;
    }
  });

  if (correct && isSudokuComplete(grid)) {
    if (isValidSudoku(grid)) {
      alert("Goed gedaan! Volgende puzzel komt eraan.");
      nextPuzzle();
    } else {
      alert("Oeps! Er zit nog een fout in je oplossing.");
    }
  }
}

function isSudokuComplete(grid) {
  return grid.every(row => row.every(cell => cell !== ''));
}

function isValidSudoku(grid) {
  for (let i = 0; i < 9; i++) {
    if (!isValidGroup(grid[i])) return false;
    const col = grid.map(row => row[i]);
    if (!isValidGroup(col)) return false;
  }
  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
      const block = [];
      for (let dr = 0; dr < 3; dr++) {
        for (let dc = 0; dc < 3; dc++) {
          block.push(grid[r + dr][c + dc]);
        }
      }
      if (!isValidGroup(block)) return false;
    }
  }
  return true;
}

function isValidGroup(group) {
  const seen = new Set();
  for (let val of group) {
    if (val === '') return false;
    if (seen.has(val)) return false;
    seen.add(val);
  }
  return true;
}

function giveHint() {
  alert("👉 Tip: Elke rij, kolom en 3x3 vak moet de cijfers 1-9 bevatten zonder herhaling.");
}

function pauseSudoku() {
  document.querySelectorAll('.sudoku-cell').forEach(cell => cell.disabled = true);
  clearInterval(timerInterval);
  const btn = document.getElementById('pause-btn');
  btn.textContent = 'HERVAT';
  btn.onclick = resumeSudoku;
}

function resumeSudoku() {
  document.querySelectorAll('.sudoku-cell').forEach(cell => {
    if (!cell.classList.contains('prefilled')) cell.disabled = false;
  });
  startTimer();
  const btn = document.getElementById('pause-btn');
  btn.textContent = 'PAUZE';
  btn.onclick = pauseSudoku;
}

function showExplanation() {
  setTimeout(() => alert("ℹ️ Sudoku is een puzzel waarbij je de cijfers 1 t/m 9 moet invullen in elke rij, kolom en 3x3 vak zonder herhaling."), 10);
}

function nextPuzzle() {
  currentPuzzleIndex = (currentPuzzleIndex + 1) % puzzles.length;
  document.getElementById("puzzle-number").textContent = currentPuzzleIndex + 1;
  totalSeconds = 600;
  renderSudokuBoard(puzzles[currentPuzzleIndex]);
  clearInterval(timerInterval);
  startTimer();
}

function startSudoku() {
  renderSudokuBoard(puzzles[0]);
  document.getElementById("puzzle-number").textContent = currentPuzzleIndex + 1;
  totalSeconds = 600;
  startTimer();
}


startSudoku();
    function openRelaxation() {
      alert("Ontspanningsopties geopend");
    }

    function showGame() {
      showOnlySection('game-screen');
    }

function showVideoScreen() {
  showOnlySection('film-screen');
}


    function showOnlySection(id) {
      const sections = document.querySelectorAll('main > section');
      sections.forEach(s => s.classList.add('hidden'));
      document.getElementById(id).classList.remove('hidden');
    }

    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    context.scale(20, 20);

    const nextCanvas = document.getElementById('next');
    const nextContext = nextCanvas.getContext('2d');
    nextContext.scale(20, 20);

    let arena, player, nextPiece;
    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let paused = false;
    let level = 1;

    const colors = [null,'#caa6ff','#67d6ff','#b5f4be','#fcd6ff','#ffcb8a','#ffe57f','#3877FF'];

    const pieces = 'ILJOTSZ';

    function createMatrix(w, h) {
      const matrix = [];
      while (h--) matrix.push(new Array(w).fill(0));
      return matrix;
    }

    function createPiece(type) {
      if (type === 'T') return [[0, 1, 0], [1, 1, 1], [0, 0, 0]];
      if (type === 'O') return [[2, 2], [2, 2]];
      if (type === 'L') return [[0, 3, 0], [0, 3, 0], [0, 3, 3]];
      if (type === 'J') return [[0, 4, 0], [0, 4, 0], [4, 4, 0]];
      if (type === 'I') return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]];
      if (type === 'S') return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
      if (type === 'Z') return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
    }

function drawMatrix(matrix, offset, ctx = context) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function updateNextCanvas() {
  nextContext.clearRect(0, 0, nextCanvas.width, nextCanvas.height);

  const gridSize = 4; // 4x4 blokken
  const matrix = nextPiece;
  const matrixWidth = matrix[0].length;
  const matrixHeight = matrix.length;

  const offsetX = Math.floor((gridSize - matrixWidth) / 2);
  const offsetY = Math.floor((gridSize - matrixHeight) / 2);

  drawMatrix(matrix, { x: offsetX, y: offsetY }, nextContext);
}

    function update(time = 0) {
      if (paused) return;
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) {
        playerDrop();
      }
      draw();
      requestAnimationFrame(update);
    }

    function draw() {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawMatrix(arena, { x: 0, y: 0 });
      drawMatrix(player.matrix, player.pos);
    }

function playerDrop() {
  player.pos.y++;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    arenaSweep(); // <- hier toevoegen
    playerReset();
  }
  dropCounter = 0;
}

    function collide(arena, player) {
      const [m, o] = [player.matrix, player.pos];
      for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
          if (m[y][x] !== 0 &&
              (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
            return true;
          }
        }
      }
      return false;
    }

    function merge(arena, player) {
      player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            arena[y + player.pos.y][x + player.pos.x] = value;
          }
        });
      });
    }

function playerReset() {
  player.matrix = nextPiece;
  nextPiece = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
  updateNextCanvas(); // <- hier!
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    level = 1;
    document.getElementById('level').textContent = '01';
  }
}

    function playerMove(dir) {
      player.pos.x += dir;
      if (collide(arena, player)) {
        player.pos.x -= dir;
      }
    }

    function rotate(matrix, dir) {
      for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
      }
      if (dir > 0) matrix.forEach(row => row.reverse());
      else matrix.reverse();
    }

    function playerRotate(dir) {
      const pos = player.pos.x;
      let offset = 1;
      rotate(player.matrix, dir);
      while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
          rotate(player.matrix, -dir);
          player.pos.x = pos;
          return;
        }
      }
    }

function startGame(type) {
  document.getElementById('game-screen').classList.add('hidden');

  if (type === 'tetris') {
    document.getElementById('tetris-screen').classList.remove('hidden');
    arena = createMatrix(12, 20);
    player = { pos: { x: 0, y: 0 }, matrix: null };
    nextPiece = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
    playerReset();
    paused = false;
    document.getElementById('resume-btn').classList.add('hidden');
    lastTime = 0;
    requestAnimationFrame(update);
  } else if (type === 'sudoku-screen') {
    document.getElementById('sudoku-screen').classList.remove('hidden');
    startSudoku(); // Call the Sudoku initializer
  } else {
    alert('Spel niet beschikbaar.');
  }
}


function arenaSweep() {
  let rowCount = 1;
  outer: for (let y = arena.length - 1; y >= 0; --y) {
    for (let x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) continue outer;
    }


    const row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;

    // Update level or score here if needed
    level++;
    document.getElementById('level').textContent = String(level).padStart(2, '0');
  }
}


function toggleGamePause() {
  paused = !paused;
  const btn = document.querySelector('.pause-btn');
  const resumeBtn = document.getElementById('resume-btn');

  if (paused) {
    btn.textContent = 'HERVAT';
    resumeBtn.classList.remove('hidden'); // optioneel: aparte hervat-knop
  } else {
    btn.textContent = 'PAUZE';
    resumeBtn.classList.add('hidden');
    requestAnimationFrame(update); // <- BELANGRIJK: start animatieloop opnieuw
  }
}



    document.addEventListener('keydown', event => {
      if (paused) return;
      if (event.key === 'ArrowLeft') playerMove(-1);
      else if (event.key === 'ArrowRight') playerMove(1);
      else if (event.key === 'ArrowDown') playerDrop();
      else if (event.key === 'q') playerRotate(-1);
      else if (event.key === 'w') playerRotate(1);
    });

  window.addEventListener('df-response-received', function (event) {
    const messages = event.detail.response.queryResult.fulfillmentMessages;

    messages.forEach((msg) => {
      const params = msg?.payload?.fields;
      if (params && params.action?.stringValue === 'navigate') {
        const targetId = params.target?.stringValue;
        if (targetId) {
          showCustomScreen(targetId);
        }
      }
    });
  });

  function showCustomScreen(targetId) {
    hideAllScreens();
    const screen = document.getElementById(targetId);
    if (screen) {
      screen.classList.remove('hidden');
      window.scrollTo(0, 0);
    }
  }

  function hideAllScreens() {
    const screens = document.querySelectorAll("section");
    screens.forEach((s) => s.classList.add("hidden"));
  };

window.addEventListener('df-messenger-loaded', () => {
  const iframe = document.querySelector('df-messenger').shadowRoot.querySelector('iframe');
  iframe.onload = () => {
    iframe.contentWindow.scrollTo(0, iframe.contentWindow.document.body.scrollHeight);
  };
});
  const bottomNav = document.getElementById("bottom-nav");
  const navToggle = document.getElementById("nav-toggle");

  window.addEventListener('df-response-received', function (event) {
    const messages = event.detail.response.queryResult.fulfillmentMessages;

    messages.forEach((msg) => {
      const params = msg?.payload?.fields;
      if (params && params.action?.stringValue === 'navigate') {
        const targetId = params.target?.stringValue;
        if (targetId) {
          showCustomScreen(targetId);
        }
      }
    });
  });


  function showCustomScreen(targetId) {
    hideAllScreens();
    const screen = document.getElementById(targetId);
    if (screen) {
      screen.classList.remove('hidden');
      window.scrollTo(0, 0);
    }
  }

  function hideAllScreens() {
    const screens = document.querySelectorAll("section");
    screens.forEach((s) => s.classList.add("hidden"));
  }

  function setActiveNav(target) {
    const buttons = document.querySelectorAll('.bottom-nav .nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    target.classList.add('active');
  }

  function showOnlySection(id) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');

    const nav = document.getElementById('bottom-nav');
    const toggle = document.getElementById('nav-toggle');
    if (id === 'video-screen') {
      setActiveNav(document.getElementById('nav-videos'));
    } else if (id === 'game-screen' || id === 'tetris-screen') {
      setActiveNav(document.getElementById('nav-spelletjes'));
    } else if (id === 'meditatie-screen') {
      setActiveNav(document.getElementById('nav-mindfulness'));
    } else if (id === 'chatbot-intro-screen') {
      setActiveNav(document.getElementById('nav-vragen'));
    } else if (id === 'options-screen') {
      setActiveNav(document.getElementById('nav-keuzescherm'));
    }
  }
window.addEventListener('df-messenger-loaded', () => {
  const iframe = document.querySelector('df-messenger').shadowRoot.querySelector('iframe');

  // Try to send a simulated user message after iframe loads (⚠️ might not always work!)
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.postMessage({
        event: 'df-request-query',
        query: 'hallo'  // or whatever should trigger your welcome logic
      }, '*');
    }, 1000); // delay to let the bot fully load
  };
});

  const messenger = document.querySelector('df-messenger');

  messenger.addEventListener('df-chip-clicked', function(event) {
    const clickedText = event.detail.text || '';

    console.log('Chip clicked:', clickedText);

    if (clickedText.includes('spelletje')) {
      showGame();
    } else if (clickedText.includes('video')) {
      showVideoScreen();
    } else if (clickedText.includes('Ontspan')) {
      showMindfulness();
    }
  });



