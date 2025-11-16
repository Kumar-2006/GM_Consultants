import { useMemo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import NotificationShroud from "./NotificationShroud";
import "../../App.css";

const Layout = ({ children }) => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__main">
        <div className="pattern-mask" aria-hidden />
        {children}
      </main>
      <Footer year={year} />
      <NotificationShroud />
    </div>
  );
};

export default Layout;
