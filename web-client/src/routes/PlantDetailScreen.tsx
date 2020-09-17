import React, { useState, FormEvent } from "react";
import { Collection } from "src/utilities/state/useCollection";
import { Plant, formatWateringTime, waterNextAt } from "src/data/Plant";

import { Link, useHistory } from "react-router-dom";
import {
  updatePlant,
  waterPlant,
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
import theme from "src/init/theme";
import { formatDistanceStrict, startOfToday } from "date-fns";

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
      { ...plant, name, wateringPeriodInDays },
      plants.dispatch,
      history,
    );
  };

  const isPlantAlive = !plant.timeOfDeath;
  const waterNextAtDate = waterNextAt(plant);

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
              <GridCell tablet={4}>
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
                  label="Watering Period in Days"
                />
              </GridCell>

              <GridCell
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
                      theme={["textPrimaryOnDark"]}
                      style={{
                        background: theme.primary,
                        marginRight: 16,
                      }}
                      onClick={onWaterNowClick}
                    />
                    <Fab
                      tag="a"
                      icon="delete"
                      theme={["textPrimaryOnDark"]}
                      style={{ background: theme.primary }}
                      onClick={onMoveToGraveyardClick}
                    />
                  </>
                ) : (
                  <Fab
                    tag="a"
                    icon="restore_from_trash"
                    onClick={onResurrectClick}
                    theme={["textPrimaryOnDark"]}
                    style={{ background: theme.primary }}
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
                <ListItemPrimaryText style={{ fontWeight: 500 }}>
                  Died
                </ListItemPrimaryText>
                <ListItemSecondaryText>
                  {formatWateringTime(plant.timeOfDeath)}
                </ListItemSecondaryText>
              </ListItemText>
            </ListItem>
          )}
          {isPlantAlive && (
            <ListItem>
              <ListItemText>
                <ListItemPrimaryText style={{ fontWeight: 500 }}>
                  Water next
                </ListItemPrimaryText>
                <ListItemSecondaryText>
                  {waterNextAtDate
                    ? `in ${formatDistanceStrict(
                        startOfToday(),
                        waterNextAtDate,
                      )}`
                    : "Today"}
                </ListItemSecondaryText>
              </ListItemText>
            </ListItem>
          )}
          <ListItem>
            <ListItemText>
              <ListItemPrimaryText style={{ fontWeight: 500 }}>
                Last watered on
              </ListItemPrimaryText>
              <ListItemSecondaryText>
                {formatWateringTime(plant.lastWateredAt)}
              </ListItemSecondaryText>
            </ListItemText>
          </ListItem>
        </List>
      </Layout>
    </form>
  );
};

export default PlantDetailScreen;
