import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, FileText, X, Save, Send, User, CheckCircle } from 'lucide-react';
import { mockUsers } from '../lib/mockData';
import { useToast } from './Toast';

export function CreateWorkpack() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    projectName: '',
    description: '',
    assignedReviewer: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'draft' | 'ready' | 'submit'>('draft');

  const reviewers = mockUsers.filter(u => u.role === 'reviewer');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    showToast('Workpack saved as draft', 'success');
    setTimeout(() => navigate('/dashboard/workpacks'), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit workpack logic
    setCurrentStep('submit');
    showToast('Workpack submitted successfully!', 'success');
    setTimeout(() => navigate('/dashboard/contractor'), 1500);
  };

  // Check form completion for step indicator
  const isFormFilled = formData.title && formData.projectName && formData.description;
  const isReadyToSubmit = isFormFilled && formData.assignedReviewer && uploadedFiles.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create New Workpack</h1>
        <p className="text-slate-600 mt-1">Fill in the details and upload supporting documents</p>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === 'draft' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {currentStep === 'draft' ? '1' : <CheckCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-slate-900">Draft</div>
                <div className="text-sm text-slate-600">Fill in workpack details</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${isFormFilled ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isReadyToSubmit ? 'bg-emerald-600 text-white' : isFormFilled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {isReadyToSubmit ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <div>
                <div className="font-semibold text-slate-900">Ready</div>
                <div className="text-sm text-slate-600">Add documents & reviewer</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${isReadyToSubmit ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === 'submit' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep === 'submit' ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <div>
                <div className="font-semibold text-slate-900">Submit</div>
                <div className="text-sm text-slate-600">Send for review</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          {/* Workpack Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Workpack Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Foundation and Structural Steel Installation"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-2">
              Project Name *
            </label>
            <input
              id="projectName"
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="e.g., Downtown Office Complex"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Work Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Work Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed description of the work to be performed..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Assigned Reviewer */}
          <div>
            <label htmlFor="reviewer" className="block text-sm font-medium text-slate-700 mb-2">
              Select Reviewer *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                id="reviewer"
                value={formData.assignedReviewer}
                onChange={(e) => setFormData({ ...formData, assignedReviewer: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                required
              >
                <option value="">Select a reviewer...</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.name}>
                    {reviewer.name} - {reviewer.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Supporting Documents</h3>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all">
            <input
              type="file"
              id="fileUpload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-slate-600">
                    PDF, DOC, XLS, PNG, JPG (max. 10MB each)
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-900">{file}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/contractor')}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:scale-[1.02] transition-all font-medium"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              type="submit"
              disabled={!isReadyToSubmit}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isReadyToSubmit
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:scale-[1.02]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Submit for Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}