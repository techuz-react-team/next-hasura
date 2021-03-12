import { gql } from "@apollo/client";

const GET_USERLIST = gql`
  query getUserList {
    users {
      id
      name
    }
  }
`;


export { GET_USERLIST };
