const awsConfig = {
  Auth: {

    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_tRUXbAWUb',
      userPoolClientId: '2hgn6abdasbm8n8k2k9tl16etj',
      loginWith: {
        email: 'true',
      },
    },
  },
};

export default awsConfig;