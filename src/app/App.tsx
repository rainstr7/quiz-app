
import {RouterProvider} from "atomic-router-react";
import Layout from "../components/Layout";
import {Pages} from "../pages";
import {router} from "../shared/routing";
import {useEffect} from "react";
import {useUnit} from "effector-react";
import * as model from "../pages/Quiz/model";
import {useBeforeunload} from "react-beforeunload";

function App() {
    const saveConfigBeforeReload = useUnit(model.saveConfigBeforeReloadEvent);

    useBeforeunload(saveConfigBeforeReload);
    const restoreSavedProgress = useUnit(model.restoreSavedProgressEvent);


    useEffect(() => {
        restoreSavedProgress();
    }, [])
    return (
            <RouterProvider router={router}>
                <Layout>
                    <Pages/>
                </Layout>
            </RouterProvider>
    )
}

export default App
