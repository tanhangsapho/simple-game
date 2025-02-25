"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GameInfo } from "@/lib/type";

const GameLauncher: React.FC = () => {
  const router = useRouter();
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const games: GameInfo[] = [
    {
      id: "clicker",
      title: "Clicker",
      description:
        "Click your way to riches in this addictive idle clicker game. Upgrade your clicks, earn passive income, and become a clicking tycoon!",
      thumbnail: "/images/clicker-thumbnail.jpg",
      path: "/game/clicker",
      tags: ["Idle", "Progression", "Economy"],
    },
    {
      id: "memory",
      title: "Memory Match",
      description:
        "Test your memory skills with this challenging card matching game. Multiple difficulty levels, power-ups, and special themes await!",
      thumbnail: "/images/memory-thumbnail.jpg",
      path: "/game/memory",
      tags: ["Puzzle", "Memory", "Cards"],
    },
  ];

  const handleGameSelect = (game: GameInfo) => {
    setSelectedGameId(game.id);
  };

  const launchGame = (game: GameInfo) => {
    router.push(game.path);

    // If using component-based approach instead of routing:
    // setActiveGame(game.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Game Center</h1>
        <p className="text-center text-gray-400">Choose a game to play</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div
            key={game.id}
            className={`
              bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 
              hover:transform hover:scale-105 cursor-pointer border-2
              ${
                selectedGameId === game.id
                  ? "border-blue-500"
                  : "border-transparent"
              }
            `}
            onClick={() => handleGameSelect(game)}
          >
            {/* Game thumbnail */}
            <div className="aspect-video bg-gray-700 relative">
              {/* In a real app, use an actual image here */}
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                {game.title}
              </div>

              {/* Optional: Show "last played" indicator */}
              {game.lastPlayed && (
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-xs px-2 py-1 rounded">
                  Last played: {game.lastPlayed.toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Game info */}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{game.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Play button */}
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition-colors"
                onClick={() => launchGame(game)}
              >
                Play Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameLauncher;
