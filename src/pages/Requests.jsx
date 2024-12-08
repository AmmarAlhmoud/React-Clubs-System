import { Outlet } from "react-router-dom";

import Requests from "../components/Requests/Requests";
import MainNavigation from "../components/Requests/MainNavigation.jsx";

const RequestsPage = () => {
  return (
    <Requests>
      <MainNavigation>
        <Outlet />
      </MainNavigation>
    </Requests>
  );
};

export default RequestsPage;
