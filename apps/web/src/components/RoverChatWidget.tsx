import { useState } from "react";
import { FiX } from "react-icons/fi";
import { selectPendingIncident } from "../incidents/pendingIncident.js";
import { useRun } from "../store/run.js";
import { useDial } from "../store/dial.js";
import { useAppLanguage } from "../i18n/useAppLanguage.js";
import "./RoverChatWidget.css";

const ASSISTANT_ICON_SRC = "/icons/_ (11)-Photoroom.png";

interface RoverChatWidgetProps {
  readonly currentView: string;
}

export function RoverChatWidget({ currentView }: RoverChatWidgetProps) {
  const level = useDial((s) => s.level);
  const state = useRun((s) => s.state);
  const language = useAppLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customReply, setCustomReply] = useState<string | null>(null);

  // Only render for Cadet level
  if (level !== "cadet") {
    return null;
  }

  const pendingIncident = selectPendingIncident(state);
  const hasAlert =
    pendingIncident !== undefined ||
    state.radiation.solarParticleEventActive ||
    (state.power.batteryCapacityKwh > 0 &&
      state.power.batteryEnergyKwh / state.power.batteryCapacityKwh < 0.25);

  const botName = language === "bn" ? "ক্যাডেট সহকারী" : "Cadet Companion";

  const getStationDefaultAdvice = () => {
    switch (currentView) {
      case "power":
        return language === "bn"
          ? "মার্সিয়ান ধুলাবালি সৌর প্যানেল ঢেকে দেয়! 'Clean solar panels' চাপুন যাতে রাতের বেলাতেও ব্যাটারি চালু থাকে।"
          : "Mars dust blocks sunlight! Tap 'Clean solar panels' or turn off unneeded gear so batteries last through the night.";
      case "lifeSupport":
        return language === "bn"
          ? "অক্সিজেন এবং বিশুদ্ধ পানি ক্রুদের বাঁচিয়ে রাখে! বাতাস সতেজ রাখুন, CO₂ নিয়ন্ত্রণে রাখুন এবং বাগানের গাছে আলো দিন।"
          : "Oxygen and clean water keep the crew healthy! Keep the air fresh, watch the CO₂ gauge, and make sure the greenhouse has light.";
      case "comms":
        return language === "bn"
          ? "মহাকাশে পৃথিবীর সাথে বার্তা আদান-প্রদানে কয়েক মিনিট দেরি হয়। নাসা থেকে কোনো সৌর ঝড়ের সতর্কবার্তা এলে দ্রুত প্রস্তুত হোন!"
          : "Radio messages to Earth take minutes to travel across space. Keep an eye on incoming space weather bulletins and solar storm alerts from NASA!";
      case "incidentCommand":
        return language === "bn"
          ? "বিপদের সাইরেন বাজলে সবচেয়ে গুরুত্বপূর্ণ যন্ত্রটি আগে রক্ষা করুন! খুচরা যন্ত্রাংশ দিয়ে নষ্ট যন্ত্রপাতি মেরামত করে নিন।"
          : "When alarms sound, choose which systems to protect first! Use your spare parts box to repair broken machinery before air or power run low.";
      case "missionCommand":
        return language === "bn"
          ? "ককপিটে স্বাগতম, ক্যাডেট! বাতাস, বিদ্যুৎ ও রেডিয়েশন ঢাল—এই তিনটি মিটার খেয়াল রাখুন এবং দিন পরিচালনা করুন।"
          : "Welcome to the Cockpit, Cadet! Watch your Air, Battery, and Shield gauges, and advance each day when ready.";
      case "habitat":
        return language === "bn"
          ? "৩ডি হ্যাবিট্যাট ঘুরে দেখুন! যেখানে ক্রুরা থাকে ও কাজ করে—সেই গ্রিনহাউস, বেডরুম ও লাইফ সাপোর্ট মডিউলগুলো দেখুন।"
          : "Explore the 3D habitat! Check out the greenhouse, crew bunks, and life support modules where your astronauts live and work.";
      default:
        return language === "bn"
          ? "সাবধানে থাকুন, ক্যাডেট! বাতাস ও ব্যাটারি সবসময় নিরাপদ মাত্রায় রাখুন।"
          : "Stay safe out there, Cadet! Make sure your air is green and your batteries are charged.";
    }
  };

  const currentMessage = customReply ?? getStationDefaultAdvice();

  const handleAsk = (topic: "air" | "power" | "whatNext") => {
    if (topic === "air") {
      const o2Safe = state.atmosphere.o2PartialPressureMmHg > 120;
      setCustomReply(
        language === "bn"
          ? o2Safe
            ? "বাতাস সম্পূর্ণ নিরাপদ! অক্সিজেন স্তর চমৎকার।"
            : "সতর্কতা! বাতাস পাতলা হয়ে আসছে, অক্সিজেন পরীক্ষা করুন!"
          : o2Safe
            ? "Air is fresh and safe! O2 levels are looking great."
            : "Caution! Cabin air is getting thin, check Life Support!",
      );
    } else if (topic === "power") {
      setCustomReply(
        language === "bn"
          ? "ব্যাটারিতে পর্যাপ্ত চার্জ রাখুন যাতে রাতের বেলা লাইফ সাপোর্ট চালু থাকে।"
          : "Keep batteries charged up before nightfall so Life Support never stops.",
      );
    } else {
      setCustomReply(
        language === "bn"
          ? "ককপিটে ফিরে যান, মিটারগুলো সবুজ রাখুন এবং 'Run Day' চেপে দিন পরিচালনা করুন।"
          : "Head to Cockpit, keep your 3 gauges green, and tap 'Run Day' to advance!",
      );
    }
  };

  return (
    <div className="rover-chat-container">
      {/* Floating Chat Box Popover (when open) */}
      {isOpen && (
        <aside className="rover-chat-box" role="dialog" aria-label="Rover AI Chat">
          <header className="rover-chat-header">
            <div className="rover-chat-identity">
              <span className="rover-chat-avatar" aria-hidden="true">
                <img src={ASSISTANT_ICON_SRC} alt={botName} className="rover-chat-avatar-img" />
              </span>
              <div>
                <h3 className="rover-chat-name">{botName}</h3>
                <span className="rover-chat-tag">
                  {language === "bn" ? "মিশন সহকারী" : "Mission Companion"}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-quiet rover-chat-close-btn"
              onClick={() => {
                setIsOpen(false);
                setCustomReply(null);
              }}
              aria-label="Close assistant"
            >
              <FiX aria-hidden="true" />
            </button>
          </header>

          <div className="rover-chat-body">
            <div className="rover-chat-bubble">
              <span className="rover-bubble-avatar" aria-hidden="true">
                <img src={ASSISTANT_ICON_SRC} alt={botName} className="rover-bubble-avatar-img" />
              </span>
              <p className="rover-bubble-text">{currentMessage}</p>
            </div>

            {/* Quick action chips */}
            <div className="rover-chips-row">
              <button type="button" className="rover-chip" onClick={() => handleAsk("whatNext")}>
                {language === "bn" ? "কী করব? 🧭" : "What next? 🧭"}
              </button>
              <button type="button" className="rover-chip" onClick={() => handleAsk("air")}>
                {language === "bn" ? "বাতাস কেমন? 🫁" : "Air check? 🫁"}
              </button>
              <button type="button" className="rover-chip" onClick={() => handleAsk("power")}>
                {language === "bn" ? "বিদ্যুৎ টিপস ⚡" : "Power tip ⚡"}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Bottom-Right Mascot Glowing Pill Button */}
      <button
        type="button"
        className={`rover-mascot-pill-btn ${hasAlert ? "has-alert" : ""} ${isOpen ? "is-open" : ""}`}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setCustomReply(null);
        }}
        aria-label={
          isOpen
            ? language === "bn"
              ? "সহকারী বন্ধ করুন"
              : "Close Companion"
            : language === "bn"
              ? "সহকারীকে জিজ্ঞাসা করুন"
              : "Ask your Companion"
        }
        aria-expanded={isOpen}
      >
        <div className="rover-mascot-avatar-circle">
          <img src={ASSISTANT_ICON_SRC} alt={botName} className="rover-mascot-img" />
          {hasAlert && !isOpen && <span className="rover-alert-dot" aria-label="Alert" />}
        </div>
        <span className="rover-mascot-label">
          {isOpen
            ? language === "bn"
              ? "বন্ধ করুন"
              : "Close"
            : language === "bn"
              ? "সহকারীকে জিজ্ঞাসা করুন"
              : "Ask your Companion"}
        </span>
      </button>
    </div>
  );
}
