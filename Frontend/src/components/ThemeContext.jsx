import React from 'react';

export const themes = {
  light: {
    body: '#f0f0f0',
    text: '#333',
    chatBackground: '#fff',
    headerBackground: '#eee',
    headerText: '#333',
    borderColor: '#ccc',
    inputBackground: '#fff',
    inputText: '#333',
    userMessageBackground: '#dcf8c6',
    botMessageBackground: '#eee',
  },
  dark: {
    body: '#121212',
    text: '#fff',
    chatBackground: '#181818ff',
    headerBackground: '#1f1f1fff',
    headerText: '#fff',
    borderColor: '#1d1d1dff',
    inputBackground: '#1f1f1fff',
    inputText: '#fff',
    userMessageBackground: '#444',
    botMessageBackground: '#333',
  },
};

export const ThemeContext = React.createContext({
  theme: 'dark',
  toggleTheme: () => {},
});