'use server';

export const handleSubmitSignupForm = async (
  prevState: { message: string },
  formData: FormData
) => {
  try {
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;

    if (!id || id?.trim().length <= 0) {
      return { message: 'id_empty' };
    } else if (!password || password?.trim().length <= 0) {
      return { message: 'password_empty' };
    } else {
      return { message: 'success' };
    }
  } catch (error) {
    return { message: 'error' };
  }
};
