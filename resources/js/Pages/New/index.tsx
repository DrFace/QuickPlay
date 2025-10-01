// pages/index.jsx (Next.js) or App.jsx (React)
import React from "react";

function HomePage() {
    const name = "QuickPlay";

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to {name}</h1>
            <p>This is a simple React JSX example.</p>
            <button onClick={() => alert("Button clicked!")}>Click Me</button>
        </div>
    );
}

export default HomePage;
