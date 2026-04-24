import { describe, it, expect } from "vitest";
import { WineSchema } from "./wine";

describe("WineSchema validation", () => {
  it("should pass with valid data", () => {
    const result = WineSchema.safeParse({
      name: "Cabernet Sauvignon",
      region: "France",
      description: "Bold red wine",
      flavorProfile: {
        acidity: 7,
        tannin: 8,
        body: 9,
        sweetness: 2,
        alcohol: 8,
      },
    });

    expect(result.success).toBe(true);
  });

  it("should fail with invalid values", () => {
    const result = WineSchema.safeParse({
      name: "",
      region: "",
      description: "",
      flavorProfile: {
        acidity: 20,
        tannin: -1,
        body: 5,
        sweetness: 3,
        alcohol: 4,
      },
    });

    expect(result.success).toBe(false);
  });
});
