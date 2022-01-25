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
    "privateschema",
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
    "public"
  );

  const result = await runner.query(
    `
    mutation MyCookieQuery ($password: String!){
      getAuth(input: {passwordSubmitted: $password}) {
        family {
          familyId
          passWord
        }
      }
    }
    `
    ,
    { password: req.QRValueSvelte }
  );


console.log(JSON.stringify(result, null, 2));

await runner.release();
  

/* enlever jwt de l'object result !!! y'en a pas besoin il est dans le cookie*/

/* rendre le cookie secure !!! SSL */

if(result.data.getAuth.family.familyId){
  result.jwt = jwt.sign({ family_id: result.data.getAuth.family.familyId, pass_word: result.data.getAuth.family.passWord}, process.env.HASH, {})
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
            formStep
            
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

            bookingsByFamilyId {
              nodes {
                roomByRoomId {
                  bedsizes
                  buildingName
                  capacity
                  categoryDescription
                  equipement
                  etage
                  nodeId
                  roomId
                  roomNumber
                }
                bookingId
                bookingState
                familyId
                roomId
                nodeId
                updatedAt
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
  
  // encode the DB identifier for people
  for(let i = 0; i < result.data.allFamilies.nodes[0].peopleByFamilyId.nodes.length; i++ ){
    result.data.allFamilies.nodes[0].peopleByFamilyId.nodes[i].nodeId = jwt.sign(result.data.allFamilies.nodes[0].peopleByFamilyId.nodes[i].nodeId, process.env.HASH, {})
  }

  //encode the DB identifier for bookings and remove the refused ones
  for(let i = 0; i < result.data.allFamilies.nodes[0].bookingsByFamilyId.nodes.length; i++ ){
    result.data.allFamilies.nodes[0].bookingsByFamilyId.nodes[i].nodeId = jwt.sign(result.data.allFamilies.nodes[0].bookingsByFamilyId.nodes[i].nodeId, process.env.HASH, {})
  }
  //remove refused ones
  result.data.allFamilies.nodes[0].bookingsByFamilyId.nodes = result.data.allFamilies.nodes[0].bookingsByFamilyId.nodes.filter((current) => {return current.bookingState != "refused";})
  

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
  // take the intl-tel-version of phone number
  // familyData.phone = familyData.hiddenphone; !!!

  /* constrain postgre à faire pour empecher un dinerAttending true si guestlevel < 2  !!!! */
  const result = await runner.query(
    `mutation MyFamilyMutation 
    (
      $cocktailAttending: Boolean!
      $dinerAttending: Boolean!
      $emailAddress: String
      $phone: String
      $familyid: Int!
      $formStep: Int
    )
    {
      updateFamilyByFamilyId(
        input: {
          familyPatch: {
            cocktailAttending: $cocktailAttending
            dinerAttending: $dinerAttending
            emailAddress: $emailAddress
            phone: $phone
            formStep: $formStep
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


    /* boucler sur les nodes people*/

  for(let i = 0; i < familyData.peopleByFamilyId.nodes.length; i++){
    let personData = familyData.peopleByFamilyId.nodes[i]
    
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


  // boucler sur les bookings

  for(let i = 0; i < familyData.bookingsByFamilyId.nodes.length; i++){
    let bookingData = familyData.bookingsByFamilyId.nodes[i]
    
    let resultBooking = await runner.query(
      `
      mutation MyBookingMutation(
        $nodeId: ID!
        $bookingState: String!
      ) {
        updateBooking(
          input: { 
            nodeId: $nodeId, 
            bookingPatch: { 
              bookingState: $bookingState
            } 
          }
        ) 
        {
          clientMutationId
        }
      }
      
      
      `,
      {
        ...bookingData,
        nodeId: jwt.verify(bookingData.nodeId, process.env.HASH) 
      }
    )

    console.log(JSON.stringify(resultBooking, null, 2));
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
