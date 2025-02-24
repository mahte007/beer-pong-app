import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { Team } from "../../interfaces/tournaments";

interface AddTeamsProps {
    teams: Team[],
    startTournament: () => void,
    setTeams: Dispatch<SetStateAction<Team[]>>
}

const AddTeams: FC<AddTeamsProps> = ({startTournament, teams, setTeams}) => {
    const [newTeam, setNewTeam] = useState<Team>({
        name: "",
        wins: 0,
        losses: 0,
        draws: 0,
        thrown: 0,
        received: 0,
      });

      const addTeam = () => {
        console.log(newTeam)
        if (newTeam.name.trim() !== "") {
          setTeams([...teams, newTeam]);
          setNewTeam({
            name: "",
            wins: 0,
            losses: 0,
            draws: 0,
            thrown: 0,
            received: 0,
          });
        }
      };

    return (
        <div>
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
                {team.draws}, Thrown: {team.thrown}, Received: {team.received})
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
    )
}

export default AddTeams