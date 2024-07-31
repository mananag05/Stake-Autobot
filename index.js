const axios = require("axios");
require('dotenv').config();
const getProfile = require("./controllers/getProfile")

const ConnectToMongo = require("./configs/connectdb")
ConnectToMongo(process.env.MONGO_CONNECTION_STRING)

const cookie = `your_cookie`; // change

async function sendRequest(amount){
  const response = await axios({
    method: "post",
    url: "https://stake.com/_api/graphql",
    headers: {
      accept: "*/*", 
      "accept-language": "en-US,en;q=0.5", 
      "content-type": "application/json",
      cookie: cookie, 
      origin: "https://stake.com", 
      priority: "u=0",
      referer: "https://stake.com/casino/games/dice", 
      "TE": "Trailers", 
      "sec-fetch-dest": "empty", 
      "sec-fetch-mode": "cors", 
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0", // change
      "x-access-token": "f915366d2a7a446a8d6962e98e419912144494206fa8a15694a2c0cc657de9765c7210d1490b89955cb3d7736153c896", // change
      "x-lockdown-token": "s5MNWtjTM5TvCMkAzxov", // change
    },
    data:
      `{"query":"mutation DiceRoll($amount: Float!, $target: Float!, $condition: CasinoGameDiceConditionEnum!, $currency: CurrencyEnum!, $identifier: String!) {\\n  diceRoll(\\n    amount: $amount\\n    target: $target\\n    condition: $condition\\n    currency: $currency\\n    identifier: $identifier\\n  ) {\\n    ...CasinoBet\\n    state {\\n      ...CasinoGameDice\\n    }\\n  }\\n}\\n\\nfragment CasinoBet on CasinoBet {\\n  id\\n  active\\n  payoutMultiplier\\n  amountMultiplier\\n  amount\\n  payout\\n  updatedAt\\n  currency\\n  game\\n  user {\\n    id\\n    name\\n  }\\n}\\n\\nfragment CasinoGameDice on CasinoGameDice {\\n  result\\n  target\\n  condition\\n}\\n","variables":{"target":50.5,"condition":"above","identifier":"uix6CkiHQqTnDNYHZXt8T","amount":` +
      amount +
      `,"currency":"inr"}}`, // change
  });

  return response.data.data;
}

let virtualPorfile;

async function getVirtualProfile(){
  const profile = await getProfile();
  virtualPorfile = profile;
}

getVirtualProfile().then(() => main());

const DEFAULT_AMOUNT = 0.0;  // STARTING REAL BET AMOUNT (should be 0 or == VIRTUAL_AMOUNT) (0.1 recommended)
const VIRTUAL_AMOUNT = 0.01; // STARTING VIRTUAL BET AMOUNT (if betting real money, then should be == DEFAULT_AMOUNT)
const MAX_LOSS = 1.0 // MAX_LOSS


async function main() {
  let virtualBalance = virtualPorfile.balance;
  let virtualCurrentLoss = 0.0;
  let virtualBetAmount = VIRTUAL_AMOUNT;
  let actualBetAmount = DEFAULT_AMOUNT;

  while (true) {
    console.log(`Betting ${virtualBetAmount} with balance ${virtualBalance}`);
    try {
      const response = await sendRequest(actualBetAmount);
      if (response && response.diceRoll) {
        const result = response.diceRoll.state.result;
        if (result < 50.5) {
          console.log('Lost');
          virtualBalance -= virtualBetAmount;
          virtualCurrentLoss += virtualBetAmount;
          virtualBetAmount *= 2;
          actualBetAmount *= 2;
        } else {
          console.log('Won');
          virtualBalance += virtualBetAmount;
          virtualBetAmount = VIRTUAL_AMOUNT;
          actualBetAmount = DEFAULT_AMOUNT;
        }

        if (virtualCurrentLoss >= MAX_LOSS) {
          virtualBetAmount = VIRTUAL_AMOUNT;
          actualBetAmount = DEFAULT_AMOUNT;
          virtualCurrentLoss = 0.0;
        }
      } else {
        console.log('Invalid response structure', response);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      
    } catch (e) {
      console.log('Error occurred:', e);
    }
  }
}

