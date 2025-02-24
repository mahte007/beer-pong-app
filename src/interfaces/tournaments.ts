export interface Team {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  thrown: number;
  received: number;
}

export interface Match {
  team1: string;
  team2: string;
}

export interface Tournament {
  id: string;
  isStarted: boolean;
  name: string;
  teams: Team[];
  groups: Team[][];
}
