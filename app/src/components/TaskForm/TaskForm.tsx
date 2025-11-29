import { useState, FormEvent, ChangeEvent } from "react";
import "./TaskForm.css";
import { TASK } from "../../constants/task";
import { BUTTON_TEXT } from "../../constants/common";

interface TaskFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim()) {
      onSubmit(title.trim());
      setTitle("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="task-form-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="task-form-title">{TASK.TITLE}</h3>

        <form onSubmit={handleSubmit}>
          <input
            id="task-form-input"
            type="text"
            className="form-control"
            placeholder="Task name"
            value={title}
            onChange={handleChange}
            autoFocus
            maxLength={200}
          />

          <div className="task-form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              {BUTTON_TEXT.CANCEL}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              {TASK.SUBMIT}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
