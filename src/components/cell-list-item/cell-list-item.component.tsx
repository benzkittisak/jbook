import { Cell } from "../../redux";
import CodeCell from "../code-cell/code-cell.component";
import TextEditor from "../text-editor/text-editor.component";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
    let child:JSX.Element;

    if(cell.type === 'code') child = <CodeCell cell={cell}/>
    else child = <TextEditor cell={cell}/>

    return (<div>{child}</div>);
};

export default CellListItem;
