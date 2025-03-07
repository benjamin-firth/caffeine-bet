"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button } from "@mui/material";

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
  const [betAmount, setBetAmount] = useState('');
  const [user, setUser] = useState('');
  const [caffeineTotal, setCaffeineTotal] = useState<number | null>(null);
  const [hasSubmittedBet, setHasSubmittedBet] = useState(false);

  useEffect(() => {
    fetchBets();
    fetchWinner();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await fetch('/api/bets');
      const data: Bet[] = await response.json();
      setBets(data);
    } catch (error) {
      console.error("Error fetching bets:", error);
    }
  };

  const fetchWinner = async () => {
    try {
      const response = await fetch('/api/winner');
      const data = await response.json();
      
      setWinner(data);
      setCaffeineTotal(data.caffeineTotal);
  
    } catch (error) {
      console.error("Error fetching winner:", error);
    }
  };

  const submitBet = async () => {
    if (!betAmount || !user) return;
  
    try {
      const newBet: Bet = { user, bet: parseInt(betAmount, 10) };
  
      const response = await fetch('/api/submit-bet', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBet),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
  
      fetchBets();
      
      setHasSubmittedBet(true); // ✅ Track that the user has submitted a bet
      setBetAmount('');
    } catch (error) {
      console.error("Error submitting bet:", error);
    }
  };
  

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 16 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Matthew's Caffeine Intake Daily Bet
      </Typography>
      {winner && (
        <Card style={{ marginBottom: 16, backgroundColor: '#c8e6c9' }}>
          <CardContent>
            <Typography variant="h6">Yesterday's Winner</Typography>
            <Typography>{winner.user} / Guessed: {winner.bet}mg</Typography>
          </CardContent>
        </Card>
      )}
      <Card style={{ marginBottom: 16, padding: 16 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Place Your Bet</Typography>
          <TextField 
            fullWidth 
            label="Your name" 
            value={user} 
            onChange={(e) => setUser(e.target.value)} 
            margin="dense"
          />
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
        <Card style={{ padding: 16 }}>
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
  );
}
