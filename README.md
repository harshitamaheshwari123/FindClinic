🏥 Find Clinic - Nearby Hospital Locator

Find Clinic is a full-stack web application that helps users locate nearby **hospitals and clinics within a 5 km radius** based on their chosen location. It uses **React** on the frontend, **Express.js** on the backend, and integrates **OpenStreetMap** with **Leaflet** and the **Overpass API** for geographic healthcare facility data.
## 🌐 Live Demo

(https://findclinic.onrender.com)

## 🔧 Tech Stack

### Frontend
- React (Vite)
- React Leaflet (Map rendering)
- Axios (API calls)
- Tailwind CSS (optional styling)

### Backend
- Node.js + Express.js
- OpenStreetMap Overpass API
- CORS, dotenv (middleware/config)

---

## 🗺️ Features

- Display nearby hospitals/clinics within 5 km radius
- Interactive, zoomable map via Leaflet + OpenStreetMap
- Dynamic markers with names and location popups
- User-chosen location or coordinates-based search
- REST API architecture (frontend + backend separation)

---

## 🗂️ Folder Structure


FindClinic/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── index.html
│
├── server/                 # Express Backend
│   ├── routes/nearby.js
│   ├── server.js
│   └── .env
│
└── README.md

## 🚀 Getting Started

### 1. Clone the Repository

bash
git clone https://github.com/harshitamaheshwari123/FindClinic.git
cd FindClinic

### 2. Setup Backend
bash
cd server
npm install
npm start

The backend runs on `http://localhost:5000`.

### 3. Setup Frontend
bash
cd ../client
npm install
npm run dev

The frontend runs on `http://localhost:5173`.

## 🔗 API Endpoint

### `GET /api/nearby?lat=<latitude>&lng=<longitude>`

Returns hospitals and clinics around the given location within 5 km.

#### Example:

http
GET http://localhost:5000/api/nearby?lat=28.6139&lng=77.2090


## 🧠 Overpass Query Used (Backend)

text
[out:json][timeout:25];
(
  node["amenity"="hospital"](around:5000, LAT, LNG);
  node["amenity"="clinic"](around:5000, LAT, LNG);
);
out body;
>;
out skel qt;

## 🧪 Example Screenshot
![Screenshot 2025-05-11 234846](https://github.com/user-attachments/assets/1bb34a99-b036-41ed-a69f-023597161a47)
![Screenshot 2025-05-11 234922](https://github.com/user-attachments/assets/586a9059-7206-481b-83dd-450d0da34032)
![Screenshot 2025-05-11 234935](https://github.com/user-attachments/assets/4800fafc-72cc-46bb-a931-884d90dbfbc5)

## 🔒 Environment Variables

Create a `.env` file inside `server/` with the following:
env
PORT=5000

## 🏁 Future Enhancements
Location auto-detection (GPS)
Search by city or pincode
Show distance from user
Add more categories (pharmacies, labs, etc.)
Hospital detail view (ratings, timings, etc.)

## 🙋‍♀️ Author

**Harshita Maheshwari**
GitHub: [@harshitamaheshwari123](https://github.com/harshitamaheshwari123)

## 💼 Use Cases

* Full-Stack Developer Portfolio Project
* Open-source HealthTech tools
* NGO & Government hospital mapping tools
* Interview-ready showcase project
