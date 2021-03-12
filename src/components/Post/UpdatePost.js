import React, { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import {
  GET_POST_BY_ID,
  UPDATE_POST,
  GET_USERLIST,
  GET_POSTLIST,
} from "../../queries";
import { Form, Input, Button, Select, Layout, message, Spin } from "antd";
import PropTypes from "prop-types";
import history from "../../history";

const { Option } = Select;
const { Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 14 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

/**
 * Function component for Update Post
 **/
const UpdatePost = ({ match }) => {
  const [form] = Form.useForm();
  const { id } = match.params;

  // get single post by id
  const { data: PostData } = useQuery(GET_POST_BY_ID, {
    variables: { id },
  });
  const post = PostData?.posts[0];

  const singlePost = useMemo(() => {
    return post;
  }, [post]);

  // get UserList
  const { data: UserData } = useQuery(GET_USERLIST);
  const userList = UserData?.users;

  const renderUserList = useMemo(() => {
    return userList;
  }, [userList]);

  const [inputs, setInputs] = React.useState({});

  useEffect(() => {
    form.setFieldsValue({
      title: singlePost?.title,
      description: singlePost?.description,
      user_id: singlePost?.user?.id,
    });
  }, [singlePost]);

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const onFinish = useCallback((values) => {
    values.id = id;
    updatePost({
      variables: values,
      refetchQueries: [{ query: GET_POSTLIST }],
    });
  }, []);

  const [updatePost, { loading, error }] = useMutation(UPDATE_POST, {
    onCompleted: (data) => {
      if (data) {
        message.success("Post Updated Successfully", 5);
        history.push("/");
      }
    },
    onError: (error) => {
      message.error(error);
    },
  });

  if (error) {
    return `Error! ${error.message}`;
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Spin spinning={loading} size="large" tip="Loading...">
        <Layout className="layout">
          <Content style={{ padding: "50px" }}>
            <div
              style={{
                background: "#fff",
                padding: 24,
                minHeight: 280,
              }}
            >
              <Form
                {...formItemLayout}
                name="basic"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Title"
                  name="title"
                  onChange={handleInputChange}
                  value={inputs.title}
                  rules={[{ required: true, message: "Please enter Title!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="description"
                  onChange={handleInputChange}
                  value={inputs.description}
                  rules={[
                    { required: true, message: "Please enter Description!" },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  name="user_id"
                  label="Username"
                  onChange={handleInputChange}
                  value={inputs.user_id}
                  rules={[
                    { required: true, message: "Please Select Username!" },
                  ]}
                >
                  <Select placeholder="Select Username" allowClear>
                    {(renderUserList || []).map((user) => {
                      return (
                        <Option key={user.id} value={user.id}>
                          {user.name}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Update Post
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Content>
        </Layout>
      </Spin>
    </div>
  );
};

// UpdatePost.propTypes = {
//   inputs: PropTypes.shape({
//     id: PropTypes.number,
//     title: PropTypes.number,
//     description: PropTypes.number,
//     user_id: PropTypes.number
//   })
// }

export default UpdatePost;
