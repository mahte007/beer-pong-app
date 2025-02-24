"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ref, set, onValue, get, getDatabase, child } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import { snapshot } from "node:test";
import { Tournament } from "../interfaces/tournaments";

export default function Home() {
  const [tournamentName, setTournamentName] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>();
  
  const [sanitizedName, setSanitizedName] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const tournamentsRef = ref(database, "/tournaments");

  const dbRef = ref(getDatabase());
  useEffect(() => {
    get(child(dbRef, "tournaments"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val())
          setTournaments(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);  

  const addTournament = () => {
    if (!tournamentName) return;

    const sanitizedName = tournamentName.replace(/\s+/g, "-").toLowerCase()
    const id = `${sanitizedName}-${timestamp}`

    setTournamentId(tournamentId);

    set(ref(database, "tournaments/" + id), {
      name: tournamentName,
      id: id
    });
  }

  const handleOnChange = (e: any) => {
    setTournamentName(e.target.value)
    setTimestamp(new Date().toISOString().replace(/[.:-Z]/g, ""))
  }

  return (
    <div className="m-auto flex justify-center flex-col items-center mt-5">
      <h1 className="text-2xl">{"Top Shooters Beerpong"}</h1>
      <br />
      <div className="w-1/4">
        <input
          type="text"
          placeholder="Tournament Name"
          value={tournamentName}
          onChange={(e) => handleOnChange(e)}
          className="border p-2 w-full mb-2"
        />
        {!tournamentName && (
          <p className="text-red-600 text-sm mb-5">Add tournament name*</p>
        )}
        <button onClick={addTournament}>
          <Link
            href={{
              pathname: "/tournament",
              query: { id: `${tournamentName.replace(/\s+/g, "-").toLowerCase()}-${timestamp}` },
            }}
            className="bg-blue-500 text-white p-2 mt-2 w-full"
          >
            {"New Tournament"}
          </Link>
        </button>
      </div>

      
      {tournaments && tournaments.map(tournament => (
        <Link
        key={tournament.id}
        href={{
          pathname: tournament.id && "/tournament",
          query: tournament.id && { id: tournament.id },
        }}
        className="p-2 mt-2"
      >
        {tournament.name}
      </Link>
      ))}

    </div>
  );
}
