import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
    };

    if (location.pathname !== '/') { // Если мы находимся не на домашней странице
      scrollToTop();
    }
  }, [location]);

  return null;
}

export default ScrollToTop;