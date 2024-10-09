import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle,
  DeleteForever,
  Error,
  VolumeUp,
} from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { Button, FormControl, FormHelperText, IconButton } from "@mui/material";
import parse from "html-react-parser";
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Controller, useForm } from "react-hook-form";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { API_BASE_URL } from "../../../../shared/constants/api.constant";
import { toBase64 } from "../../../../shared/services/upload/fileUpload.service";
import { Media } from "../../../../shared/types/Media";
import { VisuallyHiddenInput } from "../../../quiz/components/question-form/question-form.component";
import { cardMediaSchema } from "../../helper/package-form.helper";
import { CardLib } from "../../types/PackageLib";
import "./update-card-form.component.scss";

interface UpdateCardFormProps {
  card: CardLib;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const UpdateCardForm: React.FC<UpdateCardFormProps> = (props) => {
  const form = useForm({
    resolver: zodResolver(cardMediaSchema),
  });

  const img = form.watch("img");
  const video = form.watch("video");
  const audio = form.watch("audio");
  const removeImg = form.watch("removeImg");
  const removeAud = form.watch("removeAud");
  const removeVid = form.watch("removeVid");

  const cardMedias = useMemo(() => {
    const medias: Record<string, string> = {};
    props.card?.medias.forEach((m) => {
      medias[m.mediaType] = m.mediaPath;
    });
    return medias;
  }, [props.card]);

  const handleFileUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, fieldName: string) => {
      const file = event.target.files?.[0] as File;
      const blob = await toBase64(file);

      const media: Media = {
        blob,
        fileName: file.name as string,
        contentType: file.type as string,
        size: file.size as number,
      };

      form.setValue(fieldName, { preview: URL.createObjectURL(file), media });
    },
    [form]
  );

  const onFormSubmit = (data: any) => {
    props.onSubmit({
      card: {
        medias: {
          img: data.img?.media as Media | undefined,
          video: data.video?.media as Media | undefined,
          audio: data.audio?.media as Media | undefined,
        },
      },
      removeImg,
      removeAud,
      removeVid,
    });
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      form.trigger(["img", "video", "audio"]);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="update-card-form">
      <form className="form" onSubmit={form.handleSubmit(onFormSubmit)}>
        <div className="form-input">
          <h3>Recto:</h3>
          {parse(props.card?.recto)}
        </div>
        <div className="form-input">
          <h3>Verso:</h3>
          {parse(props.card?.verso)}
        </div>
        <h3>Médias</h3>
        <div className="form-input media-inputs">
          <FormControl>
            <Controller
              name="img"
              control={form.control}
              render={({ field, fieldState }) => (
                <Fragment>
                  <Button
                    component="label"
                    color="accent"
                    variant="contained"
                    tabIndex={-1}
                  >
                    <ImageIcon />
                    {img &&
                      (!fieldState.error ? (
                        <CheckCircle fontSize="small" />
                      ) : (
                        <Error fontSize="small" color="error" />
                      ))}
                    <VisuallyHiddenInput
                      onChange={(event) => handleFileUpload(event, field.name)}
                      type="file"
                    />
                  </Button>
                </Fragment>
              )}
            />
          </FormControl>

          <FormControl>
            <Controller
              name="video"
              control={form.control}
              render={({ field, fieldState }) => (
                <Button
                  component="label"
                  color="accent"
                  variant="contained"
                  tabIndex={-1}
                >
                  <OndemandVideoIcon />
                  {video &&
                    (!fieldState.error ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <Error fontSize="small" color="error" />
                    ))}

                  <VisuallyHiddenInput
                    onChange={(event) => handleFileUpload(event, field.name)}
                    type="file"
                  />
                </Button>
              )}
            />
          </FormControl>

          <FormControl>
            <Controller
              name="audio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Button
                  component="label"
                  color="accent"
                  variant="contained"
                  tabIndex={-1}
                >
                  <VolumeUp />
                  {audio &&
                    (!fieldState.error ? (
                      <CheckCircle fontSize="small" />
                    ) : (
                      <Error fontSize="small" color="error" />
                    ))}

                  <VisuallyHiddenInput
                    onChange={(event) => handleFileUpload(event, field.name)}
                    type="file"
                  />
                </Button>
              )}
            />
          </FormControl>
        </div>

        <div className="group-medias">
          <div className="media-previews">
            {img ? (
              <div className="media-item">
                <img src={img.preview} alt={img.media?.fileName} />

                <div>
                  <div className="media-info">
                    <p>
                      <small>{img.media?.fileName}</small>
                    </p>
                    <IconButton
                      color="error"
                      onClick={() => form.resetField("img")}
                    >
                      <DeleteForever />
                    </IconButton>
                  </div>
                  {form.getFieldState("img").error && (
                    <FormHelperText error>
                      {form.getFieldState("img").error?.message}
                    </FormHelperText>
                  )}
                </div>
              </div>
            ) : (
              cardMedias["IMG"] && (
                <div>
                  <img
                    src={`${API_BASE_URL}/${cardMedias["IMG"]}`}
                    alt="Image"
                    className={removeImg && "removed-media"}
                  />
                  <Button
                    size="small"
                    color={removeImg ? "success" : "error"}
                    onClick={() => form.setValue("removeImg", !removeImg)}
                  >
                    <small> {removeImg ? "Garder" : "Supprimer"} </small>
                  </Button>
                </div>
              )
            )}
            {video ? (
              <div className="media-item">
                <video src={video.preview} controls />
                <div className="media-info">
                  <p>
                    <small>{video.media?.fileName}</small>
                  </p>
                  <IconButton
                    color="error"
                    onClick={() => form.resetField("video")}
                  >
                    <DeleteForever />
                  </IconButton>
                </div>
                {form.getFieldState("video").error && (
                  <FormHelperText error>
                    {form.getFieldState("video").error?.message}
                  </FormHelperText>
                )}
              </div>
            ) : (
              cardMedias["VID"] && (
                <div>
                  <video
                    src={`${API_BASE_URL}/${cardMedias["VID"]}`}
                    controls
                    className={removeVid && "removed-media"}
                  />
                  <Button
                    size="small"
                    color={removeVid ? "success" : "error"}
                    onClick={() => form.setValue("removeVid", !removeVid)}
                  >
                    <small> {removeVid ? "Garder" : "Supprimer"} </small>
                  </Button>
                </div>
              )
            )}
            {audio ? (
              <div className="media-item">
                <audio src={audio.preview} controls />
                <div>
                  <div className="media-info">
                    <p>
                      <small>{audio.media?.fileName}</small>
                    </p>
                    <IconButton
                      color="error"
                      onClick={() => form.resetField("audio")}
                    >
                      <DeleteForever />
                    </IconButton>
                  </div>
                  {form.getFieldState("audio").error && (
                    <FormHelperText error>
                      {form.getFieldState("audio").error?.message}
                    </FormHelperText>
                  )}
                </div>
              </div>
            ) : (
              cardMedias["AUD"] && (
                <div>
                  <audio
                    src={`${API_BASE_URL}/${cardMedias["AUD"]}`}
                    controls
                    className={removeImg && "removed-media"}
                  />
                  <Button
                    size="small"
                    color={removeAud ? "success" : "error"}
                    onClick={() => form.setValue("removeAud", !removeAud)}
                  >
                    <small> {removeAud ? "Garder" : "Supprimer"} </small>
                  </Button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="form-action text-center">
          <Button variant="contained" type="submit">
            <AppLoaderComponent loading={!!props.isSubmitting}>
              Modifier{" "}
            </AppLoaderComponent>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCardForm;
