import { useRef, useState } from "react";

type DebounceFunction = () => void;

function App() {
  const [value, setValue] = useState<number>();
  const [error, setError] = useState<string>();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const debounceRef = useRef<DebounceFunction>();

  const fetchNumber = async () => {
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

  if (!debounceRef.current) {
    debounceRef.current = (() => {
      let timeoutId: number;

      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchNumber, 1000);
      };
    })();
  }

  return (
    <>
      <h1>React Debounce Footgun 🔫</h1>
      <button
        onClick={() => {
          if (debounceRef.current) {
            debounceRef.current();
          }
        }}
      >
        Get number from API
      </button>

      <p>Last value: {value ? value : "N/A"}</p>

      {state === "loading" && <p>Loading</p>}

      {state === "error" && <p>Error: {error}</p>}
    </>
  );
}

export default App;
