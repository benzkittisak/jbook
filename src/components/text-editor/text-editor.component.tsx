import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

import { Cell } from "../../redux";
import { useActions } from "../../hooks";

import "./text-editor.style.scss";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditting] = useState(false);

  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditting(false);
    };

    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div className="text-editor" ref={ref}>
        <MDEditor value={cell.content} onChange={(v) => updateCell(cell.id , v || "")} />
      </div>
    );
  }

  return (
    <div className="text-editor" onClick={() => setEditting(true)}>
      <MDEditor.Markdown source={cell.content || '# Click to Edit'} />
    </div>
  );
};

export default TextEditor;
