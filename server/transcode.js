require('dotenv').config();


// prealable : pushs de upload avec transcoded 0,1,2



// select all ((idéee pas bonne = mutation transforme les 0 en 1) renvoie la liste a transcoder

// each element
  // element passe de 0 à 1
  // ffmpeg execsync ......
  // envoi du file n quesiton sur s3 via bash
  // rm local file
    // mutaiton pour tel family id ca passe de 1 à 2






const { postgraphile } = require("postgraphile");
const { makeQueryRunner } = require("./queryRunner.js");


const {S3Client,PutObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
var crypto = require("crypto");


const app = express();

if(process.env.NODE_ENV == "dev"){
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
}

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

if(result.data.getAuth.family){
  result.jwt = jwt.sign({ family_id: result.data.getAuth.family.familyId, pass_word: result.data.getAuth.family.passWord}, process.env.HASH, {})
  res.cookie("jwt", result.jwt, {maxAge: 604800000, httpOnly: false, secure: false})
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
    let decoded
    if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
    try{
    decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)
    }
    catch(e){
      res.clearCookie("jwt")
      res.json({error: "cookie cassé", cookieError: true})
      return
    }

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
            guestLevel
            formStep
            signingImgUrl
            signing
            signingOnWeb
            signingOnScreen
            freeBooking
            dayOfArrival
            
            peopleByFamilyId {
              nodes {
                foodRemarks
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
                  maxDays
                  oneNightPrice
                  twoNightPrice
                }
                bookingId
                bookingState
                familyId
                roomId
                nodeId
                updatedAt
              }
            }

            toolBookingsByFamilyId {
              nodes {
                toolByToolId {
                  toolName
                  toolId
                  quantity
                  price
                  toolType
                  nodeId
                }
                bookingState
                familyId
                toolBookingId
                nodeId
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
  
  //if formstep 0, set 1 
  if(result.data.allFamilies.nodes[0].formStep == 0){
    setFirstAccess(family_id)
  }

  res.json(result)
  
  }

  catch(e){
    console.error(e); res.json({ error : "erreur connexion graphql"})
  }

}

async function setFirstAccess(fmid){

  try{
    const runner = await makeQueryRunner(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_SCHEMA,
    );
  
    const result = await runner.query(
      `
      mutation MyMutation ($family_id: Int!) {
        updateFamilyByFamilyId(
          input: {
            familyPatch: {
              formStep: 1
            }, 
            familyId: $family_id
          }
        )
        {
          clientMutationId  
        }
      }
      `
      ,{family_id: fmid}
    );


  console.log(JSON.stringify(result, null, 2));  
  await runner.release();
  
  }

  catch(e){
    console.error(e);
  }

}



// get toools data

// encode nodeID for tool

async function getTools(req, res){

  let decoded
  if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
  try{
  decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)
  }
  catch(e){
    res.clearCookie("jwt")
    res.json({error: "cookie jwt cassé", cookieError: true})
    return
  }

  try{
    const runner = await makeQueryRunner(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_SCHEMA,
    );
  
    const result = await runner.query(
      `query MyToolsQuery {
        allViewAvailableTools {
            nodes {
              toolId
              toolName
              remaining
              quantity
              taken
              price
              toolType
            }
        }
      }
      `

    );


  console.log(JSON.stringify(result, null, 2));  
  await runner.release();
  res.json(result)
  
  }

  catch(e){
    console.error(e); res.json({ error : "erreur connexion graphql"})
  }

}













// push createBookingTooldata ------

async function pushToolBookingsData(req, res) {
  let decoded
  if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
  try{
  decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)
  }
  catch(e){
    res.clearCookie("jwt")
    res.json({error: "cookie jwt cassé", cookieError: true})
    return
  }
  let family_id = decoded.family_id

  let toolBookingData = req.body
  let result;

  

  try{
    const runner = await makeQueryRunner(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_SCHEMA,
    );

    if(toolBookingData.toolBookingId){
      console.log("UPDATE MODE");

      result = await runner.query(
        `mutation MyMutation(
          $toolBookingId: Int!
          $bookingState: String!
        ) {
          updateToolBookingByToolBookingId(
            input: {
              toolBookingPatch: { bookingState: $bookingState }
              toolBookingId: $toolBookingId
            }
          ) {
            clientMutationId
          }
        }`
        ,
        { 
          toolBookingId: toolBookingData.toolBookingId,
          bookingState: toolBookingData.bookingState
        }
      );
      
      
 
      res.json({ error : false})




    }else{
      console.log("INSERT MODE");

      result = await runner.query(
        `mutation MyMutation(
          $familyid: Int!
          $toolId: Int!
          $bookingState: String!
          ) {
          makeToolBookingv4(
            input: {
              bookingStateSubmitted: $bookingState
              familyIdSubmitted: $familyid
              toolIdSubmitted: $toolId
            }
          ) {
            toolBooking {
              toolBookingId
            }
          }
        }`
        ,
        { 
          familyid: family_id,
          toolId: toolBookingData.toolByToolId.toolId,
          bookingState: toolBookingData.bookingState
        }
      );
    
    
      console.log(JSON.stringify(result, null, 2));
  
      
      if(result.data.makeToolBookingv4.toolBooking == null){res.json({error: true})}else{res.json(result)}
    }



    await runner.release();
    //fin try
    }

    catch(e){
      console.error(e); res.json({ error : true});return
      }
    
  




}














// push family data -------------------------

async function pushFamilyData(req, res) {
  let decoded
  if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
  try{
  decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)
  }
  catch(e){
    res.clearCookie("jwt")
    res.json({error: "cookie jwt cassé", cookieError: true})
    return
  }

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
  /* ou le faire ici !!! */
  const result = await runner.query(
    `mutation MyFamilyMutation 
    (
      $cocktailAttending: Boolean!
      $dinerAttending: Boolean
      $moderated: Boolean
      $emailAddress: String
      $phone: String
      $familyid: Int!
      $formStep: Int
      $dayOfArrival: String
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
            dayOfArrival: $dayOfArrival
            moderated: $moderated
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
      familyid: family_id,
      moderated: false
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

    // un cocktailattending false -> booking refused
    bookingData.bookingState = familyData.cocktailAttending == false ? "refused" : bookingData.bookingState
    
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
  console.error(e); res.json({ error : "erreur push graphql"}); return
  }

  res.json({error : false})

}


// a finir !!!

async function pushFileData(req, res) {
  let decoded
  if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
  try{
  decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)
  }
  catch(e){
    res.clearCookie("jwt")
    res.json({error: "cookie jwt cassé", cookieError: true})
    return
  }

  let family_id = decoded.family_id

  let fileData = req.body

  console.log(fileData)


  try{
  const runner = await makeQueryRunner(
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
    process.env.DB_SCHEMA,
  );

  const result = await runner.query(
    `mutation MyFileMutation 
    (
      $familyid: Int!
      $signingImgUrl: String
      $moderated: Boolean
      $signing: String
      $signingOnWeb: Boolean
      $signingOnScreen: Boolean
    )
    {
      updateFamilyByFamilyId(
        input: {
          familyPatch: {
            signingImgUrl: $signingImgUrl
            signingOnScreen: $signingOnScreen
            signingOnWeb: $signingOnWeb
            moderated: $moderated
            signing: $signing
          }
          familyId: $familyid
        }
      ) {
        clientMutationId
      }
    }`
    ,
    { 
      familyid: family_id,
      moderated: false,
      ...fileData
    }
  );


  console.log(JSON.stringify(result, null, 2));


  await runner.release();


  

  //fin try
  }

  catch(e){
  console.error(e); res.json({ error : "erreur push graphql"}); return
  }

  res.json({error : false})

}


const signS3URL = async (req, res, next) => {


  let decoded
  if(!req.cookies['jwt']){res.json({ error : "erreur cookie non fourni"}); return}
  try{
  decoded = jwt.verify(req.cookies['jwt'], process.env.HASH)
  }
  catch(e){
    res.clearCookie("jwt")
    res.json({error: "cookie jwt cassé", cookieError: true})
    return
  }

  let family_id = decoded.family_id


  const { fileName, fileType } = req.body;

  // will be the final name of the file
  let finalKey = crypto.randomBytes(10).toString('hex')+'_'+family_id+'_'+fileName

  const s3Params = {
      Bucket: process.env.S3_BUCKET,
      Key: finalKey,
      ContentType: fileType,
  };
  const s3 = new S3Client({ region: 'eu-west-3' })
  const command = new PutObjectCommand(s3Params);

  try {
      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
      console.log(signedUrl);
      res.json({ signedUrl, fileType, returnedKey: finalKey})
  } catch (err) {
      console.error(err);
      next(err);
  }
}

app.post('/api/upload-signer', bodyParser.json(), cookieParser(), (req, res) => {
  console.log("une requete de signature envoyée")
  console.log(req.body)
  signS3URL(req, res)
});


app.post('/api/auth', bodyParser.json(), (req, res) => {
  console.log(req.body)
  getAuth(req.body, res)
});

app.get('/api/familydata', cookieParser(), (req, res) => {
  console.log("une requete GET family a été envoyé")
  getFamilyData(req, res)
});

app.post('/api/pushfiledata', bodyParser.json(), cookieParser(), (req, res) => {
  console.log("une requete PUSH file data a été envoyée")
  pushFileData(req, res)
});

app.get('/api/tools', cookieParser(), (req, res) => {
  console.log("une requete GET tools a été envoyé")
  getTools(req, res)
});

app.post('/api/pushfamilydata', bodyParser.json(), cookieParser(), (req, res) => {
  console.log("une requete POST formValues a été envoyé")
  console.log(req.body)
  pushFamilyData(req, res)
  //res.json({ error : false})
});

app.post('/api/pushToolBookingsData', bodyParser.json(), cookieParser(), (req, res) => {
  console.log("une requete POST getToolbooking a été envoyé")
  console.log(req.body)
  pushToolBookingsData(req, res)
  //res.json({ error : false})
});

/* changer le secure en true !!! */

/*
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
*/
