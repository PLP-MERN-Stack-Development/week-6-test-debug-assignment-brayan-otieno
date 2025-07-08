import React from 'react';
import BugItem from './BugItem';

const BugList = ({ bugs, onUpdate, onDelete }) => {
  return (
    <div className="bug-list">
      <h3 className="mb-4">Bug List</h3>
      {bugs.length === 0 ? (
        <p className="text-muted">No bugs found</p>
      ) : (
        bugs.map(bug => (
          <BugItem
            key={bug._id}
            bug={bug}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default BugList;
