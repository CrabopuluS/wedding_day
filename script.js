     // === НАСТРОЙКИ ШАБЛОНА ===
     const CONFIG = {
       couple: 'Елизавета и Руслан',
       invite: 'Мы начинаем новую главу нашей истории и будем счастливы, если вы станете её частью.',
       dateISO: '2025-08-30',
       dateHero: '30/08/2025',
       timeMain: '15:00',
       timeStart: '13:50',
       timeCeremony: '14:30',
       timezone: 'Europe/Moscow',
       timeEnd: '16:00',
      venueName: 'Москва-сити, Башня ОКО, 84 этаж 354, ресторан «Birds»',
     address: '1-й Красногвардейский пр-д, 21 стр. 2, 84 этаж',
     mapsUrl: '',
     apiUrl: 'https://script.google.com/macros/s/AKfycbyyEfM9vGn4z2Dcpl-DZjyouP57T-ZmwIBMPlTQU-sA_lVWw6hm18hNbPWqeulOpu9_fg/exec'
    };

    // Генерируем ссылку на карту на основе адреса
    CONFIG.mapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(CONFIG.address)}`;

      const WISHLIST = [
      {
        id: 'aerogrill',
        title: 'Аэрогриль',
        link: 'https://www.wildberries.ru/catalog/252986314/detail.aspx?size=394996892',
        image: 'image/presents/аэрогриль.png'
      },
      {
        id: 'tableware',
        title: 'Столовый сервиз',
        link: 'https://www.wildberries.ru/catalog/212966249/detail.aspx?size=340398755',
        image: 'image/presents/столовый_сервиз.png'
      },
      {
        id: 'bedding1',
        title: 'Постельное бельё 1',
        link: 'https://www.wildberries.ru/catalog/275416950/detail.aspx?size=424599294',
        image: 'image/presents/постельное_бельё.png'
      },
      {
        id: 'bedding2',
        title: 'Постельное бельё 2',
        link: 'https://www.wildberries.ru/catalog/232577407/detail.aspx?size=366852213',
        image: 'image/presents/постельное_бельё_2.png'
      },
      {
        id: 'wok_pan',
        title: 'Сковорода "Вок"',
        link: 'https://www.ozon.ru/product/skovoroda-vok-chugunnaya-so-semnoy-derevyannoy-ruchkoy-30-sm-dlya-vseh-vidov-plit-206721649/?at=x6tPnDD59HDVNBzNh4VRO9Dhk4mYvRU5QVv3WIPkWwGL',
        image: 'image/presents/сковорода_вок.png'
      },
      {
        id: 'alisa_midi',
        title: 'Колонка Алиса Midi',
        link: 'https://www.dns-shop.ru/product/e498e4397a02ed20/umnaa-kolonka-andeks-stancia-midi-cernyj/',
        image: 'image/presents/колонка_алиса.png'
      },
      {
        id: 'bath_towels',
        title: 'Полотенца банные',
        link: 'https://www.wildberries.ru/catalog/211848970/detail.aspx?targetUrl=SG',
        image: 'image/presents/набор_банных_полотенец.png'
      },
      {
        id: 'air_purifier',
        title: 'Очиститель воздуха',
        link: 'https://www.dns-shop.ru/product/65c8dce4e8342ff2/ocistitel-vozduha-smartmi-air-purifier-p1-zmkqjhqp12-seryj/',
        image: 'image/presents/очиститель_воздуха.png'
      },
      {
        id: 'electric_grill',
        title: 'Электрический гриль',
        link: 'https://www.dns-shop.ru/product/ff7f24c6dd8f1b80/gril-dexp-mgl-2000-cernyj/',
        image: 'image/presents/электрический_гриль.png'
      },
      {
        id: 'toaster',
        title: 'Тостер',
        link: 'https://www.dns-shop.ru/product/563b26e85192aef8/toster-tefal-ultimate-digital-control-panel-tt3228e0-cernyj/',
        image: 'image/presents/тостер.png'
      },
      {
        id: 'cutlery_set',
        title: 'Набор столовых приборов',
        link: 'https://www.ozon.ru/product/nabor-stolovyh-priborov-serebro-1643902020/?at=lRt60mDy5cmBZq97hP6ZKRqtlkmP9vuv3M2X1U0z74D7',
        image: 'image/presents/набор_столовых_приборов.png'
      },
      {
        id: 'hand_blender',
        title: 'Блендер погружной',
        link: 'https://www.dns-shop.ru/product/41d914c74ebe3330/blender-pogruznoj-polaris-phb-1382l-silent-serebristyj/',
        image: 'image/presents/блендер_погружной.png'
      }
      ];
      async function apiList() {
        const res = await fetch(`${CONFIG.apiUrl}?action=list`, { method: 'GET' });
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      }
      async function apiReserve(item_id, name) {
        const body = new URLSearchParams({ action: 'reserve', item_id, name });
        const res = await fetch(CONFIG.apiUrl, { method: 'POST', body });
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      }
      async function apiCancel(item_id, token) {
        const body = new URLSearchParams({ action: 'cancel', item_id, token });
        const res = await fetch(CONFIG.apiUrl, { method: 'POST', body });
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      }
      // === УТИЛИТЫ ДАТ/ФОРМАТОВ ===
    const dt = new Date(`${CONFIG.dateISO}T${CONFIG.timeStart || '12:00'}:00+03:00`);

    function updateMetaUrls() {
      const url = window.location.href.split('#')[0];
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', url);
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', url);
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        const imgUrl = new URL(ogImage.getAttribute('content'), url);
        ogImage.setAttribute('content', imgUrl.toString());
      }
    }

    // Отрисовка основных данных
    function hydrateBasics() {
      document.getElementById('coupleNames').textContent = CONFIG.couple;
      document.getElementById('footerNames').textContent = CONFIG.couple;
      const inviteEl = document.getElementById('heroInvite');
      if (inviteEl) inviteEl.textContent = CONFIG.invite;
      document.getElementById('dateText').textContent = dt.toLocaleDateString('ru-RU');
      const dateHero = document.getElementById('dateTextHero');
      if (dateHero) dateHero.textContent = CONFIG.dateHero || dt.toLocaleDateString('ru-RU');
      document.getElementById('mainTime').textContent = CONFIG.timeMain;
      document.getElementById('startTime').textContent = CONFIG.timeStart;
      document.getElementById('ceremonyTime').textContent = CONFIG.timeCeremony;
      const tStart = document.getElementById('tStart');
      if (tStart) tStart.textContent = CONFIG.timeStart;
      const tCer = document.getElementById('tCeremony');
      if (tCer) tCer.textContent = CONFIG.timeCeremony;
      const tMain = document.getElementById('tMain');
      if (tMain) tMain.textContent = CONFIG.timeMain;
      const tEnd = document.getElementById('tEnd');
      if (tEnd) tEnd.textContent = CONFIG.timeEnd;
      document.getElementById('venueName').textContent = CONFIG.venueName;
      document.getElementById('venueAddr').textContent = CONFIG.address;
      const mapEmbed = document.getElementById('mapEmbed');
      if (mapEmbed) {
        mapEmbed.innerHTML = `<iframe src="https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.address)}&output=embed" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
      }
      document.title = `Свадьба — ${CONFIG.couple}`;
      updateMetaUrls();
    }

    let countdownTimer;
    function startCountdown() {
      const el = document.getElementById('countdown');
      if (!el) return;
      const target = new Date(`${CONFIG.dateISO}T${CONFIG.timeMain}:00+03:00`);
      const dd = el.querySelectorAll('#cd-days .digit');
      const hh = el.querySelectorAll('#cd-hours .digit');
      const mm = el.querySelectorAll('#cd-minutes .digit');
      const ss = el.querySelectorAll('#cd-seconds .digit');
      function update() {
        const diff = target - new Date();
        if (diff <= 0) { el.style.display = 'none'; clearInterval(countdownTimer); return; }
        const d = String(Math.floor(diff / 86400000)).padStart(2, '0');
        const h = String(Math.floor(diff % 86400000 / 3600000)).padStart(2, '0');
        const m = String(Math.floor(diff % 3600000 / 60000)).padStart(2, '0');
        const s = String(Math.floor(diff % 60000 / 1000)).padStart(2, '0');
        dd[0].textContent = d[0]; dd[1].textContent = d[1];
        hh[0].textContent = h[0]; hh[1].textContent = h[1];
        mm[0].textContent = m[0]; mm[1].textContent = m[1];
        ss[0].textContent = s[0]; ss[1].textContent = s[1];
      }
      update();
      clearInterval(countdownTimer);
      countdownTimer = setInterval(update, 1000);
    }

    // === КАЛЕНДАРЬ (.ICS) ===
    function downloadICS() {
      const tz = CONFIG.timezone || 'Europe/Moscow';
      const compact = (s) => s.replace(/[-:]/g, '');
      const escape = (s) => s.replace(/[\n,;]/g, (ch) => ({ '\n': '\\n', ',': '\\,', ';': '\\;' }[ch]));
      const start = `${compact(CONFIG.dateISO)}T${compact(CONFIG.timeMain)}00`;
      const end = `${compact(CONFIG.dateISO)}T${compact(CONFIG.timeEnd)}00`;
      const nowUTC = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z');
      const summary = escape(`Свадьба: ${CONFIG.couple}`);
      const location = escape(`${CONFIG.venueName}, ${CONFIG.address}`);
      const description = escape(CONFIG.invite);
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wedding//Invitation//RU\nX-WR-TIMEZONE:${tz}\nBEGIN:VEVENT\nUID:${Date.now()}@wedding\nDTSTAMP:${nowUTC}\nDTSTART;TZID=${tz}:${start}\nDTEND;TZID=${tz}:${end}\nSUMMARY:${summary}\nLOCATION:${location}\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
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
      const encoded = encodeURIComponent(CONFIG.address);
      const ua = navigator.userAgent;
      if (/iPad|iPhone|Mac/.test(ua)) return `http://maps.apple.com/?q=${encoded}`;
      if (/Android/.test(ua)) return `https://maps.google.com/?q=${encoded}`;
      return CONFIG.mapsUrl || `https://yandex.ru/maps/?text=${encoded}`;
    }

    function openMap() {
      window.open(mapUrl(), '_blank', 'noopener,noreferrer');
    }

      function copyAddress() {
        const full = `${CONFIG.venueName}, ${CONFIG.address}`;
        navigator.clipboard.writeText(full).then(() => {
          const msg = document.getElementById('copyMsg');
          if (msg) {
            msg.textContent = 'Адрес скопирован';
            msg.classList.add('show');
            setTimeout(() => {
              msg.classList.remove('show');
              msg.textContent = '';
            }, 2000);
          }
        }).catch(() => {
          alert('Не удалось скопировать адрес');
        });
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
      const supportsDialog = typeof HTMLDialogElement === 'function' && typeof reserveDialog.showModal === 'function';
      function openReserveDialog(){
        supportsDialog ? reserveDialog.showModal() : reserveDialog.classList.remove('hidden');
        reserveName.focus();
      }
      function closeReserveDialog(){ supportsDialog ? reserveDialog.close() : reserveDialog.classList.add('hidden'); }
      if(!supportsDialog){ reserveDialog.classList.add('modal-fallback','hidden'); document.addEventListener('keydown',e=>{ if(e.key==='Escape' && !reserveDialog.classList.contains('hidden')) closeReserveDialog(); }); }

      // По умолчанию показываем только свободные позиции
      onlyFree.checked = localStorage.getItem('onlyFree') !== '0';

      // Локально храним только токен отмены; активные брони берём с сервера
      function getToken(id){ return localStorage.getItem('wish_token_'+id) || ''; }
      function setToken(id,t){ localStorage.setItem('wish_token_'+id, t); }
      function clearToken(id){ localStorage.removeItem('wish_token_'+id); }

      let SERVER_MAP = {}; // item_id -> name (активные брони)

        async function fetchWishes() {
          try {
            const { ok, reservations } = await apiList();
            if (ok) {
              SERVER_MAP = reservations || {};
              errorBanner.classList.add('hidden');
              return;
            }
            throw new Error('bad response');
          } catch (e) {
            console.error('Не удалось получить список броней', e);
            errorBanner.classList.remove('hidden');
            try {
              const local = await fetch('./data/wishlist.json').then(r => r.json());
              SERVER_MAP = local.reservations || {};
            } catch (e2) {
              SERVER_MAP = {};
            }
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

      function formatPrice(price) {
        if (price == null) return '';
        if (Array.isArray(price) && price.length === 2) {
          const [a, b] = price;
          return `${Number(a).toLocaleString('ru-RU')}–${Number(b).toLocaleString('ru-RU')} ₽`;
        }
        if (typeof price === 'string') {
          const parts = price.split(/[-–]/).map(p => Number(p.trim()));
          if (parts.length === 2 && !parts.some(isNaN)) {
            return `${parts[0].toLocaleString('ru-RU')}–${parts[1].toLocaleString('ru-RU')} ₽`;
          }
          const num = Number(price);
          if (!isNaN(num)) return `${num.toLocaleString('ru-RU')} ₽`;
          return price;
        }
        const num = Number(price);
        if (!isNaN(num)) return `${num.toLocaleString('ru-RU')} ₽`;
        return String(price);
      }

      async function renderWishlist() {
        grid.innerHTML = '';
        const skeletons = document.createDocumentFragment();
        WISHLIST.forEach(() => {
          const skel = document.createElement('div');
          skel.className = 'wish-card skeleton';
          skel.style.height = 'calc(128px + var(--gap))';
          skeletons.appendChild(skel);
        });
        grid.appendChild(skeletons);
        await fetchWishes();
        grid.innerHTML = '';
        const filtered = WISHLIST.filter(item => !(onlyFree.checked && isReserved(item.id)));
        const fragment = document.createDocumentFragment();
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
              <p class="wish-note">${escapeHtml(item.note || '')}${item.price ? ' • '+escapeHtml(formatPrice(item.price)) : ''}</p>
            </div>
            <div class="wish-actions">
                <a class="btn btn--ghost" href="${safeLink}" target="_blank" rel="nofollow noopener noreferrer">Смотреть</a>
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
                openReserveDialog();
              } else {
                const token = getToken(id);
                if (!token) { alert('Снять бронь можно с того же устройства, где она оформлялась, либо напишите организаторам.'); return; }
                const btnEl = e.currentTarget;
                const cardEl = btnEl.closest('.wish-card');
                const badgeEl = cardEl.querySelector('.badge');
                const prevBadgeClass = badgeEl.className;
                const prevBadgeText = badgeEl.textContent;
                btnEl.disabled = true;
                const prevHtml = btnEl.innerHTML;
                btnEl.innerHTML = '<span class="spinner" aria-hidden="true"></span>';
                cardEl.style.opacity = '0.5';
                badgeEl.className = 'pill badge free';
                badgeEl.textContent = 'Свободно';
                let r;
                try {
                  r = await apiCancel(id, token);
                } catch (err) {
                  r = null;
                }
                if (!r || !r.ok) {
                  alert('Не удалось снять бронь.');
                  btnEl.disabled = false;
                  btnEl.innerHTML = prevHtml;
                  badgeEl.className = prevBadgeClass;
                  badgeEl.textContent = prevBadgeText;
                  cardEl.style.opacity = '';
                  return;
                }
                clearToken(id);
                await renderWishlist();
              }
            });
          }

          fragment.appendChild(card);
        }
        if (!filtered.length) {
          const empty = document.createElement('div');
          empty.className = 'card';
          empty.textContent = 'Нет позиций по выбранному фильтру.';
          fragment.appendChild(empty);
        }
        grid.appendChild(fragment);
      }

      hydrateBasics();
      startCountdown();
      renderWishlist();
      setInterval(renderWishlist, 45000);
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          startCountdown();
          renderWishlist();
        }
      });

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

    document.getElementById('heroIcs').addEventListener('click', downloadICS);
    document.getElementById('detailsIcs')?.addEventListener('click', downloadICS);
    document.getElementById('mapBtn2').addEventListener('click', openMap);
    document.getElementById('copyAddr').addEventListener('click', copyAddress);
      onlyFree.addEventListener('change', () => {
        localStorage.setItem('onlyFree', onlyFree.checked ? '1' : '0');
        renderWishlist();
      });
      reserveCancel.addEventListener('click', () => closeReserveDialog());
      reserveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = reserveName.value.trim();
        if (name.length < 2) { alert('Пожалуйста, укажите имя (не короче 2 символов).'); return; }
        const submitBtn = reserveForm.querySelector('button[type="submit"]');
        const prevHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        reserveCancel.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span>';
        let r;
        try {
          r = await apiReserve(reserveItemId, name);
        } catch (err) {
          r = null;
        }
        submitBtn.disabled = false;
        reserveCancel.disabled = false;
        submitBtn.innerHTML = prevHtml;
        if (!r || !r.ok) {
          alert(r && r.error === 'already_reserved' ? 'Подарок уже забронирован другим гостем' : 'Ошибка бронирования. Попробуйте ещё раз.');
          return;
        }
        setToken(reserveItemId, r.token);
        closeReserveDialog();
        await renderWishlist();
      });
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
    if(link){
      if(entry.isIntersecting){
        link.classList.add('is-active');
        link.setAttribute('aria-current','page');
      }else{
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    }
  });
},{rootMargin:'-50% 0px -50% 0px'});
sections.forEach(sec=>navObserver.observe(sec));

const nav=document.querySelector('.nav');
const burger=document.getElementById('burger');
burger?.addEventListener('click',()=>{const opened=nav.classList.toggle('open');burger.setAttribute('aria-expanded',opened?'true':'false');});
navLinks.forEach(l=>l.addEventListener('click',()=>{nav.classList.remove('open');burger.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false');}});

function setHeroHeight(){
  const hero=document.querySelector('.hero');
  const header=document.querySelector('header');
  if(hero&&header){
    hero.style.minHeight=`calc(100vh - ${header.offsetHeight}px)`;
  }
}
window.addEventListener('load',setHeroHeight);
window.addEventListener('resize',setHeroHeight);
