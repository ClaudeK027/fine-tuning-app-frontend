// src/theme/index.ts
import { createTheme, alpha } from '@mui/material/styles';
import { red, grey, blueGrey } from '@mui/material/colors';

// --- Définitions communes ---
const primaryColor = '#26a69a'; // Teal 500
const secondaryColor = '#ffab40'; // Amber A400
const errorColor = red.A400;
const borderRadius = 8;

// --- Thème Sombre --- 
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
      light: alpha(primaryColor, 0.5),
      dark: alpha(primaryColor, 0.9),
      contrastText: '#000000',
    },
    secondary: {
      main: secondaryColor,
      light: alpha(secondaryColor, 0.5),
      dark: alpha(secondaryColor, 0.9),
      contrastText: '#000000',
    },
    error: { main: errorColor },
    warning: { main: '#ffa726' },
    info: { main: '#29b6f6' },
    success: { main: '#66bb6a' },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#b0bec5',
      disabled: alpha('#e0e0e0', 0.5),
    },
    divider: alpha('#e0e0e0', 0.12),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: '2.8rem', fontWeight: 300, letterSpacing: '-0.01562em' },
    h2: { fontSize: '2.2rem', fontWeight: 300, letterSpacing: '-0.00833em' },
    h3: { fontSize: '1.8rem', fontWeight: 400, letterSpacing: '0em' },
    h4: { fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.00735em' },
    h5: { fontSize: '1.25rem', fontWeight: 400, letterSpacing: '0em' },
    h6: { fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.0075em' },
    subtitle1: { fontSize: '1rem', fontWeight: 400, letterSpacing: '0.00938em' },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.00714em' },
    body1: { fontSize: '1rem', fontWeight: 400, letterSpacing: '0.00938em' },
    body2: { fontSize: '0.875rem', fontWeight: 400, letterSpacing: '0.01071em' },
    button: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.02857em', textTransform: 'none' },
    caption: { fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.03333em' },
    overline: { fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.08333em', textTransform: 'uppercase' },
  },
  spacing: 8,
  shape: { borderRadius: borderRadius },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha('#e0e0e0', 0.12)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: borderRadius },
        containedPrimary: { color: '#000000' },
        containedSecondary: { color: '#000000' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', borderRadius: borderRadius },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiSelect: { defaultProps: { variant: 'outlined' } },
    MuiLink: {
      styleOverrides: {
        root: { color: secondaryColor, textDecorationColor: alpha(secondaryColor, 0.5) },
      },
    },
  },
});

// --- Thème Clair --- 
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      light: alpha(primaryColor, 0.3),
      dark: alpha(primaryColor, 0.9),
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryColor,
      light: alpha(secondaryColor, 0.3),
      dark: alpha(secondaryColor, 0.9),
      contrastText: '#000000',
    },
    error: { main: errorColor },
    warning: { main: '#ffa726' },
    info: { main: '#29b6f6' },
    success: { main: '#66bb6a' },
    background: {
      default: grey[100],
      paper: '#ffffff',
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
      disabled: alpha(grey[900], 0.38),
    },
    divider: alpha(grey[900], 0.12),
  },
  typography: { /* ... (gardez la typo définie précédemment) ... */
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontSize: '2.8rem', fontWeight: 300, letterSpacing: '-0.01562em' },
    h2: { fontSize: '2.2rem', fontWeight: 300, letterSpacing: '-0.00833em' },
    h3: { fontSize: '1.8rem', fontWeight: 400, letterSpacing: '0em' },
    h4: { fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.00735em' },
    h5: { fontSize: '1.25rem', fontWeight: 400, letterSpacing: '0em' },
    h6: { fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.0075em' },
    subtitle1: { fontSize: '1rem', fontWeight: 400, letterSpacing: '0.00938em' },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.00714em' },
    body1: { fontSize: '1rem', fontWeight: 400, letterSpacing: '0.00938em' },
    body2: { fontSize: '0.875rem', fontWeight: 400, letterSpacing: '0.01071em' },
    button: { fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.02857em', textTransform: 'none' },
    caption: { fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.03333em' },
    overline: { fontSize: '0.75rem', fontWeight: 400, letterSpacing: '0.08333em', textTransform: 'uppercase' },
  },
  spacing: 8,
  shape: { borderRadius: borderRadius },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: primaryColor,
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: borderRadius },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: borderRadius },
      },
    },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiSelect: { defaultProps: { variant: 'outlined' } },
    MuiLink: {
      styleOverrides: {
        root: { color: primaryColor, textDecorationColor: alpha(primaryColor, 0.4) },
      },
    },
  },
});
