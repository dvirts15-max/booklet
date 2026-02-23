"use client"

import React from "react"
import { supabase } from "../../lib/supabase"

export default function Dashboard() {
  const [msg, setMsg] = React.useState("טוען...")

  React.useEffect(() => {
    ;(async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) return setMsg("לא מחובר. כנס ל /login")

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", uid)
        .single()

      if (error || !profile) return setMsg("לא נמצא פרופיל")

      if (profile.role === "admin") window.location.href = "/admin"
      else window.location.href = "/edit"
    })()
  }, [])

  return <div style={{ padding: 24 }}>{msg}</div>
}
