export interface Contraction {
  id: string;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
  intensity?: number; // 1-10 scale
}

export interface ContractionAnalysis {
  averageInterval: number; // seconds between contractions
  lastContraction: Contraction;
  isTimeToGo: boolean; // true if contractions < 5 min apart
  consecutiveQuickContractions: number; // how many contractions in a row < 5 min
}

export interface AppSettings {
  birthingCenterName: string;
  birthingCenterAddress: string;
  partnerPhoneNumber: string;
  doctorName: string;
  doctorPhoneNumber: string;
  alertThresholdMinutes: number; // when to alert (default 5)
}
