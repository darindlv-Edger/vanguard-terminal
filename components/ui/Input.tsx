import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
    return (
        <div className="w-full space-y-1.5 group">
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-focus-within:text-[#00f0ff] transition-colors ml-1">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#00f0ff] transition-colors">
                        {icon}
                    </div>
                )}

                <input
                    className={twMerge(clsx(
                        "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-300",
                        "focus:border-[#00f0ff]/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] focus:bg-black/60",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        icon && "pl-10",
                        error && "border-[#ff003c] focus:border-[#ff003c] focus:shadow-[0_0_15px_rgba(255,0,60,0.1)]",
                        className
                    ))}
                    {...props}
                />

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-focus-within:border-[#00f0ff] transition-colors rounded-tr-lg pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-focus-within:border-[#00f0ff] transition-colors rounded-bl-lg pointer-events-none" />
            </div>

            {error && (
                <p className="text-[10px] text-[#ff003c] font-medium tracking-wide ml-1">{error}</p>
            )}
        </div>
    );
}
