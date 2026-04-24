import { describe, it, expect } from "vitest";
import { parseWineResponse, safeParseWineResponse } from "./parseWineResponse";

describe("parseWineResponse", () => {
  it("should parse valid AI response", () => {
    const input = {
      wines: [
        {
          name: "Merlot",
          region: "Italy",
          description: "Smooth red wine",
          flavorProfile: {
            acidity: 6,
            tannin: 5,
            body: 7,
            sweetness: 3,
            alcohol: 7,
          },
        },
      ],
    };

    const result = parseWineResponse(input);

    expect(result.wines.length).toBe(1);
    expect(result.wines[0].name).toBe("Merlot");
  });

  it("should fail for invalid structure", () => {
    const input = {
      wines: [
        {
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
        },
      ],
    };

    const result = safeParseWineResponse(input);

    expect(result.success).toBe(false);
  });
});
