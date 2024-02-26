import {useUnit} from "effector-react";
import * as model from "../pages/Quiz/model";
import {useCallback, useEffect} from "react";
import {useBeforeunload} from "react-beforeunload";
import {isNull} from "lodash";
import {$isLastStep} from "../entities/quiz";


const useTimerHook = () => {
    const getTime = useUnit(model.getTimeEvent);
    const saveTimerIdEvent = useUnit(model.saveTimerIdEvent);
    const resetTimerId = useUnit(model.resetTimerIdEvent);
    const timeIsUpEvent = useUnit(model.timeIsUpEvent);
    const timeIsUp = useUnit(model.$timeIsUp);
    const timerId = useUnit(model.$timerId);
    const isLastStep = useUnit($isLastStep);

    useBeforeunload(resetTimerId);

    useEffect(() => {
        if (timeIsUp && timerId) {
            timeIsUpEvent();
        }
    }, [timeIsUp, timeIsUpEvent, timerId]);

    const initialTimer = useCallback((quizExpired: Date | null) => {
        if (quizExpired && !timeIsUp && isNull(timerId) && !isLastStep) {
            saveTimerIdEvent(setInterval(() => {
                getTime(quizExpired);
            }, 500));
        }
    }, [isLastStep, timeIsUp, timerId, saveTimerIdEvent, getTime])

    return {
        initialTimer,
    }
}

export default useTimerHook;
