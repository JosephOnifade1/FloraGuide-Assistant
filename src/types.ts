export interface PlantCareInstructions {
  commonName: string;
  scientificName: string;
  description: string;
  watering: string;
  sunlight: string;
  soil: string;
  temperature: string;
  fertilizing: string;
  commonIssues: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface PlantIDResult {
  plantName: string;
  confidence: number;
  careInstructions: PlantCareInstructions;
}
