/**
 * PakNikahPoint — روزانہ قرآنی آیت اور حدیث
 * مستند حوالہ جات کے ساتھ
 */
const PNP_DAILY = {

  AYAT: [
    { arabic:'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً', urdu:'اور اس کی نشانیوں میں سے ہے کہ اس نے تمہارے لیے تمہی میں سے جوڑے بنائے تاکہ تم ان کے پاس سکون پاؤ اور اس نے تمہارے درمیان محبت اور رحمت رکھ دی', ref:'سورۃ الروم — آیت 21', no:'30:21' },
    { arabic:'وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ', urdu:'اور اپنے بے نکاح مردوں اور عورتوں کے نکاح کر دو اور اپنے نیک بندوں اور لونڈیوں کے بھی', ref:'سورۃ النور — آیت 32', no:'24:32' },
    { arabic:'هُنَّ لِبَاسٌ لَّكُمْ وَأَنتُمْ لِبَاسٌ لَّهُنَّ', urdu:'وہ تمہارا لباس ہیں اور تم ان کا لباس ہو', ref:'سورۃ البقرہ — آیت 187', no:'2:187' },
    { arabic:'وَعَاشِرُوهُنَّ بِالْمَعْرُوفِ', urdu:'اور ان کے ساتھ اچھے طریقے سے زندگی گزارو', ref:'سورۃ النساء — آیت 19', no:'4:19' },
    { arabic:'وَلَهُنَّ مِثْلُ الَّذِي عَلَيْهِنَّ بِالْمَعْرُوفِ', urdu:'اور عورتوں کے حقوق ویسے ہی ہیں جیسے ان پر ذمہ داریاں ہیں', ref:'سورۃ البقرہ — آیت 228', no:'2:228' },
    { arabic:'فَإِمْسَاكٌ بِمَعْرُوفٍ أَوْ تَسْرِيحٌ بِإِحْسَانٍ', urdu:'پھر یا تو اچھے طریقے سے روکنا یا بھلے طریقے سے چھوڑ دینا', ref:'سورۃ البقرہ — آیت 229', no:'2:229' },
    { arabic:'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', urdu:'بیشک اللہ کے نزدیک تم میں سب سے زیادہ عزت والا وہ ہے جو سب سے زیادہ پرہیزگار ہے', ref:'سورۃ الحجرات — آیت 13', no:'49:13' },
    { arabic:'وَآتُوا النِّسَاءَ صَدُقَاتِهِنَّ نِحْلَةً', urdu:'اور عورتوں کو ان کے مہر خوشی سے ادا کرو', ref:'سورۃ النساء — آیت 4', no:'4:4' },
    { arabic:'وَلَا تَنسَوُا الْفَضْلَ بَيْنَكُمْ', urdu:'اور آپس میں بھلائی کرنا مت بھولو', ref:'سورۃ البقرہ — آیت 237', no:'2:237' },
    { arabic:'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا', urdu:'اے لوگو! ہم نے تمہیں ایک مرد اور ایک عورت سے پیدا کیا اور تمہیں قومیں اور قبیلے بنایا تاکہ آپس میں پہچان ہو', ref:'سورۃ الحجرات — آیت 13', no:'49:13' },
    { arabic:'وَإِن يَتَفَرَّقَا يُغْنِ اللَّهُ كُلًّا مِّن سَعَتِهِ', urdu:'اور اگر وہ جدا ہو جائیں تو اللہ اپنی وسعت سے دونوں کو بے نیاز کر دے گا', ref:'سورۃ النساء — آیت 130', no:'4:130' },
    { arabic:'وَأَشْهِدُوا ذَوَيْ عَدْلٍ مِّنكُمْ وَأَقِيمُوا الشَّهَادَةَ لِلَّهِ', urdu:'اور اپنے میں سے دو عادل آدمیوں کو گواہ بناؤ اور اللہ کے لیے سچی گواہی دو', ref:'سورۃ الطلاق — آیت 2', no:'65:2' },
    { arabic:'وَأَنفِقُوا فِي سَبِيلِ اللَّهِ وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ', urdu:'اور اللہ کی راہ میں خرچ کرو اور اپنے آپ کو ہلاکت میں مت ڈالو', ref:'سورۃ البقرہ — آیت 195', no:'2:195' },
    { arabic:'إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ', urdu:'بیشک اللہ توکل کرنے والوں سے محبت کرتا ہے', ref:'سورۃ آل عمران — آیت 159', no:'3:159' },
  ],

  AHADEES: [
    { arabic:'النِّكَاحُ مِنْ سُنَّتِي فَمَنْ لَمْ يَعْمَلْ بِسُنَّتِي فَلَيْسَ مِنِّي', urdu:'نکاح میری سنت ہے۔ جو میری سنت پر عمل نہ کرے وہ مجھ سے نہیں', raawi:'حضرت انس بن مالک رضی اللہ عنہ', kitab:'سنن ابن ماجہ', no:'حدیث: 1846', grade:'صحیح' },
    { arabic:'تَزَوَّجُوا الْوَدُودَ الْوَلُودَ فَإِنِّي مُكَاثِرٌ بِكُمُ الْأُمَمَ', urdu:'محبت کرنے والی اور زیادہ بچے جننے والی عورتوں سے نکاح کرو کیونکہ میں (قیامت کے دن) دوسری امتوں پر تمہاری کثرت سے فخر کروں گا', raawi:'حضرت معقل بن یسار رضی اللہ عنہ', kitab:'سنن ابو داود', no:'حدیث: 2050', grade:'صحیح' },
    { arabic:'خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي', urdu:'تم میں سے بہترین وہ ہے جو اپنے گھر والوں کے لیے بہترین ہو اور میں اپنے گھر والوں کے لیے تم سب سے بہترین ہوں', raawi:'حضرت عائشہ رضی اللہ عنہا', kitab:'سنن ترمذی', no:'حدیث: 3895', grade:'صحیح' },
    { arabic:'إِذَا جَاءَكُمْ مَنْ تَرْضَوْنَ دِينَهُ وَخُلُقَهُ فَأَنْكِحُوهُ', urdu:'جب تمہارے پاس وہ شخص (رشتے کی درخواست کے ساتھ) آئے جس کا دین اور اخلاق تمہیں پسند ہو تو اس سے (اپنی بیٹی کا) نکاح کر دو', raawi:'حضرت ابو ہریرہ رضی اللہ عنہ', kitab:'سنن ترمذی', no:'حدیث: 1084', grade:'حسن' },
    { arabic:'أَعْلِنُوا النِّكَاحَ', urdu:'نکاح کا اعلان کرو', raawi:'حضرت عائشہ رضی اللہ عنہا', kitab:'سنن ابن ماجہ', no:'حدیث: 1895', grade:'حسن' },
    { arabic:'الدُّنْيَا مَتَاعٌ وَخَيْرُ مَتَاعِ الدُّنْيَا الْمَرْأَةُ الصَّالِحَةُ', urdu:'دنیا ایک سامان ہے اور دنیا کا بہترین سامان نیک عورت ہے', raawi:'حضرت عبداللہ بن عمرو رضی اللہ عنہ', kitab:'صحیح مسلم', no:'حدیث: 1467', grade:'صحیح' },
    { arabic:'اسْتَوْصُوا بِالنِّسَاءِ خَيْرًا', urdu:'عورتوں کے ساتھ بھلائی کرتے رہو', raawi:'حضرت ابو ہریرہ رضی اللہ عنہ', kitab:'صحیح بخاری', no:'حدیث: 5186', grade:'صحیح' },
    { arabic:'لَا يَفْرَكْ مُؤْمِنٌ مُؤْمِنَةً إِنْ كَرِهَ مِنْهَا خُلُقًا رَضِيَ مِنْهَا آخَرَ', urdu:'کوئی مومن مرد کسی مومن عورت سے نفرت نہ کرے۔ اگر اس کی کوئی ایک بات ناپسند ہو تو دوسری بات پسند ہوگی', raawi:'حضرت ابو ہریرہ رضی اللہ عنہ', kitab:'صحیح مسلم', no:'حدیث: 1469', grade:'صحیح' },
    { arabic:'مَنْ كَانَتْ لَهُ أُنْثَى فَلَمْ يَئِدْهَا وَلَمْ يُهِنْهَا وَلَمْ يُؤْثِرْ وَلَدَهُ عَلَيْهَا أَدْخَلَهُ اللَّهُ الْجَنَّةَ', urdu:'جس کے ہاں لڑکی ہو اور اس نے اسے نہ زندہ دفن کیا، نہ اسے ذلیل کیا اور نہ بیٹوں کو اس پر ترجیح دی تو اللہ اسے جنت میں داخل کرے گا', raawi:'حضرت عبداللہ بن عباس رضی اللہ عنہما', kitab:'سنن ابو داود', no:'حدیث: 5146', grade:'حسن' },
    { arabic:'مَنْ أَعَانَ مُؤْمِنًا عَلَى تَزْوِيجٍ زَوَّجَهُ اللَّهُ مِنَ الْحُورِ الْعِينِ', urdu:'جو شخص کسی مومن کی شادی میں مدد کرے اللہ اسے حور العین سے نکاح عطا فرمائے گا', raawi:'حضرت انس بن مالک رضی اللہ عنہ', kitab:'مجمع الزوائد', no:'حدیث: 7/524', grade:'حسن' },
    { arabic:'ثَلَاثَةٌ حَقٌّ عَلَى اللَّهِ عَوْنُهُمُ: الْمُجَاهِدُ فِي سَبِيلِ اللَّهِ وَالْمُكَاتَبُ الَّذِي يُرِيدُ الْأَدَاءَ وَالنَّاكِحُ الَّذِي يُرِيدُ الْعَفَافَ', urdu:'تین لوگوں کی مدد کرنا اللہ کے ذمے ہے: اللہ کی راہ میں جہاد کرنے والا، مکاتب جو ادائیگی چاہتا ہو، اور نکاح کرنے والا جو پاکدامنی چاہتا ہو', raawi:'حضرت ابو ہریرہ رضی اللہ عنہ', kitab:'سنن ترمذی', no:'حدیث: 1655', grade:'صحیح' },
    { arabic:'تُنْكَحُ الْمَرْأَةُ لِأَرْبَعٍ: لِمَالِهَا وَلِحَسَبِهَا وَلِجَمَالِهَا وَلِدِينِهَا فَاظْفَرْ بِذَاتِ الدِّينِ تَرِبَتْ يَدَاكَ', urdu:'عورت سے چار چیزوں کی وجہ سے نکاح کیا جاتا ہے: مال، حسب و نسب، خوبصورتی اور دین۔ پس تم دین والی کو لو، تمہارے ہاتھ بھلائی پائیں', raawi:'حضرت ابو ہریرہ رضی اللہ عنہ', kitab:'صحیح بخاری', no:'حدیث: 5090', grade:'صحیح' },
    { arabic:'إِذَا تَزَوَّجَ الْعَبْدُ فَقَدِ اسْتَكْمَلَ نِصْفَ الدِّينِ', urdu:'جب بندہ نکاح کر لیتا ہے تو اس نے نصف دین مکمل کر لیا', raawi:'حضرت انس بن مالک رضی اللہ عنہ', kitab:'شعب الایمان بیہقی', no:'حدیث: 5100', grade:'حسن' },
    { arabic:'خَيْرُ الصَّدَاقِ أَيْسَرُهُ', urdu:'بہترین مہر وہ ہے جو آسان ہو', raawi:'حضرت عقبہ بن عامر رضی اللہ عنہ', kitab:'سنن ابو داود', no:'حدیث: 2117', grade:'صحیح' },
  ],

  // آج کی آیت اور حدیث لیں
  getTodayIndex(len) {
    const d = new Date();
    const dayOfYear = Math.floor((d - new Date(d.getFullYear(),0,0)) / 86400000);
    return dayOfYear % len;
  },

  getTodayAyat() {
    return this.AYAT[this.getTodayIndex(this.AYAT.length)];
  },

  getTodayHadees() {
    const idx = (this.getTodayIndex(this.AHADEES.length) + 3) % this.AHADEES.length;
    return this.AHADEES[idx];
  },

  // Widget HTML بنائیں
  buildWidget() {
    const ayat   = this.getTodayAyat();
    const hadees = this.getTodayHadees();
    const today  = new Date().toLocaleDateString('ur-PK', {weekday:'long', year:'numeric', month:'long', day:'numeric'});

    return `
    <div id="dailyWidget" style="margin-bottom:24px;">

      <!-- قرآنی آیت -->
      <div style="background:linear-gradient(135deg,#0D3B2E,#1A5C45);border-radius:14px;padding:24px;margin-bottom:16px;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background-image:url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Cpath d=M20 0 L40 20 L20 40 L0 20Z fill=none stroke=rgba(201,168,76,0.06) stroke-width=1/%3E%3C/svg%3E');background-size:40px;"></div>
        <div style="position:relative;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">📖</span>
              <div>
                <div style="font-family:'Cinzel',serif;font-size:12px;color:#C9A84C;letter-spacing:1px;">آج کی قرآنی آیت</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);">${today}</div>
              </div>
            </div>
            <div style="background:rgba(201,168,76,0.2);padding:4px 12px;border-radius:20px;font-size:11px;color:#C9A84C;font-weight:700;">${ayat.no}</div>
          </div>
          <div style="font-size:22px;line-height:2;color:#C9A84C;text-align:center;margin-bottom:14px;font-weight:400;">${ayat.arabic}</div>
          <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:14px;">
            <div style="font-size:14px;color:rgba(255,255,255,0.9);line-height:1.8;text-align:right;">${ayat.urdu}</div>
          </div>
          <div style="margin-top:10px;font-size:11px;color:rgba(201,168,76,0.8);text-align:center;">— ${ayat.ref} —</div>
        </div>
      </div>

      <!-- حدیث مبارکہ -->
      <div style="background:linear-gradient(135deg,#1a3a5c,#2471a3);border-radius:14px;padding:24px;position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;background-image:url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Ccircle cx=20 cy=20 r=15 fill=none stroke=rgba(255,255,255,0.04) stroke-width=1/%3E%3C/svg%3E');background-size:40px;"></div>
        <div style="position:relative;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:22px;">📜</span>
              <div>
                <div style="font-family:'Cinzel',serif;font-size:12px;color:#f9e79f;letter-spacing:1px;">آج کی حدیث مبارکہ</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.5);">${hadees.kitab} • ${hadees.no}</div>
              </div>
            </div>
            <div style="background:rgba(249,231,159,0.2);padding:4px 12px;border-radius:20px;font-size:11px;color:#f9e79f;font-weight:700;">${hadees.grade}</div>
          </div>
          <div style="font-size:20px;line-height:2;color:#f9e79f;text-align:center;margin-bottom:14px;">${hadees.arabic}</div>
          <div style="background:rgba(255,255,255,0.08);border-radius:10px;padding:14px;">
            <div style="font-size:14px;color:rgba(255,255,255,0.9);line-height:1.8;text-align:right;">${hadees.urdu}</div>
          </div>
          <div style="margin-top:10px;display:flex;justify-content:space-between;font-size:11px;color:rgba(249,231,159,0.7);">
            <span>راوی: ${hadees.raawi}</span>
            <span>${hadees.kitab} — ${hadees.no}</span>
          </div>
        </div>
      </div>
    </div>`;
  }
};
