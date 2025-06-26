// import { useState } from 'react';
// import { supabase } from './supabaseClient';



// code for adding files from a template
export default function AddFileFromTemplate({ id, fetchFiles, user, setShowTemplateForm, showTemplateForm }) { 
    return (
            <div id="property-details-template-form">
              <h3>Use Template</h3>
              <p>Template feature coming soon.</p>
              <button onClick={() => setShowTemplateForm(false)}>Close</button>
            </div>
           );
}