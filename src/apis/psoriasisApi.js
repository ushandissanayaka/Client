import axios from "axios";

const PSORIASIS_API_URL = "http://localhost:5002/predict";

/**
 * Sends a skin image to the XORA Module 2 Psoriasis Detection service
 * and returns the normalized prediction result.
 * @param {File} imageFile
 * @returns {Promise<{
 *   label: string,
 *   confidence: number,
 *   coverage_percent: number,
 *   skin_tone_group: string,
 *   mask_overlay_base64: string,
 *   original_image_base64: string
 * }>}
 */
export async function analyzePsoriasis(imageFile) {
  if (!imageFile) {
    throw new Error("No image file provided for analysis.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(PSORIASIS_API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    });

    const data = response.data || {};

    return {
      label: data.label,
      confidence: data.confidence,
      coverage_percent: data.coverage_percent,
      skin_tone_group: data.skin_tone_group,
      mask_overlay_base64: data.mask_overlay_base64,
      original_image_base64: data.original_image_base64,
    };
  } catch (error) {
    if (error.response) {
      const serverMessage =
        error.response.data?.error || error.response.data?.message;
      throw new Error(
        serverMessage ||
          `Analysis failed (server responded with status ${error.response.status}).`
      );
    }

    if (error.request) {
      throw new Error(
        "Unable to reach the XORA Psoriasis analysis server. Please confirm it is running on http://localhost:5002."
      );
    }

    throw new Error(error.message || "An unexpected error occurred during analysis.");
  }
}
