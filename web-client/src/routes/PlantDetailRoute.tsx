import React from "react";

import PlantDetailScreen, {
  PlantDetailScreenProps,
} from "src/routes/PlantDetailScreen";
import { Route, RouteComponentProps } from "react-router-dom";

export type PlantDetailRouteParams = { id: string };

export function plantDetailUrl(plantId: string): string {
  return `/plants/${plantId}`;
}

const PlantDetailRoute: React.FC<PlantDetailScreenProps> = (props) => {
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
};

export default PlantDetailRoute;
