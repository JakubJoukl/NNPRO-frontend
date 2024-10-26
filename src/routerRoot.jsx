import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Root from "./routes/root.jsx";
import ErrorPage from "./components/errorPage.jsx";
import RegisterForm from "./components/functional/registerForm.jsx";
import {GlobalAlertContext} from "./context/globalAlertContext.js";
import withAlert from "./components/visual/withAlert.jsx";

function RouterRoot({openAlert, closeAlert}) {

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
        <GlobalAlertContext.Provider value={{openAlert, closeAlert}}>
            <RouterProvider router={router}/>
        </GlobalAlertContext.Provider>
    )
}

export default withAlert(RouterRoot)
