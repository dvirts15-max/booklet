import Link from "next/link"

export default function HomePage() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Diller Booklet System</h1>
      <p style={{ opacity: 0.75 }}>
        Admin מזין בסיס ותבנית; רכזים ממלאים משתנים ומייצאים PDF.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/login">Login</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/edit">Edit</Link>
        <Link href="/booklet">Booklet</Link>
      </div>
    </div>
  )
}
