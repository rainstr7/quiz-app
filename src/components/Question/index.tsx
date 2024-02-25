import { Box, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import React from "react";
import { shuffle } from "lodash";
import useTheme from "@mui/material/styles/useTheme";
import ButtonContainer from "../ButtonContainer";

type OptionType = {
  id: string;
  option: string;
}

export interface IQuestion {
  question: string;
  options: OptionType[];
  correctAnswers: string[];
}

interface IQuestionProps  extends Omit<IQuestion, 'correctAnswers'> {
  onHandleNext: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Question = ({onHandleNext, question, options}: IQuestionProps) => {
  const theme = useTheme();
  return (
  <Box sx={{display: 'flex', flexDirection: 'column'}}
       component="form"
       noValidate
       onSubmit={onHandleNext}
  >
    <Typography>{question}</Typography>
    {shuffle(options).map(({option, id}) => (
      <FormControlLabel
        control={
          <Checkbox color="primary" id={id} name={id} />
        }
        label={option}
        key={option}
      />
    ))}
    <ButtonContainer>
    <Button
      type='submit'
      variant="contained"
      color="primary"
      sx={{
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
      }}>
      {'Next'}
    </Button>
    </ButtonContainer>
  </Box>
  );
}

export default Question;
