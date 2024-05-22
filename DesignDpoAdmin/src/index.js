import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Context from './Context';
import Addslider from './Pages/Addslider';
import Addcard from './Pages/Addcard';
import Viewuser from './Pages/Viewuser';
import Viewslider from './Pages/Viewslider';
import Viewcard from './Pages/Viewcard';
import Adddesign from './Pages/Adddesign';
import ViewDesign from './Pages/ViewDesign';
import AddProduct from './Pages/AddProduct';
import ViewProduct from './Pages/ViewProduct';


const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path:"/",
    element:<Login/>
  },
  {
    path:"dashboard",
    element:<Dashboard/>
  },
  {
    path:"adddesign/:id?",
    element:<Adddesign/>
  },
  {
    path:"addslider/:id?",
    element:<Addslider/>
  },
  {
    path:"addproduct/:id?",
    element:<AddProduct/>
  },
  {
    path:"addcard/:id?",
    element:<Addcard/>
  },
  {
    path:"viewuser",
    element:<Viewuser/>
  },
  {
    path:"viewdesign",
    element:<ViewDesign/>
  },
  {
    path:"viewslider",
    element:<Viewslider/>
  },
  {
    path:"viewproduct",
    element:<ViewProduct/>
  },
  {
    path:"viewcard",
    element:<Viewcard/>
  }
])
root.render(
   <Context>
  <RouterProvider router={router}/>

   </Context>

  // <React.StrictMode>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
