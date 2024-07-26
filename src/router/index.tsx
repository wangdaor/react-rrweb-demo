import { createHashRouter } from "react-router-dom";
import App from "../page/App/App";
import Login from "../page/Login/Login";
import Child from "../page/Child";

const router = createHashRouter([
  { path: "/", element: <App></App> },
  { path: "/login", element: <Login></Login> },
  { path: "/Child", element: <Child></Child> },
]);

export default router;
