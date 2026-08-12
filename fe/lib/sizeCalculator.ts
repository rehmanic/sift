import { User, Product, SizeLabel } from "../types/types";


function normalizeCategory(category: string): keyof User["preferences"]["easternSize"] | null {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes("waistcoat") || lowerCat.includes("waist coat")) return "waistCoat";
  if (lowerCat.includes("kurta")) return "kurta";
  if (lowerCat.includes("trouser")) return "trouser";
  if (lowerCat.includes("kameez")) return "kameez";
  if (lowerCat.includes("shalwar")) return "shalwar";
  return null;
}


export function calculateDynamicSize(user: User, product: Product): SizeLabel | null {
  const categoryKey = normalizeCategory(product.category);

  if (!categoryKey) {
    return null;
  }

  const userMeasurements = user.preferences?.easternSize?.[categoryKey];

  if (!userMeasurements) {
    return null;
  }

  const sizeLabels: SizeLabel[] = ["S", "M", "L", "XL", "XXL"];

  let bestSize: SizeLabel | null = null;
  let minDifference = Infinity;

  for (const size of sizeLabels) {
    let currentDifference = 0;
    let comparedMeasurementsCount = 0;

    for (const [measurementName, userValue] of Object.entries(userMeasurements)) {
      const productMeasurement = product.sizes[measurementName];

      if (productMeasurement && typeof productMeasurement[size] === "number") {
        const productValue = productMeasurement[size];

        currentDifference += Math.abs(Number(userValue) - productValue);
        comparedMeasurementsCount++;
      }
    }

    if (comparedMeasurementsCount > 0 && currentDifference < minDifference) {
      minDifference = currentDifference;
      bestSize = size;
    }
  }

  return bestSize;
}
