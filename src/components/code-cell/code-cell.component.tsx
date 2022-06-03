import { useState, useEffect } from "react";

import bundler from "../../bundler";

import CodeEditor from "../code-editor/code-editor.component";
import CodePreview from "../code-preview/code-preview.component";
import Resizable from "../resizable/resizable.component";

import { Cell } from "../../redux";
import { useActions } from "../../hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();
  // const [input, setInput] = useState("");
  const [error, setError] = useState("");
  // // output from esbuild
  const [code, setCode] = useState<string>("");

  useEffect(() => {
     const timer =  setTimeout(async () => {
      const output = await bundler(cell.content);
      setCode(output?.code as string);
      setError(output?.err as string);
    }, 750);

    return () => {
      clearTimeout(timer);
    }
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "calc(100% - 10px)", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id , value)}
          />
        </Resizable>
        <CodePreview code={code} bundlingStatus={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
