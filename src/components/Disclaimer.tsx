// src/components/Disclaimer.tsx
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
      <h4>Clause de non-responsabilité</h4>
      <p>
        Cette application fournit des informations à titre indicatif et ne doit pas être considérée comme un avis médical professionnel,
        un diagnostic, ou un traitement. Consultez toujours un professionnel de santé qualifié pour toute question relative à une condition médicale.
      </p>
    </div>
  );
};

export default Disclaimer;
