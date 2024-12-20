const { launch } = require('puppeteer');
const { cookie } = require('../constants/diceConstants');

const virtualBank = {
    initialBetAmount : 0.01,
    balance : 3.0,
    highestWinStreak : 0,
    highestLoseStreak : 0,
    currentWinStreak : 0,
    currentLoseStreak : 0,
    currentBetAmount: 0.01,
    stopAtCertainLossStreak : 4
}


const realBank = {
    initialBetAmount : 0.01,
    balance : 3.0,
    highestWinStreak : 0,
    highestLoseStreak : 0,
    currentWinStreak : 0,
    currentLoseStreak : 0,
    currentBetAmount: 0.01,
    stopAtCertainLossStreak : 4
}


let browser , page;

const initBrowser = async () => {
      if(browser){
        return
      }
      browser = await launch({
        args: ['--enable-features=NetworkService', '--no-sandbox'],
        ignoreHTTPSErrors: true,
      });
    
      page = await browser.newPage();
}

async function sendRequest(Realamount) {
    try {
      initBrowser().then(async () => {
        await page.setRequestInterception(true);
        page.once("request", async (interceptedRequest) => {
          if (interceptedRequest.url().includes("_api/graphql")) {
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
                  "f915366d2a7a446a8d6962e98e419912144494206fa8a15694a2c0cc657de9765c7210d1490b89955cb3d7736153c896",
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
                  amount: Realamount,
                  condition: "above",
                  currency: "inr",
                  identifier: "U3vx6KZsTU079gwp9379j",
                  target: 78,
                },
              }),
            });
          } else {
            interceptedRequest.continue();
          }
        });
        
        const response = await page.goto("https://stake.com/_api/graphql");

        const data = await response.text();
        try {
          handlejson(JSON.parse(data));
        } catch (e) {
          console.log(e);
        }
      });

    } catch (error) {
      console.log("error", error);
    }

    
}


function handlejson(parsedData) {
    const outcome = parsedData.data.diceRoll
    const result = outcome.state.result > 78 ? 'Won' : 'Lost'
    if (result === 'Won') {
        virtualBank.balance += virtualBank.currentBetAmount * 4.5; // Add bet amount to balance on win
        virtualBank.currentBetAmount = virtualBank.initialBetAmount; // Reset bet amount
        virtualBank.currentWinStreak += 1;
        virtualBank.currentLoseStreak = 0; // Reset lose streak
        if (virtualBank.currentWinStreak > virtualBank.highestWinStreak) {
            virtualBank.highestWinStreak = virtualBank.currentWinStreak;
        }
        

    } else {
        virtualBank.balance -= virtualBank.currentBetAmount; // Deduct bet amount from balance on loss
        virtualBank.currentLoseStreak += 1;
        virtualBank.currentWinStreak = 0; // Reset
        if(virtualBank.currentLoseStreak == virtualBank.stopAtCertainLossStreak){
            virtualBank.currentBetAmount = virtualBank.initialBetAmount; // Reset bet amount
            virtualBank.currentLoseStreak = 0;
        } else {
            virtualBank.currentBetAmount *= 2; // Double bet amount after each loss
        }
        if (virtualBank.currentLoseStreak > virtualBank.highestLoseStreak) {
            virtualBank.highestLoseStreak = virtualBank.currentLoseStreak;
        }
    }

    console.log(`[${result}] [balance : ${virtualBank.balance}] [HighestwinsStreak: ${virtualBank.highestWinStreak}] [HighestloseStreak: ${virtualBank.highestLoseStreak}] [currentWinStreak: ${virtualBank.currentWinStreak}] [currentLoseStreak: ${virtualBank.currentLoseStreak}] [nextBetAmount: ${virtualBank.currentBetAmount}]`);
}

const diceGame = async () => {
  console.log('playing dice game');
  try {
    const interval = setInterval(()=>{sendRequest(0);},1200);
  } catch (error) {
    console.log('error', error);
  }
};

module.exports = diceGame;
