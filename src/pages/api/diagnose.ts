import type { NextApiRequest, NextApiResponse } from 'next';

type DiagnoseRequest = {
  age?: number;
  sex?: string;
  symptoms?: string[];
  history?: string[];
  // Ajoutez d'autres champs si nécessaire pour la requête initiale
};

type DiagnoseResponse = {
  diagnosis?: string;
  further_questions?: string[];
  recommended_analyses?: string[];
  suggested_treatment?: string[];
  risks_and_warnings?: string;
  disclaimer?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiagnoseResponse>
) {
  if (req.method === 'POST') {
    const { age, sex, symptoms, history }: DiagnoseRequest = req.body;

    // TODO: Valider les données d'entrée

    // Placeholder pour la logique d'appel à l'IA
    // Simuler un appel et une réponse
    console.log('Received data:', { age, sex, symptoms, history });

    // Ici, vous appelleriez votre fonction qui interagit avec l'API OpenAI
    // Par exemple: const aiResponse = await getAIDiagnosis({ age, sex, symptoms, history });

    // Exemple de réponse (à remplacer par la vraie logique IA)
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ 
        error: 'Symptoms are required.',
        disclaimer: "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle."
      });
    }

    // Simuler des questions complémentaires
    const further_questions = [];
    if (symptoms.includes('fièvre')) {
      further_questions.push('Avez-vous pris votre température ? Quelle est-elle ?');
    }
    if (!history || history.length === 0) {
      further_questions.push('Avez-vous des antécédents médicaux notables ?');
    }

    return res.status(200).json({
      diagnosis: 'Diagnostic probable basé sur les symptômes (simulation).',
      further_questions: further_questions.length > 0 ? further_questions : undefined,
      recommended_analyses: ['Analyse de sang (simulation)'],
      suggested_treatment: ['Reposez-vous bien (simulation)'],
      risks_and_warnings: 'Ceci est une simulation et non un diagnostic médical officiel.',
      disclaimer: "Ce service est un outil d'assistance et ne remplace pas une consultation médicale professionnelle."
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
