# Delilah Restó

This is an API for the Delilah Restó restaurant and in order to facilitate management and improve the user experience.

**_Testing keys can be found on the server.js file_**

Creator: [Juan Pablo Montes](https://github.com/MontesJP)

### It has CRUD functionalities for:

    - Users
    - Products
    - Orders
    - Payment methods

### The technologies used for the development of the API are:

    - Express
    - NodeJS
    - MongoDB
    - Redis
    - JWT
    - Helmet
    - Swagger

## Package installation

For the correct functioning of the API and its documentation, it is necessary to install 3 packages in addition to having [Node.js](https://nodejs.org/en/) 0.10 or higher installed:

- Express:

  Express will help us to mount the server online and start it.

  More information about[Express](https://expressjs.com/).

- Mongoose:

  Mongoose is an ODM for our MongoDB database and provides a straight-forward, schema-based solution to model our application data.

  More information about [Mongoose]https://mongoosejs.com/)

- Redis:

  Redis is a super fast and efficient in-memory, key–value cache to store recurrent requests and improve response time.

  More information about [Redis](https://redis.io/)

- JSON Web Token(JWT):

  JSON Web Token is an open standard (RFC 7519) that encrypts and protects sensitive data for securely transmitting it between parties as a JSON object.

  More information about [JSON Web Token](https://jwt.io/)

- Helmet:

  Helmet helps you secure your Express apps by setting various HTTP headers.

  More information about [Helmet](https://helmetjs.github.io/)

- Swagger-ui-express:

  We use this package to create and render the dynamic API documentation.

  More information about [Swagger - ui - express](https://www.npmjs.com/package/swagger-ui-express).

- Js-yaml:
  Parser/writer to create .yaml/.yml files with JavaScript

  More information about [js-yaml](https://www.npmjs.com/package/js-yaml).

#### Install using npm:

```
npm i express mongoose redis jsonwebtoken helmet swagger-ui-express js-yaml --save
```

## Server initialization

Once the packages are installed, our server will be ready to be started with the command:

```
npm start
```

To access the API documentation in Swagger and test its functionalities, visit [http://localhost:3000/api/v1/api-docs](http://localhost:3000/api-docs)

## Aclaration

The JSON Web Token generated after sign-up and login is stored in a cookie so in order to access the full functionalities of the API in Swagger you need to pass _just_ the JWT in the **Authorization** header:
