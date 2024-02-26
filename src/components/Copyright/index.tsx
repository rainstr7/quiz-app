import {Link, Typography} from "@mui/material";
import React from "react";

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 5 }}>
            {'Copyright ©'}
            <Link color="inherit" href="https://hh.ru/resume/93ea5a59ff08ddfcbd0039ed1f47465a333451">
                &nbsp;Maksim Grigorev
            </Link>
            &nbsp;
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;
