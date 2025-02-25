"use client";
import { Card, Difficulty, Theme } from "@/lib/type";
import React, { useEffect, useState } from "react";

export const MatchingCard = () => {
  const gridSizes: Record<Difficulty, { rows: number; cols: number }> = {
    easy: { rows: 4, cols: 4 },
    medium: { rows: 6, cols: 4 },
    hard: { rows: 6, cols: 6 },
  };
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [theme, setTheme] = useState<Theme>("animals");
  const [hints, setHints] = useState<number>(3);
  const [peeks, setPeeks] = useState<number>(2);

  useEffect(() => {
    initializeGame();
  }, [difficulty, theme]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && matches === cards.length / 2) {
      setGameOver(true);
      // Could save high score here
    }
  }, [matches, cards.length, gameStarted]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);

      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard?.imageUrl === secondCard?.imageUrl) {
        // Cards match
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId
              ? { ...card, matched: true }
              : card
          )
        );
        setMatches((prevMatches) => prevMatches + 1);
        setFlippedCards([]);
      } else {
        // Cards don't match - flip back after delay
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, flipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  const initializeGame = () => {
    const { rows, cols } = gridSizes[difficulty];
    const totalCards = rows * cols;
    // Ensure even number of cards
    const adjustedTotal = totalCards % 2 === 0 ? totalCards : totalCards - 1;

    // Create pairs of cards
    const pairsNeeded = adjustedTotal / 2;
    const cardPairs: Card[] = [];

    // In a real app, you would have arrays of image URLs for each theme
    const imagePlaceholders = Array.from(
      { length: pairsNeeded },
      (_, i) => `${theme}-${i + 1}`
    );

    // Create pairs of cards
    for (let i = 0; i < pairsNeeded; i++) {
      const imageUrl = imagePlaceholders[i];

      // Create two cards with the same image
      cardPairs.push({
        id: i * 2,
        imageUrl,
        flipped: false,
        matched: false,
      });

      cardPairs.push({
        id: i * 2 + 1,
        imageUrl,
        flipped: false,
        matched: false,
      });
    }

    // Shuffle the cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    setGameStarted(false);

    // Reset power-ups based on difficulty
    setHints(difficulty === "easy" ? 3 : difficulty === "medium" ? 2 : 1);
    setPeeks(difficulty === "easy" ? 2 : difficulty === "medium" ? 1 : 0);
  };

  const handleCardClick = (cardId: number) => {
    // Start the game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Prevent clicks if game is over or already have 2 cards flipped
    if (gameOver || flippedCards.length >= 2) {
      return;
    }

    // Find the clicked card
    const clickedCard = cards.find((card) => card.id === cardId);

    // Prevent flipping already flipped or matched cards
    if (!clickedCard || clickedCard.flipped || clickedCard.matched) {
      return;
    }

    // Flip the card
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, flipped: true } : card
      )
    );

    // Add to flipped cards
    setFlippedCards((prevFlipped) => [...prevFlipped, cardId]);
  };

  const useHint = () => {
    if (hints <= 0 || flippedCards.length >= 1 || gameOver) return;

    // Find an unmatched card
    const unmatchedCards = cards.filter((card) => !card.matched);
    if (unmatchedCards.length === 0) return;

    // Get a random unmatched card
    const randomCard =
      unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];

    // Find its pair
    const pair = unmatchedCards.find(
      (card) =>
        card.id !== randomCard.id && card.imageUrl === randomCard.imageUrl
    );

    if (pair) {
      // Temporarily show the pair
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === randomCard.id || card.id === pair.id
            ? { ...card, flipped: true }
            : card
        )
      );

      // Flip them back after a short delay
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            (card.id === randomCard.id || card.id === pair.id) && !card.matched
              ? { ...card, flipped: false }
              : card
          )
        );
      }, 1000);

      setHints((prevHints) => prevHints - 1);
    }
  };

  const usePeek = () => {
    if (peeks <= 0 || gameOver) return;

    // Show all cards briefly
    setCards((prevCards) =>
      prevCards.map((card) =>
        !card.matched ? { ...card, flipped: true } : card
      )
    );

    // Hide them again after a delay
    setTimeout(() => {
      setCards((prevCards) =>
        prevCards.map((card) =>
          !card.matched ? { ...card, flipped: false } : card
        )
      );
    }, 1000);

    setPeeks((prevPeeks) => prevPeeks - 1);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      {/* Game header */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="text-xl font-bold">Memory Match</div>
        <div className="flex gap-4">
          <div>Time: {formatTime(timer)}</div>
          <div>Moves: {moves}</div>
          <div>
            Matches: {matches}/{cards.length / 2}
          </div>
        </div>
      </div>

      {/* Game controls */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select
            className="p-2 border rounded"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            disabled={gameStarted && !gameOver}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="p-2 border rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            disabled={gameStarted && !gameOver}
          >
            <option value="animals">Animals</option>
            <option value="food">Food</option>
            <option value="space">Space</option>
            <option value="tech">Tech</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
            onClick={useHint}
            disabled={hints <= 0 || !gameStarted || gameOver}
          >
            Hint ({hints})
          </button>
          <button
            className="px-3 py-1 bg-purple-500 text-white rounded disabled:bg-gray-300"
            onClick={usePeek}
            disabled={peeks <= 0 || !gameStarted || gameOver}
          >
            Peek ({peeks})
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={initializeGame}
          >
            {gameStarted ? "Restart" : "Start"} Game
          </button>
        </div>
      </div>

      {/* Card grid */}
      <div
        className={`grid gap-2 w-full ${
          difficulty === "easy"
            ? "grid-cols-4"
            : difficulty === "medium"
            ? "grid-cols-4 md:grid-cols-6"
            : "grid-cols-3 md:grid-cols-6"
        }`}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square bg-gray-200 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-300 ${
              card.flipped ? "rotate-y-180" : ""
            } ${card.matched ? "bg-green-200" : ""}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.flipped || card.matched ? (
              <div className="text-center">
                {/* In a real app, you would use an actual image here */}
                {card.imageUrl}
              </div>
            ) : (
              <div className="text-4xl">?</div>
            )}
          </div>
        ))}
      </div>

      {/* Game over modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
            <p className="mb-2">Time: {formatTime(timer)}</p>
            <p className="mb-2">Total Moves: {moves}</p>
            <p className="mb-4">Difficulty: {difficulty}</p>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={initializeGame}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
