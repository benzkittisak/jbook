import { useEffect } from "react";

// import bundler from "../../bundler";

import CodeEditor from "../code-editor/code-editor.component";
import CodePreview from "../code-preview/code-preview.component";
import Resizable from "../resizable/resizable.component";

import { Cell } from "../../redux";
import { useActions } from "../../hooks/use-actions";
import { useTypedSelector } from '../../hooks';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell , createBundle } = useActions();

  // const [input, setInput] = useState("");
  // const [error, setError] = useState("");
  // // // output from esbuild
  // const [code, setCode] = useState<string>("");

  // Use Redux
  const bundle = useTypedSelector((state) => state.bundles && state.bundles[cell.id]);
  // console.log(bundle);
  

  useEffect(() => {
     const timer =  setTimeout(async () => {
      // const output = await bundler(cell.content);
      // setCode(output?.code as string);
      // setError(output?.err as string);

      // Use Redux
      createBundle(cell.id , cell.content);
      console.log(123);
      
    }, 750);

    return () => {
      clearTimeout(timer);
    }
  }, [cell.content , cell.id , createBundle]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: "calc(100% - 10px)", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id , value)}
          />
        </Resizable>
      {bundle && <CodePreview code={bundle.code && bundle.code} bundlingStatus={bundle.err} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;
