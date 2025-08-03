export const hasSeenLanding = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('hasSeenLanding') === 'true';
};

export const setSeenLanding = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hasSeenLanding', 'true');
  }
};

export const removeSeenLanding = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hasSeenLanding');
  }
};
