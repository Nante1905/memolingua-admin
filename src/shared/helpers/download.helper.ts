export const downloadFile = (url: string, fileName: string) => {
  const tmpLink = document.createElement("a");
  tmpLink.href = url;
  tmpLink.setAttribute("download", fileName);

  document.body.appendChild(tmpLink);
  tmpLink.click();

  document.removeChild(tmpLink);
  window.URL.revokeObjectURL(url);
};
