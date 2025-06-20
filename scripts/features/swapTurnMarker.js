const MODULE_ID = 'iron-codex';
const CLIENT_KEY = "enableSwapTurnMarker";

export async function init()  {
    if (game.settings.get(MODULE_ID, CLIENT_KEY)) {
        if (CONFIG.Combat.fallbackTurnMarker === 'modules/iron-codex/artwork/fm-turnmarker.png') {
            CONFIG.Combat.fallbackTurnMarker = 'icons/vtt-512.png'
        } else {
            CONFIG.Combat.fallbackTurnMarker = 'modules/iron-codex/artwork/fm-turnmarker.png'
            const combat = game.combat;
            if (!combat) return;
            const current = combat.combatant;
            const token = current?.token?.object;
            if (token) {
                await token.draw();
            }
        }
    }
}