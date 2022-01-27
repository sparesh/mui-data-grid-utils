import React from "react";

import { IconButton, Divider, Stack, Tooltip } from "@mui/material";

import CloseIcon from "@mui/icons-material/CloseOutlined";

import { MemberFilterOperatorSelector } from "./member-filter-operator-selector";
import { CssGrid } from "../../../components/common-ui/css-grid";
import { MemberSelector } from "../../../components/common-ui/member-selector";
import { MemberFilterValue } from "./member-value";
import { Member } from "../../../common/member";

export interface MemberFilterProps {
  handleDelete: () => void;

  multilineValue?: boolean | undefined;
  formPath: string;
  availableMembers: Member[];
}

export const MemberFilter = (props: MemberFilterProps) => {
  return (
    <CssGrid
      sx={{
        gridTemplateColumns: "1fr auto 1fr auto 1fr",
        gridTemplateRows: "repeat(1, 1fr)",
        gridTemplateAreas: `"member divider1 operator divider2 value"`,
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ gridArea: "member" }}>
        <Tooltip title="Delete filter">
          <IconButton size="small" onClick={props.handleDelete}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
        <MemberSelector formPath={`${props.formPath}.member`} availableMembers={props.availableMembers} />
      </Stack>

      <Divider orientation="vertical" sx={{ gridArea: "divider1" }} />

      <Stack direction="row" alignItems="center" sx={{ paddingInlineStart: 0.75, gridArea: "operator" }}>
        <MemberFilterOperatorSelector parentFormPath={props.formPath} formPath={`${props.formPath}.operator`} />
      </Stack>

      <Divider orientation="vertical" sx={{ gridArea: "divider2" }} />

      <Stack direction="row" alignItems="center" sx={{ gridArea: "value", paddingInlineStart: 0.75 }}>
        <MemberFilterValue formPath={`${props.formPath}.value`} parentFormPath={props.formPath} />
      </Stack>
    </CssGrid>
  );
};
