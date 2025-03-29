export const ThemeSwitcher: React.FC<ThemeProps> = ({ themes, current }) => {
  return (
    <div className="theme-container">
      <ThemeList themes={themes} />
      <ThemePreview current={current} />
      <ThemeControls />
    </div>
  );
};
