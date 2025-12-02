import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DataCollection from "./pages/DataCollection";
import Results from "./pages/Results";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/datacollection",
    element: <DataCollection />,
  },
  {
    path: "/results",
    element: <Results />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
