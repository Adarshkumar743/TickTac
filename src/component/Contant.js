export const toggle = (
  e,
  blockNum,
  num,
  count,
  blocks,
  setCount,
  lock,
  setBlocks,
  isComputer
) => {
  if (lock) {
    return;
  }
  const newBlocks = blocks.map((block, bIndex) =>
    block.map((cell, cIndex) => {
      if (bIndex === blockNum && cIndex === num) {
        return count % 2 === 0 ? "X" : "O";
      }
      return cell;
    })
  );

  setBlocks(newBlocks);
  setCount(count + 1);
  if (!isComputer && e) {
    e.target.innerHTML = count % 2 === 0 ? "X" : "O";
  }
};

export const checkWin = (blocks, won) => {
  const winningCombinations = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];


  // Check for a win within each block
  blocks.forEach((block) => {
    for (const combination of winningCombinations) {
      const [a, b, c, d] = combination;
      if (
        block[a] &&
        block[a] === block[b] &&
        block[a] === block[c] &&
        block[a] === block[d]
      ) {
        won(block[a]);
        return;
      }
    }
  });

  // Check for a win across the same positions in different blocks
  for (let i = 0; i < 16; i++) {
    if (
      blocks[0][i] &&
      blocks[0][i] === blocks[1][i] &&
      blocks[0][i] === blocks[2][i] &&
      blocks[0][i] === blocks[3][i]
    ) {
      won(blocks[0][i]);
      return;
    }
  }
};

export const findWinningMove = (blocks) => {
  const winningCombinations = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  // Check for potential winning moves for the computer
  for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
    const block = blocks[blockIndex];
    for (const combination of winningCombinations) {
      const [a, b, c, d] = combination;
      if (
        block[a] === "O" &&
        block[b] === "O" &&
        block[c] === "O" &&
        block[d] === ""
      ) {
        return { blockIndex, index: d };
      } else if (
        block[a] === "O" &&
        block[b] === "O" &&
        block[c] === "" &&
        block[d] === "O"
      ) {
        return { blockIndex, index: c };
      } else if (
        block[a] === "O" &&
        block[b] === "" &&
        block[c] === "O" &&
        block[d] === "O"
      ) {
        return { blockIndex, index: b };
      } else if (
        block[a] === "" &&
        block[b] === "O" &&
        block[c] === "O" &&
        block[d] === "O"
      ) {
        return { blockIndex, index: a };
      }
    }
  }

  // Check for potential winning moves across the same positions in different blocks for the computer
  for (let i = 0; i < 16; i++) {
    if (
      blocks[0][i] === "O" &&
      blocks[1][i] === "O" &&
      blocks[2][i] === "O" &&
      blocks[3][i] === ""
    ) {
      return { blockIndex: 3, index: i };
    } else if (
      blocks[0][i] === "O" &&
      blocks[1][i] === "O" &&
      blocks[2][i] === "" &&
      blocks[3][i] === "O"
    ) {
      return { blockIndex: 2, index: i };
    } else if (
      blocks[0][i] === "O" &&
      blocks[1][i] === "" &&
      blocks[2][i] === "O" &&
      blocks[3][i] === "O"
    ) {
      return { blockIndex: 1, index: i };
    } else if (
      blocks[0][i] === "" &&
      blocks[1][i] === "O" &&
      blocks[2][i] === "O" &&
      blocks[3][i] === "O"
    ) {
      return { blockIndex: 0, index: i };
    }
  }

  return null;
};

export const findBlockingMove = (blocks) => {
  const winningCombinations = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];

  // Check for potential blocking moves against the human player
  for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
    const block = blocks[blockIndex];
    for (const combination of winningCombinations) {
      const [a, b, c, d] = combination;
      if (
        block[a] === "X" &&
        block[b] === "X" &&
        block[c] === "X" &&
        block[d] === ""
      ) {
        return { blockIndex, index: d };
      } else if (
        block[a] === "X" &&
        block[b] === "X" &&
        block[c] === "" &&
        block[d] === "X"
      ) {
        return { blockIndex, index: c };
      } else if (
        block[a] === "X" &&
        block[b] === "" &&
        block[c] === "X" &&
        block[d] === "X"
      ) {
        return { blockIndex, index: b };
      } else if (
        block[a] === "" &&
        block[b] === "X" &&
        block[c] === "X" &&
        block[d] === "X"
      ) {
        return { blockIndex, index: a };
      }
    }
  }

  // Check for potential blocking moves across the same positions in different blocks against the human player
  for (let i = 0; i < 16; i++) {
    if (
      blocks[0][i] === "X" &&
      blocks[1][i] === "X" &&
      blocks[2][i] === "X" &&
      blocks[3][i] === ""
    ) {
      return { blockIndex: 3, index: i };
    } else if (
      blocks[0][i] === "X" &&
      blocks[1][i] === "X" &&
      blocks[2][i] === "" &&
      blocks[3][i] === "X"
    ) {
      return { blockIndex: 2, index: i };
    } else if (
      blocks[0][i] === "X" &&
      blocks[1][i] === "" &&
      blocks[2][i] === "X" &&
      blocks[3][i] === "X"
    ) {
      return { blockIndex: 1, index: i };
    } else if (
      blocks[0][i] === "" &&
      blocks[1][i] === "X" &&
      blocks[2][i] === "X" &&
      blocks[3][i] === "X"
    ) {
      return { blockIndex: 0, index: i };
    }
  }

  return null;
};

export const findBestMove = (blocks) => {
  // First, check for a winning move
  const winningMove = findWinningMove(blocks);
  if (winningMove) {
    return winningMove;
  }

  // If no winning move is found, check for a blocking move
  const blockingMove = findBlockingMove(blocks);
  if (blockingMove) {
    return blockingMove;
  }

  // If no winning or blocking move is found, choose the first available move
  for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
    for (let i = 0; i < 16; i++) {
      if (blocks[blockIndex][i] === "") {
        return { blockIndex, index: i };
      }
    }
  }

  return null;
};

export const reset = (lock, setLock, setBlocks, setCount, setWin) => {
  if (lock) {
    setLock(false);
  }
  let initialState = Array(4).fill(Array(16).fill(""));
  setBlocks(initialState.map((arr) => [...arr]));
  setCount(0);
  setWin("");
};
