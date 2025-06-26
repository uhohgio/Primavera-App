import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import AddFileForm from './AddFileForm';
import AddFileFromTemplate from './AddFileFromTemplate';

export default function PropertyDetail({ user }) {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddFile, setShowAddFile] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showUploadFileForm, setShowUploadFileForm] = useState(false);
  
  const fetchFiles = useCallback(async () => {
    const { data, error } = await supabase
        .from('file_attachments')
        .select('*')
        .eq('property_id', id)
        .order('uploaded_at', { ascending: false });

    if (error) {
        console.error('Error fetching files:', error);
    } else {
        setFiles(data);
    }
  },[id]);
  useEffect(() => {
    const fetchData = async () => {
      const { data: prop, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('property_id', id)
        .single();

      if (propError) console.error('Error fetching property:', propError);
      else setProperty(prop);

      fetchFiles();
    };
    fetchData();
  }, [id, fetchFiles]);


  const handleDelete = async (file) => {
    if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) return;
    const extractPathFromUrl = (url) => {
        const parts = url.split('/public/tenant-files/');
        return parts[1]; // should return "9/filename.pdf"
    };
    

    const path = extractPathFromUrl(file.url);
    console.log('Deleting storage path:', path);
    const { error: storageError } = await supabase
        .storage
        .from('tenant-files')
        .remove(path ? [path] : []);


    if (storageError) {
        console.error('Storage delete error:', storageError);
        alert('Error deleting file from storage.');
        return;
    }

    const { error: dbError } = await supabase
        .from('file_attachments')
        .delete()
        .eq('id', file.id);

    if (dbError) {
        console.error('DB delete error:', dbError);
        alert('Error deleting file from database.');
    } else {
        fetchFiles();
    }
    };

    const filteredFiles = files.filter((f) => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType ? f.document_type === filterType : true;
      return matchesSearch && matchesType; 
    });
  return (
    
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }} id="property-details-container">
      <Link to="/" id="back-btn">&larr; Back to Properties</Link>
      <h2 id="property-details-title">Property Details</h2>
      {property ? (
        <>
          <p><strong>Address:</strong> {property.address}</p>
          <p><strong>Tenant:</strong> {property.tenant}</p>
          <p><strong>Rent:</strong> ${property.rent}</p>
          <div id="property-details-uploaded-files-title"><h3>📂 Uploaded Files</h3><button onClick={()=>{setShowAddFile(!showAddFile)}}>
            {!showAddFile ? 'Add File' : 'Close'}</button></div> 
          
          {showAddFile && <section id="property-details-add-file-section" style={{ display: 'grid', gridTemplateColumns: '2fr repeat(2,1fr)', gap: '10px' }} >
            <h3>Add a file</h3>
            <button onClick={() => {
              setShowTemplateForm(true);
              setShowAddFile(false);
              }}>
              Use Template
            </button>
            <button onClick={() => {
              setShowUploadFileForm(true);
              setShowAddFile(false);
          }}>
              Upload File
            </button>
          </section>
          }
          {showUploadFileForm && 
            <AddFileForm
              file={file}
              setFile={setFile}
              description={description}
              setDescription={setDescription}
              setShowUploadFileForm={setShowUploadFileForm}
              id={id}
              fetchFiles={fetchFiles}
              user={user}
            /> 
           }
           {showTemplateForm && 
           < AddFileFromTemplate 
            id={id}
            fetchFiles={fetchFiles}
            user={user}
            setShowTemplateForm={setShowTemplateForm}
            showTemplateForm={showTemplateForm}
           />
           }
          
          <div style={{ marginTop: '20px' }} id="property-details-file-search-filter">
            <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginRight: '10px' }}
            />

            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                <option value="lease">Lease</option>
                <option value="id">ID</option>
                <option value="receipt">Receipt</option>
                <option value="other">Other</option>
            </select>
          </div>

             
            <ul>
            {filteredFiles.length === 0 ? (
                <p>No matching files.</p>
            ) : (
                filteredFiles.map(f => (
                <li key={f.id} id ="property-details-file-item">
                    <a href={f.url} target="_blank" rel="noreferrer">{f.name}</a>
                    {f.document_type && <p><strong>Type:</strong> {f.document_type}</p>}
                    {f.description && <p><strong>Description:</strong> {f.description}</p>}
                    
                    <button onClick={() => handleDelete(f)}>🗑️ Delete</button>
                </li>
                ))
            )}
            </ul>
          
        </>
      ) : (
        <p>Loading property...</p>
      )}
    </div>
  );
}

