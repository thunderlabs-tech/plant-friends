import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { MuiThemeProvider, CssBaseline, LinearProgress } from '@material-ui/core';
import theme from './theme';
import useCollection from '../utilities/state/useCollection';
import { Plant } from '../data/Plant';
import LoadingState from '../utilities/state/LoadingState';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import persistence from '../data/persistence';
import PlantDetailRoute from '../routes/PlantDetailRoute';
import PlantListRoute from '../routes/PlantListRoute';
import RootRoute from '../routes/RootRoute';

const styles = () =>
  createStyles({
    loadingSpinner: {
      flexGrow: 1,
    },
    root: {
      flexGrow: 1,
      display: 'flex',
    },
    updating: {
      opacity: 0.9,
    },
  });

export type AppProps = WithStyles<typeof styles> & {};

const App: React.FC<AppProps> = ({ classes }) => {
  const plants = useCollection<Plant>();

  useEffect(() => {
    async function fetchData() {
      plants.dispatch.setData(await persistence.loadPlants());
      plants.dispatch.setLoadingState(LoadingState.ready);
    }
    fetchData();
  }, [plants.dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

      {plants.loadingState === LoadingState.notYetLoaded ? (
        <LinearProgress className={classes.loadingSpinner} />
      ) : (
        <div className={`${classes.root} ${plants.loadingState === LoadingState.updating ? classes.updating : ''}`}>
          <Router>
            <Switch
              children={[
                PlantDetailRoute({ plants: plants }),
                PlantListRoute({ plants: plants }),
                RootRoute({ plants: plants }),
              ]}
            />
          </Router>
        </div>
      )}
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(App);
