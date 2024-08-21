/**
  * This file was automatically generated.
  * DO NOT MODIFY IT BY HAND.
  * Instead, modify the serovizr JSON schema files
  * and run ./generate_types.sh to regenerate this file.
*/
export type DataSeries = {
  name?: string;
  model: {
    x: number[];
    y: (number | null)[];
  };
  raw: {
    x: number[];
    y: (number | null)[];
  };
  [k: string]: unknown;
}[];
export interface DatasetMetadata {
  variables: VariableSchema[];
  biomarkers: string[];
  xcol: string;
}
export interface VariableSchema {
  name: string;
  levels: string[];
}
export type DatasetNames = string[];
export interface ErrorDetail {
  error: string;
  detail: string | null;
  [k: string]: unknown;
}
export interface ResponseFailure {
  status: "failure";
  data: null;
  errors: ErrorDetailSchema[];
  [k: string]: unknown;
}
export interface ErrorDetailSchema {
  error: string;
  detail: string | null;
  [k: string]: unknown;
}
export interface ResponseSuccess {
  status: "success";
  data: unknown;
  errors: null;
}
export type UploadResult = string;
export interface Variable {
  name: string;
  levels: string[];
}
export type Version = string;
