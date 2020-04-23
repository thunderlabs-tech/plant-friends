import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { MuiThemeProvider, CssBaseline, LinearProgress } from '@material-ui/core';
import theme from './theme';
import PlantListScreen from '../screens/PlantListScreen';
import useCollection from '../utilities/state/useCollection';
import { Plant } from '../data/Plant';
import LoadingState from '../utilities/state/LoadingState';
import PlantDetailScreen from '../screens/PlantDetailScreen';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import persistence from '../data/persistence';

const styles = (theme: Theme) =>
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
            <Switch>
              <Route path="/plants/:id" exact>
                {(props) => <PlantDetailScreen {...props} plants={plants} />}
              </Route>
              <Route path="/">
                <PlantListScreen plants={plants} />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(App);
