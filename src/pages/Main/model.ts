import {createEvent, createStore, sample} from "effector";
import {FormEvent} from "react";
import {IQuiz, submitFormFx} from "../../shared/quiz";
import {$root} from "../../entities/quiz";
import {routes} from "../../shared/routing";
import {redirect} from "atomic-router";
import {LOCAL_STORAGE_KEY} from "../../consts";
import {decode} from "js-base64";

export const $helperText = createStore<string>(" ");

export const setHelperTextEvent = createEvent<string>("setHelperTextEvent");
export const resetHelperTextEvent = createEvent("resetHelperTextEvent");
export const pageMountedEvent = createEvent("pageMountedEvent");

export const submitFormEvent = createEvent<FormEvent<HTMLFormElement>>("submitFormEvent");

export const currentRoute = routes.main;
export const quizRoute = routes.quiz;

$helperText
    .on(setHelperTextEvent, (_, helperText) => helperText)
    .reset(resetHelperTextEvent);

$root
    .on(pageMountedEvent, () => {
        const savedStore = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedStore) {
            const savedStoreDecoded: IQuiz = JSON.parse(decode(savedStore));
            return savedStoreDecoded
        }
        return null;
    })
    .on(submitFormFx.doneData, (_, quiz: IQuiz) => quiz);

sample({
    clock: submitFormEvent,
    target: submitFormFx
});

redirect({
    clock: submitFormFx.done,
    route: quizRoute,
});

sample({
    clock: submitFormFx.doneData,
    target: $root
});
