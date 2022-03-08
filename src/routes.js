import { lazy } from 'react';
import ProtectedRoute from 'components/common/ProtectedRoute';
import DefaultView from 'components/common/DefaultView';

const Main = lazy(() => import(/* webpackPrefetch: true */ 'components/views/main/Main'));
const NotFound = lazy(() => import('components/views/NotFound'));
const Login = lazy(() => import('components/views/Login'));
const CurrentLocation = lazy(() => import('components/views/CurrentLocation.js'));
const Logout = lazy(()=> import('components/views/Logout.js'));
const RouteView = lazy(() => import('components/views/RouteView.js'));
// [hygen] Import views

export const ROUTE_PATHS = {
  LOGIN: '/',
  DEFAULT: '/dashboard/',
  NOT_FOUND: '/404',
  CURRENT_LOCATION: '/dashboard/currentLocation',
  LOGOUT:'logout',
  ROUTE_VIEW: '/dashboard/route_view',
  // [hygen] Add path routes
};

const routes = [
  {
    path: ROUTE_PATHS.DEFAULT,
    element: (
      <ProtectedRoute>
        <DefaultView>
          <Main />
        </DefaultView>
      </ProtectedRoute>
    ),
    children: [
      // { path: '/', element: <Navigate to='/<your default view>' /> },
      { path: ROUTE_PATHS.CURRENT_LOCATION, element: <CurrentLocation /> },
      {path: ROUTE_PATHS.LOGOUT, element:<Logout shown={true}/>},
      { path: ROUTE_PATHS.ROUTE_VIEW, element: <RouteView /> },
      // [hygen] Add routes
    ],
  },
  { path: ROUTE_PATHS.LOGIN, element: <Login /> },
  {
    path: '*',
    element: (
      <DefaultView>
        <NotFound />
      </DefaultView>
    ),
  },
];

export default routes;
