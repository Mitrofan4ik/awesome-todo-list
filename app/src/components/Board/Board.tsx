import { useState } from "react";
import { useTodoStore } from "../../hooks/useTodoStore";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { CreateColumnForm } from "../CreateColumnForm/CreateColumnForm";
import { TaskForm } from "../TaskForm/TaskForm";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { Column } from "../Column/Column";
import "./Board.css";
import { SearchBar } from "../SearchBar/SearchBar";
import { PlusIcon } from "../Icons/Icons";

export const Board = () => {
  const {
    state,
    addColumn,
    deleteColumn,
    updateColumns,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTasks,
    toggleTaskSelection,
    selectAllTasksInColumn,
    clearTaskSelection,
    deleteSelectedTasks,
    markSelectedAsComplete,
    markSelectedAsIncomplete,
    moveSelectedTasksToColumn,
    updateTaskTitle,
    setSearchQuery,
  } = useTodoStore();

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [addingTaskToColumn, setAddingTaskToColumn] = useState<string | null>(
    null
  );
  const [columnToDelete, setColumnToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Setup drag and drop
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

  const handleDeleteColumnClick = (columnId: string, columnTitle: string) => {
    setColumnToDelete({ id: columnId, title: columnTitle });
  };

  const handleConfirmDeleteColumn = () => {
    if (columnToDelete) {
      deleteColumn(columnToDelete.id);
      setColumnToDelete(null);
    }
  };

  const handleCancelDeleteColumn = () => {
    setColumnToDelete(null);
  };

  const handleAddTaskClick = (columnId: string) => {
    setAddingTaskToColumn(columnId);
  };

  const handleAddTask = (title: string) => {
    if (addingTaskToColumn) {
      addTask(title, addingTaskToColumn);
      setAddingTaskToColumn(null);
    }
  };

  const handleCancelAddTask = () => {
    setAddingTaskToColumn(null);
  };

  const hasSelectedTasks = state?.selectedTaskIds?.length > 0;

  if (!state) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title">Awesome Board</h1>
        <div className="board-header-actions">
          <SearchBar value={state.searchQuery} onChange={setSearchQuery} />
          <button
            onClick={() => setIsAddingColumn(true)}
            className="btn btn-primary"
          >
            <PlusIcon size={16} />
            <span className="ml-2">Add Column</span>
          </button>
        </div>
      </header>

      {hasSelectedTasks && (
        <div className="board-actions">
          <div className="board-actions-info">
            <span className="board-actions-count">
              {state.selectedTaskIds.length} task
              {state.selectedTaskIds.length !== 1 ? "s" : ""} selected
            </span>
            <button onClick={clearTaskSelection} className="btn-text">
              Clear selection
            </button>
          </div>

          <div className="board-actions-buttons">
            <button
              onClick={markSelectedAsComplete}
              className="btn btn-secondary"
            >
              Complete
            </button>
            <button
              onClick={markSelectedAsIncomplete}
              className="btn btn-secondary"
            >
              Incomplete
            </button>

            {state.columns.length > 1 && (
              <select
                id="move-tasks-select-id"
                className="select"
                onChange={(e) => {
                  if (e.target.value) {
                    moveSelectedTasksToColumn(e.target.value);
                  }
                }}
                value=""
              >
                <option value="">Move to...</option>
                {state.columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            )}

            <button onClick={deleteSelectedTasks} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="board-columns custom-scrollbar">
        {state.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            tasks={state.tasks}
            selectedTaskIds={state.selectedTaskIds}
            searchQuery={state.searchQuery}
            index={index}
            onDelete={handleDeleteColumnClick}
            onAddTask={handleAddTaskClick}
            onToggleTaskComplete={toggleTaskComplete}
            onToggleTaskSelect={toggleTaskSelection}
            onDeleteTask={deleteTask}
            onUpdateTaskTitle={updateTaskTitle}
            onSelectAllTasks={selectAllTasksInColumn}
          />
        ))}
      </div>

      {isAddingColumn && (
        <CreateColumnForm
          onSubmit={handleAddColumn}
          onCancel={() => setIsAddingColumn(false)}
        />
      )}

      {addingTaskToColumn && (
        <TaskForm onSubmit={handleAddTask} onCancel={handleCancelAddTask} />
      )}

      {columnToDelete && (
        <ConfirmModal
          title="Delete Column"
          message={`Are you sure you want to delete "${columnToDelete.title}"? All tasks in this column will be permanently deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          status="danger"
          onConfirm={handleConfirmDeleteColumn}
          onCancel={handleCancelDeleteColumn}
        />
      )}
    </div>
  );
};
