import React, { useEffect } from "react";
import Amplify from "aws-amplify";
import awsExports from "../gen/aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import theme from "./theme";
import useCollection from "../utilities/state/useCollection";
import { Plant } from "../data/Plant";
import LoadingState from "../utilities/state/LoadingState";
import "@rmwc/linear-progress/styles";
import { LinearProgress } from "@rmwc/linear-progress";
import "@rmwc/theme/styles";
import { ThemeProvider } from "@rmwc/theme";

import persistence from "../data/persistence";
import PlantDetailRoute from "../routes/PlantDetailRoute";
import PlantListRoute from "../routes/PlantListRoute";
import RootRoute from "../routes/RootRoute";
import DeadPlantListRoute from "../routes/DeadPlantListRoute";
import DeadPlantDetailRoute from "../routes/DeadPlantDetailRoute";
import DataManagementRoute from "../routes/DataManagementRoute";

Amplify.configure(awsExports);

const AppRoot: React.FC = () => {
  const plants = useCollection<Plant>();

  useEffect(() => {
    async function fetchData() {
      await persistence.runMigrations();

      plants.dispatch.setData(await persistence.loadPlants());
      plants.dispatch.setLoadingState(LoadingState.ready);
    }
    fetchData();
  }, [plants.dispatch]);

  return (
    <ThemeProvider options={theme}>
      {plants.loadingState === LoadingState.notYetLoaded ? (
        <LinearProgress style={{ width: "100%" }} />
      ) : (
        <Router>
          <Switch
            children={[
              PlantDetailRoute({ plants }),
              PlantListRoute({ plants }),
              DeadPlantListRoute({ plants }),
              DeadPlantDetailRoute({ plants }),
              DataManagementRoute({ plants }),
              RootRoute({ plants }),
            ]}
          />
        </Router>
      )}
    </ThemeProvider>
  );
};

export default withAuthenticator(AppRoot);
