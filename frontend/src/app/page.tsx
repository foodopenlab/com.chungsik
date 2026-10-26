import { Suspense } from "react";

import { BuiltSection } from "@/features/built/components/BuiltSection";
import { ContactSection } from "@/features/contact/components/ContactSection";
import { DeploySection } from "@/features/deploy/components/DeploySection";
import { DictSection } from "@/features/dict/components/DictSection";
import { GapSection } from "@/features/gap/components/GapSection";
import { HeroPrefetch } from "@/features/hero/components/HeroPrefetch";
import { StackSection } from "@/features/stack/components/StackSection";
import { TranslateSection } from "@/features/translate/components/TranslateSection";
import { RouteFallback } from "@/shared/ui/RouteFallback";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<RouteFallback />}>
        <HeroPrefetch />
      </Suspense>
      <Suspense fallback={<RouteFallback />}>
        <GapSection />
      </Suspense>
      <Suspense fallback={<RouteFallback />}>
        <TranslateSection />
      </Suspense>
      <Suspense fallback={<RouteFallback />}>
        <StackSection />
      </Suspense>
      <Suspense fallback={<RouteFallback />}>
        <BuiltSection />
      </Suspense>
      <Suspense fallback={<RouteFallback />}>
        <DictSection />
      </Suspense>
      <DeploySection />
      <Suspense fallback={<RouteFallback />}>
        <ContactSection />
      </Suspense>
    </main>
  );
}
