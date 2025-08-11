     // === НАСТРОЙКИ ШАБЛОНА ===
     const WEDDING = {
       couple: 'Руслан & Елизавета',
       dateISO: '2025-08-30',
       timeMain: '15:00',
       timeStart: '13:50',
       timeCeremony: '14:30',
       timezone: 'Europe/Moscow',
       timeEnd: '16:00',
      venueName: 'Москоу‑Сити, башня ОКО — ресторан «Birds»',
      address: '1-й Красногвардейский пр-д, 21 стр. 2, 84 этаж',
      mapsUrl: 'https://yandex.ru/maps/?text=Москоу-сити%20башня%20ОКО%20Birds%2084%20этаж'
    };

      const WISHLIST = [
      {
        id: 'aerogrill',
        title: 'Аэрогриль',
        link: 'https://www.wildberries.ru/catalog/252986314/detail.aspx?size=394996892',
        image: 'image/аэрогриль.png'
      },
      {
        id: 'tableware',
        title: 'Столовый сервиз',
        link: 'https://www.wildberries.ru/catalog/212966249/detail.aspx?size=340398755',
        image: 'image/столовый_сервиз.png'
      },
      {
        id: 'bedding1',
        title: 'Постельное бельё 1',
        link: 'https://www.wildberries.ru/catalog/275416950/detail.aspx?size=424599294',
        image: 'image/постельное_бельё.png'
      },
      {
        id: 'bedding2',
        title: 'Постельное бельё 2',
        link: 'https://www.wildberries.ru/catalog/232577407/detail.aspx?size=366852213',
        image: 'image/постельное_бельё_2.png'
      }
      ];
      const API_URL = 'https://script.google.com/macros/s/AKfycbyyEfM9vGn4z2Dcpl-DZjyouP57T-ZmwIBMPlTQU-sA_lVWw6hm18hNbPWqeulOpu9_fg/exec';

      async function apiList() {
        const res = await fetch(`${API_URL}?action=list`, { method: 'GET' });
        return res.json();
      }
      async function apiReserve(item_id, name) {
        const body = new URLSearchParams({ action: 'reserve', item_id, name });
        const res = await fetch(API_URL, { method: 'POST', body });
        return res.json();
      }
      async function apiCancel(item_id, token) {
        const body = new URLSearchParams({ action: 'cancel', item_id, token });
        const res = await fetch(API_URL, { method: 'POST', body });
        return res.json();
      }
      // === УТИЛИТЫ ДАТ/ФОРМАТОВ ===
      const dt = new Date(WEDDING.dateISO + 'T' + (WEDDING.timeStart || '12:00'));
    const dateFormatter = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const prettyDate = (d) => dateFormatter.format(d).replace(/^./, c => c.toUpperCase());

    // Отрисовка основных данных
    function hydrateBasics() {
      document.getElementById('coupleNames').textContent = WEDDING.couple;
      document.getElementById('footerNames').textContent = WEDDING.couple;
      document.getElementById('dateChip').textContent = prettyDate(dt);
      document.getElementById('dateText').textContent = dt.toLocaleDateString('ru-RU');
      const dateHero = document.getElementById('dateTextHero');
      if (dateHero) dateHero.textContent = dt.toLocaleDateString('ru-RU');
      document.getElementById('mainTime').textContent = WEDDING.timeMain;
      document.getElementById('startTime').textContent = WEDDING.timeStart;
      document.getElementById('ceremonyTime').textContent = WEDDING.timeCeremony;
      const tStart = document.getElementById('tStart');
      if (tStart) tStart.textContent = WEDDING.timeStart;
      const tCer = document.getElementById('tCeremony');
      if (tCer) tCer.textContent = WEDDING.timeCeremony;
      const tMain = document.getElementById('tMain');
      if (tMain) tMain.textContent = WEDDING.timeMain;
      const tEnd = document.getElementById('tEnd');
      if (tEnd) tEnd.textContent = WEDDING.timeEnd;
      document.getElementById('venueName').textContent = WEDDING.venueName;
      document.getElementById('venueAddr').textContent = WEDDING.address;
      document.title = `Свадьба — ${WEDDING.couple}`;
    }

    function startCountdown() {
      const el = document.getElementById('countdown');
      if (!el) return;
      const target = new Date(WEDDING.dateISO + 'T' + WEDDING.timeMain);
      function update() {
        const diff = target - new Date();
        if (diff <= 0) { el.textContent = 'Уже сегодня!'; clearInterval(timer); return; }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff % 86400000 / 3600000);
        const m = Math.floor(diff % 3600000 / 60000);
        el.textContent = `Осталось ${d}д ${h}ч ${m}м`;
      }
      update();
      const timer = setInterval(update, 60000);
    }

    // === КАЛЕНДАРЬ (.ICS) ===
    function downloadICS() {
      const tz = WEDDING.timezone || 'Europe/Moscow';
      const compact = (s) => s.replace(/[-:]/g, '');
      const start = `${compact(WEDDING.dateISO)}T${compact(WEDDING.timeMain)}00`;
      const end = `${compact(WEDDING.dateISO)}T${compact(WEDDING.timeEnd)}00`;
      const nowUTC = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z');
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wedding//Invitation//RU\nX-WR-TIMEZONE:${tz}\nBEGIN:VEVENT\nUID:${Date.now()}@wedding\nDTSTAMP:${nowUTC}\nDTSTART;TZID=${tz}:${start}\nDTEND;TZID=${tz}:${end}\nSUMMARY:Свадьба — ${WEDDING.couple}\nLOCATION:${WEDDING.venueName}, ${WEDDING.address}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'wedding.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }

    // === КАРТА ===
    function mapUrl() {
      const encoded = encodeURIComponent(WEDDING.address);
      const ua = navigator.userAgent;
      if (/iPad|iPhone|Mac/.test(ua)) return `http://maps.apple.com/?q=${encoded}`;
      if (/Android/.test(ua)) return `https://maps.google.com/?q=${encoded}`;
      return WEDDING.mapsUrl || `https://yandex.ru/maps/?text=${encoded}`;
    }

    function openMap() {
      window.open(mapUrl(), '_blank', 'noopener');
    }

    async function copyAddress() {
      await navigator.clipboard.writeText(`${WEDDING.venueName}, ${WEDDING.address}`);
      alert('Адрес скопирован');
    }

      // === ВИШ-ЛИСТ ===
      const grid = document.getElementById('wishGrid');
      const onlyFree = document.getElementById('onlyFree');
      const errorBanner = document.getElementById('wishError');
      const reserveDialog = document.getElementById('reserveDialog');
      const reserveForm = document.getElementById('reserveForm');
      const reserveName = document.getElementById('reserveName');
      const reserveCancel = document.getElementById('reserveCancel');
      let reserveItemId = null;

      onlyFree.checked = localStorage.getItem('onlyFree') === '1';

      // Локально храним только токен отмены; активные брони берём с сервера
      function getToken(id){ return localStorage.getItem('wish_token_'+id) || ''; }
      function setToken(id,t){ localStorage.setItem('wish_token_'+id, t); }
      function clearToken(id){ localStorage.removeItem('wish_token_'+id); }

      let SERVER_MAP = {}; // item_id -> name (активные брони)

        async function refreshFromServer() {
          try {
            const { ok, reservations } = await apiList();
            if (ok) {
              SERVER_MAP = reservations || {};
              errorBanner.classList.add('hidden');
            } else {
              errorBanner.classList.remove('hidden');
            }
          } catch (e) {
            console.error('Не удалось получить список броней', e);
            errorBanner.classList.remove('hidden');
          }
        }

      function isReserved(id) { return Boolean(SERVER_MAP[id]); }
      function reservedName(id) { return SERVER_MAP[id] || ''; }
      function escapeHtml(s) {
        return (s || '').replace(/[&<>"']/g, m => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        })[m]);
      }

      async function renderWishlist() {
        grid.innerHTML = WISHLIST.map(() => '<div class="wish-card skeleton" style="height:calc(128px + var(--gap))"></div>').join('');
        await refreshFromServer();
        grid.innerHTML = '';
        const filtered = WISHLIST.filter(item => !(onlyFree.checked && isReserved(item.id)));
        for (const item of filtered) {
          const reserved = isReserved(item.id);
          const owner = reservedName(item.id);
          const nameLabel = reserved ? `Забронировано — ${escapeHtml(owner)}` : 'Свободно';
          const hasToken = !!getToken(item.id);

          const card = document.createElement('div');
          card.className = 'wish-card' + (reserved ? ' wish-card--reserved' : '');
          const safeLink = /^https?:\/\//i.test(item.link || '') ? item.link : '#';
          const thumb = item.image
            ? `<img src="${item.image}" alt="${escapeHtml(item.title)}" loading="lazy" width="128" height="128">`
            : '🎁';
          const btnLabel = reserved ? (hasToken ? 'Снять бронь' : 'Забронировано') : 'Забронировать';
          const btnDisabled = reserved && !hasToken ? 'disabled' : '';
          card.innerHTML = `
            <div class="wish-thumb" aria-hidden="true">${thumb}</div>
            <div class="wish-meta">
              <h4 class="wish-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>
              <p class="wish-note">${escapeHtml(item.note || '')} ${item.price ? '• '+escapeHtml(item.price) : ''}</p>
            </div>
            <div class="wish-actions">
              <a class="btn btn--ghost" href="${safeLink}" target="_blank" rel="noopener">Смотреть</a>
              <span class="pill badge ${reserved ? 'reserved' : 'free'}">${nameLabel}</span>
              <button class="btn btn--primary" ${btnDisabled} aria-pressed="${reserved}" data-id="${item.id}">
                ${btnLabel}
              </button>
            </div>`;

          const btn = card.querySelector('button');
          if (!btn.disabled) {
            btn.addEventListener('click', async (e) => {
              const id = e.currentTarget.getAttribute('data-id');
              if (!isReserved(id)) {
                reserveItemId = id;
                reserveName.value = '';
                reserveDialog.showModal();
              } else {
                const token = getToken(id);
                if (!token) { alert('Снять бронь можно с того же устройства, где она оформлялась, либо напишите организаторам.'); return; }
                const r = await apiCancel(id, token);
                if (!r || !r.ok) { alert('Не удалось снять бронь.'); return; }
                clearToken(id);
                await renderWishlist();
              }
            });
          }

          grid.appendChild(card);
        }
        if (!filtered.length) {
          const empty = document.createElement('div');
          empty.className = 'card';
          empty.textContent = 'Нет позиций по выбранному фильтру.';
          grid.appendChild(empty);
        }
      }

      hydrateBasics();
      startCountdown();
      renderWishlist();
      setInterval(renderWishlist, 45000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) renderWishlist(); });

      const timelineEl = document.getElementById('timeline');
    if (timelineEl) {
      const observer = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          timelineEl.classList.add('animate');
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      observer.observe(timelineEl);
    }

    document.getElementById('icsBtn').addEventListener('click', downloadICS);
    document.getElementById('heroIcs').addEventListener('click', downloadICS);
    document.getElementById('mapBtn').addEventListener('click', openMap);
    document.getElementById('heroMap').addEventListener('click', openMap);
      document.getElementById('mapBtn2').addEventListener('click', openMap);
      document.getElementById('copyAddr').addEventListener('click', copyAddress);
      onlyFree.addEventListener('change', () => {
        localStorage.setItem('onlyFree', onlyFree.checked ? '1' : '0');
        renderWishlist();
      });
      reserveCancel.addEventListener('click', () => reserveDialog.close());
      reserveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = reserveName.value.trim();
        if (name.length < 2) { alert('Пожалуйста, укажите имя (не короче 2 символов).'); return; }
        const r = await apiReserve(reserveItemId, name);
        if (!r || !r.ok) {
          alert(r && r.error === 'already_reserved' ? 'Подарок уже забронирован другим гостем' : 'Ошибка бронирования. Попробуйте ещё раз.');
          return;
        }
        setToken(reserveItemId, r.token);
        reserveDialog.close();
        await renderWishlist();
      });
document.getElementById('coupleNames').classList.add('couple-names');
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  document.querySelectorAll('section, footer').forEach(el=>el.setAttribute('data-reveal',''));
  const io=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.1});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
}
const header=document.querySelector('header');
window.addEventListener('scroll',()=>{
  if(window.scrollY>0) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

const navLinks=document.querySelectorAll('.nav a[href^="#"]');
const sections=Array.from(navLinks).map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    const link=document.querySelector(`.nav a[href="#${entry.target.id}"]`);
    if(link){entry.isIntersecting?link.classList.add('is-active'):link.classList.remove('is-active');}
  });
},{rootMargin:'-50% 0px -50% 0px'});
sections.forEach(sec=>navObserver.observe(sec));
