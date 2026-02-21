# ResearchPro AI - Academic Research Assistant SaaS

ResearchPro AI is a production-ready, AI-powered platform designed to assist doctoral-level researchers, students, and academic professionals in developing and writing high-quality thesis and research papers while maintaining strict academic integrity.

## 🚀 Key Features

- **Topic Idea Generation**: Quick brainstorming using Groq API.
- **Thesis Builder**: Multi-step workflow (Abstract, Intro, Lit Review, etc.) with PhD-level AI assistance.
- **Citation Manager**: DOI lookup via CrossRef and auto-formatting (APA/MLA/Chicago).
- **Literature Explorer**: RAG-based search using OpenAI Embeddings and pgvector.
- **Plagiarism Checker**: Integration with Copyleaks for similarity and AI detection.
- **PPT Generator**: Auto-generate research presentations from your thesis content.
- **Export System**: Professional exports in PDF, DOCX, and PPTX formats.
- **Subscription Billing**: Secure payments and recurring billing via Razorpay.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, ShadCN UI.
- **Backend**: Next.js API Routes, Prisma ORM, Neon PostgreSQL (pgvector).
- **AI**: OpenAI API (GPT-4), Groq API (Llama 3), OpenAI Embeddings.
- **Storage**: Cloudinary & Upstash Redis.
- **Auth**: NextAuth.js.

## 🛠 Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd thesis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file and add the following:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   
   OPENAI_API_KEY="..."
   GROQ_API_KEY="..."
   COPYLEAKS_API_KEY="..."
   
   CLOUDINARY_CLOUD_NAME="..."
   CLOUDINARY_API_KEY="..."
   CLOUDINARY_API_SECRET="..."
   
   RAZORPAY_KEY_ID="..."
   RAZORPAY_KEY_SECRET="..."
   
   UPSTASH_REDIS_REST_URL="..."
   UPSTASH_REDIS_REST_TOKEN="..."
   ```

4. **Database Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run Locally**:
   ```bash
   npm run dev
   ```

## 📐 Architecture

- **Hybrid AI Strategy**: Groq for speed (structuring, topics) and OpenAI for depth (writing, analysis).
- **RAG Flow**: Documents -> OpenAI Embeddings -> PGVector -> Context Retrieval -> AI Generation.
- **Usage Limits**: Managed via Redis for real-time word count tracking per subscription plan.

## 🛡 Security & Compliance

- Password hashing with Bcrypt.
- JWT session management.
- Razorpay Webhook signature validation.
- Prompt engineering to prevent fabrication (Hallucination checks).

---
Developed as a Master Development Prompt Project.
