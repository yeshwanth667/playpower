import React from 'react'
const Spinner = () => {
  return (
    // <span className="spinner" aria-label="Loading"></span>
    <div className='text-center'>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;