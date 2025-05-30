// src/types/medical.ts

export interface UserProfile {
  id: string;
  email?: string;
  // autres champs de profil utilisateur
}

export interface MedicalRecord {
  userId: string;
  recordId: string;
  createdAt: Date;
  symptoms: string[];
  ageAtSubmission?: number;
  sexAtSubmission?: string;
  // autres données médicales
}

// Les types pour la requête et la réponse de l'API /api/diagnose
// peuvent aussi être placés ici ou importés depuis l'endpoint.
// Par exemple :
// export type { DiagnoseRequest, DiagnoseResponse } from '../pages/api/diagnose';
