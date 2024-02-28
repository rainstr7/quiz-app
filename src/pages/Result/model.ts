import {routes} from "../../shared/routing";
import {$quizHistory} from "../../entities/quiz";

export const currentRoute = routes.result;
export const mainPage = routes.main;

export const $history = $quizHistory.map((history) => history.slice(-3));
