'use client';

import * as React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme({
	palette: {
		mode: 'light',
	},
});

export const MyThemeProvider = ({ children }: { children: React.ReactNode }) => (
	<ThemeProvider theme={theme}>
		<CssBaseline />
		{children}
	</ThemeProvider>
);
