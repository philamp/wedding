require('dotenv').config();
var ses = require('node-ses');
const { makeQueryRunner } = require("./queryRunner.js");

let res;

let rawMessage;

let daysText;

// take family datas 10 by 10

async function getFamilyData() {
  try{
    const runner = await makeQueryRunner(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      process.env.DB_SCHEMA,
    );
  
    const result = await runner.query(
      `query MyFamilyQuery {
        allFamilies(condition: {cocktailAttending: true}, first: 100, offset: 0) {
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
      if(person.attending){
      firstnames += person.firstName + ", "
      }
    })

      

    daysText = item.dayOfArrival == "vendredi" ? "la veille, le vendredi 19 août" : "le samedi 20 août"


    var CRLF = '\r\n'


    rawMessage = [
      //'From: "Helene et Philippe" <philippe@mail.helenephilippe.ch>',
      `To: "${item.familyName}" <${item.emailAddress}>`,
      //`Reply-to: "Monsieur Gaultier" <phil.gaultier@gmail.com>`,
      `Subject: Mariage Helene et Philippe le 20 août ${item.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0 ? ' / + Logement (Important!)' : ''} `,
      //'Content-Type: text/plain; charset="utf-8"',
      //'MIME-Version: 1.0',
      '',
      `Bonjour ${firstnames}`,
      '',
      `Notre mariage approche très vite et nous sommes heureux de vous retrouver pour cette occasion ! ${item.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0 ? 'Vous avez un(des) logement(s) sur le domaine du château et vous arrivez '+daysText+', vous pourrez avoir tous les détails de ce(s) logement(s) sur le site https://www.helenephilippe.ch/#/L/'+item.passWord+'/M/logements .' : ''}`,
      `${!item.freeBooking && item.bookingsByFamilyId.nodes.filter(arg => arg.bookingState == "accepted").length > 0 ? '(mode et montant de contribution indiqué sur le site)' : ''}`,
      '',
      `Rappel des lieux et horaires sur ce lien https://www.helenephilippe.ch/#/L/${item.passWord}/M/program .`,
      '',
      'Hélène & Philippe.',
      '',
      ''
    ].join(CRLF)

    console.log(rawMessage);

  /*
    client = ses.createClient({ key: process.env.SES_KEY, secret: process.env.SES_secret});
  
  // Give SES the details and let it construct the message for you.

  //attention ajouter la CONDITION COCKTAIL ATTENDING TRUE DANS LE GRAPHQL !!!


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
      //console.log(err);
      //console.log(res);
  }); 

  */
  
  
  })











  
  }

  catch(e){
    console.error(e)
  }

}



getFamilyData()






