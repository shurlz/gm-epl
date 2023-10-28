### Mock Premier League 
Api is deployed and can be accessed [here](https://) and the official postman documentation can be accessed [here](https://)

Tech Stack => TypeScript & ExpressJs, Redis, MongoDB, Docker, Postman, AWS EC2 (deployment)

To run API locally; `docker compose up`
To run tests, ensure MongoDB and Redis are running then run; `yarn run tests`

### Features 
Rate limiting, achieved using a user rate limiting middleware. refer [here](https://)
  * Regular users can make a maximum of 40 API requests every 2 hours, then it resets

Layers of authorisation to access various resources; Basic and Admin roles implemented using Bearer Token. refer [here](https://)

Robust search functionality, search endpoint using Mongo regex

E2E testing (Unit tests and Endpoint tests) written using Jest
  * To run tests, ensure MongoDB and Redis are running locally, `yarn run test`

API request body validation is done using JOI validators/middleware. refer [here](https://)

Code is completely containerized and organised based on best practices
Refer to the postman documentation for a more elaborate testing instructions 
