import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import PostList from "./components/Post/PostList";
import UpdatePost from "./components/Post/UpdatePost";
import ViewPost from "./components/Post/ViewPost";
import CreatePost from "./components/Post/CreatePost";
import Navbar from "./components/Post/Navbar";

import history from "./history";
import AddComment from "./components/Comments/AddComment";
import UpdateComment from "./components/Comments/UpdateComment";

class routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Navbar />
        <Switch>
          <Route path="/" exact component={PostList} />
          <Route path='/posts/:id' exact  component={ViewPost}/>
          <Route path="/create-post" exact component={CreatePost} />
          <Route path='/update-post/:id' exact  component={UpdatePost}/>
          <Route path='/posts/:id/add-comment' exact  component={AddComment}/>
          <Route path='/posts/:id/update-comment/:comment_id' exact  component={UpdateComment}/>
        </Switch>
      </Router>
    );
  }
}

export default routes;
