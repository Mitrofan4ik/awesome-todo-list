import { useState } from "react";
import { useTodoStore } from "../../hooks/useTodoStore";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { CreateColumnForm } from "../CreateColumnForm/CreateColumnForm";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { Column } from "../Column/Column";
import "./Board.css";

export const Board = () => {
  const { state, addColumn, deleteColumn, updateColumns, updateTasks } =
    useTodoStore();
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Setup drag and drop with pragmatic-drag-and-drop
  useDragAndDrop({
    columns: state.columns,
    tasks: state.tasks,
    updateColumns,
    updateTasks,
  });

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
        {state.columns.map((column, index) => {
          const columnTasks = state.tasks.filter(
            (t) => t.columnId === column.id
          );

          return (
            <Column
              key={column.id}
              column={column}
              tasks={columnTasks}
              index={index}
              onDelete={handleDeleteClick}
            />
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
