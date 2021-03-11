import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Header from './Header'
import Posts from './Posts'
import PostDetails from './PostDetails'
import CreatePost from './CreatePost'
import UpdatePost from './UpdatePost'
const Routes = () => {
    return (
        <Router>
            <Header />
            <Route path='/' exact component={Posts} />
            <Route path='/post/:id' exact component={PostDetails} />
            <Route path='/create-post' exact component={CreatePost} />
            <Route path='/update-post/:id' exact component={UpdatePost} />
        </Router>
        );
}

export default Routes;