export default function PrintViewRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <title>クラウドサービス モニタリング報告書</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, background: "#fff" }}>{children}</body>
    </html>
  )
}
