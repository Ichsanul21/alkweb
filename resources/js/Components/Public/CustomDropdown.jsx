import { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({ options, value, onChange, placeholder, className = '' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggle = () => setIsOpen(!isOpen);
    
    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div 
            className={`custom-dropdown ${className}`} 
            ref={dropdownRef} 
            tabIndex={0}
            style={{ position: 'relative', width: '100%', outline: 'none' }}
            onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.05)';
                e.currentTarget.querySelector('.dropdown-trigger').style.borderColor = 'var(--accent)';
            }}
            onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.querySelector('.dropdown-trigger').style.borderColor = 'var(--border-glass)';
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            }}
        >
            <div 
                onClick={toggle}
                className="dropdown-trigger"
                style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-glass)',
                    padding: '16px 0',
                    fontSize: 20,
                    color: value ? 'var(--text-primary)' : 'var(--text-secondary)',
                    outline: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 0.3s'
                }}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span style={{ 
                    fontSize: 12, 
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                    transition: 'transform 0.3s',
                    opacity: 0.5 
                }}>▼</span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: 'rgba(2, 12, 21, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '0 0 15px 15px',
                    zIndex: 1000,
                    marginTop: 1,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                    {options.map((option) => (
                        <div 
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="dropdown-item"
                            style={{
                                padding: '12px 20px',
                                fontSize: 16,
                                color: value === option.value ? 'var(--accent)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.05)';
                                e.target.style.color = 'var(--accent)';
                            }}
                            onMouseLeave={(e) => {
                                if (value !== option.value) {
                                    e.target.style.background = 'transparent';
                                    e.target.style.color = 'var(--text-primary)';
                                }
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
