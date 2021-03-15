import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Link style={{margin:'5px'}} to="/">All Posts</Link>
        <Link style={{margin:'5px'}} to="/create-post">Add Post</Link>
      </Header>
    </Layout>
  );
};

export default Navbar;
