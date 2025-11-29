import { DEFAULT_TEXT, MODAL_STATUS } from "../../constants/modal";
import "./ConfirmModal.css";
interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  status?: "danger" | "warning" | "info";
}

export const ConfirmModal = ({
  title,
  message,
  confirmText = DEFAULT_TEXT.CONFIRM,
  cancelText = DEFAULT_TEXT.CANCEL,
  onConfirm,
  onCancel,
  status = MODAL_STATUS.DANGER,
}: ConfirmModalProps) => {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`btn btn-${status}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
