import { Dispatch, FC, SetStateAction } from "react";

interface Team {
  name: string;
  wins: number;
  losses: number;
  draws: number;
  thrown: number;
  received: number;
  points: number;
}

interface GroupsProps {
  tournamentName: string;
  teams: Team[];
  groups: Team[][];
  setView: Dispatch<SetStateAction<string>>;
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

  return (
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
              {group.map((team, i) => (
                <li key={i}>
                  {team.name} (Wins: {team.wins}, Losses: {team.losses}, Draws:{" "}
                  {team.draws}, Thrown: {team.thrown}, Received: {team.received}
                  , Points: {team.points})
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
