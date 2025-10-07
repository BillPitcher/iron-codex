// features/popoutCombatTracker.js
// v2.0.1
export function init() {
    Hooks.on("createCombat", () => {
        const tracker = ui.combat;
        if (!tracker) return;

        // Step 1: Pop out the Combat Tracker
        tracker.renderPopout();

        // Step 2: Switch the sidebar back to Chat
        ui.sidebar.changeTab("chat", "primary");
    });
}