"use client";

import { MouseEvent, useEffect, useState } from "react";
import MOCK_GROUPS from "./MOCK_DATA";
import Groups from "./groups";
import GroupMatches from "./groupMatches";

interface Team {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  thrown: number;
  received: number;
  points: number;
}

interface Match {
  team1: string;
  team2: string;
}

const BeerPongTournament = () => {
  const [tournamentName, setTournamentName] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState<Team>({
    name: "",
    wins: 0,
    losses: 0,
    draws: 0,
    thrown: 0,
    received: 0,
    points: 0,
  });
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [groups, setGroups] = useState<Team[][]>([]);
  const [matches, setMatches] = useState<Match[][]>([]);
  const [view, setView] = useState("");

  const addTeam = () => {
    if (newTeam.name.trim() !== "") {
      setTeams([...teams, newTeam]);
      setNewTeam({
        name: "",
        wins: 0,
        losses: 0,
        draws: 0,
        thrown: 0,
        received: 0,
        points: 0,
      });
    }
  };

  const generateGroups = () => {
    let shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
    let groupedTeams: Team[][] = [];

    for (let i = 0; i < shuffledTeams.length; i += 4) {
      groupedTeams.push(shuffledTeams.slice(i, i + 4));
    }

    if (
      groupedTeams.length > 1 &&
      groupedTeams[groupedTeams.length - 1].length < 4
    ) {
      let lastGroup = groupedTeams.pop()!;
      let index = 0;
      while (lastGroup.length > 0) {
        groupedTeams[index].push(lastGroup.pop()!);
        index = (index + 1) % groupedTeams.length;
      }
    }

    setGroups(groupedTeams);
    generateMatches(groupedTeams);
  };

  const generateMatches = (allGroups: Team[][]) => {
    let allMatches: Match[][] = [];
    let groupMatches: Match[] = [];

    allGroups.forEach((group) => {
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          groupMatches.push({ team1: group[i].name, team2: group[j].name });
        }
      }
      allMatches.push(groupMatches)
      groupMatches = [];
    });
    setMatches(allMatches);
  };

  const startTournament = () => {
    if (teams.length > 1) {
      generateGroups();
      setTournamentStarted(true);
    }
  };

  useEffect(() => {
    setTeams(MOCK_GROUPS);
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Beer Pong Tournament</h1>
      {!tournamentStarted ? (
        <div>
          <input
            type="text"
            placeholder="Tournament Name"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <div className="mb-2">
            <input
              type="text"
              placeholder="Team Name"
              value={newTeam.name}
              onChange={(e) =>
                setNewTeam({
                  ...newTeam,
                  name: e.target.value,
                })
              }
              className="border p-2 w-full"
            />
            <button
              onClick={addTeam}
              className="bg-blue-500 text-white p-2 mt-2 w-full"
            >
              Add Team
            </button>
          </div>
          <ul className="list-disc pl-4">
            {teams.map((team, index) => (
              <li key={index}>
                {team.name} (Wins: {team.wins}, Losses: {team.losses}, Draws:{" "}
                {team.draws}, Thrown: {team.thrown}, Received: {team.received},
                Points: {team.points})
              </li>
            ))}
          </ul>
          <button
            onClick={startTournament}
            className="bg-green-500 text-white p-2 mt-4 w-full"
          >
            Start Tournament
          </button>
        </div>
      ) : view === "groupMatches" ? (
        <GroupMatches matches={matches} setView={setView} />
      ) : (
        <Groups
          groups={groups}
          teams={teams}
          tournamentName={tournamentName}
          setView={setView}
        />
      )}
    </div>
  );
};

export default BeerPongTournament;
