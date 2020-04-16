import React from 'react';
import { Plant } from './state/dataTypes';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, IconButton, Typography, Icon, MuiThemeProvider, Container } from '@material-ui/core';
import theme from './app/theme';
import PlantListScreen from './PlantListScreen';
import useCollection from './state/useCollection';

function makeN<Element>(n: number, maker: (i: number) => Element): Element[] {
  if (n <= 0) return [];
  const result: Element[] = [];
  for (let i = 0; i < n; i++) {
    result.push(maker(i));
  }
  return result;
}
function makePlant(attrs: Partial<Plant> & { id: string }): Plant {
  return {
    name: 'Zabrina',
    ...attrs,
  };
}

const plantData = makeN(4, (i) => makePlant({ id: i.toString(), name: `Plant ${i}` }));

const App: React.FC = () => {
  const plants = useCollection<Plant>(plantData);

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

        <PlantListScreen plants={plants} />
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
