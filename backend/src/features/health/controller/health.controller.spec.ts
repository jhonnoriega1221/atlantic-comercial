import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  it("responde con status ok y una fecha válida", () => {
    const result = new HealthController().check();

    expect(result.status).toBe("ok");
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});
