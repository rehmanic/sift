# Sift — Purchase Confidence for LAAM

## 1. Problem Understanding

Customers on LAAM browse many similar fashion products but drop off before purchasing because they can't quickly answer basic questions: Is my size in stock? What will I actually pay? Will it arrive on time? Are there better options?

This project builds a Purchase Confidence Panel on the Product Details Page that answers all these questions at a glance, reducing drop-offs caused by uncertainty rather than disinterest.

## 2. Scope

### Built
- Product listing page with category and price filters
- Product Details Page with a Purchase Confidence Panel
- Confidence signals: availability/size, pricing breakdown, delivery estimate, alternatives
- User preferences (size, payment type, delivery type) stored for auto-selection
- REST API serving product, brand, and user data
- Mock data via JSON files

### Deferred
- Auth and user accounts — single mock user, no login needed
- Checkout and payments — focus is on the decision stage, not the transaction
- Real-time inventory — static mock data, production would use webhooks
- Notify Me emails — UI only, backend is a stub
- Search — users navigate via category filters
- Mobile responsive — desktop-first for this time box

## 3. User Flow

- **Browse:** User lands on the listing page, filters by category or price range.
- **Select:** User clicks a product card, Product Details Page opens.
- **Assess:** Confidence Summary banner instantly shows availability, price, and delivery info.
- **Decide:** All signals green — proceed to Add to Cart. Any signal unfavorable — scroll to Alternatives.
- **Pivot:** User clicks an alternative, its own Product Details Page loads with a fresh Confidence Panel.

## 4. Technical Approach

### Frontend Structure
- Next.js (App Router) with TypeScript and Tailwind CSS
- shadcn/ui components for clean UI elements
- React Context API for managing user preferences state
- Pages: Product catalog listing (`/`) and Product Details Page (`/products/[id]`)

### Backend / API Structure
- Express.js with TypeScript running on port 3001
- REST endpoints: `/api/products`, `/api/products/:id`, `/api/products/:id/confidence`, `/api/products/:id/alternatives`
- Service-based architecture separating routing, confidence calculation, and alternative recommendation logic
- CORS configured for frontend communication

### Data Model
- `products.json`: Product metadata, categories, brand ID, pricing, and variants with physical measurements
- `brands.json`: Brand details and delivery performance metrics (total orders, on-time rate, average delivery days)
- `users.json`: User profile and size/payment/delivery preferences

### Key Technical Decisions
- Memory-cached JSON data for zero-config local execution
- Decoupled confidence calculation endpoint to keep core product details cacheable
- Physical measurements (cm) for accurate cross-brand size matching rather than raw size labels
- Server-side alternative generation where stock, price, and delivery data are computed together

### Important Assumptions
- Single user context without authentication requirements
- Prices formatted in PKR (Pakistani Rupees)
- Static dataset loaded at server startup

## 5. How to Run

### Prerequisites
- Node.js v18+
- npm

### Backend (Express — port 3001)
```bash
cd be
npm install
npm run dev
```

### Frontend (Next.js — port 3000)
```bash
cd fe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. Tests

- **Testing Strategy**: Manual end-to-end black-box testing was conducted across key user journeys (catalog filtering, PDP confidence scoring, user preference updates, and alternative product recommendations).
- **Rationale**: As a Proof of Concept (PoC) designed to validate user decision confidence and UX patterns, black-box testing was prioritized for rapid iteration over building unit test infrastructure.
- **Priority Test Focus**: If implementing automated tests next, initial priority would be unit testing backend business logic in `productService.ts` (cross-brand size measurement matching, stacked pricing calculations, and alternative recommendation filtering) to prevent core scoring regressions.

## 7. Tradeoffs

- **In-Memory JSON Data**: Selected for zero setup friction during evaluation instead of setting up a database.
- **Static Mock Data**: Used static inventory and delivery statistics instead of live seller API integrations.
- **Single Mock User**: Focused effort on core confidence scoring features rather than user auth and session handling.
- **Desktop-First Priority**: Optimized UI for desktop PDP views within the project time box.

## 8. Future Improvements

- **Database & ORM**: Migrate JSON files to PostgreSQL or MongoDB with Prisma/Drizzle.
- **User Authentication**: Implement multi-user auth and persistent profile management.
- **Real-Time Inventory**: Connect live webhooks for stock updates and seller delivery metrics.
- **Notification Services**: Implement email and SMS alerts for "Notify Me" requests.
- **Mobile Responsiveness**: Complete mobile-optimized layouts for all screens.

## 9. AI Usage

- **Tool Used**: Google's Antigravity-IDE.
- **What AI Helped Generate**: AI generated initial project scaffolding, directory layout, and boilerplate component structures to save setup time.
- **What Was Manually Done**: Requirements analysis and solution brainstorming were performed 100% manually (documented in `BRAINSTORM.md`). All AI-generated code was reviewed, refactored, and tested manually.
- **Correction / Rejection Example**: The initial AI boilerplate proposed an over-engineered enterprise architecture with superfluous abstraction layers. I rejected the extra boilerplate and refactored it into a clean, single-tier Express service architecture.
- **Audit Trail**: Recorded automatically by Antigravity-IDE transcript logs (`.system_generated/logs/transcript.jsonl`).
