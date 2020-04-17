import React, { useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Typography, MuiThemeProvider, Container, CssBaseline, Paper, Box } from '@material-ui/core';
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
      <Box display="flex" flexDirection="column" width="100%" height="100%">
        <AppBar position="static" elevation={1}>
          <Container maxWidth="md" disableGutters>
            <Toolbar>
              <Typography variant="h6">Plant Friends</Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <PlantListScreen plants={plants} />
      </Box>
    </MuiThemeProvider>
  );
};

export default App;
