import {routes} from "../../shared/routing";
import {createEvent, createStore, sample} from "effector";
import {$quizExpired, $root} from "../../entities/quiz";
import React from "react";
import {
    addAnswerReducer, getTimeReducer, goToTheLastStepReducer, initialTimerFx,
    resetProgressReducer,
    restoreSavedProgressReducer, restoreSavedTimeReducer,
    saveProgressBeforeReloadReducer,
    saveProgressFx, saveTimeBeforeReloadReducer,
} from "../../shared/api/quiz";
import {redirect} from "atomic-router";
import {TIME_IS_UP} from "../../consts";

export const currentRoute = routes.quiz;
export const resultsRoute = routes.result;
export const pageMountedEvent = createEvent("pageMountedEvent QuizPage");

export const nextStepEvent = createEvent<React.FormEvent<HTMLFormElement>>("nextStepEvent");
export const saveConfigBeforeReloadEvent = createEvent();
export const restoreSavedProgressEvent = createEvent();
export const resetProgressEvent = createEvent();
export const saveProgressEvent = createEvent();

export const timeIsUpEvent = createEvent();
export const saveTimeBeforeReloadEvent = createEvent()
export const restoreSavedTimeEvent = createEvent()
export const resetTimerEvent = createEvent();
export const getTimeEvent = createEvent<Date | null>();

export const saveTimerIdEvent = createEvent<number>();
export const resetTimerIdEvent = createEvent();

export const $loading = createStore<boolean>(false);
export const $error = createStore<Error | null>(null);
export const $timer = createStore<string | null>(null);
export const $timerId = createStore<number | null>(null);

export const $timeIsUp = $timer.map((time) => time === TIME_IS_UP);

$timeIsUp.watch((time) => {console.log('timeIsUp watch', time)})
$timer.watch((time) => {console.log('timer watch', time)})
$timerId.watch((time) => {console.log('$timerId watch', time)})
$quizExpired.watch((expired) => {console.log('$quizExpired watch', expired)})

$root
    .on(nextStepEvent, addAnswerReducer)
    .on(saveConfigBeforeReloadEvent, saveProgressBeforeReloadReducer)
    .on(restoreSavedProgressEvent, restoreSavedProgressReducer)
    .on(resetProgressEvent, resetProgressReducer)
    .on(saveProgressEvent, (_, quiz) => quiz)
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
    source: $root,
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
