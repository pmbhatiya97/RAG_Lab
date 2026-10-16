import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title:"RAG Lab — See every decision", description:"An interactive visual laboratory for learning, comparing and debugging retrieval-augmented generation pipelines.", icons:{icon:"/favicon.svg"} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
