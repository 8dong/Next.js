'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';

import CloseIcon from '@/images/icons/Close';
import styles from '@/app/_components/modal.module.css';

const Modal: FC = () => {
  const router = useRouter();

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
        <strong>This is Parallel Routes Component</strong>
      </div>
    </>
  );
};

export default Modal;
