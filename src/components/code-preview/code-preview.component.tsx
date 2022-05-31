import { useRef, useEffect } from "react";

interface CodePreviewProps {
  code: string;
}

const html = `
  <html>
        <head></head>
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
    <iframe
      title="Code Preview"
      ref={iframe}
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
};

export default CodePreview;
