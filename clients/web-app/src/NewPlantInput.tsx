import React, { useState, useCallback } from 'react';
import { InputBase, IconButton, Icon, Paper, Box } from '@material-ui/core';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

export type NewPlantInputProps = {
  onAddNewPlant: (name: string) => void;
};

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0.5),
    },
    input: {
      flexGrow: 1,
    },
  });

const NewPlantInput: React.SFC<WithStyles<typeof styles> & NewPlantInputProps> = ({ onAddNewPlant, classes }) => {
  const [nameValue, setNameValue] = useState('');

  return (
    <Paper
      component="form"
      className={classes.root}
      onSubmit={(e) => {
        e.preventDefault();
        onAddNewPlant(nameValue);
      }}
    >
      <Box display="flex">
        <InputBase
          placeholder="Add plant"
          id="newPlant-name"
          name="newPlant-name"
          value={nameValue}
          onChange={useCallback((e) => setNameValue(e.currentTarget.value), [setNameValue])}
          className={classes.input}
        />
        <IconButton type="submit">
          <Icon>add</Icon>
        </IconButton>
      </Box>
    </Paper>
  );
};

export default withStyles(styles)(NewPlantInput);
