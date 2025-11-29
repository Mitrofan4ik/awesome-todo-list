import { useState, FormEvent, ChangeEvent } from "react";
import "./CreateColumnForm.css";
import { FORM_CONFIG } from "../../constants/columns";
import { BUTTON_TEXT } from "../../constants/common";

interface CreateColumnFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export const CreateColumnForm = ({
  onSubmit,
  onCancel,
}: CreateColumnFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      onSubmit(trimmedTitle);
      setTitle("");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const isSubmitDisabled = !title.trim();

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="form-title">{FORM_CONFIG.TITLE}</h3>

        <form onSubmit={handleSubmit}>
          <input
            id="form-control-id"
            type="text"
            className="form-control"
            placeholder={FORM_CONFIG.PLACEHOLDER}
            value={title}
            onChange={handleChange}
            autoFocus
            maxLength={FORM_CONFIG.MAX_LENGTH}
          />

          <div className="form-actions">
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
              disabled={isSubmitDisabled}
            >
              {BUTTON_TEXT.SUBMIT}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
