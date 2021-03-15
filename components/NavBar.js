import React from "react";
import Link from 'next/link'
import { Layout } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Link style={{margin:'5px'}} href="/">All Posts</Link>
        <Link style={{margin:'5px'}} href="/create-post">Add Post</Link>
      </Header>
    </Layout>
  );
};

export default Navbar;