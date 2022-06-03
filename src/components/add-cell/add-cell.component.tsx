import React from "react";

import { useActions } from "../../hooks";

import "./add-cell.style.scss";

interface AddCellProps {
  nextCellId: string | null;
  forceVisible?:boolean;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId , forceVisible }) => {
  const { insertCellAfter } = useActions();
  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className="add-cell-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(nextCellId, "code")}
        >
          <span className="icon is-small">
              <i className="fa-solid fa-plus"></i>
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(nextCellId, "text")}
        >
          <span className="icon is-small">
              <i className="fa-solid fa-plus"></i>
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
