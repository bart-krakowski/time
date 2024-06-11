import type { Temporal } from "@js-temporal/polyfill";
import type { Properties as CSSProperties } from "csstype";

export const getCurrentTimeMarkerProps = (currentTime: Temporal.PlainDateTime): { style: CSSProperties; currentTime: string | undefined } => {
  const { hour, minute } = currentTime;
  const currentTimeInMinutes = hour * 60 + minute;
  const percentageOfDay = (currentTimeInMinutes / (24 * 60)) * 100;

  return {
    style: {
      position: 'absolute',
      top: `${percentageOfDay}%`,
      left: 0,
    },
    currentTime: currentTime.toString().split('T')[1]?.substring(0, 5),
  };
};