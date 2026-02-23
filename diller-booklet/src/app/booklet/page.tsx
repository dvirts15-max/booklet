"use client"

import React from "react"
import { supabase } from "@/lib/supabase"

type Lang = "he" | "en"
const tr = (lang: Lang, he: string, en: string) => (lang === "he" ? he : en)

export default function BookletPage() {
  const [msg, setMsg] = React.useState("טוען...")
  const [template, setTemplate] = React.useState<any>(null)
  const [booklet, setBooklet] = React.useState<any>(null)

  React.useEffect(() => {
    ;(async () => {
      setMsg("טוען...")
      const { data: sessionData } = await supabase.auth.getSession()
      const uid = sessionData.session?.user?.id
      if (!uid) return setMsg("לא מחובר. כנס ל /login")

      const { data: t, error: tErr } = await supabase
        .from("booklet_template")
        .select("*")
        .limit(1)
        .single()
      if (tErr || !t) return setMsg("אין תבנית בטבלה booklet_template")

      const { data: b, error: bErr } = await supabase
        .from("booklets")
        .select("*")
        .eq("owner_user_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      if (bErr || !b) return setMsg("אין חוברת משויכת. פנה לאדמין.")

      setTemplate(t)
      setBooklet(b)
      setMsg("")
    })()
  }, [])

  if (!template || !booklet) return <div style={{ padding: 24 }}>{msg}</div>

  const lang: Lang = (booklet.lang as Lang) || "he"
  const dir = lang === "he" ? "rtl" : "ltr"

  const community = lang === "he" ? booklet.community_name_he : booklet.community_name_en
  const partner = lang === "he" ? booklet.partner_name_he : booklet.partner_name_en
  const city = lang === "he" ? booklet.city_he : booklet.city_en
  const intro = lang === "he" ? booklet.intro_he : booklet.intro_en

  const goals = lang === "he" ? template.goals_he : template.goals_en
  const safety = lang === "he" ? template.safety_he : template.safety_en
  const health = lang === "he" ? template.health_he : template.health_en
  const coc = lang === "he" ? template.coc_he : template.coc_en

  const logoUrl: string = booklet.local_logo_url || ""

  return (
    <div style={{ background: "#f3f3f3", padding: 16 }}>
      <style>{`
        :root { --page-w: 210mm; --page-h: 297mm; }
        .root { direction: ${dir}; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #111; }
        .bar { display:flex; justify-content:flex-end; gap:10px; margin-bottom:12px; flex-wrap:wrap; }
        .btn { padding: 10px 12px; border: 1px solid #111; background: #fff; cursor:pointer; border-radius: 10px; text-decoration:none; color:#111; }
        .page { width: var(--page-w); min-height: var(--page-h); margin: 0 auto 14px; background: #fff; position: relative; padding: 18mm 16mm 18mm; box-sizing: border-box; overflow:hidden; }
        .header { position:absolute; top:10mm; left:16mm; right:16mm; display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .footer { position:absolute; bottom:10mm; left:16mm; right:16mm; display:flex; justify-content:space-between; font-size:12px; opacity:.85; }
        .logo { width:44mm; height:16mm; object-fit:contain; }
        .content { margin-top: 58px; }
        .h1 { font-size: 28px; margin: 0 0 8px; font-weight: 800; }
        .h2 { font-size: 18px; margin: 0 0 10px; opacity: .9; font-weight: 700; }
        .title { font-size: 16px; font-weight: 800; margin: 0 0 10px; }
        .p { font-size: 14px; line-height: 1.65; white-space: pre-wrap; margin: 0 0 10px; }
        .muted { opacity: .75; }

        @media print {
          @page { size: A4; margin: 0; }
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page { margin: 0; page-break-after: always; border: none; }
        }
      `}</style>

      <div className="root">
        <div className="bar no-print">
          <button className="btn" onClick={() => window.print()}>
            {tr(lang, "ייצוא ל־PDF", "Export PDF")}
          </button>
          <a className="btn" href="/edit">{tr(lang, "עריכה", "Edit")}</a>
          <a className="btn" href="/dashboard">{tr(lang, "דשבורד", "Dashboard")}</a>
        </div>

        {/* Page 1 */}
        <div className="page">
          <div className="header">
            <div style={{ fontWeight: 800 }}>{tr(lang, "עמיתי דילר", "Diller Teen Fellows")}</div>
            {logoUrl ? (
              <img className="logo" src={logoUrl} alt="Local logo" />
            ) : (
              <div className="muted">{tr(lang, "לוגו מקומי", "Local logo")}</div>
            )}
          </div>

          <div className="content">
            <div className="h1">{tr(lang, "סמינר קיץ", "Summer Seminar")} {booklet.year}</div>
            <div className="h2">{community || tr(lang, "שם קהילה", "Community name")}</div>
            <div className="p muted">{city || tr(lang, "עיר", "City")}</div>

            <div style={{ marginTop: 18, borderTop: "1px solid #ddd", paddingTop: 12 }}>
              <div className="title">{tr(lang, "על החוברת", "About this handbook")}</div>
              <div className="p">
                {tr(
                  lang,
                  "החוברת נועדה לתת מידע מרכזי להורים ולמשפחות לקראת סמינר הקיץ, כולל תכנים, נהלים, בטיחות, בריאות וערוצי קשר.",
                  "This handbook provides key information for families ahead of the Summer Seminar, including program overview, policies, safety, health, and contact channels."
                )}
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="muted">{tr(lang, "מקום ללוגו מקומי", "Space for local logo")}</div>
            <div>{tr(lang, "עמוד 1", "Page 1")}</div>
          </div>
        </div>

        {/* Page 2 */}
        <div className="page">
          <div className="header">
            <div style={{ fontWeight: 800 }}>{tr(lang, "חוברת הורים", "Family Handbook")}</div>
            {logoUrl ? <img className="logo" src={logoUrl} alt="Local logo" /> : <div className="muted">{tr(lang, "לוגו מקומי", "Local logo")}</div>}
          </div>

          <div className="content">
            <div className="title">{tr(lang, "מכתב פתיחה", "Opening Letter")}</div>
            <div className="p">{intro || tr(lang, "הדבק כאן את מכתב הפתיחה שלך", "Paste your opening letter here")}</div>

            <div style={{ marginTop: 14 }}>
              <div className="p muted">
                {tr(lang, "קהילה מקבילה:", "Partner community:")} {partner || tr(lang, "שם קהילה מקבילה", "Partner name")}
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="muted">{city || ""}</div>
            <div>{tr(lang, "עמוד 2", "Page 2")}</div>
          </div>
        </div>

        {/* Page 3 */}
        <div className="page">
          <div className="header">
            <div style={{ fontWeight: 800 }}>{tr(lang, "מטרות ועוגנים", "Goals")}</div>
            {logoUrl ? <img className="logo" src={logoUrl} alt="Local logo" /> : <div className="muted">{tr(lang, "לוגו מקומי", "Local logo")}</div>}
          </div>
          <div className="content">
            <div className="title">{tr(lang, "מטרות ועוגנים של סמינר הקיץ", "Goals and Anchors")}</div>
            <div className="p">{goals || tr(lang, "הדבק כאן טקסט מטרות בעברית", "Paste goals text in English here")}</div>
          </div>
          <div className="footer">
            <div className="muted">{tr(lang, "עמיתי דילר", "Diller Teen Fellows")}</div>
            <div>{tr(lang, "עמוד 3", "Page 3")}</div>
          </div>
        </div>

        {/* Page 4 */}
        <div className="page">
          <div className="header">
            <div style={{ fontWeight: 800 }}>{tr(lang, "בטחון ובטיחות", "Safety")}</div>
            {logoUrl ? <img className="logo" src={logoUrl} alt="Local logo" /> : <div className="muted">{tr(lang, "לוגו מקומי", "Local logo")}</div>}
          </div>
          <div className="content">
            <div className="title">{tr(lang, "בטחון ובטיחות", "Safety")}</div>
            <div className="p">{safety || tr(lang, "הדבק כאן טקסט בטיחות בעברית", "Paste safety text in English here")}</div>
          </div>
          <div className="footer">
            <div className="muted">{tr(lang, "נהלים", "Policies")}</div>
            <div>{tr(lang, "עמוד 4", "Page 4")}</div>
          </div>
        </div>

        {/* Page 5 */}
        <div className="page">
          <div className="header">
            <div style={{ fontWeight: 800 }}>{tr(lang, "בריאות ורפואה", "Health")}</div>
            {logoUrl ? <img className="logo" src={logoUrl} alt="Local logo" /> : <div className="muted">{tr(lang, "לוגו מקומי", "Local logo")}</div>}
          </div>
          <div className="content">
            <div className="title">{tr(lang, "בריאות ורפואה", "Health")}</div>
            <div className="p">{health || tr(lang, "הדבק כאן טקסט בריאות בעברית", "Paste health text in English here")}</div>
          </div>
          <div className="footer">
            <div className="muted">{tr(lang, "בריאות", "Health")}</div>
            <div>{tr(lang, "עמוד 5", "Page 5")}</div>
          </div>
        </div>

        {/* Page 6 */}
        <div className="page">
          <div className="header">
            <div style={{ fontWeight: 800 }}>{tr(lang, "קוד התנהגות", "Code of Conduct")}</div>
            {logoUrl ? <img className="logo" src={logoUrl} alt="Local logo" /> : <div className="muted">{tr(lang, "לוגו מקומי", "Local logo")}</div>}
          </div>
          <div className="content">
            <div className="title">{tr(lang, "קוד התנהגות", "Code of Conduct")}</div>
            <div className="p">{coc || tr(lang, "הדבק כאן קוד התנהגות בעברית", "Paste code of conduct in English here")}</div>
          </div>
          <div className="footer">
            <div className="muted">{tr(lang, "קהילה", "Community")}: {community || ""}</div>
            <div>{tr(lang, "עמוד 6", "Page 6")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
