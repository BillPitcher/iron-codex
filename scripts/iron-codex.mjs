// iron-codex.mjs
// v2.0.1
import { findNextToken } from "./features/showFindToken.js";
import { addCombatPlaceholder } from "./features/combatPlaceholder.js";

const MODULE_ID = 'iron-codex';
const SETTING_KEY = "enableFindToken";
const GLOBAL_KEY = "enableShowYourTurn";
const CLIENT_KEY = "showTurnAlertClient";
/**
 * Features to toggle in the settings.
 * Each key maps to a feature file, which should export an `init` function.
 */
/**
 * @typedef {ClientSettings} game.settings
 */
const FEATURES = {
    'enableFindToken': {
        name: 'Show Find Token',
        hint: 'Adds a button to the Token Controls that cycles through and centers your owned tokens.',
        file: 'features/showFindToken.js',
        gmOnly: false
    },
    'enableRemoveTarget': {
        name: 'Remove Target',
        hint: 'NPCs automatically stop targeting player characters at the end of their turn.',
        file: 'features/removeTarget.js',
        gmOnly: true
    },
    'enableCombatRoundMessage': {
        name: 'Combat Round Message',
        hint: 'Displays a public chat message when combat starts and at the beginning of each round.',
        file: 'features/combatRound.js',
        gmOnly: true
    },
    'enablePopoutCombat': {
        name: 'Popout Combat Tracker',
        hint: 'Automatically opens the Combat Tracker in a popout window when combat begins.',
        file: 'features/popoutCombat.js',
        gmOnly: false
    },
    'enableShowYourTurn': {
        name: 'Show Turn Alert Feature',
        hint: 'Allow players to opt-in to receiving a turn alert when it becomes their turn.',
        file: 'features/showYourTurn.js',
        gmOnly: false
    },
    'enableCombatPlaceholders': {
        name: 'Combat Place Holders',
        hint: 'Adds placeholder entries for events that may effect combat. (Creates a Combat Placeholder actor)',
        file: 'features/combatPlaceholder.js',
        gmOnly: true
    },
    'enableCombatTokenVisibility': {
        name: 'Make Token/Combatant Visible',
        hint: 'When a Token or Combatant is made visible it applies to the other. (only Visible)',
        file: 'features/combatTokenVisibility.js',
        gmOnly: true
    },
    'enableSwapTurnMarker': {
        name: 'Swap Turn Marker',
        hint: 'Swap the Combat turn marker.',
        file: 'features/swapTurnMarker.js',
        gmOnly: false
    }


};

Hooks.once('init', () => {


    for (const [key, data] of Object.entries(FEATURES)) {
        game.settings.register(MODULE_ID, key, {
            name: data.name,
            hint: data.hint,
            scope: 'world',
            config: true,
            type: Boolean,
            default: false,
            restricted: true,
            requiresReload: true,
        });
    }

    if (game.settings.get(MODULE_ID, GLOBAL_KEY)) {
        game.settings.register(MODULE_ID, CLIENT_KEY, {
            name: 'Turn Alert (Client)',
            hint: 'Show a warning when it becomes your turn in combat.',
            scope: 'client',
            config: true,
            type: Boolean,
            default: false
        });
    }

    Hooks.on("getSceneControlButtons", (controls) => {
        if (!game.settings.get(MODULE_ID, SETTING_KEY)) return;

        const tokenControls = controls["tokens"]; // "tokens", not "token"
        if (!tokenControls) return;
        tokenControls.tools["findToken"] = {
            name: "findToken",
            title: "Find Token",
            icon: "fa-solid fa-crosshairs",
            order: 99,
            visible: true,
            button: true,
            onChange: async () => {
                await findNextToken()
            }
        };
    });


    Hooks.on("renderApplicationV2",  (app, element)  => {
        // Ensure we're targeting the Combat Tracker
        if (app !== ui.combat) return;

        // Check if the footer exists; if not, create it
        let footer = element.querySelector(".directory-footer");
        if (!footer) {
            footer = document.createElement("footer");
            footer.classList.add("directory-footer", "flexcol");
            element.appendChild(footer);
        }

        // Avoid adding the button multiple times
        if (footer.querySelector(".combat-placeholder-button")) return;

        // Create the button
        const button = document.createElement("button");
        button.type = "button";
        button.className = "combat-placeholder-button";
        button.innerHTML = `<i class="fa-solid fa-mask"></i>Add Placeholder`;

        // Add click event listener
        button.addEventListener("click", async () => {
            //console.debug("iron-codex | Placeholder button clicked");
            await addCombatPlaceholder()
        });

        // Append the button to the footer
        footer.appendChild(button);
    });



    Hooks.once('ready', async () => {
        console.log(`✅ ${MODULE_ID} | Ready`);
        //CONFIG.debug.hooks = true;
        //CONFIG.Combat.fallbackTurnMarker = 'modules/iron-codex/tokens/foundrymodules-icon.svg'

        for (const [key, data] of Object.entries(FEATURES)) {
            const isEnabled = game.settings.get(MODULE_ID, key);
            if (isEnabled) {
                try {
                    const featureModule = await import(`./${data.file}`);
                    if (!game.user.isActiveGM && data.gmOnly) { continue; }
                    if (featureModule.init) {
                        featureModule.init();
                        //console.log(`${MODULE_ID} | Initialized ${key}`);
                    } else {
                        console.warn(`${MODULE_ID} | Feature file for ${key} does not export an init function.`);
                    }
                } catch (err) {
                    console.error(`${MODULE_ID} | Failed to load feature ${key}`, err);
                }
            }
        }
    });

});

