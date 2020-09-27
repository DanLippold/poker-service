const randomWords = require('random-words');
const PokerService = require('../libs/pokerService');
const { banner, text, clear, table, newLine } = require('./textUtils');
const { prompt } = require('./questionUtils');

const DEFAULT_PLAYER_COUNT = 4;
const DEFAULT_CHIP_COUNT = 100;

function getActiveBetString(activeBetValue) {
    let activeBet;

    if (activeBetValue === -1) {
        activeBet = '';
    } else if (activeBetValue === 0) {
        activeBet = 'Check';
    } else if (activeBetValue === -2) {
        activeBet = 'Folded';
    } else {
        activeBet = `$${activeBetValue}`
    }

    return activeBet;
}

function getPlayerStats(player, index, activePlayerIndex, { dealerPosition, smallBlindPosition, bigBlindPosition }) {
    let roleText = '';

    if (index === dealerPosition) {
        roleText = 'D';
    } else if (index === smallBlindPosition) {
        roleText = 'S';
    } else if (index === bigBlindPosition) {
        roleText = 'B';
    }

    return {
        name: player.name,
        chipValue: `$${player.chipValue}`,
        role: roleText ? `(${roleText})` : '',
        cards: player.cards.map(card => card.shortSuitSymbolValue).join(' '),
        activeBet: getActiveBetString(player.activeBetValue),
        pokerHand: player.pokerHand
    };
}

function getBoardText(boardCards) {
    return `[${Array(5).fill().map((_, i) => boardCards[i] ? boardCards[i].shortSuitSymbolValue : '  ').join(' ')}]`;
}

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

async function getStartingChips() {
    return (await prompt([{
        message: 'How many chips should each player start with?',
        name: 'startingChips',
        default: DEFAULT_CHIP_COUNT,
        validate: (chipCount) => {
            return Number(chipCount) !== NaN && Number(chipCount) >= 10 || 'You need to provide a number of 10 or more';
        }
    }])).startingChips;
}

async function getSeed() {
    return (await prompt([{
        message: 'Specify optional game seed',
        name: 'seed'
    }])).seed || randomWords();
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
        players: await getPlayers(playerCount),
        chips: await getStartingChips(),
        seed: await getSeed()
    };

    pokerService = new PokerService(options);

    const players = pokerService.players;

    let nextTurnRequest = pokerService.activeTurnRequest;

    while (nextTurnRequest.players.filter(player => player.cards.length).length) { // TODO: Do While?
        clear();
        const playerStats = players.map((player, index) => {
            return getPlayerStats(player, index, nextTurnRequest.playerPosition, pokerService.table);
        });

        text(`Seed "${options.seed}"`);
        newLine();
        text(getBoardText(nextTurnRequest.boardCards));
        newLine();
        text(`$${nextTurnRequest.potValue}`);
        newLine();
        table(playerStats, ['name', 'role', 'chipValue', 'cards', 'activeBet', 'pokerHand'], nextTurnRequest.playerName);
        newLine();

        let choices = [{ name: 'Fold', value: 'FOLD' }];
        if (nextTurnRequest.activeBetValue > 0) {
            choices = [{ name: 'Call', value: 'CALL' }, { name: 'Raise', value: 'RAISE' }, ...choices];
        } else {
            choices = [{ name: 'Check', value: 'CHECK' }, { name: 'Bet', value: 'BET' }, ...choices];
        }

        const playerAction = (await prompt([{
            type: 'list',
            message: `Action to ${nextTurnRequest.playerName}`,
            name: 'action',
            choices
        }])).action;

        nextTurnRequest = pokerService.act({
            type: playerAction,
            amount: 10
        });
    }
}

demo();
