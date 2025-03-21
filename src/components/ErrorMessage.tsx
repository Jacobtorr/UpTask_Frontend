

export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className="bg-red-100 text-center my-4 text-red-600 font-bold p-3 uppercase text-sm rounded-lg">{children}</div>
  )
}