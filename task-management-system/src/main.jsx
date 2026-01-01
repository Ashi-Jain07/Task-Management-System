import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from './utils/ProtectedRoute.jsx';

const ErrorPage = lazy(() => import('./Components/ErrorPage.jsx'));
const Login = lazy(() => import('./Components/Login.jsx'));
const HomePage = lazy(() => import('./Components/HomePage.jsx'))
const Register = lazy(() => import('./Components/Register.jsx'));
const Dashboard = lazy(() => import('./Components/Dashboard.jsx'));

const fallbackElement = (
  <h1 className='text-center text-3xl flex items-center justify-center text-white bg-[#020F15] min-h-screen h-full'>
    Loading...
  </h1>
);

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={fallbackElement}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={fallbackElement}>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={fallbackElement}>
            <Register />
          </Suspense>
        )
      },
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={fallbackElement}>
            <ProtectedRoute >
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        )
      },
    ],
    errorElement: (
      <Suspense fallback={fallbackElement}>
        <ErrorPage />
      </Suspense>
    )
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={appRouter} />
  </StrictMode>,
)
