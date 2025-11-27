import React, { useState } from "react";
import "./CreateColumnForm.css";

interface CreateColumnFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export const CreateColumnForm = ({
  onSubmit,
  onCancel,
}: CreateColumnFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim()) {
      onSubmit(title.trim());
      setTitle("");
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="form-title">Add New Column</h3>

        <form onSubmit={handleSubmit}>
          <input
            id="form-control-id"
            type="text"
            className="form-control"
            placeholder="Enter column name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            maxLength={50}
          />

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              Add Column
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
