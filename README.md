# round-robin-api

## Structure

- ./application - for Application API
- ./round-robin-api - for Round Robin API

## Install dependencies

```bash
# Set up application
$ cd ./application
$ npm install

$ cd ../round-robin-api
$ npm install
```

## Run the repo

```bash
$ sh start.sh <number_of_application_instances>
```

- This will start Application API in multiple instances with different port starting from :3001.
- The Round Robin API instance will also be started using port 8080
- All application endpoints will be registered to Round Robin API.

## Round Robin API

- This service registers all Application endpoints.
- Once the service starts, it will check all endpoints healths by calling `GET <application_endpoint>/health-check` every second.
- The endpoints will be marked as unhealthy when the API call responds with error or takes more than 500ms to respond.

### API

Endpoint

```text
POST /
```

This API will send request to healthy Application in round-robin basis with request body it receives. Once Application responds, round robin API will send it back to client.

Example of body

```json
{
  "game": "Mobile Legends",
  "gamerID": "GYUTDTE",
  "points": 20
}
```

API will respond with

```json
{
  "game": "Mobile Legends",
  "gamerID": "GYUTDTE",
  "points": 20
}
```

## Application

Endpoint

```text
POST /
```

This application has 3 modes. `normal, slow, error`

- `normal` mode: application will respond back to the client with request body it receives.
- `slow` mode: application will sleep for 1000ms and then respond back to the client with request body it receives.
- `error` mode: application will respond with HTTP status code 503

### Set application mode

Sends a request to `POST /debug` with body

```json
{
  "mode": "normal"
}
```
