import Link from "next/link";

const nodes=["DOCUMENTS","CHUNKS","VECTORS","SEARCH","CONTEXT","ANSWER"];

export default function Welcome(){return <main className="welcome-page">
  <nav className="welcome-nav"><Link href="/" className="welcome-brand"><span>R</span> RAGLAB</Link><div><Link href="/agentic">Agentic RAG</Link><Link href="/settings">Model settings</Link><Link href="/lab" className="nav-launch">Open lab →</Link></div></nav>
  <section className="hero-stage">
    <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="glow glow-one"/><div className="glow glow-two"/>
    <div className="hero-copy"><span className="hero-kicker"><i/> THE VISUAL RAG WORKBENCH</span><h1 aria-label="RAGLAB"><span>R</span><span>A</span><span>G</span><em>LAB</em></h1><p>Watch your documents become answers—one decision, one vector, one citation at a time.</p><div className="hero-actions"><Link href="/lab">Enter the pipeline <b>→</b></Link><Link href="/settings" className="secondary">Configure models</Link></div><small>LOCAL-FIRST · PRIVATE KEYS · OLLAMA + NVIDIA + HUGGING FACE</small></div>
    <div className="pipeline-scene"><div className="scene-line"/>{nodes.map((n,i)=><div className={`scene-node n${i}`} key={n}><span>{["▤","✂","⌁","◎","⇅","✦"][i]}</span><b>{n}</b><i/></div>)}<div className="data-pulse p1"/><div className="data-pulse p2"/><div className="data-pulse p3"/></div>
  </section>
  <section className="welcome-foot"><div><b>09</b><span>visible stages</span></div><div><b>20+</b><span>model providers</span></div><div><b>100%</b><span>traceable answers</span></div><p>Built for learning deeply—and debugging quickly.</p></section>
 </main>}
