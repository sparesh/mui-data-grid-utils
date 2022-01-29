import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Stack,
  DialogContentText,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCompositeFilterContext } from "../../../context/composite-filter-context";
import { CompositeFilterDescriptor } from "../../../filter-descriptors/composite-filter-descriptor";
import { PartialFilterDescriptor } from "../../../filter-descriptors/partial-filter-descriptor";

const loadFilterFormSchema = yup
  .object()
  .shape({
    selected: yup.number().required().min(0),
  })
  .required();

interface LoadPartialFilterForm {
  selected: number;
}

export interface LoadPartialFilterModalProps {
  handleClose: () => void;
  handleLoaded: (filter: PartialFilterDescriptor<CompositeFilterDescriptor>) => void;

  formGroupId: string;
  open: boolean;
}

export const LoadPartialFilterModal = (props: LoadPartialFilterModalProps) => {
  const compositeFilterContext = useCompositeFilterContext();
  const [filterGroup, setFilterGroup] = React.useState<
    PartialFilterDescriptor<CompositeFilterDescriptor>[]
  >([]);

  React.useEffect(() => {
    if (props.open) {
      const newFilterGroup = compositeFilterContext.loadFilterGroup(props.formGroupId) || [];

      setFilterGroup(newFilterGroup as PartialFilterDescriptor<CompositeFilterDescriptor>[]);
    }
  }, [props.open]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoadPartialFilterForm>({
    resolver: yupResolver(loadFilterFormSchema),
  });

  const onSubmit = (loadPartialFilter: LoadPartialFilterForm) => {
    props.handleLoaded(filterGroup[loadPartialFilter.selected]);

    reset();
    props.handleClose();
  };

  return (
    <>
      <Dialog open={props.open} keepMounted={false} onClose={props.handleClose}>
        <form>
          <DialogTitle>Load Filter</DialogTitle>
          <DialogContent>
            {filterGroup.length ? (
              <DialogContentText>Select the filter you want to load</DialogContentText>
            ) : undefined}
            {filterGroup.length ? (
              <Controller
                name="selected"
                control={control}
                render={({ field }) => {
                  return (
                    <Stack>
                      <List>
                        {filterGroup.map((filter, i) => {
                          return (
                            <ListItem key={i} disablePadding disabled={isSubmitting}>
                              <ListItemButton onClick={() => field.onChange(i)} dense>
                                <ListItemIcon>
                                  <Checkbox
                                    edge="start"
                                    checked={field.value === i}
                                    tabIndex={-1}
                                    disableRipple
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={filter.name}
                                  secondary={filter.description}
                                  secondaryTypographyProps={{
                                    sx: {
                                      display: "-webkit-box",
                                      overflow: "hidden",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: 3,
                                    },
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                      {errors.selected ? (
                        <Typography sx={{ color: (theme) => theme.palette.error.main }}>
                          {errors.selected.message}
                        </Typography>
                      ) : undefined}
                    </Stack>
                  );
                }}
              />
            ) : (
              <Typography>There are no saved filters!</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
