"use client";

import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import MOCK_GROUPS from "./MOCK_DATA";
import Groups from "./groups";
import GroupMatches from "./groupMatches";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { database } from "../../firebase/firebaseConfig";
import { useSearchParams } from "next/navigation";
import { Views } from "../../enums/views";
import AddTeams from "./addTeams";
import { Match, Team, Tournament } from "../../interfaces/tournaments";

const BeerPongTournament = () => {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get("id");

  const [tournament, setTournament] = useState<Tournament>();

  const [teams, setTeams] = useState<Team[]>([]);
  
  const [tournamentStarted, setTournamentStarted] = useState(false);
  const [groups, setGroups] = useState<Team[][]>([]);
  const [matches, setMatches] = useState<Match[][]>([]);
  const [view, setView] = useState(Views.ADD_TEAMS);

  console.log(view)

  const dbRef = ref(getDatabase());
    useEffect(() => {
      get(child(dbRef, `tournaments/${tournamentId}/`))
        .then((snapshot) => {
          if (snapshot.exists()) {

            const data = snapshot.val()

            setTournament(data);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);  

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

    groupedTeams.map((group, index) => {
      group.map((team, teamIndex) => {
        set(ref(database, `tournaments/${tournament?.id}/groups/group-${index + 1}/team-${teamIndex + 1}`), {
          name: team.name,
          wins: team.wins,
          losses: team.losses,
          draws: team.draws,
          thrown: team.thrown,
          recieved: team.received,
        })
      })
    })

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
      allMatches.push(groupMatches);
      groupMatches = [];
    });
    setMatches(allMatches);
  };

  const startTournament = () => {
    if (teams.length > 1) {
      generateGroups();
      setTournamentStarted(true);

      teams.map((team) => {
        set(ref(database, `tournaments/${tournament?.id}/teams/` + team.name), {
          name: team.name,
          wins: team.wins,
          losses: team.losses,
          draws: team.draws,
          thrown: team.thrown,
          recieved: team.received,
        });
      })

      setView(Views.GROUPS)
    }
  };

  const changeView = useCallback((e: any) => {
    setView(e.target.value);
  }, [view])

  useEffect(() => {
    tournament?.isStarted && setView(Views.GROUPS)
  }, [tournament])

  const viewPage = useMemo(() => {
    switch (view) {
      case Views.GROUP_MATCHES:
        return <GroupMatches matches={matches} setView={setView} />;
      case Views.GROUPS:
        return tournament?.groups && (
          <Groups
            groups={Object.values(tournament.groups)}
            teams={Object.values(tournament?.teams)}
            tournamentName={tournament?.name ?? ""}
            setView={setView}
          />
        );
      case Views.ADD_TEAMS:
        return (
          <AddTeams
            startTournament={startTournament}
            teams={teams}
            setTeams={setTeams}
          />
        );
      default:
        break;
    }
  }, [view, tournament, teams]);

  return tournament && (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Beer Pong Tournament</h1>
      <h2 className="text-lg font-bold mb-4">{tournament.name}</h2>
      <div className="flex">
        <button
          value={Views.ADD_TEAMS}
          onClick={changeView}
          className="p-2 mt-4 w-full border-black border"
          disabled={tournamentStarted || tournament.isStarted}
        >
          Start Tournament
        </button>
        <button
          value={Views.GROUPS}
          onClick={changeView}
          className="p-2 mt-4 w-full border-black border"
        >
          Groups
        </button>
        <button
          value={Views.GROUP_MATCHES}
          onClick={changeView}
          className="p-2 mt-4 w-full border-black border"
        >
          Matches
        </button>
      </div>
      {viewPage}
    </div>
  );
};

export default BeerPongTournament;
