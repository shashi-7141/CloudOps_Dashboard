import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth"

import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore"

import { auth, db } from "../firebase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            setRole(userSnap.data().role)
          } else {
            console.log("No role document found. Defaulting to user.")
            setRole("user")
          }
        } catch (error) {
          console.log("Firestore fetch error:", error)
          setRole("user")
        }
      } else {
        setRole(null)
      }

      setLoading(false)
    })

    return () => unsub()
  }, [])

  const register = async (email, password, displayName, selectedRole) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)

    await updateProfile(result.user, {
      displayName
    })

    await setDoc(doc(db, "users", result.user.uid), {
      email,
      displayName,
      role: selectedRole
    })

    return result
  }

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email)

  const isAdmin = role === "admin"

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        loading,
        register,
        login,
        logout,
        resetPassword
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}