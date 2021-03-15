import React, { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Space, Spin, Button, message } from "antd";
import { GET_POSTLIST, DELETE_POST } from "../../queries";
import history from "../../history";

const { Column } = Table;

/**
 * Function component for PostList
 **/
const PostList = () => {
  // Delete Post
  const onDeletePost = useCallback((post_id) => {
    deletePost({
      variables: { id: post_id },
      refetchQueries: [{ query: GET_POSTLIST }],
    });
  }, []);

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: (data) => {
      if (data) {
        message.success("Post Deleted Successfully", 5);
        history.push("/");
      }
    },
    onError: (error) => {
      message.error(error);
    },
  });

  // Get postlist
  const { loading, error, data } = useQuery(GET_POSTLIST);
  const postList = data?.posts;

  const renderPostList = useMemo(() => {
    return postList;
  }, [postList]);

  if (error) {
    return `Error! ${error.message}`;
  }

  return (
    <Spin spinning={loading} size="large" tip="Loading...">
      <Table dataSource={renderPostList} rowKey={(posts) => posts.id}>
        <Column title="Id" dataIndex="id" key="id" />
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Username" dataIndex={["user", "name"]} key="Username" />
        <Column
          title="Comments-Count"
          dataIndex={["comments_aggregate", "aggregate", "count"]}
          key="CommentsCount"
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/posts/${text.id}`}>View</Link>
              <Link to={`/update-post/${text.id}`}>Update</Link>
              <Button type="link" onClick={() => onDeletePost(text.id)}>
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
    </Spin>
  );
};

PostList.propTypes = {
  postList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      comments_aggregate: PropTypes.objectOf(
        PropTypes.shape({
          count: PropTypes.number,
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

export default PostList;
