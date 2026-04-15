export type AnemiaStatus = "Normal" | "Mild" | "Moderate" | "Severe";

export interface ScanResult {
  id: string;
  date: string;
  mode: string;
  hb: number;
  status: AnemiaStatus;
}

export function getStatus(hb: number): AnemiaStatus {
  if (hb >= 12) return "Normal";
  if (hb >= 10) return "Mild";
  if (hb >= 7) return "Moderate";
  return "Severe";
}

export function getStatusColor(status: AnemiaStatus) {
  switch (status) {
    case "Normal": return "bg-green-100 text-green-800";
    case "Mild": return "bg-yellow-100 text-yellow-800";
    case "Moderate": return "bg-orange-100 text-orange-800";
    case "Severe": return "bg-red-100 text-red-800";
  }
}

export function getRecommendation(status: AnemiaStatus) {
  switch (status) {
    case "Normal": return "Maintain a balanced diet rich in iron, vitamin B12, and folate. Continue regular health check-ups.";
    case "Mild": return "Consider iron-rich foods (spinach, red meat, lentils) and supplements. Schedule a follow-up in 4 weeks.";
    case "Moderate": return "Consult a healthcare provider soon. You may need iron supplements and further blood tests.";
    case "Severe": return "Seek urgent medical attention. Severe anemia requires immediate professional care and possible transfusion.";
  }
}

export function getScanResults(): ScanResult[] {
  const data = localStorage.getItem("anemia-scans");
  return data ? JSON.parse(data) : [];
}

export function saveScanResult(result: ScanResult) {
  const existing = getScanResults();
  existing.unshift(result);
  localStorage.setItem("anemia-scans", JSON.stringify(existing));
}
