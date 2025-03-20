import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTitle = ({ title }) => {
  const Location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [Location]);

  return null;
};

export default PageTitle;
