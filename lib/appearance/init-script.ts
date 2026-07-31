/**
 * Blocking script that restores appearance prefs before paint to avoid flash.
 * Keep in sync with APPEARANCE_STORAGE_KEY and preference shape in lib/appearance.
 * Legacy colorIds: default → gray (no attr), violet → purple.
 */
export const appearanceInitScript = `(function(){try{var s=localStorage.getItem("ibmerp-appearance");if(!s)return;var p=JSON.parse(s);var r=document.documentElement;var c=p.colorId;if(c==="default")c="gray";else if(c==="violet")c="purple";if(c&&c!=="gray")r.setAttribute("data-theme-color",c);if(p.fontId&&p.fontId!=="default")r.setAttribute("data-font",p.fontId);}catch(e){}})();`
