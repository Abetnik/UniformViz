import { useState } from 'react';
import HeroSection from './components/HeroSection';
import IntroCanvas from './components/IntroCanvas';

function App() {
  const [hideIntro, setHideIntro] = useState(false);

  return (
    <>
      {!hideIntro && <IntroCanvas onFinish={() => setHideIntro(true)} />}
      <HeroSection isVisible={hideIntro} />
    </>
  );
}

export default App;
