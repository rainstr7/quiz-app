import {createHistoryRouter, createRoute, createRouterControls} from "atomic-router";
import {createBrowserHistory} from "history";
import {sample} from "effector";
import {appStarted} from "./config/init";

export const routes = {
    main: createRoute(),
    quiz: createRoute(),
    result: createRoute()
}

export const controls = createRouterControls()

export const router = createHistoryRouter({
    routes: [
        {
            path: '/',
            route: routes.main
        },
        {
            path: '/quiz',
            route: routes.quiz
        },
        {
            path: '/result',
            route: routes.result
        }
    ],
    controls,
})

sample({
    clock: appStarted,
    fn: () => createBrowserHistory(),
    target: router.setHistory,
})
