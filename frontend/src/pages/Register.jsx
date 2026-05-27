// frontend/src/pages/Register.jsx (FIXED)
// FIX: tambah validasi format email di sisi frontend

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim())              e.name    = 'Nama wajib diisi';
    if (!form.email.trim())             e.email   = 'Email wajib diisi';
    else if (!EMAIL_REGEX.test(form.email)) e.email = 'Format email tidak valid';
    if (form.password.length < 8)       e.password = 'Password minimal 8 karakter';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Password tidak cocok';
    return e;
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { name: form.name, email: form.email, phone: form.phone, password: form.password }
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/katalog');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border text-sm transition focus:outline-none focus:ring-2
          ${errors[name]
            ? 'border-red-400 focus:ring-red-300'
            : 'border-gray-200 focus:ring-blue-300 bg-gray-50'}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center mb-3">
            <span className="text-2xl">🐟</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Nila Prima Farm</h1>
          <p className="text-sm text-gray-500">Buat Akun Baru</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field name="name"            label="Nama Lengkap"     placeholder="Masukkan nama lengkap" />
          <Field name="email"           label="Email"            type="email" placeholder="contoh@email.com" />
          <Field name="phone"           label="Nomor Telepon"    placeholder="08xxxxxxxxxx" />
          <Field name="password"        label="Password"         type="password" placeholder="Minimal 8 karakter" />
          <Field name="confirmPassword" label="Konfirmasi Password" type="password" placeholder="Ulangi password" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white
                       font-semibold py-3 rounded-xl transition text-sm"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-500 font-medium hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
