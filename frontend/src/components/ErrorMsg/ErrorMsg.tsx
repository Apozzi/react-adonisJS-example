interface ErrorMsgProps {
  message: string;
}

export default function ErrorMsg({ message }: ErrorMsgProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  )
}
