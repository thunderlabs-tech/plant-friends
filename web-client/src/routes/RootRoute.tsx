import React from "react";

import { Plant } from "src/data/Plant";
import { Collection } from "src/utilities/state/useCollection";
import { Route } from "react-router-dom";
import PlantListScreen from "src/routes/PlantListScreen";

export type RootRouteProps = {
  plants: Collection<Plant>;
};

export function rootRouteUrl(): string {
  return "/";
}

const RootRoute: React.FC<RootRouteProps> = (appState) => {
  return (
    <Route
      exact
      path="/"
      render={(props) => (
        <PlantListScreen params={props.match.params} {...appState} />
      )}
    />
  );
};

export default RootRoute;
