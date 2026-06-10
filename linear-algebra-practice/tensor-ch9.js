// tensor-ch9.js — 第九章张量知识库交互逻辑
(function(){
'use strict';
marked.setOptions({breaks:true,gfm:true});

const S = function(id){return document.getElementById(id)};

// dark mode
const st = localStorage.getItem('alg_dark');
if (st === 'true') document.body.classList.add('dark');
S('themeBtn').textContent = document.body.classList.contains('dark')?'亮色':'暗色';
window.toggleDark = function(){
  var d = document.body.classList.toggle('dark');
  localStorage.setItem('alg_dark', d);
  S('themeBtn').textContent = d?'亮色':'暗色';
};

// comments
var sc = function(id){return 'kb9_'+id;};
var gc = function(id){try{return JSON.parse(localStorage.getItem(sc(id))||'[]')}catch(e){return[]}};
var sa = function(id,a){localStorage.setItem(sc(id),JSON.stringify(a))};

window.buildComments = function(id){
  var c = gc(id), w = S('cmt-'+id);
  if(!w) return;
  var l = w.querySelector('.cmt-list');
  l.innerHTML = c.map(function(x,i){
    return '<div class="cmt-item"><div class="cmt-time">'+x.t+'</div><div>'+x.x+'</div><button class="cmt-del" data-ix="'+i+'">×</button></div>';
  }).join('');
  l.querySelectorAll('.cmt-del').forEach(function(b){
    b.onclick = function(){
      var u = gc(id); u.splice(+b.dataset.ix, 1); sa(id, u); buildComments(id);
    };
  });
};

window.toggleComments = function(id){
  var w = S('cmt-'+id); if(!w) return;
  w.classList.toggle('open');
  if(w.classList.contains('open')) buildComments(id);
};

window.submitComment = function(id){
  var inp = S('ci-'+id), tx = inp.value.trim();
  if(!tx) return;
  var c = gc(id), n = new Date();
  c.push({x:tx, t: n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0')+'-'+String(n.getDate()).padStart(2,'0')+' '+String(n.getHours()).padStart(2,'0')+':'+String(n.getMinutes()).padStart(2,'0')});
  sa(id, c); inp.value = ''; buildComments(id);
};

window.copySection = function(id, btn){
  var sec = S(id);
  var r = (sec && sec.querySelector('.sec-body') && sec.querySelector('.sec-body').dataset.raw) || '';
  navigator.clipboard.writeText(r).then(function(){
    btn.classList.add('copied'); btn.querySelector('span').textContent = '已复制';
    setTimeout(function(){ btn.classList.remove('copied'); btn.querySelector('span').textContent = '复制'; }, 1500);
  });
};

// Build section DOM
function buildSection(id, heading, content){
  var div = document.createElement('div');
  div.className = 'sec';
  div.id = id;

  // header
  var hd = document.createElement('div');
  hd.className = 'sec-hd';
  var h2 = document.createElement('h2');
  h2.textContent = heading;
  var tools = document.createElement('div');
  tools.className = 'sec-tools';

  // copy btn
  var copyBtn = document.createElement('button');
  copyBtn.className = 'btn';
  copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg><span>复制</span>';
  copyBtn.onclick = function(){ window.copySection(id, copyBtn); };

  // comment btn
  var cmtBtn = document.createElement('button');
  cmtBtn.className = 'btn';
  cmtBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>评论';
  cmtBtn.onclick = function(){ window.toggleComments(id); };

  tools.appendChild(copyBtn);
  tools.appendChild(cmtBtn);
  hd.appendChild(h2);
  hd.appendChild(tools);

  // body
  var body = document.createElement('div');
  body.className = 'sec-body';
  body.innerHTML = marked.parse(content);
  body.dataset.raw = content;

  // comments
  var cmt = document.createElement('div');
  cmt.className = 'cmt';
  cmt.id = 'cmt-'+id;
  var cmtList = document.createElement('div');
  cmtList.className = 'cmt-list';
  var cmtWrap = document.createElement('div');
  cmtWrap.className = 'cmt-input-wrap';
  var cmtInput = document.createElement('textarea');
  cmtInput.className = 'cmt-input';
  cmtInput.id = 'ci-'+id;
  cmtInput.placeholder = '写下评论...';
  cmtInput.rows = 2;
  var cmtSubmit = document.createElement('button');
  cmtSubmit.className = 'cmt-submit';
  cmtSubmit.textContent = '发送';
  cmtSubmit.onclick = function(){ window.submitComment(id); };
  cmtWrap.appendChild(cmtInput);
  cmtWrap.appendChild(cmtSubmit);
  cmt.appendChild(cmtList);
  cmt.appendChild(cmtWrap);

  div.appendChild(hd);
  div.appendChild(body);
  div.appendChild(cmt);
  return div;
}

// Main fetch & render
fetch('tensor-ch9-content.txt')
  .then(function(r){ if(!r.ok) throw Error('not found'); return r.text(); })
  .then(function(md){
    // strip frontmatter
    var bs = md.startsWith('---') ? md.indexOf('---',4)+3 : 0;
    var body = md.slice(bs).trim();
    var parts = body.split(/^## /m);
    var intro = parts.shift();
    var ils = intro.trim().split('\n');
    var title = ils[0].replace(/^# /,'');
    S('pageTitle').textContent = title;
    document.title = title + ' · 高等代数知识库';

    // TOC
    var toc = S('toc');
    var tocOl = document.createElement('ol');
    var secs = [];
    parts.forEach(function(p, i){
      var nl = p.indexOf('\n');
      var h = nl>-1 ? p.slice(0, nl).trim() : p.trim();
      var content = nl>-1 ? p.slice(nl+1).trim() : '';
      var id = 's'+i;
      secs.push({id:id, heading:h, content:content});
      var li = document.createElement('li');
      li.innerHTML = '<a href="#'+id+'">'+h+'</a>';
      tocOl.appendChild(li);
    });
    toc.innerHTML = '<h2>目录</h2>';
    toc.appendChild(tocOl);

    // intro
    var it = ils.slice(1).join('\n').trim();
    if(it){
      var dc = document.createElement('div');
      dc.className = 'intro-card';
      dc.innerHTML = marked.parse(it);
      S('sections').appendChild(dc);
    }

    // sections
    var cont = S('sections');
    secs.forEach(function(s){
      cont.appendChild(buildSection(s.id, s.heading, s.content));
    });

    MathJax.typesetPromise && MathJax.typesetPromise();
  })
  .catch(function(e){
    S('pageTitle').textContent = '加载失败';
    S('sections').innerHTML = '<div class="sec"><div class="sec-body"><p style="color:var(--muted)">笔记文件未找到。请确认 notes/tensor-ch9.md 存在。</p></div></div>';
    console.error(e);
  });
})();
