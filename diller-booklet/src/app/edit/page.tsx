"use client"

import React from "react"
import { supabase } from "@/lib/supabase"

export default function EditPage() {
  const [msg, setMsg] = React.useState("")
  const [booklet, setBooklet] = React.useState<any>(null)

  const load = async () => {
    setMsg("")
    const { data: sessionData } = await supabase.auth.getSession()
    const uid = sessionData.session?.user?.id
    if (!uid) return setMsg("לא מחובר. כנס ל /login")

    const { data, error } = await supabase
      .from("booklets")
      .select("*")
      .eq("owner_user_id", uid)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) return setMsg("אין לך חוברת משויכת עדיין. פנה לאדמין.")
    setBooklet(data)
  }

  React.useEffect(() => {
    load()
  }, [])

  const update = (k: string, v: any) => setBooklet((p: any) => ({ ...p, [k]: v }))

  const save = async () => {
    setMsg("")
    const { error } = await supabase
      .from("booklets")
      .update({
        year: booklet.year,
        lang: booklet.lang,
        local_logo_url: booklet.local_logo_url,
        community_name_he: booklet.community_name_he,
        community_name_en: booklet.community_name_en,
        partner_name_he: booklet.partner_name_he,
        partner_name_en: booklet.partner_name_en,
        city_he: booklet.city_he,
        city_en: booklet.city_en,
        intro_he: booklet.intro_he,
        intro_en: booklet.intro_en
      })
      .eq("id", booklet.id)

    setMsg(error ? error.message : "נשמר!")
  }

  if (!booklet) return <div style={{ padding: 24 }}>{msg || "טוען..."}</div>

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Coordinator Form</h1>
      {msg && <div style={{ marginBottom: 12, opacity: 0.85 }}>{msg}</div>}

      <label>
        Year
        <input value={booklet.year} onChange={(e) => update("year", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Language for this booklet
        <select value={booklet.lang} onChange={(e) => update("lang", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }}>
          <option value="he">Hebrew</option>
          <option value="en">English</option>
        </select>
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Local logo URL
        <input
          value={booklet.local_logo_url}
          onChange={(e) => update("local_logo_url", e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
          placeholder="https://... ending with .png/.jpg"
        />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <label>
          שם קהילה (HE)
          <input value={booklet.community_name_he} onChange={(e) => update("community_name_he", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>
        <label>
          Community (EN)
          <input value={booklet.community_name_en} onChange={(e) => update("community_name_en", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>

        <label>
          קהילה מקבילה (HE)
          <input value={booklet.partner_name_he} onChange={(e) => update("partner_name_he", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>
        <label>
          Partner (EN)
          <input value={booklet.partner_name_en} onChange={(e) => update("partner_name_en", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>

        <label>
          עיר (HE)
          <input value={booklet.city_he} onChange={(e) => update("city_he", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>
        <label>
          City (EN)
          <input value={booklet.city_en} onChange={(e) => update("city_en", e.target.value)} style={{ width: "100%", padding: 10, marginTop: 6 }} />
        </label>
      </div>

      <label style={{ display: "block", marginTop: 12 }}>
        מכתב פתיחה (HE)
        <textarea value={booklet.intro_he} onChange={(e) => update("intro_he", e.target.value)} rows={6} style={{ width: "100%", padding: 10, marginTop: 6 }} />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        Opening letter (EN)
        <textarea value={booklet.intro_en} onChange={(e) => update("intro_en", e.target.value)} rows={6} style={{ width: "100%", padding: 10, marginTop: 6 }} />
      </label>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
        <button onClick={save} style={{ padding: 12 }}>
          Save
        </button>
        <a href="/booklet" style={{ padding: 12 }}>
          Preview + Export PDF
        </a>
      </div>
    </div>
  )
}
