import { useRef } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {

    const editorRef = useRef<any>();

  // getValue() = function ที่ return string
  const onEditorDidMount: OnMount = (editor) => {
    // console.log(editor);
    // console.log(monaco.editor.);
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    editor.getModel()?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
      // get current value from editor
        const unformatted = editorRef.current.getValue();
      // format that value
        const formatted =  prettier.format(unformatted , {
            parser:'babel',
            plugins:[parser],
            useTabs:false,
            semi:true,
            singleQuote:true
        })
        
      // set the formatred value back in the editor
        editorRef.current.setValue(formatted);
  }

  return (
    <>
      <button onClick={onFormatClick}>Format</button>
      <MonacoEditor
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        height="500px"
        language="javascript"
        value={initialValue}
        onMount={onEditorDidMount}
      />
    </>
  );
};

export default CodeEditor;
