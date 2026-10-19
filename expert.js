(function () {
  "use strict";

  const api = window.JyotishAllInOne;
  if (!api) return;

  const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const CLASSICAL = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const GU_TO_KEY = { "સૂર્ય":"Sun", "ચંદ્ર":"Moon", "મંગળ":"Mars", "બુધ":"Mercury", "ગુરુ":"Jupiter", "શુક્ર":"Venus", "શનિ":"Saturn", "રાહુ":"Rahu", "કેતુ":"Ketu" };
  const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const DASHA_YEARS = { Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17 };
  const EXALT = { Sun:0, Moon:1, Mars:9, Mercury:5, Jupiter:3, Venus:11, Saturn:6 };
  const DEBIL = { Sun:6, Moon:7, Mars:3, Mercury:11, Jupiter:9, Venus:5, Saturn:0 };
  const OWN = { Sun:[4], Moon:[3], Mars:[0,7], Mercury:[2,5], Jupiter:[8,11], Venus:[1,6], Saturn:[9,10] };
  const SIGN_NAMES = {
    gu:["મેષ","વૃષભ","મિથુન","કર્ક","સિંહ","કન્યા","તુલા","વૃશ્ચિક","ધન","મકર","કુંભ","મીન"],
    hi:["मेष","वृषभ","मिथुन","कर्क","सिंह","कन्या","तुला","वृश्चिक","धनु","मकर","कुंभ","मीन"],
    en:["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
  };
  const PLANET_NAMES = {
    gu:{Sun:"સૂર્ય",Moon:"ચંદ્ર",Mars:"મંગળ",Mercury:"બુધ",Jupiter:"ગુરુ",Venus:"શુક્ર",Saturn:"શનિ",Rahu:"રાહુ",Ketu:"કેતુ"},
    hi:{Sun:"सूर्य",Moon:"चंद्र",Mars:"मंगल",Mercury:"बुध",Jupiter:"गुरु",Venus:"शुक्र",Saturn:"शनि",Rahu:"राहु",Ketu:"केतु"},
    en:{Sun:"Sun",Moon:"Moon",Mars:"Mars",Mercury:"Mercury",Jupiter:"Jupiter",Venus:"Venus",Saturn:"Saturn",Rahu:"Rahu",Ketu:"Ketu"}
  };
  const SHORT = {
    gu:{Sun:"સૂ",Moon:"ચં",Mars:"મં",Mercury:"બુ",Jupiter:"ગુ",Venus:"શુ",Saturn:"શ",Rahu:"રા",Ketu:"કે"},
    hi:{Sun:"सू",Moon:"चं",Mars:"मं",Mercury:"बु",Jupiter:"गु",Venus:"शु",Saturn:"श",Rahu:"रा",Ketu:"के"},
    en:{Sun:"Su",Moon:"Mo",Mars:"Ma",Mercury:"Me",Jupiter:"Ju",Venus:"Ve",Saturn:"Sa",Rahu:"Ra",Ketu:"Ke"}
  };

  const VARGAS = [
    {n:1,key:"D1",gu:"રાશિ",hi:"राशि",en:"Rasi",guUse:"મૂળ જીવનરચના",hiUse:"मूल जीवन संरचना",enUse:"overall life pattern",weight:3.5},
    {n:2,key:"D2",gu:"હોરા",hi:"होरा",en:"Hora",guUse:"ધન અને સંસાધન",hiUse:"धन और संसाधन",enUse:"wealth and resources",weight:1},
    {n:3,key:"D3",gu:"દ્રેકાણ",hi:"द्रेक्काण",en:"Drekkana",guUse:"પરાક્રમ અને સહોદર",hiUse:"पराक्रम और भाई-बहन",enUse:"courage and siblings",weight:1},
    {n:4,key:"D4",gu:"ચતુર્થાંશ",hi:"चतुर्थांश",en:"Chaturthamsa",guUse:"મિલકત અને ભાગ્ય",hiUse:"संपत्ति और भाग्य",enUse:"property and fortune",weight:.5},
    {n:7,key:"D7",gu:"સપ્તમાંશ",hi:"सप्तमांश",en:"Saptamsa",guUse:"સંતાન અને સર્જન",hiUse:"संतान और सृजन",enUse:"children and continuity",weight:.5},
    {n:9,key:"D9",gu:"નવાંશ",hi:"नवांश",en:"Navamsa",guUse:"લગ્ન, ધર્મ અને આંતરિક બળ",hiUse:"विवाह, धर्म और आंतरिक बल",enUse:"marriage, dharma and inner strength",weight:3},
    {n:10,key:"D10",gu:"દશાંશ",hi:"दशांश",en:"Dasamsa",guUse:"કારકિર્દી અને પદ",hiUse:"करियर और पद",enUse:"career and status",weight:.5},
    {n:12,key:"D12",gu:"દ્વાદશાંશ",hi:"द्वादशांश",en:"Dwadasamsa",guUse:"માતા-પિતા અને વંશ",hiUse:"माता-पिता और वंश",enUse:"parents and lineage",weight:.5},
    {n:16,key:"D16",gu:"ષોડશાંશ",hi:"षोडशांश",en:"Shodasamsa",guUse:"વાહન, સુખ અને સુવિધા",hiUse:"वाहन, सुख और सुविधा",enUse:"vehicles, comfort and conveniences",weight:2},
    {n:20,key:"D20",gu:"વિંશાંશ",hi:"विंशांश",en:"Vimsamsa",guUse:"સાધના અને આધ્યાત્મિકતા",hiUse:"साधना और आध्यात्मिकता",enUse:"spiritual practice",weight:.5},
    {n:24,key:"D24",gu:"ચતુર્વિંશાંશ",hi:"चतुर्विंशांश",en:"Chaturvimsamsa",guUse:"શિક્ષણ અને જ્ઞાન",hiUse:"शिक्षा और ज्ञान",enUse:"education and learning",weight:.5},
    {n:27,key:"D27",gu:"ભાંશ",hi:"भांश",en:"Bhamsa",guUse:"આંતરિક શક્તિ અને નબળાઈ",hiUse:"आंतरिक शक्ति और कमजोरी",enUse:"inner strength and weakness",weight:.5},
    {n:30,key:"D30",gu:"ત્રિંશાંશ",hi:"त्रिंशांश",en:"Trimsamsa",guUse:"પડકાર અને સંભાળ",hiUse:"चुनौती और सावधानी",enUse:"challenges and vulnerabilities",weight:1},
    {n:40,key:"D40",gu:"ખવેદાંશ",hi:"खवेदांश",en:"Khavedamsa",guUse:"માતૃવંશીય સંસ્કાર",hiUse:"मातृवंशीय संस्कार",enUse:"maternal lineage patterns",weight:.5},
    {n:45,key:"D45",gu:"અક્ષવેદાંશ",hi:"अक्षवेदांश",en:"Akshavedamsa",guUse:"પિતૃવંશીય સંસ્કાર",hiUse:"पितृवंशीय संस्कार",enUse:"paternal lineage patterns",weight:.5},
    {n:60,key:"D60",gu:"ષષ્ટિઅંશ",hi:"षष्ट्यंश",en:"Shashtiamsa",guUse:"સૂક્ષ્મ કર્મસંકેત",hiUse:"सूक्ष्म कर्म संकेत",enUse:"subtle karmic indications",weight:4}
  ];

  const NATURAL = {
    Sun:{friend:["Moon","Mars","Jupiter"],enemy:["Venus","Saturn"]},
    Moon:{friend:["Sun","Mercury"],enemy:[]},
    Mars:{friend:["Sun","Moon","Jupiter"],enemy:["Mercury"]},
    Mercury:{friend:["Sun","Venus"],enemy:["Moon"]},
    Jupiter:{friend:["Sun","Moon","Mars"],enemy:["Mercury","Venus"]},
    Venus:{friend:["Mercury","Saturn"],enemy:["Sun","Moon"]},
    Saturn:{friend:["Mercury","Venus"],enemy:["Sun","Moon"]}
  };

  const DOMAINS = [
    {key:"self",houses:[1],varga:"D1",planets:["Sun","Moon"],gu:"વ્યક્તિત્વ અને જીવનશક્તિ",hi:"व्यक्तित्व और जीवनशक्ति",en:"Personality and vitality"},
    {key:"wealth",houses:[2,11],varga:"D2",planets:["Jupiter","Venus","Mercury"],gu:"ધન, આવક અને બચત",hi:"धन, आय और बचत",en:"Wealth, income and savings"},
    {key:"education",houses:[4,5],varga:"D24",planets:["Mercury","Jupiter"],gu:"શિક્ષણ અને જ્ઞાન",hi:"शिक्षा और ज्ञान",en:"Education and learning"},
    {key:"career",houses:[6,10,11],varga:"D10",planets:["Sun","Mercury","Saturn"],gu:"કારકિર્દી અને પ્રતિષ્ઠા",hi:"करियर और प्रतिष्ठा",en:"Career and reputation"},
    {key:"business",houses:[3,7,10,11],varga:"D10",planets:["Mercury","Mars","Saturn"],gu:"વ્યવસાય અને સ્વરોજગાર",hi:"व्यवसाय और स्वरोजगार",en:"Business and enterprise"},
    {key:"property",houses:[4,11],varga:"D4",planets:["Mars","Venus"],gu:"મિલકત અને ઘર",hi:"संपत्ति और घर",en:"Property and home"},
    {key:"marriage",houses:[2,7,11],varga:"D9",planets:["Venus","Jupiter"],gu:"લગ્ન અને સંબંધ",hi:"विवाह और संबंध",en:"Marriage and relationships"},
    {key:"children",houses:[5,9],varga:"D7",planets:["Jupiter","Moon"],gu:"સંતાન અને સર્જન",hi:"संतान और सृजन",en:"Children and creativity"},
    {key:"health",houses:[1,6,8],varga:"D30",planets:["Sun","Mars","Saturn"],gu:"આરોગ્યની દિનચર્યા",hi:"स्वास्थ्य की दिनचर्या",en:"Health routine"},
    {key:"foreign",houses:[9,12],varga:"D12",planets:["Rahu","Moon"],gu:"વિદેશ અને લાંબી યાત્રા",hi:"विदेश और लंबी यात्रा",en:"Foreign links and long travel"},
    {key:"spiritual",houses:[5,9,12],varga:"D20",planets:["Jupiter","Ketu"],gu:"સાધના અને આધ્યાત્મિકતા",hi:"साधना और आध्यात्मिकता",en:"Spiritual practice"},
    {key:"comfort",houses:[4,11],varga:"D16",planets:["Venus","Moon"],gu:"વાહન અને સુખસગવડ",hi:"वाहन और सुख-सुविधा",en:"Vehicles and comforts"}
  ];

  const REMEDIES = {
    Sun:{gu:"નિયમિતતા, પિતૃમાન અને સવારે સૂર્યપ્રકાશમાં થોડો સમય.",hi:"नियमितता, पिता का सम्मान और सुबह सूर्यप्रकाश में कुछ समय।",en:"Practise consistency, honour father figures and spend a little time in morning sunlight."},
    Moon:{gu:"ઊંઘની નિયમિતતા, માતૃમાન અને લાગણી લખવાની ટેવ.",hi:"नींद की नियमितता, माता का सम्मान और भावनाएं लिखने की आदत।",en:"Keep sleep regular, honour maternal figures and journal emotions."},
    Mars:{gu:"નિયમિત કસરત, ઉતાવળ પહેલાં વિરામ અને સેવા દ્વારા ઊર્જાનો યોગ્ય ઉપયોગ.",hi:"नियमित व्यायाम, जल्दबाजी से पहले विराम और सेवा में ऊर्जा का उपयोग।",en:"Use energy through exercise and service, and pause before impulsive action."},
    Mercury:{gu:"લેખન, ગણતરી, સ્પષ્ટ સંવાદ અને અધૂરી માહિતી પર નિર્ણય ન લેવો.",hi:"लेखन, गणना, स्पष्ट संवाद और अधूरी जानकारी पर निर्णय न लेना।",en:"Use writing, calculation and clear communication; avoid decisions on incomplete information."},
    Jupiter:{gu:"અભ્યાસ, સારા માર્ગદર્શકનો સન્માન અને જ્ઞાનનું દાન.",hi:"अध्ययन, अच्छे मार्गदर्शक का सम्मान और ज्ञान का दान।",en:"Study consistently, respect sound mentors and share useful knowledge."},
    Venus:{gu:"સંબંધમાં આદર, સ્વચ્છતા, કલા અને ખર્ચમાં સંતુલન.",hi:"संबंध में सम्मान, स्वच्छता, कला और खर्च में संतुलन।",en:"Cultivate respect in relationships, cleanliness, art and balanced spending."},
    Saturn:{gu:"ધીરજ, સમયપાલન, શ્રમજીવી પ્રત્યે સન્માન અને લાંબાગાળાની શિસ્ત.",hi:"धैर्य, समयपालन, श्रमिकों का सम्मान और दीर्घकालीन अनुशासन।",en:"Build patience, punctuality, respect for workers and long-term discipline."},
    Rahu:{gu:"અફવા અને અતિરેકથી અંતર, દસ્તાવેજ ચકાસણી અને ટેક્નોલોજીનો સંયમિત ઉપયોગ.",hi:"अफवाह और अतिरेक से दूरी, दस्तावेज जांच और तकनीक का संयमित उपयोग।",en:"Avoid hype, verify documents and use technology with restraint."},
    Ketu:{gu:"ધ્યાન, અધૂરું કામ પૂર્ણ કરવું અને નિરર્થક વિમુખતા ટાળવી.",hi:"ध्यान, अधूरे काम पूरे करना और निरर्थक विरक्ति से बचना।",en:"Meditate, finish incomplete work and avoid unhelpful withdrawal."}
  };

  Object.assign(api.copy.gu, {
    secondsLabel:"સેકન્ડ", nodeModeLabel:"રાહુ–કેતુ ગણતરી", meanNode:"Mean Node — પરંપરાગત ડિફૉલ્ટ", trueNode:"True Node — તત્કાલ ગતિ આધારિત", tabExpert:"અંતિમ તારણ",
    profilesTitle:"સાચવેલી કુંડળીઓ", profilesDesc:"ઘણી વ્યક્તિઓના રિપોર્ટ આ બ્રાઉઝરમાં સાચવો અથવા backup લો.", chooseProfile:"કુંડળી પસંદ કરો", saveProfile:"હાલની કુંડળી સાચવો", loadProfile:"ખોલો", deleteProfile:"દૂર કરો", exportBackup:"Backup Download", importBackup:"Backup Import", installApp:"App Install", offlineMode:"Offline", updateReady:"નવી આવૃત્તિ તૈયાર છે.", refreshApp:"Update"
  });
  Object.assign(api.copy.hi, {
    secondsLabel:"सेकंड", nodeModeLabel:"राहु–केतु गणना", meanNode:"Mean Node — पारंपरिक डिफॉल्ट", trueNode:"True Node — तात्कालिक गति आधारित", tabExpert:"अंतिम निष्कर्ष",
    profilesTitle:"सहेजी गई कुंडलियां", profilesDesc:"कई व्यक्तियों की कुंडली इस ब्राउज़र में सहेजें या backup लें।", chooseProfile:"कुंडली चुनें", saveProfile:"वर्तमान कुंडली सहेजें", loadProfile:"खोलें", deleteProfile:"हटाएं", exportBackup:"Backup Download", importBackup:"Backup Import", installApp:"App Install", offlineMode:"Offline", updateReady:"नया संस्करण तैयार है।", refreshApp:"Update"
  });
  Object.assign(api.copy.en, {
    secondsLabel:"Seconds", nodeModeLabel:"Rahu–Ketu calculation", meanNode:"Mean Node — traditional default", trueNode:"True Node — instantaneous orbit", tabExpert:"Final synthesis",
    profilesTitle:"Saved charts", profilesDesc:"Keep multiple charts in this browser or download a backup.", chooseProfile:"Choose a chart", saveProfile:"Save current chart", loadProfile:"Open", deleteProfile:"Remove", exportBackup:"Download backup", importBackup:"Import backup", installApp:"Install App", offlineMode:"Offline", updateReady:"A new version is ready.", refreshApp:"Update"
  });

  function norm(value){return ((value%360)+360)%360;}
  function signOf(value){return Math.floor(norm(value)/30);}
  function degreeInSign(value){return norm(value)%30;}
  function clamp(value,min=0,max=100){return Math.max(min,Math.min(max,value));}
  function choose(lang,gu,hi,en){return lang==="hi"?hi:lang==="en"?en:gu;}
  function planetName(key,lang){return PLANET_NAMES[lang][key]||key;}
  function signName(index,lang){return SIGN_NAMES[lang][index];}
  function formatDate(date,lang){return new Intl.DateTimeFormat(lang==="hi"?"hi-IN":lang==="en"?"en-GB":"gu-IN",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"UTC"}).format(date);}
  function angularDistance(a,b){const d=Math.abs(norm(a)-norm(b));return Math.min(d,360-d);}

  function vargaSign(longitude,n){
    const sign=signOf(longitude),degree=degreeInSign(longitude),odd=sign%2===0;
    const movable=[0,3,6,9].includes(sign),fixed=[1,4,7,10].includes(sign);
    if(n===1)return sign;
    if(n===2)return odd?(degree<15?4:3):(degree<15?3:4);
    if(n===3)return (sign+Math.min(2,Math.floor(degree/10))*4)%12;
    if(n===4)return (sign+Math.min(3,Math.floor(degree/7.5))*3)%12;
    if(n===7)return ((odd?sign:sign+6)+Math.min(6,Math.floor(degree/(30/7))))%12;
    if(n===9)return signOf(norm(longitude*9));
    if(n===10)return (sign+Math.min(9,Math.floor(degree/3))+(odd?0:8))%12;
    if(n===12)return (sign+Math.min(11,Math.floor(degree/2.5)))%12;
    if(n===16)return ((movable?0:fixed?4:8)+Math.min(15,Math.floor(degree/(30/16))))%12;
    if(n===20)return ((movable?0:fixed?8:4)+Math.min(19,Math.floor(degree/1.5)))%12;
    if(n===24)return ((odd?4:3)+Math.min(23,Math.floor(degree/1.25)))%12;
    if(n===27){
      const start=[0,4,8].includes(sign)?0:[1,5,9].includes(sign)?3:[2,6,10].includes(sign)?6:9;
      return (start+Math.min(26,Math.floor(degree/(30/27))))%12;
    }
    if(n===30){
      if(odd){if(degree<5)return 0;if(degree<10)return 10;if(degree<18)return 8;if(degree<25)return 2;return 6;}
      if(degree<5)return 1;if(degree<12)return 5;if(degree<20)return 11;if(degree<25)return 9;return 7;
    }
    if(n===40)return ((odd?0:6)+Math.min(39,Math.floor(degree/.75)))%12;
    if(n===45)return ((movable?0:fixed?4:8)+Math.min(44,Math.floor(degree/(30/45))))%12;
    if(n===60){const part=Math.min(59,Math.floor(degree/.5));return odd?(sign+part)%12:(sign-part+120)%12;}
    return signOf(norm(longitude*n));
  }

  function dignity(key,sign){
    if(EXALT[key]===sign)return "exalted";
    if(DEBIL[key]===sign)return "debilitated";
    if((OWN[key]||[]).includes(sign))return "own";
    return "ordinary";
  }

  function naturalRelation(key,other){
    if(key===other)return "own";
    if(!NATURAL[key])return "neutral";
    if(NATURAL[key].friend.includes(other))return "friend";
    if(NATURAL[key].enemy.includes(other))return "enemy";
    return "neutral";
  }

  function buildVarga(chart,v){
    const ascSign=vargaSign(chart.siderealAsc,v.n),planets={};
    PLANETS.forEach((key)=>{const sign=vargaSign(chart.planets[key].longitude,v.n);planets[key]={sign,house:((sign-ascSign+12)%12)+1,dignity:dignity(key,sign)};});
    return {...v,ascSign,planets};
  }

  function vimshopaka(chart,vargas,key){
    if(!CLASSICAL.includes(key))return null;
    let score=0;
    const breakdown=[];
    VARGAS.forEach((v)=>{
      const sign=vargas[v.key].planets[key].sign, state=dignity(key,sign),lord=LORDS[sign];
      const relation=naturalRelation(key,lord);
      const factor=state==="exalted"?1:state==="own"?.9:state==="debilitated"?.1:relation==="friend"?.72:relation==="enemy"?.3:.5;
      const points=v.weight*factor;score+=points;breakdown.push({key:v.key,points,weight:v.weight,state,relation});
    });
    return {score:Number(score.toFixed(2)),max:20,breakdown};
  }

  function planetRoles(chart,key){
    const owned=[];
    for(let house=1;house<=12;house++)if(LORDS[(chart.ascSign+house-1)%12]===key)owned.push(house);
    const kendra=owned.some((h)=>[4,7,10].includes(h)),trine=owned.some((h)=>[5,9].includes(h));
    const badhakaHouse=[0,3,6,9].includes(chart.ascSign)?11:[1,4,7,10].includes(chart.ascSign)?9:7;
    const roles=[];
    if(key===LORDS[chart.ascSign])roles.push("lagnaLord");
    if(kendra&&trine)roles.push("yogakaraka");
    if(owned.some((h)=>[5,9].includes(h)))roles.push("trineLord");
    if(owned.some((h)=>[2,7].includes(h)))roles.push("marakaLink");
    if(owned.some((h)=>[6,8,12].includes(h)))roles.push("dusthanaLord");
    if(key===LORDS[(chart.ascSign+badhakaHouse-1)%12])roles.push("badhakaLord");
    return {owned,roles};
  }

  function temporaryRelation(chart,a,b){
    const distance=((chart.planets[b].sign-chart.planets[a].sign+12)%12)+1;
    return [2,3,4,10,11,12].includes(distance)?"friend":"enemy";
  }

  function compoundRelation(chart,a,b){
    const natural=naturalRelation(a,b),temporary=temporaryRelation(chart,a,b);
    if(natural==="own")return "greatFriend";
    if(temporary==="friend")return natural==="friend"?"greatFriend":natural==="neutral"?"friend":"neutral";
    return natural==="friend"?"neutral":natural==="neutral"?"enemy":"greatEnemy";
  }

  function balaadi(longitude){
    const sign=signOf(longitude),segment=Math.min(4,Math.floor(degreeInSign(longitude)/6));
    const order=["child","adolescent","youth","aged","dead"];
    return sign%2===0?order[segment]:order[4-segment];
  }

  function aspectTargets(house,key){
    const offsets=[6];
    if(key==="Mars")offsets.push(3,7);
    if(key==="Jupiter")offsets.push(4,8);
    if(key==="Saturn")offsets.push(2,9);
    return offsets.map((offset)=>((house-1+offset)%12)+1);
  }

  function closeConjunctions(chart){
    const candidates=["Mars","Mercury","Jupiter","Venus","Saturn"],rows=[];
    for(let i=0;i<candidates.length;i++)for(let j=i+1;j<candidates.length;j++){
      const a=candidates[i],b=candidates[j],distance=angularDistance(chart.planets[a].longitude,chart.planets[b].longitude);
      if(distance<=1)rows.push({a,b,distance});
    }
    return rows;
  }

  function houseSupport(chart,advanced,roles,house){
    const sign=(chart.ascSign+house-1)%12,lord=LORDS[sign],lordPlanet=chart.planets[lord];
    let score=45+(advanced.strengths[lord].score-50)*.28;
    if([1,4,5,7,9,10,11].includes(lordPlanet.house))score+=8;
    if([6,8,12].includes(lordPlanet.house))score-=7;
    if(dignity(lord,lordPlanet.sign)==="exalted"||dignity(lord,lordPlanet.sign)==="own")score+=8;
    if(dignity(lord,lordPlanet.sign)==="debilitated")score-=10;
    PLANETS.forEach((key)=>{
      if(chart.planets[key].house===house)score+=(key==="Jupiter"||key==="Venus"?6:key==="Mercury"||key==="Moon"?3:key==="Rahu"||key==="Ketu"?-3:-2);
      if(aspectTargets(chart.planets[key].house,key).includes(house))score+=(key==="Jupiter"?5:key==="Venus"||key==="Mercury"?2:key==="Saturn"||key==="Mars"?-2:0);
    });
    const sav=advanced.ashtakavarga.sav[sign];score+=(sav-28)*1.4;
    if(roles[lord].roles.includes("yogakaraka"))score+=6;
    return {house,sign,lord,score:Math.round(clamp(score)),sav,lordHouse:lordPlanet.house};
  }

  function currentDashaKey(chart){return GU_TO_KEY[chart.dasha.current.lord]||chart.dasha.current.lord;}

  function domainScores(chart,advanced,vargas,houses,roles){
    const maha=currentDashaKey(chart),antar=advanced.dashaDepth.currentAntar.lord;
    return DOMAINS.map((domain)=>{
      const houseScore=domain.houses.reduce((sum,h)=>sum+houses[h-1].score,0)/domain.houses.length;
      const planetScore=domain.planets.reduce((sum,key)=>sum+(advanced.strengths[key]?.score||50),0)/domain.planets.length;
      const data=vargas[domain.varga],vargaLord=LORDS[data.ascSign],vargaState=data.planets[vargaLord].dignity;
      let vargaScore=vargaState==="exalted"?82:vargaState==="own"?76:vargaState==="debilitated"?34:58;
      vargaScore+=(advanced.strengths[vargaLord].score-50)*.12;
      let timing=0;
      [maha,antar].forEach((key,index)=>{
        if(domain.planets.includes(key))timing+=index===0?7:5;
        const owned=roles[key]?.owned||[];
        if(owned.some((h)=>domain.houses.includes(h)))timing+=index===0?5:3;
      });
      const total=Math.round(clamp(houseScore*.48+planetScore*.27+vargaScore*.25+timing));
      const weakestHouse=[...domain.houses].sort((a,b)=>houses[a-1].score-houses[b-1].score)[0];
      const strongestPlanet=[...domain.planets].sort((a,b)=>(advanced.strengths[b]?.score||0)-(advanced.strengths[a]?.score||0))[0];
      const sensitivity=domain.varga==="D1"?false:false;
      return {...domain,score:total,houseScore:Math.round(houseScore),planetScore:Math.round(planetScore),vargaScore:Math.round(vargaScore),timing,weakestHouse,strongestPlanet,vargaLord,sensitivity};
    });
  }

  function jd(date){return date.getTime()/86400000+2440587.5;}
  function ayanamsha(date){return 23.85675+((jd(date)-2451545)/365.2425)*(50.290966/3600);}
  function ascendant(date,latitude,longitude){
    const t=(jd(date)-2451545)/36525,eps=(23.43929111-.013004167*t-.000000164*t*t)*Math.PI/180;
    const theta=norm(Astronomy.SiderealTime(date)*15+longitude)*Math.PI/180,phi=latitude*Math.PI/180;
    return norm(Math.atan2(-Math.cos(theta),Math.sin(theta)*Math.cos(eps)+Math.tan(phi)*Math.sin(eps))*180/Math.PI+180);
  }

  function birthTimeMatrix(chart){
    return [-10,-5,-2,-1,0,1,2,5,10].map((minutes)=>{
      const date=new Date(chart.date.getTime()+minutes*60000),sidereal=norm(ascendant(date,chart.input.latitude,chart.input.longitude)-ayanamsha(date));
      return {minutes,D1:vargaSign(sidereal,1),D9:vargaSign(sidereal,9),D10:vargaSign(sidereal,10),D60:vargaSign(sidereal,60)};
    });
  }

  function childrenOfPeriod(start,end,startLord){
    const periods=[],startIndex=DASHA_ORDER.indexOf(startLord),total=end-start;let cursor=new Date(start);
    for(let i=0;i<9;i++){
      const lord=DASHA_ORDER[(startIndex+i)%9],childEnd=i===8?new Date(end):new Date(cursor.getTime()+total*DASHA_YEARS[lord]/120);
      periods.push({lord,start:new Date(cursor),end:childEnd});cursor=childEnd;
    }
    return periods;
  }

  function dashaAt(chart,date){
    const period=chart.dasha.periods.find((p)=>date>=p.start&&date<p.end)||chart.dasha.periods[chart.dasha.periods.length-1];
    const key=GU_TO_KEY[period.lord]||period.lord,subPeriods=childrenOfPeriod(period.start,period.end,key);
    const sub=subPeriods.find((p)=>date>=p.start&&date<p.end)||subPeriods[subPeriods.length-1];
    return {period:key,sub:sub.lord};
  }

  function meanNode(date){const t=(jd(date)-2451545)/36525;return norm(125.04452-1934.136261*t+.0020708*t*t+t*t*t/450000);}
  function trueNode(date){
    const vec=[-.02,0,.02].map((days)=>Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body.Moon,new Date(date.getTime()+days*86400000),true)).vec);
    const [before,current,after]=vec,v={x:after.x-before.x,y:after.y-before.y,z:after.z-before.z};
    const h={x:current.y*v.z-current.z*v.y,y:current.z*v.x-current.x*v.z};
    return norm(Math.atan2(h.x,-h.y)*180/Math.PI);
  }
  function transitSign(key,date,nodeMode){
    const aya=ayanamsha(date);
    if(key==="Rahu")return signOf(norm((nodeMode==="true"?trueNode(date):meanNode(date))-aya));
    const vector=Astronomy.GeoVector(Astronomy.Body[key],date,true);
    return signOf(norm(Astronomy.Ecliptic(vector).elon-aya));
  }

  function timeline(chart,domains,roles){
    const nowYear=new Date().getUTCFullYear(),rows=[];
    for(let i=0;i<12;i++){
      const year=nowYear+i,date=new Date(Date.UTC(year,6,1,6)),dasha=dashaAt(chart,date);
      const j=((transitSign("Jupiter",date,chart.input.nodeMode)-chart.ascSign+12)%12)+1;
      const s=((transitSign("Saturn",date,chart.input.nodeMode)-chart.ascSign+12)%12)+1;
      const r=((transitSign("Rahu",date,chart.input.nodeMode)-chart.ascSign+12)%12)+1;
      const adjusted=domains.map((domain)=>{
        let value=domain.score;
        if(domain.houses.includes(j)||domain.houses.some((h)=>[5,7,9].includes(((h-j+12)%12)+1)))value+=7;
        if(domain.houses.includes(s))value+=[3,6,10,11].includes(s)?2:-5;
        if(domain.houses.includes(r))value+=2;
        [dasha.period,dasha.sub].forEach((key,index)=>{
          if(domain.planets.includes(key))value+=index===0?6:4;
          if((roles[key]?.owned||[]).some((h)=>domain.houses.includes(h)))value+=index===0?4:2;
        });
        return {domain,value:Math.round(clamp(value))};
      }).sort((a,b)=>b.value-a.value);
      rows.push({year,dasha,jupiter:j,saturn:s,rahu:r,best:adjusted[0],care:adjusted[adjusted.length-1]});
    }
    return rows;
  }

  function calculateExpert(chart,advanced){
    const vargas={};VARGAS.forEach((v)=>{vargas[v.key]=buildVarga(chart,v);});
    const roles={};PLANETS.forEach((key)=>{roles[key]=planetRoles(chart,key);});
    const vimshopaka={};CLASSICAL.forEach((key)=>{vimshopaka[key]=vimshopakaScore(chart,vargas,key);});
    const houses=Array.from({length:12},(_,i)=>houseSupport(chart,advanced,roles,i+1));
    const domains=domainScores(chart,advanced,vargas,houses,roles);
    return {vargas,roles,vimshopaka,houses,domains,timeMatrix:birthTimeMatrix(chart),timeline:timeline(chart,domains,roles),warCandidates:closeConjunctions(chart)};
  }

  function vimshopakaScore(chart,vargas,key){return vimshopaka(chart,vargas,key);}

  function strengthTone(score,lang){
    if(score>=75)return choose(lang,"ખૂબ મજબૂત","बहुत मजबूत","Very strong");
    if(score>=62)return choose(lang,"મજબૂત","मजबूत","Strong");
    if(score>=47)return choose(lang,"મિશ્ર–મધ્યમ","मिश्रित–मध्यम","Mixed–moderate");
    return choose(lang,"વધુ સંભાળ જરૂરી","अधिक ध्यान आवश्यक","Needs support");
  }

  function roleLabel(code,lang){
    const labels={
      lagnaLord:["લગ્નેશ","लग्नेश","Ascendant lord"],yogakaraka:["યોગકારક","योगकारक","Yogakaraka"],trineLord:["ત્રિકોણેશ","त्रिकोणेश","Trinal lord"],marakaLink:["મારક ભાવ સંબંધ","मारक भाव संबंध","Maraka-house link"],dusthanaLord:["દુઃસ્થાન સ્વામી","दुःस्थान स्वामी","Dusthana lord"],badhakaLord:["બાધકેશ","बाधकेश","Badhaka lord"]
    };
    const x=labels[code]||[code,code,code];return x[lang==="gu"?0:lang==="hi"?1:2];
  }

  function relationLabel(code,lang){
    const labels={
      greatFriend:["અતિમિત્ર","अधिमित्र","Great friend"],
      friend:["મિત્ર","मित्र","Friend"],
      neutral:["સમ","सम","Neutral"],
      enemy:["શત્રુ","शत्रु","Enemy"],
      greatEnemy:["અતિશત્રુ","अधिशत्रु","Great enemy"]
    };
    const x=labels[code]||[code,code,code];return x[lang==="gu"?0:lang==="hi"?1:2];
  }

  function dignityLabel(state,lang){
    const labels={exalted:["ઉચ્ચ","उच्च","Exalted"],own:["સ્વરાશિ","स्वराशि","Own sign"],debilitated:["નીચ","नीच","Debilitated"],ordinary:["સામાન્ય","सामान्य","Ordinary"]};
    const x=labels[state]||labels.ordinary;return x[lang==="gu"?0:lang==="hi"?1:2];
  }

  function avasthaLabel(state,lang){
    const labels={child:["બાલ","बाल","Child"],adolescent:["કુમાર","कुमार","Adolescent"],youth:["યુવા","युवा","Youth"],aged:["વૃદ્ધ","वृद्ध","Aged"],dead:["મૃત","मृत","Dormant"]};
    const x=labels[state];return x[lang==="gu"?0:lang==="hi"?1:2];
  }

  function vargaChart(data,lang){
    const occupants=Array.from({length:12},()=>[]);PLANETS.forEach((key)=>occupants[data.planets[key].sign].push(SHORT[lang][key]));
    const positions={11:[1,1],0:[1,2],1:[1,3],2:[1,4],10:[2,1],3:[2,4],9:[3,1],4:[3,4],8:[4,1],7:[4,2],6:[4,3],5:[4,4]};
    const cells=Object.entries(positions).map(([sign,pos])=>{const s=Number(sign),[row,col]=pos;return `<div class="chart-cell ${s===data.ascSign?"lagna":""}" style="grid-row:${row};grid-column:${col}"><strong>${signName(s,lang)}${s===data.ascSign?choose(lang," · લ"," · ल"," · Asc"):""}</strong><span>${occupants[s].join(" · ")||"—"}</span></div>`;}).join("");
    return `<div class="vedic-chart">${cells}<div class="chart-center"><div><strong>${data.key}</strong><br><small>${choose(lang,"વર્ગકુંડળી","वर्ग कुंडली","Divisional chart")}</small></div></div></div>`;
  }

  function domainCard(item,lang,expert,chart){
    const dasha=chart.advanced.dashaDepth;
    return `<article class="verdict-card ${item.score>=70?"good":item.score<47?"care":"mixed"}">
      <header><div><small>${item.varga}</small><h4>${item[lang]}</h4></div><b>${item.score}/100</b></header>
      <div class="verdict-meter"><span style="width:${item.score}%"></span></div>
      <strong>${strengthTone(item.score,lang)}</strong>
      <ul>
        <li>${choose(lang,"ભાવ આધાર","भाव समर्थन","House support")}: ${item.houseScore}/100</li>
        <li>${choose(lang,"મુખ્ય ગ્રહ આધાર","मुख्य ग्रह समर्थन","Key-planet support")}: ${item.planetScore}/100</li>
        <li>${item.varga} ${choose(lang,"પુષ્ટિ","पुष्टि","confirmation")}: ${item.vargaScore}/100</li>
        <li>${choose(lang,"સૌથી સહાયક ગ્રહ","सबसे सहायक ग्रह","Strongest supporting planet")}: ${planetName(item.strongestPlanet,lang)}</li>
      </ul>
      <p>${choose(lang,"હાલનો સમય","वर्तमान समय","Current timing")}: ${planetName(currentDashaKey(chart),lang)} / ${planetName(dasha.currentAntar.lord,lang)} · ${item.timing>0?choose(lang,"સક્રિય સહયોગ","सक्रिय सहयोग","active support"):choose(lang,"મૂળ સંકેત પ્રધાન","मूल संकेत प्रधान","natal pattern leads")}</p>
    </article>`;
  }

  function renderExpert(chart,lang){
    const target=document.getElementById("tab-expert");if(!target)return;
    const x=chart.advanced.expert;
    const domainCards=x.domains.map((item)=>domainCard(item,lang,x,chart)).join("");
    const planetRows=CLASSICAL.map((key)=>{
      const r=x.roles[key],v=x.vimshopaka[key],relations=CLASSICAL.filter((p)=>p!==key).map((p)=>`${planetName(p,lang)}: ${relationLabel(compoundRelation(chart,key,p),lang)}`).join(" · ");
      return `<tr><td class="planet-name">${planetName(key,lang)}</td><td>${r.owned.join(", ")||"—"}</td><td>${r.roles.map((code)=>roleLabel(code,lang)).join(" · ")||"—"}</td><td>${avasthaLabel(balaadi(chart.planets[key].longitude),lang)}</td><td><b>${v.score}/20</b></td><td class="relation-cell">${relations}</td></tr>`;
    }).join("");
    const houseRows=x.houses.map((h)=>`<tr><td>${h.house}</td><td>${signName(h.sign,lang)}</td><td>${planetName(h.lord,lang)} · ${h.lordHouse}</td><td>${h.sav}</td><td><div class="strength-meter"><span style="width:${h.score}%"></span></div><b>${h.score}/100</b></td></tr>`).join("");
    const vargaCards=VARGAS.map((v)=>{const data=x.vargas[v.key],lord=LORDS[data.ascSign];return `<details class="expert-varga" ${["D1","D9","D10"].includes(v.key)?"open":""}><summary><span><small>${v.key}</small><strong>${v[lang]}</strong></span><em>${v[lang+"Use"]}</em><b>${signName(data.ascSign,lang)}</b></summary><div class="expert-varga-body">${vargaChart(data,lang)}<p>${choose(lang,"વર્ગ લગ્નેશ","वर्ग लग्नेश","Varga ascendant lord")}: ${planetName(lord,lang)} · ${dignityLabel(data.planets[lord].dignity,lang)}</p></div></details>`;}).join("");
    const timeRows=x.timeMatrix.map((row)=>`<tr class="${row.minutes===0?"current-row":""}"><td>${row.minutes>0?"+":""}${row.minutes}</td><td>${signName(row.D1,lang)}</td><td>${signName(row.D9,lang)}</td><td>${signName(row.D10,lang)}</td><td>${signName(row.D60,lang)}</td></tr>`).join("");
    const timelineRows=x.timeline.map((row)=>`<tr><td><b>${row.year}</b></td><td>${planetName(row.dasha.period,lang)} / ${planetName(row.dasha.sub,lang)}</td><td>${row.jupiter} / ${row.saturn} / ${row.rahu}</td><td><strong>${row.best.domain[lang]}</strong><small>${row.best.value}/100</small></td><td><strong>${row.care.domain[lang]}</strong><small>${row.care.value}/100</small></td></tr>`).join("");
    const weakestPlanets=[...PLANETS].sort((a,b)=>chart.advanced.strengths[a].score-chart.advanced.strengths[b].score).slice(0,3);
    const remedyCards=weakestPlanets.map((key)=>`<article><strong>${planetName(key,lang)}</strong><p>${REMEDIES[key][lang]}</p></article>`).join("");
    const warText=x.warCandidates.length?x.warCandidates.map((w)=>`${planetName(w.a,lang)}–${planetName(w.b,lang)} ${w.distance.toFixed(2)}°`).join(" · "):choose(lang,"1°ની અંદર કોઈ ગ્રહયુદ્ધ-સંભવિત નજીકતા નથી.","1° के भीतर कोई ग्रहयुद्ध-संभावित निकटता नहीं है।","No graha-yuddha candidate lies within 1°.");
    target.innerHTML=`
      <div class="expert-hero"><div><small>${choose(lang,"વરિષ્ઠ જ્યોતિષી જેવી સંકલિત વાંચન પદ્ધતિ","वरिष्ठ ज्योतिषी जैसी समेकित अध्ययन पद्धति","An integrated senior-analyst view")}</small><strong>${choose(lang,"વચન → પુષ્ટિ → બળ → દશા → ગોચર → અંતિમ તારણ","वचन → पुष्टि → बल → दशा → गोचर → अंतिम निष्कर्ष","Promise → confirmation → strength → dasha → transit → synthesis")}</strong></div><p>${choose(lang,"દરેક સ્કોરની પાછળ ભાવ, ભાવેશ, સંબંધિત વર્ગકુંડળી, ગ્રહબળ, દશા અને અષ્ટકવર્ગનો સંયુક્ત આધાર છે.","प्रत्येक स्कोर के पीछे भाव, भावेश, संबंधित वर्ग, ग्रहबल, दशा और अष्टकवर्ग का संयुक्त आधार है।","Each score combines houses, lords, the relevant Varga, planetary strength, dasha and Ashtakavarga.")}</p></div>

      <h3 class="section-title">${choose(lang,"જીવનના મુખ્ય વિષયોનું અંતિમ તારણ","जीवन के मुख्य विषयों का अंतिम निष्कर्ष","Final synthesis by life area")}</h3>
      <div class="verdict-grid">${domainCards}</div>
      <p class="future-disclaimer">${choose(lang,"આ સંભાવનાત્મક જ્યોતિષીય synthesis છે—ચોક્કસ ઘટના કે ખાતરી નહીં. જન્મસમયની ચોકસાઈ, વ્યક્તિના નિર્ણય અને વાસ્તવિક પરિસ્થિતિથી પરિણામ બદલાય છે.","यह संभाव्य ज्योतिषीय synthesis है—निश्चित घटना या गारंटी नहीं। जन्मसमय, व्यक्तिगत निर्णय और वास्तविक परिस्थिति से परिणाम बदलते हैं।","This is a probabilistic astrological synthesis, not a guaranteed event. Birth-time accuracy, personal decisions and real circumstances matter.")}</p>

      <h3 class="section-title">${choose(lang,"પૂર્ણ Shodashvarga — 16 વર્ગકુંડળી","पूर्ण षोडशवर्ग — 16 वर्ग कुंडलियां","Complete Shodashavarga — 16 divisional charts")}</h3>
      <div class="expert-varga-list">${vargaCards}</div>
      <p class="legend-note">${choose(lang,"D30 અને D60 સહિત કેટલાક વર્ગોમાં પરંપરાભેદ મળે છે. અહીં દર્શાવેલી convention reportમાં સતત સમાન રાખવામાં આવી છે; D60 માટે અત્યંત ચોક્કસ જન્મસમય જરૂરી છે.","D30 और D60 सहित कुछ वर्गों में परंपरागत मतभेद हैं। यहां एक समान convention रखी गई है; D60 के लिए अत्यंत सटीक जन्मसमय आवश्यक है।","Some Vargas, including D30 and D60, vary by lineage. This report uses one consistent convention; D60 requires an extremely accurate birth time.")}</p>

      <h3 class="section-title">${choose(lang,"ગ્રહની કાર્યાત્મક ભૂમિકા અને Vimshopaka-style આધાર","ग्रह की कार्यात्मक भूमिका और Vimshopaka-style समर्थन","Functional roles and Vimshopaka-style support")}</h3>
      <div class="table-wrap"><table><thead><tr><th>${choose(lang,"ગ્રહ","ग्रह","Planet")}</th><th>${choose(lang,"સ્વામિત્વ ભાવ","स्वामित्व भाव","Owned houses")}</th><th>${choose(lang,"કાર્યાત્મક ભૂમિકા","कार्यात्मक भूमिका","Functional role")}</th><th>${choose(lang,"બાલાદિ અવસ્થા","बालादि अवस्था","Balaadi state")}</th><th>${choose(lang,"16 વર્ગ આધાર","16 वर्ग समर्थन","16-Varga support")}</th><th>${choose(lang,"પંચધા સંબંધ સૂચક","पंचधा संबंध संकेत","Compound relationship indicator")}</th></tr></thead><tbody>${planetRows}</tbody></table></div>
      <p class="legend-note">${choose(lang,"આ 16-વર્ગ score પરંપરાગત વજન અને રાશિસંબંધ પરથી બનાવેલો Vimshopaka-style સહાયક માપ છે; સંપૂર્ણ ષડ્બળના રૂપા તરીકે તેનો ઉપયોગ ન કરવો.","यह 16-वर्ग score पारंपरिक वजन और राशि संबंध पर आधारित Vimshopaka-style सहायक माप है; इसे पूर्ण षड्बल रूपा न मानें।","This 16-Varga score is a Vimshopaka-style aid based on traditional weights and sign relationships; it is not full Shadbala in rupas.")}</p>

      <h3 class="section-title">${choose(lang,"12 ભાવનો સંકલિત આધાર","12 भावों का समेकित समर्थन","Integrated support for all 12 houses")}</h3>
      <div class="table-wrap"><table><thead><tr><th>${choose(lang,"ભાવ","भाव","House")}</th><th>${choose(lang,"રાશિ","राशि","Sign")}</th><th>${choose(lang,"ભાવેશ / સ્થાન","भावेश / स्थान","Lord / placement")}</th><th>SAV</th><th>${choose(lang,"આધાર સ્કોર","समर्थन स्कोर","Support score")}</th></tr></thead><tbody>${houseRows}</tbody></table></div>

      <h3 class="section-title">${choose(lang,"જન્મસમય Rectification Matrix","जन्मसमय Rectification Matrix","Birth-time rectification matrix")}</h3>
      <div class="table-wrap"><table><thead><tr><th>${choose(lang,"મિનિટ ફેરફાર","मिनट परिवर्तन","Minute shift")}</th><th>D1</th><th>D9</th><th>D10</th><th>D60</th></tr></thead><tbody>${timeRows}</tbody></table></div>
      <p class="legend-note">${choose(lang,"±10 મિનિટની સરખામણી birth-timeની સંવેદનશીલતા બતાવે છે; આ આપમેળે rectificationનો અંતિમ પુરાવો નથી. જાણીતી જીવનઘટનાઓ સાથે અનુભવી જ્યોતિષી દ્વારા ચકાસણી જરૂરી છે.","±10 मिनट तुलना जन्मसमय की संवेदनशीलता दिखाती है; यह अपने-आप अंतिम rectification प्रमाण नहीं है। ज्ञात जीवन घटनाओं से जांच आवश्यक है।","The ±10-minute comparison shows sensitivity; it is not automatic proof of a rectified time. Validate it against known life events.")}</p>

      <h3 class="section-title">${choose(lang,"આગામી 12 વર્ષની દશા–ગોચર સમયરેખા","अगले 12 वर्षों की दशा–गोचर समयरेखा","Twelve-year dasha–transit timeline")}</h3>
      <div class="table-wrap timeline-table"><table><thead><tr><th>${choose(lang,"વર્ષ","वर्ष","Year")}</th><th>${choose(lang,"મહા / અંતર","महा / अंतर","Maha / Antar")}</th><th>${choose(lang,"ગુરુ / શનિ / રાહુ ભાવ (લગ્નથી)","गुरु / शनि / राहु भाव (लग्न से)","Jupiter / Saturn / Rahu houses (from Ascendant)")}</th><th>${choose(lang,"વધુ સહાયક વિષય","अधिक सहायक विषय","More supported area")}</th><th>${choose(lang,"વધુ ધ્યાનનો વિષય","अधिक ध्यान का विषय","Area needing care")}</th></tr></thead><tbody>${timelineRows}</tbody></table></div>

      <h3 class="section-title">${choose(lang,"વિશેષ નજીકતા અને સાવચેતી","विशेष निकटता और सावधानी","Special proximity and cautions")}</h3>
      <div class="expert-alert"><strong>${choose(lang,"ગ્રહયુદ્ધ ઉમેદવાર તપાસ","ग्रहयुद्ध उम्मीदवार जांच","Graha-yuddha candidate check")}</strong><p>${warText}</p><small>${choose(lang,"1°ની નજીકતા માત્ર candidate છે; અંતિમ વિજેતા નક્કી કરવા latitude અને પરંપરાગત નિયમ જરૂરી છે.","1° की निकटता केवल candidate है; अंतिम विजेता के लिए latitude और पारंपरिक नियम आवश्यक हैं।","A conjunction within 1° is only a candidate; latitude and the selected traditional rule are needed to judge a winner.")}</small></div>

      <h3 class="section-title">${choose(lang,"ઓછા જોખમના વ્યવહારુ ઉપાય","कम जोखिम वाले व्यावहारिक उपाय","Low-risk practical remedies")}</h3>
      <div class="remedy-grid">${remedyCards}</div>
      <p class="future-disclaimer">${choose(lang,"રત્ન, યંત્ર અથવા ખર્ચાળ ઉપાય આપમેળે સૂચવવામાં આવતા નથી. પૂર્ણ ષડ્બળ, દશા અને વ્યક્તિગત પરિસ્થિતિની નિષ્ણાત તપાસ વગર રત્ન ન ધારણ કરવું.","रत्न, यंत्र या महंगे उपाय स्वतः नहीं सुझाए जाते। पूर्ण षड्बल, दशा और व्यक्तिगत परिस्थिति की विशेषज्ञ जांच के बिना रत्न न पहनें।","Gemstones, yantras and costly remedies are not auto-prescribed. Do not wear a gemstone without an expert review of full Shadbala, dasha and personal context.")}</p>
    `;
  }

  const originalCalculate=api.calculate.bind(api),originalRender=api.render.bind(api);
  api.calculate=function(chart){const advanced=originalCalculate(chart);advanced.expert=calculateExpert(chart,advanced);return advanced;};
  api.render=function(chart,lang){if(!chart.advanced.expert)chart.advanced.expert=calculateExpert(chart,chart.advanced);originalRender(chart,lang);renderExpert(chart,lang);};

  const PROFILE_KEY="janmakshar.profiles.v1",CURRENT_KEY="janmakshar.savedInput.v1";
  function readProfiles(){try{const value=JSON.parse(localStorage.getItem(PROFILE_KEY)||"[]");return Array.isArray(value)?value:[];}catch(_){return[];}}
  function writeProfiles(value){localStorage.setItem(PROFILE_KEY,JSON.stringify(value));}
  function status(text){const element=document.getElementById("profile-status");if(element)element.textContent=text;}
  function profileMessage(lang,gu,hi,en){return choose(lang,gu,hi,en);}
  function refreshProfiles(){
    const select=document.getElementById("saved-profile");if(!select)return;
    const lang=document.documentElement.lang||"gu",selected=select.value,copy=api.copy[lang]||api.copy.gu;
    select.innerHTML=`<option value="">${copy.chooseProfile}</option>`+readProfiles().map((item)=>`<option value="${item.id}">${String(item.input.name).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])} · ${item.input.date}</option>`).join("");
    if([...select.options].some((option)=>option.value===selected))select.value=selected;
  }
  function setupProfiles(){
    refreshProfiles();
    document.getElementById("save-profile")?.addEventListener("click",()=>{
      const lang=document.documentElement.lang||"gu";let input;
      try{input=JSON.parse(localStorage.getItem(CURRENT_KEY)||"null");}catch(_){input=null;}
      if(!input?.name){status(profileMessage(lang,"પહેલાં કુંડળી બનાવો.","पहले कुंडली बनाएं।","Create a chart first."));return;}
      const profiles=readProfiles(),existing=profiles.find((item)=>item.input.name===input.name&&item.input.date===input.date&&item.input.time===input.time);
      if(existing){existing.input=input;existing.updatedAt=new Date().toISOString();}else profiles.push({id:String(Date.now()),input,updatedAt:new Date().toISOString()});
      writeProfiles(profiles);refreshProfiles();status(profileMessage(lang,"કુંડળી સાચવાઈ ગઈ.","कुंडली सहेज दी गई।","Chart saved."));
    });
    document.getElementById("load-profile")?.addEventListener("click",()=>{
      const lang=document.documentElement.lang||"gu",id=document.getElementById("saved-profile")?.value,item=readProfiles().find((p)=>p.id===id);
      if(!item){status(profileMessage(lang,"કુંડળી પસંદ કરો.","कुंडली चुनें।","Choose a chart."));return;}
      localStorage.setItem(CURRENT_KEY,JSON.stringify(item.input));location.reload();
    });
    document.getElementById("delete-profile")?.addEventListener("click",()=>{
      const lang=document.documentElement.lang||"gu",id=document.getElementById("saved-profile")?.value;
      if(!id){status(profileMessage(lang,"દૂર કરવા કુંડળી પસંદ કરો.","हटाने के लिए कुंडली चुनें।","Choose a chart to remove."));return;}
      writeProfiles(readProfiles().filter((p)=>p.id!==id));refreshProfiles();status(profileMessage(lang,"સાચવેલી કુંડળી દૂર થઈ.","सहेजी गई कुंडली हटाई गई।","Saved chart removed."));
    });
    document.getElementById("export-profiles")?.addEventListener("click",()=>{
      const payload={app:"Janmakshar",version:1,exportedAt:new Date().toISOString(),profiles:readProfiles()},blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
      a.href=url;a.download=`janmakshar-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
    });
    document.getElementById("import-profiles")?.addEventListener("change",(event)=>{
      const lang=document.documentElement.lang||"gu",file=event.target.files?.[0];if(!file)return;
      const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result),incoming=Array.isArray(data)?data:data.profiles;if(!Array.isArray(incoming))throw new Error();const valid=incoming.filter((p)=>p?.input?.name&&p.input.date&&p.input.time).map((p)=>({...p,id:String(p.id||Date.now()+Math.random())}));const map=new Map(readProfiles().map((p)=>[p.id,p]));valid.forEach((p)=>map.set(p.id,p));writeProfiles([...map.values()]);refreshProfiles();status(profileMessage(lang,`${valid.length} કુંડળી import થઈ.`,`${valid.length} कुंडलियां import हुईं।`,`${valid.length} charts imported.`));}catch(_){status(profileMessage(lang,"Backup file માન્ય નથી.","Backup file मान्य नहीं है।","The backup file is not valid."));}};reader.readAsText(file);event.target.value="";
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setupProfiles);else setupProfiles();
})();
