import { useLocation, useNavigate } from 'react-router-dom';
import Background from '../components/Background';

const FoodChooserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = location.state?.name || 'Friend';

  const handleChoice = (choice: 'samosa' | 'samosak') => {
    navigate('/result', { 
      state: { 
        name: userName,
        choice: choice 
      } 
    });
  };

  return (
    <Background>
      <div className="relative bg-gradient-to-b from-[#1a1f3c] to-[#162339] p-6 sm:p-10 pb-8 sm:pb-12 rounded-3xl w-full max-w-[32rem] border border-blue-500/20 shadow-xl shadow-blue-900/20">
        <div className="text-center space-y-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl text-blue-100">Choose Your Favorite, {userName}!</h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="group cursor-pointer" onClick={() => handleChoice('samosa')}>
            <div className="bg-white/10 rounded-xl p-6 space-y-4 hover:bg-white/20 transition-all duration-300 border border-blue-500/20 hover:border-amber-500/30 hover:scale-105">
              <div className="text-6xl text-center">🥟</div>
              <div className="text-center">
                <h3 className="text-xl text-blue-100 font-medium">Samosa</h3>
                <p className="text-blue-200/80 text-sm mt-2">سمبوسة</p>
              </div>
            </div>
          </div>

          <div className="group cursor-pointer" onClick={() => handleChoice('samosak')}>
            <div className="bg-white/10 rounded-xl p-6 space-y-4 hover:bg-white/20 transition-all duration-300 border border-blue-500/20 hover:border-amber-500/30 hover:scale-105">
              <div className="text-6xl text-center">🥟</div>
              <div className="text-center">
                <h3 className="text-xl text-blue-100 font-medium">Samosak</h3>
                <p className="text-blue-200/80 text-sm mt-2">سمبوسك</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default FoodChooserPage;
