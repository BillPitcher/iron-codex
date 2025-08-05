// v2.0.0
const MODULE_ID = 'iron-codex';
const CLIENT_KEY = "showTurnAlertClient";

export function init() {
    Hooks.on("combatTurnChange", (combat, prior, current) => {

        const combatant = combat.combatant;
        if (!combatant?.isOwner) return;

        if (game.settings.get(MODULE_ID, CLIENT_KEY)) {
            ui.notifications.warn("🎯 It's your turn!", { permanent: true });
        }
    });
}