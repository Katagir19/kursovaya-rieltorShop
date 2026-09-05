import { useEffect } from 'react';
import { Panel, IconWrap, Heading, Description } from './style';

export const EmptyState = ({ icon, title, description }) => {
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/tenants')
      .then((res) => res.json())
      .then((data) => console.log('Данные из БД:', data));
  }, []);

  return (
    <Panel>
      {icon && <IconWrap>{icon}</IconWrap>}
      <Heading>{title}</Heading>
      <Description>{description}</Description>
    </Panel>
  );
};