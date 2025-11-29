import { STATUS } from "../../constants/status";
import "./Filter.css";

type FilterStatus = "all" | "completed" | "incomplete";

interface FilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export const Filter = ({ currentFilter, onFilterChange }: FilterProps) => {
  return (
    <div className="filter-buttons">
      <button
        className={`filter-btn ${
          currentFilter === "all" ? "filter-btn-active" : ""
        }`}
        onClick={() => onFilterChange("all")}
      >
        {STATUS.ALL}
      </button>
      <button
        className={`filter-btn ${
          currentFilter === "incomplete" ? "filter-btn-active" : ""
        }`}
        onClick={() => onFilterChange("incomplete")}
      >
        {STATUS.INCOMPLETE}
      </button>
      <button
        className={`filter-btn ${
          currentFilter === "completed" ? "filter-btn-active" : ""
        }`}
        onClick={() => onFilterChange("completed")}
      >
        {STATUS.COMPLETED}
      </button>
    </div>
  );
};
