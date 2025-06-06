function showSpinner() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'flex';
}

function hideSpinner() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) loadingScreen.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
// showSpinner(); // removed to avoid blocking login screen

document.getElementById('calendar-toggle').addEventListener('click', () => {
  const popup = document.getElementById('calendar-popup');
  popup.classList.toggle('hidden');
});
  // Setup
  const now = new Date();
  let selectedDate = new Date(); // 🔧 Move selectedDate up here
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
  
  let userProfile = null;
  const loginPage = document.getElementById('login-page');
  const loginForm = document.getElementById('login-form');
  const appHeader = document.querySelector('.app-header');
  const appMain = document.querySelector('.app');
  const bottomNav = document.querySelector('.bottom-nav');
  const settingsPage = document.getElementById('settings-page');

  function showLogin() {
    loginPage?.classList.remove('hidden');
    appHeader?.classList.add('hidden');
    appMain?.classList.add('hidden');
    bottomNav?.classList.add('hidden');
    settingsPage?.classList.add('hidden');
  }

  function showApp() {
    loginPage?.classList.add('hidden');
    appHeader?.classList.remove('hidden');
    appMain?.classList.remove('hidden');
    bottomNav?.classList.remove('hidden');
    settingsPage?.classList.add('hidden');
  }

  auth.onAuthStateChanged(async user => {
    if (user) {
      showApp();

      try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          const profile = doc.data();
          userProfile = profile;
          
          // Initial render with saved location/toggle state
          (async () => {
            const today = new Date();
            const loc = await getTideLocation();
            updateMoonTideDate(today);
            updateAstroTimes(today, loc.lat, loc.lng);
            const dateStr = selectedDate.toISOString().split('T')[0];
        const tideData = await fetchTideData(loc.lat, loc.lng, dateStr);
            renderTideChart(tideData, loc);
			hideSpinner(); // ✅ hide spinner only after all is loaded
          })();
const greetingEl = document.getElementById('header-greeting');
          const tideInfoEl = document.getElementById('header-tide-info');
          if (greetingEl && profile.firstName) {
            greetingEl.textContent = `Aloha, ${profile.firstName}`;
          }
          if (tideInfoEl && profile.location) {
            tideInfoEl.innerHTML = `<strong>${profile.location}</strong>`;
          }
        }
      } catch (err) {
        console.error("Failed to load profile from Firestore:", err);
      }

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

  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      localStorage.setItem('currentUserUID', user.uid);
      showApp();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });

  // Skip calendar and tide setup on settings.html
  if (!document.querySelector('#calendar-body')) return;


  

 function updateMoonTideDate(date) {
  if (!document.querySelector('.current-date')) return; // ← Skip if not on index page
  const engDay = englishDays[date.getDay()];
  const hawDay = hawaiianDays[date.getDay()];
  const engMonth = englishMonths[date.getMonth()];
  const hawMonth = hawaiianMonths[date.getMonth()];
  const dayNum = date.getDate();
  const year = date.getFullYear();

  const engDateStr = `${engDay}, ${dayNum} ${engMonth} ${year}`;
  const hawDateStr = `${hawDay}, ${dayNum} ${hawMonth}`;
  const label = document.getElementById('calendar-label');
if (label) {
  label.textContent = `${engDay}, ${dayNum} ${engMonth} ${year}`;
}
 const currentDateEl = document.querySelector('.current-date');
if (currentDateEl) {
  currentDateEl.innerHTML = `
    
    <span class="hawaiian">${hawDateStr}</span>
  `;
  document.dispatchEvent(new CustomEvent('lunarInfoUpdated'));
}


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
  const moonEl = document.querySelector('.moon-phase');
if (moonEl) moonEl.textContent = phaseName;

  const todayISO = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

  fetch('calendar_data.json')
    .then(response => response.json())
    .then(data => {
      const todayEntry = data.find(entry => entry.date === todayISO);
      if (todayEntry) {
       const lunarInfo = document.getElementById('hawaiian-lunar-info');
if (lunarInfo) {
  lunarInfo.innerHTML = `
    <strong>Mālama:</strong> ${todayEntry.malama}<br>
    <strong>Anahulu:</strong> ${todayEntry.anahulu}<br>
    <strong>Pō:</strong> ${todayEntry.hawaiianMoonNight}
  `;
}


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
     const lunarInfo = document.getElementById('hawaiian-lunar-info');
if (lunarInfo) {
  lunarInfo.innerHTML = `<em>Failed to load lunar data</em>`;
}

    });
}

  // Initialize with today
  updateMoonTideDate(now);
  updateAstroTimes(now, -16.5, 145.5);
// 🌊 TIDE + GPS LOGIC

let headerTideInfo = null;


if (document.querySelector('.tide')) {
  headerTideInfo = document.getElementById('header-tide-info');
  tideContainer = document.querySelector('.tide');
}




async function getTideLocation() {
  const useGPSStored = userProfile?.useGPS ?? (localStorage.getItem('useGPS') === 'true');

  if (useGPSStored && navigator.geolocation) {
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
  if (!document.getElementById('sunrise-time')) return; // ← Skip if not on index page

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
  if (userProfile?.lat != null && userProfile?.lng != null) {
    return { lat: userProfile.lat, lng: userProfile.lng };
  }
  // fallback to Port Douglas
  return { lat: -16.5, lng: 145.5 };
}
 // TIDE chart
 //STORMTIDE
//async function fetchTideData(lat, lng) {
//  if (!document.querySelector('.tide')) return []; // skip if not on index.html
//  const apiKey = '6f8295fe-29ae-11f0-8567-0242ac130003-6f829662-29ae-11f0-8567-0242ac130003'; // ← replace with your Stormglass API key
//  const start = new Date().toISOString();
//  const end = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
//  const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${start}&end=${end}`;
//  const res = await fetch(url, { headers: { Authorization: apiKey } });
//  const data = await res.json();
//  return data.data;
//}

//worldtides.api
async function fetchTideData(lat, lon, dateOverride = null) {
  if (!document.querySelector('.tide')) return [];

  const apiKey = 'd251d071-ec49-4fdf-bc37-4c763cd52cd5'; // Replace with your key
  const date = dateOverride || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const url = `https://www.worldtides.info/api/v3?extremes&date=${date}&lat=${lat}&lon=${lon}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data?.extremes || !Array.isArray(data.extremes)) return [];

    return data.extremes.map(entry => ({
      time: new Date(entry.date),
      height: entry.height,
      type: entry.type.toLowerCase().includes('high') ? 'high' : 'low'
    }));
  } catch (err) {
    console.error("WorldTides fetch failed:", err);
    return [];
  }
}

//end worldtides.api


async function reverseGeocode(lat, lng) {
  const apiKey = 'e4ba9531fa864ceaa8fdeab1d3da42c3'; // OpenCage API key
  const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}&limit=1`);
  const data = await res.json();
  const components = data.results?.[0]?.components || {};
  const locality = components.town || components.city || components.village || components.county || components.state;
  return locality || `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
}

function renderTideChart(tideData, locationInfo) {
  const tideContainer = document.querySelector('.tide');
  if (!tideContainer) return;
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
    

    const locationText = document.createElement('div');
    locationText.id = 'tide-location-note';
    locationText.style.fontSize = '0.75rem';
    locationText.style.color = '#666';

    
    headerTideInfo.appendChild(locationText);

    if (locationInfo.useGPS) {
  reverseGeocode(locationInfo.lat, locationInfo.lng).then(name => {
    locationText.innerHTML = `<strong>${name}</strong> (GPS)`;
  });
} else {
  // Non-GPS: use Firestore profile location
  setTimeout(() => {
    const locationName = userProfile?.location || '—';
    locationText.innerHTML = `<strong>${locationName}</strong>`;
  }, 100);
}}

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



if (document.querySelector('.tide')) {
  (async () => {
    const loc = await getTideLocation();
    renderTideChart([], loc);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
        const tideData = await fetchTideData(loc.lat, loc.lng, dateStr);
      renderTideChart(tideData, loc);
    } catch (err) {
      console.warn("Tide fetch failed:", err);
    }
    updateAstroTimes(now, loc.lat, loc.lng);
  })();

 
}
// TIDE CHART EBND

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
		if (d === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
		cell.classList.add('selected-day');
		selectedCell = cell;
		}
cell.addEventListener('click', async () => {
  showSpinner(); // ✅ Show rotella

  selectedDate = new Date(year, month, d);
  updateMoonTideDate(selectedDate);
	document.getElementById('calendar-popup')?.classList.add('hidden');
  const loc = await getTideLocation();
  updateAstroTimes(selectedDate, loc.lat, loc.lng);
  const dateStr = selectedDate.toISOString().split('T')[0];
        const tideData = await fetchTideData(loc.lat, loc.lng, dateStr);
  renderTideChart(tideData, loc);

  if (selectedCell) selectedCell.classList.remove('selected-day');
  cell.classList.add('selected-day');
  selectedCell = cell;

  hideSpinner(); // ✅ Hide rotella
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
  for (let off = -4; off <= 4; off++) {
    const t = new Date(now.getTime() + off * 3600e3);
    const span = document.createElement('span');
    span.textContent = t.toLocaleTimeString(undefined, { hour: 'numeric' });
    if (off === 0) span.classList.add('now');
    snap.appendChild(span);
  }


  document.addEventListener('change', async (e) => {
  if (e.target.id === 'gpsToggle') {
    const loc = await getTideLocation();
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
        const tideData = await fetchTideData(loc.lat, loc.lng, dateStr);
      renderTideChart(tideData, loc);
      updateAstroTimes(new Date(), loc.lat, loc.lng); // ← Add this line
    } catch (err) {
      tideContainer.appendChild(document.createTextNode('Error loading tide data.'));
    }
  }
});
function moveDay(offset) {
  showSpinner(); // ✅ show the rotella

  const oldMonth = selectedDate.getMonth();
  const oldYear = selectedDate.getFullYear();

  selectedDate.setDate(selectedDate.getDate() + offset);

  const newMonth = selectedDate.getMonth();
  const newYear = selectedDate.getFullYear();

  if (newMonth !== oldMonth || newYear !== oldYear) {
    currentMonth = newMonth;
    currentYear = newYear;
    buildCalendar(currentYear, currentMonth);
  }

  updateMoonTideDate(selectedDate);

  getTideLocation().then(async loc => {
    updateAstroTimes(selectedDate, loc.lat, loc.lng);
    const dateStr = selectedDate.toISOString().split('T')[0];
        const tideData = await fetchTideData(loc.lat, loc.lng, dateStr);
    renderTideChart(tideData, loc);

    buildCalendar(currentYear, currentMonth);

    hideSpinner(); // ✅ hide when done
  });
}

document.getElementById('prev-day')?.addEventListener('click', () => {
  moveDay(-1);
  document.getElementById('calendar-popup')?.classList.add('hidden');
});

document.getElementById('next-day')?.addEventListener('click', () => {
  moveDay(1);
  document.getElementById('calendar-popup')?.classList.add('hidden');
});

// ✅ Direct arrows now reuse the same exact logic
document.getElementById('prev-day-direct')?.addEventListener('click', () => {
  document.getElementById('prev-day')?.click();
});

document.getElementById('next-day-direct')?.addEventListener('click', () => {
  document.getElementById('next-day')?.click();
});

// ✅ This goes here, just before the final closing bracket of DOMContentLoaded
document.addEventListener('click', () => {
  document.body.offsetHeight;  // forces reflow on any tap or click
  
});


const tabs = document.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      // Activate tab
      tabs.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");

      // Show matching pane
      panes.forEach(pane => {
        pane.classList.toggle("active", pane.id === target);
      });
    // ✅ Re-run description if switching to tab2 or tab3
    if (["tab2", "tab3", "tab4","tab5","tab6","Olelo"].includes(target)) updateLunarDescription();
	});
  });





  });
