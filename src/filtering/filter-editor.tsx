import React from "react";

import { Popover, Button, Stack, List } from "@mui/material";

import { useForm, FormProvider } from "react-hook-form";

import { CompositeFilter } from "./components/composite-filter/composite-filter";
import { CompositeFilterDescriptor } from "./filter-descriptors/composite-filter-descriptor";
import { CompositeFilterOperator } from "./enums/composite-filter-operator";
import { Member } from "../common/member";

export interface FilterEditorProps {
  handleSubmit?: (filter: CompositeFilterDescriptor) => void;
  handleClose: () => void;

  anchorEl: HTMLElement | null;
  availableMembers: Member[];
  initialFilter?: CompositeFilterDescriptor | undefined;
}

export const FilterEditor = (props: FilterEditorProps) => {
  const methods = useForm({
    defaultValues: {
      rootFilter: props.initialFilter || {
        operator: CompositeFilterOperator.And,
        filters: [],
      },
    },
  });

  const onSubmit = methods.handleSubmit((filterContainer) => {
    props.handleClose();

    const defaultSubmitFunction = props.handleSubmit || ((data: any) => console.log(data));

    return defaultSubmitFunction(filterContainer.rootFilter as CompositeFilterDescriptor);
  });

  return (
    <Popover
      open={Boolean(props.anchorEl)}
      anchorEl={props.anchorEl}
      onBackdropClick={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{ sx: { overflow: "auto" } }}
    >
      <Stack sx={{ width: "max-content" }}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit}>
            <List disablePadding>
              <CompositeFilter indent={0} formPath={"rootFilter"} availableMembers={props.availableMembers} />
            </List>
            <Button
              size="large"
              variant="contained"
              fullWidth={true}
              type="submit"
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: (theme) => theme.zIndex.modal,
                borderRadius: 0,
              }}
            >
              Apply Filters
            </Button>
          </form>
        </FormProvider>
      </Stack>
    </Popover>
  );
};
