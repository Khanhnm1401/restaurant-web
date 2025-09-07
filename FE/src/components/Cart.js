"use client"

import { useState } from "react"
import { paymentService } from "../api/services"

function Cart({ cart, removeFromCart, onClearCart, decreaseQuantity, increaseQuantity }) {
  const [showModal, setShowModal] = useState(false)
  const [address, setAddress] = useState("")
  const [voucher, setVoucher] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const openModal = () => setShowModal(true)
  const closeModal = () => {
    setShowModal(false)
    setShowQR(false)
    setOrderId(null)
  }

  const handleConfirm = async () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng!")
      return
    }

    setLoading(true)
    try {
      const items = cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))
      const totalAmount = total
      const res = await paymentService.createOrder({
        items,
        totalAmount,
        paymentMethod,
        voucher,
        address,
      })

      if (paymentMethod === "bank") {
        const newOrderId = res.data.orderId || Date.now().toString().slice(-6)
        setOrderId(newOrderId)
        setShowQR(true)
        if (onClearCart) onClearCart()
      } else {
        alert("Đặt hàng thành công!")
        closeModal()
        if (onClearCart) onClearCart()
      }
    } catch (err) {
      alert("Thanh toán thất bại! " + (err.response?.data?.error || err.message))
      closeModal()
    }
    setLoading(false)
  }

  const handleBankTransferDone = () => {
    alert(
      "🎉 Cảm ơn bạn đã chuyển khoản!\n\n✅ Đơn hàng sẽ được xác nhận sau khi admin kiểm tra giao dịch.\n📞 Chúng tôi sẽ liên hệ với bạn trong vòng 15-30 phút.\n\n💝 Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!",
    )
    closeModal()
  }

  return (
    <div id="cart-content">
      <div className="cart-section">
        <h2 className="cart-heading">Giỏ Hàng</h2>
        {cart.length === 0 ? (
          <p className="cart-empty">Giỏ hàng trống</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <span className="cart-item-name">{item.name}</span>
                  <div className="cart-item-details">
                    <div className="cart-item-qty-group">
                      <button
                        className="cart-qty-btn"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button className="cart-qty-btn" onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>
                    <span className="cart-item-price">{(item.price * item.quantity).toLocaleString()} VNĐ</span>
                    <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <h3>Tổng cộng: {total.toLocaleString()} VNĐ</h3>
              <button className="cart-checkout-btn" onClick={openModal}>
                Thanh Toán
              </button>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className={`modal ${showQR ? "qr-modal" : ""}`}>
            {!showQR ? (
              <>
                <h2 className="modal-title">Xác nhận thanh toán</h2>
                <ul className="modal-list">
                  {cart.map((item) => (
                    <li key={item.id} className="modal-list-item">
                      {item.name} (x{item.quantity}) -{" "}
                      <span className="modal-item-price">{(item.price * item.quantity).toLocaleString()} VNĐ</span>
                    </li>
                  ))}
                </ul>
                <div className="modal-total">
                  <strong>Tổng cộng: {total.toLocaleString()} VNĐ</strong>
                </div>
                <div className="modal-field">
                  <label>Địa chỉ giao hàng: </label>
                  <input
                    className="modal-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ nhận hàng"
                    required
                  />
                </div>
                <div className="modal-field">
                  <label>Voucher: </label>
                  <input
                    className="modal-input"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Nhập mã giảm giá (tùy chọn)"
                  />
                </div>
                <div className="modal-field">
                  <label>Phương thức thanh toán: </label>
                  <select
                    className="modal-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Tiền mặt khi nhận hàng</option>
                    <option value="bank">Chuyển khoản ngân hàng</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button className="modal-btn primary" onClick={handleConfirm} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
                  </button>
                  <button className="modal-btn" onClick={closeModal} disabled={loading}>
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title">🏦 Chuyển khoản ngân hàng</h2>
                <div className="qr-image-container">
                  <img
                    src="/images/qr-bank.jpg"
                    alt="QR chuyển khoản"
                    onError={(e) => {
                      e.target.src = "/images/qr-bank.png"
                      e.target.onerror = null
                    }}
                  />
                </div>
                <div className="bank-info">
                  <div>
                    <b>👤 Tên tài khoản:</b> NGUYEN MINH KHANH
                  </div>
                  <div>
                    <b>🏦 Ngân hàng:</b> [Tên ngân hàng của bạn]
                  </div>
                  <div>
                    <b>💳 Số tài khoản:</b> [Số tài khoản của bạn]
                  </div>
                  <div>
                    <b>📱 Số điện thoại:</b> 0396442532
                  </div>
                  {/* <div>
                    <b>💰 Số tiền:</b>{" "}
                    <span style={{ color: "#dc3545", fontWeight: "bold" }}>{total.toLocaleString()} VNĐ</span>
                  </div> */}
                  <div>
                    <b>📝 Nội dung chuyển khoản:</b>{" "}
                    <span style={{ color: "#007bff", fontWeight: "bold" }}>DH{orderId}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: "#6c757d", fontStyle: "italic", marginTop: "8px" }}>
                    ⚠️ Vui lòng ghi đúng nội dung chuyển khoản để admin xác nhận nhanh chóng
                  </div>
                </div>
                <div className="qr-instructions">
                  📱 <strong>Hướng dẫn:</strong> Mở app ngân hàng → Quét QR code → Kiểm tra thông tin → Chuyển khoản
                </div>
                <div className="modal-actions">
                  <button className="modal-btn primary" onClick={handleBankTransferDone}>
                    ✅ Tôi đã chuyển khoản
                  </button>
                  <button className="modal-btn" onClick={closeModal}>
                    ❌ Hủy
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
