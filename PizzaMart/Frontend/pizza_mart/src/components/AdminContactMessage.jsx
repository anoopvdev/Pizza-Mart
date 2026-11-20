import React, { useEffect, useState } from "react";
import axios from "axios";
import adminApi from "../admin/adminApi";
import api from "../axios";


const AdminContactEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminAccess");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "contact-message/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries(response.data.data || []);
    } catch (err) {
      console.log("ENQUIRY ERROR:", err.response?.data);
      setError(
        err.response?.data?.detail || "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const viewMessage = async (enquiry) => {
    setSelectedEnquiry(enquiry);

    if (!enquiry.is_read) {
      try {
        await api.patch(
          `contact-message/${enquiry.id}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === enquiry.id
              ? { ...item, is_read: true }
              : item
          )
        );

        setSelectedEnquiry({
          ...enquiry,
          is_read: true,
        });
      } catch (err) {
        console.log("MARK READ ERROR:", err.response?.data);
      }
    }
  };
   const deleteMessage = async (message) =>{
    const confirmed = window.confirm(`Are you sure you want to delete `);
        if(!confirmed) return;

        try{
            await adminApi.delete(`contact-message/${message.id}/`);
            setEnquiries((old)=> old.filter((item) => item.id !== message.id))
        }catch(error){
            setError(error.response?.data?.detail || "Unable to delete category. It may be linked to existing pizzas.")
        }
   } 
  const unreadCount = enquiries.filter(
    (item) => !item.is_read
  ).length;

   if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" />
        <p className="text-muted mt-3">Loading Enquiries...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Contact Enquiries</h3>
          <p className="text-muted">
            View messages submitted by customers.
          </p>
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={fetchEnquiries}
        >
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Total Enquiries</h6>
            <h3>{enquiries.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Unread Messages</h6>
            <h3 className="text-danger">{unreadCount}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6>Read Messages</h6>
            <h3 className="text-success">
              {enquiries.length - unreadCount}
            </h3>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-white">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No enquiries found.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.subject}</td>

                      <td>
                        {new Date(item.created_at).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            item.is_read
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {item.is_read ? "Read" : "New"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => viewMessage(item)}
                        >
                          View Message
                        </button>


                         <button
                            className="btn btn-sm btn-outline-danger m-2"
                            onClick={() => deleteMessage(item)}
                            title="Delete"
                          >
                            <i className="bi bi-trash" />
                          </button>
                        
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {selectedEnquiry && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Customer Enquiry
                </h5>

                <button
                  className="btn-close"
                  onClick={() => setSelectedEnquiry(null)}
                />
              </div>

              <div className="modal-body">
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedEnquiry.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {selectedEnquiry.email}
                </p>

                <p>
                  <strong>Subject:</strong>{" "}
                  {selectedEnquiry.subject}
                </p>

                <hr />

                <h6>Message:</h6>

                <div
                  className="p-3 bg-light rounded"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {selectedEnquiry.message}
                </div>

                <p className="text-muted mt-3 mb-0">
                  Submitted:{" "}
                  {new Date(
                    selectedEnquiry.created_at
                  ).toLocaleString()}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminContactEnquiries;