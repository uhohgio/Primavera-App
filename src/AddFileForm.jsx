import { useState } from 'react';
import { supabase } from './supabaseClient';


function AddFileForm({ file, setFile, description, setDescription, setShowUploadFileForm, id, fetchFiles, user }) {
  
    const [documentType, setDocumentType] = useState('');
    const [uploading, setUploading] = useState(false);

      const handleUpload = async () => {
    
        if (!file || !file.name) return;
    
        const filePath = `${id}/${Date.now()}_${file.name}`;
    
        setUploading(true);
        try {
    
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
            const propertyId = parseInt(id, 10);
            const { error: insertError } = await supabase.from('file_attachments').insert({
                property_id: propertyId,
                name: file.name,
                url: fileURL,
                description,
                document_type: documentType,
                user_id: user.id,
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

  return (

    <section id="property-details-upload-file-section">
        <div id="property-details-upload-file-title"><h3>Enter file information: </h3> </div>
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
    </section>
  );
}



export default AddFileForm;
