import {Link, Typography} from "@mui/material";
import React from "react";

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 5 }}>
            {'Copyright ©'}
            <Link color="inherit" href="https://github.com/rainstr7">
                &nbsp;Maksim Grigorev
            </Link>
            &nbsp;
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;
