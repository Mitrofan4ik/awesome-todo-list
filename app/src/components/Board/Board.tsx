import React from "react";
import "./Board.css";

export const Board: React.FC = () => {
  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title">Awesome Board</h1>
        <button className="btn btn-primary">+ Add Column</button>
      </header>

      <div className="board-columns custom-scrollbar">
        <div className="column">
          <div className="column-header">
            <h2 className="column-title">Title</h2>
            <span className="badge badge-primary">0</span>
          </div>

          <div className="column-tasks">
            <div className="task">
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="checkbox"
              />
              <span
                className={`task-text ${
                  true ? "task-completed" : ""
                }`}
              >
                Title
              </span>
            </div>
          </div>

          <button className="btn btn-dashed w-full">+ Add Task</button>
        </div>
      </div>
    </div>
  );
};
