import React, { useState, FormEvent } from "react";
import { Collection } from "src/utilities/state/useCollection";
import {
  Plant,
  formatLastActionTime,
  waterNextAt,
  fertilizeNextAt,
  formatTimeUntilAction,
} from "src/data/Plant";

import { Link, useHistory } from "react-router-dom";
import {
  updatePlant,
  waterPlant,
  fertilizePlant,
  moveToGraveyard,
  restoreFromGraveyard,
} from "src/data/actions";
import { PlantDetailRouteParams } from "src/routes/PlantDetailRoute";
import Layout from "src/components/Layout";
import { GridCell, GridRow, Grid } from "@rmwc/grid";
import "@rmwc/typography/styles";
import { Typography } from "@rmwc/typography";
import "@rmwc/textfield/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/button/styles";
import "@rmwc/fab/styles";
import { Fab } from "@rmwc/fab";
import "@rmwc/list/styles";
import {
  List,
  ListItem,
  ListItemPrimaryText,
  ListItemSecondaryText,
  ListItemText,
} from "@rmwc/list";
import TextFieldStyles from "src/components/TextField.module.css";
import { useMediaQuery } from "react-responsive";
import { deadPlantListUrl } from "src/routes/DeadPlantListRoute";
import { plantListUrl } from "src/routes/PlantListRoute";
import { dateFormatters } from "src/utilities/i18n";
import css from "src/routes/PlantDetailScreen.module.css";

export type PlantDetailScreenProps = {
  plants: Collection<Plant>;
  deadPlantRoute?: boolean;
};

const PlantDetailScreen: React.FC<
  { params: PlantDetailRouteParams } & PlantDetailScreenProps
> = ({ plants, params, deadPlantRoute }) => {
  const plant = plants.data.find(
    (plantElement) => plantElement.id === params.id,
  );

  const history = useHistory();
  const [name, setName] = useState(plant ? plant.name : "");
  const [wateringPeriodInDays, setWateringPeriodInDays] = useState(
    plant ? plant.wateringPeriodInDays : 0,
  );
  const [fertilizingPeriodInDays, setFertilizingPeriodInDays] = useState(
    plant ? plant.fertilizingPeriodInDays : null,
  );

  const tabletOrHigher = useMediaQuery({ query: "(min-width: 600px)" });

  if (!plant) {
    return (
      <Layout
        appBar={{
          navigationIcon: {
            icon: "close",
            tag: Link,
            to: deadPlantRoute ? deadPlantListUrl() : plantListUrl(),
          },
          title: "Plant Friends",
        }}
      >
        <Grid>
          <GridCell>
            <Typography use="body1">Can't find that plant</Typography>
          </GridCell>
        </Grid>
      </Layout>
    );
  }

  const onWaterNowClick = () => {
    waterPlant(plant, plants.dispatch);
  };

  const onFertilizeNowClick = () => {
    fertilizePlant(plant, plants.dispatch);
  };

  const onMoveToGraveyardClick = async () => {
    await moveToGraveyard(plant, plants.dispatch);
  };

  const onResurrectClick = async () => {
    restoreFromGraveyard(plant, plants.dispatch);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlant(
      plant,
      { ...plant, name, wateringPeriodInDays, fertilizingPeriodInDays },
      plants.dispatch,
      history,
    );
  };

  const isPlantAlive = !plant.timeOfDeath;
  // TODO: this belongs in `waterNextAt`
  const waterNextAtDate = waterNextAt(plant) || new Date();
  const fertilizeNextAtDate = fertilizeNextAt(plant);

  return (
    <form onSubmit={onSubmit}>
      <Layout
        appBar={{
          navigationIcon: {
            icon: "close",
            tag: Link,
            to: deadPlantRoute ? deadPlantListUrl() : plantListUrl(),
          },
          actionItems: [{ icon: "check", onClick: onSubmit }],
          title: plant.name,
        }}
      >
        <Grid>
          <GridCell tablet={8} desktop={12}>
            <GridRow>
              <GridCell desktop={12} tablet={8}>
                <TextField
                  id="plant-name"
                  name="plant-name"
                  value={name}
                  label="Name"
                  className={TextFieldStyles.fullWidth}
                  autoFocus={tabletOrHigher}
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder="Name"
                />
              </GridCell>

              <GridCell tablet={4}>
                <TextField
                  id="plant-wateringPeriodInDays"
                  name="plant-wateringPeriodInDays"
                  value={wateringPeriodInDays}
                  className={TextFieldStyles.fullWidth}
                  type="number"
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setWateringPeriodInDays(parseInt(e.currentTarget.value, 10))
                  }
                  label="Water every (days)"
                />
              </GridCell>

              <GridCell tablet={4}>
                <TextField
                  id="plant-fertilizingPeriodInDays"
                  name="plant-fertilizingPeriodInDays"
                  value={
                    fertilizingPeriodInDays === null
                      ? ""
                      : fertilizingPeriodInDays
                  }
                  className={TextFieldStyles.fullWidth}
                  type="number"
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    setFertilizingPeriodInDays(
                      e.currentTarget.value.trim() !== ""
                        ? parseInt(e.currentTarget.value.trim(), 10)
                        : null,
                    )
                  }
                  label="Fertilize every (days)"
                />
              </GridCell>

              <GridCell
                desktop={12}
                tablet={8}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexDirection: "row",
                }}
              >
                {isPlantAlive ? (
                  <>
                    <Fab
                      tag="a"
                      icon="opacity"
                      mini
                      className={css.actionButton}
                      onClick={onWaterNowClick}
                    />
                    <Fab
                      tag="a"
                      icon="group_work"
                      mini
                      className={css.actionButton}
                      onClick={onFertilizeNowClick}
                    />
                    <Fab
                      tag="a"
                      icon="delete"
                      mini
                      className={css.actionButton}
                      onClick={onMoveToGraveyardClick}
                    />
                  </>
                ) : (
                  <Fab
                    tag="a"
                    icon="restore_from_trash"
                    className={css.actionButton}
                    onClick={onResurrectClick}
                    mini
                  />
                )}
              </GridCell>
            </GridRow>
          </GridCell>
        </Grid>

        <List nonInteractive twoLine theme={["onSurface"]}>
          {plant.timeOfDeath && (
            <ListItem>
              <ListItemText>
                <ListItemPrimaryText>Died</ListItemPrimaryText>
                <ListItemSecondaryText>
                  {formatLastActionTime(plant.timeOfDeath)}
                </ListItemSecondaryText>
              </ListItemText>
            </ListItem>
          )}
          {isPlantAlive && (
            <ListItem>
              <ListItemText>
                <ListItemPrimaryText>Water next</ListItemPrimaryText>
                <ListItemSecondaryText>
                  <abbr title={dateFormatters.date.format(waterNextAtDate)}>
                    {formatTimeUntilAction(waterNextAtDate)}
                  </abbr>
                </ListItemSecondaryText>
              </ListItemText>
            </ListItem>
          )}
          <ListItem>
            <ListItemText>
              <ListItemPrimaryText>Last watered</ListItemPrimaryText>
              <ListItemSecondaryText>
                {formatLastActionTime(plant.lastWateredAt)}
              </ListItemSecondaryText>
            </ListItemText>
          </ListItem>
          {isPlantAlive && fertilizeNextAtDate && (
            <ListItem>
              <ListItemText>
                <ListItemPrimaryText>Fertilize next</ListItemPrimaryText>
                <ListItemSecondaryText>
                  <abbr title={dateFormatters.date.format(fertilizeNextAtDate)}>
                    {formatTimeUntilAction(fertilizeNextAtDate)}
                  </abbr>
                </ListItemSecondaryText>
              </ListItemText>
            </ListItem>
          )}
          {plant.fertilizingPeriodInDays !== null && (
            <ListItem>
              <ListItemText>
                <ListItemPrimaryText>Last fertilized</ListItemPrimaryText>
                <ListItemSecondaryText>
                  {formatLastActionTime(plant.lastFertilizedAt)}
                </ListItemSecondaryText>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Layout>
    </form>
  );
};

export default PlantDetailScreen;
