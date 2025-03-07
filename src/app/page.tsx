"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, Typography, TextField, Button, CircularProgress } from "@mui/material";

type Winner = {
  user: string;
  bet: number;
};

type Bet = {
  user: string;
  bet: number;
};

export default function CaffeineBetApp() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [user, setUser] = useState("");
  const [caffeineTotal, setCaffeineTotal] = useState<number | null>(null);
  const [hasSubmittedBet, setHasSubmittedBet] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ user: string; count: number }[]>([]);
  const [loadingWinner, setLoadingWinner] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    fetchBets();
    fetchWinner();
    fetchLeaderboard();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await fetch("/api/bets");
      const data: Bet[] = await response.json();
      setBets(data);
    } catch (error) {
      console.error("Error fetching bets:", error);
    }
  };

  const fetchWinner = async () => {
    try {
      setLoadingWinner(true);
      const response = await fetch("/api/winner");
      const data = await response.json();
      setWinner(data);
      setCaffeineTotal(data.caffeineTotal);
    } catch (error) {
      console.error("Error fetching winner:", error);
    } finally {
      setLoadingWinner(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingLeaderboard(true);
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const submitBet = async () => {
    if (!betAmount || !user) return;

    try {
      const newBet: Bet = { user, bet: parseInt(betAmount, 10) };

      const response = await fetch("/api/submit-bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBet),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      fetchBets();
      fetchWinner();
      fetchLeaderboard();
      setHasSubmittedBet(true);
      setBetAmount("");
    } catch (error) {
      console.error("Error submitting bet:", error);
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#121212", padding: "20px" }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        style={{
          backgroundColor: "#1e1e1e",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        Matthew's Daily Caffeine Intake Bet
      </Typography>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ flex: 2 }}>
          <Card style={{ marginBottom: 16, padding: 16, backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Place Your Bet</Typography>
              <TextField fullWidth label="Your name" value={user} onChange={(e) => setUser(e.target.value)} margin="dense" />
              <TextField
                fullWidth
                type="number"
                label="Caffeine amount (mg)"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                margin="dense"
              />
              <Button variant="contained" color="primary" fullWidth onClick={submitBet} style={{ marginTop: 16 }}>
                Submit Bet
              </Button>
            </CardContent>
          </Card>
          {hasSubmittedBet && (
            <Card style={{ padding: 16, backgroundColor: "#f5f5f5" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Current Bets</Typography>
                <ul>
                  {bets.map((bet, index) => (
                    <li key={index}>{bet.user}: {bet.bet}mg</li>
                  ))}
                </ul>
                {caffeineTotal !== null && (
                  <Typography variant="h6" align="center" style={{ marginTop: 16 }}>
                    Matthew’s Current Caffeine Total: {caffeineTotal}mg
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Card style={{ padding: 16, minWidth: "250px", backgroundColor: "#fff3cd" }}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom>Leaderboard</Typography>
              {loadingWinner ? (
                <Typography align="center">
                  <CircularProgress size={24} />
                </Typography>
              ) : winner ? (
                <Typography
                  variant="h6"
                  align="center"
                  style={{ marginBottom: 12, backgroundColor: "#c8e6c9", padding: "10px", borderRadius: "4px" }}
                >
                  Yesterday's Winner: {winner.user} ({winner.bet}mg)
                </Typography>
              ) : (
                <Typography align="center">No winner yet</Typography>
              )}

              {loadingLeaderboard ? (
                <Typography align="center">
                  <CircularProgress size={24} />
                </Typography>
              ) : leaderboard.length > 0 ? (
                <ul>
                  {leaderboard.map((entry, index) => (
                    <li key={index}>{entry.user} - {entry.count} {entry.count > 1 ? "wins" : "win"}</li>
                  ))}
                </ul>
              ) : (
                <Typography variant="h6" align="center">No winners yet!</Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
