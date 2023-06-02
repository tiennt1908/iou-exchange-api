import React, { useEffect, useState } from "react";
import { format } from "../../helpers/format";

type Props = {
  deadline: number;
};

export default function CountDown({ deadline }: Props) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const countDown = setInterval(() => {
      const utcTimestamp = new Date().getTime();
      const distance = deadline - utcTimestamp / 1000;
      if (distance >= 0) {
        setTime(distance);
      } else {
        clearInterval(countDown);
      }
    }, 1000);
    return () => {
      clearInterval(countDown);
    };
  }, []);
  return <p className="m-0">{format.countdown(time)}</p>;
}
