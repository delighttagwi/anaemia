import Layout from "@/components/Layout";

const sections = [
  {
    title: "Background Study",
    content: `Anemia is a condition characterized by a deficiency of red blood cells or hemoglobin in the blood, resulting in pallor and fatigue. It affects approximately 1.62 billion people globally, with the highest prevalence in developing countries. Traditional diagnosis relies on Complete Blood Count (CBC) tests, which require venous blood samples, laboratory equipment, and trained personnel — resources often unavailable in remote and resource-limited settings. This project explores non-invasive alternatives using image processing and optical sensing technologies to estimate hemoglobin levels from physical features such as nail bed pallor, conjunctival color, and fingerprint vascularity.`,
  },
  {
    title: "Methodology",
    content: `The system employs a multi-modal approach combining image analysis and optical sensor data:\n\n1. Image Acquisition: Users capture images of nail beds, eye conjunctiva, or fingerprints using a smartphone camera.\n\n2. Preprocessing: Images undergo contrast enhancement, noise removal, and color space conversion (RGB to HSV/LAB) to normalize lighting conditions.\n\n3. Feature Extraction: Key features including mean color intensity, texture patterns (GLCM), and vessel visibility indices are computed.\n\n4. Hb Estimation: A regression model maps extracted features to estimated hemoglobin concentration (g/dL).\n\n5. Hardware Augmentation: The MAX30102 optical sensor connected via ESP32 microcontroller provides supplementary SpO2 and pulse rate data for cross-validation.\n\n6. Classification: Results are categorized into Normal (≥12 g/dL), Mild (10–11.9 g/dL), Moderate (7–9.9 g/dL), and Severe (<7 g/dL) anemia.`,
  },
  {
    title: "Objectives",
    content: `• Develop a non-invasive, affordable anemia screening tool accessible via smartphone.\n• Implement multi-modal image analysis for robust hemoglobin estimation.\n• Integrate MAX30102 optical sensor for enhanced physiological measurements.\n• Provide real-time health recommendations based on detected anemia severity.\n• Create a user-friendly web interface for both patients and healthcare providers.\n• Validate system accuracy against standard laboratory CBC test results.`,
  },
  {
    title: "Conclusion",
    content: `The Smart Non-Invasive Anemia Detection System demonstrates the feasibility of using image processing and optical sensing for point-of-care anemia screening. By leveraging smartphone cameras and low-cost sensors, the system can significantly reduce the barriers to early anemia detection, particularly in underserved communities. While the current implementation uses simulated AI models, the framework is designed to accommodate trained machine learning models for clinical-grade accuracy. Future work will focus on collecting clinical datasets, training deep learning models (CNN-based regression), and conducting field validation studies.`,
  },
];

export default function DocumentationPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">Project Documentation</h1>
        <p className="mb-10 text-muted-foreground">Comprehensive overview of the Smart Non-Invasive Anemia Detection System.</p>

        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.title} className="rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 className="mb-4 font-heading text-xl font-bold text-primary">{s.title}</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{s.content}</div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
