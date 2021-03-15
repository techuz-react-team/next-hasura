import Link from 'next/link'
const Nav = () => (
    <div>

        <section>
                <div className="navContent">
                <div className="navLinks">
                <div className="navbar">
                <Link href="/">
                    <a  className="float-left white mr20px font20">React App With Hasura</a>
                </Link>
                <Link href="/create-post">
                    <a className="btn btn-success float-right mr20px" >Create Post</a>
                </Link>    
                    
                    
                </div>
                </div>
                </div>
        </section>
    </div>
)

export default Nav;