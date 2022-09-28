"use strict";

const { Pool } = require("pg");

const pool = new Pool({
  /*user: "ocikvalwxfuehj",
  password: "bd2772486be2014abdcb68b64ca05c20defe7059d3d39df0b4529d1c8b4dcb8b",
  database: "d8hqj7ib642oio",
  host: "ec2-54-75-184-144.eu-west-1.compute.amazonaws.com",
  port: 5432,
  ssl: { rejectUnauthorized: false }*/
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "task5",
  port: 5432
});

module.exports = pool;
