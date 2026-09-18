import dayjs from "dayjs";

export const getGreeting = () => {
  const hour = dayjs().hour();

  if (hour < 12) return "Good Morning!";
  if (hour < 17) return "Good Afternoon!";
  if (hour < 21) return "Good Evening!";
  return "Good Night!";
};

import { useEffect, useState } from "react";

export const useGreeting = () => {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
};
