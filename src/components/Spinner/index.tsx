import CircularProgress from '@mui/material/CircularProgress';
import {Backdrop} from "@mui/material";

const Spinner = () => {
    return (
        <Backdrop
            sx={{color: '#FFFFFF', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open
        >
            <CircularProgress/>
        </Backdrop>
    )
};

export default Spinner;
