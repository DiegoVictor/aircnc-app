# [App] Aircnc
![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/aircnc-app?style=flat-square&logo=circleci)
[![react-native](https://img.shields.io/badge/react--native-0.61.5-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![styled-components](https://img.shields.io/badge/styled_components-5.2.1-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-6.8.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-24.9.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/aircnc-app?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/aircnc-app)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://github.com/DiegoVictor/aircnc-app/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

This app allows to users to book spots from companies to a specified date, be notified when the request is approved or rejected and see all book requests made and its current status. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/aircnc-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
  * [OS](#os)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/signin.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/list.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/book.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/calendar.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/booked.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/bookings.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/canceled.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/approved.png" width="32%" />
<img src="https://raw.githubusercontent.com/DiegoVictor/aircnc-app/master/screenshots/rejected.png" width="32%" />

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/aircnc-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
API_URL|API's url with version (v1)|`http://localhost:3333/v1`
SOCKET_URL|Socket.io's url|`http://localhost:3333`

### API
Start the [`API`](https://github.com/DiegoVictor/aircnc-api) (see its README for more information). In case of any change in the API's port or host remember to update the `.env`'s `API_URL` and `SOCKET_URL` properties too.
> Also, maybe you need run reverse command to the API's port: `adb reverse tcp:3333 tcp:3333`

# Usage
The first build must be through USB connection, so connect your device (or just open your emulator) and run:
```
$ yarn android
```
Or:
```
$ npm run android
```

In the next times you can just run the Metro Bundler server:
```
$ yarn start
```
Or:
```
$ npm run start
```

## OS
This app was tested only with Android through USB connection and [Genymotion](https://www.genymotion.com/) (Emulator), is strongly recommended to use the same operational system, but of course you can use an emulator or a real device connected through wifi or USB.

# Running the tests
[Jest](https://jestjs.io/) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
