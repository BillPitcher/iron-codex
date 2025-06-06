// features/removeTarget.js

export function init() {
    Hooks.on("combatTurnChange", (combat, prior, current) => {
        if (!game.user.isGM) return;

        const currentCombatant = combat.combatant;
        if (!currentCombatant) return;

        const actor = currentCombatant.actor;
        if (!actor || actor.hasPlayerOwner) return; // Only trigger for NPCs

        const npcToken = currentCombatant.token?.object;
        if (!npcToken) return;

        // For each user, remove targets on PCs (by ownership or actor type)
        for (const user of game.users) {
            for (const target of user.targets) {
                const targetActor = target?.actor;
                const isPC = targetActor?.hasPlayerOwner || targetActor?.type === 'character';

                if (isPC && npcToken.isOwner) {
                    target.setTarget(false, { user: game.user });
                    //console.log(`Iron Codex | Removed target ${target.name} from ${npcToken.name}`);
                }
            }
        }
    });
}