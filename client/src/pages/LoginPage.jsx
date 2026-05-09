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
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 animate-fade-in-up">
                <h2 className="text-3xl font-heading font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-center text-brand-muted mb-8">Access your wellness dashboard</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-brand-muted mb-2 text-sm">Email Address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                            placeholder="arjun@nexora.com"
                        />
                        {errors.email && <p className="text-brand-danger text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-brand-muted mb-2 text-sm">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-cyan transition-colors"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-brand-danger text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center text-sm text-brand-muted cursor-pointer">
                            <input type="checkbox" className="mr-2 accent-brand-cyan rounded bg-brand-dark" />
                            Remember me
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand-cyan text-brand-dark font-bold py-3 rounded-lg hover:bg-brand-cyan/80 transition-all focus:outline-none shadow-[0_0_10px_rgba(0,212,255,0.3)]"
                    >
                        {isLoading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-brand-muted mt-6 text-sm">
                    Don't have an account? <Link to="/register" className="text-brand-cyan hover:underline">Join Nexora</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
