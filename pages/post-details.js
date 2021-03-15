import React, { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_POST_BY_ID, DELETE_COMMENT, GET_POSTLIST } from "../queries";
import { Card, Spin, Table, Space, message, Button } from "antd";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout from "../components/MainLayout";
import AddComment from "./add-comment";
import UpdateComment from "./update-comment";

const { Column } = Table;

/**
 * Function component for details of post
 **/

const ViewPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [addCommentForm, setAddComments] = useState(false);
  const [updateCommentForm, setUpdateComments] = useState(false);
  const [commentData, setcommentData] = useState('');

  // get single post by id
  const { loading, data } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });
  const post = data?.posts[0];

  const singlePost = useMemo(() => {
    return post;
  }, [post]);

  const onAddComment = () => {
    setAddComments(true);
    setUpdateComments(false);
  };

  const onUpdateComment = (commentData) => {
    setcommentData(commentData);
    setUpdateComments(true);
    setAddComments(false);
  }

  const onDeleteComment = useCallback((comment_id) => {
    deleteComment({
      variables: { id: comment_id },
      refetchQueries: [{ query: GET_POSTLIST }],
    });
  }, []);

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: (data) => {
      if (data) {
        message.success("Comment Deleted Successfully", 5);
        router.push('/post-details/[id]', `/post-details/${id}`);
        // router.push("/");
      }
    },
    onError: (error) => {
      message.error(error);
    },
  });

  return (
    <MainLayout>
      <Spin spinning={loading} size="large" tip="Loading...">
        <div style={{ margin: "50px" }}>
          <Card title="Post Details" bordered={true} style={{ width: 500 }}>
            <p>
              <b>Id:</b> {singlePost?.id}
            </p>
            <p>
              <b>Title:</b> {singlePost?.title}
            </p>
            <p>
              <b>Description:</b> {singlePost?.description}
            </p>
            <p>
              <b>Username:</b> {singlePost?.user?.name}
            </p>
          </Card>
          <div className="logo">
            <h2>Comments</h2>
            {/* <Link
              style={{ margin: "5px" }}
              href={`/posts/${singlePost?.id}/add-comment`}
            >
              Add Comment
            </Link> */}
            <Button type="link" onClick={() => onAddComment()}>
              Add Comment
            </Button>
          </div>

          {addCommentForm && <AddComment />}

          {updateCommentForm && <UpdateComment commentData={commentData}/>}

          <Table
            dataSource={singlePost?.comments}
            rowKey={(comment) => comment.id}
          >
            <Column title="Id" dataIndex="id" key="id" />
            <Column title="Comment" dataIndex="comment" key="comment" />
            <Column
              title="Action"
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  {/* <Link
                    href={`/posts/${singlePost?.id}/update-comment/${text.id}`}
                  >
                    Update
                  </Link> */}
                  <Button type="link" onClick={() => onUpdateComment(text)}>
                    Update
                  </Button>
                  <Button type="link" onClick={() => onDeleteComment(text.id)}>
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
        </div>
      </Spin>
    </MainLayout>
  );
};

ViewPost.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          comment: PropTypes.string,
          id: PropTypes.number,
        })
      ),
      user: PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string,
        })
      ),
    })
  ),
};

export default ViewPost;
