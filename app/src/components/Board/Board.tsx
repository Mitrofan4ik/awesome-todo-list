import { useState } from "react";
import { useTodoStore } from "../../hooks/useTodoStore";
import { CreateColumnForm } from "../CreateColumnForm/CreateColumnForm";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import "./Board.css";

export const Board = () => {
  const { state, addColumn, deleteColumn } = useTodoStore();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleAddColumn = (title: string) => {
    addColumn(title);
    setIsAddingColumn(false);
  };

  const handleDeleteClick = (columnId: string, columnTitle: string) => {
    setColumnToDelete({ id: columnId, title: columnTitle });
  };

  const handleConfirmDelete = () => {
    if (columnToDelete) {
      deleteColumn(columnToDelete.id);
      setColumnToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setColumnToDelete(null);
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title">Awesome Board</h1>
        <button
          onClick={() => setIsAddingColumn(true)}
          className="btn btn-primary"
        >
          + Add Column
        </button>
      </header>

      <div className="board-columns custom-scrollbar">
        {state.columns.map((column) => {
          const columnTasks = state.tasks.filter(
            (t) => t.columnId === column.id
          );

          return (
            <div key={column.id} className="column">
              <div className="column-header">
                <div className="column-header-left">
                  <h2 className="column-title">{column.title}</h2>
                  <span className="badge badge-primary">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteClick(column.id, column.title)}
                  className="btn btn-danger"
                  title="Delete column"
                >
                  ✕
                </button>
              </div>

              <div className="column-tasks">
                {columnTasks.map((task) => (
                  <div key={task.id} className="task">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="checkbox"
                    />
                    <span
                      className={`task-text ${
                        task.completed ? "task-completed" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              <button className="btn btn-dashed w-full">+ Add Task</button>
            </div>
          );
        })}
      </div>

      {isAddingColumn && (
        <CreateColumnForm
          onSubmit={handleAddColumn}
          onCancel={() => setIsAddingColumn(false)}
        />
      )}

      {columnToDelete && (
        <ConfirmModal
          title="Delete Column"
          message={`Are you sure you want to delete "${columnToDelete.title}"? All tasks in this column will be permanently deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          status="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};
