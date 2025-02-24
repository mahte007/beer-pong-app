import { Dispatch, FC, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Views } from "../../enums/views";
import { Match } from "../../interfaces/tournaments";

interface GroupMatchesProps {
  matches: Match[][];
  setView: Dispatch<SetStateAction<Views>>;
}

const GroupMatches: FC<GroupMatchesProps> = ({ matches, setView }) => {
  const [allRounds, setAllRounds] = useState<Match[][]>([])

  const viewGroups = (e: any) => {
    setView(e.target.value);
  };

  const sortMatches = useCallback(() => {
    const availableTables = 2;
    let flatMatches: Match[] = matches.flat();
    let rounds: Match[][] = [];
  
    while (flatMatches.length > 0) {
      flatMatches = flatMatches.sort(() => Math.random() - 0.5);
      let round: Match[] = [];
      let teamsPlaying = new Set<string>();
  
      // Iterate through matches and add to round if teams are not already playing
      flatMatches = flatMatches.filter((match) => {
        if (
          round.length < availableTables &&
          !teamsPlaying.has(match.team1) &&
          !teamsPlaying.has(match.team2)
        ) {
          round.push(match);
          teamsPlaying.add(match.team1);
          teamsPlaying.add(match.team2);
          return false; // Remove match from flatMatches
        }
        return true; // Keep match for next rounds
      });
  
      // Ensure at least one match is added per round to prevent an infinite loop
      if (round.length === 0 && flatMatches.length > 0) {
        round.push(flatMatches.shift()!); // Add one leftover match
      }
  
      rounds.push(round);
    }

    setAllRounds(rounds)

    if (matches.flat().length > 8 && rounds[rounds.length - 1].length < 1) {
      sortMatches()
    }

  }, [])

  useEffect(() => {
    sortMatches();
  }, [])
  
  return (
    <div>
      <h3 className="text-md font-bold mt-4">Rounds</h3>
        {allRounds.map((round, index) => (
          <div key={index} className="mt-2 p-2 border">
            <h4 className="font-semibold">Round {index + 1}</h4>
            <ul className="list-disc pl-4">
              {round.map((match, i) => (
                <li key={i}>
                  {match.team1} - {match.team2}
                </li>
              ))}
            </ul>
          </div>
        ))}
      <button
        onClick={(e) => {
          viewGroups(e);
        }}
        className="bg-gray-500 text-white p-2 mt-4 w-full"
      >
        Back to Groups
      </button>
      <button
        onClick={() => {
          sortMatches();
        }}
        className="bg-blue-500 text-white p-2 mt-4 w-full"
      >
        Rearrange
      </button>
    </div>
  );
};

export default GroupMatches;
