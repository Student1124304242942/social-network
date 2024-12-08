import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { createHashRouter } from 'react-router-dom';
import { network } from './components/reducer/network';
import AuthLayout from './layouts/Auth/Auth';
import LoginPage from './pages/Login/Login';
import RegisterPage from './pages/Register/Register';
import { RequireAuth } from './components/reducer/RequireAuth';
import UserProfilePage from './pages/Users/UserProfile/UserProfile';
import MessagePage from './pages/Messages/Messages';
import NetworkLayout from './layouts/Menu/Menu';
import ProfilePage from './pages/Profile/Profile';
import { Suspense } from 'react';
import PostPage from './pages/Post/Post';
import UsersPage from './pages/Users/User';
import { Error } from './pages/ErrorPage/ErrorPage';
import ChatPage from './pages/Messages/Chat/Chat';
const router = createHashRouter([
  {
    path: '/',
    element: <RequireAuth><NetworkLayout/></RequireAuth>,
    children: [
      {
        path: '/',
        element: <Suspense fallback={<>Загрузка...</>}><ProfilePage/></Suspense>
      },
      {
        path: '/post',
        element: <PostPage/>,
      },
      {
        path: '/users',
        element: <UsersPage/>,
      },
      {
        path: '/profiles/:id',
        element: <UserProfilePage/>,
        errorElement: <>Ошибка</>,
      },
      {
        path: '/messages/',
        element: <MessagePage/>,
        errorElement: <>Ошибка</>,
      },
      {
        path: '/chats/:id',
        element: <ChatPage/>
      }
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout/>,
    children: [
      {
        path: 'login',
        element: <LoginPage/>
      }, 
      {
        path: 'register',
        element: <RegisterPage/>
      }
    ]
  },
  {
    path: '*',
    element: <Error/>
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={network}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)


