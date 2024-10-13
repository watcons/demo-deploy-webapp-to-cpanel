import React, { useCallback } from "react";

const App = () => {
  const [rolls, setRolls] = React.useState<number[]>([]);

  const roll = useCallback(async () => {
    const newRollsResponse = await fetch("/api/roll", { method: "POST" });
    const newRolls = await newRollsResponse.json();

    setRolls(newRolls);
  }, []);

  return (
    <div>
      <button onClick={roll}>Roll</button>
      <ul>
        {rolls.map((roll, index) => (
          <li key={index}>{roll}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
