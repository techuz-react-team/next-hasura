import NavBar from './NavBar';

const MainLayout = (props) => (
  <div className="Layout" >
    <NavBar />
    <div className="Content" >
      {props.children}
    </div>
    
  </div>
);

export default MainLayout;
