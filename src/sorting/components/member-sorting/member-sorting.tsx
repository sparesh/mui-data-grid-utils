import { Divider, IconButton, Stack, Tooltip } from "@mui/material";

import { CloseOutlined, DragIndicatorOutlined } from "@mui/icons-material";

import { Member } from "../../../common/member";
import { CssGrid } from "../../../components/common-ui/css-grid";
import { MemberSelector } from "../../../components/common-ui/member-selector";
import { MemberSortingDirectionSelector } from "./member-sorting-direction-selector";

export interface MemberSortingProps {
  handleDelete: () => void;

  formPath: string;
  availableMembers: Member[];
}

export const MemberSorting = (props: MemberSortingProps) => {
  return (
    <CssGrid
      sx={{
        gridTemplateColumns: "1fr 1px auto",
        gridTemplateRows: "repeat(1, 1fr)",
        gridTemplateAreas: `"member divider direction"`,
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ gridArea: "member" }}>
        <IconButton size="small" sx={{ cursor: "grab" }} disableRipple disableTouchRipple disableFocusRipple>
          <DragIndicatorOutlined fontSize="inherit" />
        </IconButton>
        <Tooltip title="delete sorting">
          <IconButton size="small" onClick={props.handleDelete}>
            <CloseOutlined fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <MemberSelector formPath={`${props.formPath}.member`} availableMembers={props.availableMembers} />
      </Stack>

      <Divider orientation="vertical" sx={{ gridArea: "divider" }} />

      <Stack direction="row" alignItems="center" sx={{ paddingInlineStart: 0.75, gridArea: "direction", width: 1 }}>
        <MemberSortingDirectionSelector formPath={`${props.formPath}.direction`} />
      </Stack>
    </CssGrid>
  );
};
