import {useState } from "react";
import "bulmaswatch/superhero/bulmaswatch.min.css";

import bundler from "./bundler";

import CodeEditor from "./components/code-editor/code-editor.component";
import CodePreview from "./components/code-preview/code-preview.component";

const App: React.FC = () => {
  const [input, setInput] = useState("");

  // output from esbuild
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundler(input);
    setCode(output);
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
