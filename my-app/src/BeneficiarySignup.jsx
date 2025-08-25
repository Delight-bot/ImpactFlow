import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BeneficiarySignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information (Admin only)
    fullName: '',
    email: '',
    phone: '',
    country: '',
    region: '',
    age: '',
    
    // Step 2: Needs Assessment
    primaryNeed: '',
    secondaryNeeds: [],
    urgency: '',
    timeline: '',
    
    // Step 3: Specific Requirements
    currentSituation: '',
    challenges: '',
    goals: '',
    
    // Step 4: Privacy & Communication
    contactPreference: '',
    availability: '',
    language: '',
    
    // Step 5: Consent & Review
    consent: false,
    shareLimitedInfo: true
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
      secondaryNeeds: selectedOptions
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for AI matching (this would go to your backend)
    const aiMatchingData = {
      // Limited info for AI matching (no personal identifiers)
      needs: {
        primary: formData.primaryNeed,
        secondary: formData.secondaryNeeds,
        urgency: formData.urgency,
        timeline: formData.timeline
      },
      situation: formData.currentSituation,
      challenges: formData.challenges,
      goals: formData.goals,
      preferences: {
        contact: formData.contactPreference,
        availability: formData.availability,
        language: formData.language
      }
    };

    // Full data for admin (includes personal info)
    const adminData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    console.log('AI Matching Data:', aiMatchingData);
    console.log('Admin Data:', adminData);
    
    alert('Thank you for your application. Our team will review your needs and match you with a suitable volunteer. Your privacy is protected.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Get the Help You Need</h1>
          <p className="text-gray-600">Your information is secure and only shared with approved volunteers when matches are made</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNum <= step
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Information (Admin only) */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                🔒 This information is for admin purposes only and won't be shared with volunteers without your explicit permission.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Region/State</label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Needs Assessment */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What kind of help do you need?</h2>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">Primary Need *</label>
                <select
                  name="primaryNeed"
                  required
                  value={formData.primaryNeed}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select your main need</option>
                  <option value="Education & Tutoring">Education & Tutoring</option>
                  <option value="Career Development">Career Development</option>
                  <option value="Mental Health Support">Mental Health Support</option>
                  <option value="Scholarship Applications">Scholarship Applications</option>
                  <option value="School Fees Support">School Fees Support</option>
                  <option value="Food & Nutrition">Food & Nutrition</option>
                  <option value="Housing Assistance">Housing Assistance</option>
                  <option value="Healthcare Access">Healthcare Access</option>
                  <option value="Legal Assistance">Legal Assistance</option>
                  <option value="Other">Other (please specify in challenges)</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Additional areas where you need support
                </label>
                <select
                  multiple
                  name="secondaryNeeds"
                  value={formData.secondaryNeeds}
                  onChange={handleMultiSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                >
                  <option value="Academic Counseling">Academic Counseling</option>
                  <option value="Job Placement">Job Placement</option>
                  <option value="Resume Writing">Resume Writing</option>
                  <option value="Interview Preparation">Interview Preparation</option>
                  <option value="Mental Health Counseling">Mental Health Counseling</option>
                  <option value="Grant Writing">Grant Writing</option>
                  <option value="Financial Planning">Financial Planning</option>
                  <option value="Housing Search">Housing Search</option>
                  <option value="Healthcare Navigation">Healthcare Navigation</option>
                  <option value="Legal Advice">Legal Advice</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Urgency Level</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select urgency</option>
                    <option value="Critical (within 1 week)">Critical (within 1 week)</option>
                    <option value="Urgent (within 2 weeks)">Urgent (within 2 weeks)</option>
                    <option value="Important (within 1 month)">Important (within 1 month)</option>
                    <option value="Ongoing support">Ongoing support</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Expected Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select timeline</option>
                    <option value="Short-term (1-3 months)">Short-term (1-3 months)</option>
                    <option value="Medium-term (3-6 months)">Medium-term (3-6 months)</option>
                    <option value="Long-term (6+ months)">Long-term (6+ months)</option>
                    <option value="One-time assistance">One-time assistance</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Specific Requirements */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell us more about your situation</h2>
              
              <div>
                <label className="block mb-2 font-medium text-gray-700">Current Situation *</label>
                <textarea
                  name="currentSituation"
                  required
                  value={formData.currentSituation}
                  onChange={handleInputChange}
                  placeholder="Please describe your current circumstances and why you need support..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Main Challenges</label>
                <textarea
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleInputChange}
                  placeholder="What are the biggest challenges you're facing? What have you tried already?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Goals & Expectations</label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  placeholder="What would success look like for you? What are your hopes and goals?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24"
                />
              </div>
            </div>
          )}

          {/* Step 4: Privacy & Communication */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Communication Preferences</h2>
              <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                🔒 Your contact preferences help us match you with volunteers while maintaining your privacy.
              </p>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Preferred Contact Method *</label>
                <select
                  name="contactPreference"
                  required
                  value={formData.contactPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select preferred method</option>
                  <option value="Email">Email</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Video Call">Video Call</option>
                  <option value="In-app Messaging">In-app Messaging</option>
                  <option value="No preference">No preference</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select your general availability</option>
                  <option value="Weekdays daytime">Weekdays daytime</option>
                  <option value="Weekdays evenings">Weekdays evenings</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Flexible">Flexible</option>
                  <option value="To be discussed">To be discussed</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">Preferred Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  placeholder="English, Spanish, French, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 5: Consent & Review */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Consent</h2>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-4">Information for Matching</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Primary Need:</strong> {formData.primaryNeed || 'Not specified'}</p>
                  <p><strong>Additional Needs:</strong> {formData.secondaryNeeds.join(', ') || 'None'}</p>
                  <p><strong>Urgency:</strong> {formData.urgency || 'Not specified'}</p>
                  <p><strong>Timeline:</strong> {formData.timeline || 'Not specified'}</p>
                  <p><strong>Contact Preference:</strong> {formData.contactPreference || 'Not specified'}</p>
                </div>
              </div>

              <div className="space-y-4">
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
                    I consent to the processing of my information for matching purposes. 
                    I understand that my personal details will remain confidential and 
                    only necessary information will be shared with matched volunteers.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="shareLimitedInfo"
                    name="shareLimitedInfo"
                    checked={formData.shareLimitedInfo}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <label htmlFor="shareLimitedInfo" className="text-sm text-gray-700">
                    I agree to share limited information with potential volunteers to facilitate 
                    better matching. I can revoke this consent at any time.
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔒 Privacy Notice</h4>
                <p className="text-sm text-blue-700">
                  Your full personal information (name, email, phone) is only visible to platform administrators. 
                  Volunteers will only see your needs, situation description, and communication preferences unless 
                  you explicitly approve additional information sharing.
                </p>
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
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}