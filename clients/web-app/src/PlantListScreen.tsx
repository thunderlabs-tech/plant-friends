import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Icon,
  ListItemIcon,
  Tooltip,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Container,
  Paper,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Collection } from './state/useCollection';
import partition from 'lodash/partition';
import { Plant, lastWateredAt } from './data/Plant';
import { waterPlant, createPlant, refreshPlants } from './app/actions';
import NewPlantInput from './NewPlantInput';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import { Link } from 'react-router-dom';
import { plantDetailRoute } from './app/routes';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: 'calc(100% - 64px)',
    },
    scrollableContainer: {
      overflow: 'auto',
    },
  });

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

const PlantListScreen: React.FC<WithStyles<typeof styles> & PlantListScreenProps> = ({ plants, classes }) => {
  const [unwateredPlants, wateredPlants]: [Plant[], Plant[]] = partition<Plant>(plants.data, needsWatering);

  const onWaterPlant = (plant: Plant) => {
    waterPlant(plant, plants.dispatch);
  };

  const onAddNewPlant = (plant: Omit<Plant, 'id'>) => {
    createPlant(plant, plants.dispatch);
  };

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100%">
      <AppBar position="static" elevation={1}>
        <Container maxWidth="md" disableGutters>
          <Toolbar>
            <Typography variant="h6">Plant Friends</Typography>

            <Box flexGrow={1} />

            <IconButton edge="end" color="inherit" onClick={() => refreshPlants(plants.dispatch)}>
              <Icon>refresh</Icon>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Box display="flex" flexDirection="column" className={classes.root}>
        <Container maxWidth="md" disableGutters className={classes.scrollableContainer}>
          <Paper>
            {unwateredPlants.length > 0 && (
              <List>
                {unwateredPlants.map((plant) => (
                  <ListItem button key={plant.id} component={Link} to={plantDetailRoute(plant.id)}>
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
                  <ListItem button key={plant.id} component={Link} to={plantDetailRoute(plant.id)}>
                    <ListItemIcon>
                      <Icon color="primary">check</Icon>
                    </ListItemIcon>
                    <ListItemText secondary={formatTimeSinceWatered(plant)}>{plant.name}</ListItemText>
                    <ListItemSecondaryAction onClick={() => onWaterPlant(plant)}>
                      <Tooltip title="Mark watered now">
                        <IconButton edge="end" aria-label="done">
                          <Icon>opacity</Icon>
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Container>

        <Box flexGrow={1} />

        <Container maxWidth="md" disableGutters>
          <NewPlantInput onAddNewPlant={onAddNewPlant} />
        </Container>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(PlantListScreen);
