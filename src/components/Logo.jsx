import { SquareLibrary } from 'lucide-react'

export default function Logo({ size = "md", light = false }) {
  const sizes = {
    sm: { box: "w-8 h-8 rounded-lg", icon: "w-5 h-5", text: "text-lg" },
    md: { box: "w-10 h-10 rounded-xl", icon: "w-6 h-6", text: "text-xl" },
    lg: { box: "w-16 h-16 rounded-2xl", icon: "w-10 h-10", text: "text-3xl" }
  }
  
  const current = sizes[size] || sizes.md
  
  return (
    <div className="flex items-center gap-3">
      <div className={`${current.box} bg-gradient-to-br from-teal-400 to-teal-700 flex items-center justify-center shadow-lg`}>
        <SquareLibrary className={`${current.icon} text-white`} />
      </div>
      <span className={`${current.text} font-black tracking-tighter ${light ? 'text-white' : 'text-slate-900'}`}>
        Edu<span className="text-teal-500">Track</span>
      </span>
    </div>
  )
}
