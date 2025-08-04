// features/combatRound.js

export function init() {

    Hooks.on("combatStart", (combat) => {
        if (!game.user.isGM) return;
        let chatContent = {
            img: "<i class=\"fa-solid fa-hand-fist\"></i>",
            title: "Combat begins",
            subtitle: ``,
            content: ``
        }
        postCombatMessage(chatContent);
    });

    Hooks.on("combatRound", (combat, updateData, updateOptions) => {
        if (!game.user.isGM) return;

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
}

function postCombatMessage(content) {
    ChatMessage.implementation.create({content: formatMessage(content)});
}

function formatMessage(chatData) {
    let messageContent = `<div class="message-content">
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
    return messageContent;
}