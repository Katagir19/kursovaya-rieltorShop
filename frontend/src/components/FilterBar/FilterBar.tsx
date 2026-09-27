import React from 'react';
import {
  FiltersWrapper,
  SearchInputWrapper,
  SearchInput,
  SelectFilter,
  SearchIcon,
} from './style';

export interface StatusOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  statusOptions: StatusOption[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Поиск...',
  statusFilter,
  onStatusChange,
  statusOptions,
}) => {
  return (
    <FiltersWrapper>
      <SearchInputWrapper>
        <SearchIcon viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchInputWrapper>

      <SelectFilter
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectFilter>
    </FiltersWrapper>
  );
};
