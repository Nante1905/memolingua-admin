import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { UserThemeNbr } from "../types/dashboard.type";

export const generateGeneralDashboardPDF = (
  config: Record<string, boolean | undefined>,
  chartRefs: {
    users: React.MutableRefObject<any>;
    sessions: React.MutableRefObject<any>;
  },
  startDate: string,
  endDate: string,
  packages: UserThemeNbr[],
  quiz: UserThemeNbr[],
  totalUsers: number
) => {
  const doc = new jsPDF("portrait", "px", "A4");
  let top = 40;
  const padding = 20;
  const canvaMargin = 30;
  const width = doc.internal.pageSize.width - padding * 4;
  const height = config.manyPage
    ? doc.internal.pageSize.height / 2
    : 3 * (doc.internal.pageSize.height / 8); // 1/2 of the page or 1/2 of 1/4
  let count = 0;

  // title
  doc.setFont("Helvetica", "", "bold");
  const lineHeight = 15;

  let title = `Statistiques générales Mémolingua`;
  doc.setFontSize(16);
  doc.text(
    title,
    doc.internal.pageSize.width / 2 - doc.getTextWidth(title) / 2,
    top
  );
  top += lineHeight;

  doc.setFontSize(14);
  title = `${dayjs(startDate).format("DD MMM YYYY")} - ${dayjs(endDate).format(
    "DD MMM YYYY"
  )}`;
  doc.text(
    title,
    doc.internal.pageSize.width / 2 - doc.getTextWidth(title) / 2,
    top
  );
  top += lineHeight * 2;

  doc.setFont("Helvetica", "", "bold");
  doc.setFontSize(12);

  // TABS
  let tableconfig = [];
  if (config.packages) {
    title = `Tendance d'apprentissage des thèmes parmi les paquets:`;
    doc.text(title, padding, top);
    doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
    top += lineHeight;
    doc.setFont("Helvetica", "", "normal");
    tableconfig = packages.map((u) => [
      u.idTheme,
      u.label,
      u.nbr,
      `${((u.nbr / totalUsers) * 100).toFixed(2)} %`,
    ]);

    autoTable(doc, {
      startY: top,
      theme: "grid",
      tableWidth: config.manyPage ? width : width / 1.5,
      head: [["Id", "Label", "Nombre d'utilisateurs", "Pourcentage"]],
      body: tableconfig,
      didDrawPage: (d) => {
        top = d.cursor?.y as number;
      },
      columnStyles: {
        2: {
          halign: "right",
        },
        3: {
          halign: "right",
        },
      },
      // headStyles: {
      //   fillColor
      // }
    });
    count += 1;
  }
  top += lineHeight * 2;

  doc.setFont("Helvetica", "", "bold");
  if (config.quiz) {
    if (count > 0 && config.manyPage) {
      doc.addPage();
      top = 40;
    }
    title = `Tendance des thèmes parmi les quiz:`;
    doc.text(title, padding, top);
    doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
    top += lineHeight;
    doc.setFont("Helvetica", "", "normal");
    tableconfig = quiz.map((u) => [
      u.idTheme,
      u.label,
      u.nbr,
      `${((u.nbr / totalUsers) * 100).toFixed(2)} %`,
    ]);

    autoTable(doc, {
      startY: top,
      theme: "grid",
      tableWidth: config.manyPage ? width : width / 1.5,
      head: [["Id", "Label", "Nombre d'utilisateurs", "Pourcentage"]],
      body: tableconfig,
      didDrawPage: (d) => {
        top = d.cursor?.y as number;
      },
      columnStyles: {
        2: {
          halign: "right",
        },
        3: {
          halign: "right",
        },
      },
      // headStyles: {
      //   fillColor
      // }
    });
    count += 1;
  }
  top += lineHeight * 2;

  // CHART
  doc.setFont("Helvetica", "", "bold");
  let canva = null;
  if (config.users) {
    if (
      count > 0 &&
      (height + top > doc.internal.pageSize.getHeight() || config.manyPage)
    ) {
      doc.addPage();
      top = 40;
    }

    title = `Répartition des apprenants par langue:`;
    doc.text(title, padding, top);
    doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
    top += lineHeight;
    canva = chartRefs.users.current!.canvas as HTMLCanvasElement;
    doc.addImage(canva, "png", padding, top, width, height);
    top += height + canvaMargin;
    count += 1;
  }

  if (config.sessions) {
    if (
      count > 0 &&
      (height + top > doc.internal.pageSize.getHeight() || config.manyPage)
    ) {
      doc.addPage();
      top = 40;
    }
    title = `Nombre totale de sessions par heure:`;
    doc.text(title, padding, top);
    doc.line(padding, top + 2, doc.getTextWidth(title) + padding, top + 2);
    top += lineHeight;
    canva = chartRefs.sessions.current!.canvas as HTMLCanvasElement;
    doc.addImage(canva, "png", padding, top, width, height);
    top += height + canvaMargin;
    count += 1;
  }

  doc.save(
    `Statistiques-generale-Mémolingua-${startDate?.replace(
      "-",
      "/"
    )}-${endDate?.replace("-", "/")}.pdf`
  );
};
