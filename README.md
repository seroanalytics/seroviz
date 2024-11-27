![serovizlogo250](https://github.com/user-attachments/assets/ea22b922-8d2d-4bc2-a80d-bee9729be63c)

[![Project Status: WIP – Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![🔨 Build](https://github.com/seroanalytics/seroviz/actions/workflows/build.yml/badge.svg)](https://github.com/seroanalytics/seroviz/actions/workflows/build.yml)
[![🔎 Test](https://github.com/seroanalytics/seroviz/actions/workflows/test.yml/badge.svg)](https://github.com/seroanalytics/seroviz/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/seroanalytics/seroviz/graph/badge.svg?token=2DH6NUOXRe)](https://codecov.io/gh/seroanalytics/seroviz)
![Docker Image Version](https://img.shields.io/docker/v/seroanalytics/seroviz?logo=docker)
![GitHub License](https://img.shields.io/github/license/seroanalytics/seroviz)

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

### Docker
The app is deployed using a Dockerised `nginx` server.
See the [proxy/README.md](proxy/README.md) for details.

* To build the Docker image run `.scripts/build`. 
* To push an image to DockerHub run `./scripts/push`
* To start a copy of the Dockerised app locally run `./scripts/run`.

### Secrets
Secrets (at the moment this is just the real SSL private key and certificate) are stored in 
HashiCorp Cloud Vault. To access the secrets in Vault, you need to create an account with [HashiCorp Cloud](https://portal.cloud.hashicorp.com/sign-in)
and ask Alex to add you to the organization.

### Deploying the app
The app is deployed on DigitalOcean's App Platform. The Seroviz app has 2 services, 
each deployed using Docker images. One is this app, and the other is the [serovizr API](https://github.com/seroanalytics/serovizr).
The app topology should look like this:

```yaml
alerts:
- rule: DEPLOYMENT_FAILED
- rule: DOMAIN_FAILED
domains:
- domain: seroviz.seroanalytics.org
  type: PRIMARY
features:
- buildpack-stack=ubuntu-22
ingress:
  rules:
  - component:
      name: serovizr
    match:
      path:
        prefix: /api
  - component:
      name: seroviz
    match:
      path:
        prefix: /
name: seroviz
region: lon
services:
- http_port: 8888
  image:
    registry: seroanalytics
    registry_type: DOCKER_HUB
    repository: serovizr
    tag: main
  instance_count: 1
  instance_size_slug: apps-s-1vcpu-0.5gb
  name: serovizr
- http_port: 80
  image:
    registry: seroanalytics
    registry_type: DOCKER_HUB
    repository: seroviz
    tag: main
  instance_count: 1
  instance_size_slug: apps-s-1vcpu-0.5gb
  name: seroviz
```

The domain and SSL are also configured on DigitalOcean under the Networking section.

## Domain name
The domain name `seroanalytics.org` is registered with NameCheap.
Contact Alex if you need to add or change a DNS record.
