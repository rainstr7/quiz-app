import QuizPage from "./page";
import {useUnit} from "effector-react";
import * as model from "./model";
import {useEffect} from "react";
import Spinner from "../../components/Spinner";
import useTimerHook from "../../hooks/useTimer.hook";
import {$quizExpired} from "../../entities/quiz";

const Quiz = () => {
    const pageMountedEvent = useUnit(model.pageMountedEvent);
    const { initialTimer } = useTimerHook();
    const quizExpired = useUnit($quizExpired);
    const loading = useUnit(model.$loading);

    useEffect(() => {
        pageMountedEvent();
    }, [])

    useEffect(() => {
        initialTimer(quizExpired);
    }, [quizExpired])

    return (
        <>
            <QuizPage/>
            {loading && <Spinner/> }
        </>
    )
}

export const QuizRoute = {
    view: Quiz,
    route: model.currentRoute,
}
