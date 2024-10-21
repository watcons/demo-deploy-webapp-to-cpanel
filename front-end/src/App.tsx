import React, { useCallback, useEffect } from "react";

type Roll = {
  rollResult: number;
  id: number;
  createdAt: string;
};

const App = () => {
  const [rolls, setRolls] = React.useState<Roll[]>([]);

  const roll = useCallback(async () => {
    const newRollsResponse = await fetch("/api/roll", { method: "POST" });
    const newRolls = await newRollsResponse.json();

    setRolls(newRolls);
  }, []);

  useEffect(() => {
    const getRolls = async () => {
      const rollsResponse = await fetch("/api", { method: "GET" });
      const rolls = await rollsResponse.json();

      setRolls(rolls);
    };

    getRolls();
  }, []);

  return (
    <div>
      <button onClick={roll}>Roll</button>
      <ul>
        {rolls.map((roll, index) => (
          <li key={index}>
            {roll.rollResult} - ID: {roll.id} - Created At: {roll.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
