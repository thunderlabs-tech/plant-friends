import React from "react";

import PlantDetailScreen, { PlantDetailScreenProps } from "./PlantDetailScreen";
import { Route, RouteComponentProps } from "react-router-dom";

export type PlantDetailRouteParams = { id: string };

export function plantDetailUrl(plantId: string): string {
  return `/plants/${plantId}`;
}

export default function PlantDetailRoute(props: PlantDetailScreenProps) {
  return (
    <Route
      exact
      path="/plants/:id"
      render={(routeProps: RouteComponentProps<PlantDetailRouteParams>) => {
        return (
          <PlantDetailScreen params={routeProps.match.params} {...props} />
        );
      }}
    />
  );
}
