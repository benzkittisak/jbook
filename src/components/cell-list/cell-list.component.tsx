import React from "react";

import { useTypedSelector } from "../../hooks/use-typed-selector";

import CellListItem from "../cell-list-item/cell-list-item.component";

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) =>
    cells?.order.map((id: string) => cells?.data[id])
  );

  const renderedCells = cells?.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
