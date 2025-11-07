import { AlertTriangle } from "lucide-react";

export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
      <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="text-sm">{message}</p>
      </div>
    </div>
  )
}