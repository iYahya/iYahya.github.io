export function ThemeScript() {
  const code = `(function(){var s=localStorage.getItem("theme");var p=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",s||p);})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
