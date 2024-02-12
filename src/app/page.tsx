import { NextPage } from 'next';

import Content from '@/app/_components/Content';

interface IProps {
  searchParams?: { [key: string]: string }; // 쿼리 스트링 값을 객체 형태로
  params?: { [key: string]: string }; // 동적 라우팅하는 경우 경로에 대한 정보를 객체 형태로
}

const Page: NextPage<IProps> = ({ searchParams, params }) => {
  return (
    <main>
      <Content
        searchParams={searchParams}
        params={params}
        navigationList={['/dashboard', '/sign-up']}
      />
    </main>
  );
};

export default Page;
