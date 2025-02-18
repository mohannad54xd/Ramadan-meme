import { useForm } from 'react-hook-form';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import Background from './Background';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
}

const NameField = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await emailjs.send(
        'service_yhcy72j', // Replace with your EmailJS service ID
        'template_v0q41uj', // Replace with your EmailJS template ID
        {
          to_email: 'mohannadessam54@gmail.com', // Replace with your email
          from_name: data.name,
          message: `New Ramadan greeting from: ${data.name}`,
        },
        'bdGAINaRrrJVoWoMy' // Replace with your EmailJS user ID
      );
      setStatus('success');
      // Wait for 1 second before redirecting
      setTimeout(() => {
        navigate('/greeting', { state: { name: data.name } });
      }, 1000);
    } catch (error) {
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <Background>
      <div className="relative bg-gradient-to-b from-[#1a1f3c] to-[#162339] p-6 sm:p-10 pb-8 sm:pb-12 rounded-3xl w-full max-w-[32rem] border border-blue-500/20 shadow-xl shadow-blue-900/20">
        {/* Ornamental header with improved shadow */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-12 bg-[#1a1f3c] rounded-full border border-amber-500/30 flex items-center justify-center shadow-lg">
          <span className="text-4xl animate-pulse-slow drop-shadow-2xl">🌙</span>
        </div>
        
        <div className="text-center space-y-4 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-arabic font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-lg leading-relaxed pb-2">
            رمضان كريم
          </h1>
          <div className="flex items-center justify-center gap-3 text-blue-200/80">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <h2 className="text-lg font-medium tracking-wider">Ramadan Kareem</h2>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative backdrop-blur-sm bg-white/5 rounded-2xl p-4 sm:p-8 pb-6 sm:pb-10 border border-blue-500/20 shadow-inner overflow-visible">
          <div className="text-center space-y-6">
            <div className="flex justify-between px-4">
              <span className="text-blue-100/90 tracking-wide">Enter your name</span>
              <span className="text-blue-100/90 font-arabic">دخل اسمك</span>
            </div>
            
            <div className="space-y-2">
              <input 
                {...register("name", { 
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" }
                })}
                type="text" 
                className={`w-full px-6 py-4 rounded-xl bg-white/10 border ${errors.name ? 'border-red-400/50' : 'border-blue-500/30'} focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 text-lg text-blue-50 placeholder-blue-300/50 shadow-inner`}
                placeholder="Your name / اسمك"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-amber-500/80 to-amber-600/80 hover:from-amber-500 hover:to-amber-600 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 w-full"
            >
              {loading ? 'Sending...' : 'Send Greeting'}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-sm">Your greeting has been sent successfully!</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm">There was an error sending your greeting. Please try again.</p>
            )}
          </div>

          {/* Fixed ornamental corners with improved positioning */}
          <div className="absolute inset-[2px] pointer-events-none">
            <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-amber-500/30 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-amber-500/30 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-5 h-5 border-l-2 border-b-2 border-amber-500/30 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-amber-500/30 rounded-br-xl"></div>
          </div>
        </form>
      </div>
    </Background>
  );
};

export default NameField;
