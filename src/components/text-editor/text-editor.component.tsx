import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";

import "./text-editor.style.scss";

const TextEditor: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("# Hello World");
  const [editing, setEditting] = useState(false);

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
        <MDEditor value={value} onChange={(v) => setValue(v || '')}/>
      </div>
    );
  }

  return (
    <div className="text-editor" onClick={() => setEditting(true)}>
      <MDEditor.Markdown source={value} />
    </div>
  );
};

export default TextEditor;
