require('dotenv').config();
var ses = require('node-ses');
const { makeQueryRunner } = require("./queryRunner.js");

let res;

// take family datas 10 by 10

async function getFamilyData() {
  try{
    const runner = await makeQueryRunner(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_SCHEMA,
    );
  
    const result = await runner.query(
      `query MyFamilyQuery {
        allFamilies(condition: {}, first: 1, offset: 0) {
          nodes {
            passWord
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
                  geoloc {
                    x
                    y
                  }
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
    );


  //console.log(JSON.stringify(result, null, 2));
    //console.log(result)
  await runner.release();
  //res = result;


  result.data.allFamilies.nodes.forEach((item) => {

    console.log(item.familyName);

    let firstnames = ""

    item.peopleByFamilyId.nodes.forEach((person) => {

      firstnames += person.firstName + ", "
    })

      

    


    var CRLF = '\r\n'
    , client = ses.createClient({ key: process.env.SES_KEY, secret: process.env.SES_secret});
  
  // Give SES the details and let it construct the message for you.

  //attention ajouter la CONDITION COCKTAIL ATTENDINGTRUE DANS LE GRAPHQL !!!
  
  client.sendRawEmail({
     from: 'philippe@mail.helenephilippe.ch'
   , rawMessage: [
      'From: "Helene et Philippe" <philippe@mail.helenephilippe.ch>',
      `To: "${item.familyName}" <phil.gaultier@gmail.com>`,
      `Reply-to: "Monsieur Gaultier" <phil.gaultier@gmail.com>`,
      `Subject: Mariage Helene et Philippe / encore dans l'onglet pourri ?`,
      'Content-Type: text/plain; charset="utf-8"',
      'MIME-Version: 1.0',
      '',
      `Bonjour ${firstnames}`,
      '',
      `Notre mariage arrive bientot ! Vous avez un logement et vous arrivez le 19 aout vous pourrez avoir tous les détails (ainsi que le mode de contribution) sur le site https://www.helenephilippe.ch/#/L/${item.passWord}/M/hotels`,
      '',
      'Hélène & Philippe.',
      '',
      ''
    ].join(CRLF)
  }, function (err, data, res) {
      console.log(err);
      console.log(res);
  });
  
  
  })











  
  }

  catch(e){
    console.error(e)
  }

}



getFamilyData()






