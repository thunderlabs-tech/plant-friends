import React from 'react';

import PlantDetailScreen from './PlantDetailScreen';
import { Plant } from '../data/Plant';
import { Collection } from '../utilities/state/useCollection';
import { Route, RouteComponentProps } from 'react-router-dom';

export type PlantDetailRouteParams = { id: string };

export function plantDetailUrl(plantId: string): string {
  return `/plants/${plantId}`;
}

export default function PlantDetailRoute(appState: { plants: Collection<Plant> }) {
  return (
    <Route
      exact
      path="/plants/:id"
      render={(props: RouteComponentProps<PlantDetailRouteParams>) => {
        return <PlantDetailScreen params={props.match.params} {...appState} />;
      }}
    />
  );
}
