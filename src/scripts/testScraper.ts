import { getCaffeineTotal } from "@/lib/scraper";

async function testScraper() {
  const caffeineTotal = await getCaffeineTotal();
  console.log("✅ Scraped Caffeine Total:", caffeineTotal);
}

testScraper();
