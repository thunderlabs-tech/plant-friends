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
import { waterPlant, createPlant } from './app/actions';
import NewPlantInput from './NewPlantInput';

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

function needsWatering(plant: Plant, now = new Date(Date.now())) {
  const latestWatered = lastWateredAt(plant);
  if (!latestWatered) return true;

  const timeSinceWatering = now.valueOf() - latestWatered.valueOf();
  const wateringPeriodInMs = plant.wateringPeriodInDays * 24 * 60 * 60 * 1000;

  return timeSinceWatering > wateringPeriodInMs;
}

function formatTimeSinceWatered(plant: Plant) {
  const date = lastWateredAt(plant);
  if (!date) return `Never watered`;
  return `Last watered ${date.toLocaleDateString()}`;
}

const PlantListScreen: React.FC<PlantListScreenProps> = ({ plants }) => {
  const [unwateredPlants, wateredPlants]: [Plant[], Plant[]] = partition<Plant>(plants.data, needsWatering);

  const onWaterPlant = (plant: Plant) => {
    waterPlant({ ...plant, wateringTimes: [new Date(), ...plant.wateringTimes] }, plants.dispatch);
  };

  const onAddNewPlant = (name: string) => {
    createPlant({ name, wateringTimes: [], wateringPeriodInDays: 10 }, plants.dispatch);
  };

  return (
    <Container>
      {unwateredPlants.length > 0 && (
        <List>
          {unwateredPlants.map((plant) => (
            <ListItem button key={plant.id}>
              <Tooltip title="Needs to be watered">
                <ListItemIcon>
                  <Icon color="primary">format_color_reset_outlined</Icon>
                </ListItemIcon>
              </Tooltip>
              <ListItemText secondary={formatTimeSinceWatered(plant)}>{plant.name}</ListItemText>
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
              <ListItemIcon>
                <Icon color="primary">check</Icon>
              </ListItemIcon>
              <ListItemText secondary={formatTimeSinceWatered(plant)}>{plant.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}

      <NewPlantInput onAddNewPlant={onAddNewPlant} />
    </Container>
  );
};

export default PlantListScreen;
