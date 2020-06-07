import React from "react";

import PlantListScreen from "./PlantListScreen";
import { Plant } from "../data/Plant";
import { Collection } from "../utilities/state/useCollection";
import { Route, RouteComponentProps } from "react-router-dom";

export type PlantListRouteParams = Record<string, string | undefined>;

export type PlantListRouteProps = {
  plants: Collection<Plant>;
};

export function plantListUrl(): string {
  return `/`;
}

const PlantListRoute: React.FC<PlantListRouteProps> = (appState) => {
  return (
    <Route
      exact
      path="/"
      render={(props: RouteComponentProps<PlantListRouteParams>) => {
        return <PlantListScreen params={props.match.params} {...appState} />;
      }}
    />
  );
};

export default PlantListRoute;
