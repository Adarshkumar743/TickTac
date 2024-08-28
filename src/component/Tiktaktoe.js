import React, { useState, useEffect } from "react";
import "../App.css";
import {
  checkWin,
  reset,
  toggle,
  findWinningMove,
  findBlockingMove,
} from "./Contant";

function Tiktaktoe() {
  const initialState = Array.from({ length: 4 }, () => Array(16).fill("")); // Create a deep copy
  const [blocks, setBlocks] = useState(initialState);
  const [count, setCount] = useState(0);
  const [lock, setLock] = useState(false);
  const [win, setWin] = useState("");
  const [isComputer, setIsComputer] = useState(true);
  const [winLine, setWinLine] = useState([]); // State to manage the winning line
  const [timer, setTimer] = useState(40); // State for the timer
  const [timerRunning, setTimerRunning] = useState(false); // State to manage if the timer is running
  const [gameStarted, setGameStarted] = useState(false); // State to manage if the game has started

  const won = (winner, winIndices) => {
    console.log(`Game won by: ${winner}`); // Debugging: Check who won
    setLock(true); // Lock the game to prevent further moves
    setWin(winner);
    setTimerRunning(false); // Stop the timer when someone wins
    setWinLine(winIndices || []); // Set the winning line
  };

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            // Timer expired; Determine the winner based on the game state
            if (!win) {
              const currentPlayer = count % 2 === 0 ? "X" : "O";
              won(currentPlayer === "X" ? "O" : "X", []); // Opponent wins
            }
            return 0; // Stop the timer if it reaches zero
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timerRunning]);

  useEffect(() => {
    if (isComputer && count % 2 !== 0 && !lock) {
      setTimeout(() => {
        const winningMove = findWinningMove(blocks);
        if (winningMove) {
          const { blockIndex, index } = winningMove;
          toggle(
            null,
            blockIndex,
            index,
            count,
            blocks,
            setCount,
            lock,
            setBlocks,
            true
          );
          won("Computer", [{ blockIndex, index }]); // Computer wins
        } else {
          const blockingMove = findBlockingMove(blocks);
          if (blockingMove) {
            const { blockIndex, index } = blockingMove;
            toggle(
              null,
              blockIndex,
              index,
              count,
              blocks,
              setCount,
              lock,
              setBlocks,
              true
            );
          } else {
            const emptyIndices = blocks.reduce((acc, block, blockIndex) => {
              block.forEach((val, index) => {
                if (val === "") acc.push({ blockIndex, index });
              });
              return acc;
            }, []);
            const randomIndex =
              emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            toggle(
              null,
              randomIndex.blockIndex,
              randomIndex.index,
              count,
              blocks,
              setCount,
              lock,
              setBlocks,
              true
            );
          }
        }
        checkWin(blocks, won); // Check for a win after the computer's move
        setTimer(40); // Reset the timer
      }, 500); // Adding a small delay for better user experience
    }
  }, [count, blocks, isComputer, lock]);

  // Function to calculate the position and rotation of the line for visual indication
  const calculateLineStyles = () => {
    if (winLine.length > 1) { // Ensure winLine has more than one point
      const startCell = document.querySelector(`.block-${winLine[0].blockIndex}-${winLine[0].index}`);
      const endCell = document.querySelector(`.block-${winLine[winLine.length - 1].blockIndex}-${winLine[winLine.length - 1].index}`);

      if (startCell && endCell) {
        const rectStart = startCell.getBoundingClientRect();
        const rectEnd = endCell.getBoundingClientRect();

        const centerX = (rectStart.left + rectEnd.left + rectStart.width) / 2;
        const centerY = (rectStart.top + rectEnd.top + rectStart.height) / 2;

        const length = Math.hypot(
          rectEnd.left - rectStart.left,
          rectEnd.top - rectStart.top
        );

        const angle = Math.atan2(
          rectEnd.top - rectStart.top,
          rectEnd.left - rectStart.left
        );

        return {
          width: `${length}px`,
          transform: `translate(${centerX}px, ${centerY}px) rotate(${angle + Math.PI / 2}rad)`,
        };
      }
    }
    return {};
  };

  const startGame = () => {
    setTimer(40);
    setTimerRunning(true);
    setGameStarted(true);
    setWin(""); // Reset win message when starting a new game
    setWinLine([]); // Reset win line when starting a new game
    setLock(false); // Unlock the game for new play
  };

  const getResultMessage = () => {
    console.log(`Current win state: ${win}`); // Debugging: Check the win state
    if (win === "Computer") {
      return "Better luck next time! You lost the game.";
    } else if (win === "X" || win === "O") {
      return `Congratulations ${win} has won the game!`;
    }
    return "";
  };

  // Ensure that the win check is performed after every move
  useEffect(() => {
    if (!isComputer) {
      checkWin(blocks, won); // Check for a win after every move when playing with human
    }
  }, [blocks, count, isComputer]);

  return (
    <div className="app">
      <div className="app_players">
        <h1>Player X</h1>
        <h1>Player O</h1>
        <div>
          <button
            className="myAction"
            onClick={() => {
              reset(lock, setLock, setBlocks, setCount, setWin, setWinLine);
              setTimer(40); // Reset the timer
              setTimerRunning(false); // Stop the timer
              setGameStarted(false); // Reset game start state
              setWin(""); // Clear the win state
              setWinLine([]); // Clear the winning line
            }}
          >
            Reset
          </button>
          <button
            className="myAction"
            onClick={() => setIsComputer(!isComputer)}
          >
            {isComputer ? "Play with Human" : "Play with Computer"}
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative", // Ensure relative positioning for the absolute line
        }}
      >
        {blocks.map((block, blockIndex) => (
          <div key={blockIndex} className="main_Block">
            {block.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  if (
                    gameStarted && // Ensure game has started
                    !lock &&
                    !blocks[blockIndex][index] &&
                    (count % 2 === 0 || !isComputer)
                  ) {
                    toggle(
                      e,
                      blockIndex,
                      index,
                      count,
                      blocks,
                      setCount,
                      lock,
                      setBlocks,
                      false
                    );
                    checkWin(blocks, won); // Check for a win after the move
                    setTimer(40); // Reset the timer
                  }
                }}
                className={`block block-${blockIndex}-${index} ${winLine.some(({ blockIndex: bi, index: idx }) => bi === blockIndex && idx === index) ? "highlight" : ""}`}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
        {winLine.length > 1 && (
          <div
            className="win-line"
            style={{ ...calculateLineStyles() }}
          ></div>
        )}
      </div>
      <div className="app_win">
        {lock ? (
          <h1>{getResultMessage()}</h1>
        ) : (
          !gameStarted ? (
            <>
              <h1>Start the game</h1>
              <button onClick={startGame}>Start</button>
            </>
          ) : (
            timerRunning && <h2>Time left: {timer}s</h2>
          )
        )}
      </div>
    </div>
  );
}

export default Tiktaktoe;
