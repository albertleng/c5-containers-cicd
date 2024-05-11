const sum = require('./sum');
const { test } = require('@jest/globals');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('adds "11" + 2 to equal "112"', () => {
    expect(sum("11", 2)).toBe("112");
});