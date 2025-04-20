#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
CREATE TABLE manufacturers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE cars (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  top_speed INTEGER,
  acceleration DECIMAL(5,2),
  manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id) ON DELETE NO ACTION,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE NO ACTION
);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString:
      "postgresql://<role_name>:<role_password>@localhost:5432/top_users",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
