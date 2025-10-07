// features/findToken.js
// v2.0.1
const LAST_INDEX = {};
export function init() {
    //console.debug("iron-codex | combatPlaceholder init() called");
}

export async function findNextToken() {
    const userId = game.user.id;

    const tokens = canvas.tokens.placeables.filter(t =>
        t.visible && t.actor?.isOwner && !t.document.hidden
    );

    if (tokens.length === 0) {
        ui.notifications.info("You do not control any tokens on this scene.");
        return;
    }

    tokens.sort((a, b) =>
        a.name.localeCompare(b.name) || a.id.localeCompare(b.id)
    );

    let index = (LAST_INDEX[userId] ?? -1) + 1;
    if (index >= tokens.length) index = 0;
    LAST_INDEX[userId] = index;

    const token = tokens[index];
    await token.control({ releaseOthers: true });

    await canvas.animatePan({x: token.center.x, y: token.center.y, scale: 1.0});

    //console.log(`🔍 Centered on token: ${token.name}`);
}