import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")  // calling backend
      .then(res => res.json())
      .then(data => setData(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Frontend Running ✅</h1>
      <p>{data ? data : "Waiting for backend..."}</p>
    </div>
  );
}

export default App;

