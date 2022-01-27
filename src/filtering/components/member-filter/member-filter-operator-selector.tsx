import React from "react";

import { Select, MenuItem } from "@mui/material";

import { Controller, ControllerRenderProps, FieldValues, useFormContext, useWatch } from "react-hook-form";

import { MemberFilterOperator } from "../../enums/member-filter-operator";
import { MemberType } from "../../../common/member";

export interface FilterOperationSelectorProps {
  parentFormPath: string;
  formPath: string;
}

const initialFilterOperators = [
  {
    value: MemberFilterOperator.IsLessThan,
    displayText: "Is Less Than",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsLessThanOrEqualTo,
    displayText: "Is Less Than Or Equal To",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsEqualTo,
    displayText: "Is Equal To",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsNotEqualTo,
    displayText: "Is Not Equal To",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsGreaterThanOrEqualTo,
    displayText: "Is Greater Than Or Equal To",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsGreaterThan,
    displayText: "Is Greater Than",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.StartsWith,
    displayText: "Starts With",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.EndsWith,
    displayText: "Ends With",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.Contains,
    displayText: "Contains",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsContainedIn,
    displayText: "Is Contained In",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.DoesNotContain,
    displayText: "Does Not Contain",
    additionalInfo: {
      predeterminedValue: undefined,
      modifiableValue: true,
    },
  },
  {
    value: MemberFilterOperator.IsNull,
    displayText: "Is Null",
    additionalInfo: {
      predeterminedValue: "null",
      modifiableValue: false,
    },
  },
  {
    value: MemberFilterOperator.IsNotNull,
    displayText: "Is Not Null",
    additionalInfo: {
      predeterminedValue: "any",
      modifiableValue: false,
    },
  },
  {
    value: MemberFilterOperator.IsEmpty,
    displayText: "Is Empty",
    additionalInfo: {
      predeterminedValue: "empty",
      modifiableValue: false,
    },
  },
  {
    value: MemberFilterOperator.IsNotEmpty,
    displayText: "Is Not Empty",
    additionalInfo: {
      predeterminedValue: "any",
      modifiableValue: false,
    },
  },
  {
    value: MemberFilterOperator.IsNullOrEmpty,
    displayText: "Is Null Or Empty",
    additionalInfo: {
      predeterminedValue: "null or empty",
      modifiableValue: false,
    },
  },
  {
    value: MemberFilterOperator.IsNotNullOrEmpty,
    displayText: "Is Not Null Or Empty",
    additionalInfo: {
      predeterminedValue: "any",
      modifiableValue: false,
    },
  },
];

const memberTypeToFilterOperatorsMapping = {
  [String.name]: [
    initialFilterOperators[2],
    initialFilterOperators[3],
    initialFilterOperators[6],
    initialFilterOperators[7],
    initialFilterOperators[8],
    initialFilterOperators[9],
    initialFilterOperators[10],
    initialFilterOperators[11],
    initialFilterOperators[12],
    initialFilterOperators[13],
    initialFilterOperators[14],
    initialFilterOperators[15],
    initialFilterOperators[16],
  ],
  [Number.name]: [
    initialFilterOperators[0],
    initialFilterOperators[1],
    initialFilterOperators[2],
    initialFilterOperators[3],
    initialFilterOperators[4],
    initialFilterOperators[5],
    initialFilterOperators[11],
    initialFilterOperators[12],
  ],
  [Date.name]: [
    initialFilterOperators[0],
    initialFilterOperators[1],
    initialFilterOperators[2],
    initialFilterOperators[3],
    initialFilterOperators[4],
    initialFilterOperators[5],
    initialFilterOperators[11],
    initialFilterOperators[12],
  ],
  [Boolean.name]: [initialFilterOperators[2], initialFilterOperators[3], initialFilterOperators[11], initialFilterOperators[12]],
};

export const MemberFilterOperatorSelector = (props: FilterOperationSelectorProps) => {
  const [filterOperators, setFilterOperators] = React.useState(initialFilterOperators);

  const { control, setValue } = useFormContext();

  const memberType: MemberType = useWatch({ control, name: `${props.parentFormPath}.member.type` });

  React.useEffect(() => {
    if (Object.keys(memberTypeToFilterOperatorsMapping).includes(memberType.typeName)) {
      setFilterOperators(memberTypeToFilterOperatorsMapping[memberType.typeName]);
    } else {
      setFilterOperators(initialFilterOperators);
    }
  }, [memberType]);

  const handleFilterOperatorSelected = (event: any, field: ControllerRenderProps<FieldValues, string>) => {
    const selectedOperator = filterOperators.find((operator) => operator.value === event.target.value);

    setValue(`${props.parentFormPath}.member.isDisabled`, !selectedOperator?.additionalInfo.modifiableValue);

    setValue(`${props.parentFormPath}.member.predeterminedValue`, selectedOperator?.additionalInfo.predeterminedValue);

    field.onChange(event);
  };

  return (
    <Controller
      name={props.formPath}
      render={({ field }) => (
        <Select
          {...field}
          autoWidth
          variant="standard"
          size="small"
          disableUnderline
          sx={{ width: 1 }}
          onChange={(event) => handleFilterOperatorSelected(event, field)}
        >
          {filterOperators.map((operator) => (
            <MenuItem dense value={operator.value} key={operator.value}>
              {operator.displayText}
            </MenuItem>
          ))}
        </Select>
      )}
    />
  );
};
