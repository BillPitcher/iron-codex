// features/combatRound.js
// v2.0.1
export function init() {

    Hooks.on("combatStart", () => {
        if (!game.user.isActiveGM) return;
        let chatContent = {
            img: "<i class=\"fa-solid fa-hand-fist\"></i>",
            title: "Combat begins",
            subtitle: ``,
            content: ``
        }
        postCombatMessage(chatContent);
    });

    Hooks.on("combatRound", (combat, updateData) => {
        if (!game.user.isActiveGM) return;

        const round = updateData.round;
        if (round && round > 1) {
            let chatContent = {
                img: "<i class=\"fa-solid fa-arrows-spin\"></i>",
                title: `Round ${round}`,
                subtitle: ``,
                content: ``
            }
            postCombatMessage(chatContent);
        }
    });

    Hooks.on("deleteCombat", async (document) => {
        if (!game.user.isActiveGM) return;
        const current = document.combatant;
        const token = current?.token?.object;
        let chatContent = {
            img: "<i class=\"fa-solid fa-flag-checkered\"></i>",
            title: `Combat Ends`,
            subtitle: ``,
            content: ``
        }
        postCombatMessage(chatContent);

        if (token) {
            await token.draw();
        }
    });
}

function postCombatMessage(content) {
    ChatMessage.implementation.create({content: formatMessage(content), user: game.user.isActiveGM.id}).then();
}

function formatMessage(chatData) {
    return `<div class="message-content">
        <div class="dnd5e2 chat-card activation-card" data-display-challenge="">
        <section class="card-header description">
            <header class="summary">
                ${chatData.img}
                <div class="name-stacked border">
                    <span class="title">${chatData.title}</span>
                    <span class="subtitle">${chatData.subtitle}</span>
                </div>
            </header>
            <section class="details collapsible-content card-content">
                <div class="wrapper">${chatData.content}</div>
            </section>
        </section>
        </div>
    </div>`

}