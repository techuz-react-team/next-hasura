import React from 'react';
import {Link} from 'react-router-dom'
const Header = () => {
    return (
        <nav>
            <section>
                <div className="navContent">
                <div className="navLinks">
                <div className="navbar">
                    <Link to="/" className="float-left white mr20px font20">React App With Hasura</Link>
                    <Link className="btn btn-success float-right mr20px" to="/create-post">Create Post</Link>
                    
                </div>
                </div>
                </div>
            </section>
        </nav>
    );
}

export default Header;