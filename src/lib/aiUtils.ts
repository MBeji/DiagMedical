// src/lib/aiUtils.ts

// Exemple de type pour les données envoyées à l'IA
interface MedicalData {
  age?: number;
  sex?: string;
  symptoms?: string[];
  history?: string[];
  // autres champs...
}

// Exemple de type pour la réponse structurée de l'IA
export interface AIResponse {
  diagnosis: string;
  further_questions?: string[];
  recommended_analyses?: string[];
  suggested_treatment?: string[];
  risks_and_warnings?: string;
}

/**
 * Simule un appel à une API d'IA pour obtenir un diagnostic.
 * Remplacer par un appel réel à l'API OpenAI ou autre LLM.
 */
export async function getAIDiagnosis(data: MedicalData): Promise<AIResponse> {
  console.log('Sending data to AI (simulated):', data);

  // Simuler une latence réseau
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Logique de simulation de l'IA basée sur les symptômes
  let diagnosis = "Condition non identifiée (simulation).";
  const further_questions: string[] = [];

  if (data.symptoms?.includes("fièvre") && data.symptoms?.includes("toux")) {
    diagnosis = "Possible infection respiratoire (grippe, COVID-19, etc.) (simulation).";
    further_questions.push("Avez-vous été en contact avec une personne malade récemment ?");
  } else if (data.symptoms?.includes("douleur abdominale")) {
    diagnosis = "Problème digestif possible (simulation).";
    further_questions.push("La douleur est-elle localisée ou diffuse ?");
  }

  return {
    diagnosis,
    further_questions: further_questions.length > 0 ? further_questions : undefined,
    recommended_analyses: ["Consultation médicale recommandée (simulation)"],
    suggested_treatment: ["Suivez les conseils de votre médecin (simulation)"],
    risks_and_warnings: "Ce diagnostic simulé ne remplace pas un avis médical.",
  };
}
