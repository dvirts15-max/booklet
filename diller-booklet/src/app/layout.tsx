export const metadata = {
  title: "Diller Booklet System",
  description: "Booklet generator"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
