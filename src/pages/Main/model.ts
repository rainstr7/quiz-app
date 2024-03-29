import {combine, createEvent, createStore, sample} from "effector";
import React, {FormEvent} from "react";
import {$root, $userName, $userRemember} from "../../entities/quiz";
import {routes} from "../../shared/routing";
import {redirect} from "atomic-router";
import {
    initialQuizFx,
    pageMountedReducer,
    saveProgressFx,
    toggleRememberMeReducer,
    updateQuizDataReducer
} from "../../shared/api/quiz";

export const $loading = createStore<boolean>(false);
export const $error = createStore<Error | null>(null);
export const $helperText = createStore<string>(" ");

export const setHelperTextEvent = createEvent<string>("setHelperTextEvent");
export const resetHelperTextEvent = createEvent("resetHelperTextEvent");
export const pageMountedEvent = createEvent("pageMountedEvent MainPage");
export const toggleRememberMeEvent = createEvent<React.ChangeEvent<HTMLInputElement>>("toggleRememberMeEvent");

export const submitFormEvent = createEvent<FormEvent<HTMLFormElement>>("submitFormEvent");

export const currentRoute = routes.main;
export const quizRoute = routes.quiz;

$helperText
    .on(setHelperTextEvent, (_, helperText) => helperText)
    .reset(resetHelperTextEvent);

$root
    .on(pageMountedEvent, pageMountedReducer)
    .on(initialQuizFx.doneData, updateQuizDataReducer)
    .on(toggleRememberMeEvent, toggleRememberMeReducer)

sample({
    clock: submitFormEvent,
    target: initialQuizFx
});

redirect({
    clock: initialQuizFx.done,
    route: quizRoute,
});

sample({
    clock: initialQuizFx.failData,
    fn: () => new Error(''),
    target: $error
});

sample({
    clock: initialQuizFx.pending,
    fn: () => true,
    target: $loading
});

sample({
    clock: saveProgressFx.finally,
    fn: () => false,
    target: $loading
});

export const $formDataStoreCombine = combine({
    helperText: $helperText,
    userName: $userName,
    userRemember: $userRemember,
})
