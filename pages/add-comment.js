import React, { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { ADD_COMMENT, GET_POSTLIST } from "../queries";
import { Form, Input, Button, Layout, message, Spin } from "antd";
import PropTypes from "prop-types";
import { useRouter } from "next/router";

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
 * Function component for add Comment
 **/
const AddComment = () => {
  const router = useRouter();
  const { id } = router.query;

  const [inputs, setInputs] = React.useState({
    comment: "",
  });

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const onFinish = useCallback((values) => {
    values.post_id = parseInt(id);
    addComment({
      variables: values,
      refetchQueries: [{ query: GET_POSTLIST }],
    });
  }, []);

  const [addComment, { loading, error }] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      if (data) {
        message.success("Comment added Successfully", 5);
        router.push('/post-details/[id]', `/post-details/${id}`);

        // router.push({
        //   pathname: "/",
        //   // query: { pid: id },
        // });
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
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  label="Comment"
                  name="comment"
                  onChange={handleInputChange}
                  value={inputs.comment}
                  rules={[{ required: true, message: "Please enter Comment!" }]}
                >
                  <Input.TextArea />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    Add Comment
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

export default AddComment;
