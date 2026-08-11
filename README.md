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
- Next.js with App Router and TypeScript
- Tailwind CSS for styling, shadcn/ui for accessible components
- Context API for user preferences state
- Pages: product listing (`/`) and product detail (`/products/[id]`)

### Backend / API Structure
- Express.js with TypeScript, running on port 3001
- RESTful routes: `/api/products`, `/api/products/:id`, `/api/products/:id/confidence`, `/api/products/:id/alternatives`
- Service layer handles confidence calculation and alternative matching
- CORS enabled for frontend communication

### Data Model
- `products.json` — id, name, description, category, brandId, basePrice, variants (size, color, stock, measurements)
- `brands.json` — id, name, deliveryStats (totalOrders, onTimeOrders, avgDeliveryDays)
- `users.json` — id, preferences (sizes, payment type, delivery type)

### Key Technical Decisions
- JSON files loaded into memory at startup — no database, no ORM, zero config
- Confidence data served from a separate endpoint so product detail stays cacheable
- Measurements (cm) used for cross-brand size matching instead of relying on label names
- Alternatives computed server-side where stock, price, and delivery data is available

### Important Assumptions
- Single mock user, no authentication required
- All data is static and loaded at server startup
- Prices are in PKR (Pakistani Rupees)

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

<!-- Fill after implementation -->

- **Tests Added:**
- **Test Priorities:**

## 7. Tradeoffs

<!-- Fill after implementation -->

-

## 8. Future Improvements

<!-- Fill after implementation -->

-

## 9. AI Usage

<!-- Fill after implementation -->

- **AI Tools Used:**
- **What AI Helped Generate / Reason Through:**
- **What Was Manually Reviewed / Changed:**
- **Example of AI Output Correction / Rejection:**
