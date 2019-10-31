# Client
[(Back to main documentation...)](../README.md)

## Table of contents
* [Commands](#commands)
* [Structure](#structure)
* [Technologies](#technologies)
* [Conventions](#conventions)

## Commands
`npm install` - Installation all needed packages </br>
`npm start` - Client launch. Available at: [localhost:3001](localhost:3001) (HMR Support) </br>
`npm run lint` - Correction of errors in the code using ESLint </br>
`npm build` - Building a client to production code in the **build** folder </br>
`npm run start:prod` - Start static server [serve](https://github.com/zeit/serve) hosting the code built by `npm build`

## Structure

**public/**</br>
Includes the `index.html` page templates with meta tags.

**assets/**</br>
Includes additional assets used in the project (icons, pictures, etc.).

**components/**</br>
All components are located in this folder. Each component is in a separate folder and has its own `ComponentName.js` file and the  optional `ComponentName.style.scss` file with styles. Filenames denoting the React and style components written in PascalCase.

**pages/**</br>
Folder with pages. Each page is placed in its own folder, in which there is a file `index.js` with the logic and a file `Page.style.scss` with the styles.

**styles/**</br>
Contains css files with global styles, variables and functions used throughout the project.

**src/AppRouter.js**</br>
Router file to which all pages are imported.

**src/index.js**</br>
The main file in which the application is rendered.

**config/**</br>
Folder of files created as a result of pulling out (eject) webpack configuration.

## Technologies
- **Webpack** - Module Bundler for applications. The main task is to create "bundles" of code, i.e. one or more output files.
- **Babel** - Transpiler converting ES6 + code into code understandable for older browsers.
- **Sass** - CSS preprocessor that extends the CSS syntax considerably by adding commands to make it much more re-usable.
- **Socket.io** - Enables communication between the client and server.
- **GraphQL** - Query language, an alternative to the traditional REST API. Main advantage is only one endpoint, and properly constructed queries provide only the data you need.
- **Apollo-GraphQL** - Provides GraphQL API integration with React components, cache for received data and their storage for reuse between views.
- **EsLint** - Linter, who supports writing code by applying rules that everyone in the project should follow.
- **antd** - React library containing a huge set of useful UI components.
- **react-google-maps** - Google Maps for React.

## Conventions
- The .env file provides access to client-side environment variables (injected into the code during construction) by [dotenv](https://github.com/motdotla/dotenv#readme) standard.
- ESLint, which uses the `.eslintrc` configuration file, is responsible for the proper convention of writing in` .js` files. Classes are written in SCSS using the BEM methodology.

*The file has been translated from Polish*