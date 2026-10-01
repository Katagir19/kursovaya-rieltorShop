import styled from '@emotion/styled';

export const FiltersWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 260px;
`;

export const SearchIcon = styled.svg`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #8c8c8c;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 42px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
  }
`;

export const SelectFilter = styled.select`
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  min-width: 160px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #000000;
  }
`;
