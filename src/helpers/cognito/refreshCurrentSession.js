import { fetchAuthSession } from 'aws-amplify/auth';

export const refreshCurrentSession = async () => {
  try {
    const { tokens } = await fetchAuthSession({ forceRefresh: true });

    return tokens.idToken.payload;
  } catch (err) {
    console.log(err);
  }
}