import React, { useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Toolbar, IconButton, Typography, Icon, MuiThemeProvider, Container } from '@material-ui/core';
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
      <Container maxWidth="md">
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Icon>menu</Icon>
            </IconButton>
            <Typography variant="h6">Plant Friends</Typography>
          </Toolbar>
        </AppBar>
        {/* <Button onClick={seedDummyData}>Seed dummy data</Button> */}
        <PlantListScreen plants={plants} />
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
