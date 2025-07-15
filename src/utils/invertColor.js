// utils/invertColor.js
const invertColor = (hex) => {
    if (!hex) return '#000';
  
    // Remove leading '#' if present
    hex = hex.replace('#', '');
  
    // Parse shorthand (e.g. #abc → #aabbcc)
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
  
    // Invert each component
    const r = (255 - parseInt(hex.substr(0, 2), 16)).toString(16).padStart(2, '0');
    const g = (255 - parseInt(hex.substr(2, 2), 16)).toString(16).padStart(2, '0');
    const b = (255 - parseInt(hex.substr(4, 2), 16)).toString(16).padStart(2, '0');
  
    return `#${r}${g}${b}`;
  };
  
  export default invertColor;
  