import React, { useEffect, useState, useContext } from "react";
import { Card, Row, Col, Empty, message, Popconfirm, Button, Space } from "antd";
import { EnvironmentOutlined, ThunderboltOutlined, DeleteOutlined } from "@ant-design/icons";
import { callFetchSavedJobs, callDeleteSavedJobBySavedId } from "../../services/api.service";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/auth.context";

const currency = (n) => (n + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";

export default function SavedJobsPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const load = async () => {
    try {
      const res = await callFetchSavedJobs();
      setItems(res?.data || []);
    } catch {
      message.error("Không tải được danh sách đã lưu");
    }
  };

  useEffect(() => { load(); }, []);

  if (!user?.id) {
    return <Empty description="Vui lòng đăng nhập để xem công việc đã lưu" />;
  }

  return (
    <div className="container" style={{ marginTop: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Công việc đã lưu</h2>
      {items.length === 0 ? (
        <Empty description="Chưa có công việc nào" />
      ) : (
        <Row gutter={[16, 16]}>
          {items.map((it) => (
            <Col xs={24} sm={12} md={8} key={it.id}>
              <Card
                hoverable
                onClick={() => navigate(`/job/${it.jobId}`)}
                cover={
                  <div style={{ height: 120, display: "grid", placeItems: "center", background: "#f6f8fb" }}>
                    <img
                      alt={it.companyName}
                      src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${it.companyLogo}`}
                      style={{ maxWidth: 120, maxHeight: 80, objectFit: "contain" }}
                    />
                  </div>
                }
                actions={[
                  <Popconfirm
                    title="Bỏ lưu công việc?"
                    onConfirm={async (e) => {
                      e?.stopPropagation?.();
                      await callDeleteSavedJobBySavedId(it.id);
                      message.success("Đã bỏ lưu");
                      load();
                    }}
                    onCancel={(e) => e?.stopPropagation?.()}
                  >
                    <DeleteOutlined key="delete" onClick={(e) => e.stopPropagation()} />
                  </Popconfirm>,
                ]}
              >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <div style={{ fontWeight: 600 }}>{it.jobName}</div>
                  <div style={{ color: "#4b5563" }}>{it.companyName}</div>
                  <div style={{ display: "flex", gap: 12, color: "#4b5563" }}>
                    <span><EnvironmentOutlined /> {it.location || "Toàn quốc"}</span>
                    <span><ThunderboltOutlined style={{ color: "orange" }} /> {currency(it.salary || 0)}</span>
                  </div>
                  {it.level && <span style={{ color: "#1677ff" }}>{it.level}</span>}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
