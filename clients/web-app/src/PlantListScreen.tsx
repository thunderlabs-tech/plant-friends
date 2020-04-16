import React from 'react';
import { Plant } from './state/dataTypes';
import { List, ListItem, ListItemText, Container, Divider, Icon, ListItemIcon, Tooltip } from '@material-ui/core';
import { Collection } from './state/useCollection';
import partition from 'lodash/partition';
import { green } from '@material-ui/core/colors';

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

function needsWatering(plant: Plant, now = new Date(Date.now())) {
  const timeSinceWatering = now.valueOf() - plant.lastWateredAt.valueOf();
  const wateringPeriodInMs = plant.wateringPeriodInDays * 24 * 60 * 60 * 1000;
  return timeSinceWatering > wateringPeriodInMs;
}

const PlantListScreen: React.FC<PlantListScreenProps> = ({ plants }) => {
  const [plantsNeedingWatering, otherPlants] = partition(plants.data, needsWatering);

  return (
    <Container>
      {plantsNeedingWatering.length > 0 && (
        <List>
          {plants.data.map((plant) => (
            <ListItem button key={plant.id}>
              <Tooltip title="Needs to be watered">
                <ListItemIcon>
                  <Icon color="primary">opacity</Icon>
                </ListItemIcon>
              </Tooltip>
              <ListItemText>{plant.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}

      {plantsNeedingWatering.length > 0 && otherPlants.length > 0 && <Divider />}

      {otherPlants.length > 0 && (
        <List>
          {plants.data.map((plant) => (
            <ListItem button key={plant.id}>
              <ListItemText>{plant.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default PlantListScreen;
