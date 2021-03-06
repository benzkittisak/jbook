import { useEffect } from "react";

// import bundler from "../../bundler";

import CodeEditor from "../code-editor/code-editor.component";
import CodePreview from "../code-preview/code-preview.component";
import Resizable from "../resizable/resizable.component";
import ProgressBar from "../progress/progress-bar.component";

import { Cell } from "../../redux";
import { useTypedSelector , useActions , useCumulativeCode } from "../../hooks";

import "./code-cell.style.scss";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();

  // const [input, setInput] = useState("");
  // const [error, setError] = useState("");
  // // // output from esbuild
  // const [code, setCode] = useState<string>("");

  // Use Redux
  const bundle = useTypedSelector(
    (state) => state.bundles && state.bundles[cell.id]
  );

  const cumulativeCode = useCumulativeCode(cell.id);
  // console.log(bundle);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      // const output = await bundler(cell.content);
      // setCode(output?.code as string);
      // setError(output?.err as string);

      // Use Redux
      createBundle(cell.id, cumulativeCode);
    }, 750);

    return () => {
      clearTimeout(timer);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <ProgressBar />
          ) : (
            <CodePreview
              code={bundle.code && bundle.code}
              bundlingStatus={bundle.err}
            />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
