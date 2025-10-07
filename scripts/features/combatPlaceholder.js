// features/combatPlaceholder.js
// v2.0.1
export function init() {
    //console.debug("iron-codex | combatPlaceholder init() called");
}
async function getOrCreatePlaceholderActor() {
    const name = "Combat Placeholder";
    let actor = game.actors.getName(name);
    if (!actor) {
        actor = await Actor.create({
            name,
            type: "npc", // or 'character' if preferred
            img: "modules/iron-codex/tokens/foundrymodules-icon.svg",
            token: { name },
            system: {}, // safe empty system data
        });
    }
    return actor;
}
export async function addCombatPlaceholder() {
    const combat = game.combat;
    if (!combat) {
        ui.notifications.warn("No active combat found.");
        return;
    }

    try {
        const actor = await getOrCreatePlaceholderActor();

        const [combatant] = await combat.createEmbeddedDocuments("Combatant", [{
            actorId: actor.id,
            tokenId: null, // tokenless
            hidden: true,
            img: actor.img,
            name: actor.name,
            initiative: null,
        }]);

        if (!combatant) {
            ui.notifications.error("Failed to create placeholder.");
            return;
        }

        await combat.setInitiative(combatant.id, 20);
        //ui.notifications.info("Placeholder added to combat.");
    } catch (err) {
        console.error("iron-codex | Error adding placeholder:", err);
        ui.notifications.error("Failed to add placeholder to combat.");
    }
}