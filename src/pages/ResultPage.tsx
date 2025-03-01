import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Background from '../components/Background';
import { isMaghrebTime } from '../utils/prayerTime';

interface LocationState {
  name: string;
  choice: 'samosa' | 'samosak';
}

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, choice } = location.state as LocationState;
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [audio] = useState(new Audio());
  const [showMissionPassed, setShowMissionPassed] = useState(false);
  const [showMeme, setShowMeme] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [canEat, setCanEat] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [notAllowedAudio] = useState(new Audio('/sounds/beforemaghreb.mp3'));

  const samosaSteps = [
    '/1.png',
    '/2.png',
    '/3.png',
    '/4.png'
  ];

  const eatingSounds = [
    '/sounds/eating1.mp3',
    '/sounds/eating2.mp3',
    '/sounds/eating3.mp3',
    '/sounds/eating4.mp3'
  ];

  // Add scale factor for each step
  const scaleFactors = [1, 0.85, 0.7, 0.5];

  useEffect(() => {
    // Preload sounds
    eatingSounds.forEach(sound => {
      const audioObj = new Audio(sound);
      audioObj.load();
    });
  }, []);

  useEffect(() => {
    if (showMissionPassed) {
      // Show meme after 1.5 seconds (middle of typical GTA mission passed video)
      const timer = setTimeout(() => {
        setShowMeme(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showMissionPassed]);

  useEffect(() => {
    // Hide warning after 3 seconds
    const timer = setTimeout(() => {
      setShowWarning(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoEnded) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 10000); // 10 seconds after video ends
      return () => clearTimeout(timer);
    }
  }, [videoEnded, navigate]);

  useEffect(() => {
    const checkPrayerTime = async () => {
      const afterMaghreb = await isMaghrebTime();
      setCanEat(afterMaghreb);
      setIsChecking(false);
    };
    checkPrayerTime();
  }, []);

  const playEatingSound = (step: number) => {
    audio.src = eatingSounds[step];
    audio.volume = 1; // Adjust volume as needed
    audio.play().catch(console.error);
  };

  const handleImageClick = () => {
    if (!canEat) {
      notAllowedAudio.currentTime = 0;
      notAllowedAudio.volume = 0.7;
      notAllowedAudio.play().catch(console.error);
      return;
    }
    
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    playEatingSound(step);
    
    const nextStep = step + 1;
    
    setTimeout(() => {
      if (nextStep === samosaSteps.length) {
        // Show mission passed when finished
        setShowMissionPassed(true);
      } else {
        setStep(nextStep);
      }
      setIsTransitioning(false);
    }, 150); // Slightly longer transition for smoother effect
  };

  return (
    <Background>
      <div className="relative bg-gradient-to-b from-[#1a1f3c] to-[#162339] p-6 sm:p-10 pb-8 sm:pb-12 rounded-3xl w-full max-w-[32rem] border border-blue-500/20 shadow-xl shadow-blue-900/20">
        {/* Warning message based on prayer time */}
        {showWarning && !isChecking && (
          <div className="absolute top-0 left-0 right-0 -mt-16 animate-fade-warning">
            <div className={`${canEat ? 'bg-green-500/90' : 'bg-red-500/90'} text-white px-4 py-2 rounded-lg shadow-lg`}>
              <p className="text-center font-arabic text-lg">
                {canEat 
                  ? 'تقبل الله صيامك! تفضل كُل' 
                  : 'في رمضان مش هتعرف تاكلها الا بعد الفطار'}
              </p>
            </div>
          </div>
        )}
        
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#1a1f3c] rounded-full border border-amber-500/30 flex items-center justify-center shadow-lg">
          <span className="text-4xl animate-pulse-slow drop-shadow-2xl">🌙</span>
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-arabic font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-lg leading-relaxed pb-2">
            {choice === 'samosa' ? 'سمبوسة' : 'سمبوسك'}
          </h1>
          
          <div 
            className="cursor-pointer relative h-[250px] sm:h-[300px] flex items-center justify-center mb-4 hover:cursor-pointer"
            onClick={handleImageClick}
          >
            <img 
              src={samosaSteps[step]} 
              alt={`${choice} eating step ${step + 1}`}
              className={`max-w-full max-h-full object-contain transition-all duration-150 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              } ${!canEat ? 'filter grayscale' : ''}`}
              style={{ 
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                transform: `scale(${scaleFactors[step]})`,
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease-in-out, opacity 0.15s ease-in-out'
              }}
            />
            <p className="absolute bottom-0 text-blue-200/80 text-sm">
              {isChecking 
                ? 'Checking prayer time...' 
                : canEat 
                  ? 'Click to take a bite!' 
                  : 'Wait until Maghreb prayer'}
            </p>
          </div>

          <h2 className="text-2xl text-blue-100">
            Enjoy your {choice}, {name}!
          </h2>
          <p className="text-blue-200/80">
            {step === samosaSteps.length - 1 
              ? "That was delicious!" 
              : "Click the food to take another bite"}
          </p>
        </div>

        {showMissionPassed && (
          <div 
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <div className="relative w-full max-w-[90vw] sm:max-w-4xl transform scale-110 animate-mission-passed">
              <video 
                autoPlay 
                muted={false}
                className="w-full h-full object-contain"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'
                }}
                onEnded={() => setVideoEnded(true)}
              >
                <source src="/mission-passed.mp4" type="video/mp4" />
              </video>
              {videoEnded && (
                <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 text-sm">
                  Returning to home in {Math.ceil(5)} seconds...
                </p>
              )}
            </div>
          </div>
        )}

        {showMeme && (
          <div 
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center items-end p-4"
            onClick={() => setShowMeme(false)}
          >
            <div className="relative w-full max-w-xl animate-slide-up">
              <img 
                src="/meme.jpeg" 
                alt="Ramadan Meme"
                className="max-w-full h-auto rounded-lg shadow-2xl mx-auto"
                style={{ 
                  filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.3))',
                  maxHeight: '35vh'
                }}
              />
              <p className="text-white/80 text-sm mt-2 text-center">
                Click anywhere to continue
              </p>
            </div>
          </div>
        )}
      </div>
    </Background>
  );
};

export default ResultPage;
