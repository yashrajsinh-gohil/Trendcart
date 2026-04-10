
const OrderCard = ({ order }) => (
  <div className="card border-0 shadow-sm rounded-4 mb-3 overflow-hidden">
    <div className="card-header bg-light d-flex justify-content-between align-items-center py-3 px-4">
      <div>
        <small className="text-muted d-block fw-bold">ORDER PLACED</small>
        <span className="fw-medium">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "-"}</span>
      </div>
      <div>
        <small className="text-muted d-block fw-bold text-end">ORDER #</small>
        <span className="fw-medium">{order._id || order.id}</span>
      </div>
    </div>
    <div className="card-body p-4">
      <div className="row align-items-center">
        <div className="col-md-8">
          {order?.products?.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center mb-2">
              <img src={item.product?.image || item.image} alt={item.product?.name || item.name} className="rounded me-2" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
              <span className="small fw-bold">{item.product?.name || item.name} <span className="text-muted">x {item.quantity || item.qty}</span></span>
            </div>
          ))}
        </div>
        <div className="col-md-4 text-md-end border-start">
          <h4 className="fw-bold mb-1" style={{ color: "var(--accent)" }}>₹{order.totalAmount || order.total}</h4>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">{order.status || "pending"}</span>
        </div>
      </div>
    </div>
  </div>
);

export default OrderCard;