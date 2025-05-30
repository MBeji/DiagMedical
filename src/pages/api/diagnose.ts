// src/pages/api/diagnose.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialiser le client OpenAI
// Assurez-vous que OPENAI_API_KEY est défini dans vos variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types pour la requête et la réponse (peuvent être affinés)
interface DiagnoseRequestData {
  age?: number;
  sex?: string;
  symptoms?: string[];
  history?: string[];
  // autres champs si vous en ajoutez au formulaire
}

export interface DiagnoseResponseData {
  diagnosis?: string;
  further_questions?: string[];
  recommended_analyses?: string[];
  suggested_treatment?: string[];
  risks_and_warnings?: string;
  disclaimer?: string;
  raw_ai_response?: string; // Optionnel: pour débogage
  error?: string;
}

const SYSTEM_PROMPT = `Tu es un assistant médical IA avancé. Ton rôle est d'analyser les informations fournies par un utilisateur pour formuler des hypothèses diagnostiques et des recommandations.
Réponds TOUJOURS en utilisant un format JSON structuré. Ne fournis aucune explication en dehors du JSON.
Le JSON doit avoir la structure suivante:
{
  "diagnosis": "string", // Diagnostic médical probable basé sur les informations. Sois prudent et nuancé.
  "further_questions": ["string"], // Liste de questions pertinentes à poser pour affiner le diagnostic. Peut être vide.
  "recommended_analyses": ["string"], // Suggestions d'analyses médicales complémentaires (ex: "Prise de sang", "Radiographie thoracique"). Peut être vide.
  "suggested_treatment": ["string"], // Propositions de traitement médicamenteux ou non (ex: "Reposez-vous", "Paracétamol 500mg toutes les 6h si douleur"). Sois très prudent avec les médicaments. Peut être vide.
  "risks_and_warnings": "string", // Avertissements importants et facteurs de risque à considérer.
  "disclaimer": "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle. Consultez toujours un médecin pour un diagnostic officiel et un traitement."
}
Si certaines informations ne peuvent pas être déterminées, laisse les champs correspondants vides ou avec des valeurs par défaut appropriées (ex: tableau vide pour further_questions).
Ne pose pas de questions si tu estimes avoir assez d'informations pour un diagnostic initial probable.
Si les symptômes sont trop vagues ou insuffisants, indique-le dans 'diagnosis' et utilise 'further_questions' pour demander des précisions.
Adapte tes réponses en fonction de l'âge et du sexe fournis si cela est pertinent.
Priorise la sécurité et la prudence. Indique clairement que tes réponses ne constituent pas un avis médical définitif.
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiagnoseResponseData>
) {
  if (req.method === 'POST') {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set.');
      return res.status(500).json({ 
        error: 'Configuration serveur incorrecte. L\'administrateur a été notifié.',
        disclaimer: "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle."
      });
    }

    const { age, sex, symptoms, history }: DiagnoseRequestData = req.body;

    // Validation simple (peut être étendue)
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ 
        error: 'Les symptômes sont requis pour une analyse.',
        disclaimer: "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle."
      });
    }

    let userPrompt = "Voici les informations de l'utilisateur:\n";
    if (age) userPrompt += `- Âge: ${age} ans\n`;
    if (sex) userPrompt += `- Sexe: ${sex}\n`;
    userPrompt += `- Symptômes: ${symptoms.join(', ')}\n`;
    if (history && history.length > 0) {
      userPrompt += `- Antécédents médicaux: ${history.join(', ')}\n`;
    }
    userPrompt += "\nFournis ton analyse en respectant le format JSON demandé.";

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4', // ou 'gpt-3.5-turbo' ou le modèle que vous préférez/avez accès
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: "json_object" }, // Demande à GPT-4 de sortir du JSON
        temperature: 0.5, // Ajustez pour plus ou moins de créativité/déterminisme
      });

      const aiResponseContent = completion.choices[0]?.message?.content;

      if (!aiResponseContent) {
        console.error('OpenAI response content is null or undefined.');
        return res.status(500).json({ error: 'Réponse invalide de l\'IA.' });
      }

      // Tenter de parser la réponse JSON de l'IA
      let structuredResponse: DiagnoseResponseData;
      try {
        structuredResponse = JSON.parse(aiResponseContent);
      } catch (parseError) {
        console.error('Failed to parse AI JSON response:', parseError);
        console.error('Raw AI response:', aiResponseContent); // Log la réponse brute pour débogage
        return res.status(500).json({ 
          error: 'Erreur lors du traitement de la réponse de l\'IA. Le format JSON attendu n\'a pas été reçu.',
          raw_ai_response: aiResponseContent // Envoyer la réponse brute peut aider au débogage côté client
        });
      }
      
      // S'assurer que le disclaimer est toujours présent, même si l'IA ne le fournit pas comme attendu
      if (!structuredResponse.disclaimer) {
        structuredResponse.disclaimer = "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle. Consultez toujours un médecin pour un diagnostic officiel et un traitement.";
      }


      return res.status(200).json(structuredResponse);

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      let errorMessage = 'Erreur lors de la communication avec le service d\'IA.';
      if (error instanceof OpenAI.APIError) {
        errorMessage = `Erreur OpenAI: ${error.status} ${error.name} - ${error.message}`;
      }
      return res.status(500).json({ 
        error: errorMessage,
        disclaimer: "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle."
       });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
