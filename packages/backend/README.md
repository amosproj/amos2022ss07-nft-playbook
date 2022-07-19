# backend

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test backend` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint backend` to execute the lint via [ESLint](https://eslint.org/).

# Flow issue documentation
## General information about Flow
- FCL (`F`low `C`lient `L`ibrary) is a Typescript library for the Flow blockchain provided by onfolow.org
- The API-Reference can be found under: https://docs.onflow.org/fcl/reference/api/
- The caveat is, that the implementation of the FCL API is designed to be run in a browser => when run, FCL starts an GUI-Overlay on top of the website, which is used to authenticate the user. This Overlay is necessary since there is no other supported method for authentication.
## Problems we encountered while trying to implement Flow
Considering the previously described aspects of FCL the most logical approach, was in our opinion to run a webserver providing a website which runs the FCL and communicates with the backend (CLI) using HTTP-Requests and the beforementioned webserver.

When implementing the plan, we encountered a massive problem which crushed all visions:

There is no simple JS File which could have been imported in the HTML-Document since onflow does not provide such.

To overcome this problem, we tried multiple methods of packing the JS-library into a bundle (Bundle-js, Webpack, ...).
Sadly, none of these tools were able to generate an executable JS bundle.

For that reason, we could not come up with an obvious way to enable interaction between FCL, which requires to be run in a browser, and our CLI.

The only possibility would have been to build a react/angular application, which itself manages the frontend dependencies and therefore resolves our problem.

We briefly tried to use the FCL with angular and it seemed to work. But due to the advanced stage of our project, the already existing complexity, and the uncertainty about how well the communication between Web-App and Backend would work
(especially in respect to the cryptographically signed keys) we decided to not dive too deep into the implementation of an additional Web-App.

(`Note for future projects:` It would have been very helpful to start with an angular/react application, since most of the APIs and interactions are designed for a clickable web front end)
