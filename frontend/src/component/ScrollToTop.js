import { useEffect } from "react";
import {
  NavigationType,
  useLocation,
  useNavigationType,
} from "react-router-dom";

const ScrollToTop = ({ children }) => {
  useScrollToTop();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("pathname", pathname);
  }, [pathname]);

  return children || null;
};

export default ScrollToTop;

const useBackButton = () => {
  const navType = useNavigationType();
  return navType === NavigationType.Pop;
};

const useScrollToTop = () => {
  const { pathname } = useLocation();

  const isPop = useBackButton();

  const scrollToTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    console.log("pathname", pathname);
    scrollToTop();
  }, [pathname, isPop]);

  useEffect(() => {
    window.addEventListener("beforeunload", scrollToTop);
    return () => {
      window.removeEventListener("beforeunload", scrollToTop);
    };
  }, []);
};
