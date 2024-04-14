type Props = {
  children: React.ReactNode;
}

const AuthLayout = ({ children, ...props }: Props) => {
  return (
    <div className="h-full flex items-center justify-center">
      {children}
    </div>
  )
}

export default AuthLayout