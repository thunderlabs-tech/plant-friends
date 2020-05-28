import React from 'react';

import PlantDetailScreen, { PlantDetailScreenProps } from './PlantDetailScreen';
import { Route, RouteComponentProps } from 'react-router-dom';

export type DeadPlantDetailRouteParams = { id: string };

export function deadPlantDetailUrl(plantId: string): string {
  return `/graveyard/${plantId}`;
}

export default function DeadPlantDetailRoute(props: PlantDetailScreenProps) {
  return (
    <Route
      exact
      path="/graveyard/:id"
      render={(routeProps: RouteComponentProps<DeadPlantDetailRouteParams>) => {
        return <PlantDetailScreen params={routeProps.match.params} deadPlantRoute {...props} />;
      }}
    />
  );
}
