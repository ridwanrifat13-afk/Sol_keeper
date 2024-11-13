import { useState, type ReactNode } from "react";
import { useAppLanguage } from "../i18n/useAppLanguage.js";
import "./Term.css";

export const GLOSSARY: Record<string, { en: string; bn: string }> = {
  oxygen: {
    en: "The gas in air your body needs to breathe.",
    bn: "বাতাসের যে গ্যাস আমাদের শ্বাস নিতে প্রয়োজন।",
  },
  "carbon dioxide": {
    en: "The gas people breathe out; too much makes you dizzy or sick.",
    bn: "নিঃশ্বাসের সাথে বের হওয়া গ্যাস; বেশি জমলে শরীর অসুস্থ হতে পারে।",
  },
  radiation: {
    en: "Invisible rays in space that can harm human bodies.",
    bn: "মহাকাশের অদৃশ্য রশ্মি যা মানুষের স্বাস্থ্যের ক্ষতি করতে পারে।",
  },
  "solar particle storm": {
    en: "A blast of energetic particles fired from the Sun.",
    bn: "সূর্য থেকে ছুটে আসা তীব্র তেজস্ক্রিয় কণার ঝড়।",
  },
  shielding: {
    en: "Heavy layers of material blocking space radiation.",
    bn: "ভারী পদার্থের স্তর যা মহাজাগতিক বিকিরণ আটকে দেয়।",
  },
  battery: {
    en: "Stores electrical power for when the sun goes down.",
    bn: "সূর্য ডোবার পর ব্যবহারের জন্য বিদ্যুৎ জমা রাখে।",
  },
  reactor: {
    en: "A power generator that makes electricity day and night.",
    bn: "একটি যন্ত্র যা দিনরাত একটানা বিদ্যুৎ উৎপাদন করে।",
  },
  rations: {
    en: "Packs of dry food stored for the crew.",
    bn: "ক্রুদের জন্য মজুত রাখা শুকনো খাবার।",
  },
  "air cleaner": {
    en: "Removes carbon dioxide so the air stays fresh.",
    bn: "বাতাস থেকে কার্বন ডাই-অক্সাইড দূর করে পরিষ্কার রাখে।",
  },
  "water recycler": {
    en: "Cleans used water so it can be used again.",
    bn: "ব্যবহৃত পানি পরিশোধন করে পুনরায় ব্যবহারের উপযোগী করে।",
  },
  "air machine": {
    en: "Makes fresh oxygen from water or carbon dioxide.",
    bn: "পানি বা পরিবেশ থেকে নতুন অক্সিজেন তৈরি করে।",
  },
  "storm shelter": {
    en: "A thickly shielded room to hide in during a solar storm.",
    bn: "সৌরঝড়ের সময় নিরাপদ থাকার জন্য সুরক্ষিত বিশেষ কক্ষ।",
  },
  day: {
    en: "One full day and night cycle on the Moon or Mars.",
    bn: "চাঁদ বা মঙ্গল গ্রহের একটি সম্পূর্ণ দিন ও রাত।",
  },
  sol: {
    en: "One Martian day (about 24 hours and 39 minutes).",
    bn: "মঙ্গল গ্রহের একটি দিন (প্রায় ২৪ ঘণ্টা ৩৯ মিনিট)।",
  },
  "light-time": {
    en: "The time a radio signal takes to cross space.",
    bn: "মহাকাশ দিয়ে রেডিও সংকেত পৌঁছাতে যে সময় লাগে।",
  },
  "Decision Card": {
    en: "A choice you make to protect your outpost and crew.",
    bn: "ঘাঁটি ও ক্রুদের রক্ষায় একটি গুরুত্বপূর্ণ সিদ্ধান্ত।",
  },
  Caution: {
    en: "A yellow warning that something needs your attention.",
    bn: "হলুদ সতর্কবার্তা যে কোনো কিছুতে নজর দেওয়া প্রয়োজন।",
  },
};

export interface TermProps {
  /** Key matching GLOSSARY or custom lookup. If omitted, lowercase text of children is used. */
  readonly term?: string;
  readonly children: ReactNode;
}

/**
 * Glossary Term component for ages 7–12.
 * Wraps domain terms with child-friendly definitions on hover, focus, or tap.
 */
export function Term({ term, children }: TermProps) {
  const [open, setOpen] = useState(false);
  const language = useAppLanguage();

  const lookupKey = (term ?? (typeof children === "string" ? children : "")).toLowerCase().trim();
  const entry = GLOSSARY[lookupKey];
  const definition = entry ? (language === "bn" ? entry.bn : entry.en) : undefined;

  if (!definition) {
    return <span className="glossary-term-plain">{children}</span>;
  }

  return (
    <span
      className="glossary-term-wrapper"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="glossary-term-btn"
        aria-expanded={open}
        aria-label={`${typeof children === "string" ? children : lookupKey}: ${definition}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        {children}
      </button>
      {open && (
        <span className="glossary-tooltip" role="tooltip">
          {definition}
        </span>
      )}
    </span>
  );
}

