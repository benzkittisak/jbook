import React, { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg.plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

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

  const html = `
  <html>
        <head></head>
        <body>
          <div id="root"></div>
          <script>
            window.addEventListener('message', (event) => {
              console.log(event.data);
            } , false)
          </script>
        </body>
  </html>
  `;

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
      <iframe
        sandbox="allow-scripts"
        srcDoc={html}
        title="preview code"
        src="/test.html"
        frameBorder="1"
      ></iframe>
    </>
  );
};

export default App;
