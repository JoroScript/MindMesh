import {useContext, useEffect,useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NotesContext } from './NotesProvider';

const DeleteModal = ({ isOpen, onClose, onDelete }) => {
    const modalRef = useRef();
    const {darkMode} = useContext(NotesContext)
    const [isAnimating, setIsAnimating] = useState(false);

    // Close modal when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
          setIsAnimating(true);
        }
        else setIsAnimating(false);
      }, [isOpen]);
   
    if (!isOpen) return null;
  
    // Using createPortal to render the modal directly to document.body
    return createPortal(
      <div className="fixed inset-0 backdrop-blur-md bg-opacity-30 flex items-center justify-center z-50">
        <div 
          ref={modalRef}
          className={`transform transition-all duration-300 ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${darkMode ? 'bg-transparent shadow-white' : 'bg-transparent'} text-white border-2 rounded-lg shadow-lg font-black p-6 m-4 w-full md:w-1/2 max-w-lg`}
        >
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">Confirmation</h2>
            <p className="mb-6">Are You Sure You Want to Delete this Note?</p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={ async () => {
                  await onDelete();
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
};
export default DeleteModal