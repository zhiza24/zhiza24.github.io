const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(path.join(__dirname,'../game_v5/track28.js'),'utf8');
const start=source.indexOf('function recipeOf(T){');
const end=source.indexOf('\nfunction viewResults',start);
assert.ok(start>=0&&end>start,'recipe summary should exist');
const recipe=source.slice(start,end);
assert.ok(!recipe.includes('signs'),'coincidence/sign notes must not be treated as a success factor');
assert.ok(recipe.includes('не доказательство причины'),'summary must distinguish observation from causality');
assert.ok(source.includes('Сама запись не доказывает причинную связь и не предсказывает исход.'),'daily sign notes need a clear interpretation boundary');
assert.ok(source.includes('Это не оценка качества недели.'),'weekly completion percentage must not be framed as life quality');
assert.ok(!source.includes('Неделя уже удалась.'),'remove blanket success verdict from completion percentage');
assert.ok(source.includes('Качество проживаемого опыта'),'daily tracker should name lived-experience quality explicitly');
assert.ok(source.includes('data-act="quality"')&&source.includes("if(act==='quality'){d.quality=el.value;save(P);return}"),'quality note should be saved locally');
assert.ok(source.includes('qualityMoments')&&source.includes('stats.qualityMoments'),'quality notes should appear in the cycle mirror');
assert.ok(!/qualityScore|lifeQualityScore/.test(source),'lived-experience notes must not be converted into a score');
const dom=new JSDOM('<!doctype html><html><body><div id="t28"></div></body></html>',{url:'https://game.test/reactor.html',runScripts:'outside-only'});
dom.window.eval(source);
const stats=dom.window.GTrack28.mirrorActivityStats({
 days:{'1':{quality:'Красивый вечер и спокойный разговор'},'2':{quality:'   '},'3':{quality:'Интересный новый опыт'}},
 events24:{},checkpoints24:{}
});
assert.equal(JSON.stringify(stats.qualityMoments),JSON.stringify([
 {day:1,text:'Красивый вечер и спокойный разговор'},
 {day:3,text:'Интересный новый опыт'}
]));
dom.window.close();
console.log('PASS: tracker separates attention notes from causal claims and task completion from quality of life; lived-experience notes persist into the cycle mirror.');
