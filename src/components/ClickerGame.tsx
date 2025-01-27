"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClickerGame = () => {
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [autoClickerCount, setAutoClickerCount] = useState(0);

  // Auto clicker effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        setScore((prev) => prev + autoClickerCount * multiplier);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickerCount, multiplier]);

  const handleClick = () => {
    setScore((prev) => prev + multiplier);
  };

  const buyMultiplier = () => {
    const cost = multiplier * 10;
    if (score >= cost) {
      setScore((prev) => prev - cost);
      setMultiplier((prev) => prev + 1);
    }
  };

  const buyAutoClicker = () => {
    const cost = (autoClickerCount + 1) * 50;
    if (score >= cost) {
      setScore((prev) => prev - cost);
      setAutoClickerCount((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Clicker Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">{Math.floor(score)}</p>
              <p className="text-gray-600">Points</p>
            </div>

            <button
              onClick={handleClick}
              className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Click! (+{multiplier})
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={buyMultiplier}
                disabled={score < multiplier * 10}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Multiplier
                <br />
                Cost: {multiplier * 10}
              </button>

              <button
                onClick={buyAutoClicker}
                disabled={score < (autoClickerCount + 1) * 50}
                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Auto Clicker
                <br />
                Cost: {(autoClickerCount + 1) * 50}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              <p>Multiplier: x{multiplier}</p>
              <p>Auto Clickers: {autoClickerCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClickerGame;
