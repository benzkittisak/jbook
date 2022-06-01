import { useRef, useEffect } from "react";

import "./code-preview.style.scss";

interface CodePreviewProps {
  code: string;
  bundlingStatus?:string;
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
            const handleError = error => {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color:red;"><h4>Rumtime Error!</h4>' + error + '</div>';
              console.error(error);
            }

            window.addEventListener('error' , event=>{
              event.preventDefault();
             handleError(event.error);
            });


            window.addEventListener('message', (event) => {
              try{
                eval(event.data);
              }catch(error){
                handleError(error);
              }
            } , false)
          </script>
        </body>
  </html>
  `;

const CodePreview: React.FC<CodePreviewProps> = ({ code , bundlingStatus }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    // ส่ง code ไปที่ iframe

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 100);
  }, [code]);  

  return (
    <div className="preview-wrapper">
      <iframe
        title="Code Preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
    </div>
  );
};

export default CodePreview;
