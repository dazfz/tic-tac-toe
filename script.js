const gameBoard = () => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const updateBoard = (index, symbol) => (board[index] = symbol);

  const clearBoard = () => {
    for (let i = 0; i < board.length; i++) board[i] = "";
  };

  return {
    getBoard,
    updateBoard,
    clearBoard,
  };
};

const displayController = () => {
  const winsDisplay1 = document.querySelector("#p1-wins");
  const losesDisplay1 = document.querySelector("#p1-losses");
  const tiesDisplay1 = document.querySelector("#p1-ties");
  const winsDisplay2 = document.querySelector("#p2-wins");
  const losesDisplay2 = document.querySelector("#p2-losses");
  const tiesDisplay2 = document.querySelector("#p2-ties");

  const showResult = (result) => alert(result);

  const updateScore = (wins, loses, ties) => {
    winsDisplay1.textContent = losesDisplay2.textContent = wins;
    losesDisplay1.textContent = winsDisplay2.textContent = loses;
    tiesDisplay1.textContent = tiesDisplay2.textContent = ties;
  };

  return {
    showResult,
    updateScore,
  };
};

const playerFactory = (name, symbol) => ({
  name,
  symbol,
  win: 0,
  lose: 0,
  tie: 0,
});

const checkResult = (b) => {
  // Check rows
  for (let i = 0; i < 9; i += 3)
    if (b[i] !== "" && b[i] === b[i + 1] && b[i] === b[i + 2]) return b[i];
  // Check columns
  for (let i = 0; i < 3; i++)
    if (b[i] !== "" && b[i] === b[i + 3] && b[i] === b[i + 6]) return b[i];
  // Check diagonals
  if (b[0] !== "" && b[0] === b[4] && b[0] === b[8]) return b[0];
  if (b[2] !== "" && b[2] === b[4] && b[2] === b[6]) return b[2];
  // Check for tie
  if (b.every((cell) => cell !== "")) return "tie";
  // No winner or tie
  return null;
};

const minimax = () => {};

const game = (isSinglePlayer, selectedXO) => {
  // Reset game, when creating a new game
  const newGameBtn = document.querySelector(".new");
  newGameBtn.addEventListener("click", () => {
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick);
      cell.textContent = "";
    });
    displayControllerObj.updateScore(0, 0, 0);
    gameBoardObj = displayControllerObj = player1 = player2 = null;
  });

  let gameBoardObj = gameBoard();
  let displayControllerObj = displayController();
  let player1 = playerFactory("Player 1", selectedXO);
  let player2 = playerFactory(
    isSinglePlayer ? "Computer" : "Player 2",
    selectedXO === "X" ? "O" : "X"
  );
  let currentPlayer = player1;

  const cells = document.querySelectorAll(".cell");

  const checkGameEnd = () => {
    const result = checkResult(gameBoardObj.getBoard());
    if (result) {
      if (result === "tie") {
        displayControllerObj.showResult("It's a tie!");
        player1.tie++, player2.tie++;
      } else {
        const winner = currentPlayer;
        displayControllerObj.showResult(`${winner.name} wins!`);
        winner.win++;
        currentPlayer === player1 ? player2.lose++ : player1.lose++;
      }

      displayControllerObj.updateScore(player1.win, player1.lose, player1.tie);
      gameBoardObj.clearBoard();

      cells.forEach((cell) => {
        cell.removeEventListener("click", handleCellClick);
        cell.addEventListener("click", handleCellClick);
        cell.textContent = "";
      });
    }
  };

  const handleCellClick = (event) => {
    const cell = event.target;
    const index = cell.value;
    if (gameBoardObj.getBoard()[index] !== "") return;
    cell.textContent = currentPlayer.symbol;
    gameBoardObj.updateBoard(index, currentPlayer.symbol);

    const result = checkResult(gameBoardObj.getBoard());
    if (result || gameBoardObj.getBoard().every((cell) => cell !== "")) {
      setTimeout(() => {
        checkGameEnd();
      }, 250); // Add a delay to show last mark
    } else {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
    }
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
  });
};

const myModule = () => {
  const modal = document.querySelector("#myModal");
  const xOModal = document.querySelector("#xOModal");
  const span = document.querySelectorAll(".close");
  // When the user clicks on <span> (x), close the modal
  span.forEach(
    (close) =>
      (close.onclick = () => {
        modal.style.display = "none";
        xOModal.style.display = "none";
      })
  );
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
    if (event.target == xOModal) xOModal.style.display = "none";
  };

  const showModal = () => (modal.style.display = "block");

  const showXOModal = () => {
    xOModal.style.display = "block";
    modal.style.display = "none";
  };

  const startGame = (isSinglePlayer, selectedXO) => {
    modal.style.display = "none";
    xOModal.style.display = "none";
    game(isSinglePlayer, selectedXO);
  };

  return { showModal, showXOModal, startGame };
};

const moduleObj = myModule();
