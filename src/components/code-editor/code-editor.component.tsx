import MonacoEditor , {OnMount} from "@monaco-editor/react";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  // getValue() = function ที่ return string
  const onEditorDidMount:OnMount = (editor) => {
    // console.log(editor);
    // console.log(monaco.editor.);
    editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
    })
    
    editor.getModel()?.updateOptions({tabSize:2})
  };

  return (
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
  );
};

export default CodeEditor;
