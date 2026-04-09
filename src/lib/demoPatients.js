export const DEMO_PATIENTS = [
  // ── INTERNAL MEDICINE (5 patients) ──────────────────────
  // Feature: Senior citizen gets highest priority (L=1.0, A=1.0)
  {
    name: "Amado Bugayong",
    age: 72,
    gender: "Male",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Grabe kaayo ang sakit sa akong dughan doc, lisod ko mogininhawa especially kung naglakaw ko. May chest pain ako and I feel dizzy.",
    language: "Code-switch",
    input_mode: "text",
    department: "Internal Medicine",
    confidence: 0.91,
    probabilities: {},
  },
  // Feature: High confidence, older patient
  {
    name: "Resurreccion Maglinte",
    age: 65,
    gender: "Female",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Taas kaayo akong blood pressure karon, 180/100 ang reading nila. Nasakit pud akong ulo ug lisod akong mogininhawa.",
    language: "Cebuano",
    input_mode: "speech",
    department: "Internal Medicine",
    confidence: 0.88,
    probabilities: {},
  },
  // Feature: Middle-aged, moderate priority
  {
    name: "Danilo Tabangcura",
    age: 52,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "May diabetes ako doc at hindi controlled ang sugar ko. Nanghihina ako and I keep feeling nauseous pagkatapos kumain.",
    language: "Code-switch",
    input_mode: "text",
    department: "Internal Medicine",
    confidence: 0.85,
    probabilities: {},
  },
  // Feature: Young adult, low priority score — shows contrast
  {
    name: "Kristoffer Dalugdog",
    age: 28,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Nag-ubo ko sulod sa duha ka semana doc ug kapoy kaayo ko. May slight fever pud ko every afternoon.",
    language: "Cebuano",
    input_mode: "text",
    department: "Internal Medicine",
    confidence: 0.79,
    probabilities: {},
  },
  // Feature: Long wait time will boost priority (T factor demo)
  {
    name: "Pilar Ybañez",
    age: 58,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Sakit ang itaas ng tiyan ko lagi after kumain at may heartburn ako araw araw na. Worried na ko baka may ulcer.",
    language: "Code-switch",
    input_mode: "text",
    department: "Internal Medicine",
    confidence: 0.82,
    probabilities: {},
  },

  // ── SURGERY (5 patients) ────────────────────────────────
  {
    name: "Renato Dalogdog",
    age: 45,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Grabe kaayo ang sakit sa akong tiyan sa tuo nga parte, murag appendix nako. Dili na ko makatindog sa kasakit.",
    language: "Cebuano",
    input_mode: "text",
    department: "Surgery",
    confidence: 0.93,
    probabilities: {},
  },
  {
    name: "Leandro Sumagaysay",
    age: 38,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "May hernia ako doc na lumaki na. Sobrang sakit na especially when I lift things or when I cough.",
    language: "Code-switch",
    input_mode: "text",
    department: "Surgery",
    confidence: 0.87,
    probabilities: {},
  },
  {
    name: "Generosa Lapinig",
    age: 61,
    gender: "Female",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Naa koy bukol sa akong tiyan nga nagkadako na sulod sa usa ka bulan. Dili masakit pero nakabalaka ko.",
    language: "Cebuano",
    input_mode: "speech",
    department: "Surgery",
    confidence: 0.84,
    probabilities: {},
  },
  {
    name: "Wilfredo Panagtagon",
    age: 55,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "May gallstone ako at sobrang sakit, hindi na nako matanggap. Nagvovomit na pati ako every time mag-attack.",
    language: "Code-switch",
    input_mode: "text",
    department: "Surgery",
    confidence: 0.89,
    probabilities: {},
  },
  {
    name: "Teresita Amoguis",
    age: 42,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Naa koy samad sa akong tiil nga dili maaayo sulod sa duha ka buwan. Nagdugo pa gihapon ug nag-infect na murag.",
    language: "Cebuano",
    input_mode: "text",
    department: "Surgery",
    confidence: 0.81,
    probabilities: {},
  },

  // ── PEDIATRICS (5 patients) ─────────────────────────────
  // Note: parent is speaking on behalf of child
  {
    name: "Bayani Mandaguit (2 anyos)",
    age: 2,
    gender: "Male",
    vulnerabilities: ["Pediatric"],
    symptom_text: "Doc ang akong anak 2 anyos pa lang nag hilanat na siya sulod sa 3 ka adlaw. Dili mokaon ug pirmi naghilak. Murag lisod pud mogininhawa.",
    language: "Cebuano",
    input_mode: "text",
    department: "Pediatrics",
    confidence: 0.92,
    probabilities: {},
  },
  {
    name: "Luzviminda Cayabyab (5 anyos)",
    age: 5,
    gender: "Female",
    vulnerabilities: ["Pediatric"],
    symptom_text: "Ang akong anak nag-ubo na ng 1 week and may rashes sa buong katawan niya. May lagnat din siya at ayaw kumain.",
    language: "Code-switch",
    input_mode: "speech",
    department: "Pediatrics",
    confidence: 0.88,
    probabilities: {},
  },
  {
    name: "Sonny Magbanua (8 anyos)",
    age: 8,
    gender: "Male",
    vulnerabilities: ["Pediatric"],
    symptom_text: "Nahulog ang akong anak gikan sa bisikleta ug naigo ang iyang ulo. Nahubog siya ug nagsuka na siya kaduha.",
    language: "Cebuano",
    input_mode: "text",
    department: "Pediatrics",
    confidence: 0.86,
    probabilities: {},
  },
  {
    name: "Mirasol Balaba (4 anyos)",
    age: 4,
    gender: "Female",
    vulnerabilities: ["Pediatric"],
    symptom_text: "Nagtatae ang anak ko nang 2 araw na doc at nag-vovomit pa. Worried na ko baka ma-dehydrate na siya, hindi na siya umiinom.",
    language: "Code-switch",
    input_mode: "text",
    department: "Pediatrics",
    confidence: 0.90,
    probabilities: {},
  },
  {
    name: "Arkin Talingting (10 anyos)",
    age: 10,
    gender: "Male",
    vulnerabilities: ["Pediatric"],
    symptom_text: "Sakit ang dalunggan sa akong anak sulod sa 3 ka adlaw. Naghilak siya sa kasakit ug nag hilanat pa. Nagsulti siya nga dili siya makadungog og maayo.",
    language: "Cebuano",
    input_mode: "speech",
    department: "Pediatrics",
    confidence: 0.83,
    probabilities: {},
  },

  // ── OB-GYN (5 patients) — all Female ───────────────────
  // Feature: Pregnant modifier boosts priority (L=0.95)
  {
    name: "Clarita Bullecer",
    age: 26,
    gender: "Female",
    vulnerabilities: ["Pregnant"],
    symptom_text: "Buntis ko doc, 7 months na. Grabe kaayo ang sakit sa akong tiyan ug may bleeding pa ko. Worried kaayo ko sa akong baby.",
    language: "Cebuano",
    input_mode: "speech",
    department: "OB-GYN",
    confidence: 0.95,
    probabilities: {},
  },
  {
    name: "Nenita Patalinghug",
    age: 32,
    gender: "Female",
    vulnerabilities: ["Pregnant"],
    symptom_text: "Doc buntis ako 5 months na and I'm having contractions already. Masakit kaayo and I'm scared it might be premature.",
    language: "Code-switch",
    input_mode: "text",
    department: "OB-GYN",
    confidence: 0.93,
    probabilities: {},
  },
  {
    name: "Rosalinda Gabutero",
    age: 19,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Irregular ang akong regla sulod sa 3 ka bulan na doc. Grabe ang sakit sa akong puson every time mag-regla ko.",
    language: "Cebuano",
    input_mode: "text",
    department: "OB-GYN",
    confidence: 0.87,
    probabilities: {},
  },
  {
    name: "Perpetua Dagodog",
    age: 38,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Naa koy bukol sa akong dughan nga nasakit kung gihikap. Nakabalaka ko doc baka serious. Duha ka buwan na nako kini.",
    language: "Cebuano",
    input_mode: "speech",
    department: "OB-GYN",
    confidence: 0.84,
    probabilities: {},
  },
  {
    name: "Flordeliza Manlupig",
    age: 29,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Hindi ako nireregla ng 2 months na doc. Nagtest na ako ng pregnancy test pero negative. May discharge pa ako na hindi normal.",
    language: "Code-switch",
    input_mode: "text",
    department: "OB-GYN",
    confidence: 0.82,
    probabilities: {},
  },

  // ── ORTHOPEDICS (5 patients) ────────────────────────────
  {
    name: "Catalino Bugwak",
    age: 67,
    gender: "Male",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Grabe ang sakit sa akong tuhod doc dili na ko makalakaw ng maayos. Nihubag na pud siya. Dugay na kini, murag arthritis na.",
    language: "Cebuano",
    input_mode: "text",
    department: "Orthopedics",
    confidence: 0.90,
    probabilities: {},
  },
  {
    name: "Rogelio Sugatan",
    age: 34,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Nahulog ako gikan sa motor doc and I think nabali ang akong buto sa braso. Hindi ko na siya magalaw, sobrang sakit.",
    language: "Code-switch",
    input_mode: "speech",
    department: "Orthopedics",
    confidence: 0.92,
    probabilities: {},
  },
  {
    name: "Lourdes Panaguiton",
    age: 48,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Grabe kaayo ang sakit sa akong likod sulod sa usa ka bulan. Dili na ko makatindog og dugay ug lisod na pud ang paglihok.",
    language: "Cebuano",
    input_mode: "text",
    department: "Orthopedics",
    confidence: 0.85,
    probabilities: {},
  },
  {
    name: "Herminio Dapiton",
    age: 22,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Na-injure ang akong balikat sa basketball doc. Dili na ko makataas ng braso ko and it's been swollen for 2 days na.",
    language: "Code-switch",
    input_mode: "text",
    department: "Orthopedics",
    confidence: 0.88,
    probabilities: {},
  },
  {
    name: "Visitacion Tabundag",
    age: 71,
    gender: "Female",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Napilasan ang akong paa doc pagnahulog ko sa hagdan. Nihubag kaayo ug dili ko mapwesto. Grabe ang sakit pag gihikap.",
    language: "Cebuano",
    input_mode: "speech",
    department: "Orthopedics",
    confidence: 0.87,
    probabilities: {},
  },

  // ── OPHTHALMOLOGY (5 patients) ──────────────────────────
  {
    name: "Segundo Bugho",
    age: 69,
    gender: "Male",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Naglabo na kaayo ang akong panan-aw doc, dili na ko makabasa. Halos dili na ko makakita sa wala nga mata. Dugay na kini.",
    language: "Cebuano",
    input_mode: "text",
    department: "Ophthalmology",
    confidence: 0.91,
    probabilities: {},
  },
  {
    name: "Adelaida Camangyan",
    age: 55,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Grabe ang sakit sa akong mata ug pula kaayo siya doc. Hindi ako makatingin sa liwanag at may luha na walang tigil.",
    language: "Code-switch",
    input_mode: "speech",
    department: "Ophthalmology",
    confidence: 0.86,
    probabilities: {},
  },
  {
    name: "Buenaventura Tulabing",
    age: 63,
    gender: "Male",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Murag naa na koy cataract doc, halos puro puti na ang akong makita. Unti unti na kini naggrabe sulod sa 6 ka bulan.",
    language: "Cebuano",
    input_mode: "text",
    department: "Ophthalmology",
    confidence: 0.89,
    probabilities: {},
  },
  {
    name: "Milagros Pabilona",
    age: 41,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "May nasulod sa mata ko doc, murag may gamay nga bagay. Nagpulapula na ug dili ko mapunit. Sakit kaayo.",
    language: "Cebuano",
    input_mode: "text",
    department: "Ophthalmology",
    confidence: 0.84,
    probabilities: {},
  },
  {
    name: "Tiburcio Lamanilao",
    age: 37,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Doble na ang akong nakikita doc lagi at sumasakit ang ulo ko. Nagkagrabe siya lalo na pag gabi.",
    language: "Code-switch",
    input_mode: "text",
    department: "Ophthalmology",
    confidence: 0.80,
    probabilities: {},
  },

  // ── ENT (5 patients) ────────────────────────────────────
  {
    name: "Bartolome Dugasan",
    age: 31,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Grabe ang sakit sa akong tutunlan doc lisod na kaayo ko motulon. Nag hilanat pa ko ug raspy na ang akong tingog.",
    language: "Cebuano",
    input_mode: "text",
    department: "ENT",
    confidence: 0.90,
    probabilities: {},
  },
  {
    name: "Adoracion Patnugot",
    age: 44,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "May sinusitis ako doc at hindi na ako makahinga sa ilong ko. Masakit na pati ang aking ulo at nangingibabaw na ang sakit.",
    language: "Code-switch",
    input_mode: "speech",
    department: "ENT",
    confidence: 0.87,
    probabilities: {},
  },
  {
    name: "Celestino Tabayag",
    age: 62,
    gender: "Male",
    vulnerabilities: ["Senior Citizen"],
    symptom_text: "Sakit ang akong dalunggan sulod sa usa ka semana doc ug dili na ko makadungog og maayo. Naa puy mga tunog nga nadungog ko.",
    language: "Cebuano",
    input_mode: "text",
    department: "ENT",
    confidence: 0.85,
    probabilities: {},
  },
  {
    name: "Epifania Tangkulap",
    age: 25,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Lagi akong dinudugo ang ilong doc, almost every day na. Hindi siya tumitigil ng matagal. Worried na ako.",
    language: "Code-switch",
    input_mode: "text",
    department: "ENT",
    confidence: 0.83,
    probabilities: {},
  },
  {
    name: "Sofronio Mabugat",
    age: 39,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "Naa koy tonsillitis doc, nihubag kaayo ang akong tutunlan. Dili na ko katulog sa kasakit ug dili ko makakaon.",
    language: "Cebuano",
    input_mode: "speech",
    department: "ENT",
    confidence: 0.88,
    probabilities: {},
  },

  // ── DERMATOLOGY (5 patients) ────────────────────────────
  {
    name: "Bonifacia Sugpat",
    age: 35,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Naa koy rashes nga mikaylap sa akong tibuok lawas doc. Katol kaayo ug nagsugod na kini sa duha ka adlaw. Naga-iyot na pud.",
    language: "Cebuano",
    input_mode: "text",
    department: "Dermatology",
    confidence: 0.89,
    probabilities: {},
  },
  {
    name: "Macario Kalubiran",
    age: 27,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "May eczema ako doc at nagkacrack na ang balat ko lalo na sa mga kamay. Nagdudugo na pati at sobrang kati.",
    language: "Code-switch",
    input_mode: "speech",
    department: "Dermatology",
    confidence: 0.86,
    probabilities: {},
  },
  {
    name: "Salome Haganas",
    age: 19,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Grabe ang akong acne doc, nagkumaot na sa tibuok nawong ug dugok. Nasunog na murag ug nag-infect na ang uban.",
    language: "Cebuano",
    input_mode: "text",
    department: "Dermatology",
    confidence: 0.82,
    probabilities: {},
  },
  {
    name: "Dionisio Tampolok",
    age: 50,
    gender: "Male",
    vulnerabilities: [],
    symptom_text: "May suspicious na taling doc na nagbago ng kulay. Dati itim, ngayon may pula at puti na. Lumaki na rin siya ng konti.",
    language: "Code-switch",
    input_mode: "text",
    department: "Dermatology",
    confidence: 0.84,
    probabilities: {},
  },
  {
    name: "Candelaria Bugtong",
    age: 43,
    gender: "Female",
    vulnerabilities: [],
    symptom_text: "Naa koy fungal infection sa akong mga tiil doc. Katol kaayo ug naa mga bula sa kilid sa mga tudlo. Dugay na kini.",
    language: "Cebuano",
    input_mode: "speech",
    department: "Dermatology",
    confidence: 0.81,
    probabilities: {},
  },
];

// Stress test patients — 20 per department, 160 total
// Varied ages, genders, languages, confidence levels
export const STRESS_PATIENTS = [
  ...generateStressPatients()
];

function generateStressPatients() {
  const departments = [
    "Internal Medicine", "Surgery", "Pediatrics", "OB-GYN",
    "Orthopedics", "Ophthalmology", "ENT", "Dermatology"
  ];

  const maleNames = [
    "Jose Reyes", "Pedro Santos", "Juan Dela Cruz", "Miguel Bautista",
    "Antonio Garcia", "Ricardo Mendoza", "Eduardo Ramos", "Fernando Cruz",
    "Alberto Lopez", "Rodrigo Flores", "Ernesto Aquino", "Narciso Padilla",
    "Gregorio Villanueva", "Mauricio Macaraeg", "Simplicio Buenaventura",
    "Apolinario Mabini", "Gaudencio Tugade", "Filomeno Baluyot",
    "Nemesio Catalan", "Epifanio Dalisay"
  ];

  const femaleNames = [
    "Maria Santos", "Ana Reyes", "Rosa Dela Cruz", "Carmen Bautista",
    "Luz Garcia", "Elena Mendoza", "Gloria Ramos", "Fe Cruz",
    "Natividad Lopez", "Remedios Flores", "Corazon Aquino", "Ligaya Padilla",
    "Caridad Villanueva", "Purificacion Macaraeg", "Encarnacion Buenaventura",
    "Valentina Bituin", "Rufina Malaya", "Presentacion Diwa",
    "Consolacion Lakas", "Asuncion Bagong"
  ];

  const symptomsByDept = {
    "Internal Medicine": "Masakit ang dibdib ko ug lisod mogininhawa.",
    "Surgery": "Naa koy bukol nga nagkasakit na.",
    "Pediatrics": "Ang akong anak nag hilanat ug dili mokaon.",
    "OB-GYN": "Irregular ang akong regla ug masakit ang puson.",
    "Orthopedics": "Sakit kaayo ang akong tuhod dili na ko makalakaw.",
    "Ophthalmology": "Naglabo na ang akong panan-aw.",
    "ENT": "Sakit ang akong ilong ug tutunlan.",
    "Dermatology": "Naa koy rashes nga katol kaayo sa tibuok lawas.",
  };

  const patients = [];
  let maleIdx = 0;
  let femaleIdx = 0;

  departments.forEach((dept) => {
    const isObGyn = dept === "OB-GYN";
    const isPediatrics = dept === "Pediatrics";

    for (let i = 0; i < 20; i++) {
      const gender = isObGyn ? "Female" : (i % 2 === 0 ? "Female" : "Male");
      const name = gender === "Female"
        ? femaleNames[femaleIdx % femaleNames.length]
        : maleNames[maleIdx % maleNames.length];

      if (gender === "Female") femaleIdx++;
      else maleIdx++;

      const age = isPediatrics
        ? Math.floor(Math.random() * 10) + 1
        : Math.floor(Math.random() * 60) + 18;

      const vulnerabilities = [];
      if (age >= 60) vulnerabilities.push("Senior Citizen");
      if (age < 12) vulnerabilities.push("Pediatric");
      if (gender === "Female" && dept === "OB-GYN" && i < 5) {
        vulnerabilities.push("Pregnant");
      }

      patients.push({
        name,
        age,
        gender,
        vulnerabilities,
        symptom_text: symptomsByDept[dept],
        language: i % 3 === 0 ? "Code-switch" : i % 3 === 1 ? "Filipino" : "Cebuano",
        input_mode: i % 2 === 0 ? "text" : "speech",
        department: dept,
        confidence: Math.round((0.70 + Math.random() * 0.25) * 100) / 100,
        probabilities: {},
      });
    }
  });

  return patients;
}

export async function seedPatients(patients, apiUrl, onProgress) {
  let success = 0;
  let failed = 0;
  const queueNumbers = [];
  const total = patients.length;

  for (let i = 0; i < total; i++) {
    const patient = patients[i];
    try {
      const response = await fetch(`${apiUrl}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });

      if (response.ok) {
        const data = await response.json();
        queueNumbers.push(data.queue_number);
        success++;
      } else {
        console.error(`Failed to add ${patient.name}:`, response.status);
        failed++;
      }
    } catch (err) {
      console.error(`Error adding ${patient.name}:`, err);
      failed++;
    }

    if (onProgress) onProgress(i + 1, total);

    // 200ms delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return { success, failed, queueNumbers };
}
