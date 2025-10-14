import {
  AliwangwangOutlined,
  BankOutlined,
  FileTextOutlined,
  HomeOutlined,
  LoginOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Input, Menu, notification } from "antd";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth.context";
import { logoutUserAPI } from "../../../services/api.service";
import ManageAccount from "../modal/manage.account";

const { Search } = Input;

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [current, setCurrent] = useState("home");
  const [keyword, setKeyword] = useState("");
  const [openMangeAccount, setOpenManageAccount] = useState(false);
  const navigate = useNavigate();

  const onClick = (e) => setCurrent(e.key);

  const handleLogout = async () => {
    try {
      const res = await logoutUserAPI();
      if (res && res.statusCode === 200) {
        localStorage.removeItem("access_token");
        setUser({ email: "", name: "", id: "" });
        notification.success({ message: "Đăng xuất thành công!" });
        navigate("/");
      } else {
        notification.error({ message: "Đăng xuất thất bại!" });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      notification.error({ message: "Có lỗi xảy ra khi đăng xuất!" });
    }
  };

  const items = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <NavLink to="/">Home</NavLink>,
    },
    {
      key: "company",
      icon: <BankOutlined />,
      label: <NavLink to="/company">Company</NavLink>,
    },
    {
      key: "job",
      icon: <FileTextOutlined />,
      label: <NavLink to="/job">Jobs</NavLink>,
    },
    ...(!user.id
      ? [
          {
            label: <Link to={"/login"}>Đăng nhập</Link>,
            key: "login",
            icon: <LoginOutlined />,
          },
        ]
      : [
          {
            label: `Welcome ${user.name}`,
            key: "setting",
            icon: <AliwangwangOutlined />,
            children: [
              {
                label: (
                  <label
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpenManageAccount(true)}
                  >
                    Quản lý tài khoản
                  </label>
                ),
              },
              {
                label: <NavLink to="/admin">Trang quản trị</NavLink>,
              },
              {
                label: <span onClick={handleLogout}>Đăng xuất</span>,
                key: "logout",
              },
            ],
          },
        ]),
  ];

  const onSearchCategory = (value) => {
    const v = value.trim();
    if (!v) return;
    navigate(`/job?category=${encodeURIComponent(v)}`);
    setKeyword("");
  };

  // Logo public qua Spring static mapping: /storage/**
  const logoUrl = `${import.meta.env.VITE_BACKEND_URL}/storage/logoweb.png`;

  return (
    <>
      <header
        style={{
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Top bar: Logo + Search + Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "8px 12px",
          }}
        >
          {/* Logo + brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              minWidth: 180,
            }}
          >
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={logoUrl}
                alt="JobHunter"
                style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                onError={(e) => {
                  // fallback nếu ảnh chưa serve được
                  e.currentTarget.style.display = "none";
                }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1890ff",
                  letterSpacing: 0.2,
                }}
              >
                JobHunter
              </span>
            </Link>
          </div>

          {/* Search danh mục công việc */}
          <div style={{ flex: "1 1 auto", minWidth: 240, maxWidth: 520 }}>
            <Search
              placeholder="Lọc theo danh mục công việc (ví dụ: IT, Sales, HR...)"
              allowClear
              enterButton={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={onSearchCategory}
            />
          </div>

          {/* Khoảng trống để menu không bị đẩy xuống trên màn hình hẹp */}
          <div style={{ width: 8 }} />
        </div>

        {/* Main menu */}
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          style={{ borderBottom: "none" }}
        />
      </header>

      <ManageAccount open={openMangeAccount} onClose={setOpenManageAccount} />
    </>
  );
};

export default Header;
