import * as cheerio from "cheerio";

// ✅ Replace with Matthew’s actual site URL
const CAFFEINE_TRACKER_URL = "https://www.mwksl.coffee/";

export async function getCaffeineTotal(): Promise<number | null> {
  try {
    // Fetch the webpage using fetch
    const response = await fetch(CAFFEINE_TRACKER_URL);
    if (!response.ok) {
      console.error("❌ Failed to fetch caffeine tracker page:", response.statusText);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // ✅ Extract text from <h1>
    const caffeineText = $("h1").text().trim();
    console.log("🔎 Extracted text from <h1>:", caffeineText); // Debug log

    // ✅ Find a number in the extracted text
    const match = caffeineText.match(/(\d+)/);
    if (match) {
      console.log("✅ Extracted caffeine total:", match[0]); // Debugging log
      return parseInt(match[0], 10);
    }

    console.error("❌ Could not extract caffeine total from <h1>.");
    return null;
  } catch (error) {
    console.error("❌ Error scraping caffeine total:", error);
    return null;
  }
}
