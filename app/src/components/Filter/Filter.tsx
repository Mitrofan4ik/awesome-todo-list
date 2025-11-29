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
        All
      </button>
      <button
        className={`filter-btn ${
          currentFilter === "incomplete" ? "filter-btn-active" : ""
        }`}
        onClick={() => onFilterChange("incomplete")}
      >
        Incomplete
      </button>
      <button
        className={`filter-btn ${
          currentFilter === "completed" ? "filter-btn-active" : ""
        }`}
        onClick={() => onFilterChange("completed")}
      >
        Completed
      </button>
    </div>
  );
};
