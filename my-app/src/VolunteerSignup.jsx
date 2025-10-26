import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function VolunteerSignup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    email: '',
    password: '',
    location: '',
    
    // Step 2
    interests: [],
    skills: '',
    
    // Step 3
    hours: '',
    contactMethod: '',
    
    // Step 4
    motivation: '',
    experience: '',
    
    // Step 5
    consent: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMultiSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      interests: selectedOptions
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare profile text for AI embedding
    const profileText = `
      Interests: ${formData.interests.join(', ')}
      Skills: ${formData.skills}
      Motivation: ${formData.motivation}
      Experience: ${formData.experience}
      Availability: ${formData.hours} hours per week
      Contact Method: ${formData.contactMethod}
      Location: ${formData.location}
    `.trim();

    try {
      const signupData = {
        real_name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'volunteer',
        profile_text: profileText
      };

      await signup(signupData);

      alert('Signup successful! You can now log in.');
      navigate('/login/volunteer');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNum <= step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Country / Region</label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your location"
                />
              </div>
            </div>
          )}

          {/* Step 2: Skills & Preferences */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills & Preferences</h2>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Which areas are you passionate about helping in?
                </label>
                <select
                  multiple
                  name="interests"
                  value={formData.interests}
                  onChange={handleMultiSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                >
                  <option value="Education & Tutoring">Education & Tutoring</option>
                  <option value="Career Development">Career Development</option>
                  <option value="Mental Health / Counseling">Mental Health / Counseling</option>
                  <option value="Scholarship Support">Scholarship Support</option>
                  <option value="Food & Nutrition">Food & Nutrition</option>
                  <option value="Housing Assistance">Housing Assistance</option>
                  <option value="Healthcare Access">Healthcare Access</option>
                  <option value="Legal Assistance">Legal Assistance</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">What skills do you bring?</label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  placeholder="e.g. grant writing, teaching, software development, translation, counseling..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                />
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Availability</h2>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  How much time can you commit weekly?
                </label>
                <select
                  name="hours"
                  value={formData.hours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select hours per week</option>
                  <option value="Less than 1 hour">Less than 1 hour</option>
                  <option value="1–3 hours">1–3 hours</option>
                  <option value="3–5 hours">3–5 hours</option>
                  <option value="5+ hours">5+ hours</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Preferred communication method
                </label>
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select preferred method</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="In-app chat">In-app chat</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Mission & Motivation */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mission & Motivation</h2>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  What motivates you to volunteer?
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="Why do you want to help? What drives you to make a difference?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Have you volunteered before?
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation & Consent */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Almost Done!</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-4">Review Your Information</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {formData.name}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Location:</strong> {formData.location}</p>
                  <p><strong>Interests:</strong> {formData.interests.join(', ') || 'None selected'}</p>
                  <p><strong>Skills:</strong> {formData.skills || 'Not specified'}</p>
                  <p><strong>Availability:</strong> {formData.hours || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  required
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1"
                />
                <label htmlFor="consent" className="text-sm text-gray-700">
                  I consent to anonymous matching and data use for matching purposes. 
                  I understand that my information will be used to connect me with beneficiaries 
                  in need while maintaining privacy and security for all parties involved.
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            ) : (
              <Link
                to="/"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </Link>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit & Find a Match
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}