import {createEffect} from "effector";
import {isNull, shuffle, uniqueId} from "lodash";
import {addMinutes} from "date-fns";
import React from "react";
import {decode, encode} from "js-base64";
import {LOCAL_STORAGE_KEY, QUIZ_TIMING} from "../../consts";
import {getWait} from "../lib/getWait";
import {getTimeDuration} from "../lib/getTimeDuration";

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

interface IIHistoryResults {
    score: AnswerType;
    time: string;
    lengthQuiz: number;
}

export interface IQuiz {
    id: string;
    quiz: string;
    content: IQuestion[];
    score: AnswerType;
    quizExpired: Date | null;
    progress: number;
    user: string;
    saveSession: boolean;
    history: IIHistoryResults[];
}

export interface IQuizAfterLS {
    id: string;
    quiz: string;
    content: IQuestion[];
    score: AnswerType;
    quizExpired: string;
    progress: number;
    user: string;
    saveSession: boolean;
    history: IIHistoryResults[];
}

export const initialQuizFx = createEffect<React.FormEvent<HTMLFormElement>, IQuiz, Error>(async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const quiz = String(data.get('quiz'));
    const user = String(data.get('name'));
    const id = uniqueId('quiz_');
    const saveSession = data.get('remember') === 'on';
    const content = await import(`../../db/${quiz.replaceAll(" ", "")}.json`);
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

export const pageMountedReducer = (quiz: IQuiz | null) => {
    const savedStore = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStore) {
        const savedStoreDecoded: IQuiz = JSON.parse(decode(savedStore));
        return savedStoreDecoded
    }
    return quiz;
}

export const updateQuizDataReducer = (_: IQuiz | null, quiz: IQuiz) => quiz

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
        localStorage.setItem(LOCAL_STORAGE_KEY, encode(JSON.stringify(quiz)));
    }
    return quiz;
};

export const saveTimeBeforeReloadReducer = (time: string | null) => {
    if (!isNull(time)) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_time`, time);
    }
    return time;
};

export const restoreSavedTimeReducer = (time: string | null) => {
    const savedTime = localStorage.getItem(`${LOCAL_STORAGE_KEY}_time`);
    if (isNull(time) && !isNull(savedTime)) {
        const decodedSavedTime: string = savedTime;
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
        return {...decodedSavedQuiz,quizExpired: new Date(decodedSavedQuiz.quizExpired)};
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

export const saveProgressFx = createEffect<IQuiz | null, IQuiz | null, Error>(async (quiz: IQuiz | null) => {
    if (isNull(quiz)) {
        return quiz;
    }
    await getWait();
    const restoredProgress: IQuiz = {
        ...quiz,
        history: [...quiz.history, {
            score: quiz.score,
            time: '',
            lengthQuiz: quiz.content.length,
        }],
        progress: 0,
        score: {},
        content: [],
        quizExpired: null
    }
    return restoredProgress;
});

export const goToTheLastStepReducer = (quiz: IQuiz | null) => {
    if (quiz) {
        const lostQuestions: AnswerType = new Array(quiz.content.length - quiz.progress)
            .fill("")
            .reduce((acc, current, index) => (
                { ...acc, [index + quiz.progress]: { selectAnswers: [], isCorrectAnswer: false } }), {});
        return ({ ...quiz, progress: quiz.content.length, score: { ...quiz.score, ...lostQuestions } }) || null;
    }
    return null;
};

export const initialTimerFx = createEffect(() => {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_time`);
});

export const getTimeReducer = ((_: string | null, quizExpired: Date | null) => getTimeDuration(quizExpired));
