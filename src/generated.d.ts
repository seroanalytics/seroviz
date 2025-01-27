/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the serovizr JSON schema files
  * and run ./generate_types.sh to regenerate this file.
*/
export type DataSeries = {
  name: string;
  model: {
    x: (number | string | null)[];
    y: (number | null)[];
  } | null;
  raw: {
    x: (number | string | null)[];
    y: (number | null)[];
  };
  warnings: string[] | null;
}[];
export interface DatasetMetadata {
  variables: VariableSchema[];
  biomarkers: string[];
  xcol: string;
  type: "surveillance" | "post-exposure";
}
export interface VariableSchema {
  name: string;
  levels: (string | number | null)[];
}
export type DatasetNames = string[];
export interface ErrorDetail {
  error: string;
  detail: string | null;
}
export interface Plotly {
  data: {
    x?: unknown[] | null | number;
    y?: unknown[] | null | number;
    [k: string]: unknown;
  }[];
  layout: {
    [k: string]: unknown;
  };
  warnings: string | null | string[];
  numPages: number;
  page: number;
}
export type PublicDatasets = {
  name: string;
  description: string;
  [k: string]: unknown;
}[];
export interface ResponseFailure {
  status: "failure";
  data: null;
  errors: ErrorDetailSchema[];
}
export interface ErrorDetailSchema {
  error: string;
  detail: string | null;
}
export interface ResponseSuccess {
  status: "success";
  data: unknown;
  errors: null;
}
export type UploadResult = string;
export interface Variable {
  name: string;
  levels: (string | number | null)[];
}
export type Version = string;
