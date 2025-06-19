import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PropertyDetail from './PropertyDetail';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import LoginPage from './Login';

function Main(){
  const [user, setUser] = useState(null);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  
    return () => {
      listener?.subscription.unsubscribe();
    };

  }, []);

    if (!user) {
      // return <div>Loading or not logged in</div>;
      return <LoginPage />; // Show login page if user is not authenticated
    }

  return (
    <Router >
      <Routes>
        <Route path="/" element={<App user={user}/>}/>
        <Route path="/property/:id" element={<PropertyDetail user={user}/>}/>
      </Routes>
    </Router>
  );
}


// function Main() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<App />} />
//         <Route path="/property/:id" element={<PropertyDetail />} />
//       </Routes>
//     </Router>
//   );
// }

export default Main;
