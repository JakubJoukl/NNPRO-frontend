import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import Root from "./routes/root.jsx";
import ErrorPage from "./components/errorPage.jsx";
import {GlobalAlertContext} from "./context/globalAlertContext.js";
import withAlert from "./components/visual/withAlert.jsx";
import RegisterRoute from "./routes/registerRoute.jsx";
import {AccountManagementRoute} from "./routes/AccountManagementRoute.jsx";
import {ContactsRoute} from "./routes/contactsRoute.jsx";
import {NewConversationRoute} from "./routes/newConversationRoute.jsx";
import {ConversationRoute} from "./routes/conversationRoute.jsx";

function RouterRoot({openAlert, closeAlert}) {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Root/>,
            errorElement: <ErrorPage/>,
            children: [
                {
                    path: "/accountManagement",
                    element: <AccountManagementRoute/>,
                    errorElement: <ErrorPage/>,
                },
                {
                    path: "/contacts",
                    element: <ContactsRoute/>,
                    errorElement: <ErrorPage/>,
                },
                {
                    path: "/newConversation",
                    element: <NewConversationRoute/>,
                    errorElement: <ErrorPage/>,
                },
                {
                    path: "/conversation/:id",
                    element: <ConversationRoute/>,
                    errorElement: <ErrorPage/>,
                }
            ],
        },
        {
            path: "/register",
            element: <RegisterRoute/>,
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
