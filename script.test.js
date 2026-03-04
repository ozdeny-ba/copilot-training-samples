/**
 * @jest-environment jest-environment-jsdom
 */

// Stub browser globals that script.js references at load time
global.Chart = jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    toBase64Image: jest.fn(() => 'data:image/png;base64,abc'),
}));
global.bootstrap = {
    Tab: { getOrCreateInstance: jest.fn(() => ({ show: jest.fn() })) },
};

// Provide the minimum DOM elements that script.js attaches listeners to at the
// top level (outside DOMContentLoaded), plus the elements used by getChartData.
const MONTH_KEYS_LOCAL = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function buildDOM() {
    const monthRows = MONTH_KEYS_LOCAL.map(
        key => `
        <input id="income-${key}"  type="number" value="">
        <input id="expense-${key}" type="number" value="">
    `
    ).join('');

    document.body.innerHTML = `
        <canvas id="budgetChart"></canvas>
        <button id="updateChartBtn">Update Chart</button>
        <button id="downloadChartBtn">Download</button>
        <input id="username" type="text">
        <div id="username-feedback"></div>
        <div id="username-success"></div>
        <form id="username-form"></form>
        ${monthRows}
    `;
}

buildDOM();

// Require script AFTER DOM is set up
const { USERNAME_PATTERN, MONTH_KEYS, MONTHS, getChartData } = require('./script');

// ---------------------------------------------------------------------------
// USERNAME_PATTERN tests
// ---------------------------------------------------------------------------
describe('USERNAME_PATTERN', () => {
    test('accepts valid username with uppercase, number, and special char', () => {
        expect(USERNAME_PATTERN.test('Hello1!')).toBe(true);
    });

    test('rejects username shorter than 5 characters', () => {
        expect(USERNAME_PATTERN.test('A1!')).toBe(false);
    });

    test('rejects username without uppercase letter', () => {
        expect(USERNAME_PATTERN.test('hello1!')).toBe(false);
    });

    test('rejects username without a number', () => {
        expect(USERNAME_PATTERN.test('Hello!!')).toBe(false);
    });

    test('rejects username without a special character', () => {
        expect(USERNAME_PATTERN.test('Hello12')).toBe(false);
    });

    test('accepts username with exactly 5 characters meeting all criteria', () => {
        expect(USERNAME_PATTERN.test('Ab1!x')).toBe(true);
    });

    test('accepts username with multiple special characters', () => {
        expect(USERNAME_PATTERN.test('Hello1!@#')).toBe(true);
    });

    test('rejects empty string', () => {
        expect(USERNAME_PATTERN.test('')).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// MONTH_KEYS / MONTHS constants
// ---------------------------------------------------------------------------
describe('MONTH_KEYS', () => {
    test('has 12 entries', () => {
        expect(MONTH_KEYS).toHaveLength(12);
    });

    test('starts with jan and ends with dec', () => {
        expect(MONTH_KEYS[0]).toBe('jan');
        expect(MONTH_KEYS[11]).toBe('dec');
    });

    test('all keys are lowercase', () => {
        MONTH_KEYS.forEach(key => expect(key).toBe(key.toLowerCase()));
    });
});

describe('MONTHS', () => {
    test('has 12 entries', () => {
        expect(MONTHS).toHaveLength(12);
    });

    test('starts with Jan and ends with Dec', () => {
        expect(MONTHS[0]).toBe('Jan');
        expect(MONTHS[11]).toBe('Dec');
    });

    test('each MONTHS entry is the capitalised version of MONTH_KEYS entry', () => {
        MONTH_KEYS.forEach((key, i) => {
            expect(MONTHS[i].toLowerCase()).toBe(key);
        });
    });
});

// ---------------------------------------------------------------------------
// getChartData tests
// ---------------------------------------------------------------------------
describe('getChartData', () => {
    beforeEach(() => {
        // Reset all month inputs to empty before each test
        MONTH_KEYS_LOCAL.forEach(key => {
            document.getElementById(`income-${key}`).value = '';
            document.getElementById(`expense-${key}`).value = '';
        });
    });

    test('returns zero arrays when inputs are empty', () => {
        const { incomes, expenses } = getChartData();
        expect(incomes).toEqual(Array(12).fill(0));
        expect(expenses).toEqual(Array(12).fill(0));
    });

    test('reads income values correctly', () => {
        document.getElementById('income-jan').value = '1500';
        document.getElementById('income-jun').value = '2000';
        const { incomes } = getChartData();
        expect(incomes[0]).toBe(1500);
        expect(incomes[5]).toBe(2000);
    });

    test('reads expense values correctly', () => {
        document.getElementById('expense-dec').value = '999.99';
        const { expenses } = getChartData();
        expect(expenses[11]).toBe(999.99);
    });

    test('treats non-numeric input as 0', () => {
        document.getElementById('income-mar').value = 'abc';
        const { incomes } = getChartData();
        expect(incomes[2]).toBe(0);
    });

    test('returns arrays of length 12', () => {
        const { incomes, expenses } = getChartData();
        expect(incomes).toHaveLength(12);
        expect(expenses).toHaveLength(12);
    });
});
