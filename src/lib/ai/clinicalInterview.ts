import { ClinicalQuestion, Language } from '@/types';

// Initial Chief Complaint Question (Question 1)
export const INITIAL_COMPLAINT_QUESTION: ClinicalQuestion = {
  id: 'q_chief_complaint',
  category: 'complaint',
  allowVoice: true,
  allowTouch: true,
  questionText: {
    en: 'What is the main medical problem or reason for your visit today?',
    hi: 'आज अस्पताल आने का आपका मुख्य कारण या बीमारी क्या है?',
    kn: 'ಇಂದು ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಲು ನಿಮ್ಮ ಮುಖ್ಯ ವೈದ್ಯಕೀಯ ತೊಂದರೆ ಏನು?',
  },
  options: [
    { label: 'Chest Pain / Pressure', value: 'Chest Pain / Discomfort' },
    { label: 'Fever / Infection / Chills', value: 'Fever and Body Aches' },
    { label: 'Stomach Pain / Acidity', value: 'Stomach Pain or Acidity' },
    { label: 'Joint / Back Pain', value: 'Joint or Back Pain' },
    { label: 'Cough / Breathing Issue', value: 'Cough or Shortness of Breath' },
    { label: 'Severe Headache / Dizziness', value: 'Headache or Dizziness' },
    { label: 'Skin Rash / Allergy', value: 'Skin Rash or Allergy' },
    { label: 'High BP / Sugar Check', value: 'Diabetes or BP Checkup' },
  ],
};

// Comprehensive Disease-Specific Question Banks (10 to 14 Questions Per Disease)
export const ADAPTIVE_QUESTION_SETS: Record<string, ClinicalQuestion[]> = {
  skin: [
    {
      id: 'q_skin_site',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Where on your body is the skin rash or allergy located (face, hands/arms, chest/back, or all over)?',
        hi: 'शरीर के किस हिस्से में चकत्ते या एलर्जी है (चेहरे पर, हाथों/बाहों में, सीने/पीठ पर या पूरे शरीर में)?',
        kn: 'ದೇಹದ ಯಾವ ಭಾಗದಲ್ಲಿ ಚರ್ಮದ ದದ್ದುಗಳು ಅಥವಾ ಅಲರ್ಜಿ ಇದೆ (ಮುಖ, ಕೈಗಳು, ಎದೆ, ಅಥವಾ ದೇಹದಾದ್ಯಂತ)?',
      },
      options: [
        { label: 'Face & Neck', value: 'Facial and neck dermatitis / rash' },
        { label: 'Arms & Hands', value: 'Upper limb and hand skin rash' },
        { label: 'Chest, Belly & Back', value: 'Trunk, chest, and back rash' },
        { label: 'All Over Body', value: 'Generalized body rash and allergy' },
      ],
    },
    {
      id: 'q_skin_appearance',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How does the skin rash look (red raised bumps, flat red patches, fluid blisters, or dry scaly skin)?',
        hi: 'त्वचा के चकत्ते कैसे दिखते हैं (लाल उभरे दाने, लाल धब्बे, पानी भरे छाले या सूखी पपड़ीदार त्वचा)?',
        kn: 'ಚರ್ಮದ ದದ್ದುಗಳು ಹೇಗೆ ಕಾಣಿಸುತ್ತವೆ (ಕೆಂಪು ಗುಳ್ಳೆಗಳು, ಕೆಂಪು ಕಲೆಗಳು, ನೀರು ಗುಳ್ಳೆಗಳು, ಅಥವಾ ಒಣ ಚರ್ಮ)?',
      },
      options: [
        { label: 'Red Raised Bumps / Hives', value: 'Erythematous raised papules / hives' },
        { label: 'Flat Red Patches', value: 'Macular red skin patches' },
        { label: 'Fluid-filled Blisters', value: 'Vesicular fluid-filled blisters' },
        { label: 'Dry Scaly Peeling Skin', value: 'Dry scaly desquamating skin' },
      ],
    },
    {
      id: 'q_skin_itch_burn',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How severe is the itching or burning sensation on your skin (severe itching, mild itch, or painful burning)?',
        hi: 'त्वचा पर खुजली या जलन कितनी तेज है (बहुत तेज़ खुजली, हल्की खुजली या दर्दभरी जलन)?',
        kn: 'ಚರ್ಮದ ಮೇಲೆ ತುರಿಕೆ ಅಥವಾ ಉರಿ ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ (ತೀವ್ರ ತುರಿಕೆ, ಸೌಮ್ಯ ತುರಿಕೆ, ಅಥವಾ ಉರಿ ನೋವು)?',
      },
      options: [
        { label: 'Severe Itching (Keeps awake)', value: 'Severe intense pruritus interrupting sleep' },
        { label: 'Moderate Intermittent Itch', value: 'Moderate intermittent itching' },
        { label: 'Burning Sensation & Pain', value: 'Painful burning cutaneous sensation' },
        { label: 'Mild / No Itching', value: 'Mild or negligible itching' },
      ],
    },
    {
      id: 'q_skin_triggers',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Did the rash appear after contact with new soap, cosmetics, detergent, insect bite, food, or plants?',
        hi: 'क्या यह चकत्ते नए साबुन, कॉस्मैटिक, कीड़े के काटने, किसी भोजन या पौधे के संपर्क से हुए हैं?',
        kn: 'ಹೊಸ ಸಾಬೂನು, ಪ್ರಸಾಧನ ಸಾಮಗ್ರಿಗಳು, ಕೀಟದ ಕಡಿತ ಅಥವಾ ಆಹಾರದ ಸಂಪರ್ಕದ ನಂತರ ದದ್ದುಗಳು ಬಂದವೇ?',
      },
      options: [
        { label: 'New Soap / Cosmetic / Detergent', value: 'Contact allergy to cosmetic/chemical soap' },
        { label: 'Insect Bite / Plant Contact', value: 'Insect bite or plant contact dermatitis' },
        { label: 'Food Intake (Seafood, Nuts, Milk)', value: 'Triggered by specific food ingestion' },
        { label: 'No obvious trigger identified', value: 'Spontaneous rash without known trigger' },
      ],
    },
    {
      id: 'q_skin_hives_swelling',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have swelling on your lips, face, eyelids, or raised welt-like hives (Urticaria)?',
        hi: 'क्या आपके होंठों, चेहरे या आंखों पर सूजन है या त्वचा पर लाल चकत्ते (पित्ती/Urticaria) उभरे हैं?',
        kn: 'ನಿಮ್ಮ ತುಟಿಗಳು, ಮುಖ ಅಥವಾ ಕಣ್ಣುರೆಪ್ಪೆಗಳಲ್ಲಿ ಊತ ಅಥವಾ ದದ್ದುಗಳು (ಉರ್ಟಿಕೇರಿಯಾ) ಇವೆಯೇ?',
      },
      options: [
        { label: 'Facial / Lip Swelling (Angioedema)', value: 'Facial angioedema and lip swelling' },
        { label: 'Raised Red Welts (Urticaria)', value: 'Urticarial wheals and welts' },
        { label: 'Eyelid Puffiness', value: 'Periorbital swelling' },
        { label: 'No face or lip swelling', value: 'No facial angioedema' },
      ],
    },
    {
      id: 'q_skin_anaphylaxis_warning',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have any throat tightness, tongue swelling, or difficulty breathing with this allergy?',
        hi: 'क्या इस एलर्जी के साथ आपको गले में जकड़न, जीभ में सूजन या सांस लेने में कोई तकलीफ महसूस हो रही है?',
        kn: 'ಈ ಅಲರ್ಜಿಯೊಂದಿಗೆ ಗಂಟಲಿನಲ್ಲಿ ಬಿಗಿತ, ನಾಲಿಗೆ ಊತ ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Throat Tightness & Breathlessness', value: 'Throat tightness and respiratory difficulty (Anaphylaxis risk)' },
        { label: 'Tongue / Mouth Swelling', value: 'Oral and lingual mucosal swelling' },
        { label: 'Normal Breathing & Throat', value: 'Normal airway, no throat or breathing issue' },
      ],
    },
    {
      id: 'q_skin_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How many hours or days ago did this skin rash or itching start?',
        hi: 'यह त्वचा के दाने या खुजली कितने घंटों या दिनों पहले शुरू हुई?',
        kn: 'ಈ ಚರ್ಮದ ದದ್ದುಗಳು ಅಥವಾ ತುರಿಕೆ ಎಷ್ಟು ಗಂಟೆ ಅಥವಾ ದಿನಗಳ ಹಿಂದೆ ಪ್ರಾರಂಭವಾಯಿತು?',
      },
      options: [
        { label: 'Sudden (Few Hours Ago)', value: 'Acute hyper-sudden onset (<12 hours)' },
        { label: '1 to 3 Days Ago', value: 'Acute onset (1-3 days)' },
        { label: '1 to 2 Weeks Ago', value: 'Subacute rash (1-2 weeks)' },
        { label: 'Chronic Months / Years', value: 'Chronic dermatosis (>1 month)' },
      ],
    },
    {
      id: 'q_skin_spreading',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Is the skin rash spreading rapidly to other body parts or staying in one local area?',
        hi: 'क्या यह दाने शरीर के बाकी हिस्सों में तेजी से फैल रहे हैं या एक ही जगह पर हैं?',
        kn: 'ಚರ್ಮದ ದದ್ದುಗಳು ದೇಹದ ಇತರ ಭಾಗಗಳಿಗೆ ವೇಗವಾಗಿ ಹರಡುತ್ತಿವೆಯೇ ಅಥವಾ ಒಂದೇ ಜಾಗದಲ್ಲಿವೆಯೇ?',
      },
      options: [
        { label: 'Spreading Rapidly All Over', value: 'Rapidly spreading acute exanthem' },
        { label: 'Gradually Expanding', value: 'Gradually expanding rash' },
        { label: 'Localized to One Spot', value: 'Localized fixed skin eruption' },
      ],
    },
    {
      id: 'q_skin_pus_infection',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are there any pus-filled blisters, skin peeling, liquid oozing, or high fever with the rash?',
        hi: 'क्या दानों में मवाद (पस), त्वचा छिलना, पानी बहना या साथ में तेज़ बुखार है?',
        kn: 'ದದ್ದುಗಳೊಂದಿಗೆ ಕೀವು ತುಂಬಿದ ಗುಳ್ಳೆಗಳು, ಚರ್ಮ ಸುಲಿಯುವುದು ಅಥವಾ ಜ್ವರವಿದೆಯೇ?',
      },
      options: [
        { label: 'Pus-filled / Oozing Blisters', value: 'Pustular skin lesions with discharge' },
        { label: 'Skin Peeling & Exfoliation', value: 'Epidermal desquamation and peeling' },
        { label: 'Fever with Skin Rash', value: 'Systemic fever with cutaneous eruption' },
        { label: 'Clean Dry Skin (No pus)', value: 'Clean non-purulent skin rash' },
      ],
    },
    {
      id: 'q_skin_new_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Did you start any new oral medicines, antibiotics, or health supplements in the past 1–2 weeks?',
        hi: 'क्या आपने पिछले 1-2 हफ्तों में कोई नई दवा, एंटीबायोटिक या सिरप शुरू किया है?',
        kn: 'ಕಳೆದ 1-2 ವಾರಗಳಲ್ಲಿ ನೀವು ಯಾವುದೇ ಹೊಸ ಔಷಧಿಗಳನ್ನು ಅಥವಾ ಆಂಟಿಬಯೋಟಿಕ್‌ಗಳನ್ನು ಪ್ರಾರಂಭಿಸಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'New Antibiotics / Painkillers', value: 'Recent antibiotic / NSAID drug intake (Drug Eruption risk)' },
        { label: 'New Health Supplements / Herbs', value: 'Recent herbal supplement intake' },
        { label: 'No new medicines started', value: 'No recent medication changes' },
      ],
    },
    {
      id: 'q_skin_history',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a history of skin allergies, Eczema, Psoriasis, Asthma, or drug reactions?',
        hi: 'क्या आपको पहले से त्वचा एलर्जी, एक्जिमा, सोरायसिस, दमा या किसी दवा से एलर्जी का इतिहास है?',
        kn: 'ನಿಮಗೆ ಚರ್ಮದ ಅಲರ್ಜಿಗಳು, ಎಕ್ಸಿಮಾ, ಸೋರಿಯಾಸಿಸ್ ಅಥವಾ ಆಸ್ತಮಾ ಇತಿಹಾಸವಿದೆಯೇ?',
      },
      options: [
        { label: 'Atopic Eczema / Asthma', value: 'History of Atopic Dermatitis / Asthma' },
        { label: 'Known Drug Allergies', value: 'Prior adverse drug reaction history' },
        { label: 'Psoriasis / Fungal Rash', value: 'Chronic Psoriasis / Dermatomycosis history' },
        { label: 'No prior skin allergies', value: 'No known dermatological history' },
      ],
    },
    {
      id: 'q_skin_current_treatments',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you taking allergy pills (Cetirizine, Allegra) or applying steroid/antifungal skin creams?',
        hi: 'क्या आप एलर्जी की गोली (Cetirizine) ले रहे हैं या त्वचा पर कोई क्रीम लगा रहे हैं?',
        kn: 'ನೀವು ಅಲರ್ಜಿ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ ಅಥವಾ ಚರ್ಮದ ಕ್ರೀಮ್ ಬಳಸುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Antihistamine Pills (Cetirizine/Allegra)', value: 'Oral antihistamines (Cetirizine/Fexofenadine)' },
        { label: 'Steroid Cream Application', value: 'Topical corticosteroid ointment' },
        { label: 'Antifungal Cream / Powder', value: 'Topical antifungal cream' },
        { label: 'No medications used yet', value: 'No dermatological treatment started' },
      ],
    },
    {
      id: 'q_skin_sun_heat',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does hot weather, sweat, tight clothing, or sunlight make the rash or itching worse?',
        hi: 'क्या गर्मी, पसीना, टाइट कपड़े या धूप में जाने से खुजली और चकत्ते बढ़ जाते हैं?',
        kn: 'ಬಿಸಿ ವಾತಾವರಣ, ಬೆವರು ಅಥವಾ ಸೂರ್ಯನ ಬೆಳಕಿನಿಂದ ತುರಿಕೆ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Worse with Sweat & Heat', value: 'Heat and sweat exacerbated rash' },
        { label: 'Worse in Sunlight (Photosensitive)', value: 'Photosensitive sun-exposed rash' },
        { label: 'Unaffected by weather', value: 'Weather independent rash' },
      ],
    },
    {
      id: 'q_skin_ayush_pitta',
      category: 'ayush',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'AYUSH Assessment: Do you experience excessive body heat, acidity, or skin flushing easily (Pitta dominance)?',
        hi: 'आयुष मूल्यांकन: क्या आपके शरीर में अत्यधिक गर्मी, एसिडिटी या त्वचा में लालिमा जल्दी आती है (पित्त दोष)?',
        kn: 'ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ: ನಿಮ್ಮ ದೇಹದಲ್ಲಿ ಅತಿಯಾದ ಶಾಖ, ಅಸಿಡಿಟಿ ಅಥವಾ ಚರ್ಮದ ಕೆಂಪು ಬಣ್ಣ ಬೇಗ ಬರುತ್ತದೆಯೇ (ಪಿತ್ತ)?',
      },
      options: [
        { label: 'High Body Heat & Redness (Pitta)', value: 'Pitta / Rakta Dhatu Dushti' },
        { label: 'Dry Scaly Skin (Vata)', value: 'Vata dominance / Dry skin' },
        { label: 'Itchy Oozing Rash (Kapha-Pitta)', value: 'Kapha-Pitta Kledaj Kustha' },
        { label: 'Normal Balance', value: 'Sama Prakriti skin' },
      ],
    },
  ],

  neuro: [
    {
      id: 'q_neuro_site',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Where is your headache felt (one side of head, forehead/sinus, back of neck, or whole head)?',
        hi: 'सिरदर्द ठीक कहाँ महसूस हो रहा है (एक तरफ, माथे/सिनस पर, गर्दन के पीछे या पूरे सिर में)?',
        kn: 'ತಲೆನೋವು ಎಲ್ಲಿದೆ (ಒಂದು ಬದಿಯಲ್ಲಿ, ಕಪಾಳದಲ್ಲಿ, ಕುತ್ತಿಗೆಯ ಹಿಂಭಾಗದಲ್ಲಿ, ಅಥವಾ ಇಡೀ ತಲೆಯಲ್ಲಿ)?',
      },
      options: [
        { label: 'One Side of Head (Unilateral)', value: 'Unilateral hemicranial pain (Migraine pattern)' },
        { label: 'Forehead & Around Eyes', value: 'Frontal sinus headache' },
        { label: 'Back of Head & Neck', value: 'Occipital and cervical headache' },
        { label: 'Band Around Entire Head', value: 'Generalized band-like tension headache' },
      ],
    },
    {
      id: 'q_neuro_character',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How does the headache feel (throbbing pulsating, heavy pressure tightness, or sharp shooting pain)?',
        hi: 'सिरदर्द कैसा लगता है (टीस मारता धड़कन जैसा, भारी दबाव, या तेज़ चुभन)?',
        kn: 'ತಲೆನೋವು ಹೇಗಿದೆ (ತೀವ್ರ ನೋವು, ಭಾರವಾದ ಒತ್ತಡ, ಅಥವಾ ಚುಚ್ಚುವಿಕೆ)?',
      },
      options: [
        { label: 'Throbbing & Pulsating', value: 'Pulsating throbbing ache' },
        { label: 'Heavy Pressure & Tightness', value: 'Constant heavy tightness' },
        { label: 'Sharp Shooting Nerve Pain', value: 'Sharp shooting shock-like pain' },
        { label: 'Dull Continuous Heavy Head', value: 'Dull continuous heaviness' },
      ],
    },
    {
      id: 'q_neuro_vertigo',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you experiencing dizziness, room spinning (vertigo), or unsteadiness while walking?',
        hi: 'क्या आपको चक्कर आना, कमरा घूमता हुआ महसूस होना (वर्टिगो) या चलने में असंतुलन है?',
        kn: 'ನಿಮಗೆ ತಲೆತಿರುಗುವಿಕೆ, ಕೋಣೆ ಸುತ್ತುವ ಅನುಭವ (ವರ್ಟಿಗೋ) ಅಥವಾ ನಡೆಯುವಾಗ ಅಸಮತೋಲನ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Room Spinning (Vertigo)', value: 'Rotational vertigo (room spinning)' },
        { label: 'Lightheadedness / Giddiness', value: 'Lightheadedness and presyncope' },
        { label: 'Unsteadiness Walking', value: 'Gait unsteadiness and imbalance' },
        { label: 'No dizziness', value: 'No vertigo or giddiness' },
      ],
    },
    {
      id: 'q_neuro_nausea_photophobia',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does the headache cause nausea, vomiting, or discomfort with bright light and loud sounds?',
        hi: 'क्या सिरदर्द के साथ उल्टी की इच्छा, तेज़ रोशनी या आवाज़ से तकलीफ होती है?',
        kn: 'ತಲೆನೋವಿನಿಂದ ವಾಕರಿಕೆ, ವಾಂತಿ ಅಥವಾ ಪ್ರಕಾಶಮಾನವಾದ ಬೆಳಕಿನಿಂದ ತೊಂದರೆ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Nausea & Light/Sound Sensitivity', value: 'Nausea with photophobia and phonophobia' },
        { label: 'Active Vomiting', value: 'Recurrent vomiting with headache' },
        { label: 'No nausea or light sensitivity', value: 'No photophobia or gastric signs' },
      ],
    },
    {
      id: 'q_neuro_vision',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you noticed vision blurred, double vision, flashing lights, or spots before your eyes?',
        hi: 'क्या आपको धुंधला दिखना, दो-दो दिखना या आंखों के सामने चमकती रोशनी महसूस होती है?',
        kn: 'ನಿಮಗೆ ಮಂಜು ದೃಷ್ಟಿ, ಎರಡೆರಡು ಕಾಣಿಸುವುದು ಅಥವಾ ಕಣ್ಣಿನ ಮುಂದೆ ಬೆಳಕು ಕಾಣಿಸುತ್ತಿದೆಯೇ?',
      },
      options: [
        { label: 'Flashing Lights / Aura', value: 'Scintillating visual aura' },
        { label: 'Blurry Vision', value: 'Transient visual blurring' },
        { label: 'Double Vision (Diplopia)', value: 'Diplopia / Double vision' },
        { label: 'Normal Vision', value: 'Normal clear visual acuity' },
      ],
    },
    {
      id: 'q_neuro_onset',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Did the headache start suddenly like a thunderclap or gradually worsen over hours?',
        hi: 'क्या सिरदर्द अचानक से बहुत तेज़ शुरू हुआ या धीरे-धीरे घंटों में बढ़ा?',
        kn: 'ತಲೆನೋವು ದಿಡೀರನೆ ತೀವ್ರವಾಗಿ ಪ್ರಾರಂಭವಾಯಿತೇ ಅಥವಾ ಗಂಟೆಗಳಲ್ಲಿ ಹೆಚ್ಚಾಯಿತೇ?',
      },
      options: [
        { label: 'Thunderclap Sudden (<1 Minute)', value: 'Sudden hyper-acute onset (Thunderclap)' },
        { label: 'Gradual Over Hours', value: 'Gradual progressive onset' },
        { label: 'Recurrent Chronic Episodes', value: 'Recurrent episodic headache' },
      ],
    },
    {
      id: 'q_neuro_triggers',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Is the headache triggered by high stress, lack of sleep, skipping meals, screen time, or hot sun?',
        hi: 'क्या सिरदर्द तनाव, नींद की कमी, खाना छोड़ने, स्क्रीन देखने या धूप से बढ़ता है?',
        kn: 'ತಲೆನೋವು ಒತ್ತಡ, ನಿದ್ರೆಯ ಅಭಾವ, ಊಟ ಬಿಡುವುದು ಅಥವಾ ಕಂಪ್ಯೂಟರ್ ನೋಡುವುದರಿಂದ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Stress & Mental Exhaustion', value: 'Occupational stress and strain' },
        { label: 'Lack of Sleep / Screen Time', value: 'Sleep deprivation and screen fatigue' },
        { label: 'Fasted / Skipped Meals', value: 'Hypoglycemia / Skipped meal trigger' },
        { label: 'Sunlight / Heat Exposure', value: 'Thermal heat trigger' },
      ],
    },
    {
      id: 'q_neuro_red_flags',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have neck stiffness, high fever, facial numbness, or weakness in your arms/legs?',
        hi: 'क्या आपको गर्दन में जकड़न, तेज़ बुखार, चेहरे में सुन्नपन या हाथ-पैर में कमजोरी है?',
        kn: 'ನಿಮಗೆ ಕುತ್ತಿಗೆ ಜಡತ್ವ, ತೀವ್ರ ಜ್ವರ, ಮುಖದ ಮರವು ಅಥವಾ ಕೈಕಾಲುಗಳಲ್ಲಿ ದೌರ್ಬಲ್ಯ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Neck Stiffness & Fever', value: 'Meningeal signs (Neck stiffness & fever)' },
        { label: 'Limb Weakness / Facial Numbness', value: 'Focal neurological deficits (Weakness/Numbness)' },
        { label: 'No neck stiffness or weakness', value: 'Denies focal deficits or neck stiffness' },
      ],
    },
    {
      id: 'q_neuro_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you taking painkiller pills (Paracetamol, Vasograin, Combiflam) or caffeine for relief?',
        hi: 'क्या आप सिरदर्द के लिए दर्द निवारक दवा (Paracetamol, Vasograin) या चाय/कॉफी ले रहे हैं?',
        kn: 'ನೀವು ತಲೆನೋವಿಗೆ ನೋವುನಿವಾರಕ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Vasograin / Migraine Meds', value: 'Ergotamine / Triptan migraine tablets' },
        { label: 'Paracetamol / Combiflam', value: 'Over-the-counter analgesic tablets' },
        { label: 'Balm Application / Tea', value: 'Topical analgesic balm and hot tea' },
        { label: 'No pain medications taken', value: 'No headache medication taken' },
      ],
    },
    {
      id: 'q_neuro_history',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a history of chronic Migraines, Sinusitis, High Blood Pressure, or Cervical spondylosis?',
        hi: 'क्या आपको माइग्रेन, साइनस, हाई बीपी या सर्वाइकल की पुरानी समस्या है?',
        kn: 'ನಿಮಗೆ ಮೈಗ್ರೇನ್, ಸೈನಸ್, ರಕ್ತದೊತ್ತಡ ಅಥವಾ ಸರ್ವಿಕಲ್ ತೊಂದರೆ ಇತಿಹಾಸವಿದೆಯೇ?',
      },
      options: [
        { label: 'Chronic Migraine History', value: 'Established Migraine headache disorder' },
        { label: 'High Blood Pressure (Hypertension)', value: 'Hypertensive vascular headache' },
        { label: 'Sinusitis / Allergic Rhinitis', value: 'Chronic Sinusitis' },
        { label: 'Cervical Spondylosis', value: 'Cervicogenic headache history' },
        { label: 'No prior headache history', value: 'No chronic headache background' },
      ],
    },
    {
      id: 'q_neuro_sleep',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How many hours of restful sleep do you get per night, and do you feel mentally exhausted?',
        hi: 'आप रोजाना कितने घंटे सोते हैं, और क्या आप मानसिक रूप से अत्यधिक थका हुआ महसूस करते हैं?',
        kn: 'ನೀವು ರಾತ್ರಿ ಎಷ್ಟು ಗಂಟೆ ನಿದ್ರೆ ಮಾಡುತ್ತೀರಿ ಮತ್ತು ಮಾನಸಿಕ ಆಯಾಸವಿದೆಯೇ?',
      },
      options: [
        { label: 'Poor Sleep (<5 Hours)', value: 'Chronic sleep deprivation (<5 hours)' },
        { label: 'Disturbed Interrupted Sleep', value: 'Insomnia and fragmented sleep' },
        { label: 'Normal Restful Sleep', value: 'Adequate 7-8 hours sleep' },
      ],
    },
    {
      id: 'q_neuro_ayush_vata_pitta',
      category: 'ayush',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'AYUSH Assessment: Is your headache aggravated by cold wind/stress (Vata Shirashoola) or acidity/heat (Pitta Shirashoola)?',
        hi: 'आयुष मूल्यांकन: क्या सिरदर्द ठंडी हवा/तनाव से बढ़ता है (वात सिरशूल) या एसिडिटी/गर्मी से (पित्त सिरशूल)?',
        kn: 'ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ: ತಲೆನೋವು ತಣ್ಣನೆಯ ಗಾಳಿಯಿಂದ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ (ವಾತ) ಅಥವಾ ಅಸಿಡಿಟಿಯಿಂದ (ಪಿತ್ತ)?',
      },
      options: [
        { label: 'Throbbing Heat & Acidity (Pitta)', value: 'Pitta Shirashoola (Acidity & heat triggered)' },
        { label: 'Stress & Cold Wind Pain (Vata)', value: 'Vata Shirashoola (Stress & cold triggered)' },
        { label: 'Heavy Dull Head (Kapha)', value: 'Kapha Shirashoola (Heaviness & congestion)' },
        { label: 'Balanced Baseline', value: 'Normal Samprapti' },
      ],
    },
  ],

  metabolic: [
    {
      id: 'q_metabolic_reason',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'What is the primary reason for your visit today (routine BP/Sugar checkup, prescription refill, or high home readings)?',
        hi: 'आज आने का मुख्य कारण क्या है (रूटीन बीपी/शुगर जांच, पुरानी दवा की पर्ची नवीनीकरण या घर पर रीडिंग ज्यादा आना)?',
        kn: 'ಇಂದು ಭೇಟಿ ನೀಡಲು ಮುಖ್ಯ ಕಾರಣವೇನು (ಬಿಪಿ/ಸಕ್ಕರೆ ತಪಾಸಣೆ, ಔಷಧಿ ರೀಫಿಲ್ ಅಥವಾ ಹೆಚ್ಚು ರೀಡಿಂಗ್)?',
      },
      options: [
        { label: 'Routine Quarterly OPD Checkup', value: 'Routine quarterly chronic disease checkup' },
        { label: 'High Blood Pressure Home Reading', value: 'Elevated home Blood Pressure reading' },
        { label: 'High Blood Sugar Home Reading', value: 'Elevated blood glucose test reading' },
        { label: 'Medicine Refill & Prescription', value: 'Chronic medication refill request' },
      ],
    },
    {
      id: 'q_metabolic_bp_readings',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'What is your typical Blood Pressure level, and do you feel chest heaviness or heart palpitations?',
        hi: 'आपका आमतौर पर बीपी कितना रहता है, और क्या आपको सीने में भारीपन या धड़कन तेज महसूस होती है?',
        kn: 'ನಿಮ್ಮ ಸಾಮಾನ್ಯ ರಕ್ತದೊತ್ತಡದ ಮಟ್ಟ ಎಷ್ಟು ಮತ್ತು ಎದೆ ಭಾರ ಅನಿಸುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'High (Systolic >140)', value: 'Uncontrolled Hypertension (>140/90 mmHg)' },
        { label: 'Normal Controlled (120/80)', value: 'Normotensive controlled BP' },
        { label: 'Frequent Head Heaviness / Palpitations', value: 'Hypertensive symptoms (Head heaviness/palpitations)' },
        { label: 'Unsure of BP reading', value: 'Unmeasured Blood Pressure' },
      ],
    },
    {
      id: 'q_metabolic_sugar_readings',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'What was your last Fasting / Post-meal Blood Sugar level or HbA1c reading if tested?',
        hi: 'आपकी आखिरी फास्टिंग/पीपी शुगर या HbA1c जांच में रीडिंग कितनी आई थी?',
        kn: 'ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಸಕ್ಕರೆ ಮಟ್ಟ ಅಥವಾ HbA1c ರೀಡಿಂಗ್ ಎಷ್ಟಿತ್ತು?',
      },
      options: [
        { label: 'High Fasting (>140 mg/dL)', value: 'Elevated fasting blood glucose (>140 mg/dL)' },
        { label: 'High Post-Meal (>200 mg/dL)', value: 'Elevated postprandial blood glucose (>200 mg/dL)' },
        { label: 'High HbA1c (>8.0%)', value: 'Elevated HbA1c (>8.0%)' },
        { label: 'Normal Sugar Readings', value: 'Normoglycemic controlled glucose' },
      ],
    },
    {
      id: 'q_metabolic_polyuria',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you noticed excessive thirst, frequent night urination, or sudden increased hunger?',
        hi: 'क्या आपको बहुत ज्यादा प्यास लगना, रात में बार-बार पेशाब आना या ज्यादा भूख लगना महसूस होता है?',
        kn: 'ನಿಮಗೆ ಅತಿಯಾದ ಬಾಯಾರಿಕೆ, ರಾತ್ರಿ ಪದೇ ಪದೇ ಮೂತ್ರ ವಿಸರ್ಜನೆ ಅಥವಾ ಹೆಚ್ಚು ಹಸಿವು ಇದೆಯೇ?',
      },
      options: [
        { label: 'Frequent Night Urination (Nocturia)', value: 'Polydipsia and nocturnal polyuria' },
        { label: 'Excessive Thirst & Dry Mouth', value: 'Excessive thirst and dry mouth' },
        { label: 'Increased Hunger & Fatigue', value: 'Polyphagia and chronic fatigue' },
        { label: 'No osmotic symptoms', value: 'Denies polyuria or polydipsia' },
      ],
    },
    {
      id: 'q_metabolic_neuropathy',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you experience tingling, numbness, or burning sensations in your feet or hands?',
        hi: 'क्या आपके पैरों या हाथों में झुनझुनी, सुन्नपन या जलन महसूस होती है?',
        kn: 'ನಿಮ್ಮ ಕಾಲುಗಳಲ್ಲಿ ಅಥವಾ ಕೈಗಳಲ್ಲಿ ಜುಮ್ಮೆನ್ನುವುದು, ಮರವು ಅಥವಾ ಉರಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Foot Tingling & Numbness', value: 'Distal symmetrical polyneuropathy (Tingling/Numbness)' },
        { label: 'Burning Soles of Feet', value: 'Burning feet syndrome' },
        { label: 'No tingling or numbness', value: 'Denies peripheral neuropathic signs' },
      ],
    },
    {
      id: 'q_metabolic_vision',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you noticed blurry vision, eye strain, or recent changes in your eyesight focus?',
        hi: 'क्या आपकी आंखों की रोशनी धुंधली हुई है या चश्मे के नंबर में बदलाव आया है?',
        kn: 'ನಿಮಗೆ ಮಂಜು ದೃಷ್ಟಿ ಅಥವಾ ಕಣ್ಣಿನ ತೊಂದರೆ ಅನಿಸುತ್ತಿದೆಯೇ?',
      },
      options: [
        { label: 'Recent Vision Blurring', value: 'Fluctuating blurry vision (Retinopathy check)' },
        { label: 'Frequent Glasses Change', value: 'Frequent refractive changes' },
        { label: 'Normal Clear Vision', value: 'Unremarkable ocular vision' },
      ],
    },
    {
      id: 'q_metabolic_wounds',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have any cuts, foot sores, or wounds on your body that take a very long time to heal?',
        hi: 'क्या पैरों या शरीर पर कोई घाव या कट है जो बहुत लंबे समय तक ठीक नहीं होता?',
        kn: 'ನಿಮ್ಮ ಕಾಲಿನಲ್ಲಿ ಅಥವಾ ದೇಹದಲ್ಲಿ ಸುಲಭವಾಗಿ ವಾಸಿಯಾಗದ ಗಾಯಗಳಿವೆಯೇ?',
      },
      options: [
        { label: 'Slow Healing Foot Wound', value: 'Delayed wound healing / Diabetic foot ulcer risk' },
        { label: 'Frequent Skin Infections', value: 'Recurrent cutaneous bacterial/fungal infections' },
        { label: 'No chronic wounds', value: 'Denies non-healing wounds' },
      ],
    },
    {
      id: 'q_metabolic_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'What daily BP tablets (Amlodipine, Telmisartan) or Diabetes medicines (Metformin, Insulin) do you take?',
        hi: 'आप रोजाना बीपी (Amlodipine, Telmisartan) या शुगर (Metformin, इंसुलिन) की कौन सी दवाएं लेते हैं?',
        kn: 'ನೀವು ದಿನನಿತ್ಯದ ಬಿಪಿ ಅಥವಾ ಸಕ್ಕರೆ ಕಾಯಿಲೆ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Metformin / Oral Sugar Pills', value: 'Oral hypoglycemic tablets (Metformin/Glimepiride)' },
        { label: 'Insulin Injections Daily', value: 'Subcutaneous Insulin injections' },
        { label: 'BP Tablets (Telmisartan/Amlodipine)', value: 'Antihypertensive agents (Telmisartan/Amlodipine)' },
        { label: 'Statin / Cholesterol Pills', value: 'Lipid lowering Statin pills' },
        { label: 'No daily medications', value: 'No chronic prescription drugs taken' },
      ],
    },
    {
      id: 'q_metabolic_compliance',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you take your daily prescribed medications regularly without skipping any doses?',
        hi: 'क्या आप अपनी रोजाना की दवाएं बिना कोई खुराक छोड़े समय पर नियमित लेते हैं?',
        kn: 'ನೀವು ನಿಗದಿತ ಔಷಧಿಗಳನ್ನು ತಪ್ಪಿಸದೆ ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Strict 100% Daily Adherence', value: 'Excellent medication adherence' },
        { label: 'Occasional Missed Doses', value: 'Suboptimal medication adherence' },
        { label: 'Stopped Pills Recently', value: 'Discontinued medication self-directed' },
      ],
    },
    {
      id: 'q_metabolic_comorbidities',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a medical history of heart disease, kidney problems, high cholesterol, or thyroid?',
        hi: 'क्या आपको दिल की बीमारी, गुर्दे (किडनी) की समस्या, कोलेस्ट्रॉल या थायराइड है?',
        kn: 'ನಿಮಗೆ ಹೃದಯ ಸಂಬಂಧಿ ಕಾಯಿಲೆ, ಮೂತ್ರಪಿಂಡದ ತೊಂದರೆ, ಕೊಲೆಸ್ಟ್ರಾಲ್ ಅಥವಾ ಥೈರಾಯ್ಡ್ ಇದೆಯೇ?',
      },
      options: [
        { label: 'High Cholesterol / Lipids', value: 'Hyperlipidemia history' },
        { label: 'Kidney Disease / High Creatinine', value: 'Chronic Kidney Disease (CKD) history' },
        { label: 'Heart Attack / Stent', value: 'Ischemic Heart Disease history' },
        { label: 'Thyroid Disorder', value: 'Hypothyroidism / Thyroid disorder' },
        { label: 'No known comorbidities', value: 'No additional chronic comorbidities' },
      ],
    },
    {
      id: 'q_metabolic_diet_exercise',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you maintain a low-salt, low-sugar diet and engage in daily walking or physical exercise?',
        hi: 'क्या आप कम नमक, कम चीनी का परहेज रखते हैं और रोजाना टहलने या व्यायाम करते हैं?',
        kn: 'ನೀವು ಕಡಿಮೆ ಉಪ್ಪು, ಕಡಿಮೆ ಸಕ್ಕರೆ ಆಹಾರ ಸೇವಿಸುತ್ತೀರಾ ಮತ್ತು ದಿನನಿತ್ಯ ವ್ಯಾಯಾಮ ಮಾಡುತ್ತೀರಾ?',
      },
      options: [
        { label: 'Regular 30 Min Daily Walking', value: 'Compliant with daily aerobic physical exercise' },
        { label: 'Dietary Restriction (Low Salt/Sugar)', value: 'Strict diabetic and low-sodium dietary restriction' },
        { label: 'Sedentary Lifestyle (No exercise)', value: 'Sedentary physical routine' },
      ],
    },
    {
      id: 'q_metabolic_ayush_kapha',
      category: 'ayush',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'AYUSH Assessment: Do you experience post-meal heaviness, water retention, or slow digestion (Kapha balance)?',
        hi: 'आयुष मूल्यांकन: क्या खाना खाने के बाद बहुत भारीपन, शरीर में सूजन या धीमा पाचन रहता है (कफ संतुलन)?',
        kn: 'ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ: ಊಟದ ನಂತರ ತೀವ್ರ ಭಾರ, ದೇಹದಲ್ಲಿ ಊತ ಅಥವಾ ನಿಧಾನ ಜೀರ್ಣಕ್ರಿಯೆ ಇದೆಯೇ (ಕಫ)?',
      },
      options: [
        { label: 'Heavy Post-meal & Lethargy (Kapha)', value: 'Kapha Medo-Dhatu Dushti (Prameha sign)' },
        { label: 'Burning Heat & Thirst (Pitta)', value: 'Pitta / Ushna Vitiation' },
        { label: 'Nerve Pain & Dryness (Vata)', value: 'Vata / Ruksha Vitiation' },
        { label: 'Balanced Baseline', value: 'Sama Prakriti balance' },
      ],
    },
  ],

  cardiac: [
    {
      id: 'q_cardiac_site',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Where exactly in your chest is the pain or pressure located (center, left side, or back)?',
        hi: 'छाती में दर्द या दबाव ठीक कहाँ (बीच में, बाईं तरफ या पीठ में) महसूस हो रहा है?',
        kn: 'ಎದೆಯಲ್ಲಿ ನೋವು ಅಥವಾ ಒತ್ತಡ ಎಲ್ಲಿದೆ (ಮಧ್ಯದಲ್ಲಿ, ಎಡಭಾಗದಲ್ಲಿ, ಅಥವಾ ಬೆನ್ನಿನಲ್ಲಿ)?',
      },
      options: [
        { label: 'Center of Chest', value: 'Retrosternal central chest' },
        { label: 'Left Side of Chest', value: 'Left chest region' },
        { label: 'Radiating to Back', value: 'Chest pain spreading to back' },
        { label: 'Whole Upper Chest', value: 'Generalized upper chest pressure' },
      ],
    },
    {
      id: 'q_cardiac_char',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How does the chest discomfort feel (crushing heavy weight, sharp stabbing, or burning acidity)?',
        hi: 'छाती का दर्द कैसा लगता है (भारी दबाव, तेज चुभन या जलन)?',
        kn: 'ಎದೆ ನೋವು ಹೇಗೆ ಭಾಸವಾಗುತ್ತದೆ (ಭಾರವಾದ ಒತ್ತಡ, ತೀವ್ರ ಚುಚ್ಚುವಿಕೆ, ಅಥವಾ ಉರಿ)?',
      },
      options: [
        { label: 'Crushing Heavy Weight', value: 'Crushing heavy pressure' },
        { label: 'Sharp Stabbing Pain', value: 'Sharp stabbing pain' },
        { label: 'Burning Acidity', value: 'Retrosternal burning discomfort' },
        { label: 'Tightness / Constricting', value: 'Tight constricting sensation' },
      ],
    },
    {
      id: 'q_cardiac_radiation',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does the pain spread to your left arm, shoulder, neck, jaw, or stomach?',
        hi: 'क्या यह दर्द आपके बाएं हाथ, कंधे, गर्दन, जबड़े या पेट में फैलता है?',
        kn: 'ಈ ನೋವು ನಿಮ್ಮ ಎಡಕೈ, ಹೆಗಲು, ಕುತ್ತಿಗೆ, ದವಡೆ ಅಥವಾ ಹೊಟ್ಟೆಗೆ ಹರಡುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Left Arm & Shoulder', value: 'Radiation to left arm and shoulder' },
        { label: 'Jaw & Neck', value: 'Radiation to jaw and neck' },
        { label: 'Back & Stomach', value: 'Radiation to epigastrium and back' },
        { label: 'Does not spread', value: 'Localized pain, no radiation' },
      ],
    },
    {
      id: 'q_cardiac_severity',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How severe is this chest pain on a scale of mild, moderate, severe, or unbearable?',
        hi: 'यह छाती का दर्द कितना तेज है (हल्का, मध्यम, बहुत तेज़ या असहनीय)?',
        kn: 'ಈ ಎದೆ ನೋವು ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ (ಸೌಮ್ಯ, ಮಧ್ಯಮ, ತೀವ್ರ, ಅಥವಾ ತಡೆಯಲಾಗದ)?',
      },
      options: [
        { label: 'Mild (1-3)', value: 'Mild intensity' },
        { label: 'Moderate (4-6)', value: 'Moderate intensity' },
        { label: 'Severe (7-9)', value: 'Severe intense pain' },
        { label: 'Unbearable (10)', value: 'Unbearable excruciating pain' },
      ],
    },
    {
      id: 'q_cardiac_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How long has this current episode of chest pain lasted (minutes, hours, or days)?',
        hi: 'सीने में दर्द का यह दौरा कितने समय से चल रहा है (मिनट, घंटे या दिन)?',
        kn: 'ಎದೆ ನೋವಿನ ಈ ಕಂತು ಎಷ್ಟು ಸಮಯದಿಂದ ಇದೆ (ನಿಮಿಷಗಳು, ಗಂಟೆಗಳು, ಅಥವಾ ದಿನಗಳು)?',
      },
      options: [
        { label: 'Less than 15 Minutes', value: 'Episodic (<15 minutes)' },
        { label: '30 Minutes to 1 Hour', value: 'Persistent (30 mins to 1 hour)' },
        { label: 'Several Hours Continuous', value: 'Continuous for several hours' },
        { label: 'Intermittent for Days', value: 'Intermittent over days' },
      ],
    },
    {
      id: 'q_cardiac_triggers',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does walking, climbing stairs, physical exertion, or emotional stress make the pain worse?',
        hi: 'क्या चलने, सीढ़ियां चढ़ने, काम करने या तनाव से दर्द बढ़ता है?',
        kn: 'ನಡೆಯುವುದು, ಮೆಟ್ಟಿಲು ಹತ್ತುವುದು ಅಥವಾ ಒತ್ತಡದಿಂದ ನೋವು ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Walking / Climbing Stairs', value: 'Worse with exertion or walking' },
        { label: 'Deep Breathing', value: 'Worse with deep inspiration' },
        { label: 'Lying Flat', value: 'Worse when lying flat (Orthopnea)' },
        { label: 'No specific trigger', value: 'No physical exertion trigger' },
      ],
    },
    {
      id: 'q_cardiac_relieving',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'What gives you relief from the chest discomfort (resting, taking water, or sitting up)?',
        hi: 'किस चीज से आपको सीने के दर्द में आराम मिलता है (आराम करने से, पानी पीने से या बैठने से)?',
        kn: 'ಯಾವ ಕಾರ್ಯದಿಂದ ಎದೆ ನೋವಿಗೆ ಶಮನ ಸಿಗುತ್ತದೆ (ವಿಶ್ರಾಂತಿ, ನೀರು, ಅಥವಾ ಕುಳಿತುಕೊಳ್ಳುವುದು)?',
      },
      options: [
        { label: 'Resting Immediately', value: 'Relieved quickly by resting' },
        { label: 'Taking Antacid / Medicine', value: 'Relieved by antacids or nitrate pill' },
        { label: 'Sitting Forward', value: 'Relieved by leaning forward' },
        { label: 'Nothing helps', value: 'Refractory, no relief with rest' },
      ],
    },
    {
      id: 'q_cardiac_autonomic',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you experiencing cold sweating, nausea, dizziness, or weakness right now?',
        hi: 'क्या आपको ठंडा पसीना, उल्टी की इच्छा, चक्कर आना या कमजोरी महसूस हो रही है?',
        kn: 'ನಿಮಗೆ ತಣ್ಣನೆಯ ಬೆವರು, ವಾಕರಿಕೆ, ತಲೆತಿರುಗುವಿಕೆ ಅಥವಾ ದೌರ್ಬಲ್ಯ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Profuse Cold Sweating', value: 'Profuse cold sweating' },
        { label: 'Nausea & Vomiting', value: 'Nausea and gastric vomiting' },
        { label: 'Dizziness / Lightheadedness', value: 'Dizziness and pre-syncope' },
        { label: 'None of these', value: 'No associated autonomic symptoms' },
      ],
    },
    {
      id: 'q_cardiac_breathlessness',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you feeling short of breath or suffocated even while sitting quietly?',
        hi: 'क्या आराम से बैठे रहने पर भी आपको सांस लेने में तकलीफ या घबराहट हो रही है?',
        kn: 'ಶಾಂತವಾಗಿ ಕುಳಿತಿದ್ದರೂ ನಿಮಗೆ ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ಉಸಿರುಗಟ್ಟುವಿಕೆ ಅನಿಸುತ್ತಿದೆಯೇ?',
      },
      options: [
        { label: 'Severe Dyspnea at Rest', value: 'Severe breathlessness at rest' },
        { label: 'Breathlessness on Walking', value: 'Exertional dyspnea on walking' },
        { label: 'Breathlessness Lying Flat', value: 'Orthopnea requiring extra pillows' },
        { label: 'Normal Breathing', value: 'Denies dyspnea or breathlessness' },
      ],
    },
    {
      id: 'q_cardiac_pmh',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a history of High Blood Pressure, Heart Stents, Diabetes, or Cholesterol?',
        hi: 'क्या आपको हाई बीपी, दिल में स्टेंट, डायबिटीज या कोलेस्ट्रॉल की बीमारी है?',
        kn: 'ನಿಮಗೆ ರಕ್ತದೊತ್ತಡ, ಹೃದಯದ ಸ್ಟೆಂಟ್, ಸಕ್ಕರೆ ಕಾಯಿಲೆ ಅಥವಾ ಕೊಲೆಸ್ಟ್ರಾಲ್ ತೊಂದರೆ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Hypertension & BP Pills', value: 'Hypertension on regular medication' },
        { label: 'Heart Attack / Stent History', value: 'Prior Coronary Stent / Angioplasty' },
        { label: 'Diabetes Mellitus', value: 'Diabetes Mellitus' },
        { label: 'No prior cardiac history', value: 'No known chronic cardiac risks' },
      ],
    },
    {
      id: 'q_cardiac_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you taking daily heart medicines, blood thinners like Aspirin, or BP tablets?',
        hi: 'क्या आप दिल की दवाएं, खून पतला करने की गोली (Aspirin) या बीपी की दवा ले रहे हैं?',
        kn: 'ನೀವು ದಿನನಿತ್ಯದ ಹೃದಯದ ಔಷಧಿಗಳನ್ನು, ರಕ್ತ ತೆಳುವಾಗಿಸುವ ಮಾತ್ರೆಗಳು ಅಥವಾ BP ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Aspirin / Blood Thinners', value: 'Aspirin or Antiplatelet therapy' },
        { label: 'BP / Hypertension Pills', value: 'Antihypertensive tablets' },
        { label: 'Cholesterol / Statin Pills', value: 'Statin cholesterol medication' },
        { label: 'No daily medicines', value: 'No regular medications taken' },
      ],
    },
    {
      id: 'q_cardiac_allergies',
      category: 'allergies',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have known allergies to any medicines, painkiller pills, or iodine dyes?',
        hi: 'क्या आपको किसी दवा, दर्द निवारक गोली या इंजेक्शन से एलर्जी है?',
        kn: 'ನಿಮಗೆ ಯಾವುದೇ ಔಷಧಗಳು, ನೋವುನಿವಾರಕ ಮಾತ್ರೆಗಳು ಅಥವಾ ಇಂಜೆಕ್ಷನ್‌ಗೆ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Penicillin / Antibiotics', value: 'Penicillin antibiotic allergy' },
        { label: 'Painkiller Allergy (NSAID)', value: 'NSAID painkiller allergy' },
        { label: 'No known allergies', value: 'No known drug allergies' },
      ],
    },
    {
      id: 'q_cardiac_lifestyle',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you smoke tobacco, drink alcohol, or experience severe daily stress?',
        hi: 'क्या आप तंबाकू/सिगरेट का सेवन, शराब या अत्यधिक तनाव का सामना करते हैं?',
        kn: 'ನೀವು ತಂಬಾಕು, ಸಿಗರೇಟ್, ಮದ್ಯಪಾನ ಅಥವಾ ತೀವ್ರ ಒತ್ತಡವನ್ನು ಅನುಭವಿಸುತ್ತೀರಾ?',
      },
      options: [
        { label: 'Tobacco / Smoking', value: 'Tobacco smoking history' },
        { label: 'Alcohol Intake', value: 'Alcohol consumption' },
        { label: 'High Daily Stress', value: 'High occupational stress' },
        { label: 'Healthy Lifestyle', value: 'Non-smoker, healthy lifestyle' },
      ],
    },
  ],

  fever: [
    {
      id: 'q_fever_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How many days have you had fever, and is the body temperature very high?',
        hi: 'आपको कितने दिनों से बुखार है, और क्या शरीर का तापमान बहुत तेज है?',
        kn: 'ನಿಮಗೆ ಎಷ್ಟು ದಿನಗಳಿಂದ ಜ್ವರವಿದೆ, ಮತ್ತು ದೇಹದ ತಾಪಮಾನ ಬಹಳ ಹೆಚ್ಚಿದೆಯೇ?',
      },
      options: [
        { label: '1-2 Days High Fever', value: 'Acute high fever for 1-2 days' },
        { label: '3-5 Days Persistent Fever', value: 'Persistent fever for 3-5 days' },
        { label: 'More than 1 Week', value: 'Prolonged fever (>7 days)' },
        { label: 'Low Grade Evening Fever', value: 'Low grade fever with evening spike' },
      ],
    },
    {
      id: 'q_fever_chills',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does the fever come with shivering chills or heavy sweating episodes?',
        hi: 'क्या बुखार के साथ ठंड लगकर कंपकंपी आती है या बहुत पसीना निकलता है?',
        kn: 'ಜ್ವರವು ಚಳಿ, ನಡುಕ ಅಥವಾ ಅತಿಯಾದ ಬೆವರಿನೊಂದಿಗೆ ಬರುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Severe Chills & Rigor', value: 'High fever with severe chills and rigor' },
        { label: 'Night Sweats', value: 'Profuse sweating episodes' },
        { label: 'Continuous Heat', value: 'Continuous heat without chills' },
      ],
    },
    {
      id: 'q_fever_resp',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have cough, sore throat, running nose, or chest congestion?',
        hi: 'क्या आपको खांसी, गले में खराश, बहती नाक या सीने में जकड़न है?',
        kn: 'ನಿಮಗೆ ಕೆಮ್ಮು, ಗಂಟಲು ನೋವು, ಮೂಗು ಸೋರುವುದು ಅಥವಾ ಎದೆ ಕಟ್ಟುವುದು ಇದೆಯೇ?',
      },
      options: [
        { label: 'Dry Cough & Sore Throat', value: 'Dry cough and sore throat' },
        { label: 'Productive Cough with Phlegm', value: 'Cough with purulent sputum' },
        { label: 'Running Nose & Sneezing', value: 'Nasal congestion and sneezing' },
        { label: 'No upper respiratory symptoms', value: 'Denies upper respiratory symptoms' },
      ],
    },
    {
      id: 'q_fever_bodyache',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have severe muscle pain, joint aches, or pain behind your eyes?',
        hi: 'क्या आपको शरीर में तेज दर्द, जोड़ों में दर्द या आंखों के पीछे दर्द है?',
        kn: 'ನಿಮಗೆ ತೀವ್ರ ಸ್ನಾಯು ನೋವು, ಕೀಲು ನೋವು ಅಥವಾ ಕಣ್ಣುಗಳ ಹಿಂದೆ ನೋವು ಇದೆಯೇ?',
      },
      options: [
        { label: 'Severe Joint & Eye Pain', value: 'Severe polyarthralgia and retro-orbital pain' },
        { label: 'Generalized Body Ache', value: 'Generalized myalgia' },
        { label: 'Lower Back Pain', value: 'Severe lumbar body ache' },
        { label: 'Mild Body Ache', value: 'Mild muscle ache' },
      ],
    },
    {
      id: 'q_fever_gi',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you feeling nausea, vomiting, loss of appetite, or stomach cramps?',
        hi: 'क्या आपको जी मिचलाना, उल्टी, भूख न लगना या पेट में मरोड़ है?',
        kn: 'ನಿಮಗೆ ವಾಕರಿಕೆ, ವಾಂತಿ, ಹಸಿವಿಲ್ಲದಿರುವುದು ಅಥವಾ ಹೊಟ್ಟೆ ನೋವು ಇದೆಯೇ?',
      },
      options: [
        { label: 'Persistent Vomiting', value: 'Nausea and persistent vomiting' },
        { label: 'Loss of Appetite & Acidity', value: 'Anorexia and epigastric discomfort' },
        { label: 'Loose Diarrhea Stools', value: 'Watery diarrhea and cramps' },
        { label: 'Normal Appetite', value: 'No gastric disturbance' },
      ],
    },
    {
      id: 'q_fever_rash',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you noticed any red spots, skin rash, or bleeding spots on your body?',
        hi: 'क्या आपने शरीर पर कोई लाल चकत्ते, दाने या खून के धब्बे देखे हैं?',
        kn: 'ನಿಮ್ಮ ದೇಹದ ಮೇಲೆ ಕೆಂಪು ದದ್ದುಗಳು ಅಥವಾ ರಕ್ತದ ಕಲೆಗಳು ಕಾಣಿಸಿಕೊಂಡಿವೆಯೇ?',
      },
      options: [
        { label: 'Red Skin Rash', value: 'Erythematous skin rash' },
        { label: 'Small Red Bleeding Spots', value: 'Petechiae / Purpura spots' },
        { label: 'Itchy Hives', value: 'Urticarial rash' },
        { label: 'No skin rash', value: 'No skin eruptions' },
      ],
    },
    {
      id: 'q_fever_headache',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have severe headache, neck stiffness, dizziness, or light sensitivity?',
        hi: 'क्या आपको तेज सिरदर्द, गर्दन में जकड़न, चक्कर आना या रोशनी से तकलीफ है?',
        kn: 'ನಿಮಗೆ ತೀವ್ರ ತಲೆನೋವು, ಕುತ್ತಿಗೆ ಜಡತ್ವ, ತಲೆತಿರುಗುವಿಕೆ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Severe Frontal Headache', value: 'Severe throbbing headache' },
        { label: 'Neck Stiffness', value: 'Neck stiffness and photophobia' },
        { label: 'Dizziness & Confusion', value: 'Giddiness and weakness' },
        { label: 'Mild Headache', value: 'Mild tension headache' },
      ],
    },
    {
      id: 'q_fever_urine',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you experience burning sensation during urination or yellow urine color?',
        hi: 'क्या आपको पेशाब में जलन महसूस होती है या पेशाब का रंग गहरा पीला है?',
        kn: 'ಮೂತ್ರ ವಿಸರ್ಜನೆಯ ಸಮಯದಲ್ಲಿ ಉರಿ ಅಥವಾ ಹಳದಿ ಮೂತ್ರದ ಬಣ್ಣ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Burning Dysuria', value: 'Burning sensation during micturition' },
        { label: 'Dark Yellow Urine', value: 'Dark yellow concentrated urine' },
        { label: 'Frequent Urination', value: 'Urinary frequency and urgency' },
        { label: 'Normal Urination', value: 'Normal urinary habit' },
      ],
    },
    {
      id: 'q_fever_meds_response',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Did you take Paracetamol or fever pills, and did your temperature come down?',
        hi: 'क्या आपने पैरासिटामॉल ली, और क्या उससे आपका बुखार उतरा?',
        kn: 'ನೀವು ಪ್ಯಾರಸಿಟಮಾಲ್ ತೆಗೆದುಕೊಂಡಿದ್ದೀರಾ ಮತ್ತು ಜ್ವರ ಕಡಿಮೆಯಾಯಿತೇ?',
      },
      options: [
        { label: 'Temporary Relief', value: 'Fever reduced temporarily after Paracetamol' },
        { label: 'High Fever Persists', value: 'Refractory fever persistent despite Paracetamol' },
        { label: 'First Time Taking Meds', value: 'No fever medication taken yet' },
      ],
    },
    {
      id: 'q_fever_contact',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Has anyone in your home had fever, or have you traveled / had mosquito bites recently?',
        hi: 'क्या आपके घर में किसी को बुखार है, या आपने हाल ही में यात्रा की या मच्छर काटे हैं?',
        kn: 'ನಿಮ್ಮ ಮನೆಯಲ್ಲಿ ಯಾರಿಗಾದರೂ ಜ್ವರವಿದೆಯೇ, ಅಥವಾ ಇತ್ತೀಚೆಗೆ ಪ್ರಯಾಣ ಮಾಡಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Family Members Sick', value: 'Household contact with fever' },
        { label: 'Mosquito Bites Area', value: 'Mosquito exposure history' },
        { label: 'Recent Travel', value: 'Recent travel history' },
        { label: 'No known contact', value: 'No sick contact or travel' },
      ],
    },
    {
      id: 'q_fever_pmh',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have medical conditions like Diabetes, Kidney disease, BP, or Low Immunity?',
        hi: 'क्या आपको मधुमेह, गुर्दे की बीमारी, बीपी या कम इम्यूनिटी की शिकायत है?',
        kn: 'ನಿಮಗೆ ಸಕ್ಕರೆ ಕಾಯಿಲೆ, ಮೂತ್ರಪಿಂಡದ ತೊಂದರೆ, BP ಇದೆಯೇ?',
      },
      options: [
        { label: 'Diabetes Mellitus', value: 'Diabetes Mellitus' },
        { label: 'Hypertension', value: 'Hypertension' },
        { label: 'Asthma / Bronchitis', value: 'Chronic respiratory illness' },
        { label: 'No chronic diseases', value: 'No chronic underlying conditions' },
      ],
    },
    {
      id: 'q_fever_allergies',
      category: 'allergies',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have known allergies to antibiotic medicines like Penicillin or Painkillers?',
        hi: 'क्या आपको पेनिसिलिन या एंटीबायोटिक दवाओं से एलर्जी है?',
        kn: 'ನಿಮಗೆ ಪ್ಯಾರಸಿಟಮಾಲ್ ಅಥವಾ ಆಂಟಿಬಯೋಟಿಕ್ ಔಷಧಿಯ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Penicillin / Antibiotics', value: 'Penicillin drug allergy' },
        { label: 'Painkiller Allergy', value: 'NSAID painkiller allergy' },
        { label: 'No known allergies', value: 'No known antibiotic allergies' },
      ],
    },
  ],

  gi: [
    {
      id: 'q_gi_site',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Where exactly in your stomach is the pain located (upper belly, right lower side, or navel)?',
        hi: 'पेट में दर्द ठीक कहाँ है (ऊपरी पेट, दाहिने निचले हिस्से या नाभि के पास)?',
        kn: 'ಹೊಟ್ಟೆ ನೋವು ಖಚಿತವಾಗಿ ಎಲ್ಲಿದೆ (ಮೇಲ್ಭಾಗ, ಬಲ ಕೆಳಭಾಗ, ಅಥವಾ ಹೊಕ್ಕುಳ ಹತ್ತಿರ)?',
      },
      options: [
        { label: 'Upper Stomach / Epigastrium', value: 'Epigastric upper stomach pain' },
        { label: 'Right Lower Abdomen', value: 'Right lower quadrant tenderness' },
        { label: 'Around Navel / Umbilicus', value: 'Periumbilical crampy pain' },
        { label: 'Entire Abdomen', value: 'Generalized abdominal distress' },
      ],
    },
    {
      id: 'q_gi_character',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Is the stomach discomfort burning acidity, sharp cramp, heavy bloating, or dull ache?',
        hi: 'क्या पेट की तकलीफ जलन, तेज मरोड़, भारीपन या मीठा दर्द है?',
        kn: 'ಹೊಟ್ಟೆಯ ತೊಂದರೆ ಉರಿ ಆಮ್ಲೀಯತೆ, ತೀವ್ರ ಸೆಳೆತ, ಅಥವಾ ಭಾರವೇ?',
      },
      options: [
        { label: 'Burning Acidity Pain', value: 'Burning hyperacidity pain' },
        { label: 'Sharp Colicky Cramps', value: 'Sharp colicky cramping' },
        { label: 'Heavy Bloating & Gas', value: 'Abdominal distension and gas' },
        { label: 'Dull Continuous Ache', value: 'Dull continuous ache' },
      ],
    },
    {
      id: 'q_gi_food_relation',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does eating food make the stomach pain worse, or is it worse on an empty stomach?',
        hi: 'क्या खाना खाने के बाद पेट दर्द बढ़ता है, या खाली पेट ज्यादा होता है?',
        kn: 'ಊಟ ಮಾಡಿದ ನಂತರ ಹೊಟ್ಟೆ ನೋವು ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ, ಅಥವಾ ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Worse After Eating', value: 'Aggravated immediately after food' },
        { label: 'Worse on Empty Stomach', value: 'Aggravated on empty stomach (relieved by food)' },
        { label: 'Worse After Spicy / Fatty Food', value: 'Triggered by spicy or fatty meals' },
        { label: 'No food relation', value: 'Unrelated to food intake' },
      ],
    },
    {
      id: 'q_gi_nausea_vomiting',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you experienced nausea, vomiting, or vomiting blood/dark fluid?',
        hi: 'क्या आपको उल्टी, जी मिचलाना या उल्टी में खून/काला पानी आया है?',
        kn: 'ನಿಮಗೆ ವಾಕರಿಕೆ, ವಾಂತಿ ಅಥವಾ ರಕ್ತ ವಾಂತಿ ಆಗಿದೆಯೇ?',
      },
      options: [
        { label: 'Frequent Vomiting', value: 'Frequent persistent vomiting' },
        { label: 'Nausea without Vomiting', value: 'Nausea without active emesis' },
        { label: 'Blood in Vomit', value: 'Hematemesis (blood in vomit)' },
        { label: 'No nausea or vomiting', value: 'Denies nausea or vomiting' },
      ],
    },
    {
      id: 'q_gi_acid_reflux',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you get sour burping, acid taste in mouth, or burning sensation up your throat?',
        hi: 'क्या आपको खट्टी डकारें, मुंह में कड़वा पानी या गले तक जलन महसूस होती है?',
        kn: 'ನಿಮಗೆ ಹುಳಿ ತೇಗು, ಬಾಯಲ್ಲಿ ಆಮ್ಲೀಯ ರುಚಿ ಅಥವಾ ಗಂಟಲಲ್ಲಿ ಉರಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Sour Acid Reflux', value: 'Gastroesophageal sour acid reflux' },
        { label: 'Chest Heartburn', value: 'Retrosternal heartburn' },
        { label: 'Frequent Belching & Gas', value: 'Excessive eructation and belching' },
        { label: 'No acid reflux', value: 'Denies reflux symptoms' },
      ],
    },
    {
      id: 'q_gi_bowel_pattern',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are your bowel movements loose diarrhea, severe constipation, or blood in stool?',
        hi: 'क्या आपका पेट साफ होने में दस्त, तेज कब्ज या मल में खून की समस्या है?',
        kn: 'ನಿಮಗೆ ಭೇದಿ, ತೀವ್ರ ಮಲಬದ್ಧತೆ ಅಥವಾ ಮಲದಲ್ಲಿ ರಕ್ತ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Loose Diarrhea Stools', value: 'Acute watery diarrhea' },
        { label: 'Severe Constipation', value: 'Hard constipated stools' },
        { label: 'Blood or Mucus in Stool', value: 'Hematochezia / Mucus in stool' },
        { label: 'Normal Stool Habit', value: 'Normal regular bowel movements' },
      ],
    },
    {
      id: 'q_gi_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How long have you had this stomach problem (recent 1-3 days vs chronic weeks)?',
        hi: 'पेट की यह तकलीफ कितने समय से है (1-3 दिन या हफ्तों से)?',
        kn: 'ಈ ಹೊಟ್ಟೆಯ ತೊಂದರೆ ಎಷ್ಟು ಸಮಯದಿಂದ ಇದೆ (1-3 ದಿನಗಳು ಅಥವಾ ವಾರಗಳು)?',
      },
      options: [
        { label: '1-3 Days Sudden', value: 'Acute onset (1-3 days)' },
        { label: '1-2 Weeks Intermittent', value: 'Subacute (1-2 weeks)' },
        { label: 'Chronic Months', value: 'Chronic longstanding (>1 month)' },
      ],
    },
    {
      id: 'q_gi_appetite_weight',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you experienced severe loss of appetite or sudden weight loss?',
        hi: 'क्या आपकी भूख पूरी तरह मर गई है या वजन अचानक कम हुआ है?',
        kn: 'ನಿಮಗೆ ಹಸಿವಿಲ್ಲದಿರುವುದು ಅಥವಾ ತೂಕ ಕಡಿಮೆಯಾಗುವುದು ಆಗಿದೆಯೇ?',
      },
      options: [
        { label: 'Complete Loss of Appetite', value: 'Severe anorexia' },
        { label: 'Unintended Weight Loss', value: 'Unintentional weight loss' },
        { label: 'Normal Appetite', value: 'Normal preserved appetite' },
      ],
    },
    {
      id: 'q_gi_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you taking acidity pills (Pantoprazole, Gelusil), painkiller tablets, or laxatives?',
        hi: 'क्या आप एसिडिटी की दवा (Pantoprazole), दर्द निवारक दवा या पेट साफ करने की दवा ले रहे हैं?',
        kn: 'ನೀವು ಅಸಿಡಿಟಿ ಮಾತ್ರೆಗಳು, ನೋವುನಿವಾರಕ ಮಾತ್ರೆಗಳು ಅಥವಾ ಲಕ್ಸೇಟಿವ್ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Acidity Pills (PPI / Antacid)', value: 'Proton pump inhibitor / Antacids' },
        { label: 'Painkiller Tablets (NSAIDs)', value: 'NSAID painkiller tablets' },
        { label: 'Ayurvedic Churna', value: 'Ayurvedic digestive churna' },
        { label: 'No gastric medications', value: 'No acidity medications' },
      ],
    },
    {
      id: 'q_gi_pmh',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a history of stomach ulcers, gallstones, fatty liver, or appendix operation?',
        hi: 'क्या आपको पेट में अल्सर, पित्त की पथरी, फैटी लीवर या सर्जरी का इतिहास है?',
        kn: 'ನಿಮಗೆ ಹೊಟ್ಟೆಯ ಹುಣ್ಣು, ಪಿತ್ತಕೋಶದ ಕಲ್ಲು, ಅಥವಾ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ಇತಿಹಾಸವಿದೆಯೇ?',
      },
      options: [
        { label: 'Stomach Ulcers / Gastritis', value: 'Peptic ulcer disease / Gastritis' },
        { label: 'Gallbladder Stones', value: 'Gallstones (Cholelithiasis)' },
        { label: 'Fatty Liver', value: 'Hepatic steatosis / Fatty liver' },
        { label: 'No prior gastric history', value: 'No past gastrointestinal surgery or ulcers' },
      ],
    },
    {
      id: 'q_gi_allergies',
      category: 'allergies',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have known allergies to any stomach medicines, milk, or food items?',
        hi: 'क्या आपको किसी दवा, दूध या विशेष भोजन से एलर्जी है?',
        kn: 'ನಿಮಗೆ ಯಾವುದೇ ಔಷಧಗಳು, ಹಾಲು ಅಥವಾ ಆಹಾರದ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Milk / Lactose Intolerance', value: 'Lactose intolerance' },
        { label: 'Painkiller Allergy', value: 'NSAID drug allergy' },
        { label: 'No food/drug allergies', value: 'No known food or drug allergies' },
      ],
    },
    {
      id: 'q_gi_diet_lifestyle',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you eat spicy/outside food frequently, sleep late, or drink alcohol/tea excessively?',
        hi: 'क्या आप बाहर का तीखा खाना खाते हैं, देर रात सोते हैं या चाय/शराब का अधिक सेवन करते हैं?',
        kn: 'ನೀವು ಖಾರವಾದ ಆಹಾರ ತಿನ್ನುತ್ತೀರಾ, ತಡವಾಗಿ ಮಲಗುತ್ತೀರಾ ಅಥವಾ ಅತಿಯಾಗಿ ಚಹಾ/ಮದ್ಯಪಾನ ಮಾಡುತ್ತೀರಾ?',
      },
      options: [
        { label: 'Spicy / Fried Outside Food', value: 'Frequent spicy fried food' },
        { label: 'Late Night Dinner & Sleep', value: 'Irregular sleeping & late meals' },
        { label: 'Excess Tea / Coffee', value: 'High caffeine / tea consumption' },
        { label: 'Balanced Home Diet', value: 'Wholesome home diet' },
      ],
    },
  ],

  joint: [
    {
      id: 'q_joint_site',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Which joint or body region is causing pain (knees, lower back, shoulder, or hands)?',
        hi: 'किस जोड़ या हिस्से में दर्द है (घुटने, निचली पीठ, कंधा या हाथ के जोड़)?',
        kn: 'ಯಾವ ಕೀಲು ಅಥವಾ ಜಾಗದಲ್ಲಿ ನೋವಿದೆ (ಮೊಣಕಾಲು, ಕೆಳಬೆನ್ನು, ಹೆಗಲು, ಅಥವಾ ಕೈಗಳು)?',
      },
      options: [
        { label: 'Knee Joints', value: 'Bilateral / Unilateral knee joint pain' },
        { label: 'Lower Back & Spine', value: 'Lumbar spinal backache' },
        { label: 'Shoulder / Cervical Neck', value: 'Cervical neck and shoulder pain' },
        { label: 'Small Hand / Finger Joints', value: 'Small joints of hands and feet' },
      ],
    },
    {
      id: 'q_joint_type',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How would you describe the joint pain (throbbing ache, sharp shooting, or stiffness)?',
        hi: 'जोड़ों के दर्द को आप कैसे महसूस करते हैं (टीस मारता दर्द, तेज चुभन या जकड़न)?',
        kn: 'ಕೀಲು ನೋವನ್ನು ನೀವು ಹೇಗೆ ವಿವರಿಸುತ್ತೀರಿ (ತೀವ್ರ ನೋವು, ಚುಚ್ಚುವಿಕೆ, ಅಥವಾ ಜಡತ್ವ)?',
      },
      options: [
        { label: 'Throbbing Deep Pain', value: 'Throbbing deep joint ache' },
        { label: 'Sharp Shooting Nerve Pain', value: 'Sharp shooting radicular pain' },
        { label: 'Severe Joint Stiffness', value: 'Severe joint stiffness' },
        { label: 'Burning Sensation', value: 'Periarticular burning sensation' },
      ],
    },
    {
      id: 'q_joint_swelling',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Is there visible joint swelling, fluid, redness, or heat around the joint?',
        hi: 'क्या जोड़ के आसपास सूजन, लाली या बहुत गरमाहट महसूस होती है?',
        kn: 'ಕೀಲುಗಳ ಸುತ್ತಲೂ ಊತ, ಕೆಂಪು ಬಣ್ಣ ಅಥವಾ ಕಾವು ಇದೆಯೇ?',
      },
      options: [
        { label: 'Visible Joint Swelling', value: 'Joint swelling and effusion' },
        { label: 'Redness & Warmth', value: 'Erythema and warmth around joint' },
        { label: 'No visible swelling', value: 'No joint swelling observed' },
      ],
    },
    {
      id: 'q_joint_stiffness',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you experience morning joint stiffness, and how long does it take to loosen up?',
        hi: 'क्या सुबह उठने पर जोड़ों में जकड़न होती है, और इसे ठीक होने में कितना समय लगता है?',
        kn: 'ಬೆಳಿಗ್ಗೆ ಎದ್ದಾಗ ಕೀಲುಗಳಲ್ಲಿ ಜಡತ್ವ ಇದೆಯೇ ಮತ್ತು ಅದು ಸರಿಯಾಗಲು ಎಷ್ಟು ಸಮಯ ಬೇಕು?',
      },
      options: [
        { label: 'More than 1 Hour Morning Stiffness', value: 'Morning stiffness >1 hour (Inflammatory)' },
        { label: 'Less than 30 Mins Stiffness', value: 'Brief morning stiffness <30 mins (Degenerative)' },
        { label: 'Stiffness After Sitting', value: 'Gelling phenomenon after sitting' },
        { label: 'No morning stiffness', value: 'No morning stiffness' },
      ],
    },
    {
      id: 'q_joint_movement',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does walking, climbing stairs, or bending cause severe difficulty or grating sound?',
        hi: 'क्या चलने, सीढ़ी चढ़ने या झुकने में बहुत तकलीफ या कट-कट की आवाज होती है?',
        kn: 'ನಡೆಯುವುದು, ಮೆಟ್ಟಿಲು ಹತ್ತುವುದು ಅಥವಾ ಬಗ್ಗುವುದು ತೊಂದರೆ ಉಂಟುಮಾಡುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Difficulty Walking / Weight Bearing', value: 'Impaired walking and weight bearing' },
        { label: 'Grating Crepitus Sound', value: 'Joint crepitus and grating sound' },
        { label: 'Inability to Bend / Lift', value: 'Restricted range of motion' },
        { label: 'Normal Mobility', value: 'Preserved joint mobility' },
      ],
    },
    {
      id: 'q_joint_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How long have you had this joint/back problem (recent days vs long-term years)?',
        hi: 'जोड़ों या पीठ की यह समस्या कितने समय से है (कुछ दिन या सालों से)?',
        kn: 'ಈ ಕೀಲು ಅಥವಾ ಬೆನ್ನಿನ ತೊಂದರೆ ಎಷ್ಟು ಸಮಯದಿಂದ ಇದೆ (ದಿನಗಳು ಅಥವಾ ವರ್ಷಗಳು)?',
      },
      options: [
        { label: 'Recent Sudden (1-7 Days)', value: 'Acute onset (1-7 days)' },
        { label: 'Longstanding Chronic Years', value: 'Chronic osteoarthritis / backache (years)' },
        { label: 'Recurrent Flare-ups', value: 'Recurrent arthritis flare-ups' },
      ],
    },
    {
      id: 'q_joint_trauma',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Did this pain start after a fall, injury, sports strain, or lifting heavy weights?',
        hi: 'क्या यह दर्द किसी चोट, गिरने, भारी सामान उठाने या मुड़ने के बाद शुरू हुआ?',
        kn: 'ಬೀಳುವುದು, ಏಟು ಬೀಳುವುದು ಅಥವಾ ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಎತ್ತುವುದರಿಂದ ಈ ನೋವು ಪ್ರಾರಂಭವಾಯಿತೇ?',
      },
      options: [
        { label: 'Recent Injury / Fall', value: 'Trauma or fall history' },
        { label: 'Heavy Weight Lifting', value: 'Mechanical strain from lifting' },
        { label: 'No trauma history', value: 'No history of physical trauma' },
      ],
    },
    {
      id: 'q_joint_fever_chills',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have accompanying fever, body weakness, or rash along with joint pain?',
        hi: 'क्या जोड़ों के दर्द के साथ बुखार, कमजोरी या शरीर पर दाने हैं?',
        kn: 'ಕೀಲು ನೋವಿನೊಂದಿಗೆ ಜ್ವರ, ದೇಹದ ದೌರ್ಬಲ್ಯ ಅಥವಾ ದದ್ದುಗಳಿವೆಯೇ?',
      },
      options: [
        { label: 'Fever & Fatigue', value: 'Fever accompanied by systemic fatigue' },
        { label: 'Skin Rash', value: 'Associated cutaneous rash' },
        { label: 'No fever', value: 'Denies systemic fever' },
      ],
    },
    {
      id: 'q_joint_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you taking painkiller tablets (Combiflam, Brufen), Calcium, or applying pain balms?',
        hi: 'क्या आप दर्द निवारक गोली (Combiflam), कैल्शियम या दर्द का बाम इस्तेमाल कर रहे हैं?',
        kn: 'ನೀವು ನೋವುನಿವಾರಕ ಮಾತ್ರೆಗಳು, ಕ್ಯಾಲ್ಸಿಯಂ ಅಥವಾ ಬಾಮ್ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Painkillers (NSAIDs)', value: 'Regular NSAID painkiller tablets' },
        { label: 'Calcium & Vitamin D', value: 'Calcium and Vitamin D supplements' },
        { label: 'Ayurvedic Balms / Oils', value: 'Topical analgesic oils and balms' },
        { label: 'No painkillers taken', value: 'No pain medications' },
      ],
    },
    {
      id: 'q_joint_pmh',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a history of Uric Acid Gout, Rheumatoid Arthritis, Sciatica, or Osteoporosis?',
        hi: 'क्या आपको यूरिक एसिड (Gout), घटिया (Rheumatoid), साइटिका या हड्डियों में कमजोरी है?',
        kn: 'ನಿಮಗೆ ಯುರಿಕ್ ಆಸಿಡ್, ಸಂಧಿವಾತ, ಸೈಟಿಕಾ ಅಥವಾ ಅಸ್ಥಿರಂಧ್ರತೆ ಇತಿಹಾಸವಿದೆಯೇ?',
      },
      options: [
        { label: 'Uric Acid / Gout', value: 'Hyperuricemia / Gouty arthritis' },
        { label: 'Rheumatoid Arthritis', value: 'Rheumatoid arthritis' },
        { label: 'Sciatica / Disc Herniation', value: 'Lumbar disc herniation / Sciatica' },
        { label: 'Osteoarthritis', value: 'Degenerative Osteoarthritis' },
        { label: 'No prior joint conditions', value: 'No known prior rheumatological illness' },
      ],
    },
    {
      id: 'q_joint_allergies',
      category: 'allergies',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do painkiller tablets cause stomach acidity, burning, or allergy for you?',
        hi: 'क्या दर्द निवारक गोलियों से आपको पेट में जलन, एसिडिटी या एलर्जी होती है?',
        kn: 'ನೋವುನಿವಾರಕ ಮಾತ್ರೆಗಳು ನಿಮಗೆ ಹೊಟ್ಟೆಯ ಉರಿ ಅಥವಾ ಅಲರ್ಜಿಯನ್ನು ಉಂಟುಮಾಡುತ್ತವೆಯೇ?',
      },
      options: [
        { label: 'Painkiller Gastric Acidity', value: 'NSAID-induced gastric acidity' },
        { label: 'Painkiller Rash Allergy', value: 'NSAID drug hypersensitivity' },
        { label: 'No painkiller allergy', value: 'Tolerates NSAID medications' },
      ],
    },
    {
      id: 'q_joint_lifestyle',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does your daily job involve long standing, heavy lifting, or sitting at a desk?',
        hi: 'क्या आपके काम में देर तक खड़े रहना, वजन उठाना या डेस्क पर बैठना शामिल है?',
        kn: 'ನಿಮ್ಮ ದಿನನಿತ್ಯದ ಕೆಲಸದಲ್ಲಿ ದೀರ್ಘಕಾಲ ನಿಲ್ಲುವುದು ಅಥವಾ ಭಾರ ಎತ್ತುವುದು ಇದೆಯೇ?',
      },
      options: [
        { label: 'Heavy Physical Lifting', value: 'Heavy occupational physical labor' },
        { label: 'Long Standing Hours', value: 'Prolonged standing position' },
        { label: 'Desk Job Sitting', value: 'Sedentary desk job' },
        { label: 'Moderate Activity', value: 'Moderate active lifestyle' },
      ],
    },
  ],

  resp: [
    {
      id: 'q_resp_cough_type',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Is your cough dry and tickling, or producing thick sputum/mucus?',
        hi: 'क्या आपकी खांसी सूखी है या बलगम वाली?',
        kn: 'ನಿಮ್ಮ ಕೆಮ್ಮು ಒಣ ಕೆಮ್ಮೇ ಅಥವಾ ಕಫದೊಂದಿಗೆ ಬರುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Dry Tickling Cough', value: 'Dry non-productive cough' },
        { label: 'Productive Cough with Mucus', value: 'Productive cough with sputum' },
        { label: 'Coughing Fits at Night', value: 'Nocturnal paroxysmal cough' },
      ],
    },
    {
      id: 'q_resp_sputum_color',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'If you have mucus, what color is it (white, yellow/green, or blood-streaked)?',
        hi: 'यदि बलगम है, तो उसका रंग कैसा है (सफेद, पीला/हरा या खून के धब्बे)?',
        kn: 'ಕಫ ಬರುತ್ತಿದ್ದರೆ, ಅದರ ಬಣ್ಣ ಯಾವುದು (ಬಿಳಿ, ಹಳದಿ/ಹಸಿರು, ಅಥವಾ ರಕ್ತದ ಕಲೆ)?',
      },
      options: [
        { label: 'Clear White Mucus', value: 'Clear mucoid sputum' },
        { label: 'Thick Yellow / Green Phlegm', value: 'Purulent yellow-green sputum' },
        { label: 'Blood Streaked Sputum', value: 'Hemoptysis (blood in sputum)' },
        { label: 'No sputum (Dry)', value: 'Dry cough without sputum' },
      ],
    },
    {
      id: 'q_resp_breathless_severity',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you feeling short of breath during light walking, climbing stairs, or resting?',
        hi: 'क्या चलने, सीढ़ी चढ़ने या आराम करते समय सांस फूलती है?',
        kn: 'ನಡೆಯುವಾಗ, ಮೆಟ್ಟಿಲು ಹತ್ತುವಾಗ ಅಥವಾ ವಿಶ್ರಾಂತಿ ಪಡೆಯುವಾಗ ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Breathlessness at Rest', value: 'Severe dyspnea at rest' },
        { label: 'Breathlessness on Walking', value: 'Exertional dyspnea on walking' },
        { label: 'Breathlessness when Lying Flat', value: 'Orthopnea when lying flat' },
        { label: 'Normal Breathing', value: 'Denies shortness of breath' },
      ],
    },
    {
      id: 'q_resp_wheezing',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you hear a whistling sound (wheezing) from your chest when breathing out?',
        hi: 'क्या सांस छोड़ते समय सीने से सीटी जैसी आवाज (Wheezing) आती है?',
        kn: 'ಉಸಿರು ಬಿಡುವಾಗ ಎದೆಯಿಂದ ಸಿಳ್ಳೆಯ ಶಬ್ದ (Wheezing) ಬರುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Audible Wheezing Sound', value: 'Bronchial wheezing present' },
        { label: 'Chest Tightness', value: 'Chest tightness without wheeze' },
        { label: 'No wheezing', value: 'No bronchial wheezing' },
      ],
    },
    {
      id: 'q_resp_timing',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Is the cough worse in the early morning, late night, or cold weather?',
        hi: 'क्या खांसी सुबह-सुबह, देर रात या ठंडे मौसम में ज्यादा बढ़ती है?',
        kn: 'ಕೆಮ್ಮು ಬೆಳಗಿನ ಜಾವ, ತಡರಾತ್ರಿ ಅಥವಾ ತಣ್ಣನೆಯ ವಾತಾವರಣದಲ್ಲಿ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Worse Late Night / Early Morning', value: 'Nocturnal / early morning exacerbation' },
        { label: 'Worse in Cold Air / Dust', value: 'Triggered by cold air and dust' },
        { label: 'Continuous Throughout Day', value: 'Continuous throughout day' },
      ],
    },
    {
      id: 'q_resp_fever_chestpain',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have accompanying fever, sharp chest pain while coughing, or night sweats?',
        hi: 'क्या खांसी के साथ बुखार, खांसते समय सीने में तेज चुभन या रात में पसीना आता है?',
        kn: 'ಕೆಮ್ಮಿನ ಜೊತೆಗೆ ಜ್ವರ, ಎದೆ ನೋವು ಅಥವಾ ರಾತ್ರಿ ಬೆವರು ಬರುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Fever & Night Sweats', value: 'Pyrexia and nocturnal diaphoresis' },
        { label: 'Pleuritic Chest Pain', value: 'Sharp pleuritic chest pain on coughing' },
        { label: 'No fever or chest pain', value: 'No fever or pleuritic pain' },
      ],
    },
    {
      id: 'q_resp_inhalers_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you using asthma inhalers (Puffers), cough syrups, or antibiotics?',
        hi: 'क्या आप इनहेलर (Puffer), खांसी का सिरप या एंटीबायोटिक ले रहे हैं?',
        kn: 'ನೀವು ಆಸ್ತಮಾ ಇನ್ಹೇಲರ್, ಕೆಮ್ಮಿನ ಸಿಲಪ್ ಅಥವಾ ಆಂಟಿಬಯೋಟಿಕ್ ಬಳಸುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Asthma Inhalers (Puffers)', value: 'Bronchodilator inhalers' },
        { label: 'Cough Syrups', value: 'Expectorant cough syrup' },
        { label: 'Antibiotics', value: 'Oral antibiotics' },
        { label: 'No respiratory medicines', value: 'No inhalers or respiratory drugs' },
      ],
    },
    {
      id: 'q_resp_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How long have you suffered from this cough or breathing issue (days vs months)?',
        hi: 'खांसी या सांस की यह तकलीफ कितने समय से है (कुछ दिन या महीनों से)?',
        kn: 'ಈ ಕೆಮ್ಮು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ ಎಷ್ಟು ಸಮಯದಿಂದ ಇದೆ (ದಿನಗಳು ಅಥವಾ ತಿಂಗಳುಗಳು)?',
      },
      options: [
        { label: '2-5 Days Acute Cough', value: 'Acute respiratory infection (2-5 days)' },
        { label: '2-3 Weeks Subacute', value: 'Subacute cough (2-3 weeks)' },
        { label: 'Chronic Months / Years', value: 'Chronic cough (>4 weeks)' },
      ],
    },
    {
      id: 'q_resp_pmh',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have a history of Asthma, Bronchitis, Pneumonia, or Tuberculosis (TB)?',
        hi: 'क्या आपको पहले कभी दमा (Asthma), निमोनिया या टीबी की बीमारी रही है?',
        kn: 'ನಿಮಗೆ ಆಸ್ತಮಾ, ನ್ಯುಮೋನಿಯಾ ಅಥವಾ ಕ್ಷಯರೋಗ (TB) ಇತಿಹಾಸವಿದೆಯೇ?',
      },
      options: [
        { label: 'Bronchial Asthma History', value: 'History of Bronchial Asthma' },
        { label: 'Past Pneumonia / Bronchitis', value: 'Past Pneumonia / Chronic Bronchitis' },
        { label: 'Tuberculosis (TB) History', value: 'Past Tuberculosis treatment history' },
        { label: 'No past lung diseases', value: 'No chronic pulmonary history' },
      ],
    },
    {
      id: 'q_resp_smoking_env',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you smoke cigarettes/bidi, or work near dust, factory smoke, or chemical fumes?',
        hi: 'क्या आप सिगरेट/बीड़ी पीते हैं, या धूल, धुएं व केमिकल वाली जगह पर काम करते हैं?',
        kn: 'ನೀವು ಸಿಗರೇಟ್ ಪಾನ ಮಾಡುತ್ತೀರಾ ಅಥವಾ ಧೂಳು, ಹೊಗೆ ಇರುವ ಜಾಗದಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತೀರಾ?',
      },
      options: [
        { label: 'Active Cigarette / Bidi Smoker', value: 'Active tobacco smoking history' },
        { label: 'Dust / Factory Smoke Exposure', value: 'Occupational dust / industrial smoke exposure' },
        { label: 'Non-Smoker', value: 'Non-smoker, clean environment' },
      ],
    },
    {
      id: 'q_resp_allergies',
      category: 'allergies',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you allergic to dust, cold weather, pollen, or any medicines?',
        hi: 'क्या आपको धूल, ठंडे मौसम, परागकण या किसी दवा से एलर्जी है?',
        kn: 'ನಿಮಗೆ ಧೂಳು, ತಣ್ಣನೆಯ ವಾತಾವರಣ ಅಥವಾ ಔಷಧಿಯ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Dust & Cold Air Allergy', value: 'Allergic rhinitis / dust allergy' },
        { label: 'Antibiotic Drug Allergy', value: 'Antibiotic allergy' },
        { label: 'No known allergies', value: 'No environmental or drug allergies' },
      ],
    },
    {
      id: 'q_resp_sleep',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Does coughing or breathlessness wake you up from sleep at night?',
        hi: 'क्या रात में खांसी या सांस फूलने से आपकी नींद खुल जाती है?',
        kn: 'ರಾತ್ರಿಯಲ್ಲಿ ಕೆಮ್ಮು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಯಿಂದ ನಿಮ್ಮ ನಿದ್ರೆ ಕೆಡುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Wakes up Nightly Coughing', value: 'Frequent nocturnal awakenings' },
        { label: 'Sleep Disturbed', value: 'Mild sleep disturbance' },
        { label: 'Normal Peaceful Sleep', value: 'Uninterrupted restful sleep' },
      ],
    },
  ],

  general: [
    {
      id: 'q_gen_duration',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How long have you been experiencing your symptoms (days, weeks, or months)?',
        hi: 'आपको यह लक्षण कितने समय से महसूस हो रहे हैं (दिन, हफ्ते या महीने)?',
        kn: 'ನಿಮಗೆ ಈ ರೋಗಲಕ್ಷಣಗಳು ಎಷ್ಟು ಸಮಯದಿಂದ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತಿವೆ?',
      },
      options: [
        { label: '1-3 Days Recent', value: 'Acute onset (1-3 days)' },
        { label: '1-2 Weeks', value: 'Subacute (1-2 weeks)' },
        { label: 'More than a Month', value: 'Chronic (>1 month)' },
      ],
    },
    {
      id: 'q_gen_severity',
      category: 'hpi',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How severe is your discomfort right now (mild, moderate, or severe)?',
        hi: 'इस समय आपकी तकलीफ कितनी तेज है (हल्का, मध्यम या बहुत तेज़)?',
        kn: 'ಈಗ ನಿಮ್ಮ ಅಸ್ವಸ್ಥತೆ ಎಷ್ಟು ತೀವ್ರವಾಗಿದೆ?',
      },
      options: [
        { label: 'Mild (1-3)', value: 'Mild discomfort' },
        { label: 'Moderate (4-6)', value: 'Moderate discomfort' },
        { label: 'Severe (7-9)', value: 'Severe discomfort' },
      ],
    },
    {
      id: 'q_gen_bp_sugar',
      category: 'pmh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have Diabetes (Sugar) or High Blood Pressure (BP)?',
        hi: 'क्या आपको डायबिटीज (Sugar) या हाई बीपी की बीमारी है?',
        kn: 'ನಿಮಗೆ ಸಕ್ಕರೆ ಕಾಯಿಲೆ ಅಥವಾ ರಕ್ತದೊತ್ತಡ (BP) ಇದೆಯೇ?',
      },
      options: [
        { label: 'High Blood Pressure', value: 'Hypertension' },
        { label: 'Diabetes / Sugar', value: 'Diabetes Mellitus' },
        { label: 'Both BP & Diabetes', value: 'Hypertension and Diabetes Mellitus' },
        { label: 'Neither', value: 'No BP or Diabetes history' },
      ],
    },
    {
      id: 'q_gen_meds',
      category: 'meds',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Are you taking daily prescription medicines or home remedies?',
        hi: 'क्या आप रोजाना कोई दवाएं या घरेलू नुस्खे लेते हैं?',
        kn: 'ನೀವು ದಿನನಿತ್ಯದ ಔಷಧಿಗಳನ್ನು ಅಥವಾ ಮನೆಮದ್ದುಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'BP / Diabetes Pills', value: 'Daily chronic prescription medications' },
        { label: 'Painkillers / Antacids', value: 'Over-the-counter painkillers or antacids' },
        { label: 'Ayurvedic Remedies', value: 'Ayurvedic herbal remedies' },
        { label: 'No daily medicines', value: 'No daily medications' },
      ],
    },
    {
      id: 'q_gen_allergies',
      category: 'allergies',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Do you have known allergies to any medicines, penicillin, or food?',
        hi: 'क्या आपको किसी दवा, पेनिसिलिन या भोजन से कोई एलर्जी है?',
        kn: 'ನಿಮಗೆ ಯಾವುದೇ ಔಷಧ, ಪ್ಯಾರಸಿಟಮಾಲ್ ಅಥವಾ ಆಹಾರದ ಅಲರ್ಜಿ ಇದೆಯೇ?',
      },
      options: [
        { label: 'Penicillin / Antibiotics', value: 'Penicillin allergy' },
        { label: 'Painkillers (NSAIDs)', value: 'NSAID drug allergy' },
        { label: 'No known allergies', value: 'No known allergies' },
      ],
    },
    {
      id: 'q_gen_surgeries',
      category: 'psh',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'Have you had any major surgeries or hospitalizations in the past?',
        hi: 'क्या आपकी पहले कोई बड़ी सर्जरी या अस्पताल में भर्ती होने की स्थिति रही है?',
        kn: 'ನೀವು ಈ ಹಿಂದೆ ಯಾವುದೇ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಅಥವಾ ಆಸ್ಪತ್ರೆಗೆ ದಾಖಲಾಗಿದ್ದೀರಾ?',
      },
      options: [
        { label: 'Abdominal Surgery', value: 'Past abdominal surgery' },
        { label: 'Heart Procedure / Stent', value: 'Past cardiac surgery/stent' },
        { label: 'Orthopedic / Bone Surgery', value: 'Past bone/joint surgery' },
        { label: 'No past surgeries', value: 'No past surgical procedures' },
      ],
    },
    {
      id: 'q_gen_ros_digestion',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'How is your daily sleep, bowel digestion, and appetite?',
        hi: 'आपकी नींद, पाचन और पेट साफ होने की स्थिति कैसी है?',
        kn: 'ನಿಮ್ಮ ನಿದ್ರೆ, ಜೀರ್ಣಕ್ರಿಯೆ ಮತ್ತು ಮಲವಿಸರ್ಜನೆ ಹೇಗಿದೆ?',
      },
      options: [
        { label: 'Good & Regular', value: 'Normal sleep and digestion' },
        { label: 'Poor Sleep / Insomnia', value: 'Disturbed sleep and insomnia' },
        { label: 'Constipation & Indigestion', value: 'Constipation and indigestion' },
      ],
    },
    {
      id: 'q_gen_ayush_temp',
      category: 'ayush',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'AYUSH Assessment: Do you experience excessive body heat, dryness, or coldness?',
        hi: 'आयुष मूल्यांकन: क्या आपको शरीर में अत्यधिक गर्मी, सूखापन या ठंडक महसूस होती है?',
        kn: 'ಆಯುಷ್ ಮೌಲ್ಯಮಾಪನ: ನಿಮಗೆ ಅತಿಯಾದ ದೇಹದ ಶಾಖ, ಒಣಗುವಿಕೆ ಅಥವಾ ಶೀತ ಅನಿಸುತ್ತದೆಯೇ?',
      },
      options: [
        { label: 'Excessive Heat (Pitta)', value: 'Pitta / Heat dominance' },
        { label: 'Dryness & Joint Pain (Vata)', value: 'Vata / Dryness dominance' },
        { label: 'Coldness & Mucus (Kapha)', value: 'Kapha / Cold dominance' },
        { label: 'Normal Balance', value: 'Balanced Sama Prakriti' },
      ],
    },
    {
      id: 'q_gen_lifestyle',
      category: 'ros',
      allowVoice: true,
      allowTouch: true,
      questionText: {
        en: 'What is your daily work routine, physical activity, and stress level?',
        hi: 'आपकी दिनचर्या, शारीरिक व्यायाम और तनाव का स्तर कैसा है?',
        kn: 'ನಿಮ್ಮ ದಿನನಿತ್ಯದ ಕೆಲಸ, ವ್ಯಾಯಾಮ ಮತ್ತು ಒತ್ತಡದ ಮಟ್ಟ ಹೇಗಿದೆ?',
      },
      options: [
        { label: 'High Daily Stress', value: 'High daily occupational stress' },
        { label: 'Sedentary Desk Work', value: 'Sedentary desk lifestyle' },
        { label: 'Active Healthy Routine', value: 'Active healthy daily routine' },
      ],
    },
  ],
};

export const QUESTION_BANK: ClinicalQuestion[] = [
  INITIAL_COMPLAINT_QUESTION,
  ...Object.values(ADAPTIVE_QUESTION_SETS).flat(),
];

/**
  Confidence Scoring Constants & Utilities
 */
export const CONFIDENCE_THRESHOLD = 0.6;
export const MAX_FIELD_CLARIFICATION_RETRIES = 2;
export const MAX_CONSECUTIVE_LOW_CONFIDENCE_TURNS = 3;

export function evaluateAnswerConfidence(
  answerText: string,
  inputMethod: string,
  questionId: string
): number {
  if (inputMethod === 'touch') {
    return 0.95;
  }

  const text = (answerText || '').trim().toLowerCase();
  if (text.length < 3) return 0.3;

  const vagueKeywords = [
    'uh', 'um', 'no', 'idk', "don't know", 'not sure', "don't remember",
    'whatever', 'maybe', 'what', 'huh', 'something', 'blabla', 'dunno',
    'hard to say', "can't say", 'unclear', 'random', 'mumble', 'nothing'
  ];

  if (vagueKeywords.some(v => text === v || text.startsWith(v + ' ') || text.endsWith(' ' + v))) {
    return 0.35;
  }

  return 0.9;
}

export function getClarificationQuestion(
  targetQuestion: ClinicalQuestion,
  language: Language
): ClinicalQuestion {
  return {
    id: `clarify_${targetQuestion.id}`,
    category: targetQuestion.category,
    allowVoice: true,
    allowTouch: true,
    questionText: {
      en: `Could you please clarify your answer regarding "${targetQuestion.questionText.en}" so your doctor gets accurate details?`,
      hi: `कृपया अपने उत्तर को कुछ और शब्दों में स्पष्ट करें ताकि डॉक्टर के लिए सही जानकारी रिकॉर्ड हो सके।`,
      kn: `ವೈದ್ಯರಿಗೆ ನಿಖರವಾದ ವಿವರಗಳನ್ನು ಪಡೆಯಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇನ್ನಷ್ಟು ಸ್ಪಷ್ಟಪಡಿಸಿ.`,
    },
    options: targetQuestion.options,
  };
}

export function getMissingClinicalFields(answeredIds: string[]): string[] {
  const missing: string[] = [];
  if (!answeredIds.some(id => id.includes('complaint'))) missing.push('chief_complaint');
  if (!answeredIds.some(id => id.includes('char') || id.includes('site') || id.includes('pattern') || id.includes('hpi'))) missing.push('symptom_characteristics');
  if (!answeredIds.some(id => id.includes('pmh') || id.includes('history'))) missing.push('past_medical_history');
  return missing;
}

/**
 * Dynamic Adaptive Clinical Engine — 10 to 14 Comprehensive Questions
 * Asks a full, structured clinical sequence customized 100% to the patient's specific disease.
 */
export function getNextClinicalQuestion(
  answeredIds: string[],
  complaint: string,
  ayushMode: boolean,
  firstAnswerText?: string
): { question: ClinicalQuestion | null; isComplete: boolean; currentCount: number } {
  const currentCount = answeredIds.length;

  // Step 1: Start with Chief Complaint Question if not answered
  if (currentCount === 0 || !answeredIds.includes('q_chief_complaint')) {
    return { question: INITIAL_COMPLAINT_QUESTION, isComplete: false, currentCount: 1 };
  }

  // Determine disease category based on complaint or first answer text
  const fullText = `${complaint} ${firstAnswerText || ''}`.toLowerCase();

  let categoryKey = 'general';

  if (
    fullText.includes('skin') ||
    fullText.includes('rash') ||
    fullText.includes('allergy') ||
    fullText.includes('allergies') ||
    fullText.includes('itch') ||
    fullText.includes('hives') ||
    fullText.includes('urticaria') ||
    fullText.includes('bump')
  ) {
    categoryKey = 'skin';
  } else if (
    fullText.includes('headache') ||
    fullText.includes('dizziness') ||
    fullText.includes('giddiness') ||
    fullText.includes('vertigo') ||
    fullText.includes('migraine') ||
    fullText.includes('head pain')
  ) {
    categoryKey = 'neuro';
  } else if (
    fullText.includes('diabetes') ||
    fullText.includes('bp') ||
    fullText.includes('sugar') ||
    fullText.includes('checkup') ||
    fullText.includes('hypertension') ||
    fullText.includes('metabolic')
  ) {
    categoryKey = 'metabolic';
  } else if (
    fullText.includes('chest') ||
    fullText.includes('heart') ||
    fullText.includes('pressure') ||
    fullText.includes('cardiac') ||
    fullText.includes('retrosternal')
  ) {
    categoryKey = 'cardiac';
  } else if (
    fullText.includes('fever') ||
    fullText.includes('chill') ||
    fullText.includes('infection') ||
    fullText.includes('temperature') ||
    fullText.includes('rigor')
  ) {
    categoryKey = 'fever';
  } else if (
    fullText.includes('stomach') ||
    fullText.includes('acid') ||
    fullText.includes('vomit') ||
    fullText.includes('diarrhea') ||
    fullText.includes('belly') ||
    fullText.includes('gastric') ||
    fullText.includes('nausea')
  ) {
    categoryKey = 'gi';
  } else if (
    fullText.includes('joint') ||
    fullText.includes('knee') ||
    fullText.includes('back') ||
    fullText.includes('spine') ||
    fullText.includes('shoulder') ||
    fullText.includes('bone') ||
    fullText.includes('arthritis')
  ) {
    categoryKey = 'joint';
  } else if (
    fullText.includes('cough') ||
    fullText.includes('breath') ||
    fullText.includes('asthma') ||
    fullText.includes('sputum') ||
    fullText.includes('phlegm') ||
    fullText.includes('wheez')
  ) {
    categoryKey = 'resp';
  }

  const targetSet = ADAPTIVE_QUESTION_SETS[categoryKey] || ADAPTIVE_QUESTION_SETS.general;

  // Clean answered IDs (ignore clarification prefix)
  const cleanAnswered = answeredIds.map(id => id.replace(/^clarify_/, ''));
  const remaining = targetSet.filter(q => !cleanAnswered.includes(q.id));

  // Required count: 10 to 14 questions for detailed diagnosis
  const targetRequiredCount = Math.min(12, targetSet.length + 1);

  if (currentCount >= targetRequiredCount || remaining.length === 0) {
    return { question: null, isComplete: true, currentCount };
  }

  return {
    question: remaining[0],
    isComplete: false,
    currentCount: currentCount + 1,
  };
}
