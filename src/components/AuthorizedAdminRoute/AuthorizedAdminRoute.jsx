import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { currentSession } from '../../helpers/cognito/currentSession.js';

import AccessDenial from '../AccessDenial/AccessDenial.jsx';

import CircularProgress from '@mui/material/CircularProgress';

const AuthorizedAdminRoute = ({ Component }) => {
  const [idToken, setIdToken] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getUserToken();
  }, []);

  const getUserToken = async () => {
      const idToken = await currentSession();

      idToken || navigate('/login');
      setIdToken(idToken);
  };

  if (!idToken) {
    return (
      <div style={{flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <CircularProgress />
      </div>
    )
  }

  if (idToken['cognito:groups'] && idToken['cognito:groups'].some(item => item === 'ADMIN')) {
    return <Component />
  }

  return <AccessDenial
    errorCode='403'
    errorText='Forbidden'
    title='Access to this page is denied'
    text='You may be trying to access the page with limited permissions.'
  />
};

export default AuthorizedAdminRoute;