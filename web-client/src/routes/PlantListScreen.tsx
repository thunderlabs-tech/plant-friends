import React from "react";
import { Collection } from "src/utilities/state/useCollection";
import partition from "lodash/partition";
import {
  Plant,
  needsWater,
  formatNextWaterDate,
  PlantInput,
} from "src/data/Plant";
import { waterPlant, createPlant, refreshPlants } from "src/data/actions";
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
import ListActionFab from "src/components/ListActionFab";
import css from "src/routes/PlantListScreen.module.css";

export type PlantListScreenProps = {
  plants: Collection<Plant>;
};

function formatTimeSinceWatered(plant: Plant) {
  const date = plant.lastWateredAt;
  if (!date) return `Never watered`;
  return `Last watered ${date.toLocaleDateString()}`;
}

const PlantListScreen: React.FC<
  PlantListScreenProps & { params: PlantListRouteParams }
> = ({ plants }) => {
  const livePlants = plants.data.filter((plant) => !plant.timeOfDeath);
  const [unwateredPlants, wateredPlants]: [Plant[], Plant[]] = partition<Plant>(
    livePlants,
    needsWater,
  );

  const onWaterPlant = (plant: Plant) => {
    waterPlant(plant, plants.dispatch);
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
            {unwateredPlants.length > 0 && (
              <>
                <ListGroupSubheader>Water today</ListGroupSubheader>

                <List twoLine avatarList>
                  {unwateredPlants.map((plant) => (
                    <ListItem
                      key={plant.id}
                      tag={Link}
                      to={plantDetailUrl(plant.id)}
                    >
                      <ListItemGraphic icon={<PlantAvatar plant={plant} />} />
                      <ListItemText>
                        <ListItemPrimaryText>{plant.name}</ListItemPrimaryText>
                        <ListItemSecondaryText>
                          {formatTimeSinceWatered(plant)}
                        </ListItemSecondaryText>
                      </ListItemText>
                      <ListItemMeta>
                        <ListActionFab
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onWaterPlant(plant);
                          }}
                          icon="opacity"
                        />
                      </ListItemMeta>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {unwateredPlants.length > 0 && wateredPlants.length > 0 && (
              <ListDivider />
            )}

            {wateredPlants.length > 0 && (
              <>
                <List twoLine avatarList>
                  {wateredPlants.map((plant) => (
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
