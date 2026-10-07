import { createTheme, type PaletteMode } from '@mui/material/styles'

export function createAppTheme(mode: PaletteMode) {
  const dark = mode === 'dark'

  return createTheme({
    cssVariables: true,
    palette: {
      mode,
      primary: {
        main: dark ? '#9bd5b4' : '#35684c',
        light: dark ? '#c5ead4' : '#6f9b7f',
        dark: dark ? '#5eaa80' : '#234936',
        contrastText: dark ? '#102018' : '#fffdf8',
      },
      secondary: {
        main: dark ? '#efa477' : '#c36f45',
        light: dark ? '#ffc6a1' : '#e09a72',
        dark: dark ? '#b96c49' : '#914b2e',
        contrastText: dark ? '#24140d' : '#fffdf8',
      },
      success: {
        main: dark ? '#8bcfa1' : '#4c8765',
      },
      warning: {
        main: dark ? '#e7b462' : '#bb7b25',
      },
      error: {
        main: dark ? '#f09b8c' : '#bd554c',
      },
      background: {
        default: dark ? '#10191a' : '#f4f0e8',
        paper: dark ? '#172526' : '#fffdf8',
      },
      text: {
        primary: dark ? '#f2f5ee' : '#1e2b2a',
        secondary: dark ? '#afc0b8' : '#62706a',
      },
      divider: dark ? 'rgba(220, 239, 228, 0.12)' : 'rgba(30, 43, 42, 0.12)',
    },
    typography: {
      fontFamily: 'Helvetica, Arial, sans-serif',
      h1: {
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: 'clamp(2rem, 3vw, 3.2rem)',
        fontWeight: 700,
        letterSpacing: '-0.045em',
        lineHeight: 1.08,
      },
      h2: {
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: 'clamp(1.5rem, 2vw, 2.15rem)',
        fontWeight: 700,
        letterSpacing: '-0.035em',
        lineHeight: 1.15,
      },
      h3: {
        fontSize: '1.2rem',
        fontWeight: 750,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontSize: '1rem',
        fontWeight: 750,
      },
      button: {
        fontWeight: 750,
        textTransform: 'none',
      },
      overline: {
        fontSize: '0.68rem',
        fontWeight: 800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 18,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: { minHeight: '100%' },
          body: {
            minHeight: '100%',
            backgroundImage: dark
              ? 'radial-gradient(circle at 15% 0%, rgba(75, 128, 96, 0.12), transparent 33rem)'
              : 'radial-gradient(circle at 15% 0%, rgba(196, 111, 69, 0.09), transparent 33rem)',
          },
          '*:focus-visible': {
            outline: `3px solid ${dark ? '#efa477' : '#35684c'}`,
            outlineOffset: 3,
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*': {
              scrollBehavior: 'auto !important',
              transitionDuration: '0.01ms !important',
              animationDuration: '0.01ms !important',
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 12, paddingInline: 16, minHeight: 42 },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${dark ? 'rgba(220, 239, 228, 0.08)' : 'rgba(30, 43, 42, 0.08)'}`,
            boxShadow: dark
              ? '0 18px 48px rgba(0, 0, 0, 0.18)'
              : '0 18px 48px rgba(69, 54, 36, 0.07)',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 700 } },
      },
      MuiTooltip: {
        defaultProps: { arrow: true },
      },
    },
  })
}