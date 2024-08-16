![serovizlogo200](https://github.com/user-attachments/assets/4b4b732e-0a8a-4ed0-9340-b10f41fa6ff4)


[![Project Status: Concept – Minimal or no implementation has been done yet, or the repository is only intended to be a limited example, demo, or proof-of-concept.](https://www.repostatus.org/badges/latest/concept.svg)](https://www.repostatus.org/#concept)
[![🔨 Build](https://github.com/seroanalytics/seroviz/actions/workflows/build.yml/badge.svg)](https://github.com/seroanalytics/seroviz/actions/workflows/build.yml)
[![🔎 Test](https://github.com/seroanalytics/seroviz/actions/workflows/test.yml/badge.svg)](https://github.com/seroanalytics/seroviz/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/seroanalytics/seroviz/graph/badge.svg?token=2DH6NUOXRe)](https://codecov.io/gh/seroanalytics/seroviz)

Client-side React application for visualising serological data.

## Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Runs unit tests using jest.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run generate-types`

Auto-generates typescript types based on the [serovizr](https://github.com/seroanalytics/serovizr)
API JSON schema specifications. Generated types are saved into `src/generated.d.ts`.
