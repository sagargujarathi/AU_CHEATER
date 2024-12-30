const securityScripts = document.querySelector(
  `script[src="${"https://demo.proctoring.online/sdk/supervisor.js"}"]`
) as HTMLScriptElement;
const playerScripts = document.querySelector(
  `script[src="${"https://player.vimeo.com/api/player.js"}"]`
) as HTMLScriptElement;

const scripts = document.querySelector(
  `script[src="${"polyfills-es2015.aa74eb7c80e33db4c40e.js"}"]`
) as HTMLScriptElement;

securityScripts.remove();
playerScripts.remove();
scripts.remove();


