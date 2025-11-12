# Heart of NY Interactive Map

> An interactive map web app built with Leaflet.js, Node.js, and Express, displaying New York counties and their associated historical societies.

This map allows users to explore different counties visually and view information fetched dynamically from a PostgreSQL database.

It consists of two main parts:

1. A simple, static HTML + JavaScript page that:
    - Loads county GeoJSON data and overlays it on an OpenStreetMap base layer.
    - Fetches county and society information from the API.
    - Displays the interactive map and dynamic info panels when a user clicks a county.

2. A Node.js + Express REST API that:
    - Serves county and society data from a PostgreSQL database
    - Also serves the static front end files in production

## Setup & Installation

### 1. Requirements

- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (or another package manager)
- Access to the PostgreSQL database

### 2. Install Dependencies

With npm, run this command from within the project directory:

```console
$ npm install
```

### 3. Configure Environment Variables

You will need to create a `.env` file in the project's root directory. This holds all of the environment variables, which are potentially sensitive configuration settings (e.g., database credentials).

Here is a sample `.env` file containing all the variables that need to be specified:

```env
SERVER_ADDRESS=http://localhost
SERVER_PORT=3000

PG_HOST=******
PG_DBNAME=******
PG_USER=******
PG_PASSWORD=******
PG_PORT=******
```

### 4. Run the Server

Now you can run the server with the following command:

```console
$ npm start
```

Then, open your browser to the address and port you specified (e.g., http://localhost:3000), and you should see the interactive map.

## How It Works

On startup, the Express server connects to the PostgreSQL database and exposes:
- `/api/counties` (returns all counties in the database)
- `/api/societies` (returns all historical societies)

The front end loads a GeoJSON file of New York counties and filters it based on available database data.

When a user clicks a county, the app displays that county’s name and linked historical society information in a side panel.
