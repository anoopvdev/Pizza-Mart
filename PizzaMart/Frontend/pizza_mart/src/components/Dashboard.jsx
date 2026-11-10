
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";
import './/Dashboard.css'
import adminApi from "../admin/adminApi";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const emptyDashboard = {
  total_orders: 0,
  total_revenue: 0,
  total_customers: 0,
  pending_orders: 0,
  sales_overview: [],
  order_status: [],
  popular_pizzas: [],
  recent_orders: [],
  top_categories: [],
  website_activity: [],
};

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("7");

  const fetchDashboard = async () => {
    try {
      const response = await adminApi.get("dashboard/", {
        params: { days: period },
      });

      setDashboard({
        ...emptyDashboard,
        ...response.data,
      });

      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();

    const interval = setInterval(fetchDashboard, 15000);

    return () => clearInterval(interval);
  }, [period]);

  const stats = [
    {
      title: "Total Orders",
      value: dashboard.total_orders,
      icon: "bi-cart-check-fill",
      color: "danger",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboard.total_revenue),
      icon: "bi-currency-rupee",
      color: "success",
    },
    {
      title: "Total Customers",
      value: dashboard.total_customers,
      icon: "bi-people-fill",
      color: "primary",
    },
    {
      title: "Pending Orders",
      value: dashboard.pending_orders,
      icon: "bi-clock-fill",
      color: "warning",
    },
  ];

  // Sales graph: no sample sales are inserted.
  const salesLabels = dashboard.sales_overview.map((item) => item.date);
  const salesValues = dashboard.sales_overview.map(
    (item) => Number(item.sales || 0)
  );

  const salesChartData = {
    labels: salesLabels,
    datasets: [
      {
        label: "Sales",
        data: salesValues,
        borderColor: "#1683ff",
        backgroundColor: "rgba(22, 131, 255, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Sales: ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // Order status chart
  const statusLabels = dashboard.order_status.map((item) => item.status);
  const statusValues = dashboard.order_status.map(
    (item) => Number(item.count || 0)
  );

  const hasOrderStatus = statusValues.some((value) => value > 0);

  const statusChartData = {
    labels: hasOrderStatus ? statusLabels : ["No orders"],
    datasets: [
      {
        data: hasOrderStatus ? statusValues : [1],
        backgroundColor: hasOrderStatus
          ? ["#10b981", "#f59e0b", "#1683ff", "#8b5cf6", "#ff4d65", "#64748b"]
          : ["#e9edf3"],
        borderWidth: 0,
        hoverOffset: 5,
      },
    ],
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: { display: false },
    },
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" />
        <p className="text-muted mt-3">Loading PizzaMart dashboard...</p>
      </div>
    );
  }

  return (
    <>

    <div className="pizzamart-dashboard">
      
      
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Dashboard</h3>
          
          <p className="text-muted mb-0">
           <h2 className="fw-bold mb-1"> Welcome back, Admin!</h2> Here's what's happening with your pizza business.
          </p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select"
            style={{ width: "150px" }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>

          <button
            className="btn btn-outline-primary"
            onClick={fetchDashboard}
            title="Refresh dashboard"
          >
            <i className="bi bi-arrow-clockwise" />
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchDashboard}>
            Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="row g-3 mb-3">
        {stats.map((item) => (
          <div className="col-6 col-xl-3" key={item.title}>
            <div className="card border-0 shadow-sm h-100 dashboard-stat-card">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`dashboard-stat-icon bg-${item.color}`}>
                  <i className={`bi ${item.icon}`} />
                </div>

                <div className="min-w-0">
                  <p className="text-muted small mb-1">{item.title}</p>
                  <h3 className="fw-bold mb-0 dashboard-stat-value">
                    {item.value}
                  </h3>
                  <small className="text-muted">Based on actual orders</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SALES / ORDER STATUS / POPULAR PIZZAS */}
      <div className="row g-3 mb-3">

        {/* SALES OVERVIEW */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-bar-chart-line-fill me-2 text-primary" />
                  Sales Overview
                </h5>
                <span className="badge bg-light text-dark">
                  {period} Days
                </span>
              </div>

              <div className="dashboard-sales-chart">
                {salesValues.length > 0 ? (
                  <Line data={salesChartData} options={salesChartOptions} />
                ) : (
                  <div className="dashboard-empty-chart">
                    <i className="bi bi-graph-up fs-1 text-secondary" />
                    <h6 className="mt-2">No sales data yet</h6>
                    <p className="text-muted small mb-0">
                      Sales will appear here when customers place orders.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="col-12 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Status</h5>

              <div className="dashboard-donut">
                <Doughnut
                  data={statusChartData}
                  options={statusChartOptions}
                />

                <div className="dashboard-donut-center">
                  <strong>{dashboard.total_orders}</strong>
                  <small>Total Orders</small>
                </div>
              </div>

              <div className="mt-3">
                {hasOrderStatus ? (
                  dashboard.order_status.map((item, index) => (
                    <div
                      className="d-flex justify-content-between align-items-center small mb-2"
                      key={item.status}
                    >
                      <span>{item.status}</span>
                      <strong>{item.count}</strong>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small text-center mb-0">
                    No order status data yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* POPULAR PIZZAS */}
        <div className="col-12 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-fire text-danger me-2" />
                  Popular Pizzas
                </h5>
                <Link to="/admin/categorys" className="small text-decoration-none">
                  View All
                </Link>
              </div>

              {dashboard.popular_pizzas.length > 0 ? (
                dashboard.popular_pizzas.map((pizza) => (
                  <div className="dashboard-pizza-item" key={pizza.id}>
                    {pizza.image ? (
                      <img src={pizza.image} alt={pizza.name} />
                    ) : (
                      <div className="dashboard-pizza-placeholder">🍕</div>
                    )}

                    <div className="flex-grow-1 min-w-0">
                      <strong>{pizza.name}</strong>
                      <small>{pizza.orders} orders</small>
                    </div>

                    <strong>{formatCurrency(pizza.price)}</strong>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-small">
                  <span>🍕</span>
                  <p>No pizza orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS / QUICK ACTIONS / CATEGORIES */}
      <div className="row g-3 mb-3">

        {/* RECENT ORDERS */}
        <div className="col-12 col-xl-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-clipboard-data me-2" />
                  Recent Orders
                </h5>
                <Link to="/admin/orders" className="small text-decoration-none">
                  View All
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle dashboard-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboard.recent_orders.length > 0 ? (
                      dashboard.recent_orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer_name}</td>
                          <td>{order.items_count}</td>
                          <td>{formatCurrency(order.total_amount)}</td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <Link
                              to="/admin/orders"
                              className="btn btn-sm btn-outline-primary"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No orders have been placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-lightning-charge me-2" />
                Quick Actions
              </h5>

              <div className="row g-2">
                <div className="col-6">
                  <Link to="/admin/products" className="dashboard-quick-action action-red">
                    <i className="bi bi-plus-circle" />
                    <strong>Add Product</strong>
                  </Link>
                </div>

                <div className="col-6">
                  <Link to="/admin/orders" className="dashboard-quick-action action-green">
                    <i className="bi bi-cart-check" />
                    <strong>Manage Orders</strong>
                  </Link>
                </div>

                <div className="col-6">
                  <Link to="/admin/users" className="dashboard-quick-action action-blue">
                    <i className="bi bi-person" />
                    <strong>View Customers</strong>
                  </Link>
                </div>

                <div className="col-6">
                  <Link to="/admin/coupons" className="dashboard-quick-action action-purple">
                    <i className="bi bi-ticket-perforated" />
                    <strong>Create Coupon</strong>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOP CATEGORIES */}
        <div className="col-12 col-md-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Top Categories</h5>
                <Link to="/admin/categories" className="small text-decoration-none">
                  View All
                </Link>
              </div>

              {dashboard.top_categories.length > 0 ? (
                dashboard.top_categories.map((category) => (
                  <div className="dashboard-category-item" key={category.id}>
                    <div className="d-flex justify-content-between">
                      <strong>{category.name}</strong>
                      <small>{category.orders} orders</small>
                    </div>

                    <div className="progress mt-2" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${Math.min(category.percentage || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="dashboard-empty-small">
                  <i className="bi bi-grid fs-3 text-secondary" />
                  <p>No category orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SPECIAL OFFER / WEBSITE ACTIVITY */}
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="dashboard-offer">
            <div>
              <span className="text-warning fw-bold">
                <i className="bi bi-stars me-2" />
                SPECIAL OFFER
              </span>
              <h3 className="text-white fw-bold mt-2">
                Promote Your PizzaMart
              </h3>
              <p className="text-white-50 mb-3">
                Create a coupon or special offer to attract more customers.
              </p>
              <Link to="/admin/coupons" className="btn btn-danger">
                Manage Offers <i className="bi bi-arrow-right ms-2" />
              </Link>
            </div>
            <div className="dashboard-offer-icon">🍕</div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-activity me-2 text-success" />
                Website Activity
              </h6>

              {dashboard.website_activity.length > 0 ? (
                dashboard.website_activity.map((activity, index) => (
                  <div className="dashboard-activity" key={activity.id || index}>
                    <span className="activity-dot" />
                    <span className="flex-grow-1">{activity.message}</span>
                    <small className="text-muted">
                      {activity.time}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-muted small mb-0">
                  No recent website activity yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
    </>
  );
};

export default AdminDashboard;
