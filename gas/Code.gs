/**
 * ============================================================
 * PakNikahPoint — Google Apps Script v3.1 (FIXED)
 * ============================================================
 */

const ADMIN_EMAIL   = 'rishtakitalash@gmail.com';
const SS_NAME       = 'PakNikahPoint Database';
const BOYS_SHEET    = 'Boys_Profiles';
const GIRLS_SHEET   = 'Girls_Profiles';
const MATCHES_SHEET = 'Saved_Matches';

const COLS = [
  'PNP Code','نام','عمر','شہر','تعلیم','دینی تعلیم',
  'پیشہ','ازدواجی حیثیت','ذات/برادری','رہائش کی نوعیت',
  'قد','وزن','رنگت','مسلک','مذہب',
  'جسمانی معذوری','دائمی بیماری','نشہ',
  'والد کا نام','والد کا پیشہ','والدہ کا نام','رابطہ نمبر',
  'خواہشات','اضافی معلومات','تصویر',
  'طلاق/خلع وجہ','بچے ہیں؟','کل بچے','لڑکے','لڑکیاں',
  'بچوں کی عمریں','بچے کس کے ساتھ','Custody','نان نفقہ',
  'دیر سے شادی وجہ',
  'ملک','صوبہ','علاقہ','بیرون ملک ملک','بیرون ملک شہر',
  'ویزا حیثیت','مکان رقبہ','کرایہ','جائیداد تفصیل',
  'نماز','روزے','پردہ',
  'افراد خانہ','بھائی','بہنیں','آمدن','ملازمت مقام',
  'مطلوبہ ازدواجی','مطلوبہ تعلیم','مطلوبہ کم عمر',
  'مطلوبہ زیادہ عمر','مطلوبہ ذات','مطلوبہ مسلک',
  'مطلوبہ رہائش','مطلوبہ دینی تعلیم','مطلوبہ ملازمت',
  'آبائی ملک','آبائی علاقہ','آبائی برادری',
  'شادی وجہ','طلاق خلع وجہ','والدہ پیشہ','شادی تعریف',
  'ذریعہ','حیثیت','تاریخ'
];

// ═══ CORS HEADERS ════════════════════════════════════════
function _cors(output) {
  return output
    .setMimeType(ContentService.MimeType.JSON);
}

// ═══ POST HANDLER ════════════════════════════════════════
function doPost(e) {
  try {
    let req;
    try {
      req = JSON.parse(e.postData.contents);
    } catch(parseErr) {
      // اگر JSON parse نہ ہو تو payload parameter چیک کریں
      const payload = e.parameter && e.parameter.payload;
      if (payload) {
        req = JSON.parse(decodeURIComponent(payload));
      } else {
        return _cors(_json({status:'error', msg:'Invalid JSON'}));
      }
    }
    
    let res;
    switch(req.action) {
      case 'addProfile':    res = addProfile(req.profile);   break;
      case 'updateProfile': res = updateProfile(req.profile); break;
      case 'deleteProfile': res = deleteProfile(req.pnpCode); break;
      case 'saveMatch':     res = saveMatch(req.match);      break;
      case 'getAllBoys':    res = getProfiles(BOYS_SHEET);   break;
      case 'getAllGirls':   res = getProfiles(GIRLS_SHEET);  break;
      case 'getMatches':    res = getAllMatches();            break;
      case 'syncAll':       res = syncAll(req);              break;
      case 'test':          res = {status:'ok', msg:'✅ Connected!'}; break;
      default:              res = {status:'error', msg:'Unknown action: '+req.action};
    }
    return _cors(_json(res));
  } catch(err) {
    Logger.log('doPost Error: ' + err.message);
    return _cors(_json({status:'error', message:err.message}));
  }
}

// ═══ GET HANDLER ════════════════════════════════════════
function doGet(e) {
  const a = (e.parameter && e.parameter.action) || 'ping';
  
  try {
    // GET سے addProfile (backup method)
    if (a === 'addProfile' && e.parameter.payload) {
      const profile = JSON.parse(decodeURIComponent(e.parameter.payload));
      const res = addProfile(profile);
      return _cors(_json(res));
    }
    
    if (a === 'ping')        return _cors(_json({status:'ok', msg:'PakNikahPoint ✅ چل رہا ہے'}));
    if (a === 'getAllBoys')  return _cors(_json(getProfiles(BOYS_SHEET)));
    if (a === 'getAllGirls') return _cors(_json(getProfiles(GIRLS_SHEET)));
    if (a === 'getMatches')  return _cors(_json(getAllMatches()));
    if (a === 'test')        return _cors(_json({status:'ok', msg:'✅ GAS کام کر رہا ہے!'}));
    
    return _cors(_json({status:'ok', msg:'PakNikahPoint API v3.1'}));
  } catch(err) {
    return _cors(_json({status:'error', msg:err.message}));
  }
}

// ═══ SETUP ══════════════════════════════════════════════
function setup() {
  let ss;
  const ex = DriveApp.getFilesByName(SS_NAME);
  ss = ex.hasNext() ? SpreadsheetApp.open(ex.next()) : SpreadsheetApp.create(SS_NAME);
  _makeSheet(ss, BOYS_SHEET,    COLS);
  _makeSheet(ss, GIRLS_SHEET,   COLS);
  _makeSheet(ss, MATCHES_SHEET,
    ['لڑکا کوڈ','لڑکا نام','لڑکی کوڈ','لڑکی نام',
     'سکور','شہر','عمر','تعلیم','ذات','مسلک','تاریخ']);
  [BOYS_SHEET, GIRLS_SHEET, MATCHES_SHEET].forEach(n => {
    const sh = ss.getSheetByName(n);
    if (!sh) return;
    sh.getRange(1,1,1,sh.getLastColumn())
      .setBackground('#0D3B2E').setFontColor('#C9A84C')
      .setFontWeight('bold').setFontSize(11);
    sh.setFrozenRows(1);
  });
  if (!DriveApp.getFoldersByName('PakNikahPoint_Photos').hasNext())
    DriveApp.createFolder('PakNikahPoint_Photos');
  Logger.log('✅ Setup مکمل: ' + ss.getUrl());
  return {status:'ok', url:ss.getUrl()};
}

// ═══ FORM SUBMIT TRIGGER ════════════════════════════════
function onFormSubmit(e) {
  try {
    Logger.log('Form آیا');
    const vals = e.namedValues;
    Logger.log(JSON.stringify(vals));

    const name =
      _v(vals,'پورا نام') || _v(vals,'Full Name / پورا نام') ||
      _v(vals,'Full Name') || _v(vals,'Name') || '';
    if (!name) { Logger.log('نام نہیں ملا'); return; }

    const gAns =
      _v(vals,'جنس / Gender') || _v(vals,'Gender / جنس') ||
      _v(vals,'Gender') || _v(vals,'جنس') || '';
    const isBoy =
      gAns.includes('Boy') || gAns.includes('boy') || gAns.includes('لڑکا');
    Logger.log('نام: ' + name + ' | لڑکا: ' + isBoy);

    const ss      = _getSheet();
    const pnpCode = _makeCode(ss, isBoy);

    const row = [
      pnpCode,
      name,
      _v(vals,'عمر') || _v(vals,'Age / عمر') || _v(vals,'Age') || '',
      _v(vals,'شہر') || _v(vals,'City / شہر') || _v(vals,'City') || '',
      _v(vals,'تعلیم') || _v(vals,'Education / تعلیم') || _v(vals,'Education') || '',
      _v(vals,'دینی تعلیم') || _v(vals,'Religious Education / دینی تعلیم') || '',
      _v(vals,'پیشہ') || _v(vals,'Profession / پیشہ') || _v(vals,'Profession') || '',
      _v(vals,'ازدواجی حیثیت') || _v(vals,'Marital Status / ازدواجی حیثیت') || _v(vals,'Marital Status') || '',
      _v(vals,'ذات / برادری') || _v(vals,'Caste/Biradari / ذات برادری') || _v(vals,'Caste') || '',
      _v(vals,'رہائش کی نوعیت') || '',
      _v(vals,'قد') || _v(vals,'Height / قد') || _v(vals,'Height') || '',
      _v(vals,'وزن') || _v(vals,'Weight / وزن') || _v(vals,'Weight') || '',
      _v(vals,'رنگت') || _v(vals,'Complexion / رنگت') || '',
      _v(vals,'مسلک') || _v(vals,'Sect / مسلک') || _v(vals,'Sect') || '',
      'اسلام',
      _v(vals,'جسمانی معذوری') || 'کوئی نہیں',
      _v(vals,'دائمی بیماری') || 'کوئی نہیں',
      _v(vals,'نشہ') || 'کوئی نہیں',
      _v(vals,'والد کا نام') || '',
      _v(vals,'والد کا پیشہ') || '',
      _v(vals,'والدہ کا نام') || '',
      _v(vals,'رابطہ نمبر') || _v(vals,'Contact Number / رابطہ نمبر') || '',
      _v(vals,'اضافی معلومات') || _v(vals,'Additional Info / کوئی اور بات') || '',
      '', '',
      _v(vals,'طلاق/خلع وجہ') || _v(vals,'طلاق کی وجہ') || '',
      _v(vals,'کیا بچے ہیں؟') || '',
      _v(vals,'کل بچے') || '',
      _v(vals,'لڑکے') || '',
      _v(vals,'لڑکیاں') || '',
      _v(vals,'بچوں کی عمریں') || '',
      _v(vals,'بچے کس کے ساتھ؟') || '',
      _v(vals,'قانونی Custody') || '',
      _v(vals,'نان نفقہ ذمہ داری') || '',
      _v(vals,'دیر سے شادی وجہ') || '',
      _v(vals,'ملک') || _v(vals,'کہاں رہتے ہیں؟') || 'پاکستان',
      _v(vals,'صوبہ') || '',
      _v(vals,'علاقہ') || '',
      _v(vals,'بیرون ملک ملک') || '',
      _v(vals,'بیرون ملک شہر') || '',
      _v(vals,'ویزا حیثیت') || '',
      _v(vals,'مکان رقبہ') || '',
      _v(vals,'ماہانہ کرایہ') || '',
      _v(vals,'جائیداد تفصیل') || '',
      _v(vals,'نماز کی پابندی') || '',
      _v(vals,'روزے') || '',
      _v(vals,'پردہ / حجاب') || '',
      _v(vals,'کل افراد خانہ') || '',
      _v(vals,'کل بھائی') || '',
      _v(vals,'کل بہنیں') || '',
      _v(vals,'ماہانہ آمدن') || '',
      _v(vals,'ملازمت کہاں ہے؟') || '',
      _v(vals,'مطلوبہ ازدواجی حیثیت') || '',
      _v(vals,'مطلوبہ تعلیم') || '',
      _v(vals,'مطلوبہ کم سے کم عمر') || '',
      _v(vals,'مطلوبہ زیادہ سے زیادہ عمر') || '',
      _v(vals,'مطلوبہ ذات') || '',
      _v(vals,'مطلوبہ مسلک') || '',
      _v(vals,'مطلوبہ رہائش') || '',
      _v(vals,'مطلوبہ دینی تعلیم') || '',
      _v(vals,'مطلوبہ ملازمت') || '',
      _v(vals,'آبائی ملک')||'',
      _v(vals,'آبائی علاقہ')||'',
      _v(vals,'آبائی برادری')||'',
      _v(vals,'دوسری / تیسری / چوتھی شادی کی وجہ')||'',
      _v(vals,'طلاق / خلع کی وجہ')||'',
      _v(vals,'والدہ کا پیشہ')||'',
      _v(vals,'کامیاب شادی کی تعریف')||'',
      'Google Form',
      'active',
      new Date().toLocaleString('ur-PK')
    ];

    const shName = isBoy ? BOYS_SHEET : GIRLS_SHEET;
    const sheet  = ss.getSheetByName(shName);
    sheet.appendRow(row);
    const lr = sheet.getLastRow();
    sheet.getRange(lr,1,1,COLS.length)
         .setBackground(isBoy ? '#EEF2FB' : '#FCEEF3');

    Logger.log('✅ محفوظ: ' + pnpCode + ' → ' + shName);

    _sendEmail(
      '🆕 نئی Entry: ' + pnpCode + ' — ' + name,
      'PNP Code: ' + pnpCode + '\nنام: ' + name +
      '\nجنس: ' + (isBoy ? 'لڑکا' : 'لڑکی') +
      '\nشہر: ' + row[3] + '\nرابطہ: ' + row[21]
    );
  } catch(err) {
    Logger.log('❌ onFormSubmit Error: ' + err.message);
  }
}

// ═══ ADD PROFILE ════════════════════════════════════════
function addProfile(p) {
  if (!p || !p.name) return {status:'error', msg:'نام ضروری ہے'};
  const ss     = _getSheet();
  const shName = p.gender === 'boy' ? BOYS_SHEET : GIRLS_SHEET;
  const sheet  = ss.getSheetByName(shName);
  
  // پہلے check کریں کہ یہ code پہلے سے موجود تو نہیں
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === p.pnpCode) return updateProfile(p);
  }

  const row = [
    p.pnpCode||'', p.name||'', p.age||'', p.city||'',
    p.education||'', p.religiousEducation||'',
    p.profession||'', p.maritalStatus||'',
    p.caste||'', p.residenceType||p.residence||'',
    p.height||'', p.weight||'', p.complexion||'',
    p.sect||'', p.religion||'اسلام',
    p.disability||'کوئی نہیں', p.disease||'کوئی نہیں',
    p.addiction||'کوئی نہیں',
    p.fatherName||'', p.fatherProfession||'',
    p.motherName||'', p.contact||'',
    p.preferences||'', p.additionalInfo||'',
    '', // photo - base64 GAS میں save نہیں ہوتی
    p.divorceReason||'', p.hasChildren||'',
    p.totalChildren||'', p.childrenBoys||'',
    p.childrenGirls||'', p.childrenAges||'',
    p.childrenWith||'', p.custody||'',
    p.maintenance||'', p.lateReason||'',
    p.country||'پاکستان', p.province||'',
    p.area||'', p.abroadCountry||'',
    p.abroadCity||'', p.visaStatus||'',
    p.houseArea||'', p.rent||'',
    p.propertyDetails||'',
    p.prayer||'', p.fasting||'', p.parda||'',
    p.familyMembers||'', p.brothers||'',
    p.sisters||'', p.income||'', p.jobLocation||'',
    p.reqMarital||'', p.reqEducation||'',
    p.reqMinAge||'', p.reqMaxAge||'',
    p.reqCaste||'', p.reqSect||'',
    p.reqResidence||'', p.reqReligiousEdu||'',
    p.reqJobType||'',
    p.originCountry||'', p.originCity||'', p.originCommunity||'',
    p.remarryReason||'', p.remarryDivDetail||'',
    p.motherProfession||'', p.marriageDefinition||'',
    'HTML System', p.status||'active',
    p.registeredAt || new Date().toISOString()
  ];

  sheet.appendRow(row);
  const lr = sheet.getLastRow();
  sheet.getRange(lr,1,1,COLS.length)
       .setBackground(p.gender === 'boy' ? '#EEF2FB' : '#FCEEF3');

  _sendEmail(
    '🆕 HTML Entry: ' + p.pnpCode + ' — ' + p.name,
    'Code: ' + p.pnpCode + '\nنام: ' + p.name + '\nشہر: ' + p.city
  );
  return {status:'ok', pnpCode:p.pnpCode, msg:'✅ محفوظ ہو گیا'};
}

// ═══ UPDATE ════════════════════════════════════════════
function updateProfile(p) {
  const ss = _getSheet();
  const sh = ss.getSheetByName(p.gender === 'boy' ? BOYS_SHEET : GIRLS_SHEET);
  const data = sh.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === p.pnpCode) {
      const r = i + 1;
      sh.getRange(r,2).setValue(p.name          || data[i][1]);
      sh.getRange(r,3).setValue(p.age           || data[i][2]);
      sh.getRange(r,4).setValue(p.city          || data[i][3]);
      sh.getRange(r,5).setValue(p.education     || data[i][4]);
      sh.getRange(r,7).setValue(p.profession    || data[i][6]);
      sh.getRange(r,8).setValue(p.maritalStatus || data[i][7]);
      return {status:'ok', msg:'✅ اپ ڈیٹ ہو گیا'};
    }
  }
  return {status:'error', msg:'پروفائل نہیں ملی'};
}

// ═══ DELETE ════════════════════════════════════════════
function deleteProfile(code) {
  const ss = _getSheet();
  const sh = ss.getSheetByName(code.startsWith('G-') ? GIRLS_SHEET : BOYS_SHEET);
  const data = sh.getDataRange().getValues();
  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][0] === code) { sh.deleteRow(i+1); return {status:'ok'}; }
  }
  return {status:'error', msg:'پروفائل نہیں ملی'};
}

// ═══ SAVE MATCH ════════════════════════════════════════
function saveMatch(m) {
  const ss = _getSheet();
  const sh = ss.getSheetByName(MATCHES_SHEET);
  const boy  = _findProfile(ss, m.boyCode);
  const girl = _findProfile(ss, m.girlCode);
  sh.appendRow([
    m.boyCode,  boy  ? boy[1]  : '',
    m.girlCode, girl ? girl[1] : '',
    m.score,
    m.breakdown ? m.breakdown['City']      || 0 : 0,
    m.breakdown ? m.breakdown['Age']       || 0 : 0,
    m.breakdown ? m.breakdown['Education'] || 0 : 0,
    m.breakdown ? m.breakdown['Caste']     || 0 : 0,
    m.breakdown ? m.breakdown['Sect']      || 0 : 0,
    new Date().toLocaleString('ur-PK')
  ]);
  const lr = sh.getLastRow();
  sh.getRange(lr,1,1,11)
    .setBackground(m.score>=70 ? '#d5f5e3' : m.score>=50 ? '#fef9e7' : '#fdecea');
  return {status:'ok'};
}

// ═══ GET PROFILES ═══════════════════════════════════════
function getProfiles(sheetName) {
  const ss = _getSheet();
  const sh = ss.getSheetByName(sheetName);
  const data = sh.getDataRange().getValues();
  const profiles = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    profiles.push({
      pnpCode:data[i][0], name:data[i][1], age:data[i][2],
      city:data[i][3], education:data[i][4],
      religiousEducation:data[i][5], profession:data[i][6],
      maritalStatus:data[i][7], caste:data[i][8],
      residence:data[i][9], height:data[i][10],
      weight:data[i][11], complexion:data[i][12],
      sect:data[i][13], religion:data[i][14],
      disability:data[i][15], disease:data[i][16],
      addiction:data[i][17], fatherName:data[i][18],
      fatherProfession:data[i][19], motherName:data[i][20],
      contact:data[i][21], photo:data[i][24],
      gender:sheetName === BOYS_SHEET ? 'boy' : 'girl',
      status:data[i][COLS.length-2] || 'active',
      registeredAt:data[i][COLS.length-1] || ''
    });
  }
  return {status:'ok', profiles};
}

// ═══ GET MATCHES ════════════════════════════════════════
function getAllMatches() {
  const ss = _getSheet();
  const sh = ss.getSheetByName(MATCHES_SHEET);
  const data = sh.getDataRange().getValues();
  const matches = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    matches.push({
      boyCode:data[i][0], boyName:data[i][1],
      girlCode:data[i][2], girlName:data[i][3],
      score:data[i][4], savedAt:data[i][10]
    });
  }
  return {status:'ok', matches};
}

// ═══ SYNC ALL ═══════════════════════════════════════════
function syncAll(data) {
  let b = 0, g = 0;
  (data.boys  || []).forEach(p => { try { addProfile(p); b++; } catch(e) {} });
  (data.girls || []).forEach(p => { try { addProfile(p); g++; } catch(e) {} });
  return {status:'ok', msg:`✅ ${b} لڑکے، ${g} لڑکیاں محفوظ`};
}

// ═══ TRIGGER SETUP ══════════════════════════════════════
function setupFormTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'onFormSubmit')
      ScriptApp.deleteTrigger(t);
  });
  const ss = _getSheet();
  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss).onFormSubmit().create();
  Logger.log('✅ Form Trigger لگ گیا');
  return {status:'ok', msg:'✅ Trigger فعال ہو گیا'};
}

// ═══ PRIVATE HELPERS ════════════════════════════════════
function _v(obj, key) {
  if (!obj || !obj[key]) return '';
  const v = obj[key];
  return Array.isArray(v) ? (v[0] || '') : (v || '');
}
function _getSheet() {
  const f = DriveApp.getFilesByName(SS_NAME);
  if (!f.hasNext()) throw new Error('Sheet نہیں ملی — پہلے setup() چلائیں');
  return SpreadsheetApp.open(f.next());
}
function _makeSheet(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(headers); sh.setFrozenRows(1); }
  return sh;
}
function _makeCode(ss, isBoy) {
  const sh = ss.getSheetByName(isBoy ? BOYS_SHEET : GIRLS_SHEET);
  const n  = Math.max(sh.getLastRow() - 1, 0);
  return (isBoy ? 'L-' : 'G-') + String(n+1).padStart(6, '0');
}
function _findProfile(ss, code) {
  const sh = ss.getSheetByName(code.startsWith('G-') ? GIRLS_SHEET : BOYS_SHEET);
  return sh.getDataRange().getValues().find(r => r[0] === code);
}
function _sendEmail(subject, body) {
  try {
    if (ADMIN_EMAIL && ADMIN_EMAIL !== 'YOUR_EMAIL@gmail.com')
      MailApp.sendEmail(ADMIN_EMAIL, subject, body);
  } catch(e) {}
}
function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// CORS کے ساتھ response
function _jsonCors(obj) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
function formatSheets() {
  const ss = _getSheet();
  
  [BOYS_SHEET, GIRLS_SHEET].forEach(shName => {
    const sh = ss.getSheetByName(shName);
    if (!sh) return;
    
    const isBoy = shName === BOYS_SHEET;
    const lastCol = sh.getLastColumn();
    const lastRow = sh.getLastRow();
    
    // ═══ Row 1 — Headers ═══
    const headerRange = sh.getRange(1, 1, 1, lastCol);
    
    // رنگ سکیم
    if (isBoy) {
      // لڑکوں کے لیے — گہرا نیلا + سنہری
      headerRange
        .setBackground('#1a3a5c')
        .setFontColor('#FFD700')
        .setFontWeight('bold')
        .setFontSize(11)
        .setFontFamily('Arial')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setBorder(true, true, true, true, true, true, '#FFD700', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    } else {
      // لڑکیوں کے لیے — گہرا گلابی + سنہری
      headerRange
        .setBackground('#6d1a3a')
        .setFontColor('#FFD700')
        .setFontWeight('bold')
        .setFontSize(11)
        .setFontFamily('Arial')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setBorder(true, true, true, true, true, true, '#FFD700', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    }
    
    // Header row کی اونچائی
    sh.setRowHeight(1, 40);
    
    // ═══ Data Rows — Row 2 سے آخر تک ═══
    if (lastRow > 1) {
      const dataRange = sh.getRange(2, 1, lastRow - 1, lastCol);
      
      // Center alignment تمام data کے لیے
      dataRange
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')
        .setFontSize(10)
        .setFontFamily('Arial');
      
      // ہر row کو alternate رنگ دیں
      for (let r = 2; r <= lastRow; r++) {
        const rowRange = sh.getRange(r, 1, 1, lastCol);
        if (isBoy) {
          rowRange.setBackground(r % 2 === 0 ? '#e8f0fe' : '#ffffff');
        } else {
          rowRange.setBackground(r % 2 === 0 ? '#fce4ec' : '#ffffff');
        }
        sh.setRowHeight(r, 30);
      }
      
      // Border تمام data پر
      dataRange.setBorder(
        true, true, true, true, true, true,
        '#cccccc', SpreadsheetApp.BorderStyle.SOLID
      );
    }
    
    // ═══ تمام Columns خود بخود data کے مطابق ═══
    sh.autoResizeColumns(1, lastCol);
    
    // Freeze header row
    sh.setFrozenRows(1);
    
    Logger.log('✅ ' + shName + ' format ہو گئی');
  });
  
  Logger.log('✅ تمام sheets format مکمل');
  return {status:'ok', msg:'✅ Sheets format ہو گئیں'};
}

function dailyBackup() {
  const ss = _getSheet();
  const d  = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  DriveApp.getFileById(ss.getId()).makeCopy('PNP_Backup_' + d);
}
