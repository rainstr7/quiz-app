import {useList} from "effector-react";
import {
    Box, Button,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from "@mui/material";
import {Face, AlarmOn} from "@mui/icons-material";
import React, {useMemo} from "react";
import useTheme from "@mui/material/styles/useTheme";
import {IHistoryResults} from "../../shared/api/quiz";
import {getColorAndMessage} from "../../shared/lib/getColorAndMessage";
import ButtonContainer from "../../components/ButtonContainer";
import {Link} from "atomic-router-react";
import {$history, mainPage} from "./model";

const ListResultItem = ({date, time, score}: IHistoryResults) => {
    const [color] = getColorAndMessage(score);
    return (
        <ListItem alignItems="flex-start">
            <ListItemText
                primary={date}
                secondary={
                    <Typography
                        component="span"
                        variant="body2"
                        color={color}
                    >
                        <Chip
                            icon={<Face/>}
                            label={`${score * 100}%`}
                            color={color}
                            sx={{mt: 1}}
                        />
                        <br/>
                        <Chip
                            icon={<AlarmOn/>}
                            label={time}
                            color="info"
                            sx={{mt: 1}}
                        />
                    </Typography>
                }
            />
        </ListItem>
    );
}

const ListResults = () => {
    const theme = useTheme();
    const list = useList($history, (post) => (
        <React.Fragment key={post.date + post.score}>
            <ListResultItem {...post}/>
            <Divider variant="inset" component="li"/>
        </React.Fragment>
    ));
    return (
        <List sx={{
            width: '100%',
            maxWidth: '36ch',
            backgroundColor: theme.palette.background.default,
            pr: 10
        }}>
            {list}
        </List>
    );
}

const ResultPage = () => {
    const theme = useTheme();

    const sx = useMemo(() => ({
        width: 'auto',
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        minWidth: '25rem'
    }), [theme]);

    return (
        <Box>
            <Paper
                sx={sx}>
                <Typography component="h1" variant="h4" align="left">
                    Results
                </Typography>
                <ListResults/>
                <ButtonContainer>
                    <Button
                        component={Link}
                        id='go-to-begin'
                        to={mainPage}
                        variant="contained"
                        color="primary">
                        new try
                    </Button>
                </ButtonContainer>
            </Paper>
        </Box>
    );
}

export default ResultPage;
