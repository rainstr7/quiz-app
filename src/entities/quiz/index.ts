import {createStore} from "effector";
import {IQuiz} from "../../shared/api/quiz";

export const $root = createStore<IQuiz | null>(null);
export const $quizName = $root.map((quiz) => quiz?.quiz ?? null);
export const $userName = $root.map((quiz) => quiz?.user ?? null);
export const $userRemember = $root.map((quiz) => quiz?.saveSession ?? false);
export const $quizLength = $root.map((quiz) => quiz?.content?.length ?? 0);
export const $numberOfActiveQuestion = $root.map((quiz) => quiz?.progress ?? 0);
export const $quizContent = $root.map((quiz) => quiz?.content ?? null);
export const $currentQuestion = $root.map((quiz) => Array.isArray(quiz?.content) ? quiz?.content[quiz?.progress] : null);
export const $scoreQuiz = $root.map((quiz) => quiz?.score ?? []);
export const $quizExpired = $root.map((quiz) => quiz?.quizExpired ?? null);
export const $quizBegin = $root.map((quiz) => quiz?.quizBegin ?? null);

export const $quizHistory = $root.map((quiz) => quiz?.history ?? []);
export const $isLastStep = $root.map((quiz) => quiz?.content.length === quiz?.progress ?? false);
export const $correctAnswers = $root.map((quiz) => {
    if (quiz) {
        const correct = Object.values(quiz.score).filter((answer) => answer.isCorrectAnswer);
        return correct.length;
    }
    return 0;
})

export const $isAuth = $root.map((quiz) => quiz?.user ?? false) //TODO make secure routing

