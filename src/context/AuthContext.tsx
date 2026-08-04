import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  auth,
  isFirebaseConfigured,
  missingFirebaseVariables,
} from "../lib/firebase";

export interface AuthActionResult {
  success: boolean;
  message: string;
}

interface AuthContextValue {
  user: User | null;
  userEmail: string;
  userName: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  configurationMessage: string;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<AuthActionResult>;
  loginWithGoogle: () => Promise<AuthActionResult>;
  resetPassword: (email: string) => Promise<AuthActionResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof FirebaseError)) {
    return fallback;
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";
    case "auth/weak-password":
      return "Use a stronger password with at least 6 characters.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Authentication.";
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before login finished.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Allow popups and try again.";
    case "auth/cancelled-popup-request":
      return "Another sign-in popup is already open.";
    case "auth/account-exists-with-different-credential":
      return "This email already uses a different sign-in method. Use the original method first.";
    case "auth/unauthorized-domain":
      return "This website domain is not authorized in Firebase Authentication.";
    case "auth/invalid-api-key":
      return "The Firebase API key is invalid. Check your .env.local file.";
    default:
      return fallback;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const configurationMessage = isFirebaseConfigured
      ? ""
      : `Firebase is not configured. Missing: ${missingFirebaseVariables.join(", ")}.`;

    const prepareAuth = async () => {
      if (!auth) {
        throw new Error(configurationMessage);
      }
      await setPersistence(auth, browserLocalPersistence);
      return auth;
    };

    return {
      user,
      userEmail: user?.email ?? "",
      userName: user?.displayName ?? user?.email?.split("@")[0] ?? "",
      isAuthenticated: Boolean(user),
      isLoading,
      isConfigured: isFirebaseConfigured,
      configurationMessage,

      login: async (email, password) => {
        if (!auth) {
          return { success: false, message: configurationMessage };
        }
        if (!email.trim()) {
          return { success: false, message: "Enter your email address." };
        }
        if (!password) {
          return { success: false, message: "Enter your password." };
        }

        try {
          const firebaseAuth = await prepareAuth();
          await signInWithEmailAndPassword(
            firebaseAuth,
            email.trim().toLowerCase(),
            password,
          );
          return { success: true, message: "Login successful." };
        } catch (error) {
          return {
            success: false,
            message: getAuthErrorMessage(
              error,
              "Firebase could not sign you in. Check your details and try again.",
            ),
          };
        }
      },

      signUp: async (fullName, email, password) => {
        if (!auth) {
          return { success: false, message: configurationMessage };
        }
        if (!fullName.trim()) {
          return { success: false, message: "Enter your full name." };
        }
        if (!email.trim()) {
          return { success: false, message: "Enter your email address." };
        }
        if (password.length < 6) {
          return {
            success: false,
            message: "Your password must contain at least 6 characters.",
          };
        }

        try {
          const firebaseAuth = await prepareAuth();
          const credential = await createUserWithEmailAndPassword(
            firebaseAuth,
            email.trim().toLowerCase(),
            password,
          );
          await updateProfile(credential.user, {
            displayName: fullName.trim(),
          });
          setUser(credential.user);
          return { success: true, message: "Your account was created." };
        } catch (error) {
          return {
            success: false,
            message: getAuthErrorMessage(
              error,
              "Firebase could not create your account. Try again.",
            ),
          };
        }
      },

      loginWithGoogle: async () => {
        if (!auth) {
          return { success: false, message: configurationMessage };
        }

        try {
          const firebaseAuth = await prepareAuth();
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });
          await signInWithPopup(firebaseAuth, provider);
          return { success: true, message: "Google sign-in successful." };
        } catch (error) {
          return {
            success: false,
            message: getAuthErrorMessage(
              error,
              "Google sign-in failed. Try again.",
            ),
          };
        }
      },

      resetPassword: async (email) => {
        if (!auth) {
          return { success: false, message: configurationMessage };
        }
        if (!email.trim()) {
          return { success: false, message: "Enter your email address." };
        }

        try {
          await sendPasswordResetEmail(auth, email.trim().toLowerCase());
          return {
            success: true,
            message:
              "Password-reset instructions were sent. Check your inbox and spam folder.",
          };
        } catch (error) {
          return {
            success: false,
            message: getAuthErrorMessage(
              error,
              "Firebase could not send the password-reset email. Try again.",
            ),
          };
        }
      },

      logout: async () => {
        if (!auth) return;
        await signOut(auth);
      },
    };
  }, [isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
