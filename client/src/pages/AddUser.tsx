import React, { useState, useEffect } from 'react';
import { addUser, getAllUsers, deleteUser, editUser } from '../services/api';
import { Navigate, useNavigate } from 'react-router-dom';


interface FormData {
  company_id: string;
  username: string;
  password?: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  profession: string;
}


interface User {
  _id: string;
  company_id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  profession: string;
}

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-content">
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button
            onClick={onCancel}
            className="confirm-modal-button confirm-modal-cancel-button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="confirm-modal-button confirm-modal-confirm-button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    company_id: '',
    username: '',
    password: '',
    fullname: '',
    email: '',
    phone: '',
    role: 'user',
    profession: '',
  });

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<FormData>>({
    company_id: '',
    username: '',
    fullname: '',
    email: '',
    phone: '',
    role: '',
    profession: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const roles = ["admin", "manager", "lead", "user"];

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const usernameToSend = formData.username.startsWith('@') ? formData.username : '@' + formData.username;

    try {
      const dataToSend = { ...formData, username: usernameToSend };
      await addUser(dataToSend);
      setSuccess('User successfully added!');
      setFormData({
        company_id: '',
        username: '',
        password: '',
        fullname: '',
        email: '',
        phone: '',
        role: 'user',
        profession: '',
      });
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError(err.message || 'An error occurred while adding user. Please check the information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setUserToDeleteId(userId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDeleteId) return;

    setShowDeleteConfirm(false);
    setDeletingUserId(userToDeleteId);
    setError(null);
    setSuccess(null);

    try {
      await deleteUser(userToDeleteId);
      setSuccess('User successfully deleted!');
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.message || 'An error occurred while deleting user. Please try again.');
    } finally {
      setDeletingUserId(null);
      setUserToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDeleteId(null);
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      company_id: user.company_id,
      username: user.username.startsWith('@') ? user.username.substring(1) : user.username,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profession: user.profession,
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    const usernameToSend = (editFormData.username || '').startsWith('@')
      ? (editFormData.username || '')
      : '@' + (editFormData.username || '');

    try {
      const dataToSend: Partial<FormData> = {
        company_id: editFormData.company_id || '',
        username: usernameToSend,
        fullname: editFormData.fullname || '',
        email: editFormData.email || '',
        phone: editFormData.phone || '',
        role: editFormData.role || '',
        profession: editFormData.profession || '',
      };

      if (editFormData.password !== undefined && editFormData.password !== '') {
        dataToSend.password = editFormData.password;
      }

      await editUser(editingUser._id, dataToSend);
      setSuccess('User successfully updated!');
      fetchUsers();
      handleCancelEdit();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'An error occurred while updating user. Please check the information.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({
      company_id: '',
      username: '',
      fullname: '',
      email: '',
      phone: '',
      role: '',
      profession: '',
    });
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const panel = e.currentTarget.closest('.form-section') as HTMLElement;
    if (panel) panel.style.display = 'none';
  };

  const showAup = () => {
    const panel = document.querySelector('.form-section') as HTMLElement;
    if (panel) panel.style.display = 'flex';
  };


  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div className="app-container">
      <div className="add-user-sidebar">
        <div className="left-area">
          <button className="aus-btn" id="go-back" onClick={() => navigate('/dashboard')}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>

        <div className="center-area">
          <button className="aus-btn">
            <i className="fa-solid fa-address-card"></i>&nbsp;Add Company
          </button>
          <button onClick={showAup} className="aus-btn">
            <i className="fa-solid fa-user-plus"></i>&nbsp;Add User
          </button>
        </div>

        <div className="right-area"></div> 
      </div>


      <div className="form-section">
        {error && <p className="message error-message">{error}</p>}
        {success && <p className="message success-message">{success}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <h2 className="panel-title">Add New User</h2>
          <button onClick={handleClose} className="close-form">×</button>
          <div className="form-group">
            <label htmlFor="company_id" className="form-label">Company ID:</label>
            <input
              id="company_id"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username:</label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullname" className="form-label">Full Name:</label>
            <input
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="select-field"
            >
              {roles.map(roleOption => (
                <option key={roleOption} value={roleOption}>
                  {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="profession" className="form-label">Profession:</label>
            <input
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>

      <div className="table-section">
        <h2 className="panel-title">Existing Users</h2>
        {error && <p className="message error-message">{error}</p>}
        {loadingUsers ? (
          <p className="loading-message">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="no-users-message">No users found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr className="table-header">
                  <th>Company ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>E-Mail</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Profession</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="table-row">
                    <td className="table-cell">{user.company_id}</td>
                    <td className="table-cell">{user.username}</td>
                    <td className="table-cell">{user.fullname}</td>
                    <td className="table-cell">{user.email}</td>
                    <td className="table-cell">{user.phone}</td>
                    <td className="table-cell">{user.role}</td>
                    <td className="table-cell">{user.profession}</td>
                    <td className="table-cell table-actions">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="btn btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDeleteUser(user._id)}
                        disabled={deletingUserId === user._id}
                        className="btn btn-delete"
                      >
                        {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content panel">
            <form onSubmit={handleUpdateUser} className="form-grid">
            <h2 className="modal-title panel-title">Edit User: {editingUser.fullname}</h2>
            {error && <p className="message error-message">{error}</p>}
              <div className="form-group">
                <label htmlFor="edit_company_id" className="form-label">Company ID:</label>
                <input
                  id="edit_company_id"
                  name="company_id"
                  value={editFormData.company_id || ''}
                  onChange={handleEditChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_username" className="form-label">Username:</label>
                <input
                  id="edit_username"
                  name="username"
                  value={editFormData.username || ''}
                  onChange={handleEditChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_fullname" className="form-label">Full Name:</label>
                <input
                  id="edit_fullname"
                  name="fullname"
                  value={editFormData.fullname || ''}
                  onChange={handleEditChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_email" className="form-label">Email:</label>
                <input
                  id="edit_email"
                  name="email"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={handleEditChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_phone" className="form-label">Phone:</label>
                <input
                  id="edit_phone"
                  name="phone"
                  value={editFormData.phone || ''}
                  onChange={handleEditChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit_role" className="form-label">Role:</label>
                <select
                  id="edit_role"
                  name="role"
                  value={editFormData.role || ''}
                  onChange={handleEditChange}
                  required
                  className="select-field"
                >
                  {roles.map(roleOption => (
                    <option key={roleOption} value={roleOption}>
                      {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit_profession" className="form-label">Profession:</label>
                <input
                  id="edit_profession"
                  name="profession"
                  value={editFormData.profession || ''}
                  onChange={handleEditChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-actions modal-actions">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn btn-primary"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDeleteUser}
          onCancel={cancelDelete}
          confirmText="Delete"
        />
      )}
    </div>
  );
};

export default App;

