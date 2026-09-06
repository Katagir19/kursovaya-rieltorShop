import styled from '@emotion/styled';

// Когда появятся жильцы, сюда добавится таблица/список карточек арендаторов.
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 16px;
`;
