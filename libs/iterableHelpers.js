function getFirstItemFromIterable(iterable) {
    return iterable[Symbol.iterator]().next().value;
}

module.exports = {
    getFirstItemFromIterable
}
