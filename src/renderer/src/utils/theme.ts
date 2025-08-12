export const getInitialTheme = (): string => {
  // Intenta obtener el tema del localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;

  // Si no está guardado, usa 'dark' por defecto
  return 'dark';
};

export const applyTheme = (theme: string): void => {
  document.documentElement.className = theme;
  localStorage.setItem('theme', theme);
};

export const toggleTheme = (currentTheme: string): string => {
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
};
