// import React, { createContext, useState, useEffect } from 'react';

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [email, setEmail] = useState(() => localStorage.getItem('email') || "");
//   const [headerFlag, setHeaderFlag] = useState(false);
//   const [hideButton, setHideButton] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);


  
//   const [notificationqueue, setnotificationqueue] = useState(() => {
//     try {
//       const savedQueue = localStorage.getItem('notificationqueue');
//       return savedQueue ? JSON.parse(savedQueue) : [];
//     } catch (err) {
//       console.warn('Error parsing notificationqueue from localStorage:', err);
//       return [];
//     }
//   });

//   useEffect(() => {
//     localStorage.setItem('notificationqueue', JSON.stringify(notificationqueue));
//   }, [notificationqueue]);

//   const clearAuth = () => setUser(null);

//   useEffect(() => {
//     if (email) {
//       localStorage.setItem('email', email);
//     } else {
//       localStorage.removeItem('email');
//     }
//   }, [email]);

//   return (
//     <AppContext.Provider
//       value={{
//         email,
//         setEmail,
//         headerFlag,
//         setHeaderFlag,
//         hideButton,
//         setHideButton,
//         currentUser,
//         setCurrentUser,
//         clearAuth,
//         user,
//         setUser,
//         notificationqueue,
//         setnotificationqueue,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Persisted: Email
  const [email, setEmail] = useState(() => localStorage.getItem('email') || "");

  // Persisted: User
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.warn('Error parsing user from localStorage:', err);
      return null;
    }
  });

  // Persisted: Current User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedCurrentUser = localStorage.getItem('currentUser');
      return savedCurrentUser ? JSON.parse(savedCurrentUser) : null;
    } catch (err) {
      console.warn('Error parsing currentUser from localStorage:', err);
      return null;
    }
  });

  // Persisted: Header Flag
  const [headerFlag, setHeaderFlag] = useState(() => {
    const saved = localStorage.getItem('headerFlag');
    return saved === 'true'; // convert string to boolean
  });

  // Persisted: Hide Button
  const [hideButton, setHideButton] = useState(() => {
    const saved = localStorage.getItem('hideButton');
    return saved !== 'false'; // default to true unless explicitly false
  });

  // Persisted: Notification Queue
  const [notificationqueue, setnotificationqueue] = useState(() => {
    try {
      const savedQueue = localStorage.getItem('notificationqueue');
      return savedQueue ? JSON.parse(savedQueue) : [];
    } catch (err) {
      console.warn('Error parsing notificationqueue from localStorage:', err);
      return [];
    }
  });

  // Persist email
  useEffect(() => {
    if (email) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }
  }, [email]);

  // Persist user
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Persist currentUser
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Persist headerFlag
  useEffect(() => {
    localStorage.setItem('headerFlag', headerFlag);
  }, [headerFlag]);

  // Persist hideButton
  useEffect(() => {
    localStorage.setItem('hideButton', hideButton);
  }, [hideButton]);

  // Persist notificationqueue
  useEffect(() => {
    localStorage.setItem('notificationqueue', JSON.stringify(notificationqueue));
  }, [notificationqueue]);

  // Clear user-related data
  const clearAuth = () => {
    setUser(null);
    setCurrentUser(null);
    setEmail("");
    setHeaderFlag(false);
    setHideButton(true);
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    localStorage.removeItem('headerFlag');
    localStorage.removeItem('hideButton');
  };

  return (
    <AppContext.Provider
      value={{
        email,
        setEmail,
        user,
        setUser,
        currentUser,
        setCurrentUser,
        headerFlag,
        setHeaderFlag,
        hideButton,
        setHideButton,
        notificationqueue,
        setnotificationqueue,
        clearAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

