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
  ListItem,
  ListItemText,
  ListItemPrimaryText,
  ListItemSecondaryText,
  ListItemGraphic,
  ListItemMeta,
  ListDivider,
} from "@rmwc/list";
import "@rmwc/icon-button/styles";
import { IconButton } from "@rmwc/icon-button";
import { GridCell, Grid } from "@rmwc/grid";

import { plantDetailUrl } from "src/routes/PlantDetailRoute";
import NewPlantInput from "src/components/NewPlantInput";
import PlantAvatar from "src/components/PlantAvatar";
import { PlantListRouteParams } from "src/routes/PlantListRoute";
import Surface from "src/components/Surface";
import Layout from "src/components/Layout";
import { deadPlantListUrl } from "src/routes/DeadPlantListRoute";
import { dataManagementUrl } from "src/routes/DataManagementRoute";

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
        title: "Plant Friends",
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
      <Grid style={{ padding: 0 }}>
        <GridCell tablet={8} desktop={12}>
          <Surface z={1}>
            <List twoLine avatarList theme={["onSurface"]}>
              {unwateredPlants.length > 0 &&
                unwateredPlants.map((plant) => (
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
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onWaterPlant(plant);
                        }}
                        theme={["primary"]}
                        icon="opacity"
                      />
                    </ListItemMeta>
                  </ListItem>
                ))}

              {unwateredPlants.length > 0 && wateredPlants.length > 0 && (
                <ListDivider />
              )}

              {wateredPlants.length > 0 &&
                wateredPlants.map((plant) => (
                  <ListItem
                    key={plant.id}
                    tag={Link}
                    to={plantDetailUrl(plant.id)}
                  >
                    <ListItemGraphic icon={<PlantAvatar plant={plant} />} />
                    <ListItemText>
                      <ListItemPrimaryText>{plant.name}</ListItemPrimaryText>
                      <ListItemSecondaryText>
                        {formatNextWaterDate(plant)}
                      </ListItemSecondaryText>
                    </ListItemText>
                  </ListItem>
                ))}
            </List>
          </Surface>
        </GridCell>

        <GridCell phone={4} tablet={8} desktop={12}>
          <NewPlantInput onAddNewPlant={onAddNewPlant} />
        </GridCell>
      </Grid>
    </Layout>
  );
};

export default PlantListScreen;
