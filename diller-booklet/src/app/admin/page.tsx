"use client"

import React from "react"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const [msg, setMsg] = React.useState("")
  const [template, setTemplate] = React.useState<any>(null)

  const [newOwnerId, setNewOwnerId] = React.useState("")
  const [newYear, setNewYear] = React.useState("2026")
  const [newLang, setNewLang] = React.useState<"he" | "en">("he")

  const load = async () => {
    setMsg("")
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData.session?.user?.id
    if (!uid) return setMsg("לא מחובר. כנס ל /login")

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", uid).single()
    if (profile?.role !== "admin") return setMsg("אין הרשאות אדמין")

    const { data: t, error: tErr } = await supabase.from("booklet_template").select("*").limit(1).single()
    if (tErr || !t) return setMsg("אין תבנית בטבלה booklet_template. צור שורה אחת ב־Supabase.")
    setTemplate(t)
  }

  React.useEffect(() => {
    load()
  }, [])

  const update = (k: string, v: string) => setTemplate((p: any) => ({ ...p, [k]: v }))

  const saveTemplate = async () => {
    setMsg("")
    const { error } = await supabase
      .from("booklet_template")
      .update({
        goals_he: template.goals_he,
        goals_en: template.goals_en,
        safety_he: template.safety_he,
        safety_en: template.safety_en,
        health_he: template.health_he,
        health_en: template.health_en,
        coc_he: template.coc_he,
        coc_en: template.coc_en,
        updated_at: new Date().toISOString()
      })
      .eq("id", template.id)

    setMsg(error ? error.message : "נשמר!")
  }

  const createBooklet = async () => {
    setMsg("")
    if (!newOwnerId.trim()) return setMsg("חסר owner_user_id של הרכז")

    const { error } = await supabase.from("booklets").insert({
      owner_user_id: newOwnerId.trim(),
      year: newYear,
      lang: newLang
    })

    setMsg(error ? error.message : "נוצרה חוברת לרכז")
  }

  if (!template) return <div style={{ padding: 24 }}>{msg || "טוען..."}</div>

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Admin</h1>
      {msg && <div style={{ marginBottom: 12, opacity: 0.85 }}>{msg}</div>}

      <h3 style={{ marginBottom: 8 }}>תבנית, טקסטים קבועים</h3>

      <label>
        Goals (HE)
        <textarea value={template.goals_he} onChange={(e) => update("goals_he", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>
      <label>
        Goals (EN)
        <textarea value={template.goals_en} onChange={(e) => update("goals_en", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>

      <label>
        Safety (HE)
        <textarea value={template.safety_he} onChange={(e) => update("safety_he", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>
      <label>
        Safety (EN)
        <textarea value={template.safety_en} onChange={(e) => update("safety_en", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>

      <label>
        Health (HE)
        <textarea value={template.health_he} onChange={(e) => update("health_he", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>
      <label>
        Health (EN)
        <textarea value={template.health_en} onChange={(e) => update("health_en", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>

      <label>
        Code of Conduct (HE)
        <textarea value={template.coc_he} onChange={(e) => update("coc_he", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>
      <label>
        Code of Conduct (EN)
        <textarea value={template.coc_en} onChange={(e) => update("coc_en", e.target.value)} rows={5} style={{ width: "100%", padding: 10 }} />
      </label>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
        <button onClick={saveTemplate} style={{ padding: 12 }}>
          Save Template
        </button>
        <a href="/booklet" style={{ padding: 12 }}>
          Preview booklet
        </a>
      </div>

      <hr style={{ margin: "18px 0" }} />

      <h3 style={{ marginBottom: 8 }}>יצירת חוברת לרכז</h3>
      <p style={{ marginTop: 0, opacity: 0.75 }}>הדבק owner_user_id של הרכז מתוך Supabase Authentication.</p>

      <label>
        owner_user_id
        <input value={newOwnerId} onChange={(e) => setNewOwnerId(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        <label>
          Year
          <input value={newYear} onChange={(e) => setNewYear(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>
        <label>
          Language
          <select value={newLang} onChange={(e) => setNewLang(e.target.value as any)} style={{ width: "100%", padding: 10, marginTop: 6 }}>
            <option value="he">Hebrew</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>

      <button onClick={createBooklet} style={{ padding: 12, marginTop: 10 }}>
        Create booklet
      </button>
    </div>
  )
}
