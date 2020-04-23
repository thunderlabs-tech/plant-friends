import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  AppBar,
  Toolbar,
  Typography,
  Grid,
  TextField,
  Button,
  Theme,
  IconButton,
  Icon,
  InputBase,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
} from '@material-ui/core';
import { Collection } from '../utilities/state/useCollection';
import { Plant, formatNextWaterDate } from '../data/Plant';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Link, useHistory } from 'react-router-dom';
import { updatePlant, waterPlant } from '../data/actions';
import { plantListUrl } from '../routes/PlantListRoute';
import { PlantDetailRouteParams } from './PlantDetailRoute';

const styles = (theme: Theme) =>
  createStyles({
    columnContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      alignItems: 'center',
    },
    scrollableContainer: {
      overflow: 'auto',
      padding: theme.spacing(2),
      width: '100%',
      maxWidth: theme.breakpoints.values.md,
    },
    bottomContainer: {
      paddingBottom: theme.spacing(1),
      paddingTop: theme.spacing(1),
      display: 'flex',
    },
    nameInput: {
      ...theme.typography.h6,
      color: 'inherit',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
  });

export type PlantDetailScreenProps = {
  plants: Collection<Plant>;
};

const PlantDetailScreen: React.FC<
  WithStyles<typeof styles> & { params: PlantDetailRouteParams } & PlantDetailScreenProps
> = ({ plants, classes, params }) => {
  const plant = plants.data.find((plantElement) => plantElement.id === params.id);

  const history = useHistory();
  const [name, setName] = useState(plant ? plant.name : '');
  const [wateringPeriodInDays, setWateringPeriodInDays] = useState(plant ? plant.wateringPeriodInDays : 0);
  const theme = useTheme();
  const mdOrHigher = useMediaQuery(theme.breakpoints.up('md'));

  const onWaterNowClick = () => {
    waterPlant(plant!, plants.dispatch);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit');
    updatePlant({ ...plant!, name, wateringPeriodInDays }, plants.dispatch, history);
  };

  if (!plant) {
    return (
      <Box className={classes.columnContainer}>
        <AppBar position="static" elevation={1}>
          <Container maxWidth="md" disableGutters>
            <Toolbar>
              <Typography variant="h6">Plant Friends</Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Box display="flex" flexDirection="column" className={classes.contentContainer}>
          Can't find that plant
        </Box>
      </Box>
    );
  }

  return (
    <Box className={classes.columnContainer} component="form" onSubmit={onSubmit}>
      <AppBar position="static" elevation={1}>
        <Container maxWidth="md" disableGutters>
          <Toolbar>
            <IconButton
              component={Link}
              edge="start"
              color="inherit"
              className={classes.backButton}
              to={plantListUrl()}
            >
              <Icon>close</Icon>
            </IconButton>

            <InputBase
              id="plant-name"
              name="plant-name"
              className={classes.nameInput}
              value={name}
              autoFocus={mdOrHigher}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Name"
            />

            <Box flexGrow={1} />

            <Button color="inherit" type="submit">
              Save
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Box className={classes.contentContainer}>
        <Paper className={classes.scrollableContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                id="plant-wateringPeriodInDays"
                name="plant-wateringPeriodInDays"
                value={wateringPeriodInDays}
                variant="outlined"
                fullWidth
                type="number"
                onChange={(e) => setWateringPeriodInDays(parseInt(e.currentTarget.value, 10))}
                label="Watering Period in Days"
              />
            </Grid>

            <Grid item xs={12}>
              <Button startIcon={<Icon>opacity</Icon>} onClick={onWaterNowClick} color="primary">
                Water Now
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography>{formatNextWaterDate(plant)}</Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              {plant.wateringTimes.length > 0 ? (
                <>
                  <Typography>Watered at:</Typography>
                  <List>
                    {plant.wateringTimes.map((date, i) => {
                      return <ListItem key={i}>{date.toLocaleDateString()}</ListItem>;
                    })}
                  </List>
                </>
              ) : (
                'No watering times recorded'
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(PlantDetailScreen);
