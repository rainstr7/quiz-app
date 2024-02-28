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

const MainPage = () => {
    const resetHelperText = useUnit(model.resetHelperTextEvent);
    const setHelperText = useUnit(model.setHelperTextEvent);
    const submitForm = useUnit(model.submitFormEvent);
    const toggleRememberMe = useUnit(model.toggleRememberMeEvent);
    const {
        helperText,
        userName,
        userRemember,
    } = useUnit(model.$formDataStoreCombine);

    return (
        <>
            <Grid container component="section" sx={{
                height: "fit-content",
                justifyContent: 'center',
                p: 2,
            }}
            >
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: "url(https://thumbnail.hh.ru/vacancy/89375809.png?lcth=eba17e0f96d1b4c229ef3ceb51407b74&host=hh.ru)",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "background.default",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        p: 2,
                        display: {
                            xs: 'none',
                            sm: 'none',
                            md: 'none',
                            lg: 'block'
                        }
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
                            onSubmit={submitForm}
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
                                    resetHelperText() :
                                    setHelperText("Incorrect user name.")}
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
                                    <MenuItem value="Java Script">Java Script</MenuItem>
                                    <MenuItem value="React">React</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        id="remember"
                                        name="remember"
                                        checked={userRemember}
                                        onChange={toggleRememberMe}
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
