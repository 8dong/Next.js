'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';

import { handleSubmitSignupForm } from '@/app/@modal/_actions';
import styles from '@/app/@modal/_components/signUp.module.css';

const SignUpForm: FC = () => {
  const router = useRouter();

  const [state, formAction] = useFormState(handleSubmitSignupForm, { message: '' });
  const [formMessage, setFormMessage] = useState(state.message);

  const handleClickResetButton = () => {
    setFormMessage('');
  };

  useEffect(() => {
    if (state.message) {
      if (state.message === 'success') {
        router.back();
      } else {
        setFormMessage(state.message);
      }
    }
  }, [state.message]);

  return (
    <form className={styles['sign-up-form']} action={formAction} autoComplete='off' noValidate>
      {formMessage ? (
        <>
          {formMessage}
          <button type='button' onClick={handleClickResetButton}>
            Reset
          </button>
        </>
      ) : (
        <>
          <div className={styles['input-group']}>
            <label className={styles['input-label']} htmlFor='id'>
              ID
            </label>
            <input className={styles['input-feild']} id='id' name='id' type='text' />
          </div>
          <div className={styles['input-group']}>
            <label className={styles['input-label']} htmlFor='password'>
              Password
            </label>
            <input
              className={styles['input-feild']}
              id='password'
              name='password'
              type='password'
            />
          </div>
          <button type='submit'>Submit</button>
        </>
      )}
    </form>
  );
};

export default SignUpForm;
