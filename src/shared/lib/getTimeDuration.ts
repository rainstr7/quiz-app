import {intervalToDuration} from 'date-fns'
import {isNull, isUndefined} from "lodash";
import {TIME_IS_UP} from "../../consts";
import {Duration} from "date-fns/types";

export const getTimeDuration = (deadline: Date | null, anchor: Date = new Date()): Duration | typeof TIME_IS_UP | null => {

    if (isNull(deadline) || isUndefined(deadline)) {
        return null;
    }
    if (anchor > deadline) {
        return TIME_IS_UP;
    }

    return intervalToDuration({
        start: anchor,
        end: deadline
    });
}
