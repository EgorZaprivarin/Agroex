import { fetchAuthSession } from '@aws-amplify/auth';

export const currentSession = async () => {
  try {
    const { idToken } = (await fetchAuthSession()).tokens ?? {};

    return idToken.payload;
  } catch (err) {
    console.log(err);
  }
}