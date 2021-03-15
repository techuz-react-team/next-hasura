// import "../styles/globals.css";
import React from "react";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import "antd/dist/antd.css";

const link = createHttpLink({
  uri: "https://techuz-hasura.herokuapp.com/v1/graphql",
  headers: {
    "content-type": `application/json`,
    "x-hasura-admin-secret": `${process.env.REACT_APP_HASURA_TOKEN}`,
  },
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
