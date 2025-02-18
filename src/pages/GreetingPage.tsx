import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Background from '../components/Background';

const GreetingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.name || 'Friend';

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/food-chooser', { state: { name: userName } });
    }, 2000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate, userName]);

  return (
    <Background>
      <div className="relative bg-gradient-to-b from-[#1a1f3c] to-[#162339] p-10 pb-12 rounded-3xl w-[32rem] border border-blue-500/20 shadow-xl shadow-blue-900/20">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#1a1f3c] rounded-full border border-amber-500/30 flex items-center justify-center shadow-lg">
          <span className="text-4xl animate-pulse-slow drop-shadow-2xl">🌙</span>
        </div>
        
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-arabic font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-lg leading-relaxed pb-2">
            أهلاً وسهلاً 
          </h1>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-lg leading-relaxed pb-2">
            Ramadan Kareem
          </h1>
          <h2 className="text-2xl text-blue-100">
            Welcome, {userName}!
          </h2>
          <p className="text-blue-200/80">
            May this Ramadan bring you joy, peace, and blessings.
          </p>
        </div>
      </div>
    </Background>
  );
};

export default GreetingPage;
