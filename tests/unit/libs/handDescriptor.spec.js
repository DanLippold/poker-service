const handDescriptor = require('../../../libs/handDescriptor');

describe('getImprovedHandDescription()', () => {
    describe('undefined poker hand', () => {
        test('returns empty string', () => {
            const handDescription = handDescriptor();
            expect(handDescription).toEqual('');
        });
    });

    describe('invalid poker hand', () => {
        test('returns empty string', () => {
            const handDescription = handDescriptor({});
            expect(handDescription).toEqual('');
        });
    });

    describe('valid poker hand', () => {
        test('returns an improved hand description', () => {
            const poorHandDescription = 'THREE_OF_A_KIND';
            const pokerHand = { getRank: () => poorHandDescription }
            const improvedHandDescription = handDescriptor(pokerHand);
            expect(improvedHandDescription).not.toEqual(poorHandDescription);
        });
    });
});