import React from 'react';

import PlantListScreen from './PlantListScreen';
import { Plant } from '../data/Plant';
import { Collection } from '../utilities/state/useCollection';
import { Route, RouteComponentProps } from 'react-router-dom';

export type PlantListRouteParams = {};

export function plantListUrl(): string {
  return `/`;
}

export default function PlantListRoute(appState: { plants: Collection<Plant> }) {
  return (
    <Route
      exact
      path="/"
      render={(props: RouteComponentProps<PlantListRouteParams>) => {
        return <PlantListScreen params={props.match.params} {...appState} />;
      }}
    />
  );
}
