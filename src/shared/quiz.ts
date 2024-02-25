import {createEffect} from "effector";
import {uniqueId} from "lodash";
import {addMinutes} from "date-fns";
import {LOCAL_STORAGE_KEY, QUIZ_TIMING} from "../consts";
import {IQuestion} from "../components/Question";
import {FormEvent} from "react";
import {encode} from "js-base64";

export type AnswerType = {
    [k: number]: {
        selectAnswers: string[],
        isCorrectAnswer: boolean
    };
}

interface IIHistoryResults {
    score: AnswerType;
    time: Date;
    lengthQuiz: number;
}

export interface IQuiz {
    id: string;
    quiz: string;
    content: IQuestion[];
    score: AnswerType;
    quizExpired: Date;
    progress: number;
    user: string;
    saveSession: boolean;
    history: IIHistoryResults[];
}

export const submitFormFx = createEffect<FormEvent<HTMLFormElement>, IQuiz, Error>(async (event)  => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const quiz = String(data.get('quiz'));
    const user = String(data.get('name'));
    const id = uniqueId('quiz_');
    const saveSession = data.get('remember') === 'on';
    const content = await import(`../db/${quiz.replaceAll(" ", "")}.json`);
    const initialStore: IQuiz = {
        id,
        content: content.default,
        progress: 0,
        quiz,
        quizExpired: addMinutes(new Date(), QUIZ_TIMING),
        score: [],
        user,
        saveSession,
        history: [],
    };
    if (saveSession) {
        localStorage.setItem(LOCAL_STORAGE_KEY, encode(JSON.stringify(initialStore)));
    }
    return initialStore;
});
