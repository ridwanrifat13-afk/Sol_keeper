import type { DialLevel, Language } from "./types.js";

export interface HazardPresentation {
  readonly headline: string;
  readonly description: string;
}

/**
 * Calm, non-graphic hazard descriptions for historical crises and incidents.
 * At Cadet depth (ages 7–12), text stays calm, educational, and focused on systems and recovery
 * rather than injury or panic.
 */
export function formatCrisisHazard(
  crisisId: string,
  level: DialLevel,
  language: Language = "en",
): HazardPresentation {
  const isCadet = level === "cadet";

  switch (crisisId) {
    case "crisis-apollo13-co2":
      if (language === "bn") {
        return {
          headline: isCadet
            ? "অ্যাপোলো ১৩: বাতাস পরিশোধনের চ্যালেঞ্জ"
            : "অ্যাপোলো ১৩: কার্বন ডাই-অক্সাইড বৃদ্ধি",
          description: isCadet
            ? "বাতাস ফিল্টারের আকার মিলছিল না। মহাকাশচারীরা সাধারণ টেপ ও কার্ডবোর্ড দিয়ে নতুন অ্যাডাপ্টার তৈরি করেন।"
            : "লুনার মডিউলে ৩ জন ক্রু ছিলেন। বর্গাকার লিথিয়াম হাইড্রোক্সাইড ক্যানিস্টার ব্যবহারের জন্য অ্যাডাপ্টার তৈরি করতে হয়েছিল।",
        };
      }
      return {
        headline: isCadet
          ? "Apollo 13: Cleaning the Air"
          : "Apollo 13: Rising Carbon Dioxide",
        description: isCadet
          ? "The air filters did not fit. The crew used plastic bags and tape to build an adapter and keep the air safe."
          : "Aquarius was sized for two crew for 45 hours. Three crew aboard pushed CO2 to about 15 mmHg before the mailbox adapter was built.",
      };

    case "crisis-mir-fire":
      if (language === "bn") {
        return {
          headline: isCadet
            ? "মির স্টেশন: অক্সিজেন ক্যান্ডেল শিখা"
            : "মির স্টেশন: মোমবাতি অগ্নিকাণ্ড ও ধোঁয়া",
          description: isCadet
            ? "একটি অক্সিজেন মোমবাতি থেকে শিখা বের হয়। ক্রুরা শান্ত থেকে অগ্নিনির্বাপক যন্ত্র দিয়ে প্রায় ১৪ মিনিটে পরিস্থিতি নিয়ন্ত্রণে আনেন।"
            : "টিজিকে অক্সিজেন ক্যানিস্টারে আগুনের শিখা দেখা যায়। ৬ জন ক্রু জরুরি রেস্পিরেটর পরে ৩টি অগ্নি নির্বাপক ব্যবহার করেন।",
        };
      }
      return {
        headline: isCadet
          ? "Mir Station: Oxygen Candle Flame"
          : "Mir Station: Oxygen Generator Fire",
        description: isCadet
          ? "A solid oxygen candle flared up. The crew stayed calm, put on respirators, and extinguished the flame in about 14 minutes."
          : "A solid-fuel oxygen generator caught fire on Mir 23. Six crew donned emergency respirators and discharged 3 foam extinguishers.",
      };

    case "crisis-spe-1972":
      if (language === "bn") {
        return {
          headline: isCadet
            ? "১৯৭২ সৌর ঝড়: তীব্র বিকিরণ"
            : "১৯৭২ সালের আগস্ট সৌর কণা ঝড়",
          description: isCadet
            ? "সূর্য থেকে একটি বিশাল কণার ঝড় আসে। ঘন দেয়ালের আড়ালে থাকায় তেজস্ক্রিয়তা নিরাপদ মাত্রায় নেমে আসে।"
            : "অ্যাপোলো ১৬ ও ১৭ এর মধ্যবর্তী এই ঝড়ে পাতলা স্যুটে ১ Gy-এর বেশি ডোজ পৌঁছাত; পুরু ঢাল তা ব্যাপকভাবে কমিয়ে দেয়।",
        };
      }
      return {
        headline: isCadet
          ? "1972 Solar Storm: Space Rays"
          : "August 1972 Solar Particle Event",
        description: isCadet
          ? "A giant solar storm erupted between moon landings. Inside thick rock shielding, the crew stays safe from the invisible rays."
          : "The August 1972 storm could have delivered over 1 Gy-Eq to blood-forming organs in a thin suit; thick regolith cuts it far below.",
      };

    default:
      return {
        headline: isCadet ? "Emergency Event" : "Incident Alert",
        description: isCadet
          ? "A system requires attention. Check your gauges and pick a response on the Decision Card."
          : "A hazard has triggered. Manage consumable margins and assign crew to contain degradation.",
      };
  }
}

