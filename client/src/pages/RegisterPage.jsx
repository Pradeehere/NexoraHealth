import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, reset } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

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
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-2xl p-8 animate-fade-in-up">
                <h2 className="text-3xl font-heading font-bold text-center mb-2">Join Nexora Health</h2>
                <p className="text-center text-brand-muted mb-8">Start your wellness journey today.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Full Name</label>
                            <input type="text" {...register('name', { required: 'Name is required' })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                            {errors.name && <p className="text-brand-danger text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Email</label>
                            <input type="email" {...register('email', { required: 'Email is required' })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                            {errors.email && <p className="text-brand-danger text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Age</label>
                            <input type="number" {...register('age')} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                        </div>
                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Gender</label>
                            <select {...register('gender')} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Height (cm)</label>
                            <input type="number" {...register('height')} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                        </div>
                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Weight (kg)</label>
                            <input type="number" {...register('weight')} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                        </div>

                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Password</label>
                            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                            {errors.password && <p className="text-brand-danger text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="block text-brand-muted mb-2 text-sm">Confirm Password</label>
                            <input type="password" {...register('confirmPassword', {
                                required: 'Please confirm password',
                                validate: (val) => {
                                    if (watch('password') != val) {
                                        return "Your passwords do no match";
                                    }
                                }
                            })} className="w-full bg-brand-dark/50 border border-brand-card rounded-lg px-4 py-3 text-white focus:border-brand-cyan outline-none" />
                            {errors.confirmPassword && <p className="text-brand-danger text-xs mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-brand-cyan text-brand-dark font-bold py-3 rounded-lg hover:bg-brand-cyan/80 transition-all shadow-[0_0_10px_rgba(0,212,255,0.3)]">
                        {isLoading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-brand-muted mt-6 text-sm">
                    Already have an account? <Link to="/login" className="text-brand-cyan hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
