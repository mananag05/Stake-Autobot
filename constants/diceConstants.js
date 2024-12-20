const cookie = process.env.STAKE_COOKIE

const headers = {
    "accept" : "*/*",
    "Host" : "stake.com",
    "accept-language": "en-US,en;q=0.5", 
    "content-type": "application/json",
    "cookie" : cookie, 
    "connection": "keep-alive",
    "origin" : "https://stake.com", 
    "priority" : "u=0",
    "referer" : "https://stake.com/casino/games/dice", 
    "TE": "Trailers",
    "Pragma" : "no-cache",
    "sec-fetch-dest": "empty", 
    "sec-fetch-mode": "cors", 
    "sec-fetch-site": "same-origin",
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0", // change
    "x-access-token": "f915366d2a7a446a8d6962e98e419912144494206fa8a15694a2c0cc657de9765c7210d1490b89955cb3d7736153c896", // change
    "x-lockdown-token": "s5MNWtjTM5TvCMkAzxov", // change
  }

module.exports = {
    headers,
    cookie
}