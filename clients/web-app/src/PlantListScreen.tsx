import React, { useCallback } from 'react';
import { Plant } from './state/dataTypes';
import {
  List,
  ListItem,
  ListItemText,
  Container,
  Divider,
  Icon,
  ListItemIcon,
  Tooltip,
  ListItemSecondaryAction,
  IconButton,
} from '@material-ui/core';
import { Collection, UpdateElement } from './state/useCollection';
import partition from 'lodash/partition';

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

function needsWatering(plant: Plant, now = new Date(Date.now())) {
  const timeSinceWatering = now.valueOf() - plant.lastWateredAt.valueOf();
  const wateringPeriodInMs = plant.wateringPeriodInDays * 24 * 60 * 60 * 1000;
  return timeSinceWatering > wateringPeriodInMs;
}

const UnwateredPlantListItem: React.FC<{
  plant: Plant;
  updatePlant: UpdateElement<Plant>;
}> = ({ plant, updatePlant }) => {
  return (
    <ListItem button>
      <Tooltip title="Needs to be watered">
        <ListItemIcon>
          <Icon color="primary">opacity</Icon>
        </ListItemIcon>
      </Tooltip>
      <ListItemText secondary={`Last watered ${plant.lastWateredAt.toLocaleDateString()}`}>{plant.name}</ListItemText>
      <ListItemSecondaryAction
        onClick={useCallback(() => {
          updatePlant(plant, { ...plant, lastWateredAt: new Date() });
        }, [plant, updatePlant])}
      >
        <IconButton edge="end" aria-label="done">
          <Icon>check</Icon>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const PlantListScreen: React.FC<PlantListScreenProps> = ({ plants }) => {
  const [unwateredPlants, wateredPlants]: [Plant[], Plant[]] = partition<Plant>(plants.data, needsWatering);

  return (
    <Container>
      {unwateredPlants.length > 0 && (
        <List>
          {unwateredPlants.map((plant) => (
            <UnwateredPlantListItem key={plant.id} plant={plant} updatePlant={plants.dispatch.updateElement} />
          ))}
        </List>
      )}

      {unwateredPlants.length > 0 && wateredPlants.length > 0 && <Divider />}

      {wateredPlants.length > 0 && (
        <List>
          {wateredPlants.map((plant) => (
            <ListItem button key={plant.id}>
              <ListItemText secondary={`Last watered ${plant.lastWateredAt.toLocaleDateString()}`}>
                {plant.name}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default PlantListScreen;
