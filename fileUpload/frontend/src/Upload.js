import React, { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // reset result when new file is chosen
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setResult(data);
      } else {
        setResult({ error: data.error || "Upload failed" });
      }
    } catch (err) {
      setLoading(false);
      console.error("Upload error:", err);
      setResult({ error: err.message });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>📤 Upload File to S3</h2>
        <input type="file" onChange={handleFileChange} style={styles.input} />
        <br />
        <button onClick={handleUpload} style={styles.button} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {result && (
          <div style={styles.result}>
            {result.error ? (
              <p style={{ color: "red" }}>
                <strong>❌ Error:</strong> {result.error}
              </p>
            ) : (
              <>
                <p>
                  <strong>✅ File Uploaded Successfully!</strong>
                </p>
                <p>
                  <strong>URL:</strong>{" "}
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {result.url}
                  </a>
                </p>
                <p>
                  <strong>Type:</strong> {result.mimetype}
                </p>
                <p>
                  <strong>Size:</strong> {(result.size / 1024).toFixed(2)} KB
                </p>
                <p>
                  <strong>Key:</strong> {result.key}
                </p>
                <p>
                  <strong>Metadata:</strong>
                </p>
                <ul>
                  {result.metadata &&
                    Object.entries(result.metadata).map(([k, v]) => (
                      <li key={k}>
                        <strong>{k}:</strong> {v}
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#f4f7fb",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  box: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "380px",
  },
  title: {
    marginBottom: "15px",
    color: "#333",
  },
  input: {
    margin: "15px 0",
    padding: "10px",
    border: "2px dashed #aaa",
    borderRadius: "6px",
    background: "#fafafa",
    cursor: "pointer",
    width: "100%",
  },
  button: {
    background: "#4cafef",
    border: "none",
    padding: "12px 20px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
  },
  result: {
    marginTop: "20px",
    padding: "15px",
    background: "#eaf6ff",
    borderLeft: "4px solid #4cafef",
    borderRadius: "6px",
    textAlign: "left",
    fontSize: "14px",
  },
};

export default Upload;
