export interface DosageBadge {
  label: string;
  type: "dosage" | "form" | "route";
}

export interface DocumentInfo {
  name: string;
  size: string;
  url: string;
}

export interface DetailedMedicine {
  id: string;
  name: string;
  company: string;
  submittedOn: string;
  badges: DosageBadge[];
  batch: string;
  expiry: string;
  composition: string;
  description: string;
  documents: DocumentInfo[];
  image: string;
  status: "pending" | "approved" | "rejected";
}

export const initialMedicines: DetailedMedicine[] = [
  {
    id: "med-1",
    name: "Paracetamol",
    company: "Dr. Reddy's",
    submittedOn: "20th May 2026",
    badges: [
      { label: "650mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-PAR650-01",
    expiry: "12/2028",
    composition: "Each uncoated tablet contains: Paracetamol IP 650 mg, Excipients q.s.",
    description: "Paracetamol 650mg is a widely used analgesic (pain reliever) and antipyretic (fever reducer). It is indicated for the treatment of mild-to-moderate pain including headache, migraine, muscle ache, toothache, and musculoskeletal pain, and for reducing fever.",
    documents: [
      { name: "Chemical_Analysis_Report.pdf", size: "2.4 MB", url: "#" },
      { name: "Clinical_Trial_Summary_Phase3.pdf", size: "4.1 MB", url: "#" },
      { name: "FDA_Compliance_Certificate.pdf", size: "1.2 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-2",
    name: "Crocin",
    company: "Sun Pharma",
    submittedOn: "20th May 2026",
    badges: [
      { label: "200mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-CRO200-84",
    expiry: "10/2028",
    composition: "Each tablet contains: Paracetamol IP 200 mg, Excipients q.s.",
    description: "Crocin 200mg is a mild analgesic formulated specifically for fast relief from headaches, body aches, and fever. Ideal for adults needing a lower dose or young adults under prescription guidance.",
    documents: [
      { name: "Quality_Assurance_Audit.pdf", size: "1.8 MB", url: "#" },
      { name: "Product_Stability_Data.pdf", size: "3.2 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-3",
    name: "Dolo",
    company: "Cipla Ltd.",
    submittedOn: "19th May 2026",
    badges: [
      { label: "650mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-DOL650-12",
    expiry: "05/2029",
    composition: "Each tablet contains: Paracetamol IP 650 mg. Colour: Sunset Yellow FCF.",
    description: "Dolo 650mg is a fast-acting antipyretic and analgesic. It helps relieve pain and lower high body temperatures quickly. It functions by inhibiting chemical messengers in the brain that transmit pain signals and regulate body temperature.",
    documents: [
      { name: "Certificate_of_Analysis.pdf", size: "2.1 MB", url: "#" },
      { name: "Cipla_Lab_Declaration.pdf", size: "850 KB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-4",
    name: "Aspirin",
    company: "Lupin Ltd.",
    submittedOn: "19th May 2026",
    badges: [
      { label: "250mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-ASP250-09",
    expiry: "11/2028",
    composition: "Each gastro-resistant tablet contains: Acetylsalicylic Acid IP 250 mg.",
    description: "Aspirin 250mg (acetylsalicylic acid) acts as an analgesic, antipyretic, and anti-inflammatory agent. It also prevents blood platelet aggregation and is commonly prescribed at low doses for cardiovascular protection under physician guidance.",
    documents: [
      { name: "Lupin_Bioequivalence_Report.pdf", size: "3.5 MB", url: "#" },
      { name: "Heavy_Metal_Safety_Clearance.pdf", size: "1.1 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-5",
    name: "Calpol",
    company: "Dr. Reddy's",
    submittedOn: "18th May 2026",
    badges: [
      { label: "350mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-CAL350-22",
    expiry: "07/2028",
    composition: "Each tablet contains: Paracetamol IP 350 mg, Excipients q.s.",
    description: "Calpol 350mg tablets provide fast relief from pain and fever. Formulated for high bioavailability and absorption rates, ensuring relief begins shortly after administration.",
    documents: [
      { name: "In_Vitro_Dissolution_Profile.pdf", size: "1.9 MB", url: "#" },
      { name: "DrReddys_GMP_Certificate.pdf", size: "2.8 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-6",
    name: "Ibuprofen",
    company: "Cipla Ltd.",
    submittedOn: "18th May 2026",
    badges: [
      { label: "400mg", type: "dosage" },
      { label: "Capsule", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-IBU400-31",
    expiry: "09/2028",
    composition: "Each soft gelatin capsule contains: Ibuprofen IP 400 mg.",
    description: "Ibuprofen 400mg is a non-steroidal anti-inflammatory drug (NSAID). It works by reducing hormones that cause pain and inflammation in the body. Soft gel capsules provide rapid absorption and relief.",
    documents: [
      { name: "Softgel_Stability_Analysis.pdf", size: "2.6 MB", url: "#" },
      { name: "Clinical_Trial_Summary_NSAID.pdf", size: "4.5 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-7",
    name: "Amoxicillin",
    company: "Sun Pharma",
    submittedOn: "17th May 2026",
    badges: [
      { label: "500mg", type: "dosage" },
      { label: "Capsule", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-AMX500-15",
    expiry: "04/2028",
    composition: "Each capsule contains: Amoxicillin Trihydrate IP equivalent to anhydrous Amoxicillin 500 mg.",
    description: "Amoxicillin 500mg is a moderate-spectrum, bactericidal, beta-lactam antibiotic used to treat bacterial infections caused by susceptible microorganisms, including ear, nose, throat, urinary tract, and skin infections.",
    documents: [
      { name: "Microbiological_Assay_Report.pdf", size: "3.1 MB", url: "#" },
      { name: "Sterility_Test_Certificate.pdf", size: "1.4 MB", url: "#" },
      { name: "Antibiotic_Potency_Chart.pdf", size: "980 KB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-8",
    name: "Cetirizine",
    company: "Lupin Ltd.",
    submittedOn: "17th May 2026",
    badges: [
      { label: "10mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-CET010-06",
    expiry: "02/2029",
    composition: "Each film-coated tablet contains: Cetirizine Dihydrochloride IP 10 mg.",
    description: "Cetirizine 10mg is a second-generation antihistamine used in the treatment of hay fever, allergies, angioedema, and urticaria. It blocks histamine receptors, reducing allergic symptoms without significant sedative effects.",
    documents: [
      { name: "Antihistamine_Bioequivalence.pdf", size: "2.0 MB", url: "#" },
      { name: "Lupin_Allergen_Safety_Check.pdf", size: "1.7 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-9",
    name: "Metformin",
    company: "Dr. Reddy's",
    submittedOn: "16th May 2026",
    badges: [
      { label: "1000mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-MET1000-02",
    expiry: "06/2029",
    composition: "Each prolonged-release tablet contains: Metformin Hydrochloride IP 1000 mg.",
    description: "Metformin Hydrochloride 1000mg is an oral antihyperglycemic agent of the biguanide class. It is the first-line medication for the treatment of type 2 diabetes, particularly in people who are overweight, helping to control blood sugar levels.",
    documents: [
      { name: "Endocrine_Safety_Review.pdf", size: "3.8 MB", url: "#" },
      { name: "Sustained_Release_Profile.pdf", size: "2.3 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-10",
    name: "Atorvastatin",
    company: "Sun Pharma",
    submittedOn: "15th May 2026",
    badges: [
      { label: "20mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-ATO020-55",
    expiry: "03/2028",
    composition: "Each film-coated tablet contains: Atorvastatin Calcium Trihydrate IP equivalent to Atorvastatin 20 mg.",
    description: "Atorvastatin 20mg is a statin medication used to prevent cardiovascular disease in those at high risk and lower abnormal lipid levels. It acts as an HMG-CoA reductase inhibitor, reducing cholesterol synthesis in the liver.",
    documents: [
      { name: "Cardio_Clinical_Evaluation.pdf", size: "4.2 MB", url: "#" },
      { name: "Lipid_Control_Study_Data.pdf", size: "2.9 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-11",
    name: "Omeprazole",
    company: "Cipla Ltd.",
    submittedOn: "15th May 2026",
    badges: [
      { label: "20mg", type: "dosage" },
      { label: "Capsule", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-OME020-19",
    expiry: "01/2028",
    composition: "Each enteric-coated capsule contains: Omeprazole IP 20 mg (as enteric coated granules).",
    description: "Omeprazole 20mg is a proton pump inhibitor (PPI) that decreases the amount of acid produced in the stomach. It is used to treat gastroesophageal reflux disease (GERD), peptic ulcer disease, and Zollinger-Ellison syndrome.",
    documents: [
      { name: "Gastric_Acid_Inhibition_Data.pdf", size: "2.2 MB", url: "#" },
      { name: "Enteric_Coating_Dissolution.pdf", size: "1.9 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-12",
    name: "Azithromycin",
    company: "Lupin Ltd.",
    submittedOn: "14th May 2026",
    badges: [
      { label: "250mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-AZI250-77",
    expiry: "10/2028",
    composition: "Each film-coated tablet contains: Azithromycin Dihydrate IP equivalent to anhydrous Azithromycin 250 mg.",
    description: "Azithromycin 250mg is a macrolide antibiotic used for the treatment of a number of bacterial infections. This includes middle ear infections, strep throat, pneumonia, traveler's diarrhea, and certain other intestinal infections.",
    documents: [
      { name: "Macrolide_Sensitivity_Report.pdf", size: "2.7 MB", url: "#" },
      { name: "Lupin_Stability_Declaration.pdf", size: "1.3 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-13",
    name: "Losartan",
    company: "Dr. Reddy's",
    submittedOn: "13th May 2026",
    badges: [
      { label: "50mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-LOS050-04",
    expiry: "08/2029",
    composition: "Each film-coated tablet contains: Losartan Potassium IP 50 mg.",
    description: "Losartan Potassium 50mg is an angiotensin II receptor antagonist used to treat high blood pressure (hypertension). It works by relaxing blood vessels, which lowers blood pressure and increases supply of blood and oxygen to the heart.",
    documents: [
      { name: "Hypertension_Clinical_Trial.pdf", size: "3.9 MB", url: "#" },
      { name: "DrReddys_Renal_Safety_Specs.pdf", size: "2.1 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-14",
    name: "Amlodipine",
    company: "Sun Pharma",
    submittedOn: "12th May 2026",
    badges: [
      { label: "5mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-AML005-18",
    expiry: "04/2029",
    composition: "Each tablet contains: Amlodipine Besylate IP equivalent to Amlodipine 5 mg.",
    description: "Amlodipine 5mg is a calcium channel blocker medication used to treat high blood pressure and coronary artery disease. It relaxes blood vessels and improves blood flow, effectively treating angina (chest pain).",
    documents: [
      { name: "Vascular_Compliance_Study.pdf", size: "2.5 MB", url: "#" },
      { name: "Bioavailability_Report_Amlodipine.pdf", size: "1.6 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
  {
    id: "med-15",
    name: "Pantoprazole",
    company: "Cipla Ltd.",
    submittedOn: "12th May 2026",
    badges: [
      { label: "40mg", type: "dosage" },
      { label: "Tablet", type: "form" },
      { label: "Oral", type: "route" },
    ],
    batch: "B-PAN040-08",
    expiry: "11/2028",
    composition: "Each gastro-resistant tablet contains: Pantoprazole Sodium Sesquihydrate IP equivalent to Pantoprazole 40 mg.",
    description: "Pantoprazole 40mg is a proton pump inhibitor that suppresses gastric acid secretion by H+/K+-ATPase inhibition. It is widely used to treat erosive esophagitis, gastroesophageal reflux disease, and pathological hypersecretory conditions.",
    documents: [
      { name: "Pantoprazole_Acid_Control.pdf", size: "3.0 MB", url: "#" },
      { name: "Cipla_Gastro_Audit_Report.pdf", size: "1.5 MB", url: "#" },
    ],
    image: "/medicine-placeholder.png",
    status: "pending",
  },
];
