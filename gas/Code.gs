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
  // A-D: بنیادی
  'PNP Code',        // A
  'نام',             // B
  'تاریخ پیدائش',   // C
  'عمر',             // D
  // E-K: شناختی معلومات
  'شہر',             // E
  'تعلیم',           // F
  'دینی تعلیم',      // G
  'پیشہ',            // H
  'ازدواجی حیثیت',  // I
  'رہائش کی نوعیت', // J
  'ذات/برادری',      // K
  // L-P: ذاتی
  'قد',              // L
  'وزن',             // M
  'رنگت',            // N
  'مسلک',            // O
  'مذہب',            // P
  // Q-S: صحت
  'جسمانی معذوری',  // Q
  'دائمی بیماری',   // R
  'نشہ',             // S
  // T-W: خاندان
  'والد کا نام',     // T
  'والد کا پیشہ',    // U
  'والدہ کا نام',    // V
  'رابطہ نمبر',      // W
  // X-Y: اضافی
  'خواہشات',         // X
  'تصویر',           // Y
  // Z-AH: ازدواجی تفصیل
  'طلاق خلع وجہ',   // Z
  'بچے ہیں؟',        // AA
  'کل بچے',          // AB
  'لڑکے',            // AC
  'لڑکیاں',         // AD
  'بچوں کی عمریں',  // AE
  'بچے کس کے ساتھ', // AF
  'Custody',         // AG
  'نان نفقہ',        // AH
  'دیر سے شادی وجہ',// AI
  // AJ-AQ: رہائش تفصیل
  'ملک',             // AJ
  'صوبہ',            // AK
  'علاقہ',           // AL
  'بیرون ملک ملک',   // AM
  'بیرون ملک شہر',   // AN
  'ویزا حیثیت',      // AO
  'مکان رقبہ',       // AP
  'ماہانہ کرایہ',    // AQ
  'جائیداد تفصیل',  // AR
  // AS-AU: دین
  'نماز',            // AS
  'روزے',            // AT
  'پردہ',            // AU
  // AV-AZ: خاندان
  'افراد خانہ',      // AV
  'بھائی',           // AW
  'بہنیں',           // AX
  'آمدن',            // AY
  'ملازمت مقام',     // AZ
  // BA-BI: مطلوبہ
  'مطلوبہ ازدواجی',  // BA
  'مطلوبہ تعلیم',    // BB
  'مطلوبہ کم عمر',   // BC
  'مطلوبہ زیادہ عمر',// BD
  'مطلوبہ ذات',      // BE
  'مطلوبہ مسلک',     // BF
  'مطلوبہ رہائش',    // BG
  'مطلوبہ دینی تعلیم',// BH
  'مطلوبہ ملازمت',   // BI
  // BJ-BM: آبائی
  'آبائی ملک',       // BJ
  'آبائی علاقہ',     // BK
  'آبائی برادری',    // BL
  // BM-BP: شادی تفصیل
  'شادی وجہ',        // BM
  'طلاق خلع تفصیل', // BN
  'والدہ پیشہ',      // BO
  'کامیاب شادی تعریف',// BP
  // BQ-BS: سسٹم
  'ذریعہ',           // BQ
  'حیثیت',           // BR
  'تاریخ'            // BS
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
    if (a === 'deleteProfile' && e.parameter.pnpCode) {
      const res = deleteProfile(e.parameter.pnpCode);
      return _cors(_json(res));
    }
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
      pnpCode,                                              // A: PNP Code
      name,                                                 // B: نام
      _v(vals,'تاریخ پیدائش') || '',                      // C: تاریخ پیدائش
      _v(vals,'عمر') || _v(vals,'Age') || '',             // D: عمر
      _v(vals,'شہر') || _v(vals,'City') || '',            // E: شہر
      _v(vals,'تعلیم') || _v(vals,'Education') || '',     // F: تعلیم
      _v(vals,'دینی تعلیم') || '',                         // G: دینی تعلیم
      _v(vals,'پیشہ') || _v(vals,'Profession') || '',     // H: پیشہ
      _v(vals,'ازدواجی حیثیت') || _v(vals,'Marital Status') || '', // I
      _v(vals,'رہائش کی نوعیت') || '',                    // J: رہائش کی نوعیت
      _v(vals,'ذات / برادری') || _v(vals,'Caste') || '', // K: ذات/برادری ✅
      _v(vals,'قد') || _v(vals,'Height') || '',           // L: قد
      _v(vals,'وزن') || _v(vals,'Weight') || '',          // M: وزن
      _v(vals,'رنگت') || _v(vals,'Complexion') || '',     // N: رنگت
      _v(vals,'مسلک') || _v(vals,'Sect') || '',           // O: مسلک
      'اسلام',                                             // P: مذہب
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

  // تصویر Google Drive پر upload کریں
  let photoUrl = '';
  if (p.photo && p.photo.startsWith('data:')) {
    photoUrl = _uploadPhoto(p.photo, p.pnpCode) || '';
    Logger.log('✅ Photo Drive URL: ' + photoUrl);
  } else if (p.photo && p.photo.startsWith('http')) {
    photoUrl = p.photo; // پہلے سے URL ہے
  }

  const row = [
    // COLS کے بالکل مطابق — A سے BS تک
    p.pnpCode||'',              // A: PNP Code
    p.name||'',                 // B: نام
    p.dob||'',                  // C: تاریخ پیدائش
    p.age||'',                  // D: عمر
    p.city||'',                 // E: شہر
    p.education||'',            // F: تعلیم
    p.religiousEducation||'',   // G: دینی تعلیم
    p.profession||'',           // H: پیشہ
    p.maritalStatus||'',        // I: ازدواجی حیثیت
    p.residenceType||p.residence||'', // J: رہائش کی نوعیت
    p.caste||'',                // K: ذات/برادری
    p.height||'',               // L: قد
    p.weight||'',               // M: وزن
    p.complexion||'',           // N: رنگت
    p.sect||'',                 // O: مسلک
    p.religion||'اسلام',       // P: مذہب
    p.disability||'کوئی نہیں', // Q: جسمانی معذوری
    p.disease||'کوئی نہیں',    // R: دائمی بیماری
    p.addiction||'کوئی نہیں',  // S: نشہ
    p.fatherName||'',           // T: والد کا نام
    p.fatherProfession||'',     // U: والد کا پیشہ
    p.motherName||'',           // V: والدہ کا نام
    p.contact||'',              // W: رابطہ نمبر
    p.preferences||'',          // X: خواہشات
    photoUrl,                   // Y: تصویر
    p.divorceReason||'',        // Z: طلاق خلع وجہ
    p.hasChildren||'',          // AA: بچے ہیں؟
    p.totalChildren||'',        // AB: کل بچے
    p.childrenBoys||'',         // AC: لڑکے
    p.childrenGirls||'',        // AD: لڑکیاں
    p.childrenAges||'',         // AE: بچوں کی عمریں
    p.childrenWith||'',         // AF: بچے کس کے ساتھ
    p.custody||'',              // AG: Custody
    p.maintenance||'',          // AH: نان نفقہ
    p.lateReason||'',           // AI: دیر سے شادی وجہ
    p.country||'پاکستان',      // AJ: ملک
    p.province||'',             // AK: صوبہ
    p.area||'',                 // AL: علاقہ
    p.abroadCountry||'',        // AM: بیرون ملک ملک
    p.abroadCity||'',           // AN: بیرون ملک شہر
    p.visaStatus||'',           // AO: ویزا حیثیت
    p.houseArea||'',            // AP: مکان رقبہ
    p.rent||'',                 // AQ: ماہانہ کرایہ
    p.propertyDetails||'',      // AR: جائیداد تفصیل
    p.prayer||'',               // AS: نماز
    p.fasting||'',              // AT: روزے
    p.parda||'',                // AU: پردہ
    p.familyMembers||'',        // AV: افراد خانہ
    p.brothers||'',             // AW: بھائی
    p.sisters||'',              // AX: بہنیں
    p.income||'',               // AY: آمدن
    p.jobLocation||'',          // AZ: ملازمت مقام
    p.reqMarital||'',           // BA: مطلوبہ ازدواجی
    p.reqEducation||'',         // BB: مطلوبہ تعلیم
    p.reqMinAge||'',            // BC: مطلوبہ کم عمر
    p.reqMaxAge||'',            // BD: مطلوبہ زیادہ عمر
    p.reqCaste||'',             // BE: مطلوبہ ذات
    p.reqSect||'',              // BF: مطلوبہ مسلک
    p.reqResidence||'',         // BG: مطلوبہ رہائش
    p.reqReligiousEdu||'',      // BH: مطلوبہ دینی تعلیم
    p.reqJobType||'',           // BI: مطلوبہ ملازمت
    p.originCountry||'',        // BJ: آبائی ملک
    p.originCity||'',           // BK: آبائی علاقہ
    p.originCommunity||'',      // BL: آبائی برادری
    p.remarryReason||'',        // BM: شادی وجہ
    p.remarryDivDetail||'',     // BN: طلاق خلع تفصیل
    p.motherProfession||'',     // BO: والدہ پیشہ
    p.marriageDefinition||'',   // BP: کامیاب شادی تعریف
    'HTML System',              // BQ: ذریعہ
    p.status||'active',         // BR: حیثیت
    p.registeredAt || new Date().toISOString() // BS: تاریخ
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
      // تصویر update کریں
      if (p.photo && p.photo.startsWith('data:')) {
        const newPhotoUrl = _uploadPhoto(p.photo, p.pnpCode) || '';
        if (newPhotoUrl) sh.getRange(r,25).setValue(newPhotoUrl);
      } else if (p.photo && p.photo.startsWith('http')) {
        sh.getRange(r,25).setValue(p.photo);
      }
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
      // COLS A-BS کے بالکل مطابق درست indices
      pnpCode:           data[i][0],   // A: PNP Code
      name:              data[i][1],   // B: نام
      dob:               data[i][2],   // C: تاریخ پیدائش ✅
      age:               data[i][3],   // D: عمر
      city:              data[i][4],   // E: شہر ✅
      education:         data[i][5],   // F: تعلیم
      religiousEducation:data[i][6],   // G: دینی تعلیم
      profession:        data[i][7],   // H: پیشہ
      maritalStatus:     data[i][8],   // I: ازدواجی حیثیت
      residence:         data[i][9],   // J: رہائش کی نوعیت
      caste:             data[i][10],  // K: ذات/برادری ✅
      height:            data[i][11],  // L: قد
      weight:            data[i][12],  // M: وزن
      complexion:        data[i][13],  // N: رنگت
      sect:              data[i][14],  // O: مسلک
      religion:          data[i][15],  // P: مذہب
      disability:        data[i][16],  // Q: جسمانی معذوری
      disease:           data[i][17],  // R: دائمی بیماری
      addiction:         data[i][18],  // S: نشہ
      fatherName:        data[i][19],  // T: والد کا نام
      fatherProfession:  data[i][20],  // U: والد کا پیشہ
      motherName:        data[i][21],  // V: والدہ کا نام
      contact:           data[i][22],  // W: رابطہ نمبر
      preferences:       data[i][23],  // X: خواہشات
      photo:             data[i][24],  // Y: تصویر
      country:           data[i][35],  // AJ: ملک
      province:          data[i][36],  // AK: صوبہ
      area:              data[i][37],  // AL: علاقہ
      prayer:            data[i][44],  // AS: نماز
      fasting:           data[i][45],  // AT: روزے
      parda:             data[i][46],  // AU: پردہ
      familyMembers:     data[i][47],  // AV: افراد خانہ
      brothers:          data[i][48],  // AW: بھائی
      sisters:           data[i][49],  // AX: بہنیں
      income:            data[i][50],  // AY: آمدن
      reqMarital:        data[i][52],  // BA: مطلوبہ ازدواجی
      reqEducation:      data[i][53],  // BB: مطلوبہ تعلیم
      reqMinAge:         data[i][54],  // BC: مطلوبہ کم عمر
      reqMaxAge:         data[i][55],  // BD: مطلوبہ زیادہ عمر
      reqCaste:          data[i][56],  // BE: مطلوبہ ذات
      reqSect:           data[i][57],  // BF: مطلوبہ مسلک
      reqResidence:      data[i][58],  // BG: مطلوبہ رہائش
      reqReligiousEdu:   data[i][59],  // BH: مطلوبہ دینی تعلیم
      reqJobType:        data[i][60],  // BI: مطلوبہ ملازمت
      originCountry:     data[i][61],  // BJ: آبائی ملک
      originCity:        data[i][62],  // BK: آبائی علاقہ
      originCommunity:   data[i][63],  // BL: آبائی برادری
      remarryReason:     data[i][64],  // BM: شادی وجہ
      marriageDefinition:data[i][67],  // BP: شادی تعریف
      gender:            sheetName === BOYS_SHEET ? 'boy' : 'girl',
      status:            data[i][COLS.length-2] || 'active',
      registeredAt:      data[i][COLS.length-1] || ''
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
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  } else {
    // موجودہ headers چیک کریں — کم ہوں تو مزید شامل کریں
    const existing = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
    if (existing.length < headers.length) {
      for (let i = existing.length; i < headers.length; i++) {
        sh.getRange(1, i+1).setValue(headers[i]);
      }
      Logger.log('✅ ' + name + ' میں ' + (headers.length - existing.length) + ' نئے columns شامل');
    }
  }
  return sh;
}

// سب columns ایک ساتھ ٹھیک کریں
function fixAllColumns() {
  const ss = _getSheet();
  [BOYS_SHEET, GIRLS_SHEET].forEach(shName => {
    const sh = ss.getSheetByName(shName);
    if (!sh) return;
    // پہلی row clear کریں اور COLS سے دوبارہ لکھیں
    const lastCol = Math.max(sh.getLastColumn(), COLS.length);
    sh.getRange(1, 1, 1, lastCol).clearContent();
    sh.getRange(1, 1, 1, COLS.length).setValues([COLS]);
    // Formatting
    sh.getRange(1, 1, 1, COLS.length)
      .setBackground('#0D3B2E')
      .setFontColor('#C9A84C')
      .setFontWeight('bold')
      .setFontSize(11)
      .setHorizontalAlignment('center');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, COLS.length);
    Logger.log('✅ ' + shName + ' columns ٹھیک — ' + COLS.length + ' columns');
  });
  return {status:'ok', msg:'✅ تمام ' + COLS.length + ' columns ٹھیک'};
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
function _uploadPhoto(base64, code) {
  try {
    const m = base64.match(/^data:(.+);base64,(.+)$/);
    if (!m) return null;
    const mimeType = m[1];
    const ext = mimeType.includes('png') ? '.png' : '.jpg';
    const fileName = 'PNP_' + code + '_' + new Date().getTime() + ext;
    const blob = Utilities.newBlob(
      Utilities.base64Decode(m[2]), mimeType, fileName
    );
    // PakNikahPoint_Photos folder ڈھونڈیں یا بنائیں
    let folder;
    const folders = DriveApp.getFoldersByName('PakNikahPoint_Photos');
    folder = folders.hasNext() ? folders.next() : DriveApp.createFolder('PakNikahPoint_Photos');
    // پرانی تصویر ہو تو ہٹائیں
    try {
      const oldFiles = folder.getFilesByName(fileName);
      while (oldFiles.hasNext()) oldFiles.next().setTrashed(true);
    } catch(e) {}
    // نئی تصویر save کریں
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const photoUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId();
    Logger.log('✅ تصویر Drive میں: ' + photoUrl);
    return photoUrl;
  } catch(e) {
    Logger.log('❌ Photo upload error: ' + e.message);
    return null;
  }
}

// Google Form کی تصویر کا link لیں
function _getFormPhotoUrl(driveFileId) {
  try {
    if (!driveFileId) return '';
    // Form کی تصویر پہلے سے Drive میں ہوتی ہے
    const file = DriveApp.getFileById(driveFileId);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/uc?export=view&id=' + driveFileId;
  } catch(e) {
    return '';
  }
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
function fixAndFormatSheets() {
  fixColumns();
  formatSheets();
  return {status:'ok', msg:'✅ Columns اور Format ٹھیک ہو گئے'};
}

function cleanDuplicateColumns() {
  const ss = _getSheet();
  [BOYS_SHEET, GIRLS_SHEET].forEach(shName => {
    const sh = ss.getSheetByName(shName);
    if (!sh) return;
    
    const lastCol = sh.getLastColumn();
    const headers = sh.getRange(1, 1, 1, lastCol).getValues()[0];
    
    // پہلے COLS کے مطابق صرف پہلی بار والے columns رکھیں
    // duplicate columns ڈھونڈیں اور delete کریں
    const seen = [];
    const toDelete = [];
    
    for (let i = headers.length - 1; i >= 0; i--) {
      const h = headers[i];
      if (!h) { toDelete.push(i + 1); continue; }
      if (seen.includes(h)) {
        toDelete.push(i + 1); // duplicate — delete کریں
      } else {
        seen.unshift(h);
      }
    }
    
    // پیچھے سے delete کریں تاکہ index نہ بدلے
    toDelete.sort((a,b) => b - a);
    toDelete.forEach(col => {
      sh.deleteColumn(col);
      Logger.log('Deleted duplicate column: ' + col);
    });
    
    Logger.log('✅ ' + shName + ': ' + toDelete.length + ' duplicate columns ہٹائے گئے');
  });
  
  return {status:'ok', msg:'✅ Duplicate columns ہٹ گئے'};
}

function fixColumns() {
  const ss = _getSheet();
  [BOYS_SHEET, GIRLS_SHEET].forEach(shName => {
    const sh = ss.getSheetByName(shName);
    if (!sh) return;
    
    // موجودہ headers
    const existing = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    
    // COLS کے مطابق ہر column ڈھونڈیں یا بنائیں
    COLS.forEach((colName, idx) => {
      const colNum = idx + 1;
      const existingIdx = existing.indexOf(colName);
      
      if (existingIdx === -1) {
        // یہ column موجود نہیں — آخر میں شامل کریں
        const lastCol = sh.getLastColumn();
        sh.getRange(1, lastCol + 1).setValue(colName);
        Logger.log('نیا column: ' + colName);
      }
    });
    
    // پہلی row کو COLS کے مطابق ترتیب دیں
    const newHeaders = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), COLS.length)).getValues()[0];
    COLS.forEach((colName, idx) => {
      sh.getRange(1, idx + 1).setValue(colName);
    });
    
    Logger.log('✅ ' + shName + ' columns ٹھیک ہو گئے');
  });
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
