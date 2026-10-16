"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLabStore, type Config } from "../store";
import { METHOD_INFO, methodInfo } from "../method-descriptions";

type Choice={value:string;title:string;what:string;effect:string;tag?:string};
const CHOICES:Partial<Record<keyof Config,Choice[]>>={
  chunker:[
    {value:"Recursive",title:"Recursive chunking",what:"Splits text at natural boundaries such as headings, paragraphs, and sentences.",effect:"Changing this rebuilds chunks, embeddings, the index, retrieval, reranking, and answers.",tag:"Balanced"},
    {value:"Semantic",title:"Semantic chunking",what:"Uses meaning shifts rather than character count to find boundaries.",effect:"Usually creates fewer, more coherent chunks, but adds embedding time and cost.",tag:"Best quality"},
    {value:"Parent-child",title:"Parent–child chunking",what:"Retrieves small precise children, then returns their larger parent context.",effect:"Improves context completeness while increasing stored records and retrieval logic."},
    {value:"Sentence",title:"Sentence chunking",what:"Keeps every sentence intact as an independent searchable unit.",effect:"Raises precision but can lose surrounding context unless sentence-window retrieval is enabled."},
  ],
  embedder:[
    {value:"NVIDIA NV-Embed-v2",title:"NVIDIA NV-Embed-v2",what:"A high-quality retrieval embedding model suited to multilingual and instruction-aware search.",effect:"Vectors and the full index are rebuilt. Expect strong recall and higher local GPU memory use.",tag:"Recommended"},
    {value:"Hugging Face BGE-M3",title:"BGE-M3 via Hugging Face",what:"A multilingual model supporting dense, sparse, and multi-vector retrieval styles.",effect:"Re-embeds all chunks. Useful when documents mix languages or retrieval types."},
    {value:"OpenAI text-embedding-3",title:"OpenAI text-embedding-3",what:"Hosted embeddings with configurable dimensions and broad language support.",effect:"Sends chunk text to OpenAI and incurs usage cost; all vectors are regenerated."},
    {value:"Local MiniLM",title:"Local MiniLM",what:"A small local embedding model that works well for demos and private offline use.",effect:"Runs without a key and is fast, but retrieval quality may be lower on specialist material."},
  ],
  retriever:[
    {value:"Hybrid · RRF",title:"Hybrid retrieval with RRF",what:"Combines semantic vector search with exact keyword search, then merges both rankings.",effect:"Improves robust recall for names and technical terms at the cost of two searches.",tag:"Recommended"},
    {value:"Dense",title:"Dense retrieval",what:"Finds chunks whose vector meaning is close to the query.",effect:"Fast and semantic, but may miss exact IDs, uncommon names, and codes."},
    {value:"BM25",title:"BM25 keyword retrieval",what:"Scores exact and rare word overlap without embeddings.",effect:"Very explainable and cheap, but does not understand paraphrases."},
    {value:"MMR",title:"Maximal marginal relevance",what:"Balances relevance against similarity between selected results.",effect:"Returns more diverse context and reduces duplicate evidence."},
  ],
  llm:[
    {value:"Ollama · NVIDIA Nemotron",title:"NVIDIA Nemotron through Ollama",what:"Runs a Nemotron-family model on your own Ollama server and supported GPU.",effect:"Document context stays local. Speed and quality depend on the installed model and hardware.",tag:"Private"},
    {value:"Ollama · Llama 3.3",title:"Llama 3.3 through Ollama",what:"Local open-weight generation using your installed Ollama model.",effect:"Only generation reruns. No hosted API cost, but local RAM or VRAM is required."},
    {value:"Hugging Face · Qwen 2.5",title:"Qwen 2.5 via Hugging Face",what:"Uses a Hugging Face inference endpoint for strong multilingual answers.",effect:"Only generation reruns and context leaves your computer for the configured endpoint."},
    {value:"GPT-5",title:"GPT via OpenAI",what:"Uses OpenAI for hosted answer generation.",effect:"Only the final answer reruns; latency and usage cost depend on the selected model."},
  ],
  db:[
    {value:"Qdrant",title:"Qdrant",what:"An open-source vector database with filtering, hybrid search, and local Docker support.",effect:"The index is rebuilt in Qdrant; retrieval and answers rerun.",tag:"Local-ready"},
    {value:"Pinecone",title:"Pinecone",what:"A managed vector database designed for hosted, scalable similarity search.",effect:"Vectors are uploaded to a managed service and may create storage/query costs."},
    {value:"Chroma",title:"Chroma",what:"A developer-friendly local vector store for prototypes and smaller collections.",effect:"Keeps setup simple but is less suited to large multi-user production workloads."},
    {value:"FAISS",title:"FAISS",what:"A fast in-process vector index without a database server.",effect:"Search stays local and fast; metadata filtering and durable multi-user storage are limited."},
  ],
  mode:[
    {value:"Naive RAG",title:"Naive RAG",what:"Retrieve once, place the best chunks in the prompt, and generate an answer.",effect:"Lowest latency and cost; best baseline for comparison.",tag:"Start here"},
    {value:"Graph RAG",title:"Graph RAG",what:"Extracts entities and relationships so queries can traverse multi-hop facts.",effect:"Adds graph-building cost and latency but improves relationship-heavy questions."},
    {value:"SQL RAG",title:"SQL RAG",what:"Translates questions into read-only SQL against structured data.",effect:"Adds schema linking and safety checks; ideal for exact aggregations."},
    {value:"Agentic RAG",title:"Agentic RAG",what:"Lets an agent plan, choose tools, inspect results, and retry.",effect:"Handles complex tasks but uses more tokens, takes longer, and needs a loop limit."},
  ]
};

const providers=[
  {id:"ollama",name:"Ollama",hint:"No key required",models:"Nemotron · Llama · Mistral",color:"#66a984"},
  {id:"huggingface",name:"Hugging Face",hint:"Token",models:"BGE · Qwen · thousands more",color:"#e0a83b"},
  {id:"openai",name:"OpenAI",hint:"API key",models:"GPT · text-embedding",color:"#65a899"},
  {id:"anthropic",name:"Anthropic",hint:"API key",models:"Claude",color:"#cc8664"},
  {id:"nvidia",name:"NVIDIA NIM",hint:"API key or local URL",models:"Nemotron · NV-Embed",color:"#78a942"},
  {id:"cohere",name:"Cohere",hint:"API key",models:"Embed · Rerank · Command",color:"#8a72bf"},
];

function ChoiceField({kind,label}:{kind:keyof Config;label:string}){
  const config=useLabStore(s=>s.config); const update=useLabStore(s=>s.updateConfig); const options=Object.keys(METHOD_INFO[kind]||{}); const selected=methodInfo(kind,config[kind]);
  return <div className="model-field"><label>{label}<select value={config[kind]} onChange={e=>update(kind,e.target.value)}>{options.map(value=><option value={value} key={value}>{value}</option>)}</select></label><div className="selection-explain"><div><b>{config[kind]}</b><p>{selected.what}</p></div><div className="choice-process"><strong>How it processes</strong><p>{selected.process}</p></div><div className="effect"><i>↳</i><p><strong>What happens:</strong> {selected.effect}</p></div><div className="choice-fit"><span><b>Best for</b>{selected.best}</span><span><b>Watch for</b>{selected.watch}</span></div></div></div>
}

export default function Settings(){
 const [provider,setProvider]=useState("ollama"); const [key,setKey]=useState(""); const [endpoint,setEndpoint]=useState("http://localhost:11434"); const [status,setStatus]=useState<"idle"|"testing"|"ok"|"error">("idle"); const [saved,setSaved]=useState(false);
 useEffect(()=>{const raw=sessionStorage.getItem(`raglab:${provider}`);if(raw){const data=JSON.parse(raw);setKey(data.key||"");setEndpoint(data.endpoint||"")}else{setKey("");setEndpoint(provider==="ollama"?"http://localhost:11434":"")}},[provider]);
 const current=useMemo(()=>providers.find(p=>p.id===provider)!,[provider]);
 function save(){sessionStorage.setItem(`raglab:${provider}`,JSON.stringify({key,endpoint}));setSaved(true);setTimeout(()=>setSaved(false),1800)}
 async function test(){setStatus("testing");try{const r=await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:8000"}/api/connectors/test`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({provider,api_key:key||null,base_url:endpoint||null})});setStatus(r.ok?"ok":"error")}catch{setStatus("error")}}
 return <main className="settings-page"><header className="settings-nav"><Link href="/" className="welcome-brand"><span>R</span> RAGLAB</Link><nav><Link href="/lab">Pipeline</Link><Link href="/agentic">Agentic RAG</Link><Link className="active" href="/settings">Settings</Link></nav><Link href="/lab" className="back-lab">Back to lab →</Link></header>
  <section className="settings-shell"><aside><span>SETTINGS</span><a href="#connections" className="active">⌁ Connections</a><a href="#models">✦ Pipeline models</a><a href="#behavior">⌘ Retrieval behavior</a><a href="#privacy">◈ Privacy & keys</a><div className="privacy-note"><b>Keys stay private</b><p>Browser-entered keys live only in this tab. They are never written to logs or source files.</p></div></aside>
  <div className="settings-content"><div className="settings-title"><span>WORKSPACE SETTINGS</span><h1>Models & connections</h1><p>Choose what powers each stage. Every option explains what it does and exactly what changes when selected.</p></div>
   <section id="connections" className="settings-card"><div className="card-heading"><div><span>01</span><h2>Provider connections</h2><p>Connect local runtimes or hosted APIs.</p></div><b>{providers.length} providers</b></div><div className="provider-grid">{providers.map(p=><button key={p.id} onClick={()=>{setProvider(p.id);setStatus("idle")}} className={provider===p.id?"selected":""}><i style={{background:p.color}}>{p.name[0]}</i><span><b>{p.name}</b><small>{p.models}</small></span><em>{p.hint}</em></button>)}</div>
    <div className="credential-box"><div className="credential-title"><i style={{background:current.color}}>{current.name[0]}</i><div><b>Connect {current.name}</b><span>{current.models}</span></div><small className={status}>{status==="ok"?"● Connected":status==="error"?"● Check failed":status==="testing"?"Testing…":"Not tested"}</small></div><label>API endpoint<input value={endpoint} onChange={e=>setEndpoint(e.target.value)} placeholder={provider==="ollama"?"http://localhost:11434":"Optional custom endpoint"}/><small>The backend calls this address. Use localhost for Ollama or your organization&apos;s private endpoint.</small></label>{provider!=="ollama"&&<label>API key<div className="key-input"><input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder={`Paste ${current.name} key`}/><span>Session only</span></div><small>Stored in browser session memory for this tab. Closing the tab clears it.</small></label>}<div className="credential-actions"><button onClick={test} className="test-button">{status==="testing"?"Testing…":"Test connection"}</button><button onClick={save} className="save-button">{saved?"Saved ✓":"Save for this session"}</button></div></div>
   </section>
   <section id="models" className="settings-card"><div className="card-heading"><div><span>02</span><h2>Pipeline models</h2><p>These choices update the Active Pipeline everywhere.</p></div></div><div className="fields-grid"><ChoiceField kind="embedder" label="EMBEDDING MODEL"/><ChoiceField kind="llm" label="GENERATION MODEL"/><ChoiceField kind="mode" label="RAG MODE"/><ChoiceField kind="chunker" label="CHUNKING STRATEGY"/></div></section>
   <section id="behavior" className="settings-card"><div className="card-heading"><div><span>03</span><h2>Every pipeline method</h2><p>Configure each stage. The description below every selection updates immediately.</p></div></div><div className="fields-grid"><ChoiceField kind="parser" label="DOCUMENT PARSER"/><ChoiceField kind="db" label="VECTOR DATABASE"/><ChoiceField kind="index" label="INDEX ALGORITHM"/><ChoiceField kind="query" label="QUERY STRATEGY"/><ChoiceField kind="retriever" label="RETRIEVAL STRATEGY"/><ChoiceField kind="reranker" label="RERANKING METHOD"/></div></section>
   <section id="privacy" className="security-card"><span>◈</span><div><b>Local-first security</b><p>Use `.env` for persistent server keys. Keys entered above are session-only. RAG Lab never prints API keys in logs or sends them to analytics.</p></div><Link href="/lab">Return to pipeline →</Link></section>
  </div></section>
 </main>
}
