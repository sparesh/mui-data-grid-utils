import React from "react";

import { Popover, Button, Stack } from "@mui/material";

import { useForm, FormProvider } from "react-hook-form";

import { Member } from "../common/member";
import { CompositeSortingDescriptor } from "./sorting-descriptors/composite-sorting-descriptor";
import { CompositeSorting } from "./components/composite-sorting/composite-sorting";

export interface SortingEditorProps {
  handleSubmit?: (sorting: CompositeSortingDescriptor) => void;
  handleClose: () => void;

  anchorEl: HTMLElement | null;
  availableMembers: Member[];
  initialSorting?: CompositeSortingDescriptor | undefined;
}

export const SortingEditor = (props: SortingEditorProps) => {
  const methods = useForm({
    defaultValues: {
      rootSorting: props.initialSorting || [],
    },
  });

  const onSubmit = methods.handleSubmit((filterContainer) => {
    props.handleClose();

    const defaultSubmitFunction = props.handleSubmit || ((data: any) => console.log(data));

    return defaultSubmitFunction(filterContainer.rootSorting as CompositeSortingDescriptor);
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
            <CompositeSorting formPath={"rootSorting"} availableMembers={props.availableMembers} />
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
              Apply Sorting
            </Button>
          </form>
        </FormProvider>
      </Stack>
    </Popover>
  );
};
