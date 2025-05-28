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
        const rawTitle = match.title || 'Untitled';
const formattedTitle = rawTitle.replace(/^The\b/, 'the');

titleEl.innerHTML = `
  <span class="phase-name">${moonNight}</span>
  <span class="phase-title"> ${formattedTitle}</span>
`;

      }

      // ---------- Tab 1 ----------
      const tab1 = document.getElementById('tab1');
      if (tab1 && match["combined description"]) {
        const fullText = match["combined description"].replace(/\n+/g, ' ').trim();
        const paragraphs = chunkText(fullText);
        let currentIndex = 0;

        function renderTab1(index) {
  tab1.innerHTML = `
    <div class="paragraph-slide ${index === 0 ? 'first-slide' : ''}">
      ${paragraphs[index]}
    </div>
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

      // ---------- Tab 2 ----------
      const tab2 = document.getElementById('tab2');
      if (tab2 && match["dos description"]) {
        const introItems = (match.dos || "").split(/\s*,\s*/).filter(i => i.trim());
        const introHTML = introItems.length
          ? `<div class="paragraph-slide intro-labels">${introItems.map(item => `<span class="label label-do">${item}</span>`).join('')}</div>`
          : `<div class="paragraph-slide"><strong>Recommended action</strong></div>`;

        const chunks = chunkText(match["dos description"].replace(/\n+/g, ' ').trim());
        const pages = [introHTML, ...chunks];
        let doIndex = 0;

        function renderTab2(index) {
  const isIntro = index === 0;
  const isFirstParagraph = index === 1;
  const slideClass = isIntro ? '' : `paragraph-slide ${isFirstParagraph ? 'first-slide' : ''}`;
  const content = pages[index];

  tab2.innerHTML = `
    <div class="${slideClass}">
      ${content}
    </div>
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

      // ---------- Tab 3 ----------
      const tab3 = document.getElementById('tab3');
      if (tab3 && match["donts description"]) {
        const introItems = (match.donts || "").split(/\s*,\s*/).filter(i => i.trim());
        const introHTML = introItems.length
          ? `<div class="paragraph-slide intro-labels">${introItems.map(item => `<span class="label label-dont">${item}</span>`).join('')}</div>`
          : `<div class="paragraph-slide"><strong>What to avoid</strong></div>`;

        const chunks = chunkText(match["donts description"].replace(/\n+/g, ' ').trim());
        const pages = [introHTML, ...chunks];
        let dontIndex = 0;

        function renderTab3(index) {
  const isIntro = index === 0;
  const isFirstParagraph = index === 1;
  const slideClass = isIntro ? '' : `paragraph-slide ${isFirstParagraph ? 'first-slide' : ''}`;
  const content = pages[index];

  tab3.innerHTML = `
    <div class="${slideClass}">
      ${content}
    </div>
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

      // ---------- Tab 4 ----------
      const tab4 = document.getElementById('tab4');
      if (tab4 && match["Kapu\nRituals & Gods\nobserved"]) {
        const raw = match["Kapu\nRituals & Gods\nobserved"];
        const lines = raw.split(/\n+/).map(line => {
          const clean = line.trim();
          if (/^kapu[:\-]?\s*/i.test(clean)) return `<p><strong>KAPU:</strong> ${clean.replace(/^kapu[:\-]?\s*/i, '')}</p>`;
          if (/^gods?[:\-]?\s*/i.test(clean)) return `<p><strong>GODS:</strong> ${clean.replace(/^gods?[:\-]?\s*/i, '')}</p>`;
          if (/^rituals?[:\-]?\s*/i.test(clean)) return `<p><strong>RITUALS:</strong> ${clean.replace(/^rituals?[:\-]?\s*/i, '')}</p>`;
          return `<p>${clean}</p>`;
        });
        tab4.innerHTML = `<div class="paragraph-slide">${lines.join('')}</div>`;
      } else if (tab4) {
        tab4.innerHTML = `<p><em>No Kapu / Rituals / Gods recorded for this moon night.</em></p>`;
      }

      // ---------- Tab 5 ----------
const tab5 = document.getElementById('tab5');
if (tab5 && match.color2) {
  // Bold everything before the first closing parenthesis
  const color2Text = match.color2.trim();
  const boldSplit = color2Text.split(')');
  const boldPart = boldSplit[0] + ')';
  const rest = boldSplit.slice(1).join(')').trim();

  const firstPage = `<p><strong>${boldPart}</strong> ${rest}</p>`;
  const restChunks = chunkText(rest);
  const pages = [firstPage, ...restChunks]; // Keep bold part as full first page

  let index = 0;

  function renderTab5(i) {
    const slideClass = `paragraph-slide ${i === 0 ? 'first-slide' : ''}`;

    tab5.innerHTML = `
      <div class="${slideClass}">
        ${pages[i]}
      </div>
      <div class="nav-arrows">
        <button id="prev-color" ${i === 0 ? 'disabled' : ''}>&larr; Prev</button>
        <span>${i + 1} of ${pages.length}</span>
        <button id="next-color" ${i === pages.length - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    `;

    document.getElementById('prev-color')?.addEventListener('click', () => renderTab5(i - 1));
    document.getElementById('next-color')?.addEventListener('click', () => renderTab5(i + 1));
  }

  renderTab5(index);
}


// ---------- Apply Dynamic Colors ----------
if (match["color pri"] && match["color sec"]) {
  const primary = match["color pri"].trim();
  const secondary = match["color sec"].trim();

  // Set background color of body (override CSS)
  const bgLayer = document.querySelector(".lunar-bg");
if (bgLayer) {
  bgLayer.style.setProperty("background-color", secondary, "important");
}
document.body.style.setProperty("background-image", "none", "important");


  // Update radial gradient color inside .lunar-bg using primary
  const circle = document.querySelector('.lunar-bg');
  if (circle) {
    circle.style.setProperty(
  "background-image",
  `radial-gradient(circle at center, ${primary} 45%, transparent 46%)`
);

  }



}

// ---------- Utility: Convert hex to rgba ----------
function hexToRGBA(hex, alpha) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
	  
	  
	  // ---------- Tab 6: ‘Ōlelo ----------
const tab6 = document.getElementById('tab6');
if (tab6 && match.Olelo) {
  const lines = match.Olelo.split('\n').map(line => line.trim()).filter(Boolean);

  const formatted = lines.map(line => {
    let [before, after] = line.includes('—') ? line.split(/—(.+)/) : [line, ''];
    const boldedBefore = before.replace(/\S+/g, word => {
      return (!/[a-z]/.test(word) && !/\d/.test(word)) ? `<strong>${word}</strong>` : word;
    });
    return `<p>${after ? `${boldedBefore} <em>—${after.trim()}</em>` : boldedBefore}</p>`;
  });

  tab6.innerHTML = `
    <div class="paragraph-slide first-slide">
      ${formatted.join('')}
    </div>
  `;
}


      // ---------- Olelo ----------
      const oleloDiv = document.querySelector('.Olelo');
      if (oleloDiv && match.Olelo) {
        const lines = match.Olelo.split('\n').map(line => line.trim()).filter(Boolean);
        const formatted = lines.map(line => {
          let [before, after] = line.includes('—') ? line.split(/—(.+)/) : [line, ''];
          const boldedBefore = before.replace(/\S+/g, word => {
            return (!/[a-z]/.test(word) && !/\d/.test(word)) ? `<strong>${word}</strong>` : word;
          });
          return `<p>${after ? `${boldedBefore} <em>—${after.trim()}</em>` : boldedBefore}</p>`;
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



// Trigger update on initial load and calendar change
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('lunarInfoUpdated', updateLunarDescription);
});
document.addEventListener('lunarInfoUpdated', () => {
  setTimeout(() => {
    updateLunarDescription();
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="tab1"]')?.classList.add('active');
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.getElementById('tab1')?.classList.add('active');
  }, 150);
});
