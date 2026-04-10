export default function Todo({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div
      className={`alert alert-${type} position-fixed top-0 end-0 m-4 shadow fade show`}
      style={{ zIndex: 9999, minWidth: 220 }}
      role="alert"
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
}
