import {createStore} from "effector";
import {IQuiz} from "../../shared/quiz";

export const $root = createStore<IQuiz | null>(null);
export const $quizName = $root.map((quiz) => quiz?.quiz ?? null);
export const $userName = $root.map((quiz) => quiz?.user ?? null);
export const $quizLength = $root.map((quiz) => quiz?.content.length ?? 0);
export const $numberOfActiveQuestion = $root.map((quiz) => quiz?.progress ?? 0);
export const $quizContent = $root.map((quiz) => quiz?.content ?? null);
export const $currentQuestion = $root.map((quiz) => Array.isArray(quiz?.content) ? quiz?.content[quiz?.progress] : null);
export const $scoreQuiz = $root.map((quiz) => quiz?.score ?? []);
