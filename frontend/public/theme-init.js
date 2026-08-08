(function initializeMadagascarTheme() {
  var storageKey = "madagascar.appearance-theme";
  var savedTheme = null;

  try {
    savedTheme = window.localStorage.getItem(storageKey);
  } catch (_error) {
    savedTheme = null;
  }

  var systemPrefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
    : false;
  var theme =
    savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : systemPrefersDark
        ? "dark"
        : "light";

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
