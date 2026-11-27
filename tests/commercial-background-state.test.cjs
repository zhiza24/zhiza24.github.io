const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '../game_commercial');
const context = { console, Date, Math, JSON, Object, Array, Number, String };
context.window = context;
vm.runInNewContext(fs.readFileSync(path.join(root, 'background-state-16-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(root, 'background-state-16-engine.js'), 'utf8'), context);
const D = context.GBGS16;
const E = context.GBackgroundState16;
assert.equal(D.Q.length, 16, 'commercial background state test must contain 16 situations');
assert.equal(D.SPHERES.length, 8, 'test must cover eight life spheres');
assert.deepEqual(Object.keys(D.PROFILES).sort(), ['D','K','O','R','S']);
const perSphere = {};
for (const q of D.Q) {
  perSphere[q[1]] = (perSphere[q[1]] || 0) + 1;
  assert.equal(q[3].length, 5, q[0] + ' must have five response options');
  assert.deepEqual(Array.from(q[3], x => x[1]).sort(), ['D','K','O','R','S'], q[0] + ' must distinguish all five states');
}
assert.equal(Object.keys(perSphere).length, 8);
assert.ok(Object.values(perSphere).every(n => n === 2), 'each sphere must contain exactly two situations');
function answersFor(id, sphereIndexes) {
  const a = {};
  D.Q.forEach(q => { if (sphereIndexes.includes(q[1])) a[q[0]] = { primary: id }; });
  return a;
}
for (const id of ['O','D','K','R','S']) {
  const r = E.calculate(answersFor(id, [0,1,2]), {});
  const group = id === 'S' ? r.groups.resource : r.groups.protective;
  assert.ok(group.leaders.includes(id), id + ' must become a leader after recurring in three spheres');
}
const secondaryAnswers = {};
secondaryAnswers[D.Q[0][0]] = { primary: 'O', secondary: 'D' };
const weighted = E.calculate(secondaryAnswers, {});
assert.equal(weighted.families.find(x => x.id === 'O').points, 2);
assert.equal(weighted.families.find(x => x.id === 'D').points, 1);
const limited = E.calculate(answersFor('O', [0,1]), {});
assert.equal(limited.groups.protective.status, 'no_clear_leader', 'two spheres must not create a leading state');
const mixed = {};
D.Q.forEach(q => {
  if ([0,1,2].includes(q[1])) mixed[q[0]] = { primary: 'O' };
  if ([3,4,5].includes(q[1])) mixed[q[0]] = { primary: 'S' };
});
const split = E.calculate(mixed, {});
assert.ok(split.groups.protective.leaders.includes('O'));
assert.ok(split.groups.resource.leaders.includes('S'), 'resource score must be calculated independently');
const tied = {};
D.Q.forEach(q => {
  if ([0,1,2].includes(q[1])) tied[q[0]] = { primary: 'O' };
  if ([3,4,5].includes(q[1])) tied[q[0]] = { primary: 'D' };
});
assert.equal(E.calculate(tied, {}).groups.protective.status, 'two_close');
const skipped = {};
D.Q.forEach(q => { skipped[q[0]] = { skipped: true }; });
const empty = E.calculate(skipped, {});
assert.equal(empty.coverage.answered, 0);
assert.equal(empty.coverage.skipped, 16);
const ui = fs.readFileSync(path.join(root, 'background-state-16.js'), 'utf8');
new Function(ui);
for (const phrase of ['Ведущее защитное ожидание','Ресурсная опора','Чем она обходится','Куда направить внимание','Вопрос для дальнейшего исследования']) {
  assert.ok(ui.includes(phrase), 'result UI must include: ' + phrase);
}
console.log('PASS: commercial background state — 16 human-readable situations, eight balanced spheres, five distinct states, 2/1 weighting, independent resource scoring, three-sphere threshold, close leaders, skip handling, and full result interpretations.');
