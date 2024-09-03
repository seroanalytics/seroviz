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

The server will not start until the files `/run/proxy/certificate.pem` and `/run/proxy/key.pem` exist - 
you can get these into the container however you like; the proxy will poll for them and start within a second of them appearing.

The production SSl key and certificate are stored on the [Vault cloud platform](https://www.hashicorp.com/products/vault). You will
need an account and to be added to the `seroanalytics` project to access these secrets. 

## Self-signed certificate

For testing it is useful to use a self-signed certificate. These are not in any way secure.
To generate a self-signed certificate, there is a utility in the proxy container self-signed-certificate that will 
generate one on demand after receiving key components of the CSR.

There is a self-signed certificate in the repo for testing generated with (on metal)

```
./proxy/bin/self-signed-certificate proxy/ssl GB London LSHTM seroanalytics localhost
```

These can be used in the container by execing `self-signed-certificate /run/proxy` in the container while it polls for certificates. 
Alternatively, to generate certificates with a custom CSR (which takes a couple of seconds) you can exec something like:

```
self-signed-certificate GB London LSHTM seroanalytics seroanalytics.org
```

## dhparams (Diffie-Hellman key exchange parameters)

We require a `dhparams.pem` file (see [here](https://security.stackexchange.com/questions/94390/whats-the-purpose-of-dh-parameters)) for details. 
The file in this directory is built into the Docker image, but can be overwritten when deploying the app, by copying your own into the container at `/run/proxy/dhparams.pem` before
getting the certificates in place.

To regenerate the file in this directory, run

```
./proxy/bin/dhparams proxy/ssl
```

This takes quite a while to run (several minutes). 
