import {useEffect} from "react";
import {useUnit} from "effector-react";
import * as model from "./model";
import MainPage from "./page";
import {currentRoute} from "./model";
import Spinner from "../../components/Spinner";

const Main = () => {
    const pageMount = useUnit(model.pageMountedEvent);
    const loading = useUnit(model.$loading)

    useEffect(() => {
        pageMount();
    }, [pageMount]);

    return (
        <>
            <MainPage/>
            {loading && <Spinner/>}
        </>

    )
}

export const MainRoute = {
    view: Main,
    route: currentRoute,
}
