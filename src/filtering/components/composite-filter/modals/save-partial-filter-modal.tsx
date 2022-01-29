import React from "react";

import { DescriptionOutlined, TitleOutlined } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Stack,
  InputAdornment,
  DialogContentText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useCompositeFilterContext } from "../../../context/composite-filter-context";
import { CompositeFilterDescriptor } from "../../../filter-descriptors/composite-filter-descriptor";
import { PartialFilterDescriptor } from "../../../filter-descriptors/partial-filter-descriptor";

const saveFilterFormSchema = yup
  .object()
  .shape({
    name: yup.string().required().min(1),
    description: yup.string().optional(),
  })
  .required();

export interface SavePartialFilterModalProps {
  handleClose: () => void;
  handleFoldOriginalFilter: (filterId: string) => void;

  formGroupId: string;
  parentFormPath: string;
  formPath: string;
  open: boolean;
}

export const SavePartialFilterModal = (props: SavePartialFilterModalProps) => {
  const { getValues } = useFormContext();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartialFilterDescriptor<CompositeFilterDescriptor>>({
    resolver: yupResolver(saveFilterFormSchema),
  });
  const compositeFilterContext = useCompositeFilterContext();

  const [foldOriginalFilter, setFoldOriginalFilter] = React.useState(true);

  const handleCancel = () => {
    reset();
    props.handleClose();
  };

  const onSubmit = (partialFilter: PartialFilterDescriptor<CompositeFilterDescriptor>) => {
    partialFilter.filter = getValues(props.formPath);
    partialFilter.filterGroupId = props.formGroupId;

    const filterId = compositeFilterContext.saveFilter(partialFilter);

    reset();
    setFoldOriginalFilter(true);
    props.handleClose();

    if (foldOriginalFilter) {
      props.handleFoldOriginalFilter(filterId);
    }
  };

  return (
    <Dialog open={props.open} keepMounted={false} onClose={props.handleClose}>
      <form>
        <DialogTitle>Save Filter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter some basic information about the filter to refer for it later on
          </DialogContentText>
          <Stack>
            <TextField
              {...register("name")}
              required
              fullWidth
              size="small"
              margin="dense"
              label="Filter name"
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              disabled={isSubmitting}
              sx={{ marginY: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleOutlined />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              {...register("description")}
              fullWidth
              multiline
              size="small"
              margin="dense"
              label="Filter description"
              error={Boolean(errors.description)}
              helperText={errors.description?.message}
              disabled={isSubmitting}
              minRows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionOutlined />
                  </InputAdornment>
                ),
              }}
              sx={{ marginY: 1 }}
            />
            <FormControlLabel
              label="Fold original filter"
              control={
                <Checkbox
                  checked={foldOriginalFilter}
                  onChange={() => setFoldOriginalFilter(!foldOriginalFilter)}
                />
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
