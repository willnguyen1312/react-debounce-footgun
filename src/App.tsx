import { useState } from "react";

function App() {
  const [value, setValue] = useState<number>();
  const [error, setError] = useState<string>();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const handleClick = async () => {
    setState("loading");
    const response = await fetch("/api/number");

    if (response.ok) {
      const { data } = await response.json();
      setValue(data.number);
      setState("success");
      return;
    }

    setError("Failed to fetch next number");
    setState("error");
  };

  return (
    <>
      <h1>React Debounce Footgun 🔫</h1>
      <button onClick={handleClick}>Get number from API</button>

      <p>Last value: {value ? value : "N/A"}</p>

      {state === "loading" && <p>Loading</p>}

      {state === "error" && <p>Error: {error}</p>}
    </>
  );
}

export default App;
