import QuizPage from "./page";
import {useUnit} from "effector-react";
import * as model from "./model";
import {useBeforeunload} from 'react-beforeunload';
import {useEffect} from "react";
import Spinner from "../../components/Spinner";
import useTimerHook from "../../hooks/useTimer.hook";
import {$quizExpired} from "../../entities/quiz";

const Quiz = () => {
    const restoreSavedProgress = useUnit(model.restoreSavedProgressEvent);
    const pageMountedEvent = useUnit(model.pageMountedEvent);
    const { initialTimer } = useTimerHook();
    const quizExpired = useUnit($quizExpired);
    const loading = useUnit(model.$loading);
    const saveConfigBeforeReload = useUnit(model.saveConfigBeforeReloadEvent);

    useBeforeunload(saveConfigBeforeReload);

    useEffect(() => {
        pageMountedEvent();
        restoreSavedProgress();
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
