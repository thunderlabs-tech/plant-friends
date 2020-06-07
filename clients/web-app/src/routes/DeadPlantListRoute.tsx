import React from "react";

import DeadPlantListScreen, {
  DeadPlantListScreenProps,
} from "./DeadPlantListScreen";
import { Route } from "react-router-dom";

export function deadPlantListUrl(): string {
  return `/graveyard`;
}

export default function DeadPlantListRoute(props: DeadPlantListScreenProps) {
  return (
    <Route
      exact
      path="/graveyard/:id"
      render={() => {
        return (
          <DeadPlantListScreen {...props} />
        );
      }}
    />
  );
}
