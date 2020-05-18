import React, { useState, useCallback } from 'react';
import { Plant } from '../data/Plant';
import '@rmwc/textfield/styles';
import { TextField } from '@rmwc/textfield';
import '@rmwc/icon-button/styles';
import { IconButton } from '@rmwc/icon-button';
import { useMediaQuery } from 'react-responsive';
import '@rmwc/button/styles';
import { Button } from '@rmwc/button';

import TextFieldStyles from '../components/TextField.module.css';
import { GridCell, Grid } from '@rmwc/grid';

export type NewPlantInputProps = {
  onAddNewPlant: (plant: Omit<Plant, 'id'>) => void;
};

const NewPlantInput: React.SFC<NewPlantInputProps> = ({ onAddNewPlant }) => {
  const [name, setName] = useState('');
  const [wateringPeriodInDays, setWateringPeriodInDays] = useState(7);
  const isPhone = useMediaQuery({ query: '(max-width: 599px)' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewPlant({ name, wateringPeriodInDays, wateringTimes: [] });
    setName('');
  };

  return (
    <Grid tag="form" onSubmit={onSubmit} style={{ paddingTop: 0 }}>
      <GridCell phone={4} tablet={5} desktop={8}>
        <TextField
          label="Name"
          placeholder="Add plant"
          id="newPlant-name"
          autoFocus={!isPhone}
          name="newPlant-name"
          value={name}
          onChange={useCallback((e) => setName(e.currentTarget.value), [setName])}
          className={TextFieldStyles.fullWidth}
        />
      </GridCell>

      <GridCell phone={4} tablet={2} desktop={3}>
        <TextField
          label="Water every (days)"
          id="newPlant-wateringPeriodInDays"
          name="newPlant-wateringPeriodInDays"
          value={wateringPeriodInDays}
          type="number"
          onChange={useCallback((e) => setWateringPeriodInDays(parseInt(e.currentTarget.value, 10)), [
            setWateringPeriodInDays,
          ])}
          className={TextFieldStyles.fullWidth}
        />
      </GridCell>

      <GridCell phone={4} tablet={1} desktop={1}>
        {isPhone ? (
          <Button type="submit" theme={['primaryBg', 'onPrimary']} style={{ width: '100%' }}>
            Add Plant
          </Button>
        ) : (
          <IconButton type="submit" icon="add" />
        )}
      </GridCell>
    </Grid>
  );
};

export default NewPlantInput;
