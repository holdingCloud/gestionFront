// Filename : dayjs.ts

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/es";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.locale("es");
dayjs.tz.setDefault("America/Santiago")

const timezonedDayjs = (...args: any[]) => {
    return dayjs(...args).tz();
};

const timezonedUnix = (value: number) => {
    return dayjs.unix(value).tz();
};

timezonedDayjs.unix = timezonedUnix;
//timezonedDayjs.duration = dayjs.duration;

export default timezonedDayjs;