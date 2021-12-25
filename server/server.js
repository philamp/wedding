require('dotenv').config();

const express = require('express');
const { postgraphile } = require("postgraphile");
const { makeQueryRunner } = require("./queryRunner.js");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

const app = express();

app.use(
  postgraphile(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    process.env.DB_SCHEMA,
    {
      watchPg: true,
      graphiql: true,
      enhanceGraphiql: true,
    }
  )
);

/* change schema important !!! */

app.listen(3000);

async function getAuth(req, res) {

  try{
  const runner = await makeQueryRunner(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    process.env.DB_SCHEMA
  );

  const result = await runner.query(
    `query MyCookieQuery ($password: String!) {
      allFamilies(condition: {passWord: $password}) {
        nodes {
          familyId
        }
      }
    }`
    
    
    ,
    { password: req.QRValueSvelte }
  );


console.log(JSON.stringify(result, null, 2));

await runner.release();
  result.jwt = jwt.sign({ family_id: result.data.allFamilies.nodes[0].familyId}, process.env.HASH, {})

/* enlever jwt de l'object result !!! y'en a pas besoin il est dans le cookie*/

if(result.data.allFamilies.nodes){
  res.cookie("jwt", result.jwt, {maxAge: 90000000, httpOnly: false, secure: false})
  res.json(result)
}else{
  res.json({ error : "Le code est inconnu"})
}

}

catch(e){
  console.error(e); res.json({ error : "erreur connexion graphql"})
}

}



  // get family data -------------------------
  async function getFamilyData(req, res) {
    if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
    let decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)

    let family_id = decoded.family_id
    
    try{
    const runner = await makeQueryRunner(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_SCHEMA,
    );
  
    const result = await runner.query(
      `query MyFamilyQuery ($familyid: Int!) {
        allFamilies(condition: {familyId: $familyid}) {
          nodes {
            familyId
            familyName
            cocktailAttending
            dinerAttending
            emailAddress
            phone
            phoneCountryCode
            guestLevel
            peopleByFamilyId {
              nodes {
                reverseCocktailAttending
                reverseDinerAttending
                foodRemarks
                gender
                lastName
                nodeId
                ageRange
                firstName
                attending
              }
            }
            
          }
        }
      }`
      
      
      ,
      { familyid: family_id }
    );


  console.log(JSON.stringify(result, null, 2));
  
  await runner.release();
  
  
  for(let i = 0; i < result.data.allFamilies.nodes[0].peopleByFamilyId.nodes.length; i++ ){
    result.data.allFamilies.nodes[0].peopleByFamilyId.nodes[i].nodeId = jwt.sign(result.data.allFamilies.nodes[0].peopleByFamilyId.nodes[i].nodeId, process.env.HASH, {})
  }

  res.json(result)
  
  }

  catch(e){
    console.error(e); res.json({ error : "erreur connexion graphql"})
  }

}

// push family data -------------------------

async function pushFamilyData(req, res) {
  if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
  let decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)

  let family_id = decoded.family_id

  let familyData = req.body
  
  // push family data

  try{
  const runner = await makeQueryRunner(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    process.env.DB_SCHEMA,
  );


  /* constrain postgre à faire pour empecher un dinerAttending true si guestlevel < 2  !!!! */
  const result = await runner.query(
    `mutation MyFamilyMutation 
    (
      $cocktailAttending: Boolean!
      $dinerAttending: Boolean!
      $emailAddress: String
      $phone: String
      $phoneCountryCode: String
      $familyid: Int!
    )
    {
      updateFamilyByFamilyId(
        input: {
          familyPatch: {
            cocktailAttending: $cocktailAttending
            dinerAttending: $dinerAttending
            emailAddress: $emailAddress
            phone: $phone
            phoneCountryCode: $phoneCountryCode
          }
          familyId: $familyid
        }
      ) {
        clientMutationId
      }
    }`
    ,
    { 
      ...familyData,
      familyid: family_id
    }
  );


  console.log(JSON.stringify(result, null, 2));


    /* boucler sur les nodes */
    // sur le front rendre les champs non nullables !!!!

  for(let i = 0; i < familyData.peopleByFamilyId.nodes.length; i++){
    personData = familyData.peopleByFamilyId.nodes[i]
    
    let resultPerson = await runner.query(
      `
      mutation MyPersonMutation 
        (
          $nodeId: ID!
          $ageRange: String!
          $firstName: String!
          $lastName: String!
          $foodRemarks: String
          $attending: Boolean!
        )
        {
          updatePerson(
            input: {
              nodeId: $nodeId
              personPatch: {
                ageRange: $ageRange
                firstName: $firstName
                lastName: $lastName
                foodRemarks: $foodRemarks
                attending: $attending
              }
            }
          ){
            clientMutationId
          }
        }
      
      `,
      {
        ...personData,
        nodeId: jwt.verify(personData.nodeId, process.env.HASH) 
      }
    )

    console.log(JSON.stringify(resultPerson, null, 2));
  }


  await runner.release();


  

  //fin try
  }

  catch(e){
  console.error(e); res.json({ error : "erreur push graphql"})
  }

  res.json({error : false})

}

app.post('/api/auth', bodyParser.json(), (req, res) => {
  console.log(req.body)
  getAuth(req.body, res)
});

app.get('/api/familydata', cookieParser(), (req, res) => {
  console.log("une requete GET family a été envoyé")
  getFamilyData(req, res)
});

app.post('/api/pushfamilydata', bodyParser.json(), cookieParser(), (req, res) => {
  console.log("une requete POST formValues a été envoyé")
  console.log(req.body)
  pushFamilyData(req, res)
  //res.json({ error : false})
});

/* changer le secure en true !!! */

/*
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
*/
