/* Runs in <head> before first paint so the page never flashes the wrong theme. */
(function() {
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  var theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.add('js');
  // Play the intro curtain once per visit, never for reduced-motion users
  try {
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm && !sessionStorage.getItem('intro-seen')) {
      document.documentElement.classList.add('has-intro');
      sessionStorage.setItem('intro-seen', '1');
    }
  } catch (e) {}
})();
