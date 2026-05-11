import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import LandingNavbar from '../components/common/LandingNavbar';

const RegisterPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess || user) {
            navigate('/dashboard');
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onSubmit = (data) => {
        delete data.confirmPassword;
        dispatch(registerUser(data));
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center p-4 bg-white text-black font-jost selection:bg-black selection:text-white">
            <LandingNavbar />            <div className="w-full max-w-2xl p-10 bg-white border border-black animate-fade-in-up">
                <h2 className="text-4xl font-cormorant italic font-bold text-center mb-4 tracking-wide uppercase">Join Nexora</h2>
                <p className="text-center text-[#555] mb-10 font-tenor uppercase tracking-widest text-xs">Start your wellness journey today</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Full Name</label>
                            <input type="text" {...register('name', { required: 'Name is required' })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Email</label>
                            <input type="email" {...register('email', { required: 'Email is required' })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Age</label>
                            <input type="number" {...register('age')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>
                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Gender</label>
                            <select {...register('gender')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Height (cm)</label>
                            <input type="number" {...register('height')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>
                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Weight (kg)</label>
                            <input type="number" {...register('weight')} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                        </div>

                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Password</label>
                            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Confirm Password</label>
                            <input type="password" {...register('confirmPassword', {
                                required: 'Please confirm password',
                                validate: (val) => {
                                    if (watch('password') != val) {
                                        return "Your passwords do no match";
                                    }
                                }
                            })} className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors" />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-bold">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-tenor uppercase tracking-[0.2em] py-4 hover:bg-brand-gold transition-colors mt-8">
                        {isLoading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-8 text-xs font-tenor tracking-widest uppercase">
                    Already have an account? <Link to="/login" className="text-brand-gold hover:underline font-bold">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
