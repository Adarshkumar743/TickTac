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
  
    const createThreats = (block, combination, symbol) => {
      let threatCount = 0;
      let emptyIndex = -1;
      combination.forEach((index) => {
        if (block[index] === symbol) {
          threatCount++;
        } else if (block[index] === "") {
          emptyIndex = index;
        }
      });
      return { threatCount, emptyIndex };
    };
  
    // Check for potential winning moves for the computer
    for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
      const block = blocks[blockIndex];
      for (const combination of winningCombinations) {
        const { threatCount, emptyIndex } = createThreats(block, combination, "O");
        if (threatCount === 3 && emptyIndex !== -1) {
          return { blockIndex, index: emptyIndex };
        }
      }
    }
  
    // Check for potential winning moves across the same positions in different blocks for the computer
    for (let i = 0; i < 16; i++) {
      const potentialWin = [
        blocks[0][i] === "O",
        blocks[1][i] === "O",
        blocks[2][i] === "O",
        blocks[3][i] === "",
      ];
      const emptyIndex = potentialWin.indexOf("");
      if (potentialWin.filter(Boolean).length === 3 && emptyIndex !== -1) {
        return { blockIndex: emptyIndex, index: i };
      }
    }
  
    // Add strategic positioning logic: prioritize central positions early in the game
    const centralPositions = [5, 6, 9, 10];
    for (const pos of centralPositions) {
      for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
        if (blocks[blockIndex][pos] === "") {
          return { blockIndex, index: pos };
        }
      }
    }
  
    // Add lookahead mechanism for evaluating future states (basic version)
    for (let blockIndex = 0; blockIndex < 4; blockIndex++) {
      for (let i = 0; i < 16; i++) {
        if (blocks[blockIndex][i] === "") {
          const simulatedBlocks = JSON.parse(JSON.stringify(blocks));
          simulatedBlocks[blockIndex][i] = "O";
          const { threatCount: computerThreat } = createThreats(
            simulatedBlocks[blockIndex],
            winningCombinations,
            "O"
          );
          const { threatCount: humanThreat } = createThreats(
            simulatedBlocks[blockIndex],
            winningCombinations,
            "X"
          );
          if (computerThreat > humanThreat) {
            return { blockIndex, index: i };
          }
        }
      }
    }
  
    return null;
  };
  