# Black-Box Test Cases: Confidence Panel

This document outlines black-box test cases for the Confidence Panel, focusing on observable behaviors and user flows without relying on implementation details.

## 1. Size Selection

**Objective:** Verify that the Confidence Panel accurately selects the appropriate size based on user measurements and correctly recalculates when measurements change.

**Steps:**
1. Open the Confidence Panel (Preferences Dialog) from the navigation menu.
2. Navigate to the "Eastern Sizes" tab and open the "Waist Coat" section.
3. Enter specific measurements (e.g., Chest: 22, Waist: 21) and save preferences.
4. Navigate to the product catalog and select a **Waistcoat** product.
5. On the product details page, observe the "Select Size" section and the Confidence Banner.
6. **Verify:** The appropriate size (e.g., 'M' or 'L') is automatically selected based on the entered measurements, and the Confidence Banner reflects a successful size match.
7. Open the Confidence Panel again and significantly change the Waistcoat measurements (e.g., Chest: 26, Waist: 25). Save preferences.
8. Navigate back to the **same waistcoat product**.
9. **Verify:** The size selection is recalculated and updated according to the new measurements (e.g., changed from 'M' to 'XL').
10. **Verify:** The previously selected size (e.g., 'M') does not remain incorrectly selected.

