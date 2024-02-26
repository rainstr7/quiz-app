import useTheme from "@mui/material/styles/useTheme";
import {
    AppBar,
    Avatar,
    Box, Button,
    Paper,
    Step,
    StepConnector,
    StepLabel,
    Stepper,
    Toolbar,
    Typography
} from "@mui/material";
import {useUnit} from "effector-react/effector-react.umd";
import {
    $currentQuestion,
    $isLastStep,
    $numberOfActiveQuestion,
    $quizContent,
    $quizName,
    $scoreQuiz,
    $userName
} from "../../entities/quiz";
import React, {useEffect, useMemo} from "react";
import Question from "../../components/Question";
import * as model from "./model";
import ButtonContainer from "../../components/ButtonContainer";
import {IQuestion} from "../../shared/api/quiz";
import getAnswerIcon from "../../shared/lib/getAnswerIcon";
import {useBeforeunload} from "react-beforeunload";

const LastStep = () => {
    const resetProgress = useUnit(model.resetProgressEvent);
    const resetTimer = useUnit(model.resetTimerEvent);
    const saveTimeBeforeReload = useUnit(model.saveTimeBeforeReloadEvent);
    const saveProgressEvent = useUnit(model.saveProgressEvent);
    const resetTimerId = useUnit(model.resetTimerIdEvent);
    const restoreSavedTimer = useUnit(model.restoreSavedTimeEvent);

    useBeforeunload(saveTimeBeforeReload);

    const handleClickRepeat = () => {
        resetProgress();
        resetTimer();
    }

    useEffect(()  => {
        resetTimerId();
        restoreSavedTimer();
    }, [])

    return (
        <>
            <Typography variant="h5" gutterBottom>
                My congratulations to you!
            </Typography>
            <Typography variant="subtitle1">
                Though no one can go back and make a brand new start, anyone can start from
                now and make a brand new ending." — Carl Bard
            </Typography>
            <ButtonContainer>
                <Button onClick={() => handleClickRepeat()} id='repeat_button'>
                    Repeat
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    id='save_button'
                    onClick={() => saveProgressEvent()}
                >
                    Save results
                </Button>
            </ButtonContainer>
        </>
    );
}

const StepContent = () => {
    const currentQuestion = useUnit($currentQuestion);
    const nextStep = useUnit(model.nextStepEvent);

    if (!currentQuestion) {
        return <Typography color='error'>Something wrong. Incorrect question</Typography>
    }
    const {question, options} = currentQuestion;
    return <Question question={question} options={options} onHandleNext={nextStep}/>;
}


const QuizStepper = () => {
    const numberOfActiveQuestion = useUnit($numberOfActiveQuestion);
    const content = useUnit($quizContent);
    const scoreQuiz = useUnit($scoreQuiz);
    const theme = useTheme();
    return (
        <Stepper
            activeStep={numberOfActiveQuestion}
            connector={<StepConnector />}
            sx={{
                padding: theme.spacing(3, 0, 5),
            }}>
            { content?.map(({ question}: IQuestion, index: number) => {
                return (
                    <Step key={question} completed={scoreQuiz[index]?.isCorrectAnswer}>
                        <StepLabel
                            icon={getAnswerIcon(scoreQuiz[index]?.isCorrectAnswer)}
                        />
                    </Step>
                );
            })}
        </Stepper>
    );
}

const Timer = () => {
    const timer = useUnit(model.$timer);
    return (
        <Typography variant="h6" color="inherit" noWrap>
            {timer}
        </Typography>
    );
}

const Bar = () => {
    const userName = useUnit($userName);

    return (
        <AppBar position="absolute" color="default">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Avatar sx={{m: 1}} />
                    <Typography variant="h6" color="inherit" noWrap>
                        {userName}
                    </Typography>
                </Box>
                <Timer />
            </Toolbar>
        </AppBar>
    );
}

const QuizPage = () => {
    const theme = useTheme();
    const quizName = useUnit($quizName);
    const isLastStep = useUnit($isLastStep);

    const sx = useMemo(() => ({
        width: 'auto',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
    }), [theme]);

    return (
        <Box>
            <Bar />
            <Paper
                sx={sx}>
                <Typography component="h1" variant="h4" align="left">
                    {quizName}
                </Typography>
                <QuizStepper />
                {
                    isLastStep ?
                        <LastStep /> :
                        <StepContent />
                }
            </Paper>
        </Box>
    );
}

export default QuizPage;
