import useTheme from "@mui/material/styles/useTheme";
import {
    AppBar,
    Avatar,
    Box, Button, Chip,
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
    $quizName,
    $userName
} from "../../entities/quiz";
import React, {useEffect, useMemo} from "react";
import Question from "../../components/Question";
import * as model from "./model";
import ButtonContainer from "../../components/ButtonContainer";
import {IQuestion} from "../../shared/api/quiz";
import getAnswerIcon from "../../shared/lib/getAnswerIcon";
import {useBeforeunload} from "react-beforeunload";
import {getColorAndMessage} from "../../shared/lib/getColorAndMessage";
import {formatDuration} from "date-fns";
import {TIME_IS_UP} from "../../consts";
import {isNull} from "lodash";
import {SportsScore} from "@mui/icons-material";
import {$StepperCombine} from "./model";

const LastStep = () => {
    const resetProgress = useUnit(model.resetProgressEvent);
    const resetTimer = useUnit(model.resetTimerEvent);
    const saveTimeBeforeReload = useUnit(model.saveTimeBeforeReloadEvent);
    const saveProgressEvent = useUnit(model.saveProgressEvent);
    const resetTimerId = useUnit(model.resetTimerIdEvent);
    const restoreSavedTimer = useUnit(model.restoreSavedTimeEvent);
    const {
        timer,
        correctAnswers,
        quizLength,
        quizExpired,
        begin
    } = useUnit(model.$lastStepCombine);

    useBeforeunload(saveTimeBeforeReload);

    const handleClickRepeat = () => {
        resetProgress();
        resetTimer();
    }
    const label = useMemo(() => {
        const [color, message] = getColorAndMessage(correctAnswers / quizLength);
        return (
            <Box>
                <Chip
                    icon={<SportsScore/>}
                    label={`${correctAnswers} / ${quizLength}`}
                    color={color}
                    sx={{m: 1}}
                />
                <br/>
                <Typography variant="body2" sx={{textAlign: 'center'}}>
                    {message}
                </Typography>
            </Box>)
    }, [correctAnswers, quizLength])

    useEffect(() => {
        resetTimerId();
        restoreSavedTimer();
    }, [])

    return (
        <>
            {label}
            <ButtonContainer>
                <Button onClick={() => handleClickRepeat()} id='repeat_button'>
                    Repeat
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    id='save_button'
                    onClick={() => saveProgressEvent({score: correctAnswers / quizLength, begin, quizExpired, timer})}
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
    const {
        content,
        scoreQuiz,
        numberOfActiveQuestion
    } = useUnit($StepperCombine);

    const theme = useTheme();
    return (
        <Stepper
            activeStep={numberOfActiveQuestion}
            connector={<StepConnector/>}
            sx={{
                padding: theme.spacing(3, 0, 5),
                display: {
                    xs: 'none',
                    sm: 'flex'
                }
            }}>
            {content?.map(({question}: IQuestion, index: number) => {
                return (
                    <Step key={`${question}_${index}`} completed={scoreQuiz[index]?.isCorrectAnswer}>
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
    if (isNull(timer)) {
        return null
    }
    return (
        <Typography variant="h6" color="inherit" noWrap>
            {timer === TIME_IS_UP ? TIME_IS_UP : formatDuration(timer, {
                format: ['minutes', 'seconds']
            })}
        </Typography>
    );
}

const Bar = () => {
    const userName = useUnit($userName);

    return (
        <AppBar position="absolute" color="default">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <Avatar sx={{m: 1}}/>
                    <Typography variant="h6" color="inherit" noWrap>
                        {userName}
                    </Typography>
                </Box>
                <Timer/>
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
        minWidth: '25rem'
    }), [theme]);

    return (
        <Box>
            <Bar/>
            <Paper
                sx={sx}>
                <Typography component="h1" variant="h4" align="left">
                    {quizName}
                </Typography>
                <QuizStepper/>
                {
                    isLastStep ?
                        <LastStep/> :
                        <StepContent/>
                }
            </Paper>
        </Box>
    );
}

export default QuizPage;
