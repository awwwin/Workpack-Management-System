import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Save, Send, User, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AlertTriangle } from 'lucide-react';
import { useToast } from './Toast';

export function CreateWorkpack() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    projectName: '',
    description: '',
    assignedReviewer: '',
    workpackNumber: '',
    discipline: '',
    priority: '',
    workLocation: '',
    safetyPermit: '',
    riskLevel: '',
    safetyRequirements: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'draft' | 'ready' | 'submit'>('draft');
  const [reviewers, setReviewers] = useState<any[]>([])
  const handleChange = (field: string, value: string) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};

useEffect(() => {
  async function loadReviewers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('role', 'reviewer')

    console.log('REVIEWERS DATA:', data)
    console.log('REVIEWERS ERROR:', error)

    if (error) return
    setReviewers(data || [])
  }

  loadReviewers()
}, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

const handleSaveDraft = async () => {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    showToast('Please log in again', 'error');
    return;
  }

  const { error } = await supabase.from('workpacks').insert([
    {
      title: formData.title,
      project_name: formData.projectName,
      work_description: formData.description,
      reviewer_id: formData.assignedReviewer || null,
      status: 'draft',
      created_by: authData.user.id,
      risk_level: formData.riskLevel,
      safety_requirements: formData.safetyRequirements,
    },
  ]);

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  showToast('Workpack saved as draft', 'success');
  setTimeout(() => navigate('/dashboard/workpacks'), 1000);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

const { data: authData, error: authError } = await supabase.auth.getUser();

if (authError || !authData.user) {
  showToast('Please log in again', 'error');
  return;
}

const { data: newWorkpack, error } = await supabase
  .from('workpacks')
  .insert([
    {
      title: formData.title,
      project_name: formData.projectName,
      work_description: formData.description,
      reviewer_id: formData.assignedReviewer,
      status: 'pending_review',
      created_by: authData.user.id,
      workpack_number: formData.workpackNumber,
      discipline: formData.discipline,
      priority: formData.priority,
     work_location: formData.workLocation,
     safety_permit: formData.safetyPermit,
    },
  ])
  .select()
  .single();

if (error || !newWorkpack) {
  showToast(error?.message || 'Failed to create workpack', 'error');
  return;
}

const workpackLabel = `WP${String(newWorkpack.id).padStart(3, '0')}`;

await supabase.from('notifications').insert([
  {
    user_id: authData.user.id,
    title: 'Submission Complete',
    message: `Your workpack ${workpackLabel} has been submitted for review`,
    type: 'success',
    read: false,
  },
  {
    user_id: formData.assignedReviewer,
    title: 'New Assignment',
    message: `You have been assigned to review ${workpackLabel}`,
    type: 'info',
    read: false,
  },
]);

  setCurrentStep('submit');
  showToast('Workpack submitted successfully!', 'success');
  setTimeout(() => navigate('/dashboard/workpacks'), 1500);
};
  // Check form completion for step indicator
  const isFormFilled = formData.title && formData.projectName && formData.description;
  const isReadyToSubmit = isFormFilled && formData.assignedReviewer;


  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white dark:text-white">Create New Workpack</h1>
        <p className="text-slate-600 dark:text-slate-300  dark:text-slate-300 mt-1">Fill in the details and upload supporting documents</p>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === 'draft' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {currentStep === 'draft' ? '1' : <CheckCircle className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Draft</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Fill in workpack details</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${isFormFilled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isReadyToSubmit ? 'bg-emerald-600 text-white' : isFormFilled ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {isReadyToSubmit ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Ready</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Add documents & reviewer</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${isReadyToSubmit ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep === 'submit' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {currentStep === 'submit' ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Submit</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Send for review</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Form */}
       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
          {/* Workpack Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Workpack Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Foundation and Structural Steel Installation"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Project Name */}
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Project Name *
            </label>
            <input
              id="projectName"
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              placeholder="e.g., Downtown Office Complex"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white"
              required
            />
          </div>
            

          {/* Workpack Number */}
<div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
    Workpack Number *
  </label>
  <input
    type="text"
    value={formData.workpackNumber}
    onChange={(e) => setFormData({ ...formData, workpackNumber: e.target.value })}
    placeholder="e.g., WP-2026-001"
    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Discipline */}
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      Discipline *
    </label>
    <select
      value={formData.discipline}
      onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select discipline</option>
      <option value="Structural">Structural</option>
      <option value="Mechanical">Mechanical</option>
      <option value="Electrical">Electrical</option>
      <option value="Piping">Piping</option>
      <option value="Instrumentation">Instrumentation</option>
      <option value="Civil">Civil</option>
      <option value="Inspection">Inspection</option>
    </select>
  </div>

  {/* Priority */}
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      Priority *
    </label>
    <select
      value={formData.priority}
      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select priority</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
      <option value="Critical">Critical</option>
    </select>
  </div>
</div>

{/* Work Location */}
<div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
    Work Location / Site Area *
  </label>
  <input
    type="text"
    value={formData.workLocation}
    onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
    placeholder="e.g., Area A-17 / Platform B / Tank Zone"
    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</div>

{/* Safety Permit */}
<div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
    Safety Permit Required *
  </label>
  <select
    value={formData.safetyPermit}
    onChange={(e) => setFormData({ ...formData, safetyPermit: e.target.value })}
    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Select permit requirement</option>
    <option value="None">None</option>
    <option value="Hot Work Permit">Hot Work Permit</option>
    <option value="Confined Space Permit">Confined Space Permit</option>
    <option value="Electrical Isolation Permit">Electrical Isolation Permit</option>
    <option value="Working at Height Permit">Working at Height Permit</option>
  </select>
</div>


          {/* Work Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Work Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed description of the work to be performed..."
              rows={6}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-900 dark:text-white"
              required
            />
          </div>

        {/* Risk & Safety */}
<div className="space-y-4">

  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
    <AlertTriangle className="w-5 h-5 text-amber-600" />
    Risk & Safety
  </h3>

  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
      Risk Level *
    </label>

    <div className="grid grid-cols-3 gap-3">

      {/* LOW */}
      <button
        type="button"
        onClick={() => handleChange('riskLevel', 'low')}
        className={`py-3 px-4 rounded-xl border-2 transition-all ${
          formData.riskLevel === 'low'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
        }`}
      >
        <div className="text-sm font-medium">Low Risk</div>
        <div className="text-xs mt-1">Standard procedures</div>
      </button>

      {/* MEDIUM */}
      <button
        type="button"
        onClick={() => handleChange('riskLevel', 'medium')}
        className={`py-3 px-4 rounded-xl border-2 transition-all ${
          formData.riskLevel === 'medium'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
        }`}
      >
        <div className="text-sm font-medium">Medium Risk</div>
        <div className="text-xs mt-1">Enhanced safety</div>
      </button>

      {/* HIGH */}
      <button
        type="button"
        onClick={() => handleChange('riskLevel', 'high')}
        className={`py-3 px-4 rounded-xl border-2 transition-all ${
          formData.riskLevel === 'high'
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
        }`}
      >
        <div className="text-sm font-medium">High Risk</div>
        <div className="text-xs mt-1">Special permits</div>
      </button>

    </div>
  </div>

  {/* SAFETY REQUIREMENTS */}
  <div>
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      Safety Requirements *
    </label>

    <textarea
      value={formData.safetyRequirements}
      onChange={(e) =>
        handleChange('safetyRequirements', e.target.value)
      }
      placeholder="List all safety requirements, PPE, permits, and precautions..."
      rows={4}
      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

</div>

          {/* Assigned Reviewer */}
          <div>
            <label htmlFor="reviewer" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Reviewer *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                id="reviewer"
                value={formData.assignedReviewer}
                onChange={(e) => setFormData({ ...formData, assignedReviewer: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-slate-900 dark:text-white"
                required
              >
                <option value="">Select a reviewer...</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>
  {reviewer.full_name} - {reviewer.email}
</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Upload Documents */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
         <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Supporting Documents</h3>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-all">
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
                  <p className="font-medium text-slate-900 dark:text-white mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
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
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white">{file}</span>
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
            className="px-6 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50  dark:hover:bg-slate-800 transition-all font-medium"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50  dark:hover:bg-slate-800 hover:scale-[1.02] transition-all font-medium"
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