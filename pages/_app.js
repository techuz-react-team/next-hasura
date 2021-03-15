import ApolloClient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import NextNprogress from 'nextjs-progressbar';

const client = new ApolloClient({
    uri: 'https://techuz-hasura.herokuapp.com/v1/graphql',
    headers: {
      'x-hasura-admin-secret': `${process.env.APP_HASURA_TOKEN}`
    }
  });


  export default function App({ Component, pageProps }) {
    return (
      <ApolloProvider client={client}>
        <div style={{ margin: "20px" }}>
            <NextNprogress
            color="#29D"
            startPosition={0.3}
            stopDelayMs={200}
            height="3"
            />
            <Component {...pageProps} />
        </div>
      </ApolloProvider>
    );
  }

