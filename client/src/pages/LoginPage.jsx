import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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
        dispatch(login(data));
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-white text-black font-jost selection:bg-black selection:text-white">
            <div className="w-full max-w-md p-10 bg-white border border-black animate-fade-in-up">
                <h2 className="text-4xl font-cormorant italic font-bold text-center mb-4 tracking-wide uppercase">Login</h2>
                <p className="text-center text-[#555] mb-10 font-tenor uppercase tracking-widest text-xs">Access your wellness dashboard</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Email Address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="arjun@nexora.com"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-black font-tenor font-bold uppercase tracking-widest text-xs mb-2">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full bg-white border border-black p-3 focus:outline-none focus:border-brand-gold transition-colors"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center text-xs font-tenor tracking-widest uppercase cursor-pointer">
                            <input type="checkbox" className="mr-2 accent-black bg-white border-black" />
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-tenor uppercase tracking-[0.2em] py-4 hover:bg-brand-gold transition-colors mt-8"
                    >
                        {isLoading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-8 text-xs font-tenor tracking-widest uppercase">
                    Don't have an account? <Link to="/register" className="text-brand-gold hover:underline font-bold">Join Nexora</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
