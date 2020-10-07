import React from "react";
import { Collection } from "src/utilities/state/useCollection";
import partition from "lodash/partition";
import {
  Plant,
  formatNextWaterDate,
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
} from "src/data/actions";
import { Link } from "react-router-dom";

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

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

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
                        {needsWater(plant) && (
                          <Fab
                            mini
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onWaterPlant(plant);
                            }}
                            icon="opacity"
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
                            style={{ marginLeft: 15 }}
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
                          Water next on {formatNextWaterDate(plant)}
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
