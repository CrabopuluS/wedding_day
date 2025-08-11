/* script.js — улучшенная логика, безопасный рендер и мелкие оптимизации */
const WEDDING = {
  couple: 'Руслан & Елизавета',
  dateISO: '2025-08-30',              // YYYY-MM-DD
  timezone: 'Europe/Moscow',
  timeStart: '13:50',
  timeCeremony: '14:30',
  timeMain: '15:00',
  timeEnd: '16:00',
  venueName: 'Москоу‑Сити, башня ОКО — ресторан «Birds»',
  address: '1-й Красногвардейский пр-д, 21 стр. 2, 84 этаж',
  mapsUrl: 'https://yandex.ru/maps/?text=Москоу-сити%20башня%20ОКО%20Birds%2084%20этаж'
};

/** Если у вас есть сервер для вишлиста — укажите URL. Иначе оставьте пустым. */
const API_URL = ''; // пример: 'https://script.google.com/macros/s/XXXX/exec'

/* ======= Утилиты ======= */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function fmtDate(date, tz=WEDDING.timezone, opts={}){
  const base = { day:'numeric', month:'long', year:'numeric' };
  return new Intl.DateTimeFormat('ru-RU', { timeZone: tz, ...base, ...opts }).format(date);
}
function fmtTime(date, opts={}){
  const base = { hour:'2-digit', minute:'2-digit' };
  return new Intl.DateTimeFormat('ru-RU', { timeZone: WEDDING.timezone, ...base, ...opts }).format(date);
}
function toZonedDate(isoDate, time='00:00'){
  // Создаем дату в нужном часовом поясе
  const [y,m,d] = isoDate.split('-').map(Number);
  const [hh,mm] = time.split(':').map(Number);
  // Конструируем как локальную UTC, дальше форматируем через Intl
  return new Date(Date.UTC(y, m-1, d, hh, mm, 0));
}

/* ======= Инициализация текста ======= */
function initCopy(){
  $('#coupleNames').textContent = WEDDING.couple;
  $('#footerNames').textContent = WEDDING.couple;

  const main = toZonedDate(WEDDING.dateISO, WEDDING.timeMain);
  const start = toZonedDate(WEDDING.dateISO, WEDDING.timeStart);
  const cer = toZonedDate(WEDDING.dateISO, WEDDING.timeCeremony);
  const end = toZonedDate(WEDDING.dateISO, WEDDING.timeEnd);

  $('#dateTextHero').textContent = fmtDate(main, WEDDING.timezone);
  $('#dateText').textContent = fmtDate(main, WEDDING.timezone);
  $('#mainTime').textContent = fmtTime(main);
  $('#startTime').textContent = fmtTime(start);
  $('#ceremonyTime').textContent = fmtTime(cer);
  $('#tStart').textContent = fmtTime(start);
  $('#tCeremony').textContent = fmtTime(cer);
  $('#tMain').textContent = fmtTime(main);
  $('#tEnd').textContent = fmtTime(end);

  $('#venueName').textContent = WEDDING.venueName;
  $('#venueAddr').textContent = WEDDING.address;

  // Chip
  const daysLeft = Math.max(0, Math.ceil((toZonedDate(WEDDING.dateISO).getTime() - Date.now())/86400000));
  $('#dateChip').textContent = daysLeft ? `Через ${daysLeft} дн.` : `Сегодня`;
}

/* ======= Countdown ======= */
let timerId;
function startCountdown(){
  const target = toZonedDate(WEDDING.dateISO, WEDDING.timeMain).getTime();
  function tick(){
    const now = Date.now();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff/86400000); diff -= d*86400000;
    const h = Math.floor(diff/3600000); diff -= h*3600000;
    const m = Math.floor(diff/60000); diff -= m*60000;
    const s = Math.floor(diff/1000);

    $('#countdown').textContent = d>0 ? `${d}д ${h}ч ${m}м ${s}с`
                                     : `${h}ч ${m}м ${s}с`;
    if(target - now <= 0){ clearInterval(timerId); }
  }
  tick(); timerId = setInterval(tick, 1000);
}

/* ======= ICS генерация ======= */
function makeICS(){
  const date = WEDDING.dateISO.replaceAll('-','');
  const toICS = (t) => t.replace(':','') + '00';
  const dtstart = `${date}T${toICS(WEDDING.timeMain)}`;
  const dtend   = `${date}T${toICS(WEDDING.timeEnd)}`;
  const uid = crypto.randomUUID?.() || (Date.now()+'-'+Math.random());
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//wedding-invite//ru',
    `CALSCALE:GREGORIAN`,
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,
    `DTSTART;TZID=${WEDDING.timezone}:${dtstart}`,
    `DTEND;TZID=${WEDDING.timezone}:${dtend}`,
    `SUMMARY:Свадьба — ${WEDDING.couple}`,
    `LOCATION:${WEDDING.venueName}, ${WEDDING.address}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type:'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'wedding.ics';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

/* ======= Навигация, меню ======= */
function initNav(){
  const nav = $('.nav');
  const burger = $('#burger');
  const navLinks = $$('#navLinks a');

  burger?.addEventListener('click',()=>{
    const opened = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', opened ? 'true' : 'false');
  });
  navLinks.forEach(l => l.addEventListener('click', ()=>{
    nav.classList.remove('open'); burger?.setAttribute('aria-expanded','false');
  }));

  // Highlight current section
  const sections = navLinks
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);
  const navObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const link = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
      if(!link) return;
      if(entry.isIntersecting){ link.classList.add('is-active'); link.setAttribute('aria-current','true'); }
      else { link.classList.remove('is-active'); link.removeAttribute('aria-current'); }
    });
  },{ rootMargin:'-50% 0px -50% 0px' });
  sections.forEach(sec=>navObserver.observe(sec));

  // Shadow on scroll
  const header = document.querySelector('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY>4);
  onScroll(); window.addEventListener('scroll', onScroll, { passive:true });
}

/* ======= Карта и буфер обмена ======= */
function initActions(){
  const mapHandlers = ['#mapBtn','#navMap','#mapBtn2'];
  const icsHandlers = ['#icsBtn','#navIcs'];

  mapHandlers.forEach(sel => $(sel)?.addEventListener('click', ()=>{
    window.open(WEDDING.mapsUrl,'_blank','noopener,noreferrer');
  }));
  icsHandlers.forEach(sel => $(sel)?.addEventListener('click', makeICS));

  $('#copyAddr')?.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(`${WEDDING.venueName}, ${WEDDING.address}`);
      $('#copyAddr').classList.add('pill'); $('#copyAddr').textContent='✓';
      setTimeout(()=>{ $('#copyAddr').classList.remove('pill'); $('#copyAddr').textContent='📋'; }, 1200);
    }catch(e){ alert('Не удалось скопировать'); }
  });
}

/* ======= Вишлист (опционально) ======= */
async function renderWishlist(){
  const grid = $('#wishGrid');
  const onlyFree = $('#onlyFree');
  if(!grid) return;

  // Отображаем скелетоны
  const skel = (n=6)=> new Array(n).fill(0).map(()=>{
    const card = document.createElement('div'); card.className='wish-card';
    const thumb = document.createElement('div'); thumb.className='wish-thumb skeleton';
    const content = document.createElement('div'); content.style.flex='1';
    const p1=document.createElement('div'); p1.className='skeleton'; p1.style.height='18px'; p1.style.margin='4px 0 8px';
    const p2=document.createElement('div'); p2.className='skeleton'; p2.style.height='14px'; p2.style.width='70%';
    content.append(p1,p2); card.append(thumb,content); return card;
  });
  grid.replaceChildren(...skel(6));

  let items = [];
  try{
    if(API_URL){
      const res = await fetch(`${API_URL}?action=list`, { method: 'GET' });
      items = await res.json();
    }else{
      // Локальные заглушки для разработки
      items = [
        { id:1, title:'Тостер', price:'5 000 ₽', url:'#', reserved:false },
        { id:2, title:'Фоторамка', price:'2 000 ₽', url:'#', reserved:true },
        { id:3, title:'Плед', price:'3 000 ₽', url:'#', reserved:false },
      ];
    }
  }catch(e){
    $('#wishError')?.classList.remove('hidden');
  }

  function draw(){
    const showFree = onlyFree?.checked;
    const list = items.filter(it => showFree ? !it.reserved : true);
    grid.replaceChildren(...list.map(renderItem));
  }
  function renderItem(it){
    const card = document.createElement('div'); card.className='wish-card'+(it.reserved?' wish-card--reserved':'');
    const thumb = document.createElement('div'); thumb.className='wish-thumb';
    const img = document.createElement('img'); img.loading='lazy'; img.alt='';
    img.src = it.image || 'data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\"><rect width=\"100%\" height=\"100%\" fill=\"#F1F3F5\"/></svg>';
    thumb.appendChild(img);

    const content = document.createElement('div'); content.style.flex='1';
    const title = document.createElement('div'); title.textContent = it.title;
    const price = document.createElement('div'); price.className='muted'; price.textContent = it.price || '';

    const actions = document.createElement('div'); actions.className='wish-actions';
    const link = document.createElement('a'); link.href = it.url || '#'; link.target='_blank'; link.rel='noopener noreferrer'; link.className='btn btn--ghost'; link.textContent='Ссылка';
    const btn = document.createElement('button'); btn.className='btn btn--primary'; btn.textContent = it.reserved ? 'Занято' : 'Забронировать'; btn.disabled = !!it.reserved;

    btn.addEventListener('click', ()=> openReserveDialog(it));

    content.append(title,price);
    actions.append(link,btn);
    card.append(thumb,content,actions);
    return card;
  }

  onlyFree?.addEventListener('change', draw);
  draw();
}

/* ======= Dialog (с запасным вариантом для Safari) ======= */
function ensureDialog(){
  const dlg = $('#reserveDialog');
  if(typeof dlg.showModal === 'function') return true;

  // Fallback
  dlg.classList.add('modal-fallback');
  dlg.showModal = ()=> dlg.classList.remove('hidden');
  dlg.close = ()=> dlg.classList.add('hidden');
  return true;
}

function openReserveDialog(item){
  const dlg = $('#reserveDialog');
  ensureDialog();
  dlg.showModal();
  const form = $('#reserveForm');
  const cancel = $('#reserveCancel');
  const input = $('#reserveName');
  input.value=''; input.focus();

  async function onSubmit(e){
    e?.preventDefault?.();
    const name = input.value.trim();
    if(!name) return;

    if(API_URL){
      try{
        const body = new URLSearchParams({ action:'reserve', item_id:String(item.id), name });
        const res = await fetch(API_URL, { method:'POST', body });
        const data = await res.json();
        if(data?.ok){ dlg.close(); renderWishlist(); return; }
        alert('Не получилось забронировать, попробуйте позже.');
      }catch(e){ alert('Ошибка сети.'); }
    }else{
      // Местный mock
      dlg.close();
      alert('Спасибо! (демо-режим)');
    }
  }
  form.onsubmit = onSubmit;
  cancel.onclick = ()=> dlg.close();
}

/* ======= Старт ======= */
function main(){
  initCopy();
  initNav();
  initActions();
  startCountdown();
  renderWishlist();
}
document.addEventListener('DOMContentLoaded', main);
