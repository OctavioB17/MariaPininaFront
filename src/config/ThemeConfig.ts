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
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: '#213547',
            outline: 1
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#213547',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#213547',
          },
        },
        input: {
          '&:focus': {
            outline: '1px solid black',
            borderRadius: '4px'
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#213547',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:after': {
            borderBottomColor: '#213547',
          },
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
