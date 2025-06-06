import { createTheme, ThemeOptions } from "@mui/material";
import type {} from '@mui/x-data-grid/themeAugmentation';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#efefe3",
      contrastText: '#0d3e45'
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#efefe3",
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
      color: '#0d3e45',
      fontFamily: "'Space Grotesk'",
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        panelContent: {
          backgroundColor: '#efefe3',
          border: '1px solid #0d3e45',
        },
        root: {
          backgroundColor: '#efefe3',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#efefe3',
          border: '1px solid #0d3e45',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#0d3e45',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fill: '#0d3e45',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: '#0d3e45',
            outline: 1
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0d3e45',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0d3e45',
          },
        },
        input: {
          '&:focus': {
            outline: '1px solid #0d3e45',
            borderRadius: '4px'
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#0d3e45',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:after': {
            borderBottomColor: '#0d3e45',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          backgroundColor: '#efefe3',
          border: '2px solid #0d3e45',
          borderRadius: '4px',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
