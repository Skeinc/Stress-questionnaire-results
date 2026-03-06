(function () {
  const FONTANA_START = 5;
  const RYFF_ITEMS = 84;

  const RYFF_REVERSE = new Set([
    2, 4, 7, 9, 11, 13, 15, 17, 18, 20, 22, 24, 27, 29, 31, 32, 34, 35, 41, 42, 43, 44, 45,
    54, 55, 56, 58, 60, 61, 62, 63, 65, 66, 73, 74, 75, 76, 82, 83, 84
  ]);

  function norm(s) {
    if (s == null || s === '') return '';
    return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function getCell(row, col) {
    const v = row[col];
    if (v == null) return '';
    return norm(v);
  }

  function getCellNum(row, col) {
    const v = row[col];
    if (v == null || v === '') return NaN;
    const n = Number(v);
    return isNaN(n) ? NaN : n;
  }

  function buildConfig(headers) {
    let ryffStartCol = -1;
    for (let i = 0; i < headers.length; i++) {
      const h = norm(headers[i]);
      if (h.includes('многие люди считают') || h.includes('любящим')) {
        ryffStartCol = i;
        break;
      }
    }
    if (ryffStartCol < 0) return null;

    const fontanaColToKey = [];
    for (let offset = 0; offset < ryffStartCol - FONTANA_START; offset++) {
      if (offset === 0) fontanaColToKey.push([offset, 1]);
      else if (offset >= 1 && offset <= 23) fontanaColToKey.push([offset, 2]);
      else if (offset === 24) fontanaColToKey.push([offset, 3]);
      else if (offset === 25) fontanaColToKey.push([offset, 6]);
      else if (offset === 26) fontanaColToKey.push([offset, 7]);
      else if (offset >= 27 && offset <= 29) continue;
      else if (offset === 30) fontanaColToKey.push([offset, 8]);
      else if (offset === 31) fontanaColToKey.push([offset, 9]);
      else if (offset === 32) fontanaColToKey.push([offset, 10]);
      else if (offset === 33) fontanaColToKey.push([offset, 11]);
      else if (offset === 34) fontanaColToKey.push([offset, 12]);
      else if (offset === 35) fontanaColToKey.push([offset, 13]);
      else if (offset === 36) fontanaColToKey.push([offset, 14]);
      else if (offset === 37) fontanaColToKey.push([offset, 15]);
      else if (offset === 38) fontanaColToKey.push([offset, 16]);
      else if (offset === 39) fontanaColToKey.push([offset, 17]);
      else if (offset === 40) fontanaColToKey.push([offset, 18]);
      else if (offset === 41) fontanaColToKey.push([offset, 19]);
    }
    return { ryffStartCol, fontanaColToKey };
  }

  function fontanaScoreOption1(val) {
    const v = val;
    if (v.includes('замкнутый') || v.includes('ничего') && v.includes('не беспокоит')) return 0;
    if (v.includes('великолепный') || v.includes('осторожны')) return 1;
    if (v.includes('все всегда происходит не так') || v.includes('не так, как надо')) return 2;
    if (v.includes('скучным') || v.includes('непредсказуемым')) return 3;
    if (v.includes('чем меньше') || v.includes('тем лучше')) return 4;
    return 0;
  }

  function fontanaKeyQ3(val) {
    if (val.includes('больше') && val.includes('обычно')) return 0;
    if (val.includes('меньше')) return 1;
    if (val.includes('как обычно')) return 2;
    return 0;
  }

  function fontanaKeyQ6(val) {
    if (val.includes('да')) return 0;
    if (val.includes('нет')) return 1;
    return 0;
  }

  function fontanaKeyQ7(val) {
    return (val.includes('да') || val.includes('нет')) ? 1 : 0;
  }

  function fontanaKeyQ8(val) {
    if (val.includes('сам') || val.includes('сама')) return 2;
    return 1;
  }

  function fontanaKeyQ9(val) {
    if (val.includes('сильно')) return 0;
    if (val.includes('умеренно')) return 1;
    if (val.includes('слабо')) return 2;
    return 0;
  }

  function fontanaKeyQ10(val) {
    if (val.includes('часто')) return 1;
    return 0;
  }

  function fontanaKeyQ11(val) {
    if (val.includes('да')) return 2;
    if (val.includes('нет')) return 1;
    return 0;
  }

  function fontanaKeyQ12(val) {
    if (val.includes('постоянно')) return 0;
    if (val.includes('иногда')) return 1;
    if (val.includes('изредка') || val.includes('редко')) return 2;
    return 0;
  }

  function fontanaKeyQ13(val) {
    if (val.includes('как правило') || val.includes('как правило')) return 1;
    return 0;
  }

  function fontanaKeyQ14(val) {
    return val.includes('да') ? 1 : 0;
  }

  function fontanaKeyQ15(val) {
    return val.includes('да') ? 1 : 0;
  }

  function fontanaKeyQ16(val) {
    return val.includes('да') ? 2 : 1;
  }

  function fontanaKeyQ17(val) {
    if (val.includes('часто')) return 0;
    if (val.includes('иногда')) return 1;
    if (val.includes('редко')) return 2;
    return 0;
  }

  function fontanaKeyQ18(val) {
    if (val.includes('большинств') || val.includes('большинство')) return 1;
    return 0;
  }

  function fontanaKeyQ19(val) {
    return val.includes('да') ? 1 : 0;
  }

  function scoreFontana(row, config) {
    let sum = 0;
    for (const [offset, q] of config.fontanaColToKey) {
      const val = getCell(row, FONTANA_START + offset);
      if (q === 1) sum += fontanaScoreOption1(val);
      else if (q === 2) sum += val.includes('да') ? 1 : 0;
      else if (q === 3) sum += fontanaKeyQ3(val);
      else if (q === 6) sum += fontanaKeyQ6(val);
      else if (q === 7) sum += fontanaKeyQ7(val);
      else if (q === 8) sum += fontanaKeyQ8(val);
      else if (q === 9) sum += fontanaKeyQ9(val);
      else if (q === 10) sum += fontanaKeyQ10(val);
      else if (q === 11) sum += fontanaKeyQ11(val);
      else if (q === 12) sum += fontanaKeyQ12(val);
      else if (q === 13) sum += fontanaKeyQ13(val);
      else if (q === 14) sum += fontanaKeyQ14(val);
      else if (q === 15) sum += fontanaKeyQ15(val);
      else if (q === 16) sum += fontanaKeyQ16(val);
      else if (q === 17) sum += fontanaKeyQ17(val);
      else if (q === 18) sum += fontanaKeyQ18(val);
      else if (q === 19) sum += fontanaKeyQ19(val);
    }
    let level = '';
    if (sum <= 15) level = 'стресс не является проблемой';
    else if (sum <= 30) level = 'умеренный уровень стресса';
    else if (sum <= 45) level = 'стресс — проблема, нужна коррекция';
    else level = 'высокий уровень стресса, требуется помощь';
    return { raw: sum, level };
  }

  function scoreRyff(row, config) {
    const start = config.ryffStartCol;
    const points = [];
    for (let i = 0; i < RYFF_ITEMS; i++) {
      const num = getCellNum(row, start + i);
      const item = i + 1;
      const rev = RYFF_REVERSE.has(item);
      let pt = 0;
      if (num >= 1 && num <= 6) pt = rev ? (7 - num) : num;
      points.push(pt);
    }
    const total = points.reduce((a, b) => a + b, 0);
    let level = '';
    if (total <= 323) level = 'низкий';
    else if (total <= 353) level = 'средний';
    else level = 'высокий';
    return { total, level };
  }

  let lastWorkbook = null;
  let lastHeaders = [];
  let lastRows = [];
  let lastConfig = null;
  let lastResults = [];

  function showMessage(text, isError) {
    const el = document.getElementById('message');
    el.textContent = text;
    el.className = 'message' + (isError ? ' error' : '');
  }

  function parseFile(file) {
    const isCsv = /\.csv$/i.test(file.name);
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        let wb;
        if (isCsv) {
          const str = e.target.result;
          wb = XLSX.read(str, { type: 'string', raw: true, codepage: 65001 });
        } else {
          const data = new Uint8Array(e.target.result);
          wb = XLSX.read(data, { type: 'array' });
        }
        const firstSheet = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheet];
        const arr = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        if (!arr.length) {
          showMessage('В файле нет данных.', true);
          return;
        }
        lastHeaders = arr[0];
        lastRows = arr.slice(1).filter(row => {
          if (!row || !row.length) return false;
          const first = row[0];
          if (first == null) return false;
          if (String(first).trim() === '') return false;
          return true;
        });
        lastWorkbook = wb;
        lastConfig = buildConfig(lastHeaders);
        if (!lastConfig) {
          showMessage('Не найдена колонка опросника Риффа (ожидается заголовок с «Многие люди считают» / «любящим»).', true);
          return;
        }
        document.getElementById('btnCalc').disabled = false;
        document.getElementById('dropLabel').textContent = file.name;
        showMessage('Файл загружен. Нажмите «Рассчитать».');
      } catch (err) {
        showMessage('Ошибка чтения файла: ' + err.message, true);
      }
    };
    if (isCsv) reader.readAsText(file, 'UTF-8');
    else reader.readAsArrayBuffer(file);
  }

  function runCalc() {
    if (!lastConfig || !lastRows.length) return;
    lastResults = [];
    for (let i = 0; i < lastRows.length; i++) {
      const row = lastRows[i];
      const fontana = scoreFontana(row, lastConfig);
      const ryff = scoreRyff(row, lastConfig);
      const date = formatDate(row[0]);
      const gender = row[1] != null ? String(row[1]).trim() : '';
      const age = row[2] != null ? String(row[2]).trim() : '';
      const experience = row[3] != null ? String(row[3]).trim() : '';
      const field = row[4] != null ? String(row[4]).trim() : '';
      lastResults.push({
        date,
        gender,
        age,
        experience,
        field,
        fontana: fontana.raw,
        fontanaLevel: fontana.level,
        ryffTotal: ryff.total,
        ryffLevel: ryff.level
      });
    }
    renderTable();
    document.getElementById('resultsSection').classList.add('visible');
    document.getElementById('btnDownload').disabled = false;
    showMessage('Рассчитано строк: ' + lastResults.length);
  }

  function renderTable() {
    const thead = document.getElementById('resultsThead');
    const tbody = document.getElementById('resultsBody');
    thead.innerHTML = '<tr><th>Дата</th><th>Пол</th><th>Возраст</th><th>Стаж работы</th><th>Сфера деятельности</th><th>Стресс (Фонтана)</th><th>Уровень стресса</th><th>Псих. благополучие (сумма)</th><th>Уровень</th></tr>';
    tbody.innerHTML = lastResults.map((r) => {
      return '<tr><td>' + escapeHtml(r.date) + '</td><td>' + escapeHtml(r.gender) + '</td><td>' + escapeHtml(r.age) + '</td><td>' + escapeHtml(r.experience) + '</td><td>' + escapeHtml(r.field) + '</td><td>' + r.fontana + '</td><td class="interpret">' + r.fontanaLevel + '</td><td>' + r.ryffTotal + '</td><td class="interpret">' + r.ryffLevel + '</td></tr>';
    }).join('');
  }

  function formatDate(raw) {
    if (raw == null || raw === '') return '';
    let d;
    if (typeof raw === 'number') {
      d = new Date((raw - 25569) * 86400 * 1000);
    } else if (raw instanceof Date) {
      d = raw;
    } else {
      const s = String(raw).trim();
      const dot = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})\s*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?/);
      const slash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?/);
      const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[T\s](\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?/);
      let y, m, day, h = 0, min = 0, sec = 0;
      if (dot) {
        day = parseInt(dot[1], 10); m = parseInt(dot[2], 10); y = parseInt(dot[3], 10);
        if (dot[4] != null) h = parseInt(dot[4], 10) || 0;
        if (dot[5] != null) min = parseInt(dot[5], 10) || 0;
        if (dot[6] != null) sec = parseInt(dot[6], 10) || 0;
      } else if (slash) {
        day = parseInt(slash[1], 10); m = parseInt(slash[2], 10); y = parseInt(slash[3], 10);
        if (slash[4] != null) h = parseInt(slash[4], 10) || 0;
        if (slash[5] != null) min = parseInt(slash[5], 10) || 0;
        if (slash[6] != null) sec = parseInt(slash[6], 10) || 0;
      } else if (iso) {
        y = parseInt(iso[1], 10); m = parseInt(iso[2], 10); day = parseInt(iso[3], 10);
        if (iso[4] != null) h = parseInt(iso[4], 10) || 0;
        if (iso[5] != null) min = parseInt(iso[5], 10) || 0;
        if (iso[6] != null) sec = parseInt(iso[6], 10) || 0;
      } else {
        d = new Date(s);
      }
      if (y != null) d = new Date(y, m - 1, day, h, min, sec);
    }
    if (!d || isNaN(d.getTime())) return String(raw).trim();
    const pad = n => (n < 10 ? '0' : '') + n;
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' +
      pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function escapeHtml(s) {
    if (s == null) return '';
    const str = String(s);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function downloadResults() {
    if (!lastResults.length) return;
    const headers = ['Дата', 'Пол', 'Возраст', 'Стаж работы', 'Сфера деятельности', 'Стресс (Фонтана)', 'Уровень стресса', 'Псих. благополучие (сумма)', 'Уровень'];
    const rows = lastResults.map(r => [
      r.date,
      r.gender,
      r.age,
      r.experience,
      r.field,
      r.fontana,
      r.fontanaLevel,
      r.ryffTotal,
      r.ryffLevel
    ]);
    const data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Результаты');
    XLSX.writeFile(wb, 'results.xlsx');
  }

  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const f = e.dataTransfer?.files?.[0];
    if (f && /\.(xlsx|xls|csv)$/i.test(f.name)) parseFile(f);
    else showMessage('Выберите файл .xlsx, .xls или .csv', true);
  });
  fileInput.addEventListener('change', () => {
    const f = fileInput.files?.[0];
    if (f) parseFile(f);
  });

  document.getElementById('btnCalc').addEventListener('click', runCalc);
  document.getElementById('btnDownload').addEventListener('click', downloadResults);
})();
