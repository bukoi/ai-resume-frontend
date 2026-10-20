import { useEffect, useState } from "react";
import "./App.css";
import { API_URL } from "../config/api";

type Health = { status: string; db: string };

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/health`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json() as Promise<Health>;
      })
      .then(setHealth)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <h1>namaste everyone</h1>
      {error && <p>Backend error: {error}</p>}
      {!error && !health && <p>Checking backend...</p>}
      {health && (
        <p>
          API: {health.status}, database: {health.db}
        </p>
      )}
    </>
  );
}

export default App;