import React, { useEffect } from "react";
import Amplify from "aws-amplify";
import awsExports from "src/gen/aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import theme from "src/init/theme";
import useCollection from "src/utilities/state/useCollection";
import { Plant } from "src/data/Plant";
import LoadingState from "src/utilities/state/LoadingState";
import "@rmwc/linear-progress/styles";
import { LinearProgress } from "@rmwc/linear-progress";
import "@rmwc/theme/styles";
import "../index.css";
import { ThemeProvider } from "@rmwc/theme";

import persistence from "src/data/persistence";
import PlantDetailRoute from "src/routes/PlantDetailRoute";
import PlantListRoute from "src/routes/PlantListRoute";
import RootRoute from "src/routes/RootRoute";
import DeadPlantListRoute from "src/routes/DeadPlantListRoute";
import DeadPlantDetailRoute from "src/routes/DeadPlantDetailRoute";
import DataManagementRoute from "src/routes/DataManagementRoute";

Amplify.configure(awsExports);

const AppRoot: React.FC = () => {
  const plants = useCollection<Plant>();

  useEffect(() => {
    async function fetchData() {
      await persistence.runMigrations();

      plants.dispatch.setData(await persistence.loadPlantsAndEvents());
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
require("../rmwc-overrides.css");
