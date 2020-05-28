import React, { useRef, ChangeEvent, useState } from 'react';
import { Collection } from '../utilities/state/useCollection';
import { Plant } from '../data/Plant';
import { batchCreatePlants } from '../data/actions';
import { saveAs } from 'file-saver';

import '@rmwc/list/styles';
import '@rmwc/icon-button/styles';
import { GridCell, Grid } from '@rmwc/grid';
import { DataManagementRouteParams } from './DataManagementRoute';
import Surface from '../components/Surface';
import Layout from '../components/Layout';
import generateCSV from '../data/generateCSV';
import parseCSV from '../data/parseCSV';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import TextFieldStyles from '../components/TextField.module.css';
import { Typography } from '@rmwc/typography';
import { plantListUrl } from './PlantListRoute';
import { Link, useHistory } from 'react-router-dom';

export type DataManagementScreenProps = {
  plants: Collection<Plant>;
};

const DataManagementScreen: React.FC<DataManagementScreenProps & { params: DataManagementRouteParams }> = ({
  plants,
}) => {
  const [csvData, setCsvData] = useState('');
  const history = useHistory();

  function onDownloadCsvClick() {
    const csvContent = generateCSV(plants.data);
    saveAs(csvContent, 'Plant Friends data.csv');
  }

  const requestCsvFile = () => {
    inputRef.current!.click();
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    let newPlants: Plant[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const csvContent = await file.text();
      newPlants = newPlants.concat(await batchCreatePlants(parseCSV(csvContent), plants.dispatch));
    }

    alert(`${newPlants.length} plants added`);
    history.push(plantListUrl());
  };

  const onParseCSVClick = () => {
    try {
      batchCreatePlants(parseCSV(csvData), plants.dispatch);
    } catch (error) {
      alert(`Could not parse CSV data`);
    }
  };

  return (
    <Layout
      appBar={{
        navigationIcon: { icon: 'close', tag: Link, to: plantListUrl() },
        title: 'Plant Friends',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="text/csv"
        style={{ position: 'absolute', left: -10000 }}
        onChange={onUploadInputChange}
      />
      <Surface z={1}>
        <Grid>
          <GridCell tablet={8} desktop={12}>
            <Button onClick={onDownloadCsvClick} icon="cloud_download">
              Download All Data
            </Button>
            <br />
            <Typography use="caption">This will provide all your data in a CSV</Typography>
          </GridCell>

          <GridCell tablet={8} desktop={12}>
            <hr />
          </GridCell>

          {Blob.prototype.hasOwnProperty('text') ? (
            <GridCell tablet={8} desktop={12}>
              <Button onClick={requestCsvFile} icon="cloud_upload">
                Upload Data CSV
              </Button>
            </GridCell>
          ) : (
            <>
              <GridCell tablet={8} desktop={12}>
                <TextField
                  id="csv-data"
                  name="csv-data"
                  textarea
                  outlined
                  value={csvData}
                  label="Paste CSV data here"
                  className={TextFieldStyles.fullWidth}
                  onChange={(e) => setCsvData(e.currentTarget.value)}
                  placeholder="Name"
                />
                <Typography use="caption">
                  Unfortunately your browser doesn't support a CSV file upload. Use this input to paste CSV data instead
                </Typography>
                <br />
                <Button onClick={onParseCSVClick} icon="cloud_upload">
                  Upload
                </Button>
              </GridCell>
            </>
          )}
        </Grid>
      </Surface>
    </Layout>
  );
};

export default DataManagementScreen;
