import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import theme from './theme';
import useCollection from '../utilities/state/useCollection';
import { Plant } from '../data/Plant';
import LoadingState from '../utilities/state/LoadingState';
import '@rmwc/linear-progress/styles';
import { LinearProgress } from '@rmwc/linear-progress';
import '@rmwc/theme/styles';
import { ThemeProvider } from '@rmwc/theme';

import persistence from '../data/persistence';
import PlantDetailRoute from '../routes/PlantDetailRoute';
import PlantListRoute from '../routes/PlantListRoute';
import RootRoute from '../routes/RootRoute';

// const styles = () =>
//   createStyles({
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
    <ThemeProvider options={theme}>
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
    </ThemeProvider>
  );
};

export default App;
