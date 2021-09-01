# ToDo List Application

This repository contain two parts.

- todo-app-apis (Backend development)
- todo-app-web (Frontend development)

## Start the Backend Server
Follow the steps to start the nodejs backend.

```sh
cd todo-app-apis
npm install
node generateKeys.js
node app.js
```
- Install the dependencies
- generateKeys.js for generate private and public keys which used authentication
- Edit .env file in the root folder to change the database. 
- Server will start in http://localhost:8080/

## Start the Frontend
Follow the steps to start the angular frontend.

```sh
cd todo-app-web
npm install
ng serve
```
- Install the dependencies
- Change "apiUrl" in the environment.ts file environment folder, if changes done to the backend server port or backend running in different url.
- Go to http://localhost:4200/

## Features
- User signup and signin to system.
- Manage the todo list for users.
- Drag and drop items to arange the todo list.

## Tech
- NodeJs
- Express
- Passport
- Angular
- Angular Material
- Mongodb