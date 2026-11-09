export const projects = [
  {
    slug: "lead-scoring",
    title: "Lead Scoring with Machine Learning",
    summary:
      "A machine learning project that explores how historical B2B lead data can be used to score and prioritize sales leads.",
    technologies: ["Python", "SQL", "Machine Learning"],
    overview: [
      "Lead Scoring with Machine Learning applies supervised machine learning to a familiar B2B sales problem: deciding which leads deserve a sales team's attention first.",
      "The project uses historical lead attributes to train a classification model that estimates how likely a lead is to convert, and turns those predictions into a simple priority score that sales representatives can act on.",
    ],
    highlights: [
      "Framing a real B2B sales question as a machine learning problem",
      "Preparing and evaluating lead data with Python and SQL",
      "Training and comparing classification models",
      "Translating model output into a clear, actionable priority view",
    ],
  },
  {
    slug: "ascend-dashboard",
    title: "Ascend NorCal Sponsor Dashboard",
    summary:
      "An interactive dashboard that brings Ascend NorCal's sponsor information together in one clear, easy-to-review view.",
    technologies: ["Power BI", "DAX", "Data Visualization"],
    overview: [
      "The Ascend NorCal Sponsor Dashboard is a data visualization project that consolidates sponsor-related information for Ascend NorCal into a single interactive view.",
      "The dashboard is designed to make sponsor engagement easy to review at a glance, supporting clearer communication and more informed conversations about sponsor relationships.",
    ],
    highlights: [
      "Consolidating sponsor information into a single, organized view",
      "Designing clear visualizations for non-technical audiences",
      "Supporting at-a-glance reviews of sponsor engagement",
    ],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
