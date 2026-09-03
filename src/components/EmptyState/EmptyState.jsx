import { Panel, IconWrap, Heading, Description } from './style';

export const EmptyState = ({ icon, title, description }) => {
  return (
    <Panel>
      {icon && <IconWrap>{icon}</IconWrap>}
      <Heading>{title}</Heading>
      <Description>{description}</Description>
    </Panel>
  );
};
