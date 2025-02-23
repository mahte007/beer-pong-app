import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {"Top Shooters Beerpong"}
      <br />
      <Link href={"/tournament"}>{"New Tournament"}</Link>
    </div>
  );
}
