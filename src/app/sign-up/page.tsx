import { NextPage } from 'next';

import Modal from '@/app/_components/Modal';
import SignUpForm from '@/app/@modal/_components/SignUpForm';

const Page: NextPage = () => {
  return <Modal content={<SignUpForm />} />;
};

export default Page;
