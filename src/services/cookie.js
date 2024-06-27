export const getCookie = () => {
  const cookies = document.cookie.split(';')
    .map(item => item.split('='));

  const idToken = cookies.find(item => item[0].includes('idToken'));

  return idToken ? idToken[1] : null;
};