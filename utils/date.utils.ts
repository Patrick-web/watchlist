import { createNumberArray } from "./array.utils";

export function getYear18YearsAgo(): number {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const year18YearsAgo = currentYear - 18;
  return year18YearsAgo;
}

export function subtractDate(years: number, startDate = new Date()): Date {
  const currentYear = startDate.getFullYear();
  const targetYear = currentYear - years;
  const dateString = `${targetYear}-01-01`;
  const targetDate = new Date(dateString);

  return targetDate;
}

function isLeapYear(year: number): boolean {
  // Leap year is divisible by 4, but not divisible by 100 unless it's also divisible by 400.
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const monthsWithNames = [
  { month: 0, name: "Jan" },
  { month: 1, name: "Feb" },
  { month: 2, name: "Mar" },
  { month: 3, name: "Apr" },
  { month: 4, name: "May" },
  { month: 5, name: "Jun" },
  { month: 6, name: "Jul" },
  { month: 7, name: "Aug" },
  { month: 8, name: "Sep" },
  { month: 9, name: "Oct" },
  { month: 10, name: "Nov" },
  { month: 11, name: "Dec" },
];

export function getDaysInMonth(year: number, month: number) {
  if (month < 0 || month > 12) {
    throw new Error("Invalid month. Month should be between 1 and 12.");
  }

  const daysInMonth = [
    31, // January
    isLeapYear(year) ? 29 : 28, // February (leap year check)
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31, // December
  ];

  return createNumberArray(1, daysInMonth[month]);
}

export function formatDateWithoutDay(date: Date) {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export enum DateFormat {
  DDMMYYYY = "DD/MM/YYYY",
  MMDDYYYY = "MM/DD/YYYY",
  YYYYMMDD = "YYYY-MM-DD",
  D_MMM_YYYY = "D MMM YYYY",
  HHmm = "HH:mm",
  hhmmA = "hh:mm A",
  MMMM_YYYY_hh_mm_A = "MMMM YYYY, hh:mm A",
  YY_MM_DD_HH_mm_ss = "YY-MM-DD HH:mm:ss",
}

export function formatDate(
  date: Date | string | null,
  format: DateFormat = DateFormat.YYYYMMDD,
): string {
  let dateObj: Date | null = date as Date | null;

  if (typeof date === "string") {
    try {
      dateObj = new Date(date);
    } catch (error) {
      return "Invalid Date String";
    }
  }

  if (!dateObj) {
    return "";
  }
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Months are zero-indexed, so we add 1
  const year = dateObj.getFullYear();

  // Pad the day, month, and year with leading zeros if needed
  const formattedDay = day < 10 ? `0${day}` : `${day}`;
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedYear = `${year}`;

  let formattedDate = format
    .replace("DD", formattedDay)
    .replace("MM", formattedMonth)
    .replace("YYYY", formattedYear)
    .replace("YY", formattedYear.slice(-2))
    .replace("D", day.toString())
    .replace("MMM", getShortMonthName(month))
    .replace("MMMM", getFullMonthName(month))
    .replace("HH", get24HourFormat(dateObj))
    .replace("hh", get12HourFormat(dateObj))
    .replace("mm", getMinutes(dateObj))
    .replace("ss", getSeconds(dateObj))
    .replace("A", getAMPM(dateObj))
    .replace("a", getAMPM(dateObj).toLowerCase())
    .replace("YY-MM-DD", `${formattedYear}-${formattedMonth}-${formattedDay}`)
    .replace(
      "HH:mm:ss",
      `${get24HourFormat(dateObj)}:${getMinutes(dateObj)}:${getSeconds(
        dateObj,
      )}`,
    );

  return formattedDate;
}

function getShortMonthName(month: number): string {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthNames[month - 1];
}

function getFullMonthName(month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
}

function get12HourFormat(date: Date): string {
  return (date.getHours() % 12 || 12).toString().padStart(2, "0");
}

function get24HourFormat(date: Date): string {
  return date.getHours().toString().padStart(2, "0");
}

function getMinutes(date: Date): string {
  return date.getMinutes().toString().padStart(2, "0");
}

function getSeconds(date: Date): string {
  return date.getSeconds().toString().padStart(2, "0");
}

function getAMPM(date: Date): string {
  return date.getHours() >= 12 ? "PM" : "AM";
}

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export function humanTime(time: string): string {
  return new Date(time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function humanDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function humanDateTime(dateString: string): string {
  return `${humanDate(dateString)} at ${humanTime(dateString)}`;
}
export function getAge(date: Date): number {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function addTime(
  date: Date,
  {
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  }: {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
  },
): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  newDate.setHours(newDate.getHours() + hours);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  newDate.setSeconds(newDate.getSeconds() + seconds);
  return newDate;
}

export function getDateDifference(
  date1: Date,
  date2: Date,
  unit: "days" | "hours" | "minutes" | "seconds",
): number {
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

  switch (unit) {
    case "days":
      return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    case "hours":
      return Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    case "minutes":
      return Math.floor(diffInMilliseconds / (1000 * 60));
    case "seconds":
      return Math.floor(diffInMilliseconds / 1000);
    default:
      throw new Error(
        'Invalid unit. Please use "days", "hours", "minutes", or "seconds".',
      );
  }
}

export function getGreeting(): string {
  const currentHour: number = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

// Example usage
console.log(getGreeting());
