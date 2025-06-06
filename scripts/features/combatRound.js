// features/combatRound.js

export function init() {
    Hooks.on("combatStart", (combat) => {
        if (!game.user.isGM) return;
        postCombatMessage("⚔️ Combat begins");
    });

    Hooks.on("combatRound", (combat, updateData, updateOptions) => {
        if (!game.user.isGM) return;

        const round = updateData.round;
        if (round && round > 1) {
            postCombatMessage(`🔁 Round ${round}`);
        }
    });
}

function postCombatMessage(content) {
    ChatMessage.create({
        content,
        // Public message to all players
    });
}