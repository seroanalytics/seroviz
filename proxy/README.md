# Seroviz Proxy

A Dockerised nginx server for serving the Seroviz app. 
It is configured to proxy the `serovizr` API and to serve the static files that 
comprise the React app.

## Usage

The entrypoint takes the hostname as an argument, e.g.:

```
docker run seroviz-proxy seroanalytics.org
```

## SSL certificates

The proxy just serves the app on port 80. SSL must be handled at the point of deployment.
