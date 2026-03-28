/**
 * PakNikahPoint — Database Layer
 * Uses localStorage for offline + Google Sheets sync via GAS
 */

const PNP_DB = {
  version: '2.0',
  KEYS: {
    BOYS:'pnp_boys', GIRLS:'pnp_girls', MATCHES:'pnp_matches',
    SETTINGS:'pnp_settings', COUNTER_B:'pnp_cb', COUNTER_G:'pnp_cg',
  },

  getSettings() {
    const d=localStorage.getItem(this.KEYS.SETTINGS);
    return d?JSON.parse(d):{bureauName:'PakNikahPoint',city:'Karachi',phone:'',email:'',gasUrl:'',driveFolder:''};
  },
  saveSettings(obj){localStorage.setItem(this.KEYS.SETTINGS,JSON.stringify(obj));},

  // PNP Code — 9999999 تک لامحدود
  _fmt(n){
    return String(n).padStart(6,'0'); // ہمیشہ 6 ہندسے: 000001
  },
  nextBoyId(){
    // ہمیشہ actual data گن کر code بنائیں
    const n = this.getBoys().length + 1;
    return 'L-' + this._fmt(n);
  },
  nextGirlId(){
    const n = this.getGirls().length + 1;
    return 'G-' + this._fmt(n);
  },
  previewBoyId(){
    const n = this.getBoys().length + 1;
    return 'L-' + this._fmt(n);
  },
  previewGirlId(){
    const n = this.getGirls().length + 1;
    return 'G-' + this._fmt(n);
  },

  getBoys(){const d=localStorage.getItem(this.KEYS.BOYS);return d?JSON.parse(d):[];},
  saveBoys(arr){localStorage.setItem(this.KEYS.BOYS,JSON.stringify(arr));},
  addBoy(p){
    p.pnpCode=this.nextBoyId();
    p.gender='boy';
    p.registeredAt=new Date().toISOString();
    p.status='active';
    // base64 تصویر localStorage میں save نہ کریں — صرف Drive URL رکھیں
    if(p.photo && p.photo.startsWith('data:')) {
      p._photoBase64 = p.photo; // GAS بھیجنے کے لیے
      p.photo = ''; // localStorage میں خالی رکھیں
    }
    const a=this.getBoys();a.push(p);this.saveBoys(a);return p;
  },
  updateBoy(code,u){const a=this.getBoys();const i=a.findIndex(b=>b.pnpCode===code);if(i>=0){a[i]={...a[i],...u};this.saveBoys(a);}},
  deleteBoy(code){this.saveBoys(this.getBoys().filter(b=>b.pnpCode!==code));},
  getBoyById(code){return this.getBoys().find(b=>b.pnpCode===code);},

  getGirls(){const d=localStorage.getItem(this.KEYS.GIRLS);return d?JSON.parse(d):[];},
  saveGirls(arr){localStorage.setItem(this.KEYS.GIRLS,JSON.stringify(arr));},
  addGirl(p){
    p.pnpCode=this.nextGirlId();
    p.gender='girl';
    p.registeredAt=new Date().toISOString();
    p.status='active';
    // base64 تصویر localStorage میں save نہ کریں
    if(p.photo && p.photo.startsWith('data:')) {
      p._photoBase64 = p.photo;
      p.photo = '';
    }
    const a=this.getGirls();a.push(p);this.saveGirls(a);return p;
  },
  updateGirl(code,u){const a=this.getGirls();const i=a.findIndex(g=>g.pnpCode===code);if(i>=0){a[i]={...a[i],...u};this.saveGirls(a);}},
  deleteGirl(code){this.saveGirls(this.getGirls().filter(g=>g.pnpCode!==code));},
  getGirlById(code){return this.getGirls().find(g=>g.pnpCode===code);},

  getProfileByCode(code){
    if(code.startsWith('L-'))return this.getBoyById(code);
    if(code.startsWith('G-'))return this.getGirlById(code);
    return null;
  },
  deleteProfile(code){
    if(code.startsWith('L-'))this.deleteBoy(code);
    else this.deleteGirl(code);
    // Google Sheet سے بھی delete کریں
    this.deleteFromGAS(code);
  },

  async deleteFromGAS(code){
    const s = this.getSettings();
    if(!s.gasUrl) return;
    try{
      // GET method سے delete کریں — no-cors کے ساتھ بھی کام کرے گا
      const url = s.gasUrl + '?action=deleteProfile&pnpCode=' + encodeURIComponent(code);
      await fetch(url, {mode:'no-cors'});
      // POST بھی بھیجیں backup کے طور پر
      await fetch(s.gasUrl, {
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain'},
        body: JSON.stringify({action:'deleteProfile', pnpCode:code})
      });
      console.log('✅ GAS سے delete بھیجا گیا:', code);
    }catch(e){
      console.error('❌ GAS delete error:', e.message);
    }
  },

  getMatches(){const d=localStorage.getItem(this.KEYS.MATCHES);return d?JSON.parse(d):[];},
  saveMatch(boyCode,girlCode,score,breakdown){
    const matches=this.getMatches();
    const ei=matches.findIndex(m=>m.boyCode===boyCode&&m.girlCode===girlCode);
    const match={boyCode,girlCode,score,breakdown,savedAt:new Date().toISOString()};
    if(ei>=0)matches[ei]=match;else matches.unshift(match);
    localStorage.setItem(this.KEYS.MATCHES,JSON.stringify(matches.slice(0,200)));
    return match;
  },

  calculateScore(boy,girl){
    const b={};let t=0;
    const city=boy.city&&girl.city&&boy.city.toLowerCase()===girl.city.toLowerCase()?10:0;
    b['City']=city;t+=city;
    const ba=parseInt(boy.age)||0,ga=parseInt(girl.age)||0,diff=Math.abs(ba-ga);
    const age=diff<=2?10:diff<=4?8:diff<=6?6:diff<=8?4:diff<=10?2:0;
    b['Age']=age;t+=age;
    const eR={'Matric':1,'Intermediate':2,'Graduate':3,'Masters':4,'PhD':5,'Hafiz/Hafiza':2,'Alim/Alima':3};
    const bE=eR[boy.education]||0,gE=eR[girl.education]||0;
    const edu=bE===gE?10:Math.abs(bE-gE)===1?7:Math.abs(bE-gE)===2?4:2;
    b['Education']=edu;t+=edu;
    const relEdu=boy.religiousEducation&&girl.religiousEducation&&boy.religiousEducation===girl.religiousEducation?10:(boy.religiousEducation&&girl.religiousEducation?5:2);
    b['Religious Edu']=relEdu;t+=relEdu;
    const caste=boy.caste&&girl.caste&&boy.caste.toLowerCase()===girl.caste.toLowerCase()?10:(boy.caste||girl.caste?4:6);
    b['Caste']=caste;t+=caste;
    const sect=boy.sect&&girl.sect&&boy.sect.toLowerCase()===girl.sect.toLowerCase()?10:0;
    b['Sect']=sect;t+=sect;
    const ms=(boy.maritalStatus==='Single/Never Married'&&girl.maritalStatus==='Single/Never Married')?10:(boy.maritalStatus===girl.maritalStatus?8:4);
    b['Marital Status']=ms;t+=ms;
    const pR={'Doctor':5,'Engineer':5,'Teacher':4,'Business':4,'Govt Job':4,'IT/Tech':5,'Lawyer':5};
    const bP=pR[boy.profession]||2,gP=pR[girl.profession]||2;
    const prof=boy.profession===girl.profession?10:Math.abs(bP-gP)<=1?8:5;
    b['Profession']=prof;t+=prof;
    const res=boy.residence&&girl.residence&&boy.residence.toLowerCase()===girl.residence.toLowerCase()?10:(boy.residence&&girl.residence?5:3);
    b['Residence']=res;t+=res;
    const bH=parseInt((boy.height||'0').replace(/[^0-9]/g,''))||0;
    const gH=parseInt((girl.height||'0').replace(/[^0-9]/g,''))||0;
    let hs=5;if(bH>0&&gH>0){const hd=bH-gH;hs=hd>=2&&hd<=12?10:hd>=0&&hd<2?7:hd>12?5:3;}
    b['Height']=hs;t+=hs;
    return{score:Math.min(t,100),breakdown:b};
  },

  findTopMatches(pnpCode,gender,limit=5){
    const profiles=gender==='boy'?this.getBoys():this.getGirls();
    const subject=profiles.find(p=>p.pnpCode===pnpCode);
    if(!subject)return[];
    const opposites=gender==='boy'?this.getGirls():this.getBoys();
    return opposites.filter(p=>p.status==='active').map(p=>{
      const boy=gender==='boy'?subject:p,girl=gender==='boy'?p:subject;
      const{score,breakdown}=this.calculateScore(boy,girl);
      return{profile:p,score,breakdown};
    }).sort((a,b)=>b.score-a.score).slice(0,limit);
  },

  search(filters){
    const all=[...this.getBoys(),...this.getGirls()];
    return all.filter(p=>{
      if(filters.gender&&filters.gender!=='all'&&p.gender!==filters.gender)return false;
      if(filters.city&&!p.city?.toLowerCase().includes(filters.city.toLowerCase()))return false;
      if(filters.caste&&!p.caste?.toLowerCase().includes(filters.caste.toLowerCase()))return false;
      if(filters.education&&p.education!==filters.education)return false;
      if(filters.sect&&p.sect!==filters.sect)return false;
      if(filters.maritalStatus&&p.maritalStatus!==filters.maritalStatus)return false;
      if(filters.complexion&&p.complexion!==filters.complexion)return false;
      if(filters.disability&&filters.disability!=='all'&&p.disability!==filters.disability)return false;
      if(filters.religion&&p.religion!==filters.religion)return false;
      if(filters.minAge&&parseInt(p.age)<parseInt(filters.minAge))return false;
      if(filters.maxAge&&parseInt(p.age)>parseInt(filters.maxAge))return false;
      if(filters.query){const q=filters.query.toLowerCase();if(!p.name?.toLowerCase().includes(q)&&!p.pnpCode?.toLowerCase().includes(q)&&!p.city?.toLowerCase().includes(q))return false;}
      return true;
    });
  },

  quickSearch(query){
    if(!query||query.length<2)return[];
    const q=query.toLowerCase();
    return[...this.getBoys(),...this.getGirls()].filter(p=>
      p.name?.toLowerCase().includes(q)||p.pnpCode?.toLowerCase().includes(q)||
      p.city?.toLowerCase().includes(q)||p.caste?.toLowerCase().includes(q)
    ).slice(0,10);
  },

  // تصویر compress کریں — localStorage کے لیے
  _compressPhoto(dataUrl){
    try{
      const img = new Image();
      img.src = dataUrl;
      const canvas = document.createElement('canvas');
      const MAX = 300; // زیادہ سے زیادہ 300px
      let w = img.width || 300;
      let h = img.height || 300;
      if(w > MAX){ h = Math.round(h * MAX / w); w = MAX; }
      if(h > MAX){ w = Math.round(w * MAX / h); h = MAX; }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', 0.6); // 60% quality
    }catch(e){
      return dataUrl;
    }
  },

  exportAll(){return{boys:this.getBoys(),girls:this.getGirls(),matches:this.getMatches(),exportedAt:new Date().toISOString(),version:this.version};},

  // ═══ Google Sheets سے data لائیں ═══
  async fetchFromGAS(){
    const s = this.getSettings();
    if(!s.gasUrl) return {ok:false, msg:'GAS URL نہیں ہے'};
    try{
      // لڑکے لائیں
      const bRes = await fetch(s.gasUrl + '?action=getAllBoys');
      const bData = await bRes.json();
      if(bData.status==='ok' && bData.profiles){
        this.saveBoys(bData.profiles);
      }
      // لڑکیاں لائیں
      const gRes = await fetch(s.gasUrl + '?action=getAllGirls');
      const gData = await gRes.json();
      if(gData.status==='ok' && gData.profiles){
        this.saveGirls(gData.profiles);
      }
      const total = (bData.profiles||[]).length + (gData.profiles||[]).length;
      console.log('✅ Google Sheets سے data آ گیا:', total, 'profiles');
      return {ok:true, boys:(bData.profiles||[]).length, girls:(gData.profiles||[]).length};
    }catch(e){
      console.error('❌ GAS fetch error:', e.message);
      return {ok:false, msg:e.message};
    }
  },
  importAll(data){if(data.boys)this.saveBoys(data.boys);if(data.girls)this.saveGirls(data.girls);if(data.matches)localStorage.setItem(this.KEYS.MATCHES,JSON.stringify(data.matches));},

  async syncToGAS(profile){
    const s=this.getSettings();
    if(!s.gasUrl)return{ok:false,msg:'GAS URL not configured'};
    try{
      // تصویر compress کریں بھیجنے سے پہلے
      let profileToSend = Object.assign({},profile);
      // _photoBase64 ہو تو وہ بھیجیں (نئی تصویر)
      const photoSource = profileToSend._photoBase64 || profileToSend.photo;
      if(photoSource && photoSource.startsWith('data:')){
        profileToSend.photo = await this._compressForUpload(photoSource);
      }
      delete profileToSend._photoBase64;
      const payload = JSON.stringify({action:'addProfile',profile:profileToSend});
      // POST بھیجیں
      fetch(s.gasUrl,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain'},
        body:payload
      });
      console.log('✅ GAS sync بھیجا:',profile.pnpCode);
      return{ok:true};
    }catch(e){
      console.error('❌ GAS sync error:',e.message);
      return{ok:false,msg:e.message};
    }
  },

  // تصویر Drive upload کے لیے compress کریں
  _compressForUpload(dataUrl){
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let w = img.width, h = img.height;
        if(w>h){if(w>MAX){h=Math.round(h*MAX/w);w=MAX;}}
        else{if(h>MAX){w=Math.round(w*MAX/h);h=MAX;}}
        canvas.width=w; canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',0.7));
      };
      img.onerror=()=>resolve(dataUrl);
      img.src=dataUrl;
    });
  },

  async syncAllToGAS(){
    const s=this.getSettings();
    if(!s.gasUrl)return{ok:false,msg:'GAS URL not configured'};
    const boys=this.getBoys();
    const girls=this.getGirls();
    try{
      const payload = JSON.stringify({action:'syncAll',boys,girls});
      fetch(s.gasUrl,{
        method:'POST',
        mode:'no-cors',
        headers:{'Content-Type':'text/plain'},
        body:payload
      });
      console.log('✅ مکمل sync:',boys.length,'لڑکے،',girls.length,'لڑکیاں');
      return{ok:true,msg:boys.length+' لڑکے اور '+girls.length+' لڑکیاں sync ہو گئے'};
    }catch(e){
      return{ok:false,msg:e.message};
    }
  },

  seedSampleData(){
    if(this.getBoys().length>0||this.getGirls().length>0)return;
    const boys=[
      {name:'Ali Hassan',age:'28',city:'Karachi',education:'Masters',religiousEducation:'Basic Islamic',profession:'IT/Tech',maritalStatus:'Single/Never Married',caste:'Syed',sect:'Sunni',residence:'Urban',height:"5'10\"",weight:'72 kg',complexion:'Fair',religion:'Islam',disability:'None',disease:'None',addiction:'None',photo:'',fatherName:'Hasan Ali',fatherProfession:'Business',motherName:'Zainab Hasan'},
      {name:'Muhammad Umar',age:'30',city:'Lahore',education:'Graduate',religiousEducation:'Hafiz',profession:'Doctor',maritalStatus:'Single/Never Married',caste:'Ansari',sect:'Sunni',residence:'Urban',height:"5'8\"",weight:'75 kg',complexion:'Wheat',religion:'Islam',disability:'None',disease:'None',addiction:'None',photo:'',fatherName:'Umar Farooq',fatherProfession:'Govt Job',motherName:'Salma Umar'},
      {name:'Bilal Ahmed',age:'26',city:'Islamabad',education:'Graduate',religiousEducation:'Basic Islamic',profession:'Engineer',maritalStatus:'Single/Never Married',caste:'Pathan',sect:'Sunni',residence:'Urban',height:"6'0\"",weight:'80 kg',complexion:'Fair',religion:'Islam',disability:'None',disease:'None',addiction:'None',photo:'',fatherName:'Ahmed Khan',fatherProfession:'Retired Army',motherName:'Nadia Ahmed'},
    ];
    const girls=[
      {name:'Fatima Zahra',age:'25',city:'Karachi',education:'Masters',religiousEducation:'Basic Islamic',profession:'Teacher',maritalStatus:'Single/Never Married',caste:'Syed',sect:'Sunni',residence:'Urban',height:"5'4\"",weight:'55 kg',complexion:'Fair',religion:'Islam',disability:'None',disease:'None',addiction:'None',photo:'',fatherName:'Zahra Hussain',fatherProfession:'Business',motherName:'Maryam Zahra'},
      {name:'Ayesha Malik',age:'24',city:'Lahore',education:'Graduate',religiousEducation:'Hafiz',profession:'Doctor',maritalStatus:'Single/Never Married',caste:'Ansari',sect:'Sunni',residence:'Urban',height:"5'3\"",weight:'52 kg',complexion:'Fair',religion:'Islam',disability:'None',disease:'None',addiction:'None',photo:'',fatherName:'Malik Tufail',fatherProfession:'Govt Job',motherName:'Rukhsana Malik'},
      {name:'Hina Butt',age:'27',city:'Islamabad',education:'Masters',religiousEducation:'Basic Islamic',profession:'IT/Tech',maritalStatus:'Single/Never Married',caste:'Butt',sect:'Sunni',residence:'Urban',height:"5'5\"",weight:'58 kg',complexion:'Wheat',religion:'Islam',disability:'None',disease:'None',addiction:'None',photo:'',fatherName:'Butt Sahab',fatherProfession:'Business',motherName:'Farida Butt'},
    ];
    boys.forEach(b=>this.addBoy({...b}));
    girls.forEach(g=>this.addGirl({...g}));
  }
};
