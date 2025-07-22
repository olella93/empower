import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { store } from './store';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
    },
    secondary: {
      main: '#E74C3C',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <h1>Empower Fashion Store</h1>
            <p>Welcome to your new e-commerce platform!</p>
            <p>Frontend and backend setup complete. Ready for development!</p>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
