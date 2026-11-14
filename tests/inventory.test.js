const { test } = require('node:test');
const assert = require('node:assert/strict');
const { seed, borrow, returnItem, available, updateItem } = require('../src/inventory');
const input = { itemId: 'CR-001', borrower: 'Alex', studentId: 'S001', quantity: 2, dueDate: '2099-01-01' };
test('borrowing and returning preserve counts and history', () => {
  const issued = borrow(seed, input);
  assert.equal(available(issued, issued.items[0]), 5);
  const returned = returnItem(issued, issued.transactions[0].id);
  assert.equal(available(returned, returned.items[0]), 7);
  assert.ok(returned.transactions[0].returnedAt);
  assert.throws(() => returnItem(returned, returned.transactions[0].id));
  assert.equal(seed.transactions.length, 0);
});
test('stock and date validation prevent invalid transactions', () => {
  assert.throws(() => borrow(seed, { ...input, quantity: 8 }));
  assert.throws(() => borrow(seed, { ...input, quantity: 1.5 }));
  assert.throws(() => borrow(seed, { ...input, dueDate: '2099-02-31' }));
  assert.throws(() => borrow(seed, { ...input, dueDate: '2020-01-01' }));
  const issued = borrow(seed, input);
  assert.throws(() => updateItem(issued, 'CR-001', 'Fair', 7));
  const maintained = updateItem(issued, 'CR-001', 'Fair', 3);
  assert.equal(available(maintained, maintained.items[0]), 3);
});
