import { gql } from "@apollo/client";

const GET_POSTLIST = gql`
  query getPostList {
    posts {
      id
      title
      description
      comments_aggregate {
        aggregate {
          count
        }
      }
      user {
        name
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation createPost(
    $title: String!
    $description: String!
    $user_id: bigint!
  ) {
    insert_posts(
      objects: { title: $title, description: $description, user_id: $user_id }
    ) {
      affected_rows
    }
  }
`;

const GET_POST_BY_ID = gql`
  query getPostById($id: bigint!) {
    posts(where: { id: { _eq: $id } }) {
      id
      title
      description
      user {
        id
        name
      }
      comments {
        comment
        id
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation updatePost(
    $title: String!
    $description: String!
    $user_id: bigint!
    $id: bigint!
  ) {
    update_posts(
      where: { id: { _eq: $id } }
      _set: { title: $title, description: $description, user_id: $user_id }
    ) {
      returning {
        id
        title
        description
        user {
          id
          name
        }
        comments_aggregate {
          aggregate {
            count
          }
        }
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($id: bigint!) {
    delete_posts_by_pk(id: $id) {
      id
      title
    }
  }
`;

export { GET_POSTLIST, CREATE_POST, GET_POST_BY_ID, UPDATE_POST, DELETE_POST };
