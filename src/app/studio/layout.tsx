import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/chibylims_favicon.png",
    apple: "/chibylims_favicon.png",
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
