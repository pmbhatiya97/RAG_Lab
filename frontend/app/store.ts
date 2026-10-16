import { create } from "zustand";

export type Config = { parser:string; chunker:string; embedder:string; db:string; index:string; query:string; retriever:string; reranker:string; llm:string; mode:string };

export const DEFAULT_CONFIG:Config = {parser:"Layout-aware",chunker:"Recursive",embedder:"NVIDIA NV-Embed-v2",db:"Qdrant",index:"HNSW",query:"Multi-query",retriever:"Hybrid · RRF",reranker:"Cross-encoder",llm:"Ollama · NVIDIA Nemotron",mode:"Naive RAG"};

type LabStore = {
  config: Config;
  history: Config[];
  updateConfig: (key:keyof Config,value:string)=>void;
  reset: ()=>void;
};

export const useLabStore=create<LabStore>((set)=>({
  config:DEFAULT_CONFIG,
  history:[],
  updateConfig:(key,value)=>set(s=>({history:[...s.history.slice(-9),s.config],config:{...s.config,[key]:value}})),
  reset:()=>set({config:DEFAULT_CONFIG,history:[]}),
}));
