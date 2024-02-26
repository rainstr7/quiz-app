import {CheckCircle, RemoveCircle} from "@mui/icons-material";

const getAnswerIcon = (isTrue?: boolean) => {
    switch (isTrue) {
        case true:
            return <CheckCircle color='success'/>
        case false:
            return <RemoveCircle color='error'/>
        default:
            return undefined
    }
}

export default getAnswerIcon;
