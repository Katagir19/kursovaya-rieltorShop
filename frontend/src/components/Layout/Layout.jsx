import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from '../Header/Header.tsx';
import { Shell, ContentColumn, Main } from './style';


export const Layout = () => {
  return (
    <Shell>
      <Sidebar />
      <ContentColumn>
        <Header />
        <Main>
          <Outlet />
        </Main>
      </ContentColumn>
    </Shell>
  );
};
