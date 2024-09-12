/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { formErrors } from "../../../shared/constants/form-errors.constant";
import {
  ALLOWED_AUDIO_EXT,
  ALLOWED_IMG_EXT,
  ALLOWED_VID_EXT,
  MAX_AUDIO_SIZE,
  MAX_IMG_SIZE,
  MAX_VIDEO_SIZE,
} from "../../../shared/constants/media.constant";
import { mediaValidationSchema } from "../../../shared/helpers/fileupload.helper";

export const cardMediaValidator = z.object({
  preview: z.string().optional(),
  media: mediaValidationSchema,
});

const cardSchema = z.object({
  recto: z.string().min(1, formErrors.fr.required),
  verso: z.string().min(1, formErrors.fr.required),
  medias: z.object({
    img: cardMediaValidator
      .optional()
      .refine(
        (img) => {
          console.log("Refine");

          if (img?.media) {
            console.log(img.media.size);
            return img.media?.size < MAX_IMG_SIZE;
          }
          return true;
        },
        {
          message: formErrors["fr"].maxSize(
            (MAX_IMG_SIZE - 500000) / 1000000,
            "Mo"
          ),
        }
      )
      .refine(
        (value) => {
          if (value?.media) {
            return ALLOWED_IMG_EXT.includes(
              value.media?.fileName.split(".").pop() as string
            );
          }
          return true;
        },

        { message: formErrors["fr"].unallowedType }
      ),
    video: cardMediaValidator
      .optional()
      .refine(
        (video) => {
          if (video?.media) {
            return video.media?.size < MAX_VIDEO_SIZE;
          }
          return true;
        },
        {
          message: formErrors["fr"].maxSize(
            (MAX_VIDEO_SIZE - 500000) / 1000000,
            "Mo"
          ),
        }
      )
      .refine(
        (value) => {
          if (value?.media) {
            return ALLOWED_VID_EXT.includes(
              value.media?.fileName.split(".").pop() as string
            );
          }
          return true;
        },

        { message: formErrors["fr"].unallowedType }
      ),
    audio: cardMediaValidator
      .optional()
      .refine(
        (audio) => {
          if (audio?.media) {
            return audio.media?.size < MAX_AUDIO_SIZE;
          }
          return true;
        },
        {
          message: formErrors["fr"].maxSize(
            (MAX_AUDIO_SIZE - 500000) / 1000000,
            "Mo"
          ),
        }
      )
      .refine(
        (value) => {
          if (value?.media) {
            return ALLOWED_AUDIO_EXT.includes(
              value.media?.fileName.split(".").pop() as string
            );
          }
          return true;
        },

        { message: formErrors["fr"].unallowedType }
      ),
  }),
});

export const AddCardSchema = z.object({
  cards: z.array(cardSchema),
});

export const PackageSchema = z.object({
  title: z.string().min(1, formErrors.fr.required),
  course: z
    .string({ required_error: formErrors.fr.required })
    .min(1, formErrors.fr.required),
  theme: z
    .string({ required_error: formErrors.fr.required })
    .min(1, formErrors.fr.required),
  img: cardMediaValidator
    .required({ media: true })
    .refine(
      (img) => {
        if (img?.media) {
          return img.media?.size < MAX_IMG_SIZE;
        }
        return true;
      },
      {
        message: formErrors["fr"].maxSize(MAX_IMG_SIZE / 1000000, "Mo"),
      }
    )
    .refine(
      (img) => {
        if (img?.media) {
          return ALLOWED_IMG_EXT.includes(
            img.media?.fileName.split(".").pop() as string
          );
        }
        return true;
      },
      { message: formErrors["fr"].unallowedType }
    ),
});

export const updatePackageSchema = z.object({
  title: z.string().min(1, formErrors.fr.required),
  img: cardMediaValidator
    .optional()
    .refine(
      (img) => {
        if (img?.media) {
          return img.media?.size < MAX_IMG_SIZE;
        }
        return true;
      },
      {
        message: formErrors["fr"].maxSize(MAX_IMG_SIZE / 1000000, "Mo"),
      }
    )
    .refine(
      (img) => {
        if (img?.media) {
          return ALLOWED_IMG_EXT.includes(
            img.media?.fileName.split(".").pop() as string
          );
        }
        return true;
      },
      { message: formErrors["fr"].unallowedType }
    ),
});

export const imgValidation = (file: File) => {
  console.log(file, file.size > MAX_IMG_SIZE);
  if (!file) {
    return formErrors.fr.required;
  }
  if (file.size == 0) {
    return formErrors.fr.required;
  }
  if (file.size > MAX_IMG_SIZE) {
    return formErrors.fr.maxSize(MAX_IMG_SIZE / 1000000, "Mo");
  }
  if (
    ALLOWED_IMG_EXT.includes(file?.name?.split(".").pop() as string) == false
  ) {
    return formErrors.fr.enum(ALLOWED_IMG_EXT.join(" ou "));
  }
  return "";
};
