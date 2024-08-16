/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteForever } from "@mui/icons-material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  LinearProgress,
  List,
  ListItem,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import { uploadFile } from "../../../../shared/helpers/fileupload.helper";
import { HiddenInput } from "../../../../shared/styles/theme";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { AddCardSchema } from "../../helper/package-form.helper";
import { addCardsToPackage } from "../../services/package.service";
import {
  AddCardFormState,
  initialAddCardFormState,
} from "../../state/add-card-form.state";
import { getCardsMedia } from "../../store/package.selector";
import {
  addEmptyCardMedia,
  deleteCardMediaAt,
  resetCardMedias,
  setCardMediaAt,
} from "../../store/package.slice";
import { CardMedia } from "../../types/CardMedia";
import "./add-card-form.component.scss";

interface AddCardProps {
  idPackage: string;
}

const AddCardForm: React.FC<AddCardProps> = (props) => {
  const [state, setState] = useState<AddCardFormState>(initialAddCardFormState);
  const dispatch = useDispatch();
  const cardMedias = useSelector(getCardsMedia);

  const form = useForm({
    resolver: zodResolver(AddCardSchema),
  });
  const cardFields = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    type: "IMG" | "AUD" | "VID",
    index: number
  ) => {
    if (event.target.files) {
      const data = event.target.files[0];

      const { preview, file } = await uploadFile(data);
      if (type == "IMG") {
        dispatch(
          setCardMediaAt({ index, media: { img: { ...file, preview } } })
        );
      } else if (type == "VID") {
        dispatch(
          setCardMediaAt({ index, media: { video: { ...file, preview } } })
        );
      } else if (type == "AUD") {
        dispatch(
          setCardMediaAt({ index, media: { audio: { ...file, preview } } })
        );
      } else {
        throw new Error("Invalid Media type");
      }
    }
  };

  const addCardMutation = useMutation({
    mutationKey: ["addCard"],
    mutationFn: async (data: {
      idPackage: string;
      cards: any;
      medias: CardMedia[];
    }) => {
      return addCardsToPackage(data.idPackage, data.cards, data.medias);
    },
    onSuccess: () => {
      enqueueSnackbar("Carte(s) ajoutée(s)", { variant: "success" });
      form.reset({ keepDefaultValues: false });
      dispatch(resetCardMedias());
      setState((state) => ({
        ...state,
        error: undefined,
      }));
    },
    onError: (err) => {
      const apiError = err as AxiosError;
      console.log(apiError);

      setState((state) => ({
        ...state,
        error: (apiError.response?.data as ApiResponse).error,
      }));
    },
  });

  const submitForm = (data: any) => {
    console.log(data);

    addCardMutation.mutate({
      idPackage: props.idPackage,
      cards: data.cards,
      medias: cardMedias,
    });
  };

  const appendCardField = useCallback(() => {
    cardFields.append({
      recto: "",
      verso: "",
      img: "",
      video: "",
      audio: "",
    });
    dispatch(addEmptyCardMedia());
  }, [cardFields, dispatch]);

  const deleteCardField = useCallback(
    (index: number) => {
      cardFields.remove(index);
      dispatch(deleteCardMediaAt(index));
    },
    [cardFields, dispatch]
  );

  //   first cardField
  useEffect(() => {
    appendCardField();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="add-card-form">
      {state.error && (
        <div className="error-wrapper">
          <List>
            {state.error.map((e) => (
              <ListItem key={`error_${e.numero}`} className="error-item">
                <p>Carte n°{e.numero}</p>
                <List>
                  {e.errors.map((msg, index) => (
                    <ListItem key={`error_${e.numero}_msg_${index}`}>
                      {msg}
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        </div>
      )}
      <div className="add-card-info">
        <p>
          <small>Taille maximale image: 2 Mo</small>
        </p>
        <p>
          <small>Taille maximale vidéo: 4 Mo</small>
        </p>
        <p>
          <small>Taille maximale audio: 2 Mo</small>
        </p>
      </div>
      <form
        className={`form ${addCardMutation.isPending && "loading"}`}
        onSubmit={form.handleSubmit(submitForm)}
      >
        {cardFields.fields.map((cardField, index) => (
          <div className="form-input" key={cardField.id}>
            <div className="card-input">
              <FormControl>
                <Controller
                  control={form.control}
                  name={`cards.${index}.recto`}
                  render={({ field, fieldState }) => (
                    <>
                      <RichText
                        label="Recto"
                        {...field}
                        onContentChange={(content: string) =>
                          field.onChange(content)
                        }
                        className={fieldState.error ? "error" : ""}
                      />
                      {fieldState.error && (
                        <FormHelperText sx={{ color: "red" }}>
                          {fieldState.error?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
              <FormControl>
                <Controller
                  control={form.control}
                  name={`cards.${index}.verso`}
                  render={({ field, fieldState }) => (
                    <>
                      <RichText
                        label="Verso"
                        {...field}
                        onContentChange={(content: string) =>
                          field.onChange(content)
                        }
                        className={fieldState.error ? "error" : ""}
                      />
                      {fieldState.error && (
                        <FormHelperText sx={{ color: "red" }}>
                          {fieldState.error?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
              <div className="media-tools">
                <div className="action-btns">
                  {/* Image */}
                  <FormControl>
                    <Controller
                      control={form.control}
                      name={`cards.${index}.img`}
                      render={({ field, fieldState }) => (
                        <div className="inline-flex">
                          <Button
                            startIcon={<InsertPhotoIcon />}
                            variant="contained"
                            color="secondary"
                            component="label"
                            className="btn-upload"
                          >
                            <HiddenInput
                              type="file"
                              {...field}
                              onChange={async (
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                await handleFileUpload(event, "IMG", index);
                                field.onChange(event);
                              }}
                            />
                          </Button>

                          {!!fieldState.error?.message && (
                            <FormHelperText>
                              {fieldState.error?.message as string}
                            </FormHelperText>
                          )}
                        </div>
                      )}
                    />
                  </FormControl>

                  {/* Video */}
                  <FormControl>
                    <Controller
                      control={form.control}
                      name={`cards.${index}.video`}
                      render={({ field, fieldState }) => (
                        <div className="inline-flex">
                          <Button
                            startIcon={<OndemandVideoIcon />}
                            variant="contained"
                            color="secondary"
                            component="label"
                            className="btn-upload"
                          >
                            <HiddenInput
                              type="file"
                              {...field}
                              onChange={async (
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                await handleFileUpload(event, "VID", index);

                                field.onChange(event);
                              }}
                            />
                          </Button>
                          {!!fieldState.error?.message && (
                            <FormHelperText>
                              {fieldState.error?.message as string}
                            </FormHelperText>
                          )}
                        </div>
                      )}
                    />
                  </FormControl>

                  {/* Audio */}
                  <FormControl>
                    <Controller
                      control={form.control}
                      name={`cards.${index}.audio`}
                      render={({ field, fieldState }) => (
                        <div className="inline-flex">
                          <Button
                            startIcon={<AudiotrackIcon />}
                            variant="contained"
                            color="secondary"
                            component="label"
                            className="btn-upload"
                          >
                            <HiddenInput
                              type="file"
                              {...field}
                              onChange={async (
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                await handleFileUpload(event, "AUD", index);

                                field.onChange(event);
                              }}
                            />
                          </Button>
                          {!!fieldState.error?.message && (
                            <FormHelperText>
                              {fieldState.error?.message as string}
                            </FormHelperText>
                          )}
                        </div>
                      )}
                    />
                  </FormControl>
                </div>
                <div className="div-media">
                  {/* Image */}
                  {cardMedias[index]?.img?.preview != "" && (
                    <div className="preview-media">
                      <img
                        src={cardMedias[index].img?.preview}
                        alt={cardMedias[index].img?.fileName}
                      />
                      <small>{cardMedias[index].img?.fileName}</small>
                    </div>
                  )}

                  {/* Video */}
                  {cardMedias[index]?.video?.preview != undefined && (
                    <div className="preview-media">
                      <video src={cardMedias[index].video?.preview} controls />
                      <small>{cardMedias[index].video?.fileName}</small>
                    </div>
                  )}

                  {/* Audio */}
                  {cardMedias[index]?.audio?.preview != undefined && (
                    <div className="preview-media">
                      <audio src={cardMedias[index].audio?.preview} controls />
                      <small>{cardMedias[index].audio?.fileName}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="card-input-actions">
              <IconButton color="error" onClick={() => deleteCardField(index)}>
                <DeleteForever />
              </IconButton>
            </div>
          </div>
        ))}
        <div className="form-action">
          <Button onClick={appendCardField}>
            <div className="inline-flex">
              <AddCircleIcon />
              Ajouter une carte
            </div>
          </Button>
          <Button variant="contained" type="submit">
            <strong>Enregistrer</strong>
          </Button>
        </div>
        {addCardMutation.isPending && (
          <>
            <div className="blur" />
            <LinearProgress
              style={{ width: "100%" }}
              className="linear-progress"
            />
          </>
        )}
      </form>
    </div>
  );
};

export default AddCardForm;
