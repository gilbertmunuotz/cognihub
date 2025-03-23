import Link from "next/link";

export default function App() {
  return (
    <div>
      <h1>Welcome CogniHub</h1>
      <Link href={"/home"}>
        Get started
      </Link>
    </div>
  );
}