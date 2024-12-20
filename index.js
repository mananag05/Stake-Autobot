const axios = require("axios");
require('dotenv').config();
const getProfile = require("./controllers/getProfile")
const ConnectToMongo = require("./configs/connectdb");
ConnectToMongo(process.env.MONGO_CONNECTION_STRING)
const diceGame =  require("./controllers/dice");
const realDice = require("./controllers/realDice");

let virtualProfile;

async function getVirtualProfile(){
  const profile = await getProfile();
  virtualProfile = profile;
}



// diceGame()
realDice()
































// const DEFAULT_AMOUNT = 0.0;  // STARTING REAL BET AMOUNT (should be 0 or == VIRTUAL_AMOUNT) (0.1 recommended)
// const VIRTUAL_AMOUNT = 0.01; // STARTING VIRTUAL BET AMOUNT (if betting real money, then should be == DEFAULT_AMOUNT)
// const MAX_LOSS = 1.0 // MAX_LOSS


// const testFunction = async (VirtualProfile,VIRTUAL_AMOUNT,MAX_LOSS) => {
//   try {
//     const response = await sendRequest(VIRTUAL_AMOUNT);
//   } catch (error) {
//     console.log("error" , error)
//   }
// }

// getVirtualProfile().then(() => testFunction(virtualProfile,VIRTUAL_AMOUNT,MAX_LOSS));



































// getVirtualProfile().then(() => main());

// async function main() {
//   let virtualBalance = virtualProfile.balance;
//   let virtualCurrentLoss = 0.0;
//   let virtualBetAmount = VIRTUAL_AMOUNT;
//   let actualBetAmount = DEFAULT_AMOUNT;

//   while (true) {
//     console.log(`Betting ${virtualBetAmount} with balance ${virtualBalance}`);
//     try {
//       const response = await sendRequest(actualBetAmount);
//       if (response && response.diceRoll) {
//         const result = response.diceRoll.state.result;
//         if (result < 50.5) {
//           console.log('Lost');
//           virtualBalance -= virtualBetAmount;
//           virtualCurrentLoss += virtualBetAmount;
//           virtualBetAmount *= 2;
//           actualBetAmount *= 2;
//         } else {
//           console.log('Won');
//           virtualBalance += virtualBetAmount;
//           virtualBetAmount = VIRTUAL_AMOUNT;
//           actualBetAmount = DEFAULT_AMOUNT;
//         }

//         if (virtualCurrentLoss >= MAX_LOSS) {
//           virtualBetAmount = VIRTUAL_AMOUNT;
//           actualBetAmount = DEFAULT_AMOUNT;
//           virtualCurrentLoss = 0.0;
//         }
//       } else {
//         console.log('Invalid response structure', response);
//       }

//       await new Promise((resolve) => setTimeout(resolve, 1000));
      
//     } catch (e) {
//       console.log('Error occurred:', e);
//     }
//   }
// }

