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
import RichText from "../../../../shared/components/rich-text/rich-text.component";
import { uploadFile } from "../../../../shared/helpers/fileupload.helper";
import { HiddenInput } from "../../../../shared/styles/theme";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { CardWithMedia } from "../../../../shared/types/Card";
import { Package } from "../../../../shared/types/Package";
import { AddCardSchema } from "../../helper/package-form.helper";
import { addCardsToPackage } from "../../services/package.service";
import {
  AddCardFormState,
  initialAddCardFormState,
} from "../../state/add-card-form.state";
import "./add-card-form.component.scss";

interface AddCardProps {
  idPackage: string;
  pack: Package;
}

const AddCardForm: React.FC<AddCardProps> = (props) => {
  const [state, setState] = useState<AddCardFormState>(initialAddCardFormState);

  const form = useForm({
    resolver: zodResolver(AddCardSchema),
  });
  const cardFields = useFieldArray({
    control: form.control,
    name: "cards",
  });
  const cardsInput = form.watch("cards");

  useEffect(() => {
    const sub = form.watch(() => {
      cardFields.fields.forEach((_, i) => {
        form.trigger([`cards.${i}.medias`]);
      });
    });
    return () => sub.unsubscribe();
  }, [form, cardFields]);

  const handleFileUpload = useCallback(
    async (
      event: ChangeEvent<HTMLInputElement>,
      type: "IMG" | "AUD" | "VID",
      index: number
    ) => {
      if (event.target.files) {
        const data = event.target.files[0];

        const { preview, file } = await uploadFile(data);
        if (type == "IMG") {
          form.setValue(`cards.${index}.medias.img`, { preview, media: file });
        } else if (type == "VID") {
          form.setValue(`cards.${index}.medias.video`, {
            preview,
            media: file,
          });
        } else if (type == "AUD") {
          form.setValue(`cards.${index}.medias.audio`, {
            preview,
            media: file,
          });
        } else {
          throw new Error("Invalid Media type");
        }
      }
    },
    [form]
  );

  const addCardMutation = useMutation({
    mutationKey: ["addCard"],
    mutationFn: async (data: { idPackage: string; cards: CardWithMedia[] }) => {
      return addCardsToPackage(data.idPackage, data.cards);
    },
    onSuccess: () => {
      enqueueSnackbar("Carte(s) ajoutée(s)", { variant: "success" });
      form.reset(
        {
          cards: [
            {
              recto: "",
              verso: "",
              medias: undefined,
            },
          ],
        },
        { keepDefaultValues: false }
      );
    },
    onError: (err) => {
      const apiError = ((err as AxiosError).response?.data as ApiResponse)
        .error;
      if (Array.isArray(apiError)) {
        setState((state) => ({
          ...state,
          error: apiError,
        }));
        window.scrollTo({ top: 0 });
      } else {
        enqueueSnackbar({ message: apiError, variant: "error" });
      }
    },
  });

  const submitForm = () => {
    addCardMutation.mutate({
      idPackage: props.idPackage,
      cards: form.getValues().cards,
    });
  };

  const appendCardField = useCallback(() => {
    cardFields.append({
      recto: "",
      verso: "",
      medias: undefined,
    });
  }, [cardFields]);

  const deleteCardField = useCallback(
    (index: number) => {
      cardFields.remove(index);
    },
    [cardFields]
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
                        label={`Recto (${props.pack?.languageTarget?.label})`}
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
                        label={`Verso (${props.pack?.languageSource?.label})`}
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
                      name={`cards.${index}.medias.img`}
                      render={({ field }) => (
                        <div className="inline-flex" style={{ gap: "0rem" }}>
                          <Button
                            startIcon={<InsertPhotoIcon />}
                            variant="contained"
                            color="secondary"
                            component="label"
                            className="btn-upload"
                          >
                            <HiddenInput
                              type="file"
                              onChange={async (
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                await handleFileUpload(event, "IMG", index);
                              }}
                            />
                          </Button>
                          {field.value && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                form.resetField(`cards.${index}.medias.img`)
                              }
                            >
                              <DeleteForever fontSize="small" />
                            </IconButton>
                          )}
                        </div>
                      )}
                    />
                  </FormControl>

                  {/* Video */}
                  <FormControl>
                    <Controller
                      control={form.control}
                      name={`cards.${index}.medias.video`}
                      render={({ field }) => (
                        <div className="inline-flex" style={{ gap: 0 }}>
                          <Button
                            startIcon={<OndemandVideoIcon />}
                            variant="contained"
                            color="secondary"
                            component="label"
                            className="btn-upload"
                          >
                            <HiddenInput
                              type="file"
                              onChange={async (
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                await handleFileUpload(event, "VID", index);
                              }}
                            />
                          </Button>
                          {field.value && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                form.resetField(`cards.${index}.medias.video`)
                              }
                            >
                              <DeleteForever fontSize="small" />
                            </IconButton>
                          )}
                        </div>
                      )}
                    />
                  </FormControl>

                  {/* Audio */}
                  <FormControl>
                    <Controller
                      control={form.control}
                      name={`cards.${index}.medias.audio`}
                      render={({ field }) => (
                        <div className="inline-flex" style={{ gap: 0 }}>
                          <Button
                            startIcon={<AudiotrackIcon />}
                            variant="contained"
                            color="secondary"
                            component="label"
                            className="btn-upload"
                          >
                            <HiddenInput
                              type="file"
                              onChange={async (
                                event: ChangeEvent<HTMLInputElement>
                              ) => {
                                await handleFileUpload(event, "AUD", index);
                              }}
                            />
                          </Button>
                          {field.value && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                form.resetField(`cards.${index}.medias.audio`)
                              }
                            >
                              <DeleteForever fontSize="small" />
                            </IconButton>
                          )}
                        </div>
                      )}
                    />
                  </FormControl>
                </div>
                <div className="div-media">
                  {/* Image */}
                  {cardsInput[index].medias?.img && (
                    <div className="preview-media">
                      <img
                        src={cardsInput[index].medias?.img?.preview}
                        alt={cardsInput[index].medias?.img?.media?.fileName}
                      />
                      <small>
                        {cardsInput[index].medias?.img?.media.fileName}
                      </small>
                      {form.getFieldState(`cards.${index}.medias.img`)
                        .error && (
                        <FormHelperText error>
                          {
                            form.getFieldState(`cards.${index}.medias.img`)
                              .error?.message
                          }
                        </FormHelperText>
                      )}
                    </div>
                  )}

                  {/* Video */}
                  {cardsInput[index].medias?.video && (
                    <div className="preview-media">
                      <video
                        src={cardsInput[index].medias?.video?.preview}
                        controls
                      />
                      <small>
                        {cardsInput[index].medias?.video?.media.fileName}
                      </small>
                      {form.getFieldState(`cards.${index}.medias.video`)
                        .error && (
                        <FormHelperText error>
                          {
                            form.getFieldState(`cards.${index}.medias.video`)
                              .error?.message
                          }
                        </FormHelperText>
                      )}
                    </div>
                  )}

                  {/* Audio */}
                  {cardsInput[index].medias?.audio != undefined && (
                    <div className="preview-media">
                      <audio
                        src={cardsInput[index].medias?.audio?.preview}
                        controls
                      />
                      <small>
                        {cardsInput[index].medias?.audio?.media.fileName}
                      </small>
                      {form.getFieldState(`cards.${index}.medias.audio`)
                        .error && (
                        <FormHelperText error>
                          {
                            form.getFieldState(`cards.${index}.medias.audio`)
                              .error?.message
                          }
                        </FormHelperText>
                      )}
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
