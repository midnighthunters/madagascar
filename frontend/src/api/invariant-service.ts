import { madagascar } from "./madagascar-axios";

class InvariantService {
  static async getPolicy() {
    const { data } = await madagascar.get("/api/security/policy");
    return data.policy;
  }

  static async getRiskSeverity() {
    const { data } = await madagascar.get("/api/security/settings");
    return data.RISK_SEVERITY;
  }

  static async getTraces() {
    const { data } = await madagascar.get("/api/security/export-trace");
    return data;
  }

  static async updatePolicy(policy: string) {
    await madagascar.post("/api/security/policy", { policy });
  }

  static async updateRiskSeverity(riskSeverity: number) {
    await madagascar.post("/api/security/settings", {
      RISK_SEVERITY: riskSeverity,
    });
  }
}

export default InvariantService;
