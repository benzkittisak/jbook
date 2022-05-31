import { useRef, useEffect } from "react";

import "./code-preview.style.scss";

interface CodePreviewProps {
  code: string;
}

const html = `
  <html>
        <head>
          <style>
            html {background-color:white;}
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script>
            window.addEventListener('message', (event) => {
              try{
                eval(event.data);
              }catch(error){
                const root = document.querySelector('#root');
                root.innerHTML = '<div style="color:red;"><h4>Rumtime Error!</h4>' + error + '</div>';
                console.error(error);
              }
            } , false)
          </script>
        </body>
  </html>
  `;

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    // ส่ง code ไปที่ iframe
    iframe.current.contentWindow.postMessage(code, "*");
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Code Preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
};

export default CodePreview;
