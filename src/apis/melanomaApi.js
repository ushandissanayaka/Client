import axios from "axios";

// Override this in .env for a deployed or separately hosted API.
export const MELANOMA_API_URL =
  process.env.REACT_APP_MELANOMA_API_URL || "http://localhost:5003";

export function backendUrl(path) {
  if (!path) return "#";
  return path.startsWith("http") ? path : `${MELANOMA_API_URL}${path}`;
}

export async function analyzeMelanoma(imageFile) {
  if (!imageFile) throw new Error("Please select an image before starting analysis.");

  const formData = new FormData();
  // FastAPI's analyze_image function expects this exact field name.
  formData.append("file", imageFile);

  try {
    const response = await axios.post(`${MELANOMA_API_URL}/api/analyze`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
    if (!response.data?.success) throw new Error("The analysis service did not return a result.");
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.detail || `Analysis failed (server status ${error.response.status}).`);
    }
    if (error.request) {
      throw new Error("Unable to reach the Melanoma analysis server. Confirm it is running on http://localhost:5003.");
    }
    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
}

export async function getMelanomaEvaluation() {
  try {
    const response = await axios.get(`${MELANOMA_API_URL}/api/evaluation`, { timeout: 30000 });
    if (!response.data?.success) throw new Error("The evaluation service did not return data.");
    // Newer API versions return every graph in `evaluation_plots`; keep the
    // original single-chart response working while the backend is updated.
    const plots = Array.isArray(response.data.evaluation_plots)
      ? response.data.evaluation_plots
      : response.data.evaluation_chart_url
      ? [{ name: "Evaluation results", url: response.data.evaluation_chart_url }]
      : [];

    return { ...response.data, evaluation_plots: plots };
  } catch (error) {
    if (error.response) throw new Error(error.response.data?.detail || `Unable to load evaluation data (status ${error.response.status}).`);
    if (error.request) throw new Error("Unable to reach the Melanoma evaluation server. Confirm it is running on http://localhost:5003.");
    throw new Error(error.message || "Unable to load model evaluation.");
  }
}
