const categories = ['Cricket', 'Football', 'Athletics', 'Indoor Games', 'Gym'];
const conditions = ['New', 'Good', 'Fair', 'Needs Repair'];
const icons = { Cricket: '🏏', Football: '⚽', Athletics: '⏱', 'Indoor Games': '🏸', Gym: '🏋' };
const seed = {
  version: 1,
  items: [
    ['CR-001', 'English Willow Cricket Bat', 'Cricket', 8, 1, 'Good', 'Pavilion · Rack A'],
    ['FB-001', 'Match Football', 'Football', 12, 0, 'New', 'Main Gym · Shelf B'],
    ['AT-001', 'Digital Stopwatch', 'Athletics', 6, 0, 'Good', 'Athletics Office'],
    ['IN-001', 'Badminton Racket', 'Indoor Games', 10, 2, 'Fair', 'Indoor Court · Rack C'],
    ['GY-001', '10 kg Dumbbell', 'Gym', 8, 0, 'Good', 'Fitness Centre'],
    ['CR-002', 'Practice Cricket Ball', 'Cricket', 20, 3, 'Good', 'Pavilion · Bin D'],
  ].map(([id, name, category, total, maintenance, condition, location]) => ({ id, name, category, total, maintenance, condition, location, createdAt: '2026-11-01T00:00:00.000Z' })),
  transactions: [],
};
const active = (state, id) => state.transactions.filter(t => t.itemId === id && !t.returnedAt).reduce((n, t) => n + t.quantity, 0);
const available = (state, item) => item.total - item.maintenance - active(state, item.id);
function borrow(state, input) {
  const item = state.items.find(i => i.id === input.itemId);
  if (!item || !input.borrower.trim() || !input.studentId.trim()) throw new Error('Enter a borrower name and student / staff ID.');
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > available(state, item)) throw new Error('Enter a quantity within the available stock.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate) || !Number.isFinite(Date.parse(input.dueDate)) || new Date(input.dueDate).toISOString().slice(0, 10) !== input.dueDate) throw new Error('Enter a valid due date as YYYY-MM-DD.');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (new Date(`${input.dueDate}T23:59:59`) < today) throw new Error('Due date must be today or later.');
  return { ...state, transactions: [{ ...input, borrower: input.borrower.trim(), studentId: input.studentId.trim(), id: `TX-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, issuedAt: new Date().toISOString(), returnedAt: null }, ...state.transactions] };
}
function returnItem(state, id) {
  if (!state.transactions.some(t => t.id === id && !t.returnedAt)) throw new Error('This transaction has already been returned.');
  return { ...state, transactions: state.transactions.map(t => t.id === id ? { ...t, returnedAt: new Date().toISOString() } : t) };
}
function updateItem(state, id, condition, maintenance) {
  const item = state.items.find(i => i.id === id);
  if (!item || !conditions.includes(condition) || !Number.isInteger(maintenance) || maintenance < 0 || maintenance > item.total - active(state, id)) throw new Error('Maintenance quantity must fit the stock currently on campus.');
  return { ...state, items: state.items.map(i => i.id === id ? { ...i, condition, maintenance } : i) };
}
module.exports = { categories, conditions, icons, seed, active, available, borrow, returnItem, updateItem };
