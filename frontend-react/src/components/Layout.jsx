import NavBar from "./NavBar";
import Footer from "./Footer";
import "./Layout.css";

const Layout = ({ children }) => (
  <div className="layout">
    <NavBar />
    <main className="layout__main">{children}</main>
    <Footer />
  </div>
);

export default Layout;
