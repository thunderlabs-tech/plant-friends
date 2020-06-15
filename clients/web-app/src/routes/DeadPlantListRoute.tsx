import React from "react";

import DeadPlantListScreen, {
  DeadPlantListScreenProps,
} from "./DeadPlantListScreen";
import { Route } from "react-router-dom";

export function deadPlantListUrl(): string {
  return `/graveyard`;
}

const DeadPlantListRoute: React.FC<DeadPlantListScreenProps> = (props) => {
  return (
    <Route
      exact
      path="/graveyard"
      render={() => {
        return <DeadPlantListScreen {...props} />;
      }}
    />
  );
};

export default DeadPlantListRoute;
