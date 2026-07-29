/**
 * Blocking script that restores appearance prefs before paint to avoid flash.
 * Keep in sync with APPEARANCE_STORAGE_KEY and preference shape in lib/appearance.
 */
export const appearanceInitScript = `(function(){try{var s=localStorage.getItem("ibmerp-appearance");if(!s)return;var p=JSON.parse(s);var r=document.documentElement;if(p.colorId&&p.colorId!=="default")r.setAttribute("data-theme-color",p.colorId);if(p.fontId&&p.fontId!=="default")r.setAttribute("data-font",p.fontId);}catch(e){}})();`
