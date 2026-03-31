import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Landing } from "./scenes/Scene2Landing";
import { Scene3Calculator } from "./scenes/Scene3Calculator";
import { Scene4Features } from "./scenes/Scene4Features";
import { Scene5Dashboard } from "./scenes/Scene5Dashboard";
import { Scene6Stress } from "./scenes/Scene6Stress";
import { Scene7Benchmark } from "./scenes/Scene7Benchmark";
import { Scene8Pricing } from "./scenes/Scene8Pricing";
import { Scene9CTA } from "./scenes/Scene9CTA";

export const MainVideo = () => {
  const t = (p: any) => (
    <TransitionSeries.Transition
      presentation={p}
      timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
    />
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1622" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene1Intro />
        </TransitionSeries.Sequence>
        {t(fade())}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene2Landing />
        </TransitionSeries.Sequence>
        {t(slide({ direction: "from-right" }))}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene3Calculator />
        </TransitionSeries.Sequence>
        {t(fade())}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene4Features />
        </TransitionSeries.Sequence>
        {t(slide({ direction: "from-left" }))}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene5Dashboard />
        </TransitionSeries.Sequence>
        {t(fade())}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene6Stress />
        </TransitionSeries.Sequence>
        {t(slide({ direction: "from-right" }))}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene7Benchmark />
        </TransitionSeries.Sequence>
        {t(fade())}
        <TransitionSeries.Sequence durationInFrames={150}>
          <Scene8Pricing />
        </TransitionSeries.Sequence>
        {t(fade())}
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene9CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
