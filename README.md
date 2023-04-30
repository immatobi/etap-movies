## ETAP Movies App

> The REST API backend for the ETAP Interview task by Oluwatobi Immanuel. A Nest.js Backend application for a Movie app.

## Framework

This Software is built with the Node & NEST.js framework, with pure typescript as the coding language.


## Assesment Link
[Link To Assessment](https://clammy-manager-f78.notion.site/Full-stack-Engineer-3b8b6e73a92b4317a35c02a43bc254b2)

## API Documentation Link
[(https://documenter.getpostman.com/view/5093497/2s93eSaFgK](https://documenter.getpostman.com/view/5093497/2s93eSaFgK)

## Github repository Link
[https://github.com/immatobi/etap-movies](https://github.com/immatobi/etap-movies.git)

## App Features
```
- Full authentication with 'register' and 'login'
- Authentication and authorization features to manage app security
- Protected routes for admin and users
- Role-based flexible REST API endpoints
- All required Movie features from 'task' requirements included.
- Upload of movied thumbnail by users
- Use of POSTGRESQL, NEST.js, NEXT.js, NODE.js, Typescript and React as Tech stack.
```

## Usage

- Pull the [codebase](https://github.com/immatobi/etap-movies.git) from the repository.
- Make sure to have Nodejs, NEST.js && Typescrit installed globally on your computer
- Duplicate the .env.example file and rename it to .env
- Supply all the .env values EXCEPT the ones already supplied.
- NB: Leave the 'GOOGLE_BUCKET_NAME' venv value as is.


### Install dependencies
```
- Run the command --> "npm install --force"
```

### Run Application
```
- Run in development mode --> "npm run start:dev"
- Run in production mode --> "npm start"
```



### Testing (Unit Testing)

```bash
# unit tests
$ npm run test:watch
```
### To run the tests that cover app features
```
- Press 'p' on your keyboard to enter a specific test file path to run. Run the two tests below: (press 'p' first)

1. auth.controller.spec
2. movie.controller.spec
```

## Metadata

Version: 1.0.0  ||  License: MIT
