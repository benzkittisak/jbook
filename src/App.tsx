import React, { useState } from "react";

const App: React.FC = () => {
  const [input, setInput] = useState("");

  // output from esbuild
  const [code, setCode] = useState("");

  const onClick = () => {
    console.log(input);
  };

  return (
    <>
      <textarea value={input} cols={80} rows={20} onChange={(e) => setInput(e.target.value)}>
        {input}
      </textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
    </>
  );
};

export default App;
