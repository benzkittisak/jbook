import { useState } from "react";

import bundler from "../../bundler";

import CodeEditor from "../code-editor/code-editor.component";
import CodePreview from "../code-preview/code-preview.component";
import Resizable from "../resizable/resizable.component";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");

  // output from esbuild
  const [code, setCode] = useState("");

  const onClick = async () => {
    const output = await bundler(input);
    setCode(output);
  };

  return (
    <Resizable direction="vertical">
      <div style={{height:'100%' , display: 'flex' , flexDirection:'row'}}>
        <CodeEditor
          initialValue={`const helloWorld = 'Hello World';`}
          onChange={(value) => setInput(value)}
        />
        {/* <div>
          <button type="button" onClick={onClick}>
            Submit
          </button>
        </div> */}
        <CodePreview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
