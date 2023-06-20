import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
import Prefech from '../sections/auth/Prefech';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard/app" replace />,
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <Login /> },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <Prefech>
            <DashboardLayout />
          </Prefech>
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'two', element: <PageTwo /> },
        { path: 'three', element: <PageThree /> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/list" replace />, index: true },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':id/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'category',
          children: [
            { element: <Navigate to="/dashboard/category/list" replace />, index: true },
            { path: 'list', element: <CategoryList /> },
            { path: 'new', element: <CategoryCreate /> },
            { path: ':id/edit', element: <CategoryCreate /> },
          ],
        },
        {
          path: 'role',
          children: [
            { element: <Navigate to="/dashboard/role/list" replace />, index: true },
            { path: 'list', element: <RoleList /> },
            { path: 'new', element: <RoleCreate /> },
            { path: ':id/edit', element: <RoleCreate /> },
          ],
        },
        {
          path: 'ticket',
          children: [
            { element: <Navigate to="/dashboard/ticket/all" replace />, index: true },
            { path: 'department/:departmentId', element: <Ticket /> },
            { path: 'department/:departmentId/:ticketId', element: <Ticket /> },
            { path: ':departmentId', element: <Ticket /> },
            { path: ':departmentId/:ticketId', element: <Ticket /> },
          ],
        },
        {
          path: 'service',
          children: [
            { element: <Navigate to="/dashboard/service/all" replace />, index: true },
            { path: ':serviceId', element: <ServiceList /> },
          ],
        },
        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceList /> },
            { path: ':id', element: <InvoiceDetails /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// CATEGORY
const CategoryList = Loadable(lazy(() => import('../pages/dashboard/CategoryList')));
const CategoryCreate = Loadable(lazy(() => import('../pages/dashboard/CategoryCreate')));

// Role
const RoleList = Loadable(lazy(() => import('../pages/dashboard/RoleList')));
const RoleCreate = Loadable(lazy(() => import('../pages/dashboard/RoleCreate')));

// APP
const Ticket = Loadable(lazy(() => import('../pages/dashboard/Ticket')));
// const Service = Loadable(lazy(() => import('../pages/dashboard/Service')));

// SERVICE
const ServiceList = Loadable(lazy(() => import('../pages/dashboard/ServiceList')));
// const ServiecDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));

// INVOICE
const InvoiceList = Loadable(lazy(() => import('../pages/dashboard/InvoiceList')));
const InvoiceDetails = Loadable(lazy(() => import('../pages/dashboard/InvoiceDetails')));

// const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
const PageSix = Loadable(lazy(() => import('../pages/PageSix')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
