import React, { useRef, ChangeEvent, useState, useEffect } from "react";
import { Collection } from "../utilities/state/useCollection";
import { Plant } from "../data/Plant";
import { deleteAllData, persistImportedData } from "../data/actions";
import { saveAs } from "file-saver";

import "@rmwc/list/styles";
import "@rmwc/icon-button/styles";
import { GridCell, Grid } from "@rmwc/grid";
import { DataManagementRouteParams } from "./DataManagementRoute";
import Surface from "../components/Surface";
import assertPresent from "../utilities/lang/assertPresent";
import Layout from "../components/Layout";
import parseImportFileContent from "../data/parseImportFileContent";
import { InvalidImportFormatError } from "../data/parseImportFileContent";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";
import TextFieldStyles from "../components/TextField.module.css";
import { Typography } from "@rmwc/typography";
import { plantListUrl } from "./PlantListRoute";
import { Link, useHistory } from "react-router-dom";
import persistence, { IncompatibleImportError } from "../data/persistence";
import exportData from "../data/exportData";

export type DataManagementScreenProps = {
  plants: Collection<Plant>;
};

const DataManagementScreen: React.FC<
  DataManagementScreenProps & { params: DataManagementRouteParams }
> = ({ plants }) => {
  const [importDataInputValue, setImportDataInputValue] = useState("");
  const [userId, setUserId] = useState("...");

  useEffect(() => {
    async function fetchData() {
      setUserId(await persistence.getUserId());
    }
    fetchData();
  }, []);
  const history = useHistory();

  async function onDownloadExportClick() {
    const fileContent = exportData(await persistence.getDataForExport());
    saveAs(
      new Blob([fileContent], { type: "application/json;charset=utf-8" }),
      "Plant Friends data.json",
    );
  }

  const inputRef = useRef<HTMLInputElement>(null);

  const requestExportFile = () => assertPresent(inputRef.current).click();

  const parseAndImportFileContent = async (
    fileContent: string,
  ): Promise<void> => {
    let newPlants: Plant[];

    try {
      const importedData = parseImportFileContent(fileContent);

      newPlants = await persistImportedData(importedData, plants.dispatch);
    } catch (error) {
      if (
        !(
          error instanceof InvalidImportFormatError ||
          error instanceof IncompatibleImportError
        )
      ) {
        throw error;
      }

      window.alert(error.message);
      return;
    }

    alert(`${newPlants.length} plants added`);
    history.push(plantListUrl());
  };

  const onUploadInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.currentTarget;
    const files = fileInput.files;
    if (files === null || files.length === 0) return;

    if (files.length > 1) {
      alert(
        "Can't import more than one file since later files will override earlier ones",
      );
      return;
    }

    const file = files[0];
    const fileContent = await file.text();

    fileInput.value = "";

    parseAndImportFileContent(fileContent);
  };

  const onImportTextContentClick = async () => {
    parseAndImportFileContent(importDataInputValue);
  };

  const onDeleteAllClick = () => {
    deleteAllData(plants.dispatch, history);
  };

  const onSetUserIdClick = () => {
    persistence.setUserId(userId);
  };

  return (
    <Layout
      appBar={{
        navigationIcon: { icon: "arrow_back", tag: Link, to: plantListUrl() },
        title: "Data Management",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        style={{ position: "absolute", left: -10000 }}
        onChange={onUploadInputChange}
      />
      <Surface z={1}>
        <Grid>
          <GridCell tablet={8} desktop={12}>
            <TextField
              id="user-id"
              name="user-id"
              value={userId}
              label="User ID"
              helpText="Set your user ID and reboot the app"
              className={TextFieldStyles.fullWidth}
              onChange={(e) => setUserId(e.currentTarget.value)}
            />

            <Button onClick={onSetUserIdClick} icon="save">
              Set User ID
            </Button>
          </GridCell>

          <GridCell tablet={8} desktop={12}>
            <hr />
          </GridCell>

          <GridCell tablet={8} desktop={12}>
            <Button onClick={onDownloadExportClick} icon="cloud_download">
              Download All Data
            </Button>
            <br />
            <Typography use="caption">
              This will provide all your data in a JSON file
            </Typography>
          </GridCell>

          <GridCell tablet={8} desktop={12}>
            <hr />
          </GridCell>

          {Object.prototype.hasOwnProperty.call(Blob.prototype, "text") ? (
            <GridCell tablet={8} desktop={12}>
              <Button onClick={requestExportFile} icon="cloud_upload">
                Import Data
              </Button>
            </GridCell>
          ) : (
            <>
              <GridCell tablet={8} desktop={12}>
                <TextField
                  id="export-data"
                  name="export-data"
                  textarea
                  outlined
                  value={importDataInputValue}
                  label="Paste export content here"
                  className={TextFieldStyles.fullWidth}
                  onChange={(e) =>
                    setImportDataInputValue(e.currentTarget.value)
                  }
                  placeholder="Name"
                />
                <Typography use="caption">
                  Unfortunately your device doesn't support file upload. Use
                  this input to paste the content of an exported file instead
                </Typography>
                <br />
                <Button onClick={onImportTextContentClick} icon="cloud_upload">
                  Upload
                </Button>
              </GridCell>
            </>
          )}

          <GridCell tablet={8} desktop={12}>
            <hr />
          </GridCell>

          <GridCell tablet={8} desktop={12}>
            <Button onClick={onDeleteAllClick} icon="delete_sweep">
              Delete All Data
            </Button>
            <br />
            <Typography use="caption">
              This will delete all Plant Friends data from this device
            </Typography>
            <br />
            <Typography use="caption">WARNING! You can't undo this!</Typography>
          </GridCell>
        </Grid>
      </Surface>
    </Layout>
  );
};

export default DataManagementScreen;
