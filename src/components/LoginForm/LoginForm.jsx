import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const formFields = {
  signUp: {
    email: {
      order: 3,
    },
    given_name: {
      order: 1,
    },
    family_name : {
      order: 2
    },
    password: {
      order: 4,
    },
    confirm_password: {
      order: 5,
    },
  },
};

const LoginForm = () => {
  return (
    <>
      <Authenticator
        formFields={formFields}
        signUpAttributes={['email']}
        components={{
          SignUp: {
            FormFields() {
              return (
                <Authenticator.SignUp.FormFields />
              );
            },
          },
          ForceNewPassword: {
            FormFields() {
              return (
                <>
                  <input
                    type="text"
                    hidden
                    autoComplete="username"
                    name="username"
                  />
                  <Authenticator.ForceNewPassword.FormFields />
                </>
              );
            },
          },
        }}
      />
    </>
  );
};

export default LoginForm;