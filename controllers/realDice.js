const { launch } = require("puppeteer");
const { cookie } = require("../constants/diceConstants");
const readline = require("readline");
const chalk = require('chalk');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let browser, page;
const initBroswer = async () => {
  browser = await launch({
    args: ["--enable-features=NetworkService", "--no-sandbox"],
    ignoreHTTPSErrors: true,
  });
  page = await browser.newPage();
  await page.setRequestInterception(true);
};

let currentData = null

const handleNextBet = (method, data) => {
    let responseData = null;
    if(!data.error){
        responseData = data.data.diceRoll;
        currentData = responseData
    } else {
        responseData = currentData
    }
  if (method) {
    let amountInfoString = null
    const winORlose = responseData.state.result > responseData.state.target ? "WON" : "LOST";
    if (winORlose == "WON"){
        amountInfoString = `[${chalk.green(`[${winORlose}]`)} : ${VirtualBank.currentBetAmount * responseData.payoutMultiplier}] [Balance : ${VirtualBank.balance + VirtualBank.currentBetAmount * responseData.payoutMultiplier}]`
    } else {
        amountInfoString = `[${chalk.red(`[${winORlose}]`)} : ${VirtualBank.currentBetAmount}] [Balance : ${VirtualBank.balance - VirtualBank.currentBetAmount}]`
    }
    
    console.log(`${amountInfoString} [CurrentLS : ${VirtualBank.currentLoseStreak}] [CurrentWS : ${VirtualBank.currentWinStreak}] [HighestLS : ${VirtualBank.highestLoseStreak}] [HighestWS : ${VirtualBank.highestWinStreak}]`);


    if (responseData.state.result > responseData.state.target) {
            VirtualBank.balance += VirtualBank.currentBetAmount * responseData.payoutMultiplier; 
            VirtualBank.currentBetAmount = VirtualBank.initialBetAmount; 
            VirtualBank.currentWinStreak += 1;
            VirtualBank.currentLoseStreak = 0; 
            if (VirtualBank.currentWinStreak > VirtualBank.highestWinStreak) {
                
                VirtualBank.highestWinStreak = VirtualBank.currentWinStreak;
            }
          setTimeout(() => startBetting(true,VirtualBank.currentBetAmount), 100)
    } else {
        VirtualBank.balance -= VirtualBank.currentBetAmount; 
        VirtualBank.currentLoseStreak += 1;
        VirtualBank.currentWinStreak = 0; 
        if(VirtualBank.currentLoseStreak == VirtualBank.stopAtCertainLossStreak){
            VirtualBank.currentBetAmount = VirtualBank.initialBetAmount;
            VirtualBank.currentLoseStreak = 0;
        } else {
            VirtualBank.currentBetAmount *= 2;
        }
        if (VirtualBank.currentLoseStreak > VirtualBank.highestLoseStreak) {
            VirtualBank.highestLoseStreak = VirtualBank.currentLoseStreak;
        }
        setTimeout(() => startBetting(true,VirtualBank.currentBetAmount), 100)
    }
  } else {
    let amountInfoString = null
    const winORlose = responseData.state.result > responseData.state.target ? "WON" : "LOST";
    if (winORlose == "WON"){
        amountInfoString = `[${winORlose} : ${RealBank.currentBetAmount * responseData.payoutMultiplier}] [Balance : ${RealBank.balance + RealBank.currentBetAmount * responseData.payoutMultiplier}]`
    } else {
        amountInfoString = `[${winORlose} : ${RealBank.currentBetAmount}] [Balance : ${RealBank.balance - RealBank.currentBetAmount}]`
    }
    
    console.log(`${amountInfoString} [CurrentLS : ${RealBank.currentLoseStreak}] [CurrentWS : ${RealBank.currentWinStreak}] [HighestLS : ${RealBank.highestLoseStreak}] [HighestWS : ${RealBank.highestWinStreak}] - riyal`);

    if (responseData.state.result > responseData.state.target) {
            RealBank.balance += RealBank.currentBetAmount * responseData.payoutMultiplier; 
            RealBank.currentBetAmount = RealBank.initialBetAmount; 
            RealBank.currentWinStreak += 1;
            RealBank.currentLoseStreak = 0; 
            if (RealBank.currentWinStreak > RealBank.highestWinStreak) {
                
                RealBank.highestWinStreak = RealBank.currentWinStreak;
            }
          setTimeout(() => startBetting(false,RealBank.currentBetAmount), 1200)
    } else {
        RealBank.balance -= RealBank.currentBetAmount; 
        RealBank.currentLoseStreak += 1;
        RealBank.currentWinStreak = 0; 
        if(RealBank.currentLoseStreak == RealBank.stopAtCertainLossStreak){
            RealBank.currentBetAmount = RealBank.initialBetAmount;
            RealBank.currentLoseStreak = 0;
        } else {
            RealBank.currentBetAmount *= 2;
        }
        if (RealBank.currentLoseStreak > RealBank.highestLoseStreak) {
            RealBank.highestLoseStreak = RealBank.currentLoseStreak;
        }
        setTimeout(() => startBetting(false,RealBank.currentBetAmount), 1200)
    }
  }
};

const startBetting = async (method, amountToBet) => {
  if (method) {
    amountToBet = 0;
  }
  try {
    page.once("request", async function requestHandler(interceptedRequest) {
      interceptedRequest.continue({
        method: "POST",
        headers: {
          ...interceptedRequest.headers(),
          authority: "stake.games",
          accept: "*/*",
          "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "no-cache",
          "content-type": "application/json",
          Cookie: cookie,
          origin: "https://stake.com",
          pragma: "no-cache",
          referer: "https://stake.com/casino/games/dice",
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"linux"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          "x-access-token":
            "f42a34ed105c49fd66b109e75d361a99a8cf5f3b539709cb486c317487241ab5e40466e4dbbedf2b0981b62e8094b83d",
          "x-lockdown-token": "s5MNWtjTM5TvCMkAzxov",
        },
        postData: JSON.stringify({
          query: `mutation DiceRoll($amount: Float!, $target: Float!, $condition: CasinoGameDiceConditionEnum!, $currency: CurrencyEnum!, $identifier: String!) {
                        diceRoll(
                          amount: $amount
                          target: $target
                          condition: $condition
                          currency: $currency
                          identifier: $identifier
                        ) {
                          ...CasinoBet
                          state {
                            ...CasinoGameDice
                          }
                        }
                      }
            
                      fragment CasinoBet on CasinoBet {
                        id
                        active
                        payoutMultiplier
                        amountMultiplier
                        amount
                        payout
                        updatedAt
                        currency
                        game
                        user {
                          id
                          name
                        }
                      }
            
                      fragment CasinoGameDice on CasinoGameDice {
                        result
                        target
                        condition
                      }`,
          variables: {
            amount: amountToBet,
            condition: "above",
            currency: "usdt",
            identifier: "IPVU8PxM6IMC8zNstEQUr",
            target: 78,
          },
        }),
      });
    });
    const response = await page.goto("https://stake.com/_api/graphql");
    const data = await response.json();
    // console.log(data)
    handleNextBet(method, data);
  } catch (error) {
    console.log(error);
    handleNextBet(method, {error: true});
  }
};

const RealBank = {
  initialBetAmount: 0,
  balance: 0.22189168,
  highestWinStreak: 0,
  highestLoseStreak: 0,
  currentWinStreak: 0,
  currentLoseStreak: 0,
  currentBetAmount: 0,
  stopAtCertainLossStreak: 4,
  method: "real",
};

const VirtualBank = {
  initialBetAmount: 1,
  balance: 100,
  highestWinStreak: 0,
  highestLoseStreak: 0,
  currentWinStreak: 0,
  currentLoseStreak: 0,
  currentBetAmount: 1,
  stopAtCertainLossStreak: 4,
  method: "virtual",
};

const getUserInput = () => {
  return new Promise((resolve) => {
    rl.question("Please enter the method: ", (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const realDice = async () => {
  await initBroswer();
  const userMethod = await getUserInput();
  startBetting(userMethod == VirtualBank.method , RealBank.initialBetAmount);
};

module.exports = realDice;
