import { useState, useEffect } from "react";

import bundler from "../../bundler";

import CodeEditor from "../code-editor/code-editor.component";
import CodePreview from "../code-preview/code-preview.component";
import Resizable from "../resizable/resizable.component";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [error , setError] = useState("");
  // output from esbuild
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    setTimeout(async () => {
      const output = await bundler(input);
      setCode(output?.code as string);
      setError(output?.err as string);
    }, 1000);
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={`const helloWorld = 'Hello World';`}
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <CodePreview code={code} bundlingStatus={error}/>
      </div>
    </Resizable>
  );
};

export default CodeCell;
