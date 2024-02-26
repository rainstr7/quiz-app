import {currentRoute} from "./model";
import ResultPage from "./page";

const Result = () => {
    return <ResultPage />;
}

export const ResultRoute = {
    view: Result,
    route: currentRoute
}
