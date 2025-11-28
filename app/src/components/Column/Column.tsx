import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Column as ColumnType, Task } from "../../types";
import "./Column.css";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  index: number;
  onDelete: (columnId: string, columnTitle: string) => void;
}

export const Column = ({ column, tasks, index, onDelete }: ColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

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
        }),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        canDrop: ({ source }) => {
          return (
            source.data.type === "column" && source.data.columnId !== column.id
          );
        },
      })
    );
  }, [column.id, index]);

  return (
    <div
      ref={columnRef}
      className={`column ${isDragging ? "column-dragging" : ""} ${
        isDraggedOver ? "column-drag-over" : ""
      }`}
    >
      <div className="column-header">
        <div className="column-header-left">
          <div className="column-drag-handle" title="Drag to reorder">
            ⋮⋮
          </div>
          <h2 className="column-title">{column.title}</h2>
          <span className="badge badge-primary">{tasks.length}</span>
        </div>
        <button
          onClick={() => onDelete(column.id, column.title)}
          className="btn btn-danger"
          title="Delete column"
        >
          ✕
        </button>
      </div>

      <div className="column-tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task">
            <input
              type="checkbox"
              checked={task.completed}
              readOnly
              className="checkbox"
            />
            <span
              className={`task-text ${task.completed ? "task-completed" : ""}`}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>

      <button className="btn btn-dashed w-full">+ Add Task</button>
    </div>
  );
};
