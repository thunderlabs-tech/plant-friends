import React from 'react';
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
import { Collection } from './state/useCollection';
import partition from 'lodash/partition';
import { Plant, lastWateredAt } from './data/Plant';
import { waterPlant } from './app/actions';

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

function needsWatering(plant: Plant, now = new Date(Date.now())) {
  const timeSinceWatering = now.valueOf() - lastWateredAt(plant).valueOf();
  const wateringPeriodInMs = plant.wateringPeriodInDays * 24 * 60 * 60 * 1000;
  return timeSinceWatering > wateringPeriodInMs;
}

const PlantListScreen: React.FC<PlantListScreenProps> = ({ plants }) => {
  const [unwateredPlants, wateredPlants]: [Plant[], Plant[]] = partition<Plant>(plants.data, needsWatering);

  const onWaterPlant = (plant: Plant) => {
    waterPlant({ ...plant, wateringTimes: [new Date(), ...plant.wateringTimes] }, plants.dispatch);
  };

  return (
    <Container>
      {unwateredPlants.length > 0 && (
        <List>
          {unwateredPlants.map((plant) => (
            <ListItem button key={plant.id}>
              <Tooltip title="Needs to be watered">
                <ListItemIcon>
                  <Icon color="primary">opacity</Icon>
                </ListItemIcon>
              </Tooltip>
              <ListItemText secondary={`Last watered ${lastWateredAt(plant).toLocaleDateString()}`}>
                {plant.name}
              </ListItemText>
              <ListItemSecondaryAction onClick={() => onWaterPlant(plant)}>
                <IconButton edge="end" aria-label="done">
                  <Icon>check</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {unwateredPlants.length > 0 && wateredPlants.length > 0 && <Divider />}

      {wateredPlants.length > 0 && (
        <List>
          {wateredPlants.map((plant) => (
            <ListItem button key={plant.id}>
              <ListItemText secondary={`Last watered ${lastWateredAt(plant).toLocaleDateString()}`}>
                {plant.name}
              </ListItemText>
              <ListItemSecondaryAction onClick={() => onWaterPlant(plant)}>
                <IconButton edge="end" aria-label="done">
                  <Icon>check</Icon>
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default PlantListScreen;
