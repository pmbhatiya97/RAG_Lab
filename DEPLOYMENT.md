# Deployment guide

## Local

Copy `.env.example` to `.env`, then run `docker compose up`. Add `--profile gpu` to start Ollama with NVIDIA GPU access. Pull a compatible model with `ollama pull nemotron-mini` or replace the UI model label with the exact model installed on your Ollama host.

## AWS

Build the app image, publish to ECR, run it on ECS/Fargate or EKS, store uploads in S3, use ElastiCache for job coordination, and keep keys in Secrets Manager. Put CloudFront and an HTTPS load balancer in front. Use Bedrock or a private Ollama/NVIDIA NIM service for generation.

## Azure

Publish to ACR and deploy to Container Apps or AKS. Use Blob Storage, Azure Cache for Redis, Key Vault, and Front Door. Azure OpenAI can be selected through the adapter layer.

## GCP

Publish to Artifact Registry and deploy to Cloud Run or GKE. Use Cloud Storage, Memorystore, Secret Manager, and Cloud CDN. Vertex AI can supply embeddings and generation.

For every cloud: enforce OAuth/SSO, per-team isolation, encryption, regional storage, rate limits, audit logs, health checks, metrics, backups, autoscaling and cost budgets before accepting real documents.
