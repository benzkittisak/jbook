import { ResizableBox } from "react-resizable";

import './resizable.style.scss';

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: React.ReactElement<any>;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox width={Infinity} height={300} resizeHandles={["s"]}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
