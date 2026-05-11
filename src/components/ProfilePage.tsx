import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Edit,
  Save,
  Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

export function ProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activityStats, setActivityStats] = useState({
  totalCreated: 0,
  approved: 0,
  successRate: '0%',
});
const [imageData, setImageData] = useState({
  avatarUrl: '',
  coverUrl: '',
});

useEffect(() => {
  async function loadProfile() {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      console.error('Auth error:', authError);
      navigate('/');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return;
    }

    setCurrentUser(profile);

    setImageData({
       avatarUrl: profile.avatar_url || '',
       coverUrl: profile.cover_url || '',
    });

    const { data: workpackData, error: workpackError } = await supabase
  .from('workpacks')
  .select('*')
  .eq('created_by', authData.user.id);

if (workpackError) {
  console.error('Workpack stats error:', workpackError.message);
} else {
  const totalCreated = workpackData?.length || 0;
  const approved = workpackData?.filter((w) => w.status === 'approved').length || 0;
  const successRate =
    totalCreated > 0 ? `${Math.round((approved / totalCreated) * 100)}%` : '0%';

  setActivityStats({
    totalCreated,
    approved,
    successRate,
  });
}

    setProfileData({
      fullName: profile.full_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      department: profile.department || '',
      joinDate: profile.created_at
        ? new Date(profile.created_at).toLocaleDateString()
        : '',
      bio: profile.bio || '',
    });

    setLoading(false);
  }

  loadProfile();
}, [navigate]);
  
const [profileData, setProfileData] = useState({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  department: '',
  joinDate: '',
  bio: '',
});

const uploadImage = async (
  event: React.ChangeEvent<HTMLInputElement>,
  type: 'avatar' | 'cover'
) => {
  const file = event.target.files?.[0];

  if (!file || !currentUser) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${currentUser.id}-${type}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    showToast(uploadError.message, 'error');
    return;
  }

  const { data } = supabase.storage
    .from('profile-images')
    .getPublicUrl(fileName);

  const imageUrl = data.publicUrl;

  setImageData((prev) => ({
    ...prev,
    avatarUrl: type === 'avatar' ? imageUrl : prev.avatarUrl,
    coverUrl: type === 'cover' ? imageUrl : prev.coverUrl,
  }));

  showToast('Image selected. Click Save Changes to confirm.', 'success');
};

const removeAvatar = () => {
  setImageData((prev) => ({
    ...prev,
    avatarUrl: '',
  }));
};

const removeCover = () => {
  setImageData((prev) => ({
    ...prev,
    coverUrl: '',
  }));
};

const handleSave = async () => {
  if (!currentUser) return;

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      department: profileData.department,
      bio: profileData.bio,
      avatar_url: imageData.avatarUrl || null,
      cover_url: imageData.coverUrl || null,
    })
    .eq('id', currentUser.id);

  if (error) {
    showToast(error.message, 'error');
    return;
  }

  setCurrentUser({
    ...currentUser,
    full_name: profileData.fullName,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    department: profileData.department,
    bio: profileData.bio,
    avatar_url: imageData.avatarUrl || null,
    cover_url: imageData.coverUrl || null,
  });

  setIsEditing(false);
  showToast('Profile updated successfully!', 'success');
};

  if (loading || !currentUser) return null;

  return (
    <div className="space-y-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
  setProfileData({
    fullName: currentUser.full_name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    location: currentUser.location || '',
    department: currentUser.department || '',
    joinDate: currentUser.created_at
      ? new Date(currentUser.created_at).toLocaleDateString()
      : '',
    bio: currentUser.bio || '',
  });

  setImageData({
    avatarUrl: currentUser.avatar_url || '',
    coverUrl: currentUser.cover_url || '',
  });

  setIsEditing(false);
}}
              className="px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        {/* Cover Photo */}
<div
  className="h-32 relative bg-cover bg-center"
  style={{
    backgroundImage: imageData.coverUrl
  ? `url(${imageData.coverUrl})`
  : 'linear-gradient(to right, #2563eb, #9333ea)',
  }}
>
{isEditing && (
  <div className="absolute top-4 right-4 flex gap-2">
    <label className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all cursor-pointer">
      <Camera className="w-4 h-4 text-white" />
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => uploadImage(e, 'cover')}
      />
    </label>

    {imageData.cover_url && (
      <button
        type="button"
        onClick={removeCover}
        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg shadow-lg"
      >
        Remove
      </button>
    )}
  </div>
)}
</div>
        {/* Profile Info */}
        <div className="px-8 pb-8">
          {/* Avatar */}
         <div className="relative -mt-16 mb-6 w-32">
  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
{imageData.avatarUrl ? (
  <img
    src={imageData.avatarUrl}
    alt="Profile"
    className="w-full h-full object-cover"
  />
) : (
      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-white font-semibold text-4xl">
          {profileData.fullName
            ? profileData.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            : 'U'}
        </span>
      </div>
    )}
  </div>

{isEditing && (
  <div className="absolute bottom-2 right-2 flex gap-2">
    <label className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-all cursor-pointer">
      <Camera className="w-4 h-4 text-white" />
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => uploadImage(e, 'avatar')}
      />
    </label>

    {imageData.avatarUrl && (
      <button
        type="button"
        onClick={removeAvatar}
        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg shadow-lg"
      >
        Remove
      </button>
    )}
  </div>
)}
</div>

          {/* Role Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full capitalize">
              {currentUser.role}
            </span>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900 dark:text-white font-medium">{profileData.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900 dark:text-white font-medium">{profileData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900 dark:text-white font-medium">{profileData.phone}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900 dark:text-white font-medium">{profileData.location}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Briefcase className="w-4 h-4" />
                Department
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-slate-900 dark:text-white font-medium">{profileData.department}</p>
              )}
            </div>

            {/* Join Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </label>
              <p className="text-slate-900 dark:text-white font-medium">{profileData.joinDate}</p>
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <p className="text-slate-600 dark:text-slate-300">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-semibold text-blue-600 mb-2">{activityStats.totalCreated}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Workpacks Created</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-semibold text-emerald-600 mb-2">{activityStats.approved}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Approved Submissions</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all">
          <div className="text-3xl font-semibold text-purple-600 mb-2">{activityStats.successRate}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Success Rate</div>
        </div>
      </div>
    </div>
  );
}
