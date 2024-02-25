import {useEffect} from "react";
import {useUnit} from "effector-react";
import * as model from "./model";
import MainPage from "./page";
import {currentRoute} from "./model";

const Main = () => {
    const handlePageMount = useUnit(model.pageMountedEvent);

    useEffect(() => {
        handlePageMount();
    }, [handlePageMount]);

    return <MainPage/>
}

export const MainRoute = {
    view: Main,
    route: currentRoute,
}
