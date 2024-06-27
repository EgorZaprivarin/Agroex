import { Outlet } from 'react-router-dom';

import { Header } from '../Header/Header.jsx';
import { Footer } from '../Footer/Footer.jsx';
import ScrollToTop from '../ScrollToTop/ScrollToTop.jsx';

export const Layout = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;