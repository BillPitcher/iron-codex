// features/removeTarget.js
// v2.0.1
export function init() {
    Hooks.on("combatTurnChange", () => {
        if (!game.user.isActiveGM) return;

        // For each just GM, remove targets on PCs (by ownership or actor type)
        for (const target of game.user.targets ) {
            const targetActor = target?.actor;
            const isPC = targetActor?.hasPlayerOwner || targetActor?.type === 'character';

            if ( isPC ) {
                target.setTarget(false, { releaseOthers: true });
                //console.log(`Iron Codex | Removed target ${target.name} from ${npcToken.name}`);
            }
        }
    });
}