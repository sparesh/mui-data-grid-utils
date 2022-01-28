import { CloseOutlined } from "@mui/icons-material";
import { Stack, Tooltip, IconButton, Divider, Box, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { CssGrid } from "../../../components/common-ui/css-grid";
import { CompositeFilterDescriptor } from "../../filter-descriptors/composite-filter-descriptor";
import { PartialFilterDescriptor } from "../../filter-descriptors/partial-filter-descriptor";

export interface PartialFilterProps {
  handleDelete: () => void;

  formGroupId: string;
  formPath: string;
}

export const PartialFilter = (props: PartialFilterProps) => {
  const { getValues } = useFormContext();

  const filter: PartialFilterDescriptor<CompositeFilterDescriptor> = getValues(props.formPath);

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
          <Tooltip
            title={filter.description}
            disableHoverListener={!Boolean(filter.description)}
          >
            <Typography sx={{ marginX: 1 }}>{filter.name}</Typography>
          </Tooltip>
        </Stack>
        <Stack direction="row" sx={{ paddingX: 1 }}></Stack>
      </Stack>
    </Stack>
  );
};
