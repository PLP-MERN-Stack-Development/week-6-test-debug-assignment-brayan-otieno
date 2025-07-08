import React from 'react';
import axios from 'axios';

const BugItem = ({ bug, onUpdate, onDelete }) => {
  const handleUpdate = async (newStatus) => {
    try {
      const response = await axios.put(`/api/bugs/${bug._id}`, {
        status: newStatus
      });
      onUpdate(response.data);
    } catch (error) {
      console.error('Error updating bug:', error);
      alert('Failed to update bug. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/bugs/${bug._id}`);
      onDelete(bug._id);
    } catch (error) {
      console.error('Error deleting bug:', error);
      alert('Failed to delete bug. Please try again.');
    }
  };

  const getPriorityColor = () => {
    switch (bug.priority) {
      case 'high':
        return 'bg-danger';
      case 'medium':
        return 'bg-warning';
      case 'low':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title">{bug.title}</h5>
            <p className="card-text mb-2">{bug.description}</p>
            <div className="d-flex gap-2 mb-2">
              <span className={`badge ${getPriorityColor()}`}>Priority: {bug.priority}</span>
              <span className="badge bg-primary">Status: {bug.status}</span>
            </div>
            <small className="text-muted">
              Created: {new Date(bug.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => handleUpdate('in_progress')}
              className="btn btn-info btn-sm"
            >
              Start
            </button>
            <button
              onClick={() => handleUpdate('resolved')}
              className="btn btn-success btn-sm"
            >
              Resolve
            </button>
            <button
              onClick={() => handleUpdate('closed')}
              className="btn btn-secondary btn-sm"
            >
              Close
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugItem;
