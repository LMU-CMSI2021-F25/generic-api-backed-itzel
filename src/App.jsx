import { useState, useEffect } from "react";
import "./App.css";
import remoteJobs from "./remotejobs.jpg";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("https://jobicy.com/api/v2/remote-jobs");
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      } catch (err) {
        setError("Error fetching jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);


  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = jobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().includes(term) ||
        job.companyName.toLowerCase().includes(term) ||
        job.jobIndustry?.toLowerCase().includes(term)
    );
    setFilteredJobs(filtered);
  };

  if (loading) return <p className="loading">Loading job listings</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="App">
      <img
  src={remoteJobs} // Must match the imported variable name (globeImage)
  alt="A globe representing remote work"
/>
      <h1>Remote Job Search</h1>
      <p>Search for remote jobs from around the world!</p>

      <input
        type="text"
        placeholder="Search jobs by title, company, or industry..."
        value={searchTerm}
        onChange={handleSearch}
        className="search"
      />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Industry</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.jobTitle}</td>
                  <td>{job.companyName}</td>
                  <td>{job.jobIndustry || "None"}</td>
                  <td>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Job
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No results found for “{searchTerm}”.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}