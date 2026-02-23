"use client"

import React from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [msg, setMsg] = React.useState("")

  const signIn = async () => {
    setMsg("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMsg(error ? error.message : "מחובר. כנס ל /dashboard")
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setMsg("התנתקת.")
  }

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Login</h1>

      <label style={{ display: "block", marginBottom: 10 }}>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 10 }}>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />
      </label>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={signIn} style={{ padding: "10px 12px" }}>
          Sign in
        </button>
        <button onClick={signOut} style={{ padding: "10px 12px" }}>
          Sign out
        </button>
      </div>

      {msg && <p style={{ marginTop: 12, opacity: 0.85 }}>{msg}</p>}
    </div>
  )
}
