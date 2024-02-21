import React, { useState } from 'react';
import NavBar from '../components/NavBar';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [content, setContent] = useState('');
  const [summarizedContent, setSummarizedContent] = useState('');
  const [paraphrasedContent, setParaphrasedContent] = useState('');
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingSummarizedContent, setLoadingSummarizedContent] = useState(false);
  const [loadingParaphrasedContent, setLoadingParaphrasedContent] = useState(false);

  const handleSearch = async () => {
    try {
      setLoadingSections(true);
      const response = await fetch(`https://quantacus-submission.onrender.com/get_sections?main_heading=${searchQuery}`);
      const data = await response.json();
      setSections(data.sections);
      setLoadingSections(false);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSectionSelect = async (section) => {
    setSelectedSection(section);
    setLoadingContent(true);
    setLoadingSummarizedContent(true);
    setLoadingParaphrasedContent(true);

    try {
      const contentResponse = await fetch('https://quantacus-submission.onrender.com/get_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ main_heading: searchQuery, section_heading: section })
      });
      const contentData = await contentResponse.json();
      setContent(contentData.content);
      setLoadingContent(false);

      const summarizedResponse = await fetch('https://quantacus-submission.onrender.com/summarize_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ main_heading: searchQuery, section_heading: section })
      });
      const summarizedData = await summarizedResponse.json();
      const summarizedContentObj = JSON.parse(summarizedData.summarized_content);
      const summarizedText = summarizedContentObj.summary;
      setSummarizedContent(summarizedText);
      setLoadingSummarizedContent(false);

      const paraphrasedResponse = await fetch('https://quantacus-submission.onrender.com/paraphrase_content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ main_heading: searchQuery, section_heading: section })
      });
      const paraphrasedData = await paraphrasedResponse.json();
      const paraphrasedContentObj = JSON.parse(paraphrasedData.paraphrased_content);
      const paraphrasedText = paraphrasedContentObj.paraphrased_text;
      setParaphrasedContent(paraphrasedText);
      setLoadingParaphrasedContent(false);
    } catch (error) {
      console.error('Error fetching section content:', error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter search query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary btn-lg"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
            {loadingSections && <div className="text-center"><div className="spinner-border text-primary" role="status" style={{ width: '5rem', height: '5rem' }}></div></div>}
            {sections.length > 0 && (
              <div className="form-group">
                <select className="form-control form-control-lg" onChange={(e) => handleSectionSelect(e.target.value)}>
                  <option value="">Select a section</option>
                  {sections.map((section, index) => (
                    <option key={index} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedSection && (
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Content:</h5>
                {loadingContent ? <div className="text-center"><div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}></div></div> : <div className="card-text" style={{ paddingLeft: '10px' }}>{content}</div>}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Summarized Content:</h5>
                {loadingSummarizedContent ? <div className="text-center"><div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}></div></div> : <div className="card-text">{summarizedContent}</div>}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Paraphrased Content:</h5>
                {loadingParaphrasedContent ? <div className="text-center"><div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem' }}></div></div> : <div className="card-text" style={{ paddingRight: '10px' }}>{paraphrasedContent}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
