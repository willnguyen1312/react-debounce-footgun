import { useEffect, useRef, useState } from "react";

type DebounceFunction = () => void;

function App() {
  const [value, setValue] = useState<number>();
  const [error, setError] = useState<string>();
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const debounceRef = useRef<DebounceFunction>();
  const abortControllerRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    return () => {
      // This is optional, it's up to specific use case to decide if it's necessary to abort the ongoing request
      // when the component is unmounted.
      abortControllerRef.current.abort();
    };
  }, []);

  const fetchNumber = async () => {
    setState("loading");
    const response = await fetch("/api/number", {
      signal: abortControllerRef.current.signal,
    });

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
        // We need to abort the previous request to increase the throughput of user's network
        // and let the server know that the previous request is no longer needed
        abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchNumber, 250);
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
