import React, { useCallback, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_COMMENT, GET_COMMENT_BY_ID } from "../../queries";
import { Form, Input, Button, Layout, message, Spin } from "antd";
import PropTypes from "prop-types";
import history from "../../history";

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
 * Function component for update comment
 **/
const UpdateComment = ({ match }) => {
  const [form] = Form.useForm();
  const { id } = match.params;
  const { comment_id } = match.params;

  const [inputs, setInputs] = React.useState({
    comment: "",
  });

  const { data: commentData } = useQuery(GET_COMMENT_BY_ID, {
    variables: { post_id: id, id: comment_id },
  });
  const comment = commentData?.comments[0];

  const singleComment = useMemo(() => {
    return comment;
  }, [comment]);

  useEffect(() => {
    form.setFieldsValue({
      comment: singleComment?.comment,
    });
  }, [singleComment]);

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const onFinish = useCallback((values) => {
    values.post_id = parseInt(id);
    values.id = parseInt(comment_id);
    upadteComment({
      variables: values,
    });
  }, []);

  const [upadteComment, { loading, error }] = useMutation(UPDATE_COMMENT, {
    onCompleted: (data) => {
      if (data) {
        message.success("Comment Updated Successfully", 5);
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
                    Update Comment
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

export default UpdateComment;
