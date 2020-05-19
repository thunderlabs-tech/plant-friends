import React from 'react';

import DataManagementScreen from './DataManagementScreen';
import { Plant } from '../data/Plant';
import { Collection } from '../utilities/state/useCollection';
import { Route, RouteComponentProps } from 'react-router-dom';

export type DataManagementRouteParams = {};

export function dataManagementUrl(): string {
  return `/data-management`;
}

export default function DataManagementRoute(appState: { plants: Collection<Plant> }) {
  return (
    <Route
      exact
      path="/data-management"
      render={(props: RouteComponentProps<DataManagementRouteParams>) => {
        return <DataManagementScreen params={props.match.params} {...appState} />;
      }}
    />
  );
}
