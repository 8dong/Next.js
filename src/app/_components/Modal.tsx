'use client';

import { FC, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import CloseIcon from '@/images/icons/Close';
import styles from '@/app/_components/modal.module.css';

interface IProps {
  content?: ReactNode;
}

const Modal: FC<IProps> = ({ content }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClickCloseButton = () => {
    router.back();
  };

  return (
    <>
      <div className={styles.dim}></div>
      <div className={styles.modal}>
        <button className={styles['close-button']} onClick={handleClickCloseButton}>
          <CloseIcon />
        </button>
        <strong>current URL path is "{pathname}"</strong>
        {content && <section>{content}</section>}
      </div>
    </>
  );
};

export default Modal;
