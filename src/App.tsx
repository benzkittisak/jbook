import React, { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import "bulmaswatch/superhero/bulmaswatch.min.css";

import { unpkgPathPlugin } from "./plugins/unpkg.plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

import CodeEditor from "./components/code-editor/code-editor.component";
import CodePreview from "./components/code-preview/code-preview.component";

const App: React.FC = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState("");

  // output from esbuild
  const [code, setCode] = useState("");

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.57/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
        
    if (!ref.current) return;
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    setCode(result.outputFiles[0].text);

  };

  return (
    <>
      <CodeEditor
        initialValue={`const helloWorld = 'Hello World';`}
        onChange={(value) => setInput(value)}
      />
      <div>
        <button type="button" onClick={onClick}>
          Submit
        </button>
      </div>
      <CodePreview code={code} />
    </>
  );
};

export default App;
