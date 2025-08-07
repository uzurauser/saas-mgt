export default function PrintViewRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>コンプライアンスチェック帳票</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, background: '#fff' }}>
        {children}
      </body>
    </html>
  );
}
