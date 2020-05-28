import React from 'react';
import { Collection } from '../utilities/state/useCollection';
import { Plant, formatTimeOfDeath } from '../data/Plant';
import { Link } from 'react-router-dom';

import '@rmwc/list/styles';
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemGraphic } from '@rmwc/list';
import '@rmwc/icon-button/styles';
import { GridCell, Grid } from '@rmwc/grid';

import PlantAvatar from '../components/PlantAvatar';
import { DeadPlantListRouteParams } from './DeadPlantListRoute';
import Surface from '../components/Surface';
import Layout from '../components/Layout';
import { plantListUrl } from './PlantListRoute';
import { Typography } from '@rmwc/typography';

import css from './DeadPlantListScreen.module.css';
import { deadPlantDetailUrl } from './DeadPlantDetailRoute';

export type DeadPlantListScreenProps = {
  plants: Collection<Plant>;
};

// TO DO: hook up back link from details view to graveyard - use route structure to differentiate

const DeadPlantListScreen: React.FC<DeadPlantListScreenProps & { params: DeadPlantListRouteParams }> = ({ plants }) => {
  const deadPlants = plants.data.filter((plant) => plant.timeOfDeath !== undefined);

  return (
    <Layout
      appBar={{
        title: 'Graveyard',
        navigationIcon: { icon: 'arrow_back', tag: Link, to: plantListUrl() },
      }}
    >
      <Grid style={{ padding: 0 }}>
        <GridCell tablet={8} desktop={12}>
          <Surface z={1}>
            {deadPlants.length > 0 && (
              <List twoLine avatarList theme={['onSurface']}>
                {deadPlants.map((plant) => (
                  <ListItem key={plant.id} tag={Link} to={deadPlantDetailUrl(plant.id)}>
                    <ListItemGraphic icon={<PlantAvatar plant={plant} />} />
                    <ListItemText>
                      <ListItemPrimaryText>{plant.name}</ListItemPrimaryText>
                      <ListItemSecondaryText>{formatTimeOfDeath(plant)}</ListItemSecondaryText>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            )}

            {deadPlants.length === 0 && (
              <Typography tag="div" use="caption" className={css.emptyMessage}>
                The graveyard is empty.
                <br />
                Eerie...
              </Typography>
            )}
          </Surface>
        </GridCell>
      </Grid>
    </Layout>
  );
};

export default DeadPlantListScreen;
