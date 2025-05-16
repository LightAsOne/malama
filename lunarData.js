function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[ʻ‘’']/g, '')
    .replace(/[āēīōū]/g, c => ({ ā: 'a', ē: 'e', ī: 'i', ō: 'o', ū: 'u' }[c]))
    .trim();
}

function chunkText(text, maxChars = 300) {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length <= maxChars) {
      current += sentence + " ";
    } else {
      chunks.push(current.trim());
      current = sentence + " ";
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

function updateLunarDescription() {
  const infoDiv = document.getElementById('hawaiian-lunar-info');
  if (!infoDiv) return;

  const anahuluMatch = infoDiv.innerHTML.match(/Anahulu:<\/strong>\s*([^<]+)/);
  const poMatch = infoDiv.innerHTML.match(/Pō:<\/strong>\s*([^<]+)/);

  if (!anahuluMatch || !poMatch) {
    console.warn("❌ Could not extract Anahulu or Pō from DOM.");
    return;
  }

  const anahulu = anahuluMatch[1].trim();
  const moonNight = poMatch[1].trim();
  const normAnahulu = normalize(anahulu);
  const normMoonNight = normalize(moonNight);

  fetch('lunar_sheet.json')
    .then(res => res.json())
    .then(data => {
      const match = data.find(item =>
        normalize(item.anahulu || '') === normAnahulu &&
        normalize(item["Phase name"] || '') === normMoonNight
      );

      if (!match) return;

      // ---------- Title ----------
      const titleEl = document.getElementById('dynamic-title');
      if (titleEl) {
        titleEl.textContent = match.title || `Title for ${moonNight}`;
      }

      // ---------- Tab 1: Combined Description ----------
      const tab1 = document.getElementById('tab1');
      if (tab1 && match["combined description"]) {
        const fullText = match["combined description"].replace(/\n+/g, ' ').trim();
        const paragraphs = chunkText(fullText);
        let currentIndex = 0;

        function renderTab1(index) {
          tab1.innerHTML = `
            <div class="paragraph-slide">${paragraphs[index]}</div>
            <div class="nav-arrows">
              <button id="prev-para" ${index === 0 ? 'disabled' : ''}>&larr; Prev</button>
              <span>${index + 1} of ${paragraphs.length}</span>
              <button id="next-para" ${index === paragraphs.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
            </div>
          `;
          document.getElementById('prev-para')?.addEventListener('click', () => renderTab1(index - 1));
          document.getElementById('next-para')?.addEventListener('click', () => renderTab1(index + 1));
        }

        renderTab1(currentIndex);
      }

    // ---------- Tab 2: Dos + Dos Description ----------
const tab2 = document.getElementById('tab2');
if (tab2 && match["dos description"]) {
  const intro = match.dos || "Recommended action";
  const chunks = chunkText(match["dos description"].replace(/\n+/g, ' ').trim());
  const pages = [intro, ...chunks];
  let doIndex = 0;

  function renderTab2(index) {
    const content = index === 0
      ? `<div class="paragraph-slide"><strong>${pages[0]}</strong></div>`
      : `<div class="paragraph-slide">${pages[index]}</div>`;

    tab2.innerHTML = `
      ${content}
      <div class="nav-arrows">
        <button id="prev-do" ${index === 0 ? 'disabled' : ''}>&larr; Prev</button>
        <span>${index + 1} of ${pages.length}</span>
        <button id="next-do" ${index === pages.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    `;
    document.getElementById('prev-do')?.addEventListener('click', () => renderTab2(index - 1));
    document.getElementById('next-do')?.addEventListener('click', () => renderTab2(index + 1));
  }

  renderTab2(doIndex);
}

// ---------- Tab 3: Don’ts + Don’ts Description ----------
const tab3 = document.getElementById('tab3');
if (tab3 && match["donts description"]) {
  const intro = match.donts || "What to avoid";
  const chunks = chunkText(match["donts description"].replace(/\n+/g, ' ').trim());
  const pages = [intro, ...chunks];
  let dontIndex = 0;

  function renderTab3(index) {
    const content = index === 0
      ? `<div class="paragraph-slide"><strong>${pages[0]}</strong></div>`
      : `<div class="paragraph-slide">${pages[index]}</div>`;

    tab3.innerHTML = `
      ${content}
      <div class="nav-arrows">
        <button id="prev-dont" ${index === 0 ? 'disabled' : ''}>&larr; Prev</button>
        <span>${index + 1} of ${pages.length}</span>
        <button id="next-dont" ${index === pages.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    `;
    document.getElementById('prev-dont')?.addEventListener('click', () => renderTab3(index - 1));
    document.getElementById('next-dont')?.addEventListener('click', () => renderTab3(index + 1));
  }

  renderTab3(dontIndex);
}


// ---------- Tab 4: Kapu, Rituals & Gods ----------
const tab4 = document.getElementById('tab4');
if (tab4 && match["Kapu\nRituals & Gods\nobserved"]) {
  const raw = match["Kapu\nRituals & Gods\nobserved"];

  const lines = raw.split(/\n+/).map(line => {
    const cleanLine = line.trim();

    if (/^kapu[:\-]?\s*/i.test(cleanLine)) {
      return `<p><strong>KAPU:</strong> ${cleanLine.replace(/^kapu[:\-]?\s*/i, '')}</p>`;
    } else if (/^gods?[:\-]?\s*/i.test(cleanLine)) {
      return `<p><strong>GODS:</strong> ${cleanLine.replace(/^gods?[:\-]?\s*/i, '')}</p>`;
    } else if (/^rituals?[:\-]?\s*/i.test(cleanLine)) {
      return `<p><strong>RITUALS:</strong> ${cleanLine.replace(/^rituals?[:\-]?\s*/i, '')}</p>`;
    } else {
      return `<p>${cleanLine}</p>`;
    }
  });

  tab4.innerHTML = `<div class="paragraph-slide">${lines.join('')}</div>`;
} else if (tab4) {
  tab4.innerHTML = `<p><em>No Kapu / Rituals / Gods recorded for this moon night.</em></p>`;
}

const oleloDiv = document.querySelector('.Olelo');
if (oleloDiv && match.Olelo) {
  const lines = match.Olelo.split('\n').map(line => line.trim()).filter(Boolean);

  const formatted = lines.map(line => {
    // Check if there's a dash
    let before = line;
    let after = '';

    if (line.includes('—')) {
      [before, after] = line.split(/—(.+)/); // split only on first —
    }

    // Bold words in "before" section (no lowercase, no numbers)
    const boldedBefore = before.replace(/\S+/g, word => {
      const hasLower = /[a-z]/.test(word);
      const hasNumber = /\d/.test(word);
      return (!hasLower && !hasNumber) ? `<strong>${word}</strong>` : word;
    });

    // Format final line
    const finalLine = after
      ? `${boldedBefore} <em>—${after.trim()}</em>`
      : boldedBefore;

    return `<p>${finalLine}</p>`;
  });

  oleloDiv.innerHTML = `<div class="paragraph-slide">${formatted.join('')}</div>`;
} else if (oleloDiv) {
  oleloDiv.innerHTML = `<p><em>No ‘Ōlelo recorded for this moon night.</em></p>`;
}





    })
    .catch(err => {
      console.error("❌ Error loading lunar_sheet.json:", err);
    });
}

// Initial run on page load
document.addEventListener('DOMContentLoaded', () => {
  const wait = setInterval(() => {
    const info = document.getElementById('hawaiian-lunar-info');
    if (info && info.textContent.includes('Pō:')) {
      clearInterval(wait);
      updateLunarDescription();
    }
  }, 200);
});

// Re-run when calendar date is changed
document.addEventListener('lunarInfoUpdated', () => {
  setTimeout(() => {
    updateLunarDescription();

    // ✅ Reset to Tab 1
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="tab1"]')?.classList.add('active');

    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.getElementById('tab1')?.classList.add('active');
  }, 150);
});
