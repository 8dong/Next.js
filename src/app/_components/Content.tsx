'use client';

import { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import styles from '@/app/_components/content.module.css';

interface IProps {
  searchParams?: { [key: string]: string };
  params?: { [key: string]: string };
  navigationList?: string[];
}

const Content: FC<IProps> = ({ searchParams, params, navigationList }) => {
  const pathname = usePathname();
  const router = useRouter();

  const onClickNavigationButton = (pathname: string) => {
    router.push(pathname);
  };

  return (
    <>
      <h1>current URL path is "{pathname}"</h1>
      <dl>
        <div>
          <dt>Search Params</dt>
          <dd>
            {searchParams && Object.entries(searchParams).length > 0 ? (
              <ul>
                {Object.entries(searchParams).map((entry) => (
                  <li>{`key: ${entry[0]}, value: ${entry[1]}`}</li>
                ))}
              </ul>
            ) : (
              'searchParams prop is empty!'
            )}
          </dd>
        </div>
      </dl>
      {navigationList &&
        navigationList?.length > 0 &&
        navigationList.map((navigation) => (
          <button
            className={styles['navigation-button']}
            key={navigation}
            onClick={() => onClickNavigationButton(navigation)}
          >
            {navigation}
          </button>
        ))}
    </>
  );
};

export default Content;
