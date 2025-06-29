import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App.jsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import Jobseeker from './components/jobseeker/jobseeker.jsx';
import Employer from './components/employer/employer.jsx';
import PostJob from './components/employer/postJob.jsx';
import Admin from './components/admin/admin.jsx';
import Footer from './components/common/Footer.jsx';
import Header from './components/common/Header.jsx';
import JobByID from './components/common/JobByID.jsx';
import Jobs from './components/common/Jobs.jsx';
import EmpJsContext from './contexts/empJsContext.jsx';

const browserRouterObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "signin",
        element: <Signin />
      },
      {
        path: "signup",
        element: <Signup />
      },
      {
        path: "jobseeker-profile/:email",
        element: <Jobseeker />,
        children: [
          {
            path: "jobs",
            element: <Jobs />
          },
          {
            path: ":jobId",
            element: <JobByID />
          },
          {
            path: "",
            element: <Navigate to="jobs" />
          }
        ]
      },
      {
        path: "employer-profile/:email",
        element: <Employer />,
        children: [
          {
            path: "jobs",
            element: <Jobs />
          },
          {
            path: ":jobId",
            element: <JobByID />
          },
          {
            path: "postJob",
            element: <PostJob />
          },
          {
            path: "",
            element: <Navigate to="jobs" />
          }
        ]
      },
      {
        path: "admin-profile/:email",
        element: <Admin />,
        children: [
          {
            path: "jobs",
            element: <Jobs />
          },
          {
            path: ":jobId",
            element: <JobByID />
          },
          {
            path: "",
            element: <Navigate to="jobs" />
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmpJsContext>
      <RouterProvider router={browserRouterObj} />
    </EmpJsContext>
  </StrictMode>,
);
