import {createRoutesView} from 'atomic-router-react';
import {MainRoute} from "./Main";
import {QuizRoute} from "./Quiz";
import {ResultRoute} from "./Result";

// import.meta.glob("./*/index.ts")

export const Pages = createRoutesView({
    routes: [MainRoute, QuizRoute, ResultRoute],
});
