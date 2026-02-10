# AI Image Generator SaaS

Neon → https://get.neon.com/L6XU2A5

Modal → https://bit.ly/4j1oyWJ

Eraser Diagram → https://app.eraser.io/workspace/aPTHfiNSoHLrQ7LAEACo?origin=share

Polar → https://polar.sh

Better Auth → https://better-auth.com

## 📌 Project Overview

In this project, we build a production-ready AI Image Generator SaaS from scratch using Next.js 16.
You’ll create a free, uncensored, browser-based text-to-image platform capable of generating high-quality, photorealistic images with strong instruction following.

The final result delivers output comparable to premium closed-source tools, but powered by a fast, modern, open-source image model.

We use Next.js 16 for the frontend, Z-Image Turbo for high-speed image generation, and Modal for serverless GPU inference.
Authentication is handled with Better Auth, payments and credits with Polar, and data storage with Neon (Postgres) + Prisma.
The app is fully deployed and ready for real users.

## ✅ Key Features

- Free & uncensored AI image generation
- Text-to-image prompts with strong instruction following
- Sub-second image generation using Z-Image Turbo
- Secure authentication (email & social logins)
- SaaS monetization & credit system with Polar
- Serverless GPU image generation with Modal
- Image storage & asset management with AWS (S3)
- Modern dashboard & landing page UI
- Fully responsive design with Tailwind CSS & shadcn/ui
- Full-stack deployment on Vercel

## 🧠 Built With

- Next.js 16 (App Router + Server Actions)
- Z-Image / Z-Image Turbo (Open-Source Image Generation)
- Modal (Serverless GPU Compute)
- AWS (Image Storage & Infrastructure)
- Tailwind CSS + shadcn/ui
- Neon + Prisma (PostgreSQL)
- Polar (Payments & Subscriptions)
- Better Auth (Authentication)

## 📁 Project Structure

- `frontend/` — Next.js app (UI, auth, dashboard, DB schema via Prisma)
- `backend/text-to-image/` — Modal FastAPI endpoint for GPU image generation + S3 upload

## 🚀 Local Development

### 1) Frontend (Next.js)

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in values in `frontend/.env` (do not commit secrets).

   Common variables you’ll need:
   - `DATABASE_URL` (Neon Postgres)
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` (e.g. `http://localhost:3000` for local)
   - `POLAR_ACCESS_TOKEN`
   - `POLAR_WEBHOOK_SECRET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET_NAME`
   - `MODAL_ZIMAGE_URL` (your deployed Modal endpoint URL)

4. Sync Prisma schema:

   ```bash
   npm run db:push
   # or
   npm run db:generate
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

App should be available at http://localhost:3000

### 2) Backend (Modal GPU inference)

The backend lives in `backend/text-to-image/` and deploys a Modal app that:

- loads the Z-Image Turbo pipeline
- generates images on GPU
- uploads PNGs to S3
- returns a public S3 URL

1. Install and authenticate Modal (one-time):

   ```bash
   pip install modal
   modal token new
   ```

2. Deploy the endpoint:

   ```bash
   cd backend/text-to-image
   modal deploy text-to-image.py
   ```

3. Configure Modal secrets/env:
   - Create a Modal Secret for AWS credentials (and optionally a Hugging Face token)
   - Set `MODAL_S3_SECRET_NAME` if you use a non-default secret name

4. Copy the deployed endpoint URL into `frontend/.env` as `MODAL_ZIMAGE_URL`.

## 💳 Credits & Payments (Polar)

Polar is wired into Better Auth via the `@polar-sh/better-auth` plugin.
You’ll need:

- a Polar account + access token
- webhook secret configured
- product IDs in the auth configuration

## 🗺️ Architecture

See the system diagram here:

Eraser Diagram → https://app.eraser.io/workspace/aPTHfiNSoHLrQ7LAEACo?origin=share

## 📎 Useful Links

Neon → https://get.neon.com/L6XU2A5

Modal → https://bit.ly/4j1oyWJ

Polar → https://polar.sh

Better Auth → https://better-auth.com
