import { ChangeEvent } from 'react';
import { XIcon } from '../Icons/Icons';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control mb-0"
        placeholder="Search tasks..."
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button
          onClick={handleClear}
          className="search-clear-btn"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
};