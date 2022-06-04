import React, { Fragment } from "react";

import { useTypedSelector } from "../../hooks/use-typed-selector";

import CellListItem from "../cell-list-item/cell-list-item.component";
import AddCell from "../add-cell/add-cell.component";

import './cell-list.style.scss';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) =>
    cells?.order.map((id: string) => cells?.data[id])
  );

  const renderedCells = cells?.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell previousCellId={null} forceVisible={cells?.length === 0} />
      {renderedCells}
    </div>
  );
};

export default CellList;
