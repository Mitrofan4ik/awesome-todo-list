import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Column as ColumnType, Task as TaskType } from "../../types";
import { Task } from "../Task/Task";
import { useTaskSearch } from "../../hooks/useTaskSearch";
import "./Column.css";
import { GripVerticalIcon, PlusIcon, XIcon } from "../Icons/Icons";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  selectedTaskIds: string[];
  searchQuery: string;
  index: number;
  filterStatus: "all" | "completed" | "incomplete";
  onDelete: (columnId: string, columnTitle: string) => void;
  onAddTask: (columnId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onToggleTaskSelect: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectAllTasks: (columnId: string) => void;
  onUpdateTaskTitle: (taskId: string, title: string) => void;
}

export const Column = ({
  column,
  tasks,
  selectedTaskIds = [],
  searchQuery,
  index,
  filterStatus = "all",
  onDelete,
  onAddTask,
  onToggleTaskComplete,
  onToggleTaskSelect,
  onDeleteTask,
  onSelectAllTasks,
  onUpdateTaskTitle,
}: ColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const allColumnTasks = tasks?.filter((t) => t.columnId === column.id) ?? [];
  const showingFiltered = searchQuery || filterStatus !== "all";

  const { filteredTasks: columnTasks } = useTaskSearch({
    tasks: allColumnTasks,
    searchQuery,
    filterStatus,
  });

  useEffect(() => {
    const element = columnRef.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({
          type: "column",
          columnId: column.id,
          index,
        }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        getData: () => ({
          type: "column",
          columnId: column.id,
          index,
          taskCount: columnTasks.length,
        }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        canDrop: ({ source }) => {
          if (source.data.type === "column") {
            return source.data.columnId !== column.id;
          }
          if (source.data.type === "task") {
            return source.data.columnId !== column.id;
          }
          return false;
        },
      })
    );
  }, [column.id, index, columnTasks.length]);

  const selectedInColumn = columnTasks.filter((t) =>
    selectedTaskIds.includes(t.id)
  );
  const allSelectedInColumn =
    columnTasks.length > 0 && selectedInColumn.length === columnTasks.length;

  return (
    <div
      ref={columnRef}
      className={`column ${isDragging ? "column-dragging" : ""} ${
        isDraggedOver ? "column-drag-over" : ""
      }`}
    >
      <div className="column-header">
        <div className="column-header-left">
          <div className="column-drag-handle">
            <GripVerticalIcon size={18} />
          </div>
          <h2 className="column-title">{column.title}</h2>
          <span className="badge badge-primary ml-2">
            {searchQuery
              ? `${columnTasks.length}/${allColumnTasks.length}`
              : allColumnTasks.length}
          </span>
        </div>
        <div className="column-header-actions">
          {columnTasks.length > 0 && (
            <button
              onClick={() => onSelectAllTasks(column.id)}
              className="btn-icon"
            >
              <input
                id={`select-all-${column.id}`}
                type="checkbox"
                checked={allSelectedInColumn}
                onChange={() => {}}
                readOnly
                className="checkbox"
              />
            </button>
          )}
          <button
            onClick={() => onDelete(column.id, column.title)}
            className="btn btn-danger"
          >
            <XIcon size={18} />
          </button>
        </div>
      </div>

      <div className="column-tasks">
        {columnTasks.length === 0 && showingFiltered ? (
          <div className="column-empty-state">No tasks match</div>
        ) : (
          columnTasks.map((task, taskIndex) => (
            <Task
              key={task.id}
              task={task}
              index={taskIndex}
              isSelected={selectedTaskIds.includes(task.id)}
              searchQuery={searchQuery}
              onToggleComplete={onToggleTaskComplete}
              onToggleSelect={onToggleTaskSelect}
              onDelete={onDeleteTask}
              onUpdateTitle={onUpdateTaskTitle}
            />
          ))
        )}
      </div>

      <button
        onClick={() => onAddTask(column.id)}
        className="btn btn-dashed w-full"
      >
        <PlusIcon size={16} />
        <span className="ml-2">Add Task</span>
      </button>
    </div>
  );
};
