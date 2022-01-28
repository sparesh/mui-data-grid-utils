import React from "react";

import { Button } from "@mui/material";

import { CompositeFilterOperator } from "./filtering/enums/composite-filter-operator";
import { CompositeFilterDescriptor } from "./filtering/filter-descriptors/composite-filter-descriptor";
import { MemberFilterOperator } from "./filtering/enums/member-filter-operator";
import { MemberFilterDescriptor } from "./filtering/filter-descriptors/member-filter-descriptor";
import { FilterEditor } from "./filtering/filter-editor";
import { Paper, Stack, Typography } from "@mui/material";

import moment from "moment";

import { SortingEditor } from "./sorting/sorting-editor";
import { CompositeSortingDescriptor } from "./sorting/sorting-descriptors/composite-sorting-descriptor";
import { MemberSortingDirection } from "./sorting/enums/member-sorting-direction";
import { Member } from "./common/member";

const availableMembers: Member[] = [
  {
    name: "Username",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Role",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Start time",
    type: {
      typeName: Date.name,
      defaultValue: undefined,
    },
  },
  {
    name: "End time",
    type: {
      typeName: Date.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Is active",
    type: {
      typeName: Boolean.name,
      defaultValue: undefined,
    },
  },
  {
    name: "User type",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Last login time",
    type: {
      typeName: Date.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Creation time",
    type: {
      typeName: Date.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Last modification time",
    type: {
      typeName: Date.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Creator user",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Modifier user",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Login policy",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Failed logins",
    type: {
      typeName: Number.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Success logins",
    type: {
      typeName: Number.name,
      defaultValue: undefined,
    },
  },
  {
    name: "Status",
    type: {
      typeName: String.name,
      defaultValue: undefined,
    },
  },
];

const FilteringApp = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [rootFilter] = React.useState<CompositeFilterDescriptor>({
    operator: CompositeFilterOperator.And,
    filters: [
      {
        member: availableMembers[0],
        operator: MemberFilterOperator.Contains,
        value: "admin",
      } as MemberFilterDescriptor,
      {
        member: availableMembers[2],
        operator: MemberFilterOperator.IsGreaterThanOrEqualTo,
        value: moment(new Date("2020-12-25 14:00")),
      } as MemberFilterDescriptor,
      {
        operator: CompositeFilterOperator.Or,
        filters: [
          {
            member: availableMembers[4],
            operator: MemberFilterOperator.IsEqualTo,
            value: true,
          } as MemberFilterDescriptor,
          {
            member: availableMembers[5],
            operator: MemberFilterOperator.IsEqualTo,
            value: "admin",
          } as MemberFilterDescriptor,
        ],
      } as CompositeFilterDescriptor,
    ],
  });

  const [json, setJson] = React.useState<any>(rootFilter);

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        Open Filter
      </Button>

      <FilterEditor
        anchorEl={anchorEl}
        formGroupId={"users-filter-group"}
        initialFilter={rootFilter}
        availableMembers={availableMembers}
        handleClose={handleClose}
        handleSubmit={setJson}
      />

      <Paper sx={{ marginY: 2, padding: 1 }}>
        <Paper
          sx={{
            paddingX: 1,
            boxShadow: (theme) => theme.shadows[5],
          }}
        >
          <Typography variant="h5">Filtering State</Typography>
        </Paper>
        <pre style={{ maxWidth: "50vw", overflow: "clip" }}>
          {JSON.stringify(json, null, 2)}
        </pre>
      </Paper>
    </div>
  );
};

const SortingApp = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [rootSorting] = React.useState<CompositeSortingDescriptor>([
    {
      member: availableMembers[7],
      direction: MemberSortingDirection.Descending,
    },
  ]);

  const [json, setJson] = React.useState<any>(rootSorting);

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        Open Sorting
      </Button>

      <SortingEditor
        anchorEl={anchorEl}
        initialSorting={rootSorting}
        availableMembers={availableMembers}
        handleClose={handleClose}
        handleSubmit={setJson}
      />

      <Paper sx={{ marginY: 2, padding: 1 }}>
        <Paper
          sx={{
            paddingX: 1,
            boxShadow: (theme) => theme.shadows[5],
          }}
        >
          <Typography variant="h5">Sorting State</Typography>
        </Paper>
        <pre style={{ maxWidth: "50vw", overflow: "clip" }}>
          {JSON.stringify(json, null, 2)}
        </pre>
      </Paper>
    </div>
  );
};

const DataGridApp = () => {
  return <></>;
};

export default function App() {
  return (
    <Stack>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        sx={{
          width: 1,
          padding: 2,
        }}
      >
        <FilteringApp />
        <SortingApp />
      </Stack>

      <DataGridApp />
    </Stack>
  );
}
