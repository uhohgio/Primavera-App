import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showUploadFileForm, setShowUploadFileForm] = useState('');
  
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


  const handleUpload = async () => {
    // const file = e.target.files[0];

    if (!file || !file.name) return;

    const filePath = `${id}/${Date.now()}_${file.name}`;

    setUploading(true);
    try {
        //   const filename = `${Date.now()}-${file.name}`;
        // Upload file to Supabase storage
        const { error: uploadError } = await supabase.storage
            .from('tenant-files')
            .upload(filePath, file, {
                contentType: file.type
            });


        if (uploadError) throw uploadError;

        // get public URL
        const { data: publicUrlData } = supabase.storage
        .from('tenant-files')
        .getPublicUrl(filePath);

        const fileURL = publicUrlData?.publicUrl;
        //   const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/tenant-files/${fileName}`;
        const propertyId = parseInt(id, 10);
        const { error: insertError } = await supabase.from('file_attachments').insert({
            property_id: propertyId,
            name: file.name,
            url: fileURL,
            description,
            document_type: documentType,
        });

        if (insertError) throw insertError;

        // Refresh files
        await fetchFiles();
        setFile(null);
    } catch (err) {
        console.error('File upload error:', err);
        alert('Error uploading file. Please try again.');
    }

    setUploading(false);
    setDescription('');
    setDocumentType('');
    setShowUploadFileForm(false);

  };

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
                const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
                const matchesType = filterType ? f.document_type === filterType : true;
                return matchesSearch && matchesType; });
  return (
    
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }} id="property-details-container">
      <Link to="/" id="back-btn">&larr; Back to Properties</Link>
      <h2 id="property-details-title">Property Details</h2>
      {property ? (
        <>
          <p><strong>Address:</strong> {property.address}</p>
          <p><strong>Tenant:</strong> {property.tenant}</p>
          <p><strong>Rent:</strong> ${property.rent}</p>
          {/* <p><strong>Last Updated:</strong> {new Date(property.updated_at).toLocaleDateString()}</p>
          <p><strong>Created At:</strong> {new Date(property.created_at).toLocaleDateString()}</p> */}
          {/* <Link to={`/property/${id}/edit`} id="edit-property-btn">✏️ Edit Property</Link> */}
          <div id="property-details-uploaded-files-title"><h3>📂 Uploaded Files</h3><button onClick={()=>{setShowUploadFileForm(true)}}>Add File</button></div> 
          {showUploadFileForm && <section id="property-details-upload-file-section">
            <div id="property-details-upload-file-title"><h3>📂 Enter file information: </h3> </div>
            <div id= "property-details-file-form"> 
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              />

            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
              <option value="">Select Document Type</option>
              <option value="lease">Lease</option>
              <option value="id">ID</option>
              <option value="receipt">Receipt</option>
              <option value="other">Other</option>
            </select>

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
            <button onClick={() => setShowUploadFileForm(false)}>Cancel</button>
            </div>
          </section> }
          
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
            {/* {files.length === 0 && <p>No files uploaded yet.</p>} */}
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

