import { Dispatch, FC, SetStateAction } from "react";
import { Views } from "../../enums/views";
import { Team } from "../../interfaces/tournaments";

interface GroupsProps {
  tournamentName: string;
  teams: Team[];
  groups: Team[][];
  setView: Dispatch<SetStateAction<Views>>;
}

const Groups: FC<GroupsProps> = ({
  tournamentName,
  groups,
  teams,
  setView,
}) => {
  const viewGroupMatches = (e: any) => {
    setView(e.target.value);
  };

  const calculatePoints = (wins: number, draws: number) => {
    return wins * 3 + draws;
  }
  
  console.log(groups)

  return groups && (
    <>
      <div>
        <h2 className="text-lg font-bold">
          Tournament Started: {tournamentName}
        </h2>
        <p>Number of Teams: {teams.length}</p>
        <h3 className="text-md font-bold mt-4">Groups</h3>
        {groups.map((group, index) => (
          <div key={index} className="mt-2 p-2 border">
            <h4 className="font-semibold">Group {index + 1}</h4>
            <ul className="list-disc pl-4">
              {Object.values(group).map((team, i) => (
                <li key={i}>
                  {team.name} (Wins: {team.wins}, Losses: {team.losses}, Draws:{" "}
                  {team.draws}, Thrown: {team.thrown}, Received: {team.received}
                  , Points: {calculatePoints(team.wins, team.draws)})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        value={"groupMatches"}
        onClick={(e) => viewGroupMatches(e)}
        className="bg-blue-500 text-white p-2 mt-2 w-full"
      >
        View Matches
      </button>
    </>
  );
};

export default Groups;
