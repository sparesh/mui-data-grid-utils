import React from "react";

import { Select, MenuItem } from "@mui/material";

import { Controller } from "react-hook-form";

import { CompositeFilterOperator } from "../../enums/composite-filter-operator";

export interface CompositeFilterOperatorSelectorProps {
  formPath: string;
}

export const CompositeFilterOperatorSelector = (props: CompositeFilterOperatorSelectorProps) => {
  return (
    <Controller
      name={props.formPath}
      render={({ field }) => (
        <Select autoWidth variant="standard" size="small" disableUnderline sx={{ width: 1 }} {...field}>
          <MenuItem dense value={CompositeFilterOperator.And}>
            And
          </MenuItem>
          <MenuItem dense value={CompositeFilterOperator.Or}>
            Or
          </MenuItem>
        </Select>
      )}
    />
  );
};
