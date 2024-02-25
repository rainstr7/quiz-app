
import {RouterProvider} from "atomic-router-react";
import Layout from "../components/Layout";
import {Pages} from "../pages";
import {router} from "../shared/routing";

function App() {
    return (
            <RouterProvider router={router}>
                <Layout>
                    <Pages/>
                </Layout>
            </RouterProvider>
    )
}

export default App
