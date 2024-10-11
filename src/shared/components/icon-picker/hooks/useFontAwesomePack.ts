import {
  IconLookup,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";

export const useFontAwesomePack = () => {
  const [faPack, setFaPack] = useState<IconLookup[]>();

  useEffect(() => {
    console.log("hooks");

    if (!faPack) {
      import("@fortawesome/free-solid-svg-icons").then((module) => {
        const fas = { ...module.fas };
        const exist = new Set<string>();

        const icons: { icon: any[]; prefix: IconPrefix; iconName: IconName }[] =
          [];
        Object.values(fas).forEach((icon) => {
          if (!exist.has(icon.iconName)) {
            exist.add(icon.iconName);
            icons.push({
              prefix: icon.prefix,
              icon: icon.icon,
              iconName: icon.iconName,
            });
          }
        });
        console.log("icon is ready");

        setFaPack(icons);
      });
    }
  }, [faPack]);
  return faPack;
};
