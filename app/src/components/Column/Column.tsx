import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Column as ColumnType, Task as TaskType } from "../../types";
import { Task } from "../Task/Task";
import "./Column.css";
import { GripVerticalIcon, PlusIcon, XIcon } from "../Icons/Icons";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  selectedTaskIds: string[];
  index: number;
  onDelete: (columnId: string, columnTitle: string) => void;
  onAddTask: (columnId: string) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onToggleTaskSelect: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectAllTasks: (columnId: string) => void;
}

export const Column = ({
  column,
  tasks,
  selectedTaskIds = [],
  index,
  onDelete,
  onAddTask,
  onToggleTaskComplete,
  onToggleTaskSelect,
  onDeleteTask,
  onSelectAllTasks,
}: ColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const columnTasks = tasks?.filter((t) => t.columnId === column.id) ?? [];

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
          <span className="badge badge-primary ml-2">{columnTasks.length}</span>
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
        {columnTasks.map((task, taskIndex) => (
          <Task
            key={task.id}
            task={task}
            index={taskIndex}
            isSelected={selectedTaskIds.includes(task.id)}
            onToggleComplete={onToggleTaskComplete}
            onToggleSelect={onToggleTaskSelect}
            onDelete={onDeleteTask}
          />
        ))}
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
