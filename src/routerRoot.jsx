import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Root from "./routes/root.jsx";
import ErrorPage from "./components/errorPage.jsx";
import Register from "./components/visual/register.jsx";

function RouterRoot() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "/register",
                    element: <Register/>,
                },
            ],
        },
    ]);
    return (
        <RouterProvider router={router}/>
    )
}

export default RouterRoot
