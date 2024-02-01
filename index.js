document.addEventListener('DOMContentLoaded', function () {
  const gridSize = 9;
  const solveButton = document.getElementById("solve-btn");
  solveButton.addEventListener('click', solveSudoku);

  const sudokuGrid = document.getElementById("sudoku-grid");
  // Cria a grid do Sudoku e células de input
  for (let row = 0; row < gridSize; row++) {
      const newRow = document.createElement("tr");
      for (let col = 0; col < gridSize; col++) {
          const cell = document.createElement("td");
          const input = document.createElement("input");
          input.type = "number";
          input.className = "cell";
          input.id = `cell-${row}-${col}`;
          cell.appendChild(input);
          newRow.appendChild(cell);
      }
      sudokuGrid.appendChild(newRow);
  }
});

async function solveSudoku() {
  const gridSize = 9;
  const sudokuArray = [];

  // Preenceh o sudokuArray com valores da grid
  for (let row = 0; row < gridSize; row++) {
      sudokuArray[row] = [];
      for (let col = 0; col < gridSize; col++) {
          const cellId = `cell-${row}-${col}`;
          const cellValue = document.getElementById(cellId).value;
          sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
      }
  }

  // Identifica as células colcadas pelo usuário e marca as mesmas
  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          const cellId = `cell-${row}-${col}`;
          const cell = document.getElementById(cellId);

          if (sudokuArray[row][col] !== 0) {
              cell.classList.add("user-input");
          }
      }
  }

  // Resolve o sudoku e mostra a solução
  if (solveSudokuHelper(sudokuArray)) {
      for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
              const cellId = `cell-${row}-${col}`;
              const cell = document.getElementById(cellId);

              // Preenche os valores resolvidos e aplica a animação 
              if (!cell.classList.contains("user-input")) {
                  cell.value = sudokuArray[row][col];
                  cell.classList.add("solved");
                  await sleep(20); // Adiciona um delay para exibição
              }
          }
      }
  } else {
      alert("No solution exists for the given Sudoku puzzle.");
  }
}

function solveSudokuHelper(board) {
  const gridSize = 9;

  for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
          if (board[row][col] === 0) {
              for (let num = 1; num <= 9; num++) {
                  if (isValidMove(board, row, col, num)) {
                      board[row][col] = num;

                      // Tentantiva para executar o sudoku
                      if (solveSudokuHelper(board)) {
                          return true; // Puzzle resolvido
                      }

                      board[row][col] = 0; //Retrocede
                  }
              }
              return false; // Não achou um número válido
          }
      }
  }

  return true; // Todas as células foram prenchidas
}

function isValidMove(board, row, col, num) {
  const gridSize = 9;

  // Checa as linhas e colunas por conflitos 
  for (let i = 0; i < gridSize; i++) {
      if (board[row][i] === num || board[i][col] === num) {
          return false; // Conflito encontrado
      }
  }

  // Checa a subgrid 3x3 para ver se tem conflitos
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
          if (board[i][j] === num) {
              return false; // Achou conflitos
          }
      }
  }

  return true; // Não achou conflitos
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}