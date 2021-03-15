module.exports = {
    env: {
        REACT_APP_HASURA_TOKEN: 'Hansudi@122',
    },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/posts',
            permanent: true,
          },
        ]
      }
  };
  