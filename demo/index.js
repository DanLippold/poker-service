const PokerService = require('../libs/pokerService');
const { banner, text, clear } = require('./textUtils');
const { prompt } = require('./questionUtils');

const DEFAULT_PLAYER_COUNT = 4;

async function getPlayers(playerCount) {
    const players = Array(Number(playerCount)).fill();
    const playerNamesQuestions = players.map((_, index) => ({
        message: `Enter a name for Player ${index + 1}`,
        name: `playerName${index}`,
        default: `Player ${index + 1}`
    }));
    const playerNameAnswers = await prompt(playerNamesQuestions);

    return players.map((_, index) => {
        return { name: playerNameAnswers[`playerName${index}`] }
    });
}

async function demo() {
    clear();

    banner('Poker Service');

    const playerCount = (await prompt([{
        message: 'How many players?',
        name: 'playerCount',
        default: DEFAULT_PLAYER_COUNT,
        validate: (playerCount) => {
            return Number(playerCount) !== NaN && Number(playerCount) > 1 || 'You need to provide a number of 2 or more';
        }
    }])).playerCount;

    const options = {
        players: await getPlayers(playerCount)
    };

    pokerService = new PokerService(options);

    const players = pokerService.players;
    text(`Distributing chips...`);
    text(`Selecting dealer position...`);
    text(`Dealer: ${players[pokerService.table.dealerPosition].name}`);
    text(`Dealing cards...`);
    players.forEach(player => {
        text(`${player.name}: ${player.cards.map(card => card.symbol).join(' ')}`);
    });
    let nextTurnRequest = pokerService.activeTurnRequest;

    while (nextTurnRequest.players.filter(player => player.cards.length).length) { // TODO: Do While?
        text(`It's ${nextTurnRequest.playerName}'s turn to act`);
        text(`Board: ${nextTurnRequest.boardCards.map(card => card.symbol).join(' ')}`);
        text(`Chips: ${nextTurnRequest.playerChipCount}`);
        text(`Cards: ${nextTurnRequest.playerCards.map(card => card.symbol).join(' ')}`);

        const playerAction = (await prompt([{
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                {
                    name: 'Bet',
                    value: 'BET'
                },
                {
                    name: 'Check',
                    value: 'CHECK'
                },
                {
                    name: 'Fold',
                    value: 'FOLD'
                }
            ]
        }])).action;

        nextTurnRequest = pokerService.act({
            type: playerAction,
            amount: 10
        });
    }
}

demo();
