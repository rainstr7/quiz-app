import {createEffect} from "effector";
import {isNull, shuffle, uniqueId} from "lodash";
import {add, addMinutes, format, formatDuration} from "date-fns";
import React from "react";
import {decode, encode} from "js-base64";
import {LOCAL_STORAGE_KEY, QUIZ_TIMING, TIME_IS_UP} from "../../consts";
import {getTimeDuration} from "../lib/getTimeDuration";
import {Duration} from "date-fns/types";

export type TimerType = Duration | typeof TIME_IS_UP | null;

export type ResultType = {
    score: number;
    timer: TimerType;
    begin: Date | null;
    quizExpired: Date | null;
}

type OptionType = {
    id: string;
    option: string;
}

export interface IQuestion {
    question: string;
    options: OptionType[];
    correctAnswers: string[];
}

export type AnswerType = {
    [k: number]: {
        selectAnswers: string[],
        isCorrectAnswer: boolean
    };
}

export interface IHistoryResults {
    score: number;
    time: string;
    date: string;
}

export interface IQuiz {
    id: string;
    quiz: string;
    content: IQuestion[];
    score: AnswerType;
    quizBegin: Date | null;
    quizExpired: Date | null;
    progress: number;
    user: string;
    saveSession: boolean;
    history?: IHistoryResults[];
}

export interface IQuizAfterLS {
    id: string;
    quiz: string;
    content: IQuestion[];
    score: AnswerType;
    quizBegin: string;
    quizExpired: string;
    progress: number;
    user: string;
    saveSession: boolean;
    history?: IHistoryResults[];
}

export const initialQuizFx = createEffect<React.FormEvent<HTMLFormElement>, IQuiz, Error>(async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const quiz = String(data.get('quiz'));
    const user = String(data.get('name'));
    const id = uniqueId('quiz_');
    const saveSession = data.get('remember') === 'on';
    const content = await import(`../../db/${quiz.replaceAll(" ", "")}.json`);
    const begin = new Date();
    const initialStore: IQuiz = {
        id,
        content: content.default,
        progress: 0,
        quiz,
        quizExpired: addMinutes(begin, QUIZ_TIMING),
        quizBegin: begin,
        score: [],
        user,
        saveSession,
    };
    if (saveSession) {
        localStorage.setItem(LOCAL_STORAGE_KEY, encode(JSON.stringify(initialStore)));
    }
    return initialStore;
});

export const pageMountedReducer = (quiz: IQuiz | null) => {
    const savedStore = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStore && isNull(quiz)) {
        const savedStoreDecoded: IQuiz = JSON.parse(decode(savedStore));
        return savedStoreDecoded
    }
    return quiz;
}

export const updateQuizDataReducer = (quizSaved: IQuiz | null, quiz: IQuiz) => {
    if (quizSaved) {
        return ({...quiz, history: quizSaved.history})
    }
    return quiz
}

export const toggleRememberMeReducer = (quiz: IQuiz | null, event: React.ChangeEvent<HTMLInputElement>) => {
    if (quiz) {
        return ({...quiz, saveSession: event.target.checked})
    }
    return quiz
}

export const addAnswerReducer = (quiz: IQuiz | null, event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isNull(quiz)) {
        return quiz;
    }
    const data = new FormData(event.currentTarget);
    const checked = Array.from(data.keys());
    const checkedIds = checked.map((id) => id);
    if (checkedIds.length === 0) {
        return quiz;
    }
    const {progress, content} = quiz;
    const question = content[progress];
    const isCorrectAnswer = JSON.stringify(checkedIds.sort()) === JSON.stringify(question.correctAnswers.sort());
    return {
        ...quiz,
        progress: quiz!.progress + 1,
        score: {
            ...quiz.score,
            [progress]: {selectAnswers: checkedIds, isCorrectAnswer}
        }
    };
};

export const saveProgressBeforeReloadReducer = (quiz: IQuiz | null) => {
    if (quiz) {
        localStorage.setItem(LOCAL_STORAGE_KEY, (encode(JSON.stringify(quiz))));
    }
    return quiz;
};

export const saveTimeBeforeReloadReducer = (time: TimerType) => {
    if (!isNull(time)) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_time`, encode(JSON.stringify(time)));
    }
    return time;
};

export const restoreSavedTimeReducer = (time: TimerType) => {
    const savedTime = localStorage.getItem(`${LOCAL_STORAGE_KEY}_time`);
    if (isNull(time) && !isNull(savedTime)) {
        const decodedSavedTime: TimerType = JSON.parse(decode(savedTime));
        return decodedSavedTime;
    }
    if (savedTime) {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_time`);
    }
    return time;
};

export const restoreSavedProgressReducer = (quiz: IQuiz | null) => {
    const savedQuiz = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isNull(quiz) && !isNull(savedQuiz)) {
        const decodedSavedQuiz: IQuizAfterLS = JSON.parse(decode(savedQuiz));
        if (!decodedSavedQuiz.saveSession) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        return {
            ...decodedSavedQuiz,
            quizExpired: new Date(decodedSavedQuiz.quizExpired),
            quizBegin: new Date(decodedSavedQuiz.quizBegin)
        };
    }
    return quiz;
};

export const resetProgressReducer = (quiz: IQuiz | null) => {
    if (isNull(quiz)) {
        return quiz;
    }
    const restoredProgress: IQuiz = {
        ...quiz,
        progress: 0,
        score: {},
        content: shuffle(quiz.content),
        quizExpired: addMinutes(new Date(), QUIZ_TIMING)
    }
    return restoredProgress;
}

export const saveProgressFx = createEffect<ResultType, IHistoryResults, Error>(async ({
                                                                                          timer,
                                                                                          score,
                                                                                          begin,
                                                                                          quizExpired
                                                                                      }) => {
    if (begin && timer) {
        if (timer === TIME_IS_UP) {
            return {
                score,
                time: `${QUIZ_TIMING} minutes`,
                date: format(new Date(), 'dd.MM.yyyy HH:mm'),
            }
        }
        const addDuration = add(begin, timer);
        const duration = getTimeDuration(quizExpired, addDuration);
        const restoredProgress: IHistoryResults = {
            score,
            time: formatDuration(duration as Duration, {format: ['minutes', 'seconds']}),
            date: format(new Date(), 'dd.MM.yyyy HH:mm'),
        }
        return restoredProgress;
    }
    return {} as IHistoryResults
});

export const goToTheLastStepReducer = (quiz: IQuiz | null) => {
    if (quiz) {
        const lostQuestions: AnswerType = new Array(quiz.content.length - quiz.progress)
            .fill("")
            .reduce((acc, current, index) => (
                {...acc, [index + quiz.progress]: {selectAnswers: [], isCorrectAnswer: false}}), {});
        return ({...quiz, progress: quiz.content.length, score: {...quiz.score, ...lostQuestions}}) || null;
    }
    return null;
};

export const initialTimerFx = createEffect(() => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_time`);
});

export const getTimeReducer = ((_: TimerType, quizExpired: Date | null) => getTimeDuration(quizExpired));


export const saveResultReducer = ((quiz: IQuiz | null, result: IHistoryResults) => {
    if (quiz) {
        return {...quiz, history: [...(quiz?.history ?? []), result]}
    }
    return null;
});
