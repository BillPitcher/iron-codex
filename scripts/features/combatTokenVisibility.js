// v2.0.0
export function init() {
    if (game.user.isGM) {
        Hooks.on("updateCombatant" , async (
            combatant, changes) => {


            //console.log(changes);
            if (changes.hidden === false ) {
                const token = combatant.token?.object;
                if (!token || !token.document.hidden) return;
                // Sync: make token visible
                await token.document.update({ hidden: false });
            }
        })
        Hooks.on("updateToken", async (tokenDoc, changes) => {
            //console.log(changes);
            if (changes.hidden === false) {
                const combatant = tokenDoc.combatant;
                if (!combatant || !combatant.hidden) return;
                // Make the combatant visible
                await combatant.update({hidden: false});
            }
        });
    }
}