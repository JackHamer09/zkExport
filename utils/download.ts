export async function downloadData(data: Record<string, unknown>[], name: string, format: string) {
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
  } else if (process.client) {
    const xlsx = await import("xlsx");
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");
    xlsx.writeFile(workbook, `${name}.${format}`);
  }
}
