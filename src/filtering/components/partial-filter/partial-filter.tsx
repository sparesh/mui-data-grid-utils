import { Stack, Tooltip, IconButton, Box, Typography, LinearProgress } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";

import { CompositeFilterDescriptor } from "../../filter-descriptors/composite-filter-descriptor";
import { PartialFilterDescriptor } from "../../filter-descriptors/partial-filter-descriptor";

export interface PartialFilterProps {
  handleDelete: () => void;

  filter: PartialFilterDescriptor<CompositeFilterDescriptor>;
}

export const PartialFilter = (props: PartialFilterProps) => {
  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          paddingY: 0.5,
        }}
      >
        <Stack direction="row">
          <Box>
            <Tooltip title="Delete filter">
              <IconButton size="small" onClick={props.handleDelete}>
                <CloseOutlined fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            color="primary"
            sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}
          >
            Partial
          </Typography>
          {props.filter ? (
            <Tooltip
              title={props.filter.description || ""}
              disableHoverListener={!Boolean(props.filter.description)}
            >
              <Typography sx={{ marginX: 1 }}>{props.filter.name}</Typography>
            </Tooltip>
          ) : undefined}
        </Stack>
        <Stack direction="row" sx={{ paddingX: 1 }}></Stack>
      </Stack>
      {!props.filter ? <LinearProgress /> : undefined}
    </Stack>
  );
};
