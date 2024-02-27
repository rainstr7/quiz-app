import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import styled from "styled-components";
import {Theme} from "@mui/material/styles";
import {IWrapperProps} from "../Layout";

interface IMargin extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: React.ReactNode;
    theme: Theme;
}

const ButtonContainer = ({children}: IWrapperProps) => {
    const theme = useTheme();
    return (
        <Wrapper theme={theme}>
            {children}
        </Wrapper>
    );
}

const Wrapper = styled(((props: IMargin) => <div {...props}/>))`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing(3)};

  & button, a {
    margin-left: ${({theme}) => theme.spacing(1)};
  }
`;

export default ButtonContainer;
