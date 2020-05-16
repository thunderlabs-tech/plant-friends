import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { MuiThemeProvider, LinearProgress } from '@material-ui/core';
import theme, { rmwcTheme } from './theme';
import useCollection from '../utilities/state/useCollection';
import { Plant } from '../data/Plant';
import LoadingState from '../utilities/state/LoadingState';
import '@rmwc/theme/styles';
import { ThemeProvider } from '@rmwc/theme';

import persistence from '../data/persistence';
import PlantDetailRoute from '../routes/PlantDetailRoute';
import PlantListRoute from '../routes/PlantListRoute';
import RootRoute from '../routes/RootRoute';

// const styles = () =>
//   createStyles({
//     loadingSpinner: {
//       flexGrow: 1,
//     },
//     root: {
//       // flexGrow: 1,
//       // display: 'flex',
//     },
//     updating: {
//       opacity: 0.9,
//     },
//   });

export type AppProps = {};

const App: React.FC<AppProps> = () => {
  const plants = useCollection<Plant>();

  useEffect(() => {
    async function fetchData() {
      plants.dispatch.setData(await persistence.loadPlants());
      plants.dispatch.setLoadingState(LoadingState.ready);
    }
    fetchData();
  }, [plants.dispatch]);

  return (
    <ThemeProvider options={rmwcTheme} wrap>
      <MuiThemeProvider theme={theme}>
        {plants.loadingState === LoadingState.notYetLoaded ? (
          <LinearProgress style={{ width: '100%' }} />
        ) : (
          <Router>
            <Switch
              children={[
                PlantDetailRoute({ plants: plants }),
                PlantListRoute({ plants: plants }),
                RootRoute({ plants: plants }),
              ]}
            />
          </Router>
        )}
      </MuiThemeProvider>
    </ThemeProvider>
  );
};

export default App;
