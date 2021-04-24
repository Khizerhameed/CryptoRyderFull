import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
// components
//DATA
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "30ch",
    },
  },
}));
function CardSocialTraffic() {
  const classes = useStyles();

  

  return (
    <>
      <div className="relative flex pb-5 flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="block w-full text-center  overflow-x-auto">
          {/* Projects table */}
          <form className={classes.root} autoComplete="on">
            <div className="mt-5">
              <TextField required id="standard-required" label="From" />
              <TextField required id="standard-required" label="To" />

              <TextField
                id="date"
                label="Date"
                type="date"
                defaultValue="today"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="text-center mt-5">
              <button class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold">
                SEARCH
              </button>{" "}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default CardSocialTraffic;
