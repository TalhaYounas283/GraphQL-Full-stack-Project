const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const rootResolver = require("./graphql/index.resolver");
const authMiddleware = require("./middleware/authmiddleware");
const app = express();

app.use(bodyParser.json());
app.use((req,res,next)=>{
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers','Content-Type,Authorization')
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next()
})

app.use(authMiddleware)
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: rootResolver,
    graphiql: true,
  }),
);

module.exports = app;