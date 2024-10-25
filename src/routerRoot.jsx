import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Root from "./routes/root.jsx";
import ErrorPage from "./components/errorPage.jsx";
import RegisterForm from "./components/functional/registerForm.jsx";

function RouterRoot() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root/>,
            errorElement: <ErrorPage/>,
            children: [
                {},
            ],
        },
        {
            path: "/register",
            element: <RegisterForm/>,
            errorElement: <ErrorPage/>,

        }
    ]);
    return (
        <RouterProvider router={router}/>
    )
}

export default RouterRoot
