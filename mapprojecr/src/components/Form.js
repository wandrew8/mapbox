import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


export default function FormComponent(props) {
    const classes = useStyles();
    const [zipCode, setZipCode] = useState("");
    
    const submitForm = (e) => {
        e.preventDefault();
        console.log(zipCode)
        props.getCoordinates(zipCode)
    }

  return (
      <div className="formContainer">
        <div className="container">
            <h2>YOU ARE IN</h2>
            <h1>{props.city}, {props.state}</h1>
            <form 
                onSubmit={submitForm}
                className={classes.root} 
                autoComplete="off">
                <TextField 
                id="outlined-number"
                label="Zip Code"
                type="zipcode"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                variant="outlined"
                />
                <div id="buttonHolder">
                    <Button type="submit" variant="outlined" color="primary">
                        Find on Map
                    </Button>
                </div>
            </form>
        </div>
      </div>
  );
}