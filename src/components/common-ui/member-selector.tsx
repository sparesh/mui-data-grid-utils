import React from "react";

import { Controller, ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";

import { Autocomplete, Box, Button, Popover, Typography, autocompleteClasses, styled, Divider, useTheme, InputAdornment, TextField } from "@mui/material";
import { ArrowDropDownOutlined, ArrowDropUpOutlined, SearchOutlined } from "@mui/icons-material";
import { Member } from "../../common/member";

const StyledAutocompletePopper = styled("div")(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: "none",
    margin: 0,
    color: "inherit",
    fontSize: 13,
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    [`& .${autocompleteClasses.option}`]: {
      alignItems: "flex-start",
      padding: theme.spacing(0.75, 1),
      borderBottom: `1px solid  ${theme.palette.divider}`,
      '&[aria-selected="true"]': {
        backgroundColor: "transparent",
      },
      '&[data-focus="true"], &[data-focus="true"][aria-selected="true"]': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: "relative",
  },
}));

interface PopperComponentProps {
  anchorEl?: any;
  disablePortal?: boolean;
  open: boolean;
}

const PopperComponent = (props: PopperComponentProps) => {
  const { disablePortal, anchorEl, open, ...other } = props;

  return <StyledAutocompletePopper {...other} />;
};

interface AutoCompleteMemberSelector {
  onChange: (memberName: string) => void;

  field: ControllerRenderProps<FieldValues, `${string}.name`>;
  availableMembers: Member[];
}

const AutoCompleteMemberSelector = (props: AutoCompleteMemberSelector) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();

  const member = props.availableMembers.find((member) => member.name === props.field.value);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value?: Member | null) => {
    if (value) {
      props.field.onChange(value.name);
      props.onChange(value.name);
    }

    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ width: 1, height: 1 }}>
      <Button
        onClick={handleClick}
        sx={{
          padding: 0,
          color: "inherit",
          width: 1,
          height: 1,
          justifyContent: "space-between",
          textTransform: "none",
          borderRadius: 0,
        }}
        disableElevation
        disableRipple
        disableTouchRipple
        disableFocusRipple
      >
        <Typography>{props.field.value}</Typography>
        {open ? <ArrowDropUpOutlined /> : <ArrowDropDownOutlined />}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onBackdropClick={() => handleClose()}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Autocomplete
          open
          filterSelectedOptions
          PopperComponent={PopperComponent}
          noOptionsText="No members"
          onBlur={props.field.onBlur}
          options={props.availableMembers}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue, reason) => {
            if ((event.type === "keydown" && (event as React.KeyboardEvent).key === "Backspace" && reason === "removeOption") || reason === "clear") {
              return;
            }

            handleClose(newValue);
          }}
          renderOption={(props, option) => (
            <li
              {...props}
              key={`${option.name}:${option.type.typeName}`}
              style={{
                backgroundColor: option === member ? theme.palette.action.selected : undefined,
              }}
            >
              <Typography>{option.name}</Typography>
            </li>
          )}
          renderInput={(params) => (
            <>
              <TextField
                variant="outlined"
                size="small"
                margin="dense"
                sx={{
                  paddingX: 1,
                  marginY: 1,
                  width: 1,
                }}
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                autoFocus
                placeholder="Search members..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
              />
              <Divider />
            </>
          )}
        />
      </Popover>
    </Box>
  );
};

export interface MemberSelectorProps {
  formPath: string;
  availableMembers: Member[];
}

export const MemberSelector = (props: MemberSelectorProps) => {
  const { setValue } = useFormContext();

  const handleMemberNameSelected = (memberName: string) => {
    const selectedMember = props.availableMembers.find((member) => member.name === memberName);

    setValue(`${props.formPath}.type`, selectedMember?.type);
  };

  return (
    <Controller
      name={`${props.formPath}.name`}
      render={({ field }) => <AutoCompleteMemberSelector field={field} availableMembers={props.availableMembers} onChange={handleMemberNameSelected} />}
    />
  );
};
