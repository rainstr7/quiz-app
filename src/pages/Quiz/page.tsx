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
    $numberOfActiveQuestion, $quizContent,
    $quizLength,
    $quizName,
    $scoreQuiz,
    $userName
} from "../../entities/quiz";
import React, {useMemo} from "react";
import {CheckCircle, RemoveCircle} from "@mui/icons-material";
import Question from "../../components/Question";
import * as model from "./model";
import ButtonContainer from "../../components/ButtonContainer";
import {Link} from "atomic-router-react";
import {routes} from "../../shared/routing";

const getIcon = (isTrue?: boolean) => {
    switch (isTrue) {
        case true:
            return <CheckCircle color='success'/>
        case false:
            return <RemoveCircle color='error'/>
        default:
            return undefined
    }
}

const LastStep = () => {
    // const resetSteps = useUnit(model.resetSteps);
    // const resetTimer = useUnit(model.resetTimer);
    // const resetTimerId = useUnit(model.resetTimerId);
    // const timer = useUnit($timer);

    // useEffect(() => {
    //     resetTimerId();
    // }, []);

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
    };

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Thank you for your try.
            </Typography>
            <Typography variant="subtitle1">
                Though no one can go back and make a brand new start, anyone can start from
                now and make a brand new ending." — Carl Bard
            </Typography>
            <ButtonContainer>
                <Button onClick={handleButtonClick} id='repeat_button'>
                    Repeat
                </Button>
                <Button
                    component={Link}
                    variant="contained"
                    color="primary"
                    id='save_button'
                    to={routes.result}
                >
                    Save results
                </Button>
            </ButtonContainer>
        </>
    );
}

const StepContent = () => {
    // const nextStep = useUnit(model.nextStep);
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
            { content?.map(({ question}, index) => {
                return (
                    <Step key={question} completed={scoreQuiz[index]?.isCorrectAnswer}>
                        <StepLabel
                            icon={getIcon(scoreQuiz[index]?.isCorrectAnswer)}
                        />
                    </Step>
                );
            })}
        </Stepper>
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
                <Typography variant="h6" color="inherit" noWrap>
                    {/*{timer}*/}1
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

const QuizPage = () => {
    const theme = useTheme();
    const quizName = useUnit($quizName);
    const quizLength = useUnit($quizLength);
    const numberOfActiveQuestion = useUnit($numberOfActiveQuestion);

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
                    numberOfActiveQuestion === quizLength ?
                        <LastStep /> :
                        <StepContent />
                }
            </Paper>
        </Box>
    );
}

export default QuizPage;
