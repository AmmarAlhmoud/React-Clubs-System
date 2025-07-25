import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  checkAuthAdUserType,
  checkAuthClUserType,
  checkAuthStUserType,
} from "./util/auth.js";
import { setTheme, setLang } from "./store/theme-slice.js";
import { useTranslation } from "react-i18next";

import LoginPage from "./pages/Login.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import CmDashboardPage from "./pages/CmDashboard.jsx";
import EventsListPage from "./pages/EventsList.jsx";
import RequestsPage from "./pages/Requests.jsx";
import EventRequest from "./components/Requests/EventRequest.jsx";
import EventEditRequest from "./components/Requests/EventEditRequest.jsx";
import ClubEditRequest from "./components/Requests/ClubEditRequest.jsx";
import ClubPostRequest from "./components/Requests/ClubPostRequest.jsx";
import PostEditRequest from "./components/Requests/PostEditRequest.jsx";
import ClubEditReqPage from "./pages/ClubEditReq.jsx";
import ClubsListPage from "./pages/ClubsList.jsx";
import EditClubPage from "./pages/EditClub.jsx";
import CreateClubPage from "./pages/CreateClub.jsx";
import MyClubPage from "./pages/MyClub.jsx";
import ProtectedRouteNoUser from "./pages/ProtectedRouteNoUser.jsx";
import ProtectedRouteWithUser from "./pages/ProtectedRouteWithUser.jsx";
import RequestEventPage from "./pages/RequestEvent.jsx";
import RequestPostPage from "./pages/RequestPost.jsx";
import StDashboardPage from "./pages/StDashboard.jsx";
import HomePage from "./pages/Home.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "login",
    element: (
      <ProtectedRouteNoUser>
        <LoginPage />
      </ProtectedRouteNoUser>
    ),
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRouteWithUser>
        {checkAuthAdUserType() && <DashboardPage />}
        {checkAuthClUserType() && <CmDashboardPage />}
        {checkAuthStUserType() && <StDashboardPage />}
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "events-list",
    element: (
      <ProtectedRouteWithUser>
        <EventsListPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "events-list/club-page/:clubPageId",
    element: (
      <ProtectedRouteWithUser>
        <MyClubPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "requests",
    element: (
      <ProtectedRouteWithUser>
        <RequestsPage />
      </ProtectedRouteWithUser>
    ),
    children: [
      { path: "event-request", element: <EventRequest /> },
      { path: "event-edit-request", element: <EventEditRequest /> },
      { path: "club-post-request", element: <ClubPostRequest /> },
      { path: "post-edit-request", element: <PostEditRequest /> },
      { path: "club-edit-request", element: <ClubEditRequest /> },
    ],
  },
  {
    path: "requests/club-edit-request/club-edit-details/:editClubId",
    element: (
      <ProtectedRouteWithUser>
        <ClubEditReqPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "clubs-list",
    element: (
      <ProtectedRouteWithUser>
        <ClubsListPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "clubs-list/edit-club/:editClub",
    element: (
      <ProtectedRouteWithUser>
        <EditClubPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "create-club",
    element: (
      <ProtectedRouteWithUser>
        <CreateClubPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "clubs-list/club-page/:clubID",
    element: (
      <ProtectedRouteWithUser>
        <MyClubPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "my-club",
    element: (
      <ProtectedRouteWithUser>
        <MyClubPage />
      </ProtectedRouteWithUser>
    ),
  },

  {
    path: "edit-my-club",
    element: (
      <ProtectedRouteWithUser>
        <EditClubPage />
      </ProtectedRouteWithUser>
    ),
  },
  {
    path: "request-Event",
    element: <RequestEventPage />,
  },
  {
    path: "request-post",
    element: <RequestPostPage />,
  },
]);

function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  // 1. On first load, check if a theme is already in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("i18nextLng");

    if (savedTheme) {
      dispatch(setTheme(savedTheme)); // apply saved theme
    }
    if (savedLang) {
      dispatch(setLang(savedLang)); // apply saved lang
    }
  }, [dispatch]);

  // 2. Whenever the theme in state changes, persist it to localStorage
  const mode = useSelector((state) => state.theme.mode);
  const lang = useSelector((state) => state.theme.lang);
  useEffect(() => {
    localStorage.setItem("theme", mode);
    // will set a cutome data- to the body for styling ex: :global(body[data-theme='light'])
    document.body.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  }, [lang, i18n]);

  return (
    <div className={mode}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
