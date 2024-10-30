import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function PasswordField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-luxtix-8">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          className="w-full border rounded-lg p-2 pr-10 focus:border-luxtix-5 focus:outline-none"
        />
        <span
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <AiFillEyeInvisible size={20} />
          ) : (
            <AiFillEye size={20} />
          )}
        </span>
      </div>
    </div>
  );
}

export default PasswordField;
