import React from "react";

import DataManagementScreen from "src/routes/DataManagementScreen";
import { Plant } from "src/data/Plant";
import { Collection } from "src/utilities/state/useCollection";
import { Route, RouteComponentProps } from "react-router-dom";

export type DataManagementRouteParams = Record<string, string | undefined>;

export type DataManagementRouteProps = {
  plants: Collection<Plant>;
};

export function dataManagementUrl(): string {
  return `/data-management`;
}

const DataManagementRoute: React.FC<DataManagementRouteProps> = (appState) => {
  return (
    <Route
      exact
      path="/data-management"
      render={(props: RouteComponentProps<DataManagementRouteParams>) => {
        return (
          <DataManagementScreen params={props.match.params} {...appState} />
        );
      }}
    />
  );
};

export default DataManagementRoute;
