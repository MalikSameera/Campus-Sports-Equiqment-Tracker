const { test } = require('node:test');
const assert = require('node:assert/strict');
const { seed, filterInventory, borrow, returnItem } = require('../src/inventory');

test('catalog combines trimmed name or asset search with category and stock filters', () => {
  assert.deepEqual(filterInventory(seed, { query: '  cr-001  ', category: 'Cricket', status: 'Maintenance' }).map(i => i.id), ['CR-001']);
  assert.equal(filterInventory(seed, { query: 'CR-001', category: 'Gym' }).length, 0);
  assert.equal(filterInventory(seed, { query: 'WILLOW', status: 'Available' }).length, 1);
  assert.equal(filterInventory(seed, { query: 'missing asset' }).length, 0);
  assert.equal(filterInventory(seed, { query: '   ' }).length, seed.items.length);
  assert.equal(filterInventory({ ...seed, items: [] }).length, 0);
});

test('availability filters follow partial loans, exhausted stock, and returns', () => {
  const input = { itemId: 'CR-001', borrower: 'Alex', studentId: 'S001', quantity: 2, dueDate: '2099-01-01' };
  const partial = borrow(seed, input);
  assert.equal(filterInventory(partial, { query: 'CR-001', status: 'Available' }).length, 1);
  assert.equal(filterInventory(partial, { status: 'Borrowed' }).length, 1);
  const exhausted = borrow(partial, { ...input, quantity: 5 });
  assert.equal(filterInventory(exhausted, { query: 'CR-001', status: 'Available' }).length, 0);
  assert.equal(filterInventory(exhausted, { query: 'CR-001', status: 'Maintenance' }).length, 1);
  const returned = returnItem(partial, partial.transactions[0].id);
  assert.equal(filterInventory(returned, { status: 'Borrowed' }).length, 0);
  assert.equal(filterInventory(returned).length, seed.items.length);
});
