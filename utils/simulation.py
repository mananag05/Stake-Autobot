import random

def martingale_simulation(
    initial_bet=0.1,
    balance=10,
    target_balance=100,
    reset_on_certain_lose_streak=4,
    money_multiplier_on_win=3.5,
    simulations=1000,
    win_probability=0.22  # 22% chance of winning
):
    # Debug: print the value of money_multiplier_on_win
    print(f"money_multiplier_on_win: {money_multiplier_on_win}")
    
    target_hits = 0
    balance_zero_count = 0
    total_reach_attempts = 0
    win_loss_log = []  # To store win/loss amounts

    for sim in range(simulations):
        current_balance = balance
        bet = initial_bet
        lose_streak = 0
        reach_target = 0
        iteration = 0

        while current_balance > 0 and current_balance < target_balance:
            iteration += 1
            # Generate a random number between 0 and 1 and compare to the win probability
            if random.random() < win_probability:
                # Win scenario
                win_amount = bet * (money_multiplier_on_win - 1)
                current_balance += win_amount
                bet = initial_bet
                lose_streak = 0
                win_loss_log.append(('Win', win_amount, current_balance))  # Log win
            else:
                # Lose scenario
                loss_amount = bet
                current_balance -= loss_amount
                lose_streak += 1
                win_loss_log.append(('Loss', loss_amount, current_balance))  # Log loss

                if lose_streak >= reset_on_certain_lose_streak:
                    # Reset bet and lose streak after hitting lose streak limit
                    bet = initial_bet
                    lose_streak = 0
                else:
                    # Double the bet
                    bet *= 2

            # Ensure we don't bet more than we have
            if bet > current_balance:
                bet = current_balance

            # Track target hits
            if current_balance >= target_balance:
                target_hits += 1
                reach_target += 1

        # Track bankruptcies
        if current_balance <= 0:
            balance_zero_count += 1

        total_reach_attempts += reach_target

    # Calculate averages
    average_reach_attempts = total_reach_attempts / simulations

    return {
        "Target Hits": target_hits,
        "Balance Zero Count": balance_zero_count,
        "Average Reaches Per Simulation": average_reach_attempts,
        "Win/Loss Log": win_loss_log
    }

# Example usage
results = martingale_simulation(
    initial_bet=0.01,    
    balance=10,
    target_balance=20,
    reset_on_certain_lose_streak=5,
    money_multiplier_on_win=16.5,
    simulations=1000,
    win_probability=0.6
)

print("Simulation Results:")
print(f"Target Hits: {results['Target Hits']}")
print(f"Balance Zero Count: {results['Balance Zero Count']}")
print(f"Average Reaches Per Simulation: {results['Average Reaches Per Simulation']:.2f}")
# print("Win/Loss Log:")
# for entry in results['Win/Loss Log']:
#     print(f"  {entry[0]}: Amount: {entry[1]:.2f}, Balance: {entry[2]:.2f}")
