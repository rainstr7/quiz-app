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
    addAnswerReducer, getTimeReducer, goToTheLastStepReducer, initialTimerFx,
    resetProgressReducer,
    restoreSavedProgressReducer, restoreSavedTimeReducer, ResultType,
    saveProgressBeforeReloadReducer,
    saveProgressFx, saveResultReducer, saveTimeBeforeReloadReducer, TimerType,
} from "../../shared/api/quiz";
import {redirect} from "atomic-router";
import {TIME_IS_UP} from "../../consts";
import {configure} from "effector-logger";

export const currentRoute = routes.quiz;
export const resultsRoute = routes.result;
export const pageMountedEvent = createEvent("pageMountedEvent QuizPage");

export const nextStepEvent = createEvent<React.FormEvent<HTMLFormElement>>("nextStepEvent");
export const saveConfigBeforeReloadEvent = createEvent();
export const restoreSavedProgressEvent = createEvent();
export const resetProgressEvent = createEvent();
export const saveProgressEvent = createEvent<ResultType>();

export const timeIsUpEvent = createEvent();
export const saveTimeBeforeReloadEvent = createEvent()
export const restoreSavedTimeEvent = createEvent()
export const resetTimerEvent = createEvent();
export const getTimeEvent = createEvent<Date | null>();

export const saveTimerIdEvent = createEvent<number>();
export const resetTimerIdEvent = createEvent();

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
    .on(timeIsUpEvent, goToTheLastStepReducer);


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

sample({
    clock: pageMountedEvent,
    target: initialTimerFx
})


sample({
    clock: saveProgressEvent,
    target: saveProgressFx
})

sample({
    clock: saveProgressFx.doneData,
    source: $root,
})

sample({
    clock: saveProgressFx.pending,
    fn: () => true,
    source: $loading
})

sample({
    clock: saveProgressFx.failData,
    fn: () => new Error('something wrong'),
    source: $error
})

sample({
    clock: saveProgressFx.finally,
    fn: () => false,
    source: $loading
})

sample({
    clock: saveProgressFx.doneData,
    source: $root,
})

redirect({
    clock: saveProgressFx.doneData,
    route: resultsRoute,
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

configure([$timer, getTimeEvent], { log: 'disabled' });
