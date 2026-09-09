export function HeaderComponent() {
    return (
        <header className="header">
            <div className="headerInner">
                <div className="logo">
                    <div className="logoMark">S</div>

                    <div>
                        <span className="logoTitle">ScoreSystem</span>
                        <span className="logoSubtitle">Web3 Game</span>
                    </div>
                </div>

                <nav className="navigation">
                    <a href="#game">Game</a>
                    <a href="#profile">Profile</a>
                    <a href="#rewards">Rewards</a>
                </nav>

                <button className="walletButton">
                    Connect Wallet
                </button>
            </div>
        </header>
    );
}