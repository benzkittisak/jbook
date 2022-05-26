import React, { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";

const App: React.FC = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");

  // output from esbuild
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) return;
    const result = await ref.current.transform(input, {
      loader: "jsx",
      target: "es2015",
    });

    setCode(result.code);
  };

  return (
    <>
      <textarea
        value={input}
        cols={80}
        rows={20}
        onChange={(e) => setInput(e.target.value)}
      >
        {input}
      </textarea>
      <div>
        <button type="button" onClick={onClick}>
          Submit
        </button>
      </div>
      <pre ref={ref}>{code}</pre>
    </>
  );
};

export default App;
