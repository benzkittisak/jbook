import React, { useEffect, useRef, useState } from "react";
import * as esbuild from "esbuild-wasm";
import 'bulmaswatch/superhero/bulmaswatch.min.css';

import { unpkgPathPlugin } from "./plugins/unpkg.plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor/code-editor.component";

const App: React.FC = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
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
    iframe.current.srcdoc = html;
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

    // setCode(result.outputFiles[0].text);
    // ส่ง code ไปที่ iframe
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
  <html>
        <head></head>
        <body>
          <div id="root"></div>
          <script>
            window.addEventListener('message', (event) => {
              try{
                eval(event.data);
              }catch(error){
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color:red;"><h4>Rumtime Error!</h4>' + error + '</div>';
                console.error(error);
              }
            } , false)
          </script>
        </body>
  </html>
  `;

  return (
    <>
      <CodeEditor
        initialValue="const helloWorld = 'Hello World';"
        onChange={(value) => setInput(value)}
      />
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
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        title="preview code"
        src="/preview.html"
        frameBorder="1"
      ></iframe>
    </>
  );
};

export default App;
