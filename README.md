Here’s a **complete README draft** for your project including **Objective, Setup Steps, and Challenges/Assumptions** sections:

---

# FileUpload Project

## **Objective**

The goal of this project is to build a **full-stack file upload application** with:

* **Frontend:** React.js hosted on **Netlify**
* **Backend:** Node.js + Express hosted on **Render**
* **Storage:** AWS S3 for uploaded files
* **Features:**

  * Upload files up to 10MB
  * Store files in S3 with metadata (original name, upload time, field name)
  * Return file URL and metadata to frontend
  * Simple and secure CORS handling

This project demonstrates deploying a **frontend and backend separately** using modern cloud hosting platforms.

---

## **Setup Steps**

### **1. Clone Repository**

```bash
git clone https://github.com/<your-username>/fileUpload.git
cd fileUpload
```

---

### **2. Backend Setup (Render)**

1. Navigate to `server/`:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` with the following variables:

```
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-s3-bucket-name
FRONTEND_URL=https://your-netlify-site.netlify.app   # optional
PORT=5000  # optional, Render overrides this
```

4. Test locally:

```bash
node server.js
```

5. Deploy to **Render**:

* **Root Directory:** `server`
* **Build Command:** `npm install`
* **Start Command:** `node server.js`
* Add environment variables in Render dashboard.

---

### **3. Frontend Setup (Netlify)**

1. Navigate to `frontend/`:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` with:

```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

4. Test locally:

```bash
npm start
```

5. Deploy to **Netlify**:

* **Base Directory:** `frontend`
* **Build Command:** `npm run build`
* **Publish Directory:** `frontend/build`
* Environment variable `REACT_APP_BACKEND_URL` must be set on Netlify.

---

### **4. Test Flow**

* Open your Netlify frontend URL.
* Select a file and click **Upload**.
* The file should be uploaded to S3 via the Render backend.
* Check console or UI for file URL and metadata.

---

## **Challenges / Assumptions Made**

* **CORS:** Allowed all origins for simplicity; in production, should restrict to frontend domain.
* **Environment Variables:** Required for AWS credentials; `.env` files are not uploaded to Render/Netlify.
* **File Size Limit:** Max 10MB per file; adjustable in backend multer settings.
* **Serverless Consideration:** Frontend is serverless-friendly; backend runs on Render as a traditional Node service.
* **Security:** AWS credentials should never be committed to GitHub.
* **Deployment:** Assumes frontend is separate from backend; API calls use Render URL.

---

## **Tech Stack**

* **Frontend:** React.js
* **Backend:** Node.js, Express, Multer, AWS SDK v3
* **Storage:** AWS S3
* **Hosting:** Netlify (frontend), Render (backend)

---

This README provides clear **objective, setup, and deployment instructions**, along with **assumptions and limitations** for future reference.

---

