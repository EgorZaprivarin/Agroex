import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getCookie } from '../../services/cookie.js';
import { Context } from '../../context/context.js';

import { Hub } from 'aws-amplify/utils';

import { currentSession } from '../../helpers/cognito/currentSession.js';

import LoginForm from '../../components/LoginForm/LoginForm.jsx';

import './LoginPage.scss';
import AccessDenial from '../../components/AccessDenial/AccessDenial.jsx';

const LoginPage = () => {

  const { auth, setAuth, setUserData } = useContext(Context);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    Hub.listen('auth', async (data) => {
      if (data?.payload?.event === 'signedIn') {
        const resUserData = await currentSession();

        setAuth(getCookie());
        setUserData(resUserData);

        const isAdmin =
          resUserData['cognito:groups'] &&
          resUserData['cognito:groups'].some(item => item === 'ADMIN');

        isAdmin ? navigate('/admin') : navigate('/');
      }
    });
  }, []);

  if (auth && location.pathname === '/login') {
    return (
      <AccessDenial
        errorCode="403"
        errorText="Forbidden"
        title="Access to this page is denied"
        text="You may be trying to access the page with limited permissions."
      />
    );
  }

  return (
    <div className="wrapper">
      <main className="main">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
