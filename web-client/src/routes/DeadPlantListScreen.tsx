import React from "react";
import { Collection } from "src/utilities/state/useCollection";
import { Plant, formatTimeOfDeath } from "src/data/Plant";
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
} from "@rmwc/list";
import "@rmwc/icon-button/styles";
import { GridCell, Grid } from "@rmwc/grid";

import PlantAvatar from "src/components/PlantAvatar";
import Layout from "src/components/Layout";
import { plantListUrl } from "src/routes/PlantListRoute";
import { Typography } from "@rmwc/typography";

import css from "src/routes/DeadPlantListScreen.module.css";
import { deadPlantDetailUrl } from "src/routes/DeadPlantDetailRoute";
import { restoreFromGraveyard } from "src/data/actions";
import ListActionFab from "src/components/ListActionFab";

export type DeadPlantListScreenProps = {
  plants: Collection<Plant>;
};

const DeadPlantListScreen: React.FC<DeadPlantListScreenProps> = ({
  plants,
}) => {
  const deadPlants = plants.data.filter((plant) => plant.timeOfDeath !== null);

  const onResurrectClick = (plant: Plant) => {
    restoreFromGraveyard(plant, plants.dispatch);
  };

  return (
    <Layout
      appBar={{
        title: "Graveyard",
        navigationIcon: { icon: "arrow_back", tag: Link, to: plantListUrl() },
      }}
    >
      <Grid style={{ padding: 0 }}>
        <GridCell tablet={8} desktop={12}>
          {deadPlants.length > 0 && (
            <List twoLine avatarList theme={["onSurface"]}>
              {deadPlants.map((plant) => (
                <ListItem
                  key={plant.id}
                  tag={Link}
                  to={deadPlantDetailUrl(plant.id)}
                >
                  <ListItemGraphic icon={<PlantAvatar plant={plant} />} />
                  <ListItemText>
                    <ListItemPrimaryText style={{ fontWeight: 500 }}>
                      {plant.name}
                    </ListItemPrimaryText>
                    <ListItemSecondaryText>
                      {formatTimeOfDeath(plant)}
                    </ListItemSecondaryText>
                  </ListItemText>
                  <ListItemMeta>
                    <ListActionFab
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onResurrectClick(plant);
                      }}
                      icon="restore_from_trash"
                    />
                  </ListItemMeta>
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
        </GridCell>
      </Grid>
    </Layout>
  );
};

export default DeadPlantListScreen;
