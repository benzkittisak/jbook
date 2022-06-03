import React from "react";

import { useActions } from "../../hooks";

import './action-bar.style.scss'

interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">
      <button className="button is-primary is-small" onClick={() => moveCell(id , 'up')}>
        <span className="icon">
          <i className="fa-solid fa-arrow-up"></i>
        </span>
      </button>
      <button className="button is-primary is-small" onClick={() => moveCell(id , 'down')}>
      <span className="icon">
          <i className="fa-solid fa-arrow-down"></i>
        </span>
      </button>
      <button className="button is-primary is-small" onClick={() => deleteCell(id)}>
      <span className="icon">
          <i className="fa-solid fa-times"></i>
        </span>
      </button>
    </div>
  );
};

export default ActionBar;
