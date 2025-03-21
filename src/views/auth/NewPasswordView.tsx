import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
    
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
    <h1 className="text-5xl font-black text-white">Reset your password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Fill up the form to {''}
        <span className=" text-fuchsia-500 font-bold"> change your password</span>
      </p>

      {!isValidToken ? 
      <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken} /> 
      : <NewPasswordForm token={token} />
      }

    
    </>
  )
}