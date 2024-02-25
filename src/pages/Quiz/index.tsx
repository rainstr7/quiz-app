import {currentRoute} from "./model";
import QuizPage from "./page";

const Quiz = () => {
    return <QuizPage />
}

export const QuizRoute = {
    view: Quiz,
    route: currentRoute,
}
