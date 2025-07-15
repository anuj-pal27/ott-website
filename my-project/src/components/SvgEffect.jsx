import React from 'react'

const SvgEffect = React.memo(function SvgEffect() {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Static gradient background instead of animated SVG */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-blue-900/20 to-secondary/20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"></div>
      
      {/* Simple static wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
    </div>
  )
});

export default SvgEffect;