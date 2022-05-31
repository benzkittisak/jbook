import { ResizableBox, ResizableBoxProps } from "react-resizable";

import "./resizable.style.scss";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: React.ReactElement<any>;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;

  if (direction === "horizontal") {
    resizableProps = {
      className:'resize-horizonral',
      width: window.innerWidth * 0.75,
      height: Infinity,
      resizeHandles: ["e"],
      maxConstraints: [window.innerWidth * 0.75,Infinity],
      minConstraints: [window.innerWidth * 0.2, Infinity],
    };
  } else {
    resizableProps = {
      width: Infinity,
      height: 300,
      resizeHandles: ["s"],
      maxConstraints: [Infinity, window.innerHeight * 0.9],
      minConstraints: [Infinity, window.innerWidth * 0.1],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
