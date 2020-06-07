import React from "react";

import PlantDetailScreen, { PlantDetailScreenProps } from "./PlantDetailScreen";
import { Route, RouteComponentProps } from "react-router-dom";

export type DeadPlantDetailRouteParams = { id: string };

export function deadPlantDetailUrl(plantId: string): string {
  return `/graveyard/${plantId}`;
}

const DeadPlantDetailRoute: React.FC<PlantDetailScreenProps> = (props) => {
  return (
    <Route
      exact
      path="/graveyard/:id"
      render={(routeProps: RouteComponentProps<DeadPlantDetailRouteParams>) => {
        return (
          <PlantDetailScreen
            params={routeProps.match.params}
            deadPlantRoute
            {...props}
          />
        );
      }}
    />
  );
};

export default DeadPlantDetailRoute;
