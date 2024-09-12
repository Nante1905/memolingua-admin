import { Chip } from "@mui/material";
import { FC } from "react";
import {
  ENTITY_CREATED,
  ENTITY_DELETED,
  ENTITY_UPDATED,
} from "../../constants/entity-state";

interface EntityChipStateComponentProps {
  entityState: number;
}

const EntityChipStateComponent: FC<EntityChipStateComponentProps> = (props) => {
  if (props.entityState === ENTITY_CREATED) {
    return <Chip color="info" label="Created" />;
  } else if (props.entityState === ENTITY_UPDATED)
    return <Chip color="warning" label="Updated" />;
  else if (props.entityState === ENTITY_DELETED)
    return <Chip color="error" label="Deleted" />;
};

export default EntityChipStateComponent;
