import { formatDuration, intervalToDuration } from 'date-fns'
import {isNull, isUndefined} from "lodash";
import {TIME_IS_UP} from "../../consts";

export const getTimeDuration = (deadline: Date | null): string | null  => {
  console.log('deadline test', deadline, typeof deadline);
  const now = new Date()

  if (isNull(deadline) || isUndefined(deadline)) {
    return null;
  }
  if (now > deadline) {
    return TIME_IS_UP;
  }
  const duration = intervalToDuration({
    start: Date(),
    end: deadline
  });

  return formatDuration(duration, {
    format: ['minutes', 'seconds']
  })
}
