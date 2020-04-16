import React from 'react';
import { Plant } from './state/dataTypes';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { Collection } from './state/useCollection';

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

const PlantListScreen: React.FC<PlantListScreenProps> = ({ plants }) => {
  return (
    <List>
      {plants.data.map((plant) => (
        <ListItem button key={plant.id}>
          <ListItemText>{plant.name}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

export default PlantListScreen;
