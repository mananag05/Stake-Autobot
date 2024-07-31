# Martingale Betting Strategy

This project demonstrates a simple implementation of the Martingale betting strategy with loss management to prevent bankruptcy in extreme cases. The goal is to double your money in the short term, but it is not recommended for long-term use.

## How It Works

The Martingale strategy involves doubling your bet after each loss, so when you eventually win, you recover all previous losses plus a profit equal to the original bet. This code simulates this strategy with a virtual profile.

### Key Points:
- **Win Chance**: Each dice roll has a 49.5% chance of winning.
- **Betting Amounts**: The initial bet is set to 0.01 units of currency.
- **Loss Management**: The strategy includes a maximum loss limit to prevent bankruptcy. (Default MAX_LOSS = 1 unit)

## Creating a Virtual Profile

To create a virtual profile with an initial balance of 10.0 units of currency, you need to set up a `.env` file with the following content:
```
USER=<your_name>
MONGO_CONNECTION_STRING=<your_mongodb_connection_string>
```
## Warnings

- **Not Suitable for Long-Term Use**: The Martingale strategy can lead to significant losses over time due to its exponential growth in bet size after each loss.
- **Risk of Bankruptcy**: Even with loss management, there is a risk of losing all your money in the long run.
- **Fun Project**: This project is intended for fun and educational purposes only. Do not use it for real money betting unless you are fully aware of the risks and have at least 10 units of currency to start with.

## Usage
1. **Clone the Repository**: 
   ```
   git clone https://github.com/mananag05/Stake-Tester.git
   cd Stake-Tester
   ```
2. **Install Dependencies**:
   ```
   npm install
   ```
3. **Set Up Environment Variables: Create a .env file in the root directory with the following content**:
    ```
    USER=<your_name>
    ```
4. **Run the Project*:
    ```
    npm run start
    ```
Enjoy experimenting with the Martingale betting strategy, but remember to bet responsibly!
