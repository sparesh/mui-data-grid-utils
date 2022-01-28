import React from "react";

import {
  IconButton,
  Typography,
  Divider,
  Stack,
  Box,
  Tooltip,
  ListItem,
  List,
  SvgIcon,
} from "@mui/material";

import { CloseOutlined, DownloadOutlined, UploadOutlined } from "@mui/icons-material";

import { mdiFilterPlusOutline } from "@mdi/js";
import { mdiTableColumnPlusAfter } from "@mdi/js";

import { useFormContext, useFieldArray } from "react-hook-form";

import { FilterDescriptor } from "../../filter-descriptors/filter-descriptor";
import { CompositeFilterDescriptor } from "../../filter-descriptors/composite-filter-descriptor";
import { MemberFilterDescriptor } from "../../filter-descriptors/member-filter-descriptor";
import { CompositeFilterOperator } from "../../enums/composite-filter-operator";
import { MemberFilterOperator } from "../../enums/member-filter-operator";
import { CompositeFilterOperatorSelector } from "./composite-filter-operator-selector";
import { MemberFilter } from "../member-filter/member-filter";
import { CssGrid } from "../../../components/common-ui/css-grid";
import { Member } from "../../../common/member";
import { NoAppliedFilter } from "../common-ui/no-filter";
import { SavePartialFilterModal } from "./modals/save-partial-filter-modal";
import { useCompositeFilterContext } from "../../context/composite-filter-context";
import { PartialFilter } from "../partial-filter/partial-filter";
import { LoadPartialFilterModal } from "./modals/load-partial-filter-modal";
import { PartialFilterDescriptor } from "../../filter-descriptors/partial-filter-descriptor";

class MemberFilterDescriptorFactory {
  constructor(private availableMembers: Member[]) {}

  create(): MemberFilterDescriptor {
    return {
      member: this.availableMembers[0],
      operator: MemberFilterOperator.Contains,
      value: "",
    };
  }
}

class CompositeFilterDescriptorFactory {
  constructor(private memberFactory: MemberFilterDescriptorFactory) {}

  create(): CompositeFilterDescriptor {
    return {
      operator: CompositeFilterOperator.And,
      filters: [this.memberFactory.create()],
    };
  }
}

export interface CompositeFilterProps {
  handleDelete?: () => void;
  handleFold?: (id: string) => void;

  indent?: number;
  formGroupId: string;
  formPath: string;
  availableMembers: Member[];
}

export const CompositeFilter = (props: CompositeFilterProps) => {
  const [memberFactory] = React.useState(
    new MemberFilterDescriptorFactory(props.availableMembers)
  );
  const [compositeFactory] = React.useState(
    new CompositeFilterDescriptorFactory(memberFactory)
  );
  const [saveFilterOpen, setSaveFilterOpen] = React.useState(false);
  const [loadFilterOpen, setLoadFilterOpen] = React.useState(false);

  const compositeFilterContext = useCompositeFilterContext();
  const { control, getValues } = useFormContext();
  const { fields, append, remove, insert, update } = useFieldArray({
    control,
    name: `${props.formPath}.filters`,
  });

  const filters: FilterDescriptor[] = getValues(`${props.formPath}.filters`);
  const indent = props.indent || 0;

  const handleFilterDelete = (deletedIndex: number) => {
    remove(deletedIndex);
  };

  const handleAddMemberFilter = () => {
    const compositeFilters = filters.filter((filter) =>
      Object.keys(filter).includes("filters")
    );
    const memberFilters = filters.filter((filter) => !compositeFilters.includes(filter));

    const newMemberFilter = memberFactory.create();

    if (compositeFilters.length) {
      insert(memberFilters.length, newMemberFilter);
    } else {
      append(newMemberFilter);
    }
  };

  const handleAddCompositeFilter = () => {
    append(compositeFactory.create());
  };

  const handleAddPartialFilter = (
    filter: PartialFilterDescriptor<CompositeFilterDescriptor>
  ) => {
    append(filter);
  };

  const handleOpenSaveFilter = () => {
    setSaveFilterOpen(true);
  };

  const handleCloseSaveFilter = () => {
    setSaveFilterOpen(false);
  };

  const handleOpenLoadFilter = () => {
    setLoadFilterOpen(true);
  };

  const handleCloseLoadFilter = () => {
    setLoadFilterOpen(false);
  };

  const handleFoldSelf = (id: string) => {
    props.handleFold?.call(undefined, id);
  };

  const handleFoldChild = (foldedIndex: number, id: string) => {
    const filter = compositeFilterContext.loadFilter(props.formGroupId, id);

    update(foldedIndex, filter);
  };

  return (
    <>
      <CssGrid sx={{ gridTemplateColumns: "auto auto" }}>
        <Stack sx={{ gridColumn: "span 2" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              boxShadow: (theme) => theme.shadows[2],
              borderRadius: (theme) => theme.spacing(0.25),
              paddingY: 0.5,
            }}
          >
            <Stack direction="row">
              {indent > 0 ? (
                <Box>
                  <Tooltip title="Delete filter">
                    <IconButton size="small" onClick={props.handleDelete}>
                      <CloseOutlined fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ padding: 1 }} />
              )}
              <Typography
                color="primary"
                sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
              >
                Composite
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ paddingX: 1 }}>
              <Tooltip title="Load composite filter" onClick={handleOpenLoadFilter}>
                <IconButton size="small">
                  <UploadOutlined fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save composite filter">
                <IconButton size="small" onClick={handleOpenSaveFilter}>
                  <DownloadOutlined fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add member filter">
                <IconButton size="small" onClick={handleAddMemberFilter}>
                  <SvgIcon fontSize="inherit">
                    <path d={mdiTableColumnPlusAfter} />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Add composite filter">
                <IconButton size="small" onClick={handleAddCompositeFilter}>
                  <SvgIcon fontSize="inherit">
                    <path d={mdiFilterPlusOutline} />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ gridAutoFlow: "column" }}>
          <Box sx={{ padding: 1 }} />
          <CompositeFilterOperatorSelector formPath={`${props.formPath}.operator`} />
          <Divider orientation="vertical" flexItem />
        </Stack>

        <Stack
          sx={{
            gridAutoFlow: "column",
            gridAutoRows: "row",
          }}
        >
          {!filters.length &&
          filters.every((filter) => Object.keys(filter).includes("filters")) ? (
            <Box sx={{ padding: 1 }}>
              <NoAppliedFilter />
            </Box>
          ) : null}
          {fields.map((field, i) => {
            if (i >= filters.length) {
              return undefined;
            }

            if (Object.keys(filters[i]).includes("filters")) {
              return (
                <ListItem key={field.id} disablePadding sx={{ display: "block" }}>
                  <List disablePadding>
                    <CompositeFilter
                      indent={indent + 1}
                      formGroupId={props.formGroupId}
                      formPath={`${props.formPath}.filters.${i}`}
                      availableMembers={props.availableMembers}
                      handleDelete={() => handleFilterDelete(i)}
                      handleFold={(id) => handleFoldChild(i, id)}
                    />
                  </List>
                </ListItem>
              );
            } else if (Object.keys(filters[i]).includes("name")) {
              return (
                <ListItem key={field.id} disablePadding sx={{ display: "block" }}>
                  <PartialFilter
                    formGroupId={props.formGroupId}
                    formPath={`${props.formPath}.filters.${i}`}
                    handleDelete={() => handleFilterDelete(i)}
                  />
                  {filters.length - 1 !== i ? <Divider flexItem /> : null}
                </ListItem>
              );
            } else {
              return (
                <ListItem key={field.id} disablePadding sx={{ display: "block" }}>
                  <MemberFilter
                    formPath={`${props.formPath}.filters.${i}`}
                    handleDelete={() => handleFilterDelete(i)}
                    availableMembers={props.availableMembers}
                  />
                  {filters.length - 1 !== i ? <Divider flexItem /> : null}
                </ListItem>
              );
            }
          })}
        </Stack>
      </CssGrid>
      <SavePartialFilterModal
        formPath={props.formPath}
        formGroupId={props.formGroupId}
        open={saveFilterOpen}
        handleClose={handleCloseSaveFilter}
        handleFoldOriginalFilter={handleFoldSelf}
      />
      <LoadPartialFilterModal
        formGroupId={props.formGroupId}
        open={loadFilterOpen}
        handleClose={handleCloseLoadFilter}
        handleLoaded={handleAddPartialFilter}
      />
    </>
  );
};
