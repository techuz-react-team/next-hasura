import {gql} from 'apollo-boost';

//API to get all users
export const GET_ALL_USERS = gql`
    query getAllUsers {
        users {
            id
            name
        }
    }
`;

//API to post with owner and comment count
export const GET_ALL_POSTS = gql`
query getAllPost {
    posts(order_by: {id: desc}) {
      id
      title
      description
      user {
        name
      }
      comments_aggregate {
        aggregate {
          count
        }
      }
    }
  }
  
`;

//Get post details

export const GEL_POST_DETAILS = gql`
    query getPostDetails($id: bigint!) {
        posts_by_pk(id: $id) {
            id
            description
            title
        user {
            id
            name
        }
        comments {
            id
            post_id
            comment
        }
        }
    }
`;


//Create new post
export const CREATE_POST=gql`
mutation createPost($title: String!, $description: String!, $user_id: bigint!) {
    insert_posts(objects: {title: $title, description: $description, user_id: $user_id}) {
      affected_rows
    }
  }
`;

//Update post
export const UPDATE_POST = gql`
mutation updatePost($title: String!, $description: String!, $user_id: bigint!,$id: bigint!) {
    update_posts_by_pk(pk_columns: {id: $id}, _set: {title: $title,description: $description, user_id: $user_id}) {
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
`;

//Delete post
export const DELETE_POST = gql`
mutation deletePost($id: bigint!) {
    delete_posts_by_pk(id: $id) {
        id
        title
        
    }
  }
`;

//ADD_COMMENT
export const ADD_COMMENT = gql`
mutation createComment($post_id: bigint!, $comment: String!) {
    insert_comments(objects: {post_id: $post_id, comment: $comment}) {
      returning {
        id
        comment
        post_id
      }
    }
  }
`;

//UPDATE comment
export const UPDATE_COMMENT = gql`
mutation updateComment($id: bigint!, $post_id: bigint!, $comment: String!) {
    update_comments(where: {id: {_eq: $id}}, _set: {comment: $comment}) {
      returning {
        id
        comment
        post_id
      }
    }
  }
`;

//DELETE comments
export const DELETE_COMMENT = gql`
mutation deleteComment($id: bigint!) {
    delete_comments_by_pk(id: $id) {
        id
        comment
    }
  }
`;