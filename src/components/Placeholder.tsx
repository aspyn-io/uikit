const Placeholder = ({ text = "Placeholder", className = "" }) => {
  return (
    <div
      className={`p-4 border border-dashed border-gray-400 text-gray-600 ${className}`}
    >
      {text}
    </div>
  );
};

export default Placeholder;
