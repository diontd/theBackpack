/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { WorldStage3D } from './components/WorldStage3D';
import { HudHeader } from './components/HudHeader';
import { ScreenAuth } from './components/ScreenAuth';
import { ScreenLanding } from './components/ScreenLanding';
import { ScreenInventory } from './components/ScreenInventory';
import { ScreenCategoryDetail } from './components/ScreenCategoryDetail';
import { ModalsContainer } from './components/ModalsContainer';
import { initBackpackRuntime } from './engine/bootstrapBackpackApp';

export default function App() {
  useEffect(() => {
    initBackpackRuntime();
  }, []);

  return (
    <>
      <WorldStage3D />
      <HudHeader />
      <main className="relative z-20 flex-1 flex flex-col justify-between max-w-[1440px] w-full mx-auto px-3 sm:px-6 pb-3 pt-1 pointer-events-none overflow-hidden">
        <ScreenAuth />
        <ScreenLanding />
        <ScreenInventory />
        <ScreenCategoryDetail />
      </main>
      <ModalsContainer />
    </>
  );
}
