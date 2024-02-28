import {routes} from "../../shared/routing";
import {combine, createEvent, createStore, sample} from "effector";
import {
    $correctAnswers, $numberOfActiveQuestion,
    $quizBegin,
    $quizContent,
    $quizExpired,
    $quizLength,
    $root,
    $scoreQuiz
} from "../../entities/quiz";
import React from "react";
import {
    addAnswerReducer,
    addToBeginDurationFx,
    addToBeginDurationReducer,
    getTimeReducer,
    goToTheLastStepReducer,
    initialTimerFx,
    resetProgressReducer,
    restoreSavedProgressReducer,
    restoreSavedTimeReducer,
    saveProgressBeforeReloadReducer,
    saveProgressFx,
    saveResultReducer,
    saveTimeBeforeReloadReducer,
    TimerType,
} from "../../shared/api/quiz";
import {redirect} from "atomic-router";
import {TIME_IS_UP} from "../../consts";
import {configure} from "effector-logger";
import {isNull} from "lodash";

export const currentRoute = routes.quiz;
export const resultsRoute = routes.result;
export const pageMountedEvent = createEvent("pageMountedEvent QuizPage");

export const nextStepEvent = createEvent<React.FormEvent<HTMLFormElement>>("nextStepEvent");
export const saveConfigBeforeReloadEvent = createEvent("saveConfigBeforeReloadEvent");
export const restoreSavedProgressEvent = createEvent("restoreSavedProgressEvent");
export const resetProgressEvent = createEvent("resetProgressEvent");
export const saveProgressEvent = createEvent("saveProgressEvent");

export const timeIsUpEvent = createEvent("timeIsUpEvent");
export const saveTimeBeforeReloadEvent = createEvent("saveTimeBeforeReloadEvent")
export const restoreSavedTimeEvent = createEvent("restoreSavedTimeEvent")
export const resetTimerEvent = createEvent("resetTimerEvent");
export const getTimeEvent = createEvent<Date | null>("getTimeEvent");

export const saveTimerIdEvent = createEvent<number>("saveTimerIdEvent");
export const resetTimerIdEvent = createEvent("resetTimerIdEvent");
export const addToBeginDurationEvent = createEvent("addToBeginDurationEvent");

export const $loading = createStore<boolean>(false);
export const $error = createStore<Error | null>(null);
export const $timer = createStore<TimerType>(null);
export const $timerId = createStore<number | null>(null);

export const $timeIsUp = $timer.map((time) => time === TIME_IS_UP);

$root
    .on(nextStepEvent, addAnswerReducer)
    .on(saveConfigBeforeReloadEvent, saveProgressBeforeReloadReducer)
    .on(restoreSavedProgressEvent, restoreSavedProgressReducer)
    .on(resetProgressEvent, resetProgressReducer)
    .on(saveProgressFx.doneData, saveResultReducer)
    .on(timeIsUpEvent, goToTheLastStepReducer)
    .on(addToBeginDurationFx.doneData, addToBeginDurationReducer)

$loading
    .on(saveProgressFx.pending, (_, status) => status)

$error
    .on(saveProgressFx.failData, (_, error) => error)

$timer
    .on(saveTimeBeforeReloadEvent, saveTimeBeforeReloadReducer)
    .on(restoreSavedTimeEvent, restoreSavedTimeReducer)
    .on(getTimeEvent, getTimeReducer)
    .reset(resetTimerEvent);

$timerId
    .on(saveTimerIdEvent, (_, id) => id)
    .on(resetTimerIdEvent, (id) => {
        if (id) {
            clearInterval(id)
        }
        return null;
    });

export const $StepperCombine = combine({
    content: $quizContent,
    scoreQuiz: $scoreQuiz,
    numberOfActiveQuestion: $numberOfActiveQuestion
})

export const $lastStepCombine = combine({
    timer: $timer,
    correctAnswers: $correctAnswers,
    quizLength: $quizLength,
    quizExpired: $quizExpired,
    begin: $quizBegin
})

sample({
    clock: addToBeginDurationEvent,
    source: $lastStepCombine,
    fn: (stepCombine) => ({
        timer: stepCombine.timer,
        begin: stepCombine.begin,
    }),
    filter: ({timer, begin}) => (
        !isNull(begin) && !isNull(timer) && timer !== TIME_IS_UP
    ),
    target: addToBeginDurationFx
})

sample({
    clock: pageMountedEvent,
    target: initialTimerFx
})

sample({
    clock: saveProgressEvent,
    source: $lastStepCombine,
    fn: (stepCombine) => ({
        timer: stepCombine.timer,
        score: stepCombine.correctAnswers,
        begin: stepCombine.begin,
        quizLength: stepCombine.quizLength,
        quizExpired: stepCombine.quizExpired
    }),
    target: saveProgressFx
})

sample({
    clock: [saveProgressFx.pending, addToBeginDurationFx.pending],
    fn: () => true,
    source: $loading
})

sample({
    clock: [saveProgressFx.failData,  addToBeginDurationFx.failData],
    fn: () => new Error('something wrong'),
    source: $error
})

sample({
    clock: [saveProgressFx.finally, addToBeginDurationFx.finally],
    fn: () => false,
    source: $loading
})

redirect({
    clock: saveProgressFx.done,
    route: resultsRoute,
});

configure([$timer, getTimeEvent], {log: 'disabled'});
