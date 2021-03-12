import { gql } from "@apollo/client";

const GET_COMMENTLIST = gql`
  query getCommentList($postId: bigint!) {
    comments(where: {post_id: {_eq: $postId}}) {
      id
      comment
    }
  }
`;

const ADD_COMMENT = gql`
mutation addComment($comment: String!, $post_id: bigint!) {
  insert_comments(objects: {comment: $comment, post_id: $post_id}) {
    affected_rows
  }
}
`;

const GET_COMMENT_BY_ID = gql`
query getCommentById($id: bigint!, $post_id: bigint!) {
  comments(where: {id: {_eq: $id}, post_id: {_eq: $post_id}}) {
    id
    comment
    post_id
  }
}
`;

const UPDATE_COMMENT = gql`
mutation updateComment($id: bigint!, $comment: String!, $post_id: bigint!) {
  update_comments(where: {id: {_eq: $id}}, _set: {comment: $comment, post_id: $post_id}) {
    returning {
      id
      comment
    }
  }
}
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($id: bigint!) {
    delete_comments_by_pk(id: $id) {
      id
      comment
    }
  }
`;


export { GET_COMMENTLIST, ADD_COMMENT, GET_COMMENT_BY_ID, UPDATE_COMMENT, DELETE_COMMENT };
