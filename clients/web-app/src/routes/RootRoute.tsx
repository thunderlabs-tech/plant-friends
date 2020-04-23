import React from 'react';

import { Plant } from '../data/Plant';
import { Collection } from '../utilities/state/useCollection';
import { Route } from 'react-router-dom';
import PlantListScreen from './PlantListScreen';

export function rootRouteUrl() {
  return '/';
}

export default function RootRoute(appState: { plants: Collection<Plant> }) {
  return <Route exact path="/" render={(props) => <PlantListScreen params={props.match.params} {...appState} />} />;
}
