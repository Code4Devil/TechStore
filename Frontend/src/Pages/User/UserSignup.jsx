import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'react-toastify';

const UserSignup = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register(name, email, password);
      toast.success('Registration successful');
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="container mx-auto px-4" id="el-kdq6jrso">
      <div className="py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold text-blue-600">TechStore</a>
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-4xl bg-neutral-800 rounded-lg shadow-2xl overflow-hidden" id="el-gkdgw7r7">
          <div className="flex flex-col md:flex-row" id="el-hvqwaxrj">
            <div className="md:w-1/2 p-8" id="el-c0o6iu1b">
              <h2 className="text-3xl font-bold text-white mb-6 animate__animated animate__fadeInDown" id="el-2pwejq4i">Create Your Account</h2>
              <form id="signup-form" className="space-y-4" onSubmit={handleSubmit}>
                <div id="el-yn50pt8j">
                  <label className="block text-gray-300 mb-2" htmlFor="name" id="el-jdfpci53">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div id="el-b9qnpwsm">
                  <label className="block text-gray-300 mb-2" htmlFor="email" id="el-9ecg39q8">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div id="el-ha0w420u">
                  <label className="block text-gray-300 mb-2" htmlFor="password" id="el-ewm5neiz">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div id="el-9lva18vy">
                  <label className="block text-gray-300 mb-2" htmlFor="confirm-password" id="el-vncnzdpj">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="w-full px-4 py-2 rounded bg-neutral-700 text-white border border-neutral-600 focus:outline-none focus:border-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center" id="el-dl27tvc2">
                  <input type="checkbox" id="terms" className="rounded bg-neutral-700 border-neutral-600" required />
                  <label className="ml-2 text-gray-300" htmlFor="terms" id="el-cswfokzl">I agree to the Terms and Conditions</label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 animate__animated animate__pulse" id="el-tea03j3p">Sign Up</button>
              </form>
            </div>
            <div className="md:w-1/2 bg-neutral-700 p-8" id="el-74k05q27">
              <div className="h-full flex flex-col justify-center" id="el-izxhlk9h">
                <h3 className="text-2xl font-bold text-white mb-4 animate__animated animate__fadeInRight" id="el-b4q30203">Welcome to ShopEase</h3>
                <ul className="text-gray-300 space-y-4" id="el-evx23rkt">
                  <li className="flex items-center" id="el-kmclusev">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-b3oacvhu">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" id="el-0b2bqwhn"></path>
                    </svg>
                    Access exclusive deals
                  </li>
                  <li className="flex items-center" id="el-nrn6hy4q">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-yixdp20v">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" id="el-4jjud4z2"></path>
                    </svg>
                    Track your orders easily
                  </li>
                  <li className="flex items-center" id="el-yi1xrqyp">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" id="el-ekia0zfv">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" id="el-vjn9p22v"></path>
                    </svg>
                    Save your favorites
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;