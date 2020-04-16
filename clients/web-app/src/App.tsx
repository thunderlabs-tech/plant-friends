import React from 'react';
import useAppState from './state/useAppState';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, IconButton, Typography, Icon, MuiThemeProvider, Container } from '@material-ui/core';
import theme from './app/theme';

const App: React.FC = () => {

  return (
    <MuiThemeProvider theme={theme}>
      <Container maxWidth="md">
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Icon>menu</Icon>
            </IconButton>
            <Typography variant="h6">Plant Friends</Typography>
          </Toolbar>
        </AppBar>
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
