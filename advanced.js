(function () {
  "use strict";

  const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const CLASSICAL = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
  const GU_TO_KEY = { "સૂર્ય": "Sun", "ચંદ્ર": "Moon", "મંગળ": "Mars", "બુધ": "Mercury", "ગુરુ": "Jupiter", "શુક્ર": "Venus", "શનિ": "Saturn", "રાહુ": "Rahu", "કેતુ": "Ketu" };
  const LORD_KEYS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  const EXALT = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  const DEBIL = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
  const OWN = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10] };
  const SIGN_NAMES = {
    gu: ["મેષ", "વૃષભ", "મિથુન", "કર્ક", "સિંહ", "કન્યા", "તુલા", "વૃશ્ચિક", "ધન", "મકર", "કુંભ", "મીન"],
    hi: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
    en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
  };
  const PLANET_NAMES = {
    gu: { Sun: "સૂર્ય", Moon: "ચંદ્ર", Mars: "મંગળ", Mercury: "બુધ", Jupiter: "ગુરુ", Venus: "શુક્ર", Saturn: "શનિ", Rahu: "રાહુ", Ketu: "કેતુ", Lagna: "લગ્ન" },
    hi: { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु", Lagna: "लग्न" },
    en: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu", Lagna: "Ascendant" }
  };
  const PLANET_SHORT = {
    gu: { Sun: "સૂ", Moon: "ચં", Mars: "મં", Mercury: "બુ", Jupiter: "ગુ", Venus: "શુ", Saturn: "શ", Rahu: "રા", Ketu: "કે" },
    hi: { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" },
    en: { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" }
  };
  const HOUSE_TITLES = {
    gu: ["વ્યક્તિત્વ અને શરીર", "ધન, પરિવાર અને વાણી", "પરાક્રમ અને સહોદર", "માતા, ઘર અને સુખ", "બુદ્ધિ, સંતાન અને પ્રેમ", "આરોગ્ય, ઋણ અને સ્પર્ધા", "લગ્ન અને ભાગીદારી", "પરિવર્તન અને સંયુક્ત ધન", "ભાગ્ય, ધર્મ અને ગુરુ", "કારકિર્દી અને પ્રતિષ્ઠા", "લાભ, મિત્ર અને લક્ષ્ય", "ખર્ચ, વિદેશ અને મોક્ષ"],
    hi: ["व्यक्तित्व और शरीर", "धन, परिवार और वाणी", "पराक्रम और भाई-बहन", "माता, घर और सुख", "बुद्धि, संतान और प्रेम", "स्वास्थ्य, ऋण और प्रतिस्पर्धा", "विवाह और साझेदारी", "परिवर्तन और संयुक्त धन", "भाग्य, धर्म और गुरु", "करियर और प्रतिष्ठा", "लाभ, मित्र और लक्ष्य", "व्यय, विदेश और मोक्ष"],
    en: ["Personality and body", "Wealth, family and speech", "Courage and siblings", "Mother, home and comfort", "Intellect, children and love", "Health, debt and competition", "Marriage and partnership", "Transformation and shared wealth", "Fortune, dharma and mentor", "Career and reputation", "Gains, friends and goals", "Expenses, foreign lands and liberation"]
  };
  const HOUSE_MEANINGS = {
    hi: [
      "पहला भाव शरीर, स्वभाव, आत्मविश्वास और जीवन के प्रति आपकी मूल प्रतिक्रिया दर्शाता है।",
      "दूसरा भाव आय, बचत, परिवार के संस्कार, भोजन और बोलने की शैली बताता है।",
      "तीसरा भाव साहस, संचार, कौशल, छोटे भाई-बहन और स्वयं के प्रयास से जुड़ा है।",
      "चौथा भाव माता, घर, संपत्ति, वाहन, शिक्षा और मानसिक शांति दर्शाता है।",
      "पांचवां भाव बुद्धि, अध्ययन, संतान, प्रेम, सृजन और विवेकपूर्ण जोखिम से जुड़ा है।",
      "छठा भाव दिनचर्या, स्वास्थ्य की आदतें, ऋण, विवाद, सेवा और प्रतियोगिता दर्शाता है।",
      "सातवां भाव विवाह, जीवनसाथी, दीर्घ संबंध, सार्वजनिक व्यवहार और साझेदारी बताता है।",
      "आठवां भाव अचानक परिवर्तन, गोपनीयता, संयुक्त धन, विरासत और पुनर्निर्माण की क्षमता दर्शाता है।",
      "नौवां भाव भाग्य, धर्म, उच्च शिक्षा, गुरु, सिद्धांत और लंबी यात्राओं से जुड़ा है।",
      "दसवां भाव कर्म, करियर, पद, जिम्मेदारी और सार्वजनिक प्रतिष्ठा दर्शाता है।",
      "ग्यारहवां भाव लाभ, नेटवर्क, मित्र, आय के अतिरिक्त स्रोत और बड़े लक्ष्यों को दिखाता है।",
      "बारहवां भाव खर्च, विदेश, निद्रा, एकांत, दान और आध्यात्मिक मुक्ति से जुड़ा है।"
    ],
    en: [
      "The first house describes the body, temperament, confidence and your basic response to life.",
      "The second house describes income, savings, family values, food and the manner of speech.",
      "The third house relates to courage, communication, skills, younger siblings and self-effort.",
      "The fourth house covers mother, home, property, vehicles, education and inner peace.",
      "The fifth house covers intelligence, study, children, romance, creativity and considered risk.",
      "The sixth house describes routine, health habits, debt, disputes, service and competition.",
      "The seventh house describes marriage, spouse, long-term bonds, public dealings and partnership.",
      "The eighth house covers sudden change, privacy, shared assets, inheritance and resilience.",
      "The ninth house relates to fortune, dharma, higher study, mentors, principles and long journeys.",
      "The tenth house describes work, career, authority, responsibility and public reputation.",
      "The eleventh house covers gains, networks, friends, additional income and major goals.",
      "The twelfth house relates to expenses, foreign lands, sleep, solitude, charity and liberation."
    ]
  };
  const PLANET_ROLES = {
    hi: {
      Sun: "पहचान, आत्मसम्मान, नेतृत्व और अधिकार", Moon: "मन, भावनात्मक सुरक्षा, माता और आदतें", Mars: "साहस, क्रिया, संघर्ष और तकनीकी शक्ति", Mercury: "बुद्धि, व्यापार, लेखन और संवाद", Jupiter: "ज्ञान, विस्तार, परिवार और मार्गदर्शन", Venus: "प्रेम, कला, आराम और संबंध", Saturn: "अनुशासन, विलंब, कर्म और दीर्घकालीन जिम्मेदारी", Rahu: "महत्त्वाकांक्षा, असामान्य अनुभव और भौतिक आकर्षण", Ketu: "वैराग्य, शोध, पूर्व संस्कार और आध्यात्मिक अंतर्दृष्टि"
    },
    en: {
      Sun: "identity, self-respect, leadership and authority", Moon: "mind, emotional security, mother and habits", Mars: "courage, action, conflict and technical energy", Mercury: "intellect, commerce, writing and communication", Jupiter: "wisdom, growth, family and guidance", Venus: "love, art, comfort and relationships", Saturn: "discipline, delay, karma and long-term responsibility", Rahu: "ambition, unusual experiences and material appetite", Ketu: "detachment, research, inherited patterns and spiritual insight"
    }
  };
  const VARGAS = [
    { n: 2, key: "D2", gu: "હોરા", hi: "होरा", en: "Hora", guUse: "ધન અને આર્થિક ક્ષમતા", hiUse: "धन और वित्तीय क्षमता", enUse: "wealth and financial capacity" },
    { n: 3, key: "D3", gu: "દ્રેકાણ", hi: "द्रेक्काण", en: "Drekkana", guUse: "પરાક્રમ અને સહોદર", hiUse: "पराक्रम और भाई-बहन", enUse: "courage and siblings" },
    { n: 7, key: "D7", gu: "સપ્તમાંશ", hi: "सप्तमांश", en: "Saptamsa", guUse: "સંતાન અને સર્જન", hiUse: "संतान और सृजन", enUse: "children and creative continuity" },
    { n: 9, key: "D9", gu: "નવાંશ", hi: "नवांश", en: "Navamsa", guUse: "લગ્ન, ધર્મ અને આંતરિક ગ્રહબળ", hiUse: "विवाह, धर्म और आंतरिक ग्रहबल", enUse: "marriage, dharma and inner planetary strength" },
    { n: 10, key: "D10", gu: "દશાંશ", hi: "दशांश", en: "Dasamsa", guUse: "કારકિર્દી, વ્યવસાય અને પદ", hiUse: "करियर, व्यवसाय और पद", enUse: "career, profession and status" },
    { n: 12, key: "D12", gu: "દ્વાદશાંશ", hi: "द्वादशांश", en: "Dwadasamsa", guUse: "માતા-પિતા અને વંશ", hiUse: "माता-पिता और वंश", enUse: "parents and lineage" },
    { n: 24, key: "D24", gu: "ચતુર્વિંશાંશ", hi: "चतुर्विंशांश", en: "Chaturvimsamsa", guUse: "શિક્ષણ અને જ્ઞાન", hiUse: "शिक्षा और ज्ञान", enUse: "education and learning" },
    { n: 60, key: "D60", gu: "ષષ્ટિઅંશ", hi: "षष्ट्यंश", en: "Shashtiamsa", guUse: "સૂક્ષ્મ કર્મસંકેત—અતિચોક્કસ સમય જરૂરી", hiUse: "सूक्ष्म कर्म संकेत—अत्यंत सटीक समय आवश्यक", enUse: "subtle karmic indications—requires an extremely accurate birth time" }
  ];

  const BINDU_TABLES = {
    Sun: { Sun:[1,2,4,7,8,9,10,11], Moon:[3,6,10,11], Mars:[1,2,4,7,8,9,10,11], Mercury:[3,5,6,9,10,11,12], Jupiter:[5,6,9,11], Venus:[6,7,12], Saturn:[1,2,4,7,8,9,10,11], Lagna:[3,4,6,10,11,12] },
    Moon: { Sun:[3,6,7,8,10,11], Moon:[1,3,6,7,10,11], Mars:[2,3,5,6,9,10,11], Mercury:[1,3,4,5,7,8,10,11], Jupiter:[1,4,7,8,10,11,12], Venus:[3,4,5,7,9,10,11], Saturn:[3,5,6,11], Lagna:[3,6,10,11] },
    Mars: { Sun:[3,5,6,10,11], Moon:[3,6,11], Mars:[1,2,4,7,8,10,11], Mercury:[3,5,6,11], Jupiter:[6,10,11,12], Venus:[6,8,11,12], Saturn:[1,4,7,8,9,10,11], Lagna:[1,3,6,10,11] },
    Mercury: { Sun:[5,6,9,11,12], Moon:[2,4,6,8,10,11], Mars:[1,2,4,7,8,9,10,11], Mercury:[1,3,5,6,9,10,11,12], Jupiter:[6,8,11,12], Venus:[1,2,3,4,5,8,9,11], Saturn:[1,2,4,7,8,9,10,11], Lagna:[1,2,4,6,8,10,11] },
    Jupiter: { Sun:[1,2,3,4,7,8,9,10,11], Moon:[2,5,7,9,11], Mars:[1,2,4,7,8,10,11], Mercury:[1,2,4,5,6,9,10,11], Jupiter:[1,2,3,4,7,8,10,11], Venus:[2,5,6,9,10,11], Saturn:[3,5,6,12], Lagna:[1,2,4,5,6,7,9,10,11] },
    Venus: { Sun:[8,11,12], Moon:[1,2,3,4,5,8,9,11,12], Mars:[3,5,6,9,11,12], Mercury:[3,5,6,9,11], Jupiter:[5,8,9,10,11], Venus:[1,2,3,4,5,8,9,10,11], Saturn:[3,4,5,8,9,10,11], Lagna:[1,2,3,4,5,8,9,11] },
    Saturn: { Sun:[1,2,4,7,8,10,11], Moon:[3,6,11], Mars:[3,5,6,10,11,12], Mercury:[6,8,9,10,11,12], Jupiter:[5,6,11,12], Venus:[6,11,12], Saturn:[3,5,6,11], Lagna:[1,3,4,6,10,11] }
  };

  function norm(value) { return ((value % 360) + 360) % 360; }
  function signOf(longitude) { return Math.floor(norm(longitude) / 30); }
  function withinSign(longitude) { return norm(longitude) % 30; }
  function addDays(date, days) { return new Date(date.getTime() + days * 86400000); }
  function formatDate(date, lang) {
    const locale = lang === "hi" ? "hi-IN" : lang === "en" ? "en-GB" : "gu-IN";
    return new Intl.DateTimeFormat(locale, { day:"2-digit", month:"2-digit", year:"numeric", timeZone:"UTC" }).format(date);
  }
  function formatInputDate(value, lang) {
    const [year,month,day]=String(value).split("-").map(Number);
    return formatDate(new Date(Date.UTC(year,month-1,day)),lang);
  }
  function namePlanet(key, lang) { return PLANET_NAMES[lang][key] || key; }
  function nameSign(index, lang) { return SIGN_NAMES[lang][index]; }
  function dignity(key, sign) {
    if (EXALT[key] === sign) return "exalted";
    if (DEBIL[key] === sign) return "debilitated";
    if ((OWN[key] || []).includes(sign)) return "own";
    if (key === "Rahu" || key === "Ketu") return "node";
    return "ordinary";
  }
  function dignityLabel(value, lang) {
    const labels = {
      gu:{exalted:"ઉચ્ચ",debilitated:"નીચ",own:"સ્વરાશિ",node:"છાયા ગ્રહ",ordinary:"સામાન્ય"},
      hi:{exalted:"उच्च",debilitated:"नीच",own:"स्वराशि",node:"छाया ग्रह",ordinary:"सामान्य"},
      en:{exalted:"Exalted",debilitated:"Debilitated",own:"Own sign",node:"Lunar node",ordinary:"Ordinary"}
    };
    return labels[lang][value];
  }

  function vargaSign(longitude, division) {
    const sign = signOf(longitude);
    const degree = withinSign(longitude);
    const oddSign = sign % 2 === 0;
    if (division === 1) return sign;
    if (division === 2) {
      const firstHalf = degree < 15;
      return oddSign ? (firstHalf ? 4 : 3) : (firstHalf ? 3 : 4);
    }
    if (division === 3) return (sign + Math.floor(degree / 10) * 4) % 12;
    if (division === 7) {
      const part = Math.min(6, Math.floor(degree / (30 / 7)));
      return ((oddSign ? sign : sign + 6) + part) % 12;
    }
    if (division === 9) return signOf(norm(longitude * 9));
    if (division === 10) {
      const part = Math.min(9, Math.floor(degree / 3));
      return (sign + part + (oddSign ? 0 : 8)) % 12;
    }
    if (division === 12) return (sign + Math.min(11, Math.floor(degree / 2.5))) % 12;
    if (division === 24) {
      const part = Math.min(23, Math.floor(degree / 1.25));
      return ((oddSign ? 4 : 3) + part) % 12;
    }
    if (division === 60) {
      const part = Math.min(59, Math.floor(degree / .5));
      return oddSign ? (sign + part) % 12 : (sign - part + 120) % 12;
    }
    return signOf(norm(longitude * division));
  }

  function buildVarga(chart, division) {
    const ascSign = vargaSign(chart.siderealAsc, division);
    const planets = {};
    PLANETS.forEach((key) => {
      const sign = vargaSign(chart.planets[key].longitude, division);
      planets[key] = { sign, house: ((sign - ascSign + 12) % 12) + 1, dignity: dignity(key, sign), vargottama: sign === chart.planets[key].sign };
    });
    return { division, ascSign, planets };
  }

  function calculateAshtakavarga(chart) {
    const positions = { Lagna: chart.ascSign };
    CLASSICAL.forEach((key) => { positions[key] = chart.planets[key].sign; });
    const bav = {};
    CLASSICAL.forEach((planet) => {
      const points = Array(12).fill(0);
      Object.entries(BINDU_TABLES[planet]).forEach(([reference, houses]) => {
        houses.forEach((house) => { points[(positions[reference] + house - 1) % 12] += 1; });
      });
      bav[planet] = points;
    });
    const sav = Array(12).fill(0);
    CLASSICAL.forEach((planet) => bav[planet].forEach((value, index) => { sav[index] += value; }));
    return { bav, sav, total: sav.reduce((a,b) => a + b, 0) };
  }

  function angularDistance(a, b) {
    const d = Math.abs(norm(a) - norm(b));
    return Math.min(d, 360 - d);
  }
  function isCombust(chart, key) {
    const limits = { Moon:12, Mars:17, Mercury:14, Jupiter:11, Venus:10, Saturn:15 };
    return limits[key] ? angularDistance(chart.planets[key].longitude, chart.planets.Sun.longitude) <= limits[key] : false;
  }
  function strengthFor(chart, vargas, key) {
    const planet = chart.planets[key];
    const dg = dignity(key, planet.sign);
    let dignityScore = dg === "exalted" ? 28 : dg === "own" ? 24 : dg === "debilitated" ? 5 : dg === "node" ? 12 : 15;
    const houseScore = [1,4,5,7,9,10,11].includes(planet.house) ? 18 : [3,6].includes(planet.house) ? 13 : [8,12].includes(planet.house) ? 7 : 11;
    const directionalHouse = { Sun:10, Mars:10, Moon:4, Venus:4, Jupiter:1, Mercury:1, Saturn:7 }[key];
    const directionScore = directionalHouse ? Math.max(2, 14 - Math.min(Math.abs(planet.house - directionalHouse), 12 - Math.abs(planet.house - directionalHouse)) * 2) : 8;
    const motionScore = planet.retrograde && !["Sun","Moon","Rahu","Ketu"].includes(key) ? 10 : 6;
    const d9 = vargas.D9.planets[key], d10 = vargas.D10.planets[key];
    const vargaScore = [d9, d10].reduce((sum, item) => sum + (["exalted","own"].includes(item.dignity) ? 8 : item.dignity === "debilitated" ? 2 : 5) + (item.vargottama ? 2 : 0), 0);
    const combustionPenalty = isCombust(chart, key) ? 10 : 0;
    const score = Math.max(0, Math.min(100, Math.round(dignityScore + houseScore + directionScore + motionScore + vargaScore - combustionPenalty)));
    return { key, score, dignity:dg, dignityScore, houseScore, directionScore, motionScore, vargaScore, combust:isCombust(chart,key), retrograde:planet.retrograde };
  }

  function childrenOfPeriod(start, end, startLord) {
    const startIndex = DASHA_ORDER.indexOf(startLord);
    const totalDays = (end - start) / 86400000;
    const periods = [];
    let cursor = new Date(start);
    for (let i = 0; i < 9; i++) {
      const lord = DASHA_ORDER[(startIndex + i) % 9];
      const childEnd = i === 8 ? new Date(end) : addDays(cursor, totalDays * DASHA_YEARS[lord] / 120);
      periods.push({ lord, start:new Date(cursor), end:childEnd });
      cursor = childEnd;
    }
    return periods;
  }

  function calculateDashaDepth(chart) {
    const maha = chart.dasha.current;
    const mahaKey = GU_TO_KEY[maha.lord];
    const antar = childrenOfPeriod(maha.start, maha.end, mahaKey);
    const now = new Date();
    const currentAntar = antar.find((p) => now >= p.start && now < p.end) || antar[0];
    const pratyantar = childrenOfPeriod(currentAntar.start, currentAntar.end, currentAntar.lord);
    const currentPratyantar = pratyantar.find((p) => now >= p.start && now < p.end) || pratyantar[0];
    return { antar, currentAntar, pratyantar, currentPratyantar };
  }

  function lahiriAyanamsha(date) {
    const years = (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 365.2425;
    return 23.85675 + years * (50.290966 / 3600);
  }
  function meanNodeLongitude(date) {
    const T = ((date.getTime() / 86400000 + 2440587.5) - 2451545.0) / 36525;
    return norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000);
  }
  function tropicalPlanet(key, date) {
    const vector = Astronomy.GeoVector(Astronomy.Body[key], date, true);
    return norm(Astronomy.Ecliptic(vector).elon);
  }
  function calculateTransits(chart) {
    const date = new Date();
    const ayanamsha = lahiriAyanamsha(date);
    const transits = {};
    PLANETS.forEach((key) => {
      let longitude;
      if (key === "Rahu") longitude = norm(meanNodeLongitude(date) - ayanamsha);
      else if (key === "Ketu") longitude = norm(meanNodeLongitude(date) - ayanamsha + 180);
      else longitude = norm(tropicalPlanet(key, date) - ayanamsha);
      const sign = signOf(longitude);
      transits[key] = { longitude, sign, fromLagna:((sign-chart.ascSign+12)%12)+1, fromMoon:((sign-chart.moonSign+12)%12)+1 };
    });
    return { date, ayanamsha, planets:transits };
  }

  function arudhaSign(houseSign, lordSign) {
    const distance = (lordSign - houseSign + 12) % 12;
    let result = (lordSign + distance) % 12;
    const relative = (result - houseSign + 12) % 12;
    if (relative === 0 || relative === 6) result = (result + 9) % 12;
    return result;
  }
  function calculateJaimini(chart) {
    const candidates = CLASSICAL.map((key) => ({ key, degrees:withinSign(chart.planets[key].longitude) })).sort((a,b) => b.degrees-a.degrees);
    const atmakaraka = candidates[0];
    const darakaraka = candidates[candidates.length-1];
    const lagnaLord = LORD_KEYS[chart.ascSign];
    const arudhaLagna = arudhaSign(chart.ascSign, chart.planets[lagnaLord].sign);
    const twelfthSign = (chart.ascSign + 11) % 12;
    const twelfthLord = LORD_KEYS[twelfthSign];
    const upapada = arudhaSign(twelfthSign, chart.planets[twelfthLord].sign);
    return { atmakaraka, darakaraka, arudhaLagna, upapada };
  }

  function mutualAspect(chart, a, b) {
    const houseA = chart.planets[a].house, houseB = chart.planets[b].house;
    const aspects = (from,key) => {
      const result=[((from+5)%12)+1];
      if(key==="Mars") result.push(((from+2)%12)+1,((from+6)%12)+1);
      if(key==="Jupiter") result.push(((from+3)%12)+1,((from+7)%12)+1);
      if(key==="Saturn") result.push(((from+1)%12)+1,((from+8)%12)+1);
      return result;
    };
    return aspects(houseA,a).includes(houseB) && aspects(houseB,b).includes(houseA);
  }
  function calculateAdvancedYogas(chart) {
    const found=[];
    const exchangeSeen=new Set();
    CLASSICAL.forEach((key) => {
      const sign=chart.planets[key].sign, dispositor=LORD_KEYS[sign];
      if(dispositor && dispositor!==key && LORD_KEYS[chart.planets[dispositor].sign]===key) {
        const id=[key,dispositor].sort().join("-");
        if(!exchangeSeen.has(id)){exchangeSeen.add(id);found.push({type:"parivartana",planets:[key,dispositor]});}
      }
      if(dignity(key,sign)==="debilitated") {
        const lord=LORD_KEYS[sign];
        const exaltLord=LORD_KEYS[EXALT[key]];
        const kendra=(h)=>[1,4,7,10].includes(h);
        if(kendra(chart.planets[lord].house)||kendra(chart.planets[exaltLord].house)||chart.planets[lord].sign===chart.planets[key].sign) found.push({type:"neechaBhanga",planets:[key]});
      }
    });
    const lord9=LORD_KEYS[(chart.ascSign+8)%12], lord10=LORD_KEYS[(chart.ascSign+9)%12];
    if(chart.planets[lord9].sign===chart.planets[lord10].sign||mutualAspect(chart,lord9,lord10)) found.push({type:"dharmaKarma",planets:[lord9,lord10]});
    [6,8,12].forEach((house)=>{
      const lord=LORD_KEYS[(chart.ascSign+house-1)%12];
      if([6,8,12].includes(chart.planets[lord].house)) found.push({type:"vipareeta",house,planets:[lord]});
    });
    const manglikFrom=(baseSign)=>{
      const marsHouse=((chart.planets.Mars.sign-baseSign+12)%12)+1;
      return {house:marsHouse,active:[1,2,4,7,8,12].includes(marsHouse)};
    };
    const manglik={lagna:manglikFrom(chart.ascSign),moon:manglikFrom(chart.moonSign),venus:manglikFrom(chart.planets.Venus.sign)};
    return { found, manglik };
  }

  function ascendantLongitude(date, latitude, longitude) {
    const theta = ((Astronomy.SiderealTime(date) * 15 + longitude) % 360 + 360) % 360 * Math.PI / 180;
    const eps = (23.439291 - 0.0130042 * (((date.getTime()/86400000+2440587.5)-2451545)/36525)) * Math.PI / 180;
    const phi = latitude * Math.PI / 180;
    return norm(Math.atan2(-Math.cos(theta), Math.sin(theta)*Math.cos(eps)+Math.tan(phi)*Math.sin(eps)) * 180/Math.PI + 180);
  }
  function d9AscAtOffset(chart, minutes) {
    const date=new Date(chart.date.getTime()+minutes*60000);
    const sidereal=norm(ascendantLongitude(date,chart.input.latitude,chart.input.longitude)-lahiriAyanamsha(date));
    return vargaSign(sidereal,9);
  }

  function calculate(chart) {
    const vargas={};
    VARGAS.forEach((v)=>{vargas[v.key]=buildVarga(chart,v.n);});
    const strengths={};
    PLANETS.forEach((key)=>{strengths[key]=strengthFor(chart,vargas,key);});
    return {
      vargas,
      strengths,
      ashtakavarga:calculateAshtakavarga(chart),
      dashaDepth:calculateDashaDepth(chart),
      transits:calculateTransits(chart),
      jaimini:calculateJaimini(chart),
      yogas:calculateAdvancedYogas(chart),
      timeSensitivity:{minus5:d9AscAtOffset(chart,-5),exact:vargas.D9.ascSign,plus5:d9AscAtOffset(chart,5)}
    };
  }

  const STATIC_COPY = {
    gu: {
      brandTitle:"જન્માક્ષર", brandSub:"વૈદિક કુંડળી", introEyebrow:"વ્યક્તિગત જન્મકુંડળી", introTitle:"જન્મની વિગતોમાંથી સંપૂર્ણ વૈદિક રિપોર્ટ", introDesc:"ચોક્કસ પરિણામ માટે જન્મતારીખ, સ્થાનિક સમય અને જન્મસ્થળના અક્ષાંશ–રેખાંશ સાચા દાખલ કરો.",
      formTitle:"જન્મ વિગતો", formDesc:"તમારી માહિતી ઉપકરણની બહાર મોકલાતી નથી.", nameLabel:"નામ", namePlaceholder:"તમારું નામ લખો", dateLabel:"જન્મ તારીખ", timeLabel:"ચોક્કસ સમય", placeLabel:"જન્મસ્થળ", chooseCity:"શહેર પસંદ કરો", coordinates:"સ્થળના કોર્ડિનેટ", change:"બદલો", latitude:"અક્ષાંશ", longitude:"રેખાંશ", timezone:"UTC અંતર", create:"જન્માક્ષર બનાવો", privacyTitle:"ખાનગી ગણતરી", privacyText:"વિગતો આ બ્રાઉઝરમાં જ પ્રક્રિયા થાય છે.",
      reportEyebrow:"જન્માક્ષર રિપોર્ટ", reset:"નવી કુંડળી / રીસેટ", print:"પ્રિન્ટ / PDF", tabSummary:"સારાંશ", tabCharts:"કુંડળી", tabPlanets:"ગ્રહો", tabHouses:"12 ભાવ", tabNavamsa:"નવાંશ D9", tabAdvanced:"અદ્યતન", tabDasha:"દશા", tabFuture:"ભવિષ્ય", tabMarriage:"લગ્ન", tabPanchang:"પંચાંગ", tabYoga:"યોગ–દોષ", tabReading:"ફળકથન", disclaimer:"આ ગણતરી પરંપરાગત વૈદિક જ્યોતિષીય સિદ્ધાંતો પર આધારિત છે. તેને વૈજ્ઞાનિક નિદાન અથવા જીવનના મહત્વના નિર્ણયનો એકમાત્ર આધાર ન બનાવો.", footerMethod:"ગણતરી: લાહિરી અયનાંશ · Whole Sign ભાવ પદ્ધતિ", locked:"રીસેટ કર્યા પછી નવી કુંડળી"
    },
    hi: {
      brandTitle:"जन्माक्षर", brandSub:"वैदिक कुंडली", introEyebrow:"व्यक्तिगत जन्मकुंडली", introTitle:"जन्म विवरण से संपूर्ण वैदिक रिपोर्ट", introDesc:"सटीक परिणाम के लिए जन्मतिथि, स्थानीय समय तथा जन्मस्थान के अक्षांश–देशांतर सही दर्ज करें।",
      formTitle:"जन्म विवरण", formDesc:"आपकी जानकारी इस उपकरण से बाहर नहीं भेजी जाती।", nameLabel:"नाम", namePlaceholder:"अपना नाम लिखें", dateLabel:"जन्म तिथि", timeLabel:"सटीक समय", placeLabel:"जन्मस्थान", chooseCity:"शहर चुनें", coordinates:"स्थान के निर्देशांक", change:"बदलें", latitude:"अक्षांश", longitude:"देशांतर", timezone:"UTC अंतर", create:"जन्मकुंडली बनाएं", privacyTitle:"निजी गणना", privacyText:"विवरण इसी ब्राउज़र में संसाधित होते हैं।",
      reportEyebrow:"जन्मकुंडली रिपोर्ट", reset:"नई कुंडली / रीसेट", print:"प्रिंट / PDF", tabSummary:"सारांश", tabCharts:"कुंडली", tabPlanets:"ग्रह", tabHouses:"12 भाव", tabNavamsa:"नवांश D9", tabAdvanced:"उन्नत", tabDasha:"दशा", tabFuture:"भविष्य", tabMarriage:"विवाह", tabPanchang:"पंचांग", tabYoga:"योग–दोष", tabReading:"फलादेश", disclaimer:"यह गणना पारंपरिक वैदिक ज्योतिष सिद्धांतों पर आधारित है। इसे वैज्ञानिक निदान या महत्वपूर्ण जीवन निर्णय का एकमात्र आधार न बनाएं।", footerMethod:"गणना: लाहिरी अयनांश · Whole Sign भाव पद्धति", locked:"रीसेट के बाद नई कुंडली"
    },
    en: {
      brandTitle:"Janmakshar", brandSub:"Vedic Birth Chart", introEyebrow:"Personal birth chart", introTitle:"A complete Vedic report from your birth details", introDesc:"For the best result, enter the correct birth date, local time, latitude and longitude of the birthplace.",
      formTitle:"Birth details", formDesc:"Your information is processed only on this device.", nameLabel:"Name", namePlaceholder:"Enter your name", dateLabel:"Birth date", timeLabel:"Exact time", placeLabel:"Birthplace", chooseCity:"Choose a city", coordinates:"Location coordinates", change:"Change", latitude:"Latitude", longitude:"Longitude", timezone:"UTC offset", create:"Create birth chart", privacyTitle:"Private calculation", privacyText:"Details are processed only in this browser.",
      reportEyebrow:"Birth chart report", reset:"New chart / Reset", print:"Print / PDF", tabSummary:"Summary", tabCharts:"Charts", tabPlanets:"Planets", tabHouses:"12 Houses", tabNavamsa:"Navamsa D9", tabAdvanced:"Advanced", tabDasha:"Dasha", tabFuture:"Forecast", tabMarriage:"Marriage", tabPanchang:"Panchang", tabYoga:"Yogas", tabReading:"Reading", disclaimer:"This calculation follows traditional Vedic astrology. Do not use it as the sole basis for medical, financial, legal or other major life decisions.", footerMethod:"Method: Lahiri ayanamsha · Whole Sign houses", locked:"Reset to create another chart"
    }
  };
  const CITY_NAMES = {
    "કસ્ટમ સ્થળ":{hi:"कस्टम स्थान",en:"Custom location"},
    "રાજકોટ, ગુજરાત":{hi:"राजकोट, गुजरात",en:"Rajkot, Gujarat"}, "અમદાવાદ, ગુજરાત":{hi:"अहमदाबाद, गुजरात",en:"Ahmedabad, Gujarat"}, "સુરત, ગુજરાત":{hi:"सूरत, गुजरात",en:"Surat, Gujarat"}, "વડોદરા, ગુજરાત":{hi:"वडोदरा, गुजरात",en:"Vadodara, Gujarat"}, "જામનગર, ગુજરાત":{hi:"जामनगर, गुजरात",en:"Jamnagar, Gujarat"}, "ભાવનગર, ગુજરાત":{hi:"भावनगर, गुजरात",en:"Bhavnagar, Gujarat"}, "જૂનાગઢ, ગુજરાત":{hi:"जूनागढ़, गुजरात",en:"Junagadh, Gujarat"}, "ગાંધીનગર, ગુજરાત":{hi:"गांधीनगर, गुजरात",en:"Gandhinagar, Gujarat"}, "મોરબી, ગુજરાત":{hi:"मोरबी, गुजरात",en:"Morbi, Gujarat"}, "પોરબંદર, ગુજરાત":{hi:"पोरबंदर, गुजरात",en:"Porbandar, Gujarat"},
    "મુંબઈ, મહારાષ્ટ્ર":{hi:"मुंबई, महाराष्ट्र",en:"Mumbai, Maharashtra"}, "પુણે, મહારાષ્ટ્ર":{hi:"पुणे, महाराष्ट्र",en:"Pune, Maharashtra"}, "નાશિક, મહારાષ્ટ્ર":{hi:"नासिक, महाराष्ट्र",en:"Nashik, Maharashtra"}, "દિલ્હી":{hi:"दिल्ली",en:"Delhi"}, "જયપુર, રાજસ્થાન":{hi:"जयपुर, राजस्थान",en:"Jaipur, Rajasthan"}, "ઉદયપુર, રાજસ્થાન":{hi:"उदयपुर, राजस्थान",en:"Udaipur, Rajasthan"}, "ઇન્દોર, મધ્ય પ્રદેશ":{hi:"इंदौर, मध्य प्रदेश",en:"Indore, Madhya Pradesh"}, "ભોપાલ, મધ્ય પ્રદેશ":{hi:"भोपाल, मध्य प्रदेश",en:"Bhopal, Madhya Pradesh"}, "બેંગલુરુ, કર્ણાટક":{hi:"बेंगलुरु, कर्नाटक",en:"Bengaluru, Karnataka"}, "હૈદરાબાદ, તેલંગાણા":{hi:"हैदराबाद, तेलंगाना",en:"Hyderabad, Telangana"}, "ચેન્નાઈ, તમિલનાડુ":{hi:"चेन्नई, तमिलनाडु",en:"Chennai, Tamil Nadu"}, "કોલકાતા, પશ્ચિમ બંગાળ":{hi:"कोलकाता, पश्चिम बंगाल",en:"Kolkata, West Bengal"}, "કોચી, કેરળ":{hi:"कोच्चि, केरल",en:"Kochi, Kerala"}, "લખનઉ, ઉત્તર પ્રદેશ":{hi:"लखनऊ, उत्तर प्रदेश",en:"Lucknow, Uttar Pradesh"}, "વારાણસી, ઉત્તર પ્રદેશ":{hi:"वाराणसी, उत्तर प्रदेश",en:"Varanasi, Uttar Pradesh"}, "પટણા, બિહાર":{hi:"पटना, बिहार",en:"Patna, Bihar"}, "ચંદીગઢ":{hi:"चंडीगढ़",en:"Chandigarh"}, "ભુવનેશ્વર, ઓડિશા":{hi:"भुवनेश्वर, ओडिशा",en:"Bhubaneswar, Odisha"}
  };

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c]); }
  function choose(lang, gu, hi, en) { return lang === "hi" ? hi : lang === "en" ? en : gu; }
  function translatedCity(value, lang) { return lang === "gu" ? value : (CITY_NAMES[value] ? CITY_NAMES[value][lang] : value); }

  function applyStaticLanguage(lang) {
    const copy = STATIC_COPY[lang] || STATIC_COPY.gu;
    document.documentElement.lang = lang;
    document.title = choose(lang, "જન્માક્ષર — વૈદિક કુંડળી", "जन्माक्षर — वैदिक कुंडली", "Janmakshar — Vedic Birth Chart");
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", choose(lang, "લાહિરી અયનાંશ આધારિત વૈદિક જન્માક્ષર, કુંડળી, દશા અને પંચાંગ ગણતરી.", "लाहिरी अयनांश आधारित वैदिक जन्मकुंडली, दशा और पंचांग गणना।", "Vedic birth chart, dasha and Panchang calculations using a Lahiri ayanamsha approximation."));
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      if (copy[key]) element.textContent = copy[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.dataset.i18nPlaceholder;
      if (copy[key]) element.setAttribute("placeholder", copy[key]);
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    const select = document.getElementById("birth-city");
    if (select) {
      Array.from(select.options).forEach((option, index) => {
        if (index === 0) option.textContent = copy.chooseCity;
        else if (option.value === "custom") option.textContent = choose(lang, "અન્ય સ્થળ — કોર્ડિનેટ લખો", "अन्य स्थान — निर्देशांक लिखें", "Other place — enter coordinates");
        else {
          const guName = option.dataset.guName || option.textContent;
          option.dataset.guName = guName;
          option.textContent = translatedCity(guName, lang);
        }
      });
    }
    const createLabel = document.getElementById("create-report-label");
    if (createLabel) createLabel.textContent = document.getElementById("create-report")?.disabled ? copy.locked : copy.create;
  }

  function statCard(label, value, note, symbol) {
    return `<article class="stat-card"><span class="symbol">${symbol}</span><small>${label}</small><strong>${value}</strong><em>${note}</em></article>`;
  }
  function strengthLabel(score, lang) {
    if (score >= 76) return choose(lang,"ખૂબ મજબૂત","बहुत मजबूत","Very strong");
    if (score >= 61) return choose(lang,"મજબૂત","मजबूत","Strong");
    if (score >= 45) return choose(lang,"મધ્યમ","मध्यम","Moderate");
    return choose(lang,"વધુ સંભાળ જરૂરી","अधिक ध्यान आवश्यक","Needs support");
  }
  function toneLabel(tone, lang) {
    return tone === "strong" ? choose(lang,"સહાયક","सहायक","Supportive") : tone === "caution" ? choose(lang,"સાવધાની","सावधानी","Caution") : choose(lang,"મિશ્ર","मिश्रित","Mixed");
  }
  function degreeText(longitude) {
    const degree=withinSign(longitude), d=Math.floor(degree), m=Math.floor((degree-d)*60);
    return `${d}° ${String(m).padStart(2,"0")}′`;
  }

  function vargaChartHtml(data, lang) {
    const occupants=Array.from({length:12},()=>[]);
    PLANETS.forEach((key)=>occupants[data.planets[key].sign].push(PLANET_SHORT[lang][key]));
    const positions={11:[1,1],0:[1,2],1:[1,3],2:[1,4],10:[2,1],3:[2,4],9:[3,1],4:[3,4],8:[4,1],7:[4,2],6:[4,3],5:[4,4]};
    const cells=Object.entries(positions).map(([sign,pos])=>{const s=Number(sign),[row,col]=pos;return `<div class="chart-cell ${s===data.ascSign?"lagna":""}" style="grid-row:${row};grid-column:${col}"><strong>${nameSign(s,lang)}${s===data.ascSign?choose(lang," · લ"," · ल"," · Asc"):""}</strong><span>${occupants[s].join(" · ")||"—"}</span></div>`;}).join("");
    return `<div class="vedic-chart">${cells}<div class="chart-center"><div><strong>D${data.division}</strong><br><small>${choose(lang,"વર્ગકુંડળી","वर्ग कुंडली","Divisional chart")}</small></div></div></div>`;
  }

  function advancedYogaLabel(item, lang) {
    const names={
      parivartana:["પરિવર્તન યોગ","परिवर्तन योग","Parivartana Yoga"],
      neechaBhanga:["નીચભંગ સંકેત","नीचभंग संकेत","Neecha Bhanga indication"],
      dharmaKarma:["ધર્મ–કર્માધિપતિ યોગ","धर्म–कर्माधिपति योग","Dharma–Karmadhipati Yoga"],
      vipareeta:["વિપરીત રાજયોગ સંકેત","विपरीत राजयोग संकेत","Vipareeta Raja Yoga indication"]
    };
    const title=names[item.type]||[item.type,item.type,item.type];
    const planets=(item.planets||[]).map((key)=>namePlanet(key,lang)).join(" · ");
    return {title:title[lang==="gu"?0:lang==="hi"?1:2],planets};
  }

  function renderAdvanced(chart, lang) {
    const target=document.getElementById("tab-advanced");
    if(!target) return;
    const a=chart.advanced||calculate(chart);
    const strengthRows=PLANETS.map((key)=>{
      const item=a.strengths[key];
      const notes=[];
      if(item.combust) notes.push(choose(lang,"અસ્ત નજીક","अस्त के निकट","Near combustion"));
      if(item.retrograde) notes.push(choose(lang,"વક્રી","वक्री","Retrograde"));
      if(a.vargas.D9.planets[key].vargottama) notes.push(choose(lang,"D9 વર્ગોત્તમ","D9 वर्गोत्तम","D9 Vargottama"));
      return `<tr><td class="planet-name">${namePlanet(key,lang)}</td><td>${dignityLabel(item.dignity,lang)}</td><td>${chart.planets[key].house}</td><td><div class="strength-meter"><span style="width:${item.score}%"></span></div><b>${item.score}/100 · ${strengthLabel(item.score,lang)}</b></td><td>${notes.join(" · ")||"—"}</td></tr>`;
    }).join("");
    const antarRows=a.dashaDepth.antar.map((p)=>`<tr class="${p===a.dashaDepth.currentAntar?"current-row":""}"><td>${namePlanet(p.lord,lang)}</td><td>${formatDate(p.start,lang)}</td><td>${formatDate(p.end,lang)}</td><td>${p===a.dashaDepth.currentAntar?choose(lang,"હાલ ચાલુ","वर्तमान","Current"):"—"}</td></tr>`).join("");
    const pratyantarRows=a.dashaDepth.pratyantar.map((p)=>`<tr class="${p===a.dashaDepth.currentPratyantar?"current-row":""}"><td>${namePlanet(p.lord,lang)}</td><td>${formatDate(p.start,lang)}</td><td>${formatDate(p.end,lang)}</td><td>${p===a.dashaDepth.currentPratyantar?choose(lang,"હાલ ચાલુ","वर्तमान","Current"):"—"}</td></tr>`).join("");
    const transitRows=PLANETS.map((key)=>{const item=a.transits.planets[key];return `<tr><td class="planet-name">${namePlanet(key,lang)}</td><td>${nameSign(item.sign,lang)} · ${degreeText(item.longitude)}</td><td>${item.fromLagna}</td><td>${item.fromMoon}</td><td>${[1,2,5,7,9,11].includes(item.fromMoon)?choose(lang,"સહાયક ઝુકાવ","सहायक झुकाव","Supportive tendency"):[6,8,12].includes(item.fromMoon)?choose(lang,"જાગૃતિ જરૂરી","सावधानी आवश्यक","Needs awareness"):choose(lang,"મિશ્ર","मिश्रित","Mixed")}</td></tr>`;}).join("");
    const ashtaRows=CLASSICAL.map((key)=>`<tr><td class="planet-name">${namePlanet(key,lang)}</td>${a.ashtakavarga.bav[key].map((n)=>`<td>${n}</td>`).join("")}<td><b>${a.ashtakavarga.bav[key].reduce((x,y)=>x+y,0)}</b></td></tr>`).join("");
    const savRow=`<tr class="sav-row"><td>${choose(lang,"સર્વાષ્ટકવર્ગ","सर्वाष्टकवर्ग","Sarvashtakavarga")}</td>${a.ashtakavarga.sav.map((n)=>`<td><b>${n}</b></td>`).join("")}<td><b>${a.ashtakavarga.total}</b></td></tr>`;
    const vargaCards=VARGAS.map((v)=>{const data=a.vargas[v.key];const ascLord=LORD_KEYS[data.ascSign],lord=data.planets[ascLord];return `<article class="varga-card"><div class="varga-card-head"><div><small>${v.key}</small><h4>${v[lang]} · ${v[lang+"Use"]}</h4></div><span>${nameSign(data.ascSign,lang)}</span></div>${vargaChartHtml(data,lang)}<p>${choose(lang,"વર્ગ લગ્નનો સ્વામી","वर्ग लग्न का स्वामी","Varga ascendant lord")} ${namePlanet(ascLord,lang)} ${lord.house}${choose(lang,"મા ભાવમાં","वें भाव में","th house")}; ${dignityLabel(lord.dignity,lang)}.</p></article>`;}).join("");
    const yogaCards=a.yogas.found.length?a.yogas.found.map((item)=>{const label=advancedYogaLabel(item,lang);return `<article><strong>${label.title}</strong><span>${label.planets}</span><p>${choose(lang,"આ સંકેતનું ફળ સંબંધિત ગ્રહોની દશા, બળ અને ભાવસ્થિતિ સાથે જ નક્કી કરવું.","इस संकेत का फल संबंधित ग्रहों की दशा, शक्ति और भावस्थिति के साथ ही तय करें।","Judge this indication only with the planets’ strength, houses and operating dasha.")}</p></article>`;}).join(""):`<article><strong>${choose(lang,"મુખ્ય વધારાનો યોગ મળ્યો નથી","कोई प्रमुख अतिरिक्त योग नहीं","No major additional yoga detected")}</strong><p>${choose(lang,"સંપૂર્ણ નિર્ણય માટે સમગ્ર કુંડળી જોવી.","पूर्ण निर्णय के लिए पूरी कुंडली देखें।","Use the whole chart for a final judgement.")}</p></article>`;
    const m=a.yogas.manglik;
    const manglikText=[`${choose(lang,"લગ્ન","लग्न","Ascendant")}: ${m.lagna.house}`,`${namePlanet("Moon",lang)}: ${m.moon.house}`,`${namePlanet("Venus",lang)}: ${m.venus.house}`].join(" · ");
    const sensitive=a.timeSensitivity.minus5!==a.timeSensitivity.exact||a.timeSensitivity.plus5!==a.timeSensitivity.exact;
    const j=a.jaimini;
    target.innerHTML=`
      <div class="advanced-hero"><div><small>${choose(lang,"એક જ જગ્યાએ ઊંડું જ્યોતિષ વિશ્લેષણ","एक ही स्थान पर गहन ज्योतिष विश्लेषण","Deep Jyotish analysis in one place")}</small><strong>${choose(lang,"ગ્રહબળ, દશા, ગોચર, અષ્ટકવર્ગ અને વર્ગકુંડળી","ग्रहबल, दशा, गोचर, अष्टकवर्ग और वर्ग कुंडली","Planet strength, dasha, transits, Ashtakavarga and Vargas")}</strong></div><p>${choose(lang,"ગણતરી અને અર્થઘટન અલગ રાખવામાં આવ્યા છે. જ્યાં સંપૂર્ણ ષડ્બળ માટે જરૂરી ખગોળીય ઘટકો ઉપલબ્ધ નથી ત્યાં સ્કોરને સ્પષ્ટ રીતે સંકેતાત્મક બતાવ્યો છે.","गणना और व्याख्या अलग रखी गई है। जहां पूर्ण षड्बल के लिए आवश्यक खगोलीय घटक उपलब्ध नहीं हैं, वहां स्कोर को स्पष्ट रूप से संकेतात्मक बताया गया है।","Calculation and interpretation are separated. Where the astronomical inputs for full classical Shadbala are unavailable, the score is explicitly labelled indicative.")}</p></div>

      <div class="accuracy-grid">
        <article><small>${choose(lang,"અયનાંશ","अयनांश","Ayanamsha")}</small><strong>${choose(lang,"લાહિરી અનુમાન","लाहिरी अनुमान","Lahiri approximation")}</strong><p>${chart.ayanamsha.toFixed(5)}°</p></article>
        <article><small>${choose(lang,"રાશિ અને ભાવ","राशि और भाव","Zodiac and houses")}</small><strong>${choose(lang,"નિરયણ · Whole Sign","निरयण · Whole Sign","Sidereal · Whole Sign")}</strong><p>${choose(lang,"ભાવચલિત માટે Equal House","भावचलित के लिए Equal House","Equal House for Bhava Chalit")}</p></article>
        <article><small>${choose(lang,"ચંદ્ર નોડ","चंद्र नोड","Lunar node")}</small><strong>${choose(lang,"મીન રાહુ–કેતુ","मीन राहु–केतु","Mean Rahu–Ketu")}</strong><p>${choose(lang,"સોફ્ટવેર વિકલ્પ બદલાય તો અંશ બદલાઈ શકે","सॉफ्टवेयर विकल्प बदलने पर अंश बदल सकते हैं","Degrees may vary with software settings")}</p></article>
        <article class="${sensitive?"accuracy-warning":""}"><small>${choose(lang,"જન્મસમય સંવેદનશીલતા","जन्मसमय संवेदनशीलता","Birth-time sensitivity")}</small><strong>${sensitive?choose(lang,"±5 મિનિટે D9 બદલાય છે","±5 मिनट में D9 बदलता है","D9 changes within ±5 minutes"):choose(lang,"±5 મિનિટે D9 સ્થિર","±5 मिनट में D9 स्थिर","D9 stable within ±5 minutes")}</strong><p>${nameSign(a.timeSensitivity.minus5,lang)} · ${nameSign(a.timeSensitivity.exact,lang)} · ${nameSign(a.timeSensitivity.plus5,lang)}</p></article>
      </div>

      <h3 class="section-title">${choose(lang,"ગ્રહબળ — સંકેતાત્મક સંયુક્ત સ્કોર","ग्रहबल — संकेतात्मक संयुक्त स्कोर","Planet strength — indicative composite score")}</h3>
      <div class="table-wrap"><table><thead><tr><th>${choose(lang,"ગ્રહ","ग्रह","Planet")}</th><th>${choose(lang,"અવસ્થા","स्थिति","Dignity")}</th><th>${choose(lang,"ભાવ","भाव","House")}</th><th>${choose(lang,"સ્કોર","स्कोर","Score")}</th><th>${choose(lang,"વિશેષ સ્થિતિ","विशेष स्थिति","Special state")}</th></tr></thead><tbody>${strengthRows}</tbody></table></div>
      <p class="legend-note">${choose(lang,"આ પરંપરાગત ષડ્બળનો રૂપા-સ્કોર નથી. રાશિ અવસ્થા, ભાવ, દિગ્બળ સંકેત, વક્રી/અસ્ત સ્થિતિ અને D9–D10 આધાર પરથી બનાવેલો પારદર્શક સહાયક સ્કોર છે.","यह पारंपरिक षड्बल का रूपा-स्कोर नहीं है। यह राशि, भाव, दिग्बल संकेत, वक्री/अस्त स्थिति और D9–D10 समर्थन पर आधारित पारदर्शी सहायक स्कोर है।","This is not classical Shadbala in rupas. It is a transparent aid built from dignity, house, directional indication, retrograde/combust state and D9–D10 support.")}</p>

      <h3 class="section-title">${choose(lang,"વિમશોત્તરી દશાના સંપૂર્ણ સ્તર","विंशोत्तरी दशा के विस्तृत स्तर","Detailed Vimshottari dasha levels")}</h3>
      <div class="advanced-two-col"><section><h4>${choose(lang,"વર્તમાન મહાદશાની તમામ અંતર્દશા","वर्तमान महादशा की सभी अंतर्दशाएं","All Antardashas in the current Mahadasha")}</h4><div class="table-wrap"><table><thead><tr><th>${choose(lang,"સ્વામી","स्वामी","Lord")}</th><th>${choose(lang,"શરૂઆત","आरंभ","Start")}</th><th>${choose(lang,"અંત","अंत","End")}</th><th></th></tr></thead><tbody>${antarRows}</tbody></table></div></section><section><h4>${choose(lang,"વર્તમાન અંતર્દશાની પ્રત્યંતરદશા","वर्तमान अंतर्दशा की प्रत्यंतरदशाएं","Pratyantardashas in the current Antardasha")}</h4><div class="table-wrap"><table><thead><tr><th>${choose(lang,"સ્વામી","स्वामी","Lord")}</th><th>${choose(lang,"શરૂઆત","आरंभ","Start")}</th><th>${choose(lang,"અંત","अंत","End")}</th><th></th></tr></thead><tbody>${pratyantarRows}</tbody></table></div></section></div>

      <h3 class="section-title">${choose(lang,"વર્તમાન ગોચર — લગ્ન અને ચંદ્રથી","वर्तमान गोचर — लग्न और चंद्र से","Current transits — from Ascendant and Moon")}</h3>
      <div class="table-wrap"><table><thead><tr><th>${choose(lang,"ગ્રહ","ग्रह","Planet")}</th><th>${choose(lang,"વર્તમાન રાશિ","वर्तमान राशि","Current sign")}</th><th>${choose(lang,"લગ્નથી ભાવ","लग्न से भाव","From Ascendant")}</th><th>${choose(lang,"ચંદ્રથી ભાવ","चंद्र से भाव","From Moon")}</th><th>${choose(lang,"સામાન્ય વલણ","सामान्य प्रवृत्ति","General tendency")}</th></tr></thead><tbody>${transitRows}</tbody></table></div>
      <p class="legend-note">${choose(lang,`ગોચર તારીખ: ${formatDate(a.transits.date,lang)}. દશા અને અષ્ટકવર્ગ સાથે જોવાથી જ સમયનું વજન નક્કી કરવું.`,`गोचर तिथि: ${formatDate(a.transits.date,lang)}। समय का निर्णय दशा और अष्टकवर्ग के साथ करें।`,`Transit date: ${formatDate(a.transits.date,lang)}. Judge timing together with dasha and Ashtakavarga.`)}</p>

      <h3 class="section-title">${choose(lang,"ભિન્નાષ્ટકવર્ગ અને સર્વાષ્ટકવર્ગ","भिन्नाष्टकवर्ग और सर्वाष्टकवर्ग","Bhinnashtakavarga and Sarvashtakavarga")}</h3>
      <div class="table-wrap ashtaka-table"><table><thead><tr><th>${choose(lang,"ગ્રહ / રાશિ","ग्रह / राशि","Planet / Sign")}</th>${SIGN_NAMES[lang].map((s)=>`<th>${s}</th>`).join("")}<th>${choose(lang,"કુલ","कुल","Total")}</th></tr></thead><tbody>${ashtaRows}${savRow}</tbody></table></div>
      <p class="legend-note">${choose(lang,"વધુ બિંદુ ધરાવતી રાશિ/ભાવ સામાન્ય રીતે ગોચર દરમિયાન વધુ સહાયક શક્તિ આપે છે. સર્વાષ્ટકવર્ગનો કુલ પરંપરાગત invariant 337 રહે છે.","अधिक बिंदु वाली राशि/भाव सामान्यतः गोचर में अधिक समर्थन देता है। सर्वाष्टकवर्ग का पारंपरिक कुल 337 रहता है।","A sign/house with more points is generally better supported during transit. The classical Sarvashtakavarga grand total remains 337.")}</p>

      <h3 class="section-title">${choose(lang,"મુખ્ય વર્ગકુંડળીઓ","मुख्य वर्ग कुंडलियां","Key divisional charts")}</h3>
      <div class="varga-grid">${vargaCards}</div>
      <p class="legend-note">${choose(lang,"D24 અને D60 માટે અલગ પરંપરામાં નિયમભેદ જોવા મળે છે. D60ને માત્ર અત્યંત ચોક્કસ જન્મસમય સાથે જ મહત્ત્વ આપવું.","D24 और D60 के नियम अलग परंपराओं में बदल सकते हैं। D60 को केवल अत्यंत सटीक जन्मसमय के साथ महत्त्व दें।","D24 and D60 conventions can vary by tradition. Give D60 weight only when the birth time is extremely accurate.")}</p>

      <h3 class="section-title">${choose(lang,"જૈમિની અને લગ્નના સૂક્ષ્મ સંકેતો","जैमिनी और विवाह के सूक्ष्म संकेत","Jaimini and subtle relationship indicators")}</h3>
      <div class="jaimini-grid">
        ${statCard(choose(lang,"આત્મકારક","आत्मकारक","Atmakaraka"),namePlanet(j.atmakaraka.key,lang),`${j.atmakaraka.degrees.toFixed(2)}°`,"AK")}
        ${statCard(choose(lang,"દારાકારક","दाराकारक","Darakaraka"),namePlanet(j.darakaraka.key,lang),`${j.darakaraka.degrees.toFixed(2)}°`,"DK")}
        ${statCard(choose(lang,"અરુઢ લગ્ન","आरूढ़ लग्न","Arudha Lagna"),nameSign(j.arudhaLagna,lang),choose(lang,"જાહેર છબી અને પ્રભાવ","सार्वजनिक छवि और प्रभाव","Public image and projection"),"AL")}
        ${statCard(choose(lang,"ઉપપદ લગ્ન","उपपद लग्न","Upapada Lagna"),nameSign(j.upapada,lang),choose(lang,"લગ્નબંધનનો જૈમિની સંકેત","विवाह बंधन का जैमिनी संकेत","Jaimini relationship indicator"),"UL")}
      </div>

      <h3 class="section-title">${choose(lang,"વિસ્તૃત યોગ અને મંગળદોષ તપાસ","विस्तृत योग और मंगल दोष जांच","Expanded yogas and Manglik check")}</h3>
      <div class="advanced-yoga-grid">${yogaCards}<article><strong>${choose(lang,"મંગળ સ્થિતિ — ત્રણ આધારથી","मंगल स्थिति — तीन आधारों से","Mars position from three references")}</strong><span>${manglikText}</span><p>${choose(lang,"લગ્ન, ચંદ્ર અને શુક્રથી 1, 2, 4, 7, 8 અથવા 12મા ભાવમાં મંગળ હોય તો પરંપરાગત તપાસ થાય છે; ભંગના નિયમો અને જીવનસાથીની કુંડળી વગર અંતિમ નિર્ણય ન કરવો.","लग्न, चंद्र और शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में मंगल होने पर पारंपरिक जांच होती है; भंग नियम और साथी की कुंडली के बिना अंतिम निर्णय न लें।","Traditional Manglik screening checks Mars in houses 1, 2, 4, 7, 8 or 12 from Ascendant, Moon and Venus. Do not conclude without cancellation rules and the partner’s chart.")}</p></article></div>
    `;
  }

  const NAKSHATRA_NAMES = {
    hi:["अश्विनी","भरणी","कृत्तिका","रोहिणी","मृगशीर्ष","आर्द्रा","पुनर्वसु","पुष्य","आश्लेषा","मघा","पूर्व फाल्गुनी","उत्तर फाल्गुनी","हस्त","चित्रा","स्वाती","विशाखा","अनुराधा","ज्येष्ठा","मूल","पूर्वाषाढ़ा","उत्तराषाढ़ा","श्रवण","धनिष्ठा","शतभिषा","पूर्व भाद्रपद","उत्तर भाद्रपद","रेवती"],
    en:["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"]
  };
  const TITHI_NAMES = {
    hi:["प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","पूर्णिमा","प्रतिपदा","द्वितीया","तृतीया","चतुर्थी","पंचमी","षष्ठी","सप्तमी","अष्टमी","नवमी","दशमी","एकादशी","द्वादशी","त्रयोदशी","चतुर्दशी","अमावस्या"],
    en:["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"]
  };
  const YOGA_GU=["વિષ્કંભ","પ્રીતિ","આયુષ્માન","સૌભાગ્ય","શોભન","અતિગંડ","સુકર્મા","ધૃતિ","શૂલ","ગંડ","વૃદ્ધિ","ધ્રુવ","વ્યાઘાત","હર્ષણ","વજ્ર","સિદ્ધિ","વ્યતીપાત","વરીયાન","પરિઘ","શિવ","સિદ્ધ","સાધ્ય","શુભ","શુક્લ","બ્રહ્મ","ઇન્દ્ર","વૈધૃતિ"];
  const YOGA_NAMES={
    hi:["विष्कंभ","प्रीति","आयुष्मान","सौभाग्य","शोभन","अतिगंड","सुकर्मा","धृति","शूल","गंड","वृद्धि","ध्रुव","व्याघात","हर्षण","वज्र","सिद्धि","व्यतीपात","वरीयान","परिघ","शिव","सिद्ध","साध्य","शुभ","शुक्ल","ब्रह्म","इंद्र","वैधृति"],
    en:["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"]
  };
  const VARA_NAMES={hi:["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],en:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]};
  const KARANA_NAMES={
    "બવ":{hi:"बव",en:"Bava"},"બાલવ":{hi:"बालव",en:"Balava"},"કૌલવ":{hi:"कौलव",en:"Kaulava"},"તૈતિલ":{hi:"तैतिल",en:"Taitila"},"ગર":{hi:"गर",en:"Gara"},"વણિજ":{hi:"वणिज",en:"Vanija"},"વિષ્ટિ":{hi:"विष्टि",en:"Vishti"},
    "કિંસ્તુઘ્ન":{hi:"किंस्तुघ्न",en:"Kimstughna"},"શકુની":{hi:"शकुनि",en:"Shakuni"},"ચતુષ્પદ":{hi:"चतुष्पद",en:"Chatushpada"},"નાગ":{hi:"नाग",en:"Naga"}
  };
  const ASC_ALT={
    hi:["सीधा, स्वतंत्र और पहल करने वाला स्वभाव","स्थिर, व्यावहारिक और सुरक्षा को महत्त्व देने वाला स्वभाव","जिज्ञासु, संवादप्रिय और बहुमुखी स्वभाव","संवेदनशील, रक्षक और परिवार-केंद्रित स्वभाव","आत्मसम्मानी, रचनात्मक और नेतृत्वप्रिय स्वभाव","विश्लेषक, व्यवस्थित और सुधारप्रिय स्वभाव","संतुलित, संबंध-केंद्रित और न्यायप्रिय स्वभाव","गहरा, दृढ़ और परिवर्तनशील स्वभाव","आशावादी, ज्ञानप्रिय और स्वतंत्र स्वभाव","जिम्मेदार, धैर्यवान और लक्ष्य-केंद्रित स्वभाव","मौलिक, स्वतंत्र और भविष्य-दृष्टि वाला स्वभाव","करुणाशील, कल्पनाशील और अंतर्ज्ञानी स्वभाव"],
    en:["direct, independent and ready to initiate","steady, practical and security-oriented","curious, communicative and versatile","sensitive, protective and family-oriented","proud, creative and leadership-oriented","analytical, organised and improvement-oriented","balanced, relational and fairness-oriented","intense, determined and transformative","optimistic, knowledge-seeking and freedom-loving","responsible, patient and goal-oriented","original, independent and future-focused","compassionate, imaginative and intuitive"]
  };
  const MOON_ALT={
    hi:["मन शीघ्र प्रतिक्रिया देता है; धैर्य लाभ देता है।","मन को स्थिरता और परिचित वातावरण से शांति मिलती है।","संवाद और मानसिक विविधता आवश्यक रहती है।","परिवार और भावनात्मक सुरक्षा मन को गहराई से प्रभावित करते हैं।","मान्यता और रचनात्मक अभिव्यक्ति से मन प्रसन्न होता है।","मन विश्लेषक है; अत्यधिक सोच को योजना में बदलना उपयोगी है।","संतुलित संबंध और शांत वातावरण आवश्यक हैं।","भावनाएं गहरी हैं; विश्वास बनने में समय लग सकता है।","सीखना, यात्रा और स्वतंत्रता मन को ऊर्जा देते हैं।","मन जिम्मेदारी स्वीकार करता है, पर भावना व्यक्त करने में समय ले सकता है।","विचार स्वतंत्र और भविष्य-केंद्रित हो सकते हैं।","संवेदनशीलता और कल्पना ऊंची है; स्पष्ट सीमाएं आवश्यक हैं।"],
    en:["The mind reacts quickly; patience is helpful.","The mind settles through stability and familiar surroundings.","Conversation and mental variety are essential.","Family and emotional security strongly shape the mind.","Recognition and creative expression nourish the mind.","The mind analyses details; turn overthinking into planning.","Balanced relationships and a calm environment are important.","Feelings run deep and trust may take time.","Learning, travel and freedom energise the mind.","The mind accepts responsibility but may express feelings slowly.","Thought can be independent and future-focused.","Sensitivity and imagination are high; clear boundaries help."]
  };

  function localPanchang(chart, lang) {
    const tithiIndex=Math.max(0,(chart.panchang.tithiNumber||1)-1);
    const yogaIndex=Math.max(0,YOGA_GU.indexOf(chart.panchang.yoga));
    const [y,m,d]=chart.input.date.split("-").map(Number);
    return {
      tithi:TITHI_NAMES[lang][tithiIndex],
      paksha:tithiIndex<15?(lang==="hi"?"शुक्ल पक्ष":"Waxing fortnight"):(lang==="hi"?"कृष्ण पक्ष":"Waning fortnight"),
      yoga:YOGA_NAMES[lang][yogaIndex],
      vara:VARA_NAMES[lang][new Date(Date.UTC(y,m-1,d)).getUTCDay()],
      nakshatra:NAKSHATRA_NAMES[lang][chart.moonNak.index],
      karana:(KARANA_NAMES[chart.panchang.karana]||{})[lang]||chart.panchang.karana
    };
  }
  function currentDashaAt(chart,date) {
    const period=chart.dasha.periods.find((p)=>date>=p.start&&date<p.end)||chart.dasha.periods[chart.dasha.periods.length-1];
    const key=GU_TO_KEY[period.lord];
    const antar=childrenOfPeriod(period.start,period.end,key);
    const sub=antar.find((p)=>date>=p.start&&date<p.end)||antar[antar.length-1];
    return {period,key,sub};
  }
  function transitSignAt(key,date) {
    const ayanamsha=lahiriAyanamsha(date);
    if(key==="Rahu") return signOf(norm(meanNodeLongitude(date)-ayanamsha));
    if(key==="Ketu") return signOf(norm(meanNodeLongitude(date)-ayanamsha+180));
    return signOf(norm(tropicalPlanet(key,date)-ayanamsha));
  }
  function localizedYearForecast(chart,year,lang) {
    const months=[];
    for(let month=0;month<12;month++){
      const date=new Date(Date.UTC(year,month,15,6,30));
      const j=((transitSignAt("Jupiter",date)-chart.moonSign+12)%12)+1;
      const s=((transitSignAt("Saturn",date)-chart.moonSign+12)%12)+1;
      const r=((transitSignAt("Rahu",date)-chart.moonSign+12)%12)+1;
      const d=currentDashaAt(chart,date);
      let score=0;
      score += [2,5,7,9,11].includes(j)?2:-1;
      score += [3,6,11].includes(s)?1:[12,1,2].includes(s)?-2:0;
      score += [3,6,10,11].includes(r)?1:0;
      const lordPlanet=chart.planets[d.key];
      if(lordPlanet) score += [1,4,5,7,9,10,11].includes(lordPlanet.house)?1:-1;
      const label=score>=3?choose(lang,"ખૂબ અનુકૂળ","बहुत अनुकूल","Very supportive"):score>=1?choose(lang,"અનુકૂળ","अनुकूल","Supportive"):score>=-1?choose(lang,"મિશ્ર","मिश्रित","Mixed"):choose(lang,"સાવધાની","सावधानी","Caution");
      const text=[12,1,2].includes(s)?choose(lang,"જવાબદારી, મનનો ભાર અને ધીરજ મુખ્ય રહેશે.","जिम्मेदारी, मानसिक दबाव और धैर्य प्रमुख रहेंगे।","Responsibility, mental load and patience remain central."):[2,5,7,9,11].includes(j)?choose(lang,"વિકાસ, શીખવા અને સહયોગની તક મળી શકે છે.","विकास, सीखने और सहयोग के अवसर मिल सकते हैं।","Opportunities for growth, learning and support may appear."):score<0?choose(lang,"ખર્ચ, દિનચર્યા અને ઉતાવળના નિર્ણયમાં સાવધાની રાખો.","खर्च, दिनचर्या और जल्दबाजी के निर्णयों में सावधानी रखें।","Watch expenses, routine and impulsive decisions."):choose(lang,"નિયમિત પ્રયત્ન અને સ્પષ્ટ વાતચીતથી પ્રગતિ થઈ શકે છે.","नियमित प्रयास और स्पष्ट संवाद से प्रगति हो सकती है।","Steady effort and clear communication can support progress.");
      months.push({month,score,label,text,dasha:d});
    }
    return months;
  }
  function monthName(index,lang){return new Intl.DateTimeFormat(lang==="hi"?"hi-IN":lang==="en"?"en-GB":"gu-IN",{month:"long",timeZone:"UTC"}).format(new Date(Date.UTC(2024,index,1)));}
  function localMarriageWindows(chart,lang) {
    const focus=new Set([GU_TO_KEY[chart.marriage.seventhLordName],"Venus","Jupiter"]),now=new Date(),cutoff=addDays(now,18*365.2425),rows=[];
    chart.dasha.periods.forEach((period)=>{
      if(period.end<=now||period.start>=cutoff)return;
      const pKey=GU_TO_KEY[period.lord];
      childrenOfPeriod(period.start,period.end,pKey).forEach((sub)=>{
        if(sub.end<=now||sub.start>=cutoff)return;
        let score=(focus.has(pKey)?1:0)+(focus.has(sub.lord)?2:0);
        const middle=new Date((Math.max(sub.start,now)+Math.min(sub.end,cutoff))/2);
        const jHouse=((transitSignAt("Jupiter",middle)-chart.ascSign+12)%12)+1;
        if([1,5,7,9,11].includes(jHouse))score++;
        if(score>=2)rows.push({period:pKey,sub:sub.lord,start:sub.start<now?now:sub.start,end:sub.end>cutoff?cutoff:sub.end,score});
      });
    });
    return rows.sort((a,b)=>a.start-b.start||b.score-a.score).slice(0,5);
  }

  function renderLocalizedSummary(chart,lang) {
    const p=chart.planets,a=chart.advanced;
    const strongest=PLANETS.map((key)=>a.strengths[key]).sort((x,y)=>y.score-x.score).slice(0,3).map((x)=>namePlanet(x.key,lang)).join(" · ");
    document.getElementById("tab-summary").innerHTML=`<div class="stats-grid">${statCard(lang==="hi"?"लग्न":"Ascendant",nameSign(chart.ascSign,lang),`${degreeText(chart.siderealAsc)} · ${lang==="hi"?"स्वामी":"Lord"} ${namePlanet(LORD_KEYS[chart.ascSign],lang)}`,"△")}${statCard(lang==="hi"?"चंद्र राशि":"Moon sign",nameSign(chart.moonSign,lang),degreeText(p.Moon.longitude),"☾")}${statCard(lang==="hi"?"जन्म नक्षत्र":"Birth Nakshatra",NAKSHATRA_NAMES[lang][chart.moonNak.index],`${lang==="hi"?"पाद":"Pada"} ${chart.moonNak.pada}`,"✦")}${statCard(lang==="hi"?"वर्तमान महादशा":"Current Mahadasha",namePlanet(GU_TO_KEY[chart.dasha.current.lord],lang),`${lang==="hi"?"तक":"until"} ${formatDate(chart.dasha.current.end,lang)}`,"◉")}</div>
      <h3 class="section-title">${lang==="hi"?"मुख्य अध्ययन":"Core reading"}</h3><div class="insight-grid"><article class="insight"><strong>${lang==="hi"?"व्यक्तित्व":"Personality"}</strong><p>${lang==="hi"?"नवजात लग्न का स्वभाव":"The Ascendant points to a temperament that is"} ${ASC_ALT[lang][chart.ascSign]}.</p></article><article class="insight"><strong>${lang==="hi"?"मन":"Mind"}</strong><p>${MOON_ALT[lang][chart.moonSign]}</p></article><article class="insight"><strong>${lang==="hi"?"सबसे समर्थ ग्रह":"Strongest indications"}</strong><p>${strongest}</p></article><article class="insight"><strong>${lang==="hi"?"वर्तमान फोकस":"Current focus"}</strong><p>${namePlanet(GU_TO_KEY[chart.dasha.current.lord],lang)} / ${namePlanet(a.dashaDepth.currentAntar.lord,lang)} / ${namePlanet(a.dashaDepth.currentPratyantar.lord,lang)}</p></article></div>
      <div class="method-box"><div><small>${lang==="hi"?"अयनांश":"Ayanamsha"}</small><strong>Lahiri ${chart.ayanamsha.toFixed(4)}°</strong></div><div><small>${lang==="hi"?"भाव पद्धति":"House system"}</small><strong>Whole Sign</strong></div><div><small>${lang==="hi"?"नोड":"Nodes"}</small><strong>${lang==="hi"?"मीन राहु–केतु":"Mean Rahu–Ketu"}</strong></div></div>`;
  }

  function renderLocalizedCharts(chart,lang) {
    const d1={division:1,ascSign:chart.ascSign,planets:{}};PLANETS.forEach((key)=>{d1.planets[key]={sign:chart.planets[key].sign};});
    document.getElementById("tab-charts").innerHTML=`<div class="charts-grid"><article class="chart-card"><h3>D1 — ${lang==="hi"?"राशि कुंडली":"Rasi chart"}</h3><p>${lang==="hi"?"जीवन की मूल संरचना":"The primary structure of life"}</p>${vargaChartHtml(d1,lang)}</article><article class="chart-card"><h3>D9 — ${lang==="hi"?"नवांश कुंडली":"Navamsa chart"}</h3><p>${lang==="hi"?"विवाह, धर्म और आंतरिक ग्रहबल":"Marriage, dharma and inner planetary strength"}</p>${vargaChartHtml(chart.advanced.vargas.D9,lang)}</article></div><p class="legend-note">${lang==="hi"?"पीले खाने में संबंधित वर्ग का लग्न दिखाया गया है। अन्य वर्ग कुंडलियां उन्नत टैब में उपलब्ध हैं।":"The yellow cell marks the ascendant of that divisional chart. Additional Vargas are available under Advanced."}</p>`;
  }

  function renderLocalizedPlanets(chart,lang) {
    const rows=PLANETS.map((key)=>{const p=chart.planets[key],s=chart.advanced.strengths[key];return `<tr><td class="planet-name">${namePlanet(key,lang)}</td><td>${nameSign(p.sign,lang)}</td><td>${degreeText(p.longitude)}</td><td>${NAKSHATRA_NAMES[lang][p.nakshatra.index]} · ${p.nakshatra.pada}</td><td>${p.house}</td><td>${dignityLabel(dignity(key,p.sign),lang)}</td><td>${s.score}/100</td></tr>`;}).join("");
    document.getElementById("tab-planets").innerHTML=`<div class="table-wrap"><table><thead><tr><th>${lang==="hi"?"ग्रह":"Planet"}</th><th>${lang==="hi"?"राशि":"Sign"}</th><th>${lang==="hi"?"अंश":"Degree"}</th><th>${lang==="hi"?"नक्षत्र / पाद":"Nakshatra / Pada"}</th><th>${lang==="hi"?"भाव":"House"}</th><th>${lang==="hi"?"अवस्था":"Dignity"}</th><th>${lang==="hi"?"संकेतात्मक बल":"Indicative strength"}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderLocalizedHouses(chart,lang) {
    const cards=chart.houseAnalysis.map((item,index)=>{const lordKey=GU_TO_KEY[item.lordName],occupants=item.occupants.map((key)=>namePlanet(key,lang)).join(", ")||(lang==="hi"?"कोई ग्रह नहीं":"No planet"),aspects=item.aspects.map((key)=>namePlanet(key,lang)).join(", ")||(lang==="hi"?"मुख्य पूर्ण दृष्टि नहीं":"No major full aspect");return `<details class="house-card ${item.tone}" ${index===0?"open":""}><summary><span class="house-number">${item.house}</span><span><small>${lang==="hi"?`${item.house}वां भाव`:`House ${item.house}`}</small><strong>${HOUSE_TITLES[lang][index]}</strong></span><em>${toneLabel(item.tone,lang)}</em></summary><div class="house-body"><div class="house-structure"><span><small>${lang==="hi"?"राशि":"Sign"}</small><b>${nameSign(item.sign,lang)}</b></span><span><small>${lang==="hi"?"भावेश":"Lord"}</small><b>${namePlanet(lordKey,lang)}</b></span><span><small>${lang==="hi"?"भावेश का स्थान":"Lord placement"}</small><b>${item.lordPlanet.house}</b></span><span><small>${lang==="hi"?"ग्रह":"Occupants"}</small><b>${occupants}</b></span><span><small>${lang==="hi"?"दृष्टि":"Aspects"}</small><b>${aspects}</b></span></div><div class="house-reading-grid"><section class="house-reading-block wide"><h4>${lang==="hi"?"भाव का अर्थ":"House meaning"}</h4><p>${HOUSE_MEANINGS[lang][index]}</p></section><section class="house-reading-block"><h4>${lang==="hi"?"आपकी स्थिति":"Your placement"}</h4><p>${lang==="hi"?`इस भाव में ${nameSign(item.sign,lang)} राशि है। इसके स्वामी ${namePlanet(lordKey,lang)} ${item.lordPlanet.house}वें भाव में हैं।`:`This house contains ${nameSign(item.sign,lang)}. Its lord ${namePlanet(lordKey,lang)} occupies house ${item.lordPlanet.house}.`}</p></section><section class="house-reading-block"><h4>${lang==="hi"?"व्यावहारिक संकेत":"Practical indication"}</h4><p>${item.tone==="strong"?(lang==="hi"?"यह क्षेत्र सहयोगी है; नियमित प्रयास से इसकी क्षमता बढ़ाएं।":"This area is supported; strengthen it through consistent effort."):item.tone==="caution"?(lang==="hi"?"इस क्षेत्र में योजना, दस्तावेज और विशेषज्ञ सलाह को प्राथमिकता दें।":"Prioritise planning, documentation and relevant expert advice in this area."):(lang==="hi"?"फल मिश्रित है; सही समय और स्पष्ट संवाद महत्त्वपूर्ण रहेंगे।":"Results are mixed; timing and clear communication remain important.")}</p></section></div></div></details>`;}).join("");
    document.getElementById("tab-houses").innerHTML=`<div class="house-intro"><div><small>${lang==="hi"?"व्यक्तिगत फलादेश":"Personalised reading"}</small><strong>${lang==="hi"?"बारह भावों का विश्लेषण":"Analysis of all twelve houses"}</strong></div><p>${lang==="hi"?"प्रत्येक भाव खोलकर राशि, भावेश, ग्रह और दृष्टि देखें।":"Open each house to inspect its sign, lord, occupants and aspects."}</p></div><div class="house-list">${cards}</div>`;
  }

  function renderLocalizedNavamsa(chart,lang) {
    const d9=chart.advanced.vargas.D9,seventhSign=(d9.ascSign+6)%12,seventhLord=LORD_KEYS[seventhSign],seventhLordData=d9.planets[seventhLord],venus=d9.planets.Venus,jupiter=d9.planets.Jupiter;
    const houseRows=Array.from({length:12},(_,index)=>{const sign=(d9.ascSign+index)%12,lord=LORD_KEYS[sign],data=d9.planets[lord],occupants=PLANETS.filter((key)=>d9.planets[key].house===index+1).map((key)=>namePlanet(key,lang)).join(", ")||"—";return `<tr><td>${index+1}</td><td>${HOUSE_TITLES[lang][index]}</td><td>${nameSign(sign,lang)}</td><td>${namePlanet(lord,lang)} · ${data.house}</td><td>${occupants}</td></tr>`;}).join("");
    const comparisonRows=PLANETS.map((key)=>{const p=chart.planets[key],q=d9.planets[key],v=q.vargottama?(lang==="hi"?"वर्गोत्तम—मूल गुण स्थिर":"Vargottama—the core quality is reinforced"):["exalted","own"].includes(q.dignity)?(lang==="hi"?"समय के साथ आंतरिक शक्ति बढ़ती है":"Inner strength can mature with time"):q.dignity==="debilitated"?(lang==="hi"?"सचेत प्रयास और परिपक्वता आवश्यक":"Requires awareness and maturity"):(lang==="hi"?"मिश्रित; भाव और दशा के साथ देखें":"Mixed; judge with house and dasha");return `<tr><td class="planet-name">${namePlanet(key,lang)}</td><td>${nameSign(p.sign,lang)} · ${dignityLabel(dignity(key,p.sign),lang)}</td><td>${nameSign(q.sign,lang)} · ${dignityLabel(q.dignity,lang)}</td><td>${v}</td></tr>`;}).join("");
    document.getElementById("tab-navamsa").innerHTML=`<div class="navamsa-hero"><div><small>${lang==="hi"?"विवाह और आंतरिक ग्रहबल":"Marriage and inner planetary strength"}</small><strong>${lang==="hi"?"नवांश कुंडली (D9) का पूर्ण विश्लेषण":"Complete Navamsa (D9) analysis"}</strong></div><p>${lang==="hi"?"D9 को जन्मकुंडली D1 और दशा के साथ पढ़ें। जन्मसमय की थोड़ी त्रुटि D9 लग्न बदल सकती है।":"Read D9 together with D1 and dasha. A small birth-time error can change the D9 ascendant."}</p></div>
      <div class="stats-grid">${statCard(lang==="hi"?"नवांश लग्न":"D9 Ascendant",nameSign(d9.ascSign,lang),`${lang==="hi"?"स्वामी":"Lord"} ${namePlanet(LORD_KEYS[d9.ascSign],lang)}`,"D9")}${statCard(lang==="hi"?"सातवां भाव":"Seventh house",nameSign(seventhSign,lang),`${lang==="hi"?"स्वामी":"Lord"} ${namePlanet(seventhLord,lang)}`,"⑦")}${statCard(lang==="hi"?"D9 शुक्र":"D9 Venus",`${nameSign(venus.sign,lang)} · ${venus.house}`,dignityLabel(venus.dignity,lang),"♀")}${statCard(lang==="hi"?"D9 गुरु":"D9 Jupiter",`${nameSign(jupiter.sign,lang)} · ${jupiter.house}`,dignityLabel(jupiter.dignity,lang),"♃")}</div>
      <h3 class="section-title">${lang==="hi"?"मुख्य विवाह संकेत":"Core relationship indicators"}</h3><div class="navamsa-reading-grid"><article><h4>${lang==="hi"?"विवाह के बाद व्यक्तित्व":"Personality after commitment"}</h4><p>${lang==="hi"?"नवांश लग्न":"D9 ascendant"} ${nameSign(d9.ascSign,lang)}: ${ASC_ALT[lang][d9.ascSign]}.</p></article><article><h4>${lang==="hi"?"जीवनसाथी का संकेत":"Spouse indication"}</h4><p>${lang==="hi"?`${nameSign(seventhSign,lang)} राशि और ${namePlanet(seventhLord,lang)} स्वामी जीवनसाथी और संबंध की शैली को प्रभावित करते हैं।`:`${nameSign(seventhSign,lang)} and its lord ${namePlanet(seventhLord,lang)} colour the spouse indication and relationship style.`}</p></article><article><h4>${lang==="hi"?"सातवें भाव का स्वामी":"Seventh lord"}</h4><p>${namePlanet(seventhLord,lang)} · ${lang==="hi"?`${seventhLordData.house}वां भाव`:`house ${seventhLordData.house}`} · ${dignityLabel(seventhLordData.dignity,lang)}.</p></article><article><h4>${lang==="hi"?"प्रेम और दांपत्य":"Love and marital harmony"}</h4><p>${lang==="hi"?`शुक्र ${venus.house}वें भाव में ${nameSign(venus.sign,lang)} राशि में है।`:`Venus occupies house ${venus.house} in ${nameSign(venus.sign,lang)}.`}</p></article></div>
      <h3 class="section-title">${lang==="hi"?"12 नवांश भाव":"Twelve Navamsa houses"}</h3><div class="table-wrap"><table><thead><tr><th>${lang==="hi"?"भाव":"House"}</th><th>${lang==="hi"?"विषय":"Theme"}</th><th>${lang==="hi"?"राशि":"Sign"}</th><th>${lang==="hi"?"भावेश / स्थान":"Lord / placement"}</th><th>${lang==="hi"?"ग्रह":"Occupants"}</th></tr></thead><tbody>${houseRows}</tbody></table></div>
      <h3 class="section-title">${lang==="hi"?"D1 और D9 तुलना":"D1–D9 comparison"}</h3><div class="table-wrap"><table><thead><tr><th>${lang==="hi"?"ग्रह":"Planet"}</th><th>D1</th><th>D9</th><th>${lang==="hi"?"संयुक्त अर्थ":"Combined indication"}</th></tr></thead><tbody>${comparisonRows}</tbody></table></div>
      <p class="legend-note">${lang==="hi"?"नवांश अकेले विवाह की तारीख, जीवनसाथी का नाम या विवाह की निश्चित संख्या नहीं बताता।":"Navamsa alone does not determine an exact wedding date, a spouse’s name or a fixed number of marriages."}</p>`;
  }

  function renderLocalizedDasha(chart,lang) {
    const a=chart.advanced.dashaDepth;
    const mahaRows=chart.dasha.periods.map((p)=>`<div class="timeline-item ${p===chart.dasha.current?"current":""}"><strong>${namePlanet(GU_TO_KEY[p.lord],lang)} ${lang==="hi"?"महादशा":"Mahadasha"}</strong><span>${formatDate(p.start,lang)} — ${formatDate(p.end,lang)}</span>${p===chart.dasha.current?`<em>${lang==="hi"?"वर्तमान":"Current"}</em>`:""}</div>`).join("");
    const antarRows=a.antar.map((p)=>`<tr class="${p===a.currentAntar?"current-row":""}"><td>${namePlanet(p.lord,lang)}</td><td>${formatDate(p.start,lang)}</td><td>${formatDate(p.end,lang)}</td></tr>`).join("");
    const pratyRows=a.pratyantar.map((p)=>`<tr class="${p===a.currentPratyantar?"current-row":""}"><td>${namePlanet(p.lord,lang)}</td><td>${formatDate(p.start,lang)}</td><td>${formatDate(p.end,lang)}</td></tr>`).join("");
    document.getElementById("tab-dasha").innerHTML=`<div class="current-dasha"><div><small>${lang==="hi"?"वर्तमान महादशा":"Current Mahadasha"}</small><strong>${namePlanet(GU_TO_KEY[chart.dasha.current.lord],lang)} · ${formatDate(chart.dasha.current.end,lang)}</strong></div><div><small>${lang==="hi"?"अंतर / प्रत्यंतर":"Antar / Pratyantar"}</small><strong>${namePlanet(a.currentAntar.lord,lang)} · ${namePlanet(a.currentPratyantar.lord,lang)}</strong></div></div><h3 class="section-title">${lang==="hi"?"महादशा क्रम":"Mahadasha sequence"}</h3><div class="timeline">${mahaRows}</div><div class="advanced-two-col"><section><h4>${lang==="hi"?"अंतर्दशाएं":"Antardashas"}</h4><div class="table-wrap"><table><thead><tr><th>${lang==="hi"?"ग्रह":"Planet"}</th><th>${lang==="hi"?"आरंभ":"Start"}</th><th>${lang==="hi"?"अंत":"End"}</th></tr></thead><tbody>${antarRows}</tbody></table></div></section><section><h4>${lang==="hi"?"प्रत्यंतरदशाएं":"Pratyantardashas"}</h4><div class="table-wrap"><table><thead><tr><th>${lang==="hi"?"ग्रह":"Planet"}</th><th>${lang==="hi"?"आरंभ":"Start"}</th><th>${lang==="hi"?"अंत":"End"}</th></tr></thead><tbody>${pratyRows}</tbody></table></div></section></div>`;
  }

  function renderLocalizedFuture(chart,lang,selectedYear) {
    const year=selectedYear||new Date().getFullYear(),months=localizedYearForecast(chart,year,lang),avg=months.reduce((sum,m)=>sum+m.score,0)/12,best=[...months].sort((a,b)=>b.score-a.score).slice(0,3),care=[...months].sort((a,b)=>a.score-b.score).slice(0,3);
    const options=Array.from({length:9},(_,i)=>new Date().getFullYear()+i).map((y)=>`<option value="${y}" ${y===year?"selected":""}>${y}</option>`).join("");
    const monthCards=months.map((m)=>`<article class="month-card ${m.score>=1?"favorable":m.score<-1?"caution":"mixed"}"><div><strong>${monthName(m.month,lang)}</strong><span>${m.label}</span></div><p>${m.text}</p><small>${namePlanet(GU_TO_KEY[m.dasha.period.lord],lang)} / ${namePlanet(m.dasha.sub.lord,lang)}</small></article>`).join("");
    const target=document.getElementById("tab-future");
    target.innerHTML=`<div class="future-hero"><div><small>${lang==="hi"?"दशा और प्रमुख गोचर":"Dasha and major transits"}</small><strong>${year} · ${avg>=1?(lang==="hi"?"प्रगति का सहयोगी वर्ष":"A supportive year for progress"):avg<-1?(lang==="hi"?"पुनर्गठन और धैर्य का वर्ष":"A year for restructuring and patience"):(lang==="hi"?"मिश्रित वर्ष—समय का चयन आवश्यक":"A mixed year—timing matters")}</strong></div><label class="year-picker"><span>${lang==="hi"?"वर्ष":"Year"}</span><select id="future-year-localized">${options}</select></label></div><div class="period-highlights"><article class="good"><small>${lang==="hi"?"सहायक महीने":"Supportive months"}</small><strong>${best.map((m)=>monthName(m.month,lang)).join(" · ")}</strong></article><article class="care"><small>${lang==="hi"?"सावधानी के महीने":"Months needing care"}</small><strong>${care.map((m)=>monthName(m.month,lang)).join(" · ")}</strong></article></div><h3 class="section-title">${lang==="hi"?"मासिक संकेत":"Monthly indications"}</h3><div class="month-grid">${monthCards}</div><p class="future-disclaimer">${lang==="hi"?"यह निश्चित घटना की गारंटी नहीं है। बड़े वित्तीय, स्वास्थ्य, विवाह या करियर निर्णय में उपयुक्त विशेषज्ञ की सलाह भी लें।":"This is not a guarantee of a specific event. Seek appropriate professional advice for major financial, health, relationship or career decisions."}</p>`;
    target.querySelector("#future-year-localized")?.addEventListener("change",(event)=>renderLocalizedFuture(chart,lang,Number(event.target.value)));
  }

  function renderLocalizedMarriage(chart,lang) {
    const item=chart.marriage,a=chart.advanced,windows=localMarriageWindows(chart,lang),seventhLord=GU_TO_KEY[item.seventhLordName],d9Lord=GU_TO_KEY[item.d9SeventhLordName];
    const stability=toneLabel(item.stability.tone,lang),delay=toneLabel(item.delay.tone,lang),secondStart=toneLabel(item.remarriage.tone,lang);
    const occupants=item.occupants.map((key)=>namePlanet(key,lang)).join(", ")||"—",aspects=item.aspects.map((key)=>namePlanet(key,lang)).join(", ")||"—";
    const rows=windows.length?windows.map((w)=>`<tr><td>${namePlanet(w.period,lang)} / ${namePlanet(w.sub,lang)}</td><td>${formatDate(w.start,lang)}</td><td>${formatDate(w.end,lang)}</td><td>${lang==="hi"?"दशा और गुरु गोचर का संयुक्त समर्थन":"Combined dasha and Jupiter-transit support"}</td></tr>`).join(""):`<tr><td colspan="4">${lang==="hi"?"अगले 18 वर्षों में प्रमुख संयुक्त समय नहीं मिला; अधिक सूक्ष्म अध्ययन आवश्यक है।":"No major combined window was found in the next 18 years; finer analysis is needed."}</td></tr>`;
    document.getElementById("tab-marriage").innerHTML=`<div class="marriage-hero"><div><small>${lang==="hi"?"विवाह और संबंध का संयुक्त अध्ययन":"Combined relationship reading"}</small><strong>${stability}</strong><p>${lang==="hi"?"सातवां भाव, उसके स्वामी, शुक्र, गुरु, D9, दशा और गोचर को साथ पढ़ा गया है।":"The seventh house, its lord, Venus, Jupiter, D9, dasha and transits are read together."}</p></div><span class="marriage-probability ${item.remarriage.tone}">${lang==="hi"?"दूसरी शुरुआत का संकेत":"Second-start indication"}<br><b>${secondStart}</b></span></div><div class="marriage-stats"><article><small>${lang==="hi"?"सातवां भाव":"Seventh house"}</small><strong>${nameSign(item.seventhSign,lang)}</strong><p>${lang==="hi"?"स्वामी":"Lord"} ${namePlanet(seventhLord,lang)}</p></article><article><small>${lang==="hi"?"सातवें भाव का स्वामी":"Seventh lord"}</small><strong>${item.seventhLord.house}</strong><p>${nameSign(item.seventhLord.sign,lang)} · ${dignityLabel(dignity(seventhLord,item.seventhLord.sign),lang)}</p></article><article><small>${lang==="hi"?"ग्रह / दृष्टि":"Occupants / aspects"}</small><strong>${occupants}</strong><p>${aspects}</p></article><article><small>${lang==="hi"?"विलंब संकेत":"Delay indication"}</small><strong>${delay}</strong><p>${lang==="hi"?"शनि और सातवें भाव के आधार पर":"From Saturn and the seventh house"}</p></article><article><small>D9</small><strong>${namePlanet(d9Lord,lang)}</strong><p>${item.d9SeventhLordHouse} · ${dignityLabel(dignity(d9Lord,chart.advanced.vargas.D9.planets[d9Lord].sign),lang)}</p></article><article><small>${lang==="hi"?"उपपद लग्न":"Upapada Lagna"}</small><strong>${nameSign(a.jaimini.upapada,lang)}</strong><p>${lang==="hi"?"जैमिनी विवाह संकेत":"Jaimini relationship indicator"}</p></article></div><h3 class="section-title">${lang==="hi"?"विवाह के सहायक संभावित समय":"Indicative supportive marriage windows"}</h3><div class="table-wrap"><table><thead><tr><th>${lang==="hi"?"दशा":"Dasha"}</th><th>${lang==="hi"?"आरंभ":"Start"}</th><th>${lang==="hi"?"अंत":"End"}</th><th>${lang==="hi"?"आधार":"Basis"}</th></tr></thead><tbody>${rows}</tbody></table></div><p class="future-disclaimer">${lang==="hi"?"यह विवाह की निश्चित तारीख या विवाहों की संख्या तय नहीं करता। दूसरी शुरुआत का संकेत गंभीर संबंध, टूटी सगाई, अलगाव का चरण या पुनर्विवाह भी हो सकता है।":"This does not determine an exact wedding date or number of marriages. A second-start indication may describe another serious relationship, a broken engagement, a separation phase or remarriage."}</p>`;
  }

  function renderLocalizedPanchang(chart,lang) {
    const p=localPanchang(chart,lang),cards=[[lang==="hi"?"वार":"Weekday",p.vara],[lang==="hi"?"तिथि":"Tithi",p.tithi],[lang==="hi"?"पक्ष":"Paksha",p.paksha],[lang==="hi"?"नक्षत्र":"Nakshatra",`${p.nakshatra} · ${lang==="hi"?"पाद":"Pada"} ${chart.moonNak.pada}`],[lang==="hi"?"योग":"Yoga",p.yoga],[lang==="hi"?"करण":"Karana",p.karana.replace(/^करण: |^Karana: /,"")]];
    document.getElementById("tab-panchang").innerHTML=`<div class="panchang-grid">${cards.map(([l,v])=>`<article><small>${l}</small><strong>${v}</strong></article>`).join("")}</div><h3 class="section-title">${lang==="hi"?"जन्म नक्षत्र का संकेत":"Birth Nakshatra indication"}</h3><div class="reading-card"><p>${lang==="hi"?`${p.nakshatra} नक्षत्र, पाद ${chart.moonNak.pada}, स्वामी ${namePlanet(GU_TO_KEY[chart.moonNak.lord],lang)}। मन और दशा की शुरुआती दिशा में इसका विशेष महत्त्व है।`:`${p.nakshatra}, pada ${chart.moonNak.pada}, ruled by ${namePlanet(GU_TO_KEY[chart.moonNak.lord],lang)}. It is central to the mind pattern and the opening Vimshottari dasha.`}</p></div>`;
  }

  function localizedSignal(signal,lang) {
    const title=signal.title;
    if(title.includes("બુધાદિત્ય"))return [lang==="hi"?"बुधादित्य योग संकेत":"Budhaditya Yoga indication",lang==="hi"?"बुद्धि, योजना और अभिव्यक्ति साथ काम कर सकते हैं।":"Intellect, planning and expression can reinforce each other."];
    if(title.includes("ગજકેસરી"))return [lang==="hi"?"गजकेसरी योग संकेत":"Gajakesari Yoga indication",lang==="hi"?"ज्ञान, प्रतिष्ठा और सही समय पर सहयोग की संभावना।":"Potential for wisdom, reputation and timely support."];
    if(title.includes("ચંદ્ર–મંગળ"))return [lang==="hi"?"चंद्र–मंगल योग संकेत":"Chandra–Mangala indication",lang==="hi"?"भावना और क्रिया का मेल; जल्दबाजी पर नियंत्रण आवश्यक।":"Emotion and action combine; impulsiveness needs control."];
    if(title.includes("ગુરુ ચાંડાલ"))return [lang==="hi"?"गुरु–चांडाल संयोग":"Guru–Chandala conjunction",lang==="hi"?"मान्यताओं और सलाह को जांचकर स्वीकार करें।":"Examine beliefs and advice before accepting them."];
    if(title.includes("મંગળ દોષ"))return [lang==="hi"?"मंगल दोष का पारंपरिक संकेत":"Traditional Manglik indication",lang==="hi"?"साथी की कुंडली और भंग नियमों के साथ ही निर्णय लें।":"Judge only with the partner’s chart and cancellation rules."];
    if(title.includes("કાલસર્પ"))return [lang==="hi"?"कालसर्प संरचना का संकेत":"Kaal Sarpa pattern indication",lang==="hi"?"जीवन में तीव्र एकाग्रता या चरम अनुभव हो सकते हैं; पूरी कुंडली देखें।":"Life may feel unusually concentrated or intense; use the whole chart."];
    if(title.includes("મહાપુરુષ")){
      const key=Object.keys(GU_TO_KEY).find((gu)=>title.includes(gu));
      return [lang==="hi"?`${namePlanet(GU_TO_KEY[key]||"Sun",lang)} महापुरुष योग संकेत`:"Pancha Mahapurusha indication",lang==="hi"?"केंद्र में शक्तिशाली ग्रह अपनी क्षमता स्पष्ट कर सकता है।":"A strong planet in a kendra may express its capacity clearly."];
    }
    return [lang==="hi"?"अन्य योग संकेत":"Additional yoga indication",lang==="hi"?"फल ग्रहबल, भाव, D9 और दशा के साथ निर्धारित करें।":"Judge the result with planetary strength, house, D9 and dasha."];
  }

  function renderLocalizedYoga(chart,lang) {
    const base=chart.signals.map((signal)=>{const [title,text]=localizedSignal(signal,lang);return `<article class="signal ${signal.type}"><div class="signal-icon">${signal.icon}</div><div><strong>${title}</strong><p>${text}</p></div></article>`;}).join("");
    const extra=chart.advanced.yogas.found.map((item)=>{const label=advancedYogaLabel(item,lang);return `<article class="signal positive"><div class="signal-icon">✦</div><div><strong>${label.title}</strong><p>${label.planets}</p></div></article>`;}).join("");
    document.getElementById("tab-yoga").innerHTML=`<div class="signal-list">${base}${extra}</div><p class="legend-note">${lang==="hi"?"योग का अंतिम फल ग्रहबल, भाव, दृष्टि, नवांश और दशा के साथ ही तय करें।":"The final effect of a yoga depends on strength, house, aspect, Navamsa and the operating dasha."}</p>`;
  }

  function renderLocalizedReading(chart,lang) {
    const current=GU_TO_KEY[chart.dasha.current.lord],d10=chart.advanced.vargas.D10,careerLord=LORD_KEYS[(d10.ascSign+9)%12],strongest=PLANETS.map((key)=>chart.advanced.strengths[key]).sort((a,b)=>b.score-a.score)[0];
    const cards=lang==="hi"?[
      ["स्वभाव और शक्ति",`लग्न ${nameSign(chart.ascSign,lang)} आपको ${ASC_ALT[lang][chart.ascSign]} बनाता है। ${namePlanet(strongest.key,lang)} का संकेतात्मक बल सबसे अधिक है।`],
      ["मन और निर्णय",MOON_ALT[lang][chart.moonSign]],
      ["करियर",`D10 लग्न ${nameSign(d10.ascSign,lang)} है और दशम भाव का स्वामी ${namePlanet(careerLord,lang)} है। कौशल, अनुभव और दशा के साथ क्षेत्र चुनें।`],
      ["धन",`दूसरे और ग्यारहवें भाव, D2 तथा गुरु–शुक्र की शक्ति को साथ पढ़ें; बजट और बचत को प्राथमिकता दें।`],
      ["संबंध",`सातवां भाव, D9, उपपद और ${namePlanet(chart.advanced.jaimini.darakaraka.key,lang)} दाराकारक संबंध की शैली के मुख्य संकेत हैं।`],
      ["वर्तमान जीवन-चरण",`${namePlanet(current,lang)} महादशा में ${namePlanet(chart.advanced.dashaDepth.currentAntar.lord,lang)} अंतर्दशा और ${namePlanet(chart.advanced.dashaDepth.currentPratyantar.lord,lang)} प्रत्यंतर चल रहा है।`]
    ]:[
      ["Nature and strength",`${nameSign(chart.ascSign,lang)} rising suggests a temperament that is ${ASC_ALT[lang][chart.ascSign]}. ${namePlanet(strongest.key,lang)} has the highest indicative strength.`],
      ["Mind and decisions",MOON_ALT[lang][chart.moonSign]],
      ["Career",`D10 rises in ${nameSign(d10.ascSign,lang)} and its tenth lord is ${namePlanet(careerLord,lang)}. Choose a field together with skills, experience and dasha.`],
      ["Wealth",`Read houses 2 and 11, D2, Jupiter and Venus together; prioritise budgeting and savings.`],
      ["Relationships",`The seventh house, D9, Upapada and ${namePlanet(chart.advanced.jaimini.darakaraka.key,lang)} as Darakaraka are major relationship indicators.`],
      ["Current life phase",`${namePlanet(current,lang)} Mahadasha operates with ${namePlanet(chart.advanced.dashaDepth.currentAntar.lord,lang)} Antardasha and ${namePlanet(chart.advanced.dashaDepth.currentPratyantar.lord,lang)} Pratyantardasha.`]
    ];
    document.getElementById("tab-reading").innerHTML=`<div class="reading-grid">${cards.map(([title,text],i)=>`<article class="reading-card ${i===5?"wide":""}"><h3>${title}</h3><p>${text}</p></article>`).join("")}</div>`;
  }

  function renderLocalized(chart,lang) {
    document.getElementById("report-meta").textContent=`${formatInputDate(chart.input.date,lang)} · ${chart.input.time} · ${translatedCity(chart.input.city,lang)}`;
    renderLocalizedSummary(chart,lang);
    renderLocalizedCharts(chart,lang);
    renderLocalizedPlanets(chart,lang);
    renderLocalizedHouses(chart,lang);
    renderLocalizedNavamsa(chart,lang);
    renderLocalizedDasha(chart,lang);
    renderLocalizedFuture(chart,lang);
    renderLocalizedMarriage(chart,lang);
    renderLocalizedPanchang(chart,lang);
    renderLocalizedYoga(chart,lang);
    renderLocalizedReading(chart,lang);
  }

  function render(chart,lang) {
    if(!chart.advanced) chart.advanced=calculate(chart);
    if(lang!=="gu") renderLocalized(chart,lang);
    renderAdvanced(chart,lang);
  }

  window.JyotishAllInOne={calculate,render,applyStaticLanguage,copy:STATIC_COPY};
})();

