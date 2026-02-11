'use client';

import { useState } from 'react';

export function useFilterModal() {
  const [showTagModal, setShowTagModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  return {
    showTagModal,
    showCompanyModal,
    setShowTagModal,
    setShowCompanyModal,
  };
}
