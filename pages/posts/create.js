import React, { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_POST, GET_POSTLIST, GET_USERLIST } from "../../queries";
import { Form, Input, Button, Select, Layout, message, Spin } from "antd";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import MainLayout from "../../components/MainLayout";

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
 * Function component for create Post
 **/
const CreatePost = () => {
  const router = useRouter()
  const { data } = useQuery(GET_USERLIST);
  const userList = data?.users;

  const renderUsers = useMemo(() => {
    return userList;
  }, [userList]);

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const onFinish = useCallback((values) => {
    createPost({
      variables: values,
      refetchQueries: [{ query: GET_POSTLIST }],
    });
  }, []);

  const [inputs, setInputs] = React.useState({
    title: "",
    description: "",
    user_id: "",
  });

  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    onCompleted: (data) => {
      console.log("b", data);
      if (data) {
        message.success("Post Created Successfully", 5);
        router.push("/posts");
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
    <MainLayout>
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
                    {(renderUsers || []).map((user) => {
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
                    Add Post
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Content>
        </Layout>
      </Spin>
    </MainLayout>
  );
};

// AddPost.propTypes = {
//   inputs: PropTypes.shape({
//     title: PropTypes.string,
//     description: PropTypes.string,
//     user_id: PropTypes.number
//   })
// }
export default CreatePost;
