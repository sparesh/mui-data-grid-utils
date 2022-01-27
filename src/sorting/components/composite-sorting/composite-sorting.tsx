import React from "react";

import { Stack, IconButton, Typography, Tooltip, Box, Divider, ListItem, List, Paper } from "@mui/material";
import { PlaylistAddOutlined } from "@mui/icons-material";

import { useFieldArray, useFormContext } from "react-hook-form";

import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";

import { Member } from "../../../common/member";
import { CssGrid } from "../../../components/common-ui/css-grid";
import { MemberSorting } from "../member-sorting/member-sorting";
import { NoAppliedSorting } from "../common-ui/no-sorting";
import { MemberSortingDirection } from "../../enums/member-sorting-direction";
import { MemberSortingDescriptor } from "../../sorting-descriptors/member-sorting-descriptor";

class MemberSortingDescriptorFactory {
  constructor(private availableMembers: Member[]) {}

  create(): MemberSortingDescriptor {
    return {
      member: this.availableMembers[0],
      direction: MemberSortingDirection.Ascending,
    };
  }
}

export interface CompositeSortingProps {
  formPath: string;
  availableMembers: Member[];
}

export const CompositeSorting = (props: CompositeSortingProps) => {
  const [memberFactory] = React.useState(new MemberSortingDescriptorFactory(props.availableMembers));

  const { control, getValues, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: props.formPath,
  });

  const handleSortingDelete = (deletedIndex: number) => {
    remove(deletedIndex);
  };

  const handleAddMemberSorting = () => {
    append(memberFactory.create());
  };

  const handleDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const result = Array.from(getValues(props.formPath));
    const [removed] = result.splice(source.index, 1);
    result.splice(destination.index, 0, removed);

    setValue(props.formPath, result);
  };

  return (
    <CssGrid>
      <Stack sx={{ gridColumn: "span 1" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            boxShadow: (theme) => theme.shadows[2],
            borderRadius: (theme) => theme.spacing(0.25),
            paddingY: 0.5,
            zIndex: (theme) => theme.zIndex.appBar,
          }}
        >
          <Stack direction="row">
            <Box sx={{ padding: 1 }} />
            <Typography color="primary" sx={{ fontWeight: (theme) => theme.typography.fontWeightBold }}>
              Composite
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ paddingX: 1 }}>
            <Tooltip title="Add member sorting">
              <IconButton size="small" onClick={handleAddMemberSorting}>
                <PlaylistAddOutlined fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          gridAutoFlow: "column",
          gridAutoRows: "row",
        }}
      >
        {!fields.length ? (
          <Box sx={{ padding: 1 }}>
            <NoAppliedSorting />
          </Box>
        ) : null}
        <List disablePadding>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={props.formPath}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {fields.map((field, i) => (
                    <Draggable draggableId={`${props.formPath}.${i}`} index={i}>
                      {(provided, snapshot) => (
                        <ListItem
                          key={field.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          disablePadding
                          sx={{ display: "block" }}
                        >
                          <Stack
                            sx={{
                              backgroundColor: (theme) => (snapshot.isDragging ? theme.palette.background.paper : undefined),
                              boxShadow: (theme) => (snapshot.isDragging ? undefined : theme.shadows[0]),
                            }}
                          >
                            <MemberSorting
                              formPath={`${props.formPath}.${i}`}
                              availableMembers={props.availableMembers}
                              handleDelete={() => handleSortingDelete(i)}
                            />
                            {fields.length - 1 !== i ? <Divider flexItem /> : null}
                          </Stack>
                        </ListItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Stack>
    </CssGrid>
  );
};
