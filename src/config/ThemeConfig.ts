import { createTheme, ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#e8dcc7",
      contrastText: '#213547'
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#e8dcc7",
    },
  },
  typography: {
    fontFamily: "'Satoshi-Regular'",
    h1: {
      fontFamily: "'PPMonumentExtended'",
      fontWeight: 900,
    },
    subtitle1: {
      fontFamily: "'General Sans Italic'",
    },
    body1: {
      fontFamily: "'Satoshi-Regular'",
    },
    button: {
      color: '#213547',
      fontFamily: "'Space Grotesk'",
    },
  },
    components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          color: '#213547',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);