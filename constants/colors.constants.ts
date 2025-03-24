export interface ColorOptions {
  primary: string;
  lightBackground: string;
  card: string;
  text: string;
  lightText: string;
  border: string;
  notification: string;
  stroke: string;
  danger: string;
  warning: string;
  translucent: string;
  surface: string;
  underline: string;
  surfaceLight: string;
  onSurface: string;
  background: string;
  surface2: string;
  surface3: string;
  accent: string;
  accent2: string;
  onAccent: string;
  success: string;
  link: string;
  highlight: string;
  highlightLight: string;
}

interface Theme {
  dark: boolean;
  colors: ColorOptions;
}

export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: "#FF0051",
    lightBackground: "#252525",
    card: "rgb(18, 18, 18)",
    text: "#FFFFFF",
    lightText: "rgba(255,255,255,0.7)",
    border: "#373737",
    notification: "rgb(255, 69, 58)",
    stroke: "#393939",
    danger: "rgb(255, 69, 58)",
    warning: "#FF5722",
    translucent: "rgba(255,255,255,0.1)",
    surface: "rgba(44, 44, 44, 1)",
    underline: "rgba(255, 255, 255, 0.1))",
    surfaceLight: "rgba(255,255,255,0.05)",
    onSurface: "#6E6E6E",
    background: "#202020",
    surface2: "#1D1D1D",
    surface3: "#2D2A2B",
    accent: "#E6F7FD",
    accent2: "#66FF84",
    onAccent: "#36B2E0",
    success: "#009246",
    link: "#0E99FF",
    highlight: "#FFD702",
    highlightLight: "#FFFCEA",
  },
} as const;

export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#FF0051",
    background: "#fff",
    underline: "#E8E8EA",
    lightBackground: "rgba(0,0,0,0.04)",
    card: "rgb(18, 18, 18)",
    text: "#000000",
    lightText: "rgba(0,0,0,0.7)",
    border: "rgba(0, 0, 0,0.2)",
    notification: "rgb(255, 69, 58)",
    stroke: "rgba(0, 0, 0,0.2)",
    danger: "rgb(255, 69, 58)",
    warning: "#FF5722",
    translucent: "rgba(0,0,0,0.05)",
    surfaceLight: "rgba(0,0,0,0.05)",
    onSurface: "rgba(0,0,0,0.5)",
    surface: "#EBEBEB",
    surface2: "#FCFCFC",
    surface3: "#2D2A2B",
    accent: "#E6F7FD",
    onAccent: "#36B2E0",
    accent2: "#66FF84",
    success: "#009246",
    link: "#0E99FF",
    highlight: "#FFC107",
    highlightLight: "#FFFCEA",
  },
} as const;

const Colors = {
  light: lightTheme.colors,
  dark: darkTheme.colors,
} as const;

export default Colors;
