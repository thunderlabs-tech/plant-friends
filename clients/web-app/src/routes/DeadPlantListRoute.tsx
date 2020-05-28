import React from 'react';

import DeadPlantListScreen, { DeadPlantListScreenProps } from './DeadPlantListScreen';
import { Route, RouteComponentProps } from 'react-router-dom';

export type DeadPlantListRouteParams = {};

export function deadPlantListUrl(): string {
  return `/graveyard`;
}

export default function DeadPlantListRoute(props: DeadPlantListScreenProps) {
  return (
    <Route
      exact
      path="/graveyard"
      render={(routeProps: RouteComponentProps<DeadPlantListRouteParams>) => {
        return <DeadPlantListScreen params={routeProps.match.params} {...props} />;
      }}
    />
  );
}
