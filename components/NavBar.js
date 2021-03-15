import React from "react";
import Link from 'next/link'
import { Layout } from "antd";

const { Header } = Layout;

const Navbar = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Link style={{margin:'5px'}} href="/posts">All Posts</Link>
        <Link style={{margin:'5px'}} href="/posts/create">Add Post</Link>
      </Header>
    </Layout>
  );
};

export default Navbar;