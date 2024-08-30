import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SidebarItem } from "../types/sidebarItem";

library.add(fas);
export const sidebarItems: SidebarItem[] = [
  {
    title: "Accueil",
    icon: <FontAwesomeIcon icon={"fa-solid fa-house" as IconProp} />,
    link: "/home",
  },
  {
    title: "Paquets",
    icon: <FontAwesomeIcon icon={"fa-solid fa-box-open" as IconProp} />,
    link: "/packages",
  },
  {
    title: "Quiz",
    icon: <FontAwesomeIcon icon={"fa-solid fa-clipboard-list" as IconProp} />,
    link: "/quizs",
  },
];
