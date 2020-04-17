import React, { useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Typography, MuiThemeProvider, Container, CssBaseline } from '@material-ui/core';
import theme from './app/theme';
import PlantListScreen from './PlantListScreen';
import useCollection from './state/useCollection';
import { Plant } from './data/Plant';
import persistence from './state/persistence';
import LoadingState from './state/LoadingState';

const App: React.FC = () => {
  const plants = useCollection<Plant>();

  useEffect(() => {
    const fetchData = async () => {
      plants.dispatch.setData(await persistence.loadPlants());
      plants.dispatch.setLoadingState(LoadingState.ready);
    };
    fetchData();
  }, [plants.dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="md" style={{ backgroundColor: '#ffffff', height: '100%' }} disableGutters>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6">Plant Friends</Typography>
          </Toolbar>
        </AppBar>

        <PlantListScreen plants={plants} />
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
