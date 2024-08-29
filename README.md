[![Project Status: Concept – Minimal or no implementation has been done yet, or the repository is only intended to be a limited example, demo, or proof-of-concept.](https://www.repostatus.org/badges/latest/concept.svg)](https://www.repostatus.org/#concept)
[![🔨 Build](https://github.com/seroanalytics/seroviz/actions/workflows/build.yml/badge.svg)](https://github.com/seroanalytics/seroviz/actions/workflows/build.yml)
[![🔎 Test](https://github.com/seroanalytics/seroviz/actions/workflows/test.yml/badge.svg)](https://github.com/seroanalytics/seroviz/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/seroanalytics/seroviz/graph/badge.svg?token=2DH6NUOXRe)](https://codecov.io/gh/seroanalytics/seroviz)

Client-side React application for visualising serological data.

## Development

Install dependencies with `npm install`. Then the following scripts are available.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

For the app to work, the
[serovizr API](https://github.com/seroanalytics/serovizr) must be running on port 8888; this can
be started using `scripts/run-dev-dependencies.sh`.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Runs unit tests using jest.

### `npm run itest`

Runs integration tests using jest. This requires the 
[serovizr API](https://github.com/seroanalytics/serovizr) to be running; this can 
be started using `scripts/run-dev-dependencies.sh`.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run generate-types`

Auto-generates typescript types based on the [serovizr](https://github.com/seroanalytics/serovizr)
API JSON schema specifications. Generated types are saved into `src/generated.d.ts`.

## Deployment

The app is deployed using a Dockerised `nginx` server which also proxies the `serovizr` API.
See the [proxy/README.md](proxy/README.md) for details.

To build this Docker image run `.scripts/build`. To push an image to DockerHub 
run `./scripts/push`. And to start a copy of the app locally with a self-signed SSL certificate
run `./scripts/run`.
