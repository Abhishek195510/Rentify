import React, { createContext, useState } from 'react'
export const AuthDataContext = createContext()
function AuthContext({children}) {
    const serverUrl = "http://localhost:8000"

    let [loading,setLoading]=useState(false)

    let value={
        serverUrl,
        loading,setLoading
    }
  return (
    <div>
     <AuthDataContext.Provider value={value}>
        {children}
     </AuthDataContext.Provider>
    </div>
  )
}

export default AuthContext
