document.addEventListener('DOMContentLoaded', () => {
  const loginPage = document.getElementById('login-page');
  const loginForm = document.getElementById('login-form');
  const appHeader = document.querySelector('.app-header');
  const appMain = document.querySelector('.app');
  const bottomNav = document.querySelector('.bottom-nav');
  const settingsPage = document.getElementById('settings-page');

  function showLogin() {
    loginPage.classList.remove('hidden');
    appHeader.classList.add('hidden');
    appMain.classList.add('hidden');
    bottomNav.classList.add('hidden');
    settingsPage.classList.add('hidden');
  }

  function showApp() {
    loginPage.classList.add('hidden');
    appHeader.classList.remove('hidden');
    appMain.classList.remove('hidden');
    bottomNav.classList.remove('hidden');
    settingsPage.classList.add('hidden');
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      showApp();
    } else {
      const cachedUID = localStorage.getItem('currentUserUID');
      if (!navigator.onLine && cachedUID) {
        console.warn("⚠️ Offline fallback: using cached UID", cachedUID);
        showApp();
      } else {
        showLogin();
      }
    }
  });

  const currentUser = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const profile = users[currentUser]?.profile;
  if (profile?.firstName) {
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) greetingEl.textContent = `Aloha, ${profile.firstName}`;
  }

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log("✅ Logged in as:", user.email);
      localStorage.setItem('currentUserUID', user.uid);
      showApp();
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login failed: " + error.message);
    }
  });
});


  // Optional greeting from localStorage user data
  const currentUser = localStorage.getItem('currentUser');
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  const profile = users[currentUser]?.profile;
  if (profile?.firstName) {
    const greetingEl = document.getElementById('header-greeting');
    if (greetingEl) greetingEl.textContent = `Aloha, ${profile.firstName}`;
  }

  // Firebase login handler
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log("✅ Logged in as:", user.email);
      localStorage.setItem('currentUserUID', user.uid);
      showApp();
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login failed: " + error.message);
    }
  });
});

  // Setup
  const now = new Date();
  const englishDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hawaiianDays = ["Lāpule", "Poʻakahi", "Poʻalua", "Poʻakolu", "Poʻahā", "Poʻalima", "Poʻaono"];
  const englishMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const hawaiianMonths = [
    "Ianuali", "Pepeluali", "Malaki", "ʻApelila", "Mei", "Iune",
    "Iulai", "ʻAukake", "Kepakemapa", "ʻOkakopa", "Nowemapa", "Kekemapa"
  ];

 function updateMoonTideDate(date) {
  const engDay = englishDays[date.getDay()];
  const hawDay = hawaiianDays[date.getDay()];
  const engMonth = englishMonths[date.getMonth()];
  const hawMonth = hawaiianMonths[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();

  const engDateStr = `${engDay}, ${dayNum} ${engMonth} ${year}`;
  const hawDateStr = `${hawDay}, ${dayNum} ${hawMonth}`;

 document.querySelector('.current-date').innerHTML = `
  <span class="english">${engDateStr}</span>
  <span class="hawaiian">${hawDateStr}</span>
`;

  const phase = SunCalc.getMoonIllumination(date).phase;
  const phaseName = (() => {
    if (phase <= 0.03) return 'New Moon';
    if (phase < 0.25) return 'Waxing Crescent';
    if (phase < 0.27) return 'First Quarter';
    if (phase < 0.5)  return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.75) return 'Waning Gibbous';
    if (phase < 0.77) return 'Last Quarter';
    return 'Waning Crescent';
  })();
  document.querySelector('.moon-phase').textContent = phaseName;

  const todayISO = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

  fetch('calendar_data.json')
    .then(response => response.json())
    .then(data => {
      const todayEntry = data.find(entry => entry.date === todayISO);
      if (todayEntry) {
        document.getElementById('hawaiian-lunar-info').innerHTML = `
          <strong>Mālama:</strong> ${todayEntry.malama}<br>
          <strong>Anahulu:</strong> ${todayEntry.anahulu}<br>
          <strong>Pō:</strong> ${todayEntry.hawaiianMoonNight}
        `;

        // 🌕 Set the correct Moon Phase Image
       let imageName = todayEntry.hawaiianMoonNight.trim();

function normalizeName(name) {
  return name
    .replace(/[ʻ‘’]/g, '')
    .replace(/ū/g, 'u')
    .replace(/ā/g, 'a')
    .replace(/ē/g, 'e')
    .replace(/ī/g, 'i')
    .replace(/ō/g, 'o');
}

let normalizedName = normalizeName(imageName);
const repeats = ['Olekukahi', 'Olekulua', 'Olepau'];

if (todayEntry.anahulu.includes('hō‘emi') && repeats.includes(normalizedName)) {
  normalizedName += '2';
}

const moonImage = document.getElementById('moon-phase-image');
moonImage.src = `MoonPhaseIMG/${normalizedName}.png`;
moonImage.alt = imageName; // keep original for screen readers


      } else {
        document.getElementById('hawaiian-lunar-info').innerHTML = `
          <strong>Mālama:</strong> —<br>
          <strong>Anahulu:</strong> —<br>
          <strong>Pō:</strong> —<br>
          <em>No lunar data available for this date</em>
        `;
      }
    })
    .catch(error => {
      console.error('Error loading lunar data:', error);
      document.getElementById('hawaiian-lunar-info').innerHTML = `
        <em>Failed to load lunar data</em>
      `;
    });
}

  // Initialize with today
  updateMoonTideDate(now);
  updateAstroTimes(now, -16.5, 145.5);
// 🌊 TIDE + GPS LOGIC

const tideContainer = document.querySelector('.tide');
const tideToggle = document.createElement('label');
tideToggle.innerHTML = `<input type="checkbox" id="gpsToggle"> Use GPS for Tide`;

const locationText = document.createElement('div');
locationText.id = 'tide-location-note';
locationText.style.fontSize = '0.75rem';
locationText.style.color = '#666';
locationText.style.marginTop = '0.25rem';

tideContainer.appendChild(tideToggle);
tideContainer.appendChild(locationText);

async function getTideLocation() {
  const useGPS = document.getElementById('gpsToggle')?.checked;
  if (useGPS && navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, useGPS: true }),
        () => resolve({ ...getSavedLocation(), useGPS: false })
      );
    });
  } else {
    return { ...getSavedLocation(), useGPS: false };
  }
}
function updateAstroTimes(date, lat, lng) {
  const sunTimes = SunCalc.getTimes(date, lat, lng);
  document.getElementById('sunrise-time').textContent =
    sunTimes.sunrise ? formatTime(sunTimes.sunrise) : 'No rise';
  document.getElementById('sunset-time').textContent =
    sunTimes.sunset ? formatTime(sunTimes.sunset) : 'No set';

  let moonrise = null;
  let moonset = null;
  let wasAbove = null;

  for (let m = 0; m <= 1440; m += 15) {
    const t = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, m);
    const alt = SunCalc.getMoonPosition(t, lat, lng).altitude;

    if (wasAbove === null) {
      wasAbove = alt > 0;
    } else if (!wasAbove && alt > 0 && !moonrise) {
      moonrise = t;
      wasAbove = true;
    } else if (wasAbove && alt <= 0 && !moonset) {
      moonset = t;
      wasAbove = false;
    }
  }

  document.getElementById('moonrise-time').textContent =
    moonrise ? formatTime(moonrise) : 'No rise';
  document.getElementById('moonset-time').textContent =
    moonset ? formatTime(moonset) : 'No set';
}

function formatTime(date) {
  if (!date || isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function getSavedLocation() {
  const user = JSON.parse(localStorage.getItem('users'))[localStorage.getItem('currentUser')];
  const lat = parseFloat(user?.profile?.lat) || -16.5;
  const lng = parseFloat(user?.profile?.lng) || 145.5;
  return { lat, lng };
}

async function fetchTideData(lat, lng) {
  const apiKey = '6f8295fe-29ae-11f0-8567-0242ac130003-6f829662-29ae-11f0-8567-0242ac130003'; // ← replace with your Stormglass API key
  const start = new Date().toISOString();
  const end = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${start}&end=${end}`;
  const res = await fetch(url, { headers: { Authorization: apiKey } });
  const data = await res.json();
  return data.data;
}
async function reverseGeocode(lat, lng) {
  const apiKey = 'e4ba9531fa864ceaa8fdeab1d3da42c3'; // OpenCage API key
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&limit=1`);
  const data = await res.json();
  const components = data.results?.[0]?.components || {};
  const locality = components.town || components.city || components.village || components.county || components.state;
  return locality || `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
}

function renderTideChart(tideData, locationInfo) {
  tideContainer.innerHTML = '';

  // Check if tideData is valid
  const isEmpty = !Array.isArray(tideData) || tideData.length < 2;
  if (isEmpty) {
    const base = new Date();
    tideData = [
      { time: new Date(base.setHours(0, 1)), height: 1.0 },
      { time: new Date(base.setHours(6, 0)), height: 1.0 },
      { time: new Date(base.setHours(12, 0)), height: 1.0 },
      { time: new Date(base.setHours(18, 0)), height: 1.0 },
      { time: new Date(base.setHours(23, 59)), height: 1.0 }
    ];
  }

  // Set location in header
  const headerTideInfo = document.getElementById('header-tide-info');
  if (headerTideInfo) {
    headerTideInfo.innerHTML = '';
    const tideToggle = document.createElement('label');
    const gpsInput = document.createElement('input');
    gpsInput.type = 'checkbox';
    gpsInput.id = 'gpsToggle';
    gpsInput.checked = locationInfo.useGPS;
    tideToggle.appendChild(gpsInput);
    tideToggle.appendChild(document.createTextNode(' GPS Location'));

    const locationText = document.createElement('div');
    locationText.id = 'tide-location-note';
    locationText.style.fontSize = '0.75rem';
    locationText.style.color = '#666';

    headerTideInfo.appendChild(tideToggle);
    headerTideInfo.appendChild(locationText);

    if (locationInfo.useGPS) {
      reverseGeocode(locationInfo.lat, locationInfo.lng).then(name => {
        locationText.innerHTML = `<strong>${name}</strong> (GPS)`;
      });
    } else {
      const user = JSON.parse(localStorage.getItem('users'))[localStorage.getItem('currentUser')];
      locationText.innerHTML = `<strong>${user?.profile?.location || '—'}</strong>`;
    }

   tideToggle.querySelector('#gpsToggle')?.addEventListener('change', async () => {
  // 🗓 Use selected date if available
  const selectedDate = selectedCell
    ? new Date(currentYear, currentMonth, parseInt(selectedCell.textContent))
    : new Date(); // fallback to today if no cell is selected

  const loc = await getTideLocation();

  updateMoonTideDate(selectedDate);             // 🌑 Moon phase
  updateAstroTimes(selectedDate, loc.lat, loc.lng); // 🌞 Sun + Moon times
  const tideData = await fetchTideData(loc.lat, loc.lng);
  renderTideChart(tideData, loc);               // 🌊 Tide chart
});
  }

  // Continue with chart drawing
  tideData.sort((a, b) => new Date(a.time) - new Date(b.time));
  const width = tideContainer.clientWidth || 320; // responsive width
  const height = 100; // fixed height
  const padding = 15;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.background = 'white';
  svg.style.marginTop = '0.5rem';

  const points = tideData.map(t => {
    const d = new Date(t.time);
    return {
      xVal: d.getHours() + d.getMinutes() / 60,
      height: t.height,
      label: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      type: t.type
    };
  });

  const minH = Math.min(...points.map(p => p.height));
  const maxH = Math.max(...points.map(p => p.height));
  const scaleX = x => padding + (x / 24) * (width - 2 * padding);
  const scaleY = h => height - padding - ((h - minH) / (maxH - minH || 1)) * (height - 2 * padding);

  // Add night background zones
  const nightZones = [
    { start: 0, end: 6 },
    { start: 18, end: 24 }
  ];
  nightZones.forEach(zone => {
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', scaleX(zone.start));
    rect.setAttribute('y', 0);
    rect.setAttribute('width', scaleX(zone.end) - scaleX(zone.start));
    rect.setAttribute('height', height);
    rect.setAttribute('fill', '#eee');
    svg.appendChild(rect);
  });

  // Draw curve (Bézier)
  let path = '';
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const x1 = scaleX(curr.xVal);
    const y1 = scaleY(curr.height);
    const x2 = scaleX(next.xVal);
    const y2 = scaleY(next.height);
    const cx = (x1 + x2) / 2;

    if (i === 0) path += `M ${x1} ${y1}`;
    path += ` C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  }

  const pathEl = document.createElementNS(svgNS, 'path');
  pathEl.setAttribute('d', path);
  pathEl.setAttribute('stroke', isEmpty ? '#bbb' : '#007BFF');
  pathEl.setAttribute('fill', 'none');
  pathEl.setAttribute('stroke-width', '2');
  svg.appendChild(pathEl);

  // Fallback message (inside SVG)
  if (isEmpty) {
    const msg = document.createElementNS(svgNS, 'text');
    msg.setAttribute('x', width / 2);
    msg.setAttribute('y', scaleY(1.0) - 15); // above the flat line
    msg.setAttribute('text-anchor', 'middle');
    msg.setAttribute('font-size', '12');
    msg.setAttribute('fill', '#888');
    msg.textContent = 'No tide data available';
    svg.appendChild(msg);
  } else {
    // Normal dots + labels
    points.forEach(p => {
      const x = scaleX(p.xVal);
      const y = scaleY(p.height);

      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 4);
      dot.setAttribute('fill', '#000');
      svg.appendChild(dot);

      const timeText = document.createElementNS(svgNS, 'text');
      timeText.setAttribute('x', x);
      timeText.setAttribute('y', y - 10);
      timeText.setAttribute('text-anchor', 'middle');
      timeText.setAttribute('font-size', '10');
      timeText.setAttribute('fill', '#333');
      timeText.textContent = p.label;
      svg.appendChild(timeText);

      const heightText = document.createElementNS(svgNS, 'text');
      heightText.setAttribute('x', x);
      heightText.setAttribute('y', y + 12);
      heightText.setAttribute('text-anchor', 'middle');
      heightText.setAttribute('font-size', '10');
      heightText.setAttribute('fill', '#333');
      heightText.textContent = `${p.height.toFixed(1)}m`;
      svg.appendChild(heightText);
    });
  }

  tideContainer.appendChild(svg);
}



(async () => {
  const loc = await getTideLocation();
  const tideData = await fetchTideData(loc.lat, loc.lng);
  renderTideChart(tideData, loc);
  updateAstroTimes(now, loc.lat, loc.lng); // ← this line adds location to SunCalc
})();
  // Calendar
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();
  let selectedCell = null;

  function buildCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const tbody = document.getElementById('calendar-body');
    tbody.innerHTML = '';

    document.getElementById('calendar-month-label').textContent = `${englishMonths[month]} ${year}`;

    let row = document.createElement('tr');
    for (let i = 0; i < firstDay; i++) {
      row.appendChild(document.createElement('td'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('td');
      cell.textContent = d;

      if (d === now.getDate() && month === now.getMonth() && year === now.getFullYear()) {
        cell.classList.add('current-day');
      }

cell.addEventListener('click', async () => {
  const selectedDate = new Date(year, month, d);
  updateMoonTideDate(selectedDate);

  // 🔁 One unified location fetch
  const loc = await getTideLocation();

  updateAstroTimes(selectedDate, loc.lat, loc.lng);
  const tideData = await fetchTideData(loc.lat, loc.lng);
  renderTideChart(tideData, loc);

  if (selectedCell) selectedCell.classList.remove('selected-day');
  cell.classList.add('selected-day');
  selectedCell = cell;
});

      row.appendChild(cell);

      if (row.children.length === 7) {
        tbody.appendChild(row);
        row = document.createElement('tr');
      }
    }

    if (row.children.length) tbody.appendChild(row);
  }

  buildCalendar(currentYear, currentMonth);

  document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    buildCalendar(currentYear, currentMonth);
  });

  document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    buildCalendar(currentYear, currentMonth);
  });

  // Today Snapshot (Time Slots)
  const snap = document.getElementById('today-snapshot');
  for (let off = -2; off <= 2; off++) {
    const t = new Date(now.getTime() + off * 3600e3);
    const span = document.createElement('span');
    span.textContent = t.toLocaleTimeString(undefined, { hour: 'numeric' });
    if (off === 0) span.classList.add('now');
    snap.appendChild(span);
  }

  // Settings More Menu
  const moreBtnSettings = document.getElementById('more-button-settings');
  const moreMenuSettings = document.getElementById('more-menu-settings');

  moreBtnSettings.addEventListener('click', e => {
    e.preventDefault();
    moreMenuSettings.classList.toggle('hidden');
  });

  document.addEventListener('click', e => {
    if (!moreMenuSettings.contains(e.target) && !moreBtnSettings.contains(e.target)) {
      moreMenuSettings.classList.add('hidden');
    }
  });
  document.addEventListener('change', async (e) => {
  if (e.target.id === 'gpsToggle') {
    const loc = await getTideLocation();
    try {
      const tideData = await fetchTideData(loc.lat, loc.lng);
      renderTideChart(tideData, loc);
      updateAstroTimes(new Date(), loc.lat, loc.lng); // ← Add this line
    } catch (err) {
      tideContainer.appendChild(document.createTextNode('Error loading tide data.'));
    }
  }
});


});
