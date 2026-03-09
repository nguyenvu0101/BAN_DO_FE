const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      {/* Brand */}
      <div className="footer-col">
        <div className="footer-brand-name">
          Mua Hàng <span>Giá Tốt</span>
        </div>
        <p className="footer-brand-desc">
          Nơi mua sắm trực tuyến đa dạng sản phẩm, chất lượng cao, giao hàng
          nhanh chóng toàn quốc.
        </p>
        <div className="footer-social">
          <button className="footer-social-btn" title="Facebook">
            f
          </button>
          <button className="footer-social-btn" title="Instagram">
            in
          </button>
          <button className="footer-social-btn" title="Youtube">
            yt
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="footer-col">
        <div className="footer-col-title">Khám phá</div>
        <ul>
          <li>
            <a href="/">Trang chủ</a>
          </li>
          <li>
            <a href="/shop">Sản phẩm</a>
          </li>
          <li>
            <a href="/orders">Đơn hàng</a>
          </li>
          <li>
            <a href="/profile">Tài khoản</a>
          </li>
        </ul>
      </div>

      {/* Policy */}
      <div className="footer-col">
        <div className="footer-col-title">Chính sách</div>
        <ul>
          <li>
            <a href="#">Chính sách bảo mật</a>
          </li>
          <li>
            <a href="#">Điều khoản dịch vụ</a>
          </li>
          <li>
            <a href="#">Chính sách hoàn trả</a>
          </li>
          <li>
            <a href="#">Hướng dẫn mua hàng</a>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div className="footer-col">
        <div className="footer-col-title">Liên hệ</div>
        <div className="footer-contact-item">
          <div className="footer-contact-icon">📧</div>
          <div className="footer-contact-text">
            <strong>Email</strong>
            shoponline@gmail.com
          </div>
        </div>
        <div className="footer-contact-item">
          <div className="footer-contact-icon">📞</div>
          <div className="footer-contact-text">
            <strong>Hotline</strong>
            0123 456 789
          </div>
        </div>
        <div className="footer-contact-item">
          <div className="footer-contact-icon">📍</div>
          <div className="footer-contact-text">
            <strong>Địa chỉ</strong>
            123 Phố Mua Sắm, Hà Nội
          </div>
        </div>
      </div>
    </div>

    <hr className="footer-divider" />

    <div className="footer-bottom">
      <span>
        © 2026 <strong style={{ color: "#ee4d2d" }}>MuaHàngGiáTốt</strong>. All
        rights reserved.
      </span>
      <div className="footer-bottom-links">
        <a href="#">Bảo mật</a>
        <a href="#">Cookie</a>
        <a href="#">Hỗ trợ</a>
      </div>
    </div>
  </footer>
);

export default Footer;
