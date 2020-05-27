import React from 'react';

import DeadPlantListScreen from './DeadPlantListScreen';
import { Plant } from '../data/Plant';
import { Collection } from '../utilities/state/useCollection';
import { Route, RouteComponentProps } from 'react-router-dom';

export type DeadPlantListRouteParams = {};

export function deadPlantListUrl(): string {
  return `/graveyard`;
}

export default function DeadPlantListRoute(appState: { deadPlants: Collection<Plant> }) {
  return (
    <Route
      exact
      path="/graveyard"
      render={(props: RouteComponentProps<DeadPlantListRouteParams>) => {
        return <DeadPlantListScreen params={props.match.params} {...appState} />;
      }}
    />
  );
}
