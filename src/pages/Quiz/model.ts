import {routes} from "../../shared/routing";
import {createEvent} from "effector";
import {$root} from "../../entities/quiz";
import {FormEvent} from "react";
import {isNull} from "lodash";
import {IQuiz} from "../../shared/quiz";

export const currentRoute = routes.quiz;

export const nextStepEvent = createEvent<FormEvent<HTMLFormElement>>("nextStepEvent");

const checkResults = (quiz: IQuiz | null, event: React.FormEvent<HTMLFormElement>) => {
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
    const { progress, content } = quiz;
    const question = content[progress];
    const isCorrectAnswer = JSON.stringify(checkedIds.sort()) === JSON.stringify(question.correctAnswers.sort());
    return {
        ...quiz,
        progress: quiz!.progress + 1,
        score: {
            ...quiz.score,
            [progress]: { selectAnswers: checkedIds, isCorrectAnswer }
        }
    };
};

$root.on(nextStepEvent, checkResults)
