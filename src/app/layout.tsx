import { FC, ReactNode } from 'react';

import './globals.css';

interface IProps {
  children: ReactNode; // "/app/page.tsx"에서 export default된 Page 컴포넌트
  params?: { [key: string]: string }; // 동적 라우팅되는 경우 경로에 대한 정보를 객체 형태로
}

const Layout: FC<IProps> = ({ children }) => {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
};

export default Layout;
