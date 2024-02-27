import React from 'react';
import {
    Box,
    Container,
    CssBaseline,
} from '@mui/material';
import Copyright from '../Copyright';

export interface IWrapperProps {
    children: React.ReactNode;
}

const Layout = ({children}: IWrapperProps) => {
    return (
        <>
            <CssBaseline/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    backgroundColor: 'background.default'
                }}>
                <Container
                    component="main"
                    sx={{
                        mt: 8,
                        mb: 2,
                        display: 'flex',
                        flexGrow: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    {children}
                </Container>
                <Box
                    component="footer"
                    sx={{
                        py: 3,
                        px: 2,
                        mt: 'auto',
                    }}
                >
                    <Container maxWidth="lg">
                        <Copyright/>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default Layout;
