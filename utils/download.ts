import { writeFile, utils as XLSXUtils } from "xlsx";
/* import { logEvent } from "@/utils/logger"; */
import { usePreferencesStore } from "@/store/preferences";

export function downloadData(data: Record<string, unknown>[], name: string) {
  const format = usePreferencesStore().downloadFormat.key;
  /* logEvent("Request download", { format: format }); */
  if (format === "json") {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "text/plain;charset=utf-8" });
    const url = window.URL || window.webkitURL;
    const link = url.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${name}.${format}`;
    a.href = link;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    const worksheet = XLSXUtils.json_to_sheet(data);
    const workbook = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(workbook, worksheet, "Transactions");
    writeFile(workbook, `${name}.${format}`);
  }
}
