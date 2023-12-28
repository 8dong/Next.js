import { FC, ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  modal?: ReactNode;
}

const Layout: FC<IProps> = ({ children, modal }) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default Layout;
