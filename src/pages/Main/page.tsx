import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";

import ButtonContainer from "../../components/ButtonContainer";
import {useUnit} from "effector-react";
import * as model from "./model";
import {$userName} from "../../entities/quiz";

const MainPage = () => {
    const helperText = useUnit(model.$helperText);
    const userName = useUnit($userName);
    const resetHelperTextEvent = useUnit(model.resetHelperTextEvent);
    const setHelperTextEvent = useUnit(model.setHelperTextEvent);
    const submitFormEvent = useUnit(model.submitFormEvent);
    console.log('userName', userName);
    return (
        <>
            <Grid container component="section" sx={{height: "fit-content"}}>
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'background_1200.webp',
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "background.default",
                        backgroundSize: "cover",
                        backgroundPosition: "top"
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                        <Avatar sx={{m: 1, backgroundColor: "green"}}/>
                        <Typography component="h1" variant="h5">
                            Welcome
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            onSubmit={submitFormEvent}
                            sx={{mt: 1}}>
                            <TextField
                                margin="dense"
                                key={userName}
                                required
                                fullWidth
                                id="name"
                                label="Your name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                error={helperText !== " "}
                                helperText={helperText}
                                defaultValue={userName}
                                onBlur={(event) => event.target.value.trim() ?
                                    resetHelperTextEvent() :
                                    setHelperTextEvent("Incorrect user name.")}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="quiz">Select quiz</InputLabel>
                                <Select
                                    labelId="quiz"
                                    id="quiz"
                                    name="quiz"
                                    label="Select quiz"
                                    defaultValue="About Me">
                                    <MenuItem value="About Me">About Me</MenuItem>
                                    <MenuItem value="Welcome 2">Welcome 2</MenuItem>
                                    <MenuItem value="Welcome 3">Welcome 3</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        id="remember"
                                        name="remember"
                                    />
                                }
                                label="Remember me"
                            />
                            <ButtonContainer>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                >
                                    LET&apos;S GO
                                </Button>
                            </ButtonContainer>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default MainPage;
