import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { ThemeContext, themes } from './components/ThemeContext';
import MainContent from './components/MainContent';
import BottomBar from './components/BottomBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${props => props.theme.body};
    color: ${props => props.theme.text};
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100vw;
  padding: 0;
  box-sizing: border-box;
`;

// Create a client
const queryClient = new QueryClient()

function App() {
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentTheme = themes[theme];

  return (
    <QueryClientProvider client={queryClient}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <ThemeProvider theme={currentTheme}>
                <GlobalStyles />
                <AppContainer>
                <MainContent/>
                <BottomBar/>
                </AppContainer>
            </ThemeProvider>
        </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;