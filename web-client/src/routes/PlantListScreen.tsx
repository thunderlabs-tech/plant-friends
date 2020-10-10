import React from "react";
import { Collection } from "src/utilities/state/useCollection";
import partition from "lodash/partition";
import {
  Plant,
  PlantInput,
  actionRequired,
  needsWater,
  needsFertilizer,
} from "src/data/Plant";
import {
  waterPlant,
  createPlant,
  refreshPlants,
  fertilizePlant,
  snoozeReminders,
} from "src/data/actions";
import { Link } from "react-router-dom";
import classNames from "classnames";
import "@rmwc/list/styles";
import {
  List,
  ListDivider,
  ListItem,
  ListItemText,
  ListItemPrimaryText,
  ListItemSecondaryText,
  ListItemGraphic,
  ListItemMeta,
  ListGroup,
  ListGroupSubheader,
} from "@rmwc/list";
import "@rmwc/icon-button/styles";
import { GridCell, Grid } from "@rmwc/grid";
import { plantDetailUrl } from "src/routes/PlantDetailRoute";
import NewPlantInput from "src/components/NewPlantInput";
import PlantAvatar from "src/components/PlantAvatar";
import { PlantListRouteParams } from "src/routes/PlantListRoute";
import Layout from "src/components/Layout";
import { deadPlantListUrl } from "src/routes/DeadPlantListRoute";
import { dataManagementUrl } from "src/routes/DataManagementRoute";
import "@rmwc/fab/styles";
import { Fab } from "@rmwc/fab";
import css from "src/routes/PlantListScreen.module.css";
import { isEqual, isToday } from "date-fns";
import { dateFormatters, plantEventTypeToAction } from "src/utilities/i18n";
import { PlantEventType } from "src/gen/API";

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

function formatNextActions(plant: Plant): string {
  const upcomingActions: {
    action: PlantEventType;
    date: Date;
  }[] = [{ action: PlantEventType.WATERED, date: plant.waterNextAt }];

  if (plant.fertilizeNextAt) {
    upcomingActions.push({
      action: PlantEventType.FERTILIZED,
      date: plant.fertilizeNextAt,
    });
  }

  const upcomingActionsByDate = upcomingActions.sort((a1, a2) =>
    a1.date < a2.date ? -1 : a1.date === a2.date ? 0 : 1,
  );

  const nextActionDate = upcomingActionsByDate[0].date;
  const allActionsOnDate = upcomingActionsByDate.filter((action) =>
    isEqual(action.date, nextActionDate),
  );

  return `${allActionsOnDate
    .map((action) => plantEventTypeToAction[action.action])
    .join(", ")} on ${
    isToday(nextActionDate)
      ? "today"
      : dateFormatters.date.format(nextActionDate)
  }`;
}

const PlantListScreen: React.FC<
  PlantListScreenProps & { params: PlantListRouteParams }
> = ({ plants }) => {
  const livePlants = plants.data.filter((plant) => !plant.timeOfDeath);
  const [plantsRequiringAction, restPlants]: [Plant[], Plant[]] = partition<
    Plant
  >(livePlants, actionRequired);

  const onWaterPlant = (plant: Plant) => {
    waterPlant(plant, plants.dispatch);
  };

  const onFertilizePlant = (plant: Plant) => {
    fertilizePlant(plant, plants.dispatch);
  };

  const onAddNewPlant = (plant: PlantInput) => {
    createPlant(plant, plants.dispatch);
  };

  const onSkip = (plant: Plant) => {
    snoozeReminders(plant, plants.dispatch);
  };

  return (
    <Layout
      appBar={{
        title: (
          <div>
            Plant <span className={css.titleHighlight}>Friends</span>
          </div>
        ),
        actionItems: [
          {
            icon: "delete_outlined",
            tag: Link,
            to: deadPlantListUrl(),
          },
          {
            icon: "cloud_queue",
            tag: Link,
            to: dataManagementUrl(),
          },
          { icon: "refresh", onClick: () => refreshPlants(plants.dispatch) },
        ],
      }}
    >
      <Grid className={css.grid}>
        <GridCell tablet={8} desktop={12}>
          <ListGroup>
            {plantsRequiringAction.length > 0 && (
              <>
                <ListGroupSubheader>Today</ListGroupSubheader>

                <List twoLine avatarList>
                  {plantsRequiringAction.map((plant) => (
                    <ListItem
                      key={plant.id}
                      tag={Link}
                      to={plantDetailUrl(plant.id)}
                    >
                      <ListItemGraphic icon={<PlantAvatar plant={plant} />} />
                      {plant.name}
                      <ListItemMeta>
                        {(needsWater(plant) || needsFertilizer(plant)) && (
                          <Fab
                            mini
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onSkip(plant);
                            }}
                            icon="snooze"
                            className={classNames(
                              css.actionButton,
                              css.snoozeActionButton,
                            )}
                          />
                        )}
                        {needsWater(plant) && (
                          <Fab
                            mini
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onWaterPlant(plant);
                            }}
                            icon="opacity"
                            className={css.actionButton}
                          />
                        )}
                        {needsFertilizer(plant) && (
                          <Fab
                            mini
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onFertilizePlant(plant);
                            }}
                            icon="group_work"
                            className={css.actionButton}
                          />
                        )}
                      </ListItemMeta>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {plantsRequiringAction.length > 0 && restPlants.length > 0 && (
              <ListDivider />
            )}

            {restPlants.length > 0 && (
              <>
                <List twoLine avatarList>
                  {restPlants.map((plant) => (
                    <ListItem
                      key={plant.id}
                      tag={Link}
                      to={plantDetailUrl(plant.id)}
                    >
                      <ListItemGraphic icon={<PlantAvatar plant={plant} />} />
                      <ListItemText>
                        <ListItemPrimaryText>{plant.name}</ListItemPrimaryText>
                        <ListItemSecondaryText>
                          {formatNextActions(plant)}
                        </ListItemSecondaryText>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </ListGroup>
        </GridCell>

        <GridCell phone={4} tablet={8} desktop={12}>
          <NewPlantInput onAddNewPlant={onAddNewPlant} />
        </GridCell>
      </Grid>
    </Layout>
  );
};

export default PlantListScreen;
