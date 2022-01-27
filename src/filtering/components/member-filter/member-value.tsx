import React from "react";

import { Box, MenuItem, Select, TextField } from "@mui/material";
import DateAdapter from "@mui/lab/AdapterMoment";

import { Controller, ControllerRenderProps, FieldValues, useFormContext, useWatch } from "react-hook-form";
import { MobileDateTimePicker, LocalizationProvider } from "@mui/lab";
import { MemberType } from "../../../common/member";

interface FilterValueComponentProps {
  multilineValue?: boolean | undefined;
  field?: ControllerRenderProps<FieldValues, string> | undefined;
  disabled?: boolean | undefined;
  predeterminedValue?: any | undefined;
}

type FilterValueComponentType = React.FunctionComponent<FilterValueComponentProps>;

interface GenericInputOptions {
  placeholder?: string | undefined;
  type?: string | undefined;
}

class FilterValueComponentFactory {
  static createGenericInput(options?: GenericInputOptions | ((props: FilterValueComponentProps) => GenericInputOptions) | undefined) {
    return (props: FilterValueComponentProps) => {
      const calculatedOptions = typeof options === "function" ? options(props) : options;

      return (
        <TextField
          fullWidth
          size="small"
          variant="standard"
          placeholder={calculatedOptions?.placeholder || "Filter..."}
          disabled={props.disabled}
          multiline={props?.multilineValue}
          type={calculatedOptions?.type}
          InputProps={{ disableUnderline: true }}
          {...props.field}
        />
      );
    };
  }
}

const memberTypeToFilterValueComponentMapping: { [key: string]: FilterValueComponentType } = {
  [String.name]: FilterValueComponentFactory.createGenericInput(),
  [Number.name]: FilterValueComponentFactory.createGenericInput((props) => ({
    type: props.predeterminedValue ? undefined : "number",
  })),
  [Date.name]: (props: FilterValueComponentProps) => {
    const [GenericInput] = React.useState(() => FilterValueComponentFactory.createGenericInput());

    return (
      <>
        {props.predeterminedValue ? (
          <GenericInput {...props} />
        ) : (
          <Box
            sx={{
              width: 1,
              "& .MuiFormControl-root": {
                width: 1,
                cursor: "pointer",
              },
            }}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              <MobileDateTimePicker
                disabled={props.disabled}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    variant="standard"
                    inputProps={{
                      ...props.inputProps,
                      sx: { cursor: "pointer" },
                    }}
                  />
                )}
                InputProps={{
                  disableUnderline: true,
                  size: "small",
                }}
                {...(props.field as any)}
              />
            </LocalizationProvider>
          </Box>
        )}
      </>
    );
  },
  [Boolean.name]: (props: FilterValueComponentProps) => {
    const [GenericInput] = React.useState(() => FilterValueComponentFactory.createGenericInput());

    return (
      <>
        {props.predeterminedValue ? (
          <GenericInput {...props} />
        ) : (
          <Select autoWidth variant="standard" size="small" disableUnderline disabled={props.disabled} sx={{ width: 1 }} {...props.field}>
            <MenuItem dense value={"true"}>
              True
            </MenuItem>
            <MenuItem dense value={"false"}>
              False
            </MenuItem>
          </Select>
        )}
      </>
    );
  },
  defaultInput: FilterValueComponentFactory.createGenericInput(),
};

export interface MemberFilterValueProps {
  multilineValue?: boolean | undefined;
  parentFormPath: string;
  formPath: string;
}

export const MemberFilterValue = (props: MemberFilterValueProps) => {
  const [FilterValueComponent, setFilterValueComponent] = React.useState(() => memberTypeToFilterValueComponentMapping.defaultInput);

  const { control, setValue } = useFormContext();

  const memberType: MemberType = useWatch({ control, name: `${props.parentFormPath}.member.type` });
  const isDisabled: boolean = useWatch({
    control,
    name: `${props.parentFormPath}.member.isDisabled`,
    defaultValue: false,
  });
  const predeterminedValue: any = useWatch({
    control,
    name: `${props.parentFormPath}.member.predeterminedValue`,
  });

  React.useEffect(() => {
    if (Object.keys(memberTypeToFilterValueComponentMapping).includes(memberType.typeName)) {
      setFilterValueComponent(() => memberTypeToFilterValueComponentMapping[memberType.typeName]);
    } else {
      setFilterValueComponent(() => memberTypeToFilterValueComponentMapping.defaultInput);
    }
  }, [memberType]);

  React.useEffect(() => {
    if (predeterminedValue !== undefined) {
      setValue(props.formPath, predeterminedValue);
    }
  }, [predeterminedValue, memberType]);

  return (
    <Controller
      name={props.formPath}
      render={({ field }) => (
        <FilterValueComponent field={field} multilineValue={props.multilineValue} disabled={Boolean(isDisabled)} predeterminedValue={predeterminedValue} />
      )}
    />
  );
};
