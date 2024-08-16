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
}[];
export interface DatasetMetadata {
  variables: {
    [k: string]: unknown;
  }[];
  biomarkers: string[];
  data?: {
    biomarker: string;
    value: number;
    [k: string]: unknown;
  }[];
}
export type DatasetNames = string[];
export type Version = string;
