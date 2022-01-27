import React from "react";

import { ArrowDownwardOutlined, ArrowUpwardOutlined } from "@mui/icons-material";
import { Stack, Button, Typography, Box } from "@mui/material";

import { Controller, useFormContext } from "react-hook-form";

import { MemberSortingDirection } from "../../enums/member-sorting-direction";

export interface MemberSortingDirectionSelectorProps {
  formPath: string;
}

const memberSortingDirections = [
  {
    value: MemberSortingDirection.Ascending,
    toggleValue: MemberSortingDirection.Descending,
    displayText: "Asc",
  },
  {
    value: MemberSortingDirection.Descending,
    toggleValue: MemberSortingDirection.Ascending,
    displayText: "Desc",
  },
];

const findSortingDirection = (direction: MemberSortingDirection | undefined) => {
  return memberSortingDirections.find((sorting) => sorting.value === direction);
};

export const MemberSortingDirectionSelector = (props: MemberSortingDirectionSelectorProps) => {
  const { setValue, getValues } = useFormContext();

  const [sortingDirection, setSortingDirection] = React.useState(() => {
    const sortingDirection: MemberSortingDirection = getValues(props.formPath);

    return findSortingDirection(sortingDirection);
  });

  const handleClick = () => {
    const newSortingDirection = findSortingDirection(sortingDirection?.toggleValue);

    setSortingDirection(newSortingDirection);
    setValue(props.formPath, newSortingDirection?.value);
  };

  return (
    <Controller
      name={props.formPath}
      render={() => (
        <Button
          onClick={handleClick}
          sx={{
            padding: 0,
            color: "inherit",
            width: 1,
            height: 1,
            justifyContent: "space-between",
            alignItems: "center",
            textTransform: "none",
            borderRadius: 0,
          }}
          disableElevation
          disableRipple
          disableTouchRipple
          disableFocusRipple
        >
          <Typography>{sortingDirection?.displayText}</Typography>
          <Stack direction="row">
            {sortingDirection?.value === MemberSortingDirection.Descending ? (
              <ArrowUpwardOutlined fontSize="small" />
            ) : (
              <ArrowDownwardOutlined fontSize="small" />
            )}
            <Box sx={{ paddingX: 0.25 }} />
          </Stack>
        </Button>
      )}
    />
  );
};
