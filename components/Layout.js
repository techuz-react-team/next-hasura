import Head from 'next/head'
import Nav from '../components/Nav'
const Layout = (props) => (
    <div className="container">
        <Nav />
        <Head>
            <title>{props.title}</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        {props.children}
    </div>
)

export default Layout;