import { IconLookup, IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Edit } from "@mui/icons-material";
import { IconButton, InputAdornment, Popover, TextField } from "@mui/material";
import React, { Fragment, useMemo, useState } from "react";
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
  // TODO: load all icon

  const iconsFiltered = useMemo(
    () =>
      props.icons
        ?.slice(0, 20)
        .filter((icon) => icon.iconName.includes(searchText.toLowerCase())),
    [searchText, props.icons]
  );

  return (
    <div className={props.className ?? undefined}>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field }) => (
          <Fragment>
            <TextField
              fullWidth
              placeholder="Choisir une icône"
              variant="outlined"
              {...field}
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
                    onChange={(event) => setSearchText(event.target.value)}
                  />
                </div>
                <div className="icons-container">
                  {iconsFiltered?.map((icon) => (
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
              </div>
            </Popover>
          </Fragment>
        )}
      />
    </div>
  );
};

export default FaIconPicker;
