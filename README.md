![logo192](https://github.com/user-attachments/assets/a988b290-0a61-47bf-aea9-cf3c17183b9a)

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
The app is deployed using a Dockerised `nginx` server which also proxies the `serovizr` API.
See the [proxy/README.md](proxy/README.md) for details.

* To build the Docker image run `.scripts/build`. 
* To push an image to DockerHub run `./scripts/push`
* To start a copy of the app locally with a self-signed SSL certificate run `./scripts/run`.

### Secrets
Secrets (at the moment this is just the real SSL private key and certificate) are stored in 
HashiCorp Cloud Vault. To access the secrets in Vault, you need to create an account with [HashiCorp Cloud](https://portal.cloud.hashicorp.com/sign-in)
and ask Alex to add you to the organization.

To deploy the app, ensure that you have the `hcp` CLI installed on your machine.
Installation instructions [here](https://developer.hashicorp.com/hcp/docs/cli/install).

### Deploying the app
The app is deployed onto an EC2 instance called `seroviz`. You will need to ask Alex for AWS console access, 
and to add your IP to the inbound security rules for ssh access.

Then:
1. Retrieve `hcp` service principal credentials by running *on your own machine* (after `hcp auth login`):
    ```shell
    hcp vs secrets open production_id --app=seroviz
    hcp vs secrets open production_secret --app=seroviz
    ```
1. ssh onto the server
1. Navigate to the `seroviz` directory
1. Run:
    ```shell
    ./scripts/clear-docker.sh
    ./scripts/deploy
    ```

    The `deploy` script will prompt you for the client id and secret from step 1.
    
    You can also export these as environment variables which may be more convenient in case deployment fails
    for any reason and has to be re-run:
    ```shell
    CLIENT_ID=<client_id>
    CLIENT_SECRET=<client_secret>
    ```

### Setting up a new EC2 instance
(unless otherwise specified, all steps are run on the remote machine)
* Install `git`:
    ```shell
    sudo yum -y install git
    ```
* Install Docker, following instructions [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-docker.html).
* Install the `hcp cli` for secret retrieval by following the [instructions](https://developer.hashicorp.com/hcp/docs/cli/install) for Amazon Linux.
* On your own machine, install the `hcp cli` if you haven't already, and retrieve the production service principal id and secret, stored at `production_id` and `production_secret`:
    ```shell
    hcp vs secrets open production_id --app=seroviz
    hcp vs secrets open production_secret --app=seroviz
    ```
* On the remote server, clone this GitHub repo using https:
    ```shell
    git clone https://github.com/seroanalytics/seroviz.git
    ```
* Follow the instructions above to deploy the app

## Domain name
The domain name `seroanalytics.org` is registered with NameCheap.
Contact Alex if you need to add or change a DNS record.

## Acknowledgements
Logo created with BioRender.com
