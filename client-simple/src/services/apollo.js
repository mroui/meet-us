import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { AccountsGraphQLClient } from "@accounts/graphql-client";
import { AccountsClientPassword } from "@accounts/client-password";
import { AccountsClient } from "@accounts/client";
import { accountsLink } from "@accounts/apollo-link";

const GRAPHQL_URL = "http://localhost:4000/graphql";


const httpLink = createHttpLink({
  uri: GRAPHQL_URL
});

const cache = new InMemoryCache();

// accounts js
export const graphQLApolloClient = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache
});

export const accountsGraphQLTransport = new AccountsGraphQLClient({
  graphQLClient: graphQLApolloClient
});

export const accountsClient = new AccountsClient({},
  accountsGraphQLTransport
);
export const accountsPassword = new AccountsClientPassword(accountsClient);

// regular apollo client
const authLink = accountsLink(() => accountsClient);

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache
});

export default client;