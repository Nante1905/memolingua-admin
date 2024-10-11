import { IconLookup, IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Edit } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
} from "@mui/material";
import React, { Fragment, useCallback, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { FormInputProps } from "../../../types/FormInputProps";
import "./FaIconPicker.scss";

interface FaIconPickerProps extends FormInputProps {
  onChange: (value: string) => void;
  icons: IconLookup[];
  className?: string;
  defaultValue?: string;
}

const FaIconPicker: React.FC<FaIconPickerProps> = (props) => {
  const [searchText, setSearchText] = useDebounceValue("", 500);
  const [popUpAnchor, setPopUpAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [iconCount, setIconCount] = useState(50);
  // TODO: load all icon

  const iconsFiltered = useMemo(
    () =>
      props.icons
        // ?.slice(0, 200)
        .filter((icon) => icon.iconName.includes(searchText.toLowerCase())),
    [searchText, props.icons]
  );

  const loadMoreIcon = useCallback(
    () => setIconCount(iconCount + 50),
    [iconCount]
  );

  return (
    <div className={props.className ?? ""}>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <Fragment>
            <TextField
              fullWidth
              placeholder="Choisir une icône"
              variant="outlined"
              defaultValue={undefined}
              {...field}
              value={field.value ?? ""}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(event) => setPopUpAnchor(event.currentTarget)}
                    >
                      {field.value ? (
                        <FontAwesomeIcon
                          icon={["fas", field.value as IconName]}
                        />
                      ) : (
                        <Edit />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Popover
              className="icon-picker"
              id={popUpAnchor ? "icon-picker-popup" : undefined}
              open={!!popUpAnchor}
              anchorEl={popUpAnchor}
              onClose={() => setPopUpAnchor(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <div className="icon-picker-container">
                <div className="header">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Rechercher"
                    variant="standard"
                    defaultValue={""}
                    // value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                </div>
                <div className="icons-container">
                  {iconsFiltered?.slice(0, iconCount).map((icon) => (
                    <IconButton
                      key={icon.iconName}
                      className={`icon-btn ${
                        icon.iconName === field.value ? "selected" : ""
                      }`}
                      onClick={() => field.onChange(icon.iconName)}
                    >
                      <FontAwesomeIcon icon={icon} />
                    </IconButton>
                  ))}
                </div>
                <div className="footer">
                  <Button
                    fullWidth
                    onClick={loadMoreIcon}
                    disabled={iconCount > iconsFiltered?.length}
                  >
                    Voir plus
                  </Button>
                </div>
              </div>
            </Popover>
          </Fragment>
        )}
      />
    </div>
  );
};

export default FaIconPicker;
