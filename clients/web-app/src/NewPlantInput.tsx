import React, { useState, useCallback } from 'react';
import { IconButton, Icon, Box, TextField, InputAdornment, Paper } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

export type NewPlantInputProps = {
  onAddNewPlant: (name: string) => void;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0.5),
      width: '100%',
    },
    nameInput: {
      flexGrow: 1,
      marginRight: 8,
    },
    wateringPeriodInput: {
      marginRight: 8,
    },
    button: {
      flexBasis: 55,
    },
  });

const NewPlantInput: React.SFC<WithStyles<typeof styles> & NewPlantInputProps> = ({ onAddNewPlant, classes }) => {
  const [nameValue, setNameValue] = useState('');
  const [wateringPeriodInDays, setWateringPeriodInDays] = useState(7);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddNewPlant(nameValue);
    setNameValue('');
  };

  return (
    <Paper className={classes.root}>
      <Box component="form" display="flex" onSubmit={onSubmit}>
        <TextField
          label="Name"
          placeholder="Add plant"
          variant="outlined"
          id="newPlant-name"
          autoFocus
          name="newPlant-name"
          value={nameValue}
          onChange={useCallback((e) => setNameValue(e.currentTarget.value), [setNameValue])}
          className={classes.nameInput}
        />
        <TextField
          label="Water every"
          id="newPlant-wateringPeriodInDays"
          name="newPlant-wateringPeriodInDays"
          variant="outlined"
          value={wateringPeriodInDays}
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">days</InputAdornment>,
          }}
          onChange={useCallback((e) => setWateringPeriodInDays(parseInt(e.currentTarget.value, 10)), [
            setWateringPeriodInDays,
          ])}
          className={classes.wateringPeriodInput}
        />
        <IconButton type="submit" className={classes.button}>
          <Icon>add</Icon>
        </IconButton>
      </Box>
    </Paper>
  );
};

export default withStyles(styles)(NewPlantInput);
