import type { Paginated } from "zksync/build/types";

export interface TabsPageTab {
  name: string;
  to: string;
}
export type TabsPageTabs = Array<TabsPageTab>;

export interface TableHeader {
  label: string | number | boolean;
  key: string;
}

export interface TableRow {
  name: string | number | boolean;
  key: string;
  [prop: string]: string | number | boolean | object | Array<unknown>;
}

export type SelectValue = {
  id: number;
  key: string;
  value: string | number | boolean;
  [prop: string]: string | number | boolean | object | Array<unknown>;
};

export interface Request<T> {
  status: "success" | "error";
  result: Paginated<T, string>;
  error?: {
    code: number;
    errorType: string;
    message: string;
  };
}
