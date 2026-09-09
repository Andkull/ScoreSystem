export function BodyComponent() {
  return (
    <>
       <main className="main">
            <section className="hero">
                <div>
                    <p className="eyebrow">BLOCKCHAIN GAME</p>
                    <h1>Score System</h1>
                    <p className="heroText">
                        Play the game, earn points, compete with other members
                        and redeem your points for rewards.
                    </p>
                </div>

                <div className="scoreCard">
                    <span>Your Score</span>
                    <strong>0</strong>
                    <small>points</small>
                </div>
            </section>

            <section className="dashboard">
                <div className="card gameCard">
                    <div className="cardHeader">
                        <div>
                            <p className="cardLabel">DAILY GAME</p>
                            <h2>Guess the Number</h2>
                        </div>

                        <span className="cooldown">24h cooldown</span>
                    </div>

                    <p className="description">
                        Pick a number between 1 and 3. Guess correctly and
                        earn 10 points.
                    </p>

                    <div className="numberButtons">
                        <button>1</button>
                        <button>2</button>
                        <button>3</button>
                    </div>

                    <button className="primaryButton">
                        Play Game
                    </button>
                </div>

                <div className="card profileCard">
                    <p className="cardLabel">PLAYER</p>
                    <h2>Your Profile</h2>

                    <div className="profileInfo">
                        <div>
                            <span>Status</span>
                            <strong>Registered</strong>
                        </div>

                        <div>
                            <span>Score</span>
                            <strong>0 points</strong>
                        </div>

                        <div>
                            <span>T-shirt</span>
                            <strong>Not claimed</strong>
                        </div>
                    </div>

                    <button className="secondaryButton">
                        Register
                    </button>
                </div>

                <div className="card transferCard">
                    <p className="cardLabel">POINTS</p>
                    <h2>Transfer Points</h2>

                    <p className="description">
                        Send some of your points to another registered member.
                    </p>

                    <label>Member address</label>
                    <input
                        type="text"
                        placeholder="0x..."
                    />

                    <label>Amount</label>
                    <input
                        type="number"
                        placeholder="Amount of points"
                    />

                    <button className="primaryButton">
                        Transfer Points
                    </button>
                </div>

                <div className="card rewardCard">
                    <div className="rewardIcon">👕</div>

                    <div>
                        <p className="cardLabel">REWARD</p>
                        <h2>Win a T-shirt</h2>
                        <p className="description">
                            Redeem 50 points for your exclusive T-shirt.
                        </p>
                    </div>

                    <div className="rewardBottom">
                        <span>Cost: 50 points</span>
                        <button className="secondaryButton">
                            Buy T-shirt
                        </button>
                    </div>
                </div>
            </section>
        </main>
    </>
  );
}
