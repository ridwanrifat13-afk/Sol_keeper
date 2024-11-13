import type { ScenarioId } from "@sol-keeper/sim";
import { SmoothScrollHero } from "../../components/ui/modern-hero.js";

interface HomeViewProps {
  /** `scenarioId` pre-selects that mission in the setup wizard when given — the Schedule
   *  section's own per-mission "Select" buttons use this so each one is a genuinely
   *  different shortcut, not five buttons that all land on the same blank wizard. The nav's
   *  generic "Launch Outpost" button calls this with no argument (the wizard's own default). */
  onEnterSetup: (scenarioId?: ScenarioId) => void;
  /** M13: Quick 1-tap play that launches First Light in Junior view with defaults immediately. */
  onFastPlay?: (() => void) | undefined;
  /** M16: Launch the daily challenge mission with UTC date seed and today's Sun status. */
  onLaunchMissionOfTheDay?: (() => void) | undefined;
  onOpenCredits?: (() => void) | undefined;
}

export function HomeView({
  onEnterSetup,
  onFastPlay,
  onLaunchMissionOfTheDay,
  onOpenCredits,
}: HomeViewProps) {
  return (
    <div className="home-view">
      <SmoothScrollHero
        onLaunchMission={onEnterSetup}
        onFastPlay={onFastPlay}
        onLaunchMissionOfTheDay={onLaunchMissionOfTheDay}
        onOpenCredits={onOpenCredits}
      />
    </div>
  );
}
