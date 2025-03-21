import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "@/api/AuthAPI";

export default function LoginView() {

  const navigate = useNavigate()

  const initialValues: UserLoginForm = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const { mutate } = useMutation({
    mutationFn: login,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      navigate('/')

    }
  })

  const handleLogin = (formData: UserLoginForm) => mutate(formData)

  return (
    <>
    <h1 className="text-5xl font-black text-white">Login</h1>
      <p className="text-2xl font-light text-white mt-5">
        Fill up the form to {''}
        <span className=" text-fuchsia-500 font-bold">login</span>
      </p>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10  bg-white mt-10 rounded-lg"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="E-mail"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("email", {
              required: "E-mail is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid E-mail",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Password</label>

          <input
            type="password"
            placeholder="Your password"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Login'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black text-xl cursor-pointer rounded-lg transition-all"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/register'
          className="text-center text-gray-300 font-normal hover:text-gray-400"
        >
          Don't you have an account yet? Register
        </Link>

        <Link
          to='/auth/forgot-password'
          className="text-center text-gray-300 font-normal hover:text-gray-400"
        >
          Forgot your password? Click here
        </Link>

      </nav>
    </>
  )
}