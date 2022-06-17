import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('should be in the dom', () => {
  render(<App />);

  const matchReports = screen.getByText(/Reports of each match/i)
  const deathCause = screen.getByText(/Death cause report by match/i);
  const playerRanking = screen.getByText(/Player Ranking/i);

  expect(matchReports).toBeInTheDocument();
  expect(deathCause).toBeInTheDocument();
  expect(playerRanking).toBeInTheDocument();
});

it('should display the word Ranking on click', async () => {
  const user = userEvent.setup();
  render(<App />);

  const playerRanking = screen.getByText(/Player Ranking/i);
  await user.click(playerRanking);

  expect(screen.getByText('Ranking')).toBeInTheDocument();
})
