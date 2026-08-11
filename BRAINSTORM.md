
# Problem

A potential buyer visits Laam looking for a fashion product like **embroidered lawn kurta**.  
He searches for this item and can see results with many products from different sellers.  
He likes one of them and navigates to its details page.
Now he has the following question in his minds about the product and its delivery:

- *"Is this even available in my size?"*
- *"The listed price says Rs. 5,000, but what will I actually pay after discounts, shipping, and taxes?"*
- *"This brand says 3–5 day delivery, but will it actually arrive on time?"*
- *"If this doesn't work out, are there similar options?"*



This information maybe absent or scattered across the product details page and requires the user to dig through multiple sections to piece together.  
The result is a **drop-off before add-to-cart or checkout**. It's not because the user disliked the product, but because they couldn't confidently answer basic purchase questions.

### The Goal
This problem requires a UX that should answer all these purchase questions in a compact way. The user must get his answers at a glance.

---

# Solution: Purchase Confidence Panel

A dedicated panel on the Product Details Page that answers every purchase question in one place.

## Confidence Summary

A human-readable banner at the top of the Product Description Page that acts as a **decision accelerator**:

  - SUCCESS ✅: *"Available in your size S. You'd pay Rs. 4,500 (10% off + free shipping). Arrives by Aug 15 if ordered before Midnight today. The On-time delivery rate for this brand is 99%."*
  - FAILURE ℹ️: *"Your size M is out of stock. Price is Rs. 5,200 (above your Rs. 5,000 budget). 2 similar kurtas are available in your size and budget, see alternatives below."*

This summary is **dynamically generated** from the signals below.

## Confidence Signals

### 1. Availability & Size


Product Stock Statuses:

- **In Stock** | Green badge, all actions enabled.  
- **Low Stock** | ≤ 5 units, amber badge, all actions enabled, show count in this case with size.  
- **Out of Stock** | Red badge, size selection, add to cart and buy now actions disabled, expected restock date + "Notify Me" button enabled. Show available alternatives in same size.


**Edge case: cross-brand sizing**: Brands use inconsistent size labels. A chino with waist 30 from brand A can fit you perfectly but that might not be the case for brand B.  
In this case user's size from preferences would be used to determine right size for him for the given brand and size would be auto-selected.

### 2. Pricing
The user should be shown the exact amount he would pay, including prices that may show up later.  
Prices may add up after adding to cart and during checkout based on delivery type(instant/standard) or payment method (card/cash/e-wallet).  
To show them in product details page they must be stored in preferences.  

The following factors can affect the **Original product price**:  

- Discounts (can stack, could be seasonal off etc)  
- Shipping  
- Taxes  

Show user the exact amount in bold with optional breakdown view.

### 3. Delivery

User should be shown an **estimated delivery date** relative to the current time: *"Order today before midnight for delivery by Aug 15."*
User should be shown brand's **on-time delivery rate** from historical data with a color-coded badge:
  - 🟢  ≥ 90% — "Highly reliable"
  - 🟡 70–89% — "Usually on time"
  - 🔴 < 70% — "Frequently delayed"

### 4. Alternatives
The user should be shown alternatives automatically when **any** confidence signal is unfavorable:
- Product out of stock.
- User's size unavailable.
- Price above user's applied filter range.
- Delivery rate below 80%.

Each alternative card should show a **comparison reason**: *"Same style, Rs. 300 less, your size in stock."*
If no alternatives match the user's filters then he should be informed about it transparently.

## User Preferences

User preferences such as sizes, payment type, delivery type should be stored in the app.  
It would be like one time investment and would save user from manually selecting these details again & again.
It would also power the Purchase Confidence Panel automatically.

---

# User Flow

1. **Browse** — User lands on the listing page, optionally filters by category and price range.
2. **Select** — User clicks a product card and Product Description Page opens.
3. **Assess** — Confidence Summary banner instantly answers: available? size? price? delivery?
4. **Decide** — If it Signals green then "Add to Cart". Otherwise, scroll to Alternatives.
5. **Pivot** — User clicks an alternative → its Product Description Page loads with its own Confidence Panel.


# Tech Stack

- **Frontend**: Next JS, Tailwind CSS, Shadcn
- **Backend**: Express JS
- **Database**: Mock DB using JSON files
