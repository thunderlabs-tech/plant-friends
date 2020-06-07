import React, { useState, FormEvent } from "react";
import { Collection } from "../utilities/state/useCollection";
import { Plant, formatNextWaterDate, formatTimeOfDeath } from "../data/Plant";

import { Link, useHistory } from "react-router-dom";
import {
  updatePlant,
  waterPlant,
  moveToGraveyard,
  restoreFromGraveyard,
} from "../data/actions";
import { PlantDetailRouteParams } from "./PlantDetailRoute";
import Layout from "../components/Layout";
import Surface from "../components/Surface";
import { GridCell, GridRow, Grid } from "@rmwc/grid";

import "@rmwc/typography/styles";
import { Typography } from "@rmwc/typography";
import "@rmwc/textfield/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/button/styles";
import { Button } from "@rmwc/button";
import "@rmwc/list/styles";
import { List, ListItem } from "@rmwc/list";

import TextFieldStyles from "../components/TextField.module.css";
import { useMediaQuery } from "react-responsive";
import { deadPlantListUrl } from "./DeadPlantListRoute";
import { plantListUrl } from "./PlantListRoute";

export type PlantDetailScreenProps = {
  plants: Collection<Plant>;
  deadPlantRoute?: boolean;
};

function formatWateringTime(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

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

  const onWaterNowClick = () => {
    waterPlant(plant!, plants.dispatch);
  };

  const onMoveToGraveyardClick = async () => {
    await moveToGraveyard(plant!, plants.dispatch);
  };

  const onResurrectClick = async () => {
    restoreFromGraveyard(plant!, plants.dispatch);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlant(
      { ...plant!, name, wateringPeriodInDays },
      plants.dispatch,
      history,
    );
  };

  if (!plant) {
    return (
      <Layout
        appBar={{
          navigationIcon: {
            icon: "close",
            tag: Link,
            to: deadPlantRoute ? deadPlantListUrl() : plantListUrl(),
          },
          actionItems: [{ icon: "check", onClick: onSubmit }],
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

  const isPlantAlive = !plant.timeOfDeath;

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
        <Grid theme={["surface"]}>
          <GridCell tablet={8} desktop={12}>
            <Surface>
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
                      setWateringPeriodInDays(
                        parseInt(e.currentTarget.value, 10),
                      )
                    }
                    label="Watering Period in Days"
                  />
                </GridCell>

                <GridCell tablet={8} style={{ textAlign: "right" }}>
                  {isPlantAlive ? (
                    <>
                      <Button
                        tag="a"
                        icon="opacity"
                        onClick={onWaterNowClick}
                        theme={["primary"]}
                      >
                        Water Now
                      </Button>
                      <Button
                        tag="a"
                        icon="delete"
                        onClick={onMoveToGraveyardClick}
                        theme={["primary"]}
                      >
                        Move to Graveyard
                      </Button>
                    </>
                  ) : (
                    <Button
                      tag="a"
                      icon="restore_from_trash"
                      onClick={onResurrectClick}
                      theme={["primary"]}
                    >
                      Resurrect
                    </Button>
                  )}
                </GridCell>

                <GridCell tablet={8} desktop={12}>
                  {isPlantAlive ? (
                    <Typography use="body1">
                      {formatNextWaterDate(plant)}
                    </Typography>
                  ) : (
                    <Typography use="body1">
                      {formatTimeOfDeath(plant)}
                    </Typography>
                  )}
                </GridCell>

                <GridCell tablet={8} desktop={12}>
                  {plant.wateringTimes.length > 0 ? (
                    <>
                      <Typography use="body1">Watered at:</Typography>
                      <List nonInteractive>
                        {plant.wateringTimes.map((date, i) => {
                          return (
                            <ListItem key={i}>
                              {formatWateringTime(date)}
                            </ListItem>
                          );
                        })}
                      </List>
                    </>
                  ) : (
                    "No watering times recorded"
                  )}
                </GridCell>
              </GridRow>
            </Surface>
          </GridCell>
        </Grid>
      </Layout>
    </form>
  );
};

export default PlantDetailScreen;
