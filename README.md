# tasty-api

An api for the tasty repository

## Similar Example for MySQL RESTful API

RESTful service power most any website today that receives and trasmits data via HTTP or HTTPS protocol. What you'll find below is what's used from express to run a simple set of Create, Read, Update, and Delete (CRUD) methods.

Only the bare essentials are used to create the API service, and only the feature used by express and mongoose (mysql client) will be explained in this documentation guide.

_Caveats: Running this app assumes you have a working mysql instance preinstalled on you machine_

## What you'll find

| Direcotry   | Description                                           |
| ----------- | ----------------------------------------------------- |
| queries     | Queries for data to be used in mysql.                 |
| controllers | Functions to be bound and executed on routes.         |
| routes      | A series of routes for handling HTTP requests.        |
| middleware  | Other helful functions necessary for running the app. |

### First Time Running

After you've cloned the project, you'll need to have a database created in mysql called tododb.

## MySQL Setup and Installation

In order to run the the mysql server, you need an installation of mysql with root access.

1. First install [Homebrew](https://brew.sh/).

2. Then...

```bash
brew install mysql
```

3. Give access right to `root@localhost`.

```bash
mysql -u root -e "ALTER USER root@localhost IDENTIFIED WITH mysql_native_password BY 'password'; FLUSH PRIVILEGES;"
```

**NOTE: once configured, move onto the next steps.**

## Setup and Install

1. Install all packages:

```bash
npm install
```

2. Spin up the mysql instance:

```bash
mysqld
```

3. Run server instance:

```bash
npm start
```

## MySQL Shell

Running the shell allows you to directly manage you databases and collections. _This is for advanced use and shouldn't be used without looking at the documentation or googling further instructions._

In one terminal:

```bash
mysqld

# to stop the service
lsof -i:3306

# this will show all running processes
# copy the process id
kill -9 <paste_process_id_here>
```

In another terminal window/tab:

```bash
mysql
# clost the shell with
quit # or exit
```

### Create a Database

Before running you server you'll need a database. For this project, run the following in the mysql shell:

```bash
mysql> CREATE DATABASE tododb;
```

Note: the ending semicolon is important to end all statements.

## Schemas

In mysql, Schemas represent how the data will be presented in the database. The Schema is normally defined when creating the database for the first time. In this server's case:

```sql
CREATE TABLE IF NOT EXISTS tasks(
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  created_date DATETIME DEFAULT CURRENT_TIMESTAMP(),
  status varchar(10) DEFAULT 'pending',
  PRIMARY KEY (id)
);
```

The above example is known as SQL as can be exported in javascript and imported wherever we need it.

```javascript
// tasks.queries.js
exports.CREATE_TASKS_TABLE = `CREATE TABLE IF NOT EXISTS tasks(...)`;

// tasks.controller.js
const queries = require("path/to/queries");
con.query(queries.CREATE_TASKS_TABLE, params, callback);
```

## Routes

Routes help direct what an `endpoint` should do. In RESful services, `endpoints` are the full url of a given API at a specific address in that API. For example: `http://localhost:3000/api/tasks` is a RESTful `endpoint`. Pointing my browser at this address (assuming the server is live) will give me results if a route exists and has a [controller method](#controllers) attached.

Express routes are defined by either one of these:

```javascript
const app = express();
app.use('routePath').get((req, res) => { ... });

// or

const router = express.Router();
router.get('routePath', (req, res) => { ... });
```

## Controllers

Controller help build up routes by providing some level of functionality to a specified route. It's also key to note that there are different kinds of controllers. Like in MVC patterns, controllers effect how data is displayed or what happens on click events. When defining APIs, controllers can have nested functionality, control/manipulate data flow to the next controller, or access a database, in our case, and more.

Since these are really just functions, we don't need anything special from express to implement them. We just need to make sure that our function signature matches correctly to where we intend to use it:

```javascript
exports.addTask = (req, res) => { ... } // function signature: (req, res) => {}
```

### Middleware

Middleware is a kind of controller or function that controls the behaviour of a `request` or `response` within a server instance. These can be chained and used to modify anything about a request or response before.

#### Error-handling Middlware Functions

We have the freedom to define what we want in our APIs, and error-handling is no exception. Error-handling controllers/functions follow a specific syntax that express recognizes:

```javascript
// notice the `err` parameter before `req` and `res`
exports.errorHandler = (err, req, res) => { ... }
```

## Troubleshooting Notes

If you don't have the database for running this project created already, mysql WIL NOT create this for you unless you configure it to.

For example:

```javascript
// index.js
const mysql = require('mysql');
...

const con = mysql.createConnection({
  host,
  user,
  password
});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');

  // tododb becomes the creted database upon connection if one doesn't exist
  con.query(`CREATE DATABASE tasks`, function(err, result) {
    if (err) throw err;
    console.log('Database created or exists already!');
  });

  // this is also true for tables
  con.query(queries.CREATE_TASKS_TABLE, function(err, result) {
    if (err) throw err;
    console.log('Table created or exists already!');
  });
});
```

## FUNCTIONALITY

### DB Structure

<img width="400" alt="tableCreation" src="https://github.com/dalamo20/viva-ventura/assets/35320043/014f2d2a-9f2d-4d10-ab1b-c7b9049981e2">

- Before running 'npm start', database 'bardb' had to be created.
- The tables 'drinks' and 'orders' are then created in the 'bardb' database (see below).  
  <img width="377" alt="dbView" src="https://github.com/dalamo20/viva-ventura/assets/35320043/69486f07-e9b0-4ab2-917f-e3339818d097">

### CREATE

<img width="1680" alt="createOrder" src="https://github.com/dalamo20/viva-ventura/assets/35320043/0ca46582-488f-4eac-8b23-0d1c23a603ba">

- Here is a successful order in postman on the right side.
- Drink with id #1 was ordered, with a quantity of 2 and the total price is calculated by multiplying the quantity with the price of the drink item.

### READ

<img width="1143" alt="getAllDrinks" src="https://github.com/dalamo20/viva-ventura/assets/35320043/5ffc87e2-dd1a-44f6-86fb-8d1e22764998">

- This is a successful GET response in Postman. As you can see the 2 drink items I have created in mysql.

### UPDATE

<img width="1147" alt="update1" src="https://github.com/dalamo20/viva-ventura/assets/35320043/3c83962e-fcd2-4c9f-bb5d-9961467b1b95">

- Before, I READ in my GET response that I created a wine listing at 18.00. Here I am updating that to 16.00.
- In my url, I target the 2nd drink id (/drinks/2) and in the body I would change the name and price.

### DELETE

<img width="1137" alt="orderDeleted" src="https://github.com/dalamo20/viva-ventura/assets/35320043/7db46386-74a9-4d3e-9682-7cdfbb8147ca">

- In my params, I include the ID of the order I would like deleted (/orders/3).
- A response message then indicates that the deletion was successful.
- This can also be confirmed by using a GET on all orders (/orders).

## AUTHENTICATION

### REGISTER USER

<img width="547" alt="userRegistered" src="https://github.com/dalamo20/viva-ventura/assets/35320043/18be35d3-c049-4467-904d-5c771ad80611">

- I am doing a POST to my new user table where I pass username, password, and email into the body.

### USER IN DB

<img width="710" alt="getUser" src="https://github.com/dalamo20/viva-ventura/assets/35320043/8f099893-ba0f-44e0-9e09-6025c6f47dde">

- Here is a quick view of the bardb database with the new user added.
- The password is encrypted thanks to the bcrypt library.

### LOGIN

<img width="534" alt="loginToken" src="https://github.com/dalamo20/viva-ventura/assets/35320043/b7a4ff53-8b54-429e-836f-8220d5a62d1f">

- Using a POST request with a different endpoint (/api/login), I pass in the body the username and password.
- If successful, a token should be returned as seen in the image above and thanks to the jasonwebtoken library.

### READ USER

<img width="513" alt="getUserWToken" src="https://github.com/dalamo20/viva-ventura/assets/35320043/fb528c5e-1a12-487e-89d0-6db87f3d78c5">

- In this GET request, I am only adding the 'auth-token' header as the key and then passing in the value of the auth-token from the above login.

### UPDATE USER

<img width="388" alt="userUpdate1" src="https://github.com/dalamo20/mysql-api/assets/35320043/42eefd77-7dfb-4f6c-a9a0-3e65bc10b156">

- To update the user, I perform a POST in postman to endpoint '/api/user/update'.
- I use the same auth-token header from the GET request login.
- I then include in the body the fields I am changing with new values.
- I can then perform another GET in postman to view my changes or view the changes directly in my database.

### DELETE USER

<img width="429" alt="deleteUser" src="https://github.com/dalamo20/mysql-api/assets/35320043/e908cf0b-c638-48d8-872d-229b95bee1a4">

- In postman I am performing a POST to endpoint '/api/user/delete'.
- This request only accepts auth-token header of the current logged in user.
- When I do another GET on my user (see below), the array is now empty.

<img width="429" alt="deleteUser" src="https://github.com/dalamo20/mysql-api/assets/35320043/e91d3fd6-67c5-4ebc-9912-459813801450">

### FRONTEND CONNECTION

<img width="1680" alt="fullstack" src="https://github.com/dalamo20/mysql-api/assets/35320043/a1a22912-bbc6-46dd-a3c3-daccff5f90a7">

- Here I am showing a connection from my frontend application with my backend server.
- Upon a successful registration, the database (highlighted on the right of the image) in the console shows that I was able to add a user (user1).
- With this new user, I was returned to the login page, entered username and password that I just created and logged in.
- I am then redirected to the home page.

### UNIT TESTING

<img width="1680" alt="mochaChai" src="https://github.com/dalamo20/viva-ventura/assets/35320043/d033474b-c085-4688-9765-8269b15f2f5e">

- Here I am demonstrating working unit tests using mocha framework with chai library.
- I'm also showing that I had to install an older version of chai that was compatible with the current ESM.
