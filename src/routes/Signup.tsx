import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [displayMode, setDisplayMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const HOST = import.meta.env.VITE_REACT_API_URL;

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (email == "" || password == "" || userName == "") {
        throw new Error("All fields are required.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords don't match.");
      }
      const response = await fetch(`${HOST}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username: userName }),
      });
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message);
      }
      const data = await response.json();
      setSuccessMessage(data.message);
      setUserName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col mx-0 justify-center ${
        displayMode ? "bg-darkmode-black" : "bg-gray-200"
      }`}
    >
      <div className="flex flex-col w-11/12 max-w-lg justify-center items-center self-center z-10">
        <div
          className={`px-3 py-5 md:px-10 ${
            displayMode ? "bg-darkmode-gray" : "bg-white"
          } mx-auto rounded-xl w-full`}
        >
          <div className="flex justify-center">
            <img src="/finallogo.svg" alt="Macrobourse Logo" width={320} />
          </div>
          <p
            className={`text-3xl md:text-5xl text-center ${
              displayMode ? "text-white" : "text-black"
            }`}
          >
            Macrobourse
          </p>
          <div className="mb-4 mt-10">
            <p
              className={`text-xl text-center ${
                displayMode ? "text-white" : "text-black"
              }`}
            >
              Registration
            </p>
          </div>
          <form onSubmit={handleSignup}>
            <div className="space-y-3">
              <div>
                <input
                  className={`w-full text-base px-4 py-2  rounded-lg focus:outline-none focus:border-green-400 ${
                    displayMode ? "bg-darkmode-input" : "bg-gray-200"
                  }`}
                  type=""
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <input
                  className={`w-full text-base px-4 py-2 rounded-lg focus:outline-none focus:border-green-400 ${
                    displayMode ? "bg-darkmode-input" : "bg-gray-200"
                  }`}
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  className={`w-full text-base px-4 py-2 rounded-lg focus:outline-none focus:border-green-400 ${
                    displayMode ? "bg-darkmode-input" : "bg-gray-200"
                  }`}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  className={`w-full text-base px-4 py-2 rounded-lg focus:outline-none focus:border-green-400 ${
                    displayMode ? "bg-darkmode-input" : "bg-gray-200"
                  }`}
                  type="password"
                  placeholder="confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && (
                <div className="text-red-500 font-bold text-sm text-center">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="text-green-500 font-bold text-sm text-center">
                  {successMessage}
                </div>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full flex justify-center bg-signup-blue hover:bg-blue-900 text-white text-black-100 p-2  rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-200"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    "Register"
                  )}
                </button>
                <p
                  className={`mt-8 text-center text-sm ${
                    displayMode ? "text-white" : "text-black"
                  }`}
                >
                  Already have an account? Sign in
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="mt-2 w-full flex justify-center bg-login-green text-black  hover:bg-green-600 text-black-100 p-2  rounded-lg tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-200"
                >
                  Sign in
                </button>
                <div className="label flex flex-row justify-end gap-x-3 mt-5">
                  <span
                    className={`label-text ${
                      displayMode ? "text-white" : "text-black"
                    }`}
                  >
                    {displayMode ? "Dark mode" : "Light mode"}
                  </span>

                  <input
                    type="checkbox"
                    className={`toggle ${
                      displayMode
                        ? "bg-login-green [--tglbg:#222429] hover:bg-login-green border-none"
                        : "bg-signup-blue [--tglbg:#E5E7EB] hover:bg-signup-blue border-none"
                    }`}
                    onChange={() => {
                      setDisplayMode((prev) => !prev);
                    }}
                    checked={displayMode}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center self-center z-10">
        <p className={`mt-2 ${displayMode ? "text-white" : "text-black"}`}>
          FIND Macrobourse
        </p>
        <div className="flex gap-x-1 mt-2">
          <FaXTwitter
            style={{
              color: displayMode ? "#4AEFAA" : "#3D4AE4",
              fontSize: "24px",
            }}
          />
          <FaFacebookF
            style={{
              color: displayMode ? "#4AEFAA" : "#3D4AE4",
              fontSize: "24px",
            }}
          />
          <FaLinkedin
            style={{
              color: displayMode ? "#4AEFAA" : "#3D4AE4",
              fontSize: "24px",
            }}
          />
          <FaYoutube
            style={{
              color: displayMode ? "#4AEFAA" : "#3D4AE4",
              fontSize: "24px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
